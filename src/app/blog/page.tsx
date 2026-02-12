import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ブログ記事一覧 | MisePo (ミセポ)',
    description: '店舗集客やSNS運用のコツ、MisePoの活用方法などを発信しています。',
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
            <Link
                href="/"
                className="inline-flex items-center text-[#2b2b2f]/40 hover:text-blue-600 font-bold text-sm mb-12 transition-colors group"
            >
                <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                BACK TO HOME
            </Link>

            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-[#2b2b2f] mb-4 font-montserrat tracking-tight">
                    BLOG
                </h1>
                <p className="text-[#2b2b2f]/60 max-w-2xl mx-auto font-medium">
                    店舗運営に役立つSNS活用術や、MisePoの最新情報をお届けします。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full"
                    >
                        {post.image && (
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        )}
                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-xs font-bold rounded-full">
                                    {post.category}
                                </span>
                                <span className="text-[#2b2b2f]/40 text-xs font-medium">
                                    {post.date}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-[#2b2b2f] mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-[#2b2b2f]/60 text-sm line-clamp-3 mb-6 flex-grow">
                                {post.description}
                            </p>
                            <div className="flex items-center text-blue-600 font-bold text-sm">
                                READ MORE
                                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-20 bg-white/20 backdrop-blur-md rounded-3xl border border-white/20">
                    <p className="text-[#2b2b2f]/40 font-medium">現在、記事を準備中です。お楽しみに！</p>
                </div>
            )}
        </div>
    );
}
