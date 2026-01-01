import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import NewsContent from "./news-content";
import { Metadata } from "next";

interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  category: string;
  tags: string[];
  published_at: string;
  views: number;
  profiles?: { full_name: string };
}

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("news_posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!post) {
    return {
      title: "News Article Not Found",
    };
  }

  return {
    title: `${post.title} | Infinite Rig Services`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : [],
      type: "article",
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const supabase = await createClient();

  // Fetch Post
  const { data: post } = await supabase
    .from("news_posts")
    .select(`*, profiles:author_id (full_name)`)
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!post) {
    notFound();
  }

  // Fetch Related Posts
  const { data: related } = await supabase
    .from("news_posts")
    .select(`*, profiles:author_id (full_name)`)
    .eq("status", "published")
    .eq("category", post.category)
    .neq("id", post.id)
    .limit(3);

  return <NewsContent post={post} relatedPosts={related || []} />;
}
