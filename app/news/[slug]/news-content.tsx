"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
    Calendar,
    User,
    Tag,
    ArrowLeft,
    Facebook,
    Twitter, // Keep generic for now or replace with X
    Linkedin,
    Link as LinkIcon,
    Eye,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

interface NewsContentProps {
    post: NewsPost;
    relatedPosts: NewsPost[];
}

export default function NewsContent({ post, relatedPosts }: NewsContentProps) {
    const supabase = createClient();

    useEffect(() => {
        // Increment views on mount
        const incrementViews = async () => {
            await supabase
                .from("news_posts")
                .update({ views: (post.views || 0) + 1 })
                .eq("id", post.id);
        };
        incrementViews();
    }, [post.id]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16">
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-600 to-charcoal"></div>
                {post.featured_image_url && (
                    <div className="absolute inset-0 opacity-20">
                        <img
                            src={post.featured_image_url}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-white"
                    >
                        <Link
                            href="/news"
                            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white mb-6"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to News</span>
                        </Link>

                        {post.category && (
                            <span className="inline-block px-4 py-1.5 bg-primary rounded-full text-sm font-medium mb-6">
                                {post.category}
                            </span>
                        )}

                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-300">
                            <span className="flex items-center space-x-2">
                                <User className="h-5 w-5" />
                                <span>{post.profiles?.full_name || "Infinite Rig Services"}</span>
                            </span>
                            <span className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5" />
                                <span>{formatDate(post.published_at)}</span>
                            </span>
                            <span className="flex items-center space-x-2">
                                <Eye className="h-5 w-5" />
                                <span>{(post.views || 0) + 1} views</span>
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Article Content */}
                            <article className="lg:col-span-8">
                                {post.featured_image_url && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-8 -mt-24 relative z-20"
                                    >
                                        <img
                                            src={post.featured_image_url}
                                            alt={post.title}
                                            className="w-full h-auto rounded-2xl shadow-2xl"
                                        />
                                    </motion.div>
                                )}

                                {post.excerpt && (
                                    <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
                                        {post.excerpt}
                                    </p>
                                )}

                                <div className="prose prose-lg max-w-none">
                                    {post.content?.split("\n").map((paragraph, i) =>
                                        paragraph.trim() ? (
                                            <p key={i} className="text-gray-700 leading-relaxed mb-4">
                                                {paragraph}
                                            </p>
                                        ) : null
                                    )}
                                </div>

                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <Tag className="h-5 w-5 text-gray-400" />
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </article>

                            {/* Sidebar */}
                            <aside className="lg:col-span-4">
                                <div className="sticky top-32 space-y-6">
                                    {/* Share */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4">Share</h3>
                                        <div className="flex items-center space-x-3">
                                            <a
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                                            >
                                                <Facebook className="h-5 w-5" />
                                            </a>
                                            <a
                                                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors"
                                            >
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                            <a
                                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${post.title}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                            <button
                                                onClick={copyLink}
                                                className="w-10 h-10 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                                            >
                                                <LinkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Related Posts */}
                                    {relatedPosts.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h3 className="font-semibold text-gray-900 mb-4">
                                                Related Articles
                                            </h3>
                                            <div className="space-y-4">
                                                {relatedPosts.map((related) => (
                                                    <Link
                                                        key={related.id}
                                                        href={`/news/${related.slug}`}
                                                        className="block group"
                                                    >
                                                        <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                                            {related.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {formatDate(related.published_at)}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
