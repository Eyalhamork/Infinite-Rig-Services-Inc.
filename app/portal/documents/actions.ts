"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Initialize Admin Client for bypassing RLS
const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getSharedDocuments() {
    const cookieStore = cookies();

    // 1. Authenticate User (Standard Client)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Not authenticated");
    }

    // 2. Get Client ID
    const { data: client } = await adminSupabase
        .from("clients")
        .select("id")
        .eq("primary_contact_id", user.id)
        .single();

    if (!client) {
        return [];
    }

    // 3. Fetch Direct Shares (Using Admin Client to bypass potential RLS issues)
    const { data: directShares, error: directError } = await adminSupabase
        .from("client_document_shares")
        .select(`
      id,
      note,
      granted_at,
      internal_doc:internal_documents(
        id, title, description, storage_path, file_type, file_size, category, created_at
      )
    `)
        .eq("client_id", client.id);

    if (directError) {
        console.error("Error fetching direct shares:", directError);
        return [];
    }

    // 4. Fetch Project Shares
    const { data: projectShares, error: projectError } = await adminSupabase
        .from("project_vault_access")
        .select(`
      id,
      granted_at,
      project:projects(id, project_name),
      internal_doc:internal_documents(
        id, title, description, storage_path, file_type, file_size, category, created_at
      )
    `)
        .in("project_id", (
            await adminSupabase
                .from("projects")
                .select("id")
                .eq("client_id", client.id)
        ).data?.map(p => p.id) || []);

    if (projectError) {
        console.error("Error fetching project shares:", projectError);
        return [];
    }

    // 5. Combine and Format
    const formattedDocs: any[] = [];

    // Process Direct Shares
    (directShares || []).forEach((share: any) => {
        if (share.internal_doc) {
            formattedDocs.push({
                id: share.internal_doc.id,
                title: share.internal_doc.title,
                description: share.internal_doc.description,
                storage_path: share.internal_doc.storage_path,
                file_type: share.internal_doc.file_type,
                file_size: share.internal_doc.file_size,
                category: share.internal_doc.category,
                created_at: share.internal_doc.created_at,
                share_note: share.note,
                share_date: share.granted_at,
                source: "direct",
            });
        }
    });

    // Process Project Shares
    (projectShares || []).forEach((share: any) => {
        if (share.internal_doc) {
            // Avoid duplicates
            if (!formattedDocs.find(d => d.id === share.internal_doc.id)) {
                formattedDocs.push({
                    id: share.internal_doc.id,
                    title: share.internal_doc.title,
                    description: share.internal_doc.description,
                    storage_path: share.internal_doc.storage_path,
                    file_type: share.internal_doc.file_type,
                    file_size: share.internal_doc.file_size,
                    category: share.internal_doc.category,
                    created_at: share.internal_doc.created_at,
                    share_date: share.granted_at,
                    source: "project",
                    project_name: share.project?.project_name,
                });
            }
        }
    });

    // Sort
    formattedDocs.sort((a, b) =>
        new Date(b.share_date || b.created_at).getTime() -
        new Date(a.share_date || a.created_at).getTime()
    );

    return formattedDocs;
}

export async function getDocumentUrl(storagePath: string) {
    // Generate signed URL using Admin Client (bypassing storage RLS)
    const { data, error } = await adminSupabase.storage
        .from("vault")
        .createSignedUrl(storagePath, 300); // 5 minutes

    if (error) {
        throw new Error(error.message);
    }

    return data.signedUrl;
}
