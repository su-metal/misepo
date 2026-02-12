import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | MisePo (ミセポ) Blog`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            images: post.image ? [{ url: post.image }] : [],
            type: 'article',
            publishedTime: post.date,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            images: post.image ? [post.image] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "image": post.image ? [`https://misepo.jp${post.image}`] : [],
        "datePublished": post.date,
        "author": {
            "@type": "Organization",
            "name": "MisePo"
        }
    };

    return (
        <article className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="flex items-center gap-6 mb-12">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-[#2b2b2f]/40 hover:text-blue-600 font-bold text-sm transition-colors group"
                >
                    <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    BACK TO BLOG
                </Link>
                <span className="text-[#2b2b2f]/10 text-sm font-black">•</span>
                <Link
                    href="/"
                    className="text-[#2b2b2f]/40 hover:text-blue-600 font-bold text-sm transition-colors"
                >
                    HOME
                </Link>
            </div>

            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-600 text-sm font-bold rounded-full">
                        {post.category}
                    </span>
                    <time className="text-[#2b2b2f]/40 text-sm font-medium">
                        {post.date}
                    </time>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-[#2b2b2f] leading-tight mb-8 tracking-tight">
                    {post.title}
                </h1>

                {post.image && (
                    <div className="rounded-[2.5rem] overflow-hidden border border-white/40 shadow-2xl mb-12 aspect-[21/9]">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>

            <div className="prose prose-lg prose-slate max-w-none prose-headings:text-[#2b2b2f] prose-headings:font-black prose-p:text-[#2b2b2f]/70 prose-a:text-blue-600 prose-strong:text-[#2b2b2f]">
                <div
                    className="blog-rich-text"
                    dangerouslySetInnerHTML={{
                        __html: post.content
                            .replace(/^■ (.*)/gm, '<h2 class="text-3xl font-black mt-12 mb-6">$1</h2>')
                            .replace(/## (.*)/g, '<h2 class="text-3xl font-black mt-12 mb-6">$1</h2>')
                            .replace(/### (.*)/g, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>')
                            .replace(/\*\*(.*)\*\*/g, '<strong class="font-bold">$1</strong>')
                            .replace(/- (.*)/g, '<li class="ml-6 list-disc">$1</li>')
                            .split('\n\n')
                            .map(p => p.startsWith('<') ? p : `<p class="leading-relaxed whitespace-pre-wrap">${p}</p>`)
                            .join('')
                    }}
                />
            </div>

            <div className="mt-20 pt-10 border-t border-[#2b2b2f]/5">
                <div className="bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-3xl p-8 border border-white/40">
                    <h3 className="text-xl font-bold text-[#2b2b2f] mb-2">MisePoでSNS運用をもっと身近に</h3>
                    <p className="text-[#2b2b2f]/60 mb-6 font-medium">
                        AIがあなたのお店専属の広報担当になります。まずは無料で試してみませんか？
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                    >
                        MisePoを無料で始める
                    </Link>
                </div>
            </div>
        </article >
    );
}
