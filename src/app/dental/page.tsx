import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '歯科・クリニックのSNS投稿＆Google口コミ返信をAI自動作成 | MisePo（ミセポ）',
  description: '歯科・クリニック向けSNS運用AIツール。患者向けインスタ投稿・Googleマップ口コミ返信をメモ一行から10秒で自動生成。クリニックのMEO対策・SNS集患をAIで効率化。7日間無料。',
  keywords: ['歯科 SNS 集患', 'クリニック 口コミ 返信', '歯科医院 インスタグラム 投稿', 'Google口コミ 返信 歯科', 'クリニック MEO対策', '歯科 SNS 運用'],
  alternates: {
    canonical: 'https://www.misepo.jp/dental',
  },
  openGraph: {
    title: '歯科・クリニックのSNS投稿＆Google口コミ返信をAI自動作成 | MisePo',
    description: '歯科・クリニック向けSNS運用AIツール。患者向け投稿・口コミ返信をメモ一行から10秒で自動生成。',
    url: 'https://www.misepo.jp/dental',
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function DentalPage() {
  return (
    <main className="min-h-screen bg-[#f0eae4] font-sans">
      {/* ナビ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-[#1823ff] tracking-tight">MisePo</Link>
          <Link
            href="/start"
            className="px-6 py-3 bg-[#1823ff] text-white font-black rounded-full text-sm hover:opacity-90 transition-opacity"
          >
            7日間無料で試す
          </Link>
        </div>
      </nav>

      {/* ヒーロー */}
      <section className="py-24 md:py-40 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block text-[11px] font-black text-[#1823ff] uppercase tracking-[0.2em] px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10 mb-8">
            歯科・クリニック向け専用
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-[#282d32] mb-8">
            歯科・クリニックの<br />
            SNS投稿と口コミ返信を<br />
            <span className="text-[#1823ff]">10秒で自動作成</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-slate-500 leading-tight mb-12 max-w-2xl">
            患者向けの予防歯科情報・スタッフ紹介・Google口コミ返信。<br />
            専門的な内容もAIが医療機関らしい丁寧な文章で生成。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/start"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#1823ff] text-white font-black rounded-full shadow-lg hover:opacity-90 transition-opacity text-lg"
            >
              ✨ 7日間無料で試す
            </Link>
            <Link
              href="/#demo"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#282d32] font-black rounded-full border border-slate-200 hover:border-[#1823ff]/30 transition-colors text-lg"
            >
              デモを見る
            </Link>
          </div>
          <p className="text-sm text-slate-400 font-bold mt-4">クレジットカード不要 · いつでもキャンセル可能</p>
        </div>
      </section>

      {/* 課題セクション */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-[#282d32] tracking-tighter mb-4">
            歯科・クリニックのSNS運用の悩み
          </h2>
          <p className="text-lg text-slate-400 font-bold mb-12">こんなことで困っていませんか？</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                no: '01',
                title: '医療機関らしい文章を\n書くのが難しい',
                desc: '親しみやすさと専門性のバランスが難しく、SNS投稿に何時間もかかってしまう。',
              },
              {
                no: '02',
                title: 'Google口コミへの返信が\n形式的になってしまう',
                desc: '「ありがとうございます」だけの返信では、Googleの評価も上がらず、患者への印象も薄い。',
              },
              {
                no: '03',
                title: '予防歯科の情報発信を\n続けられない',
                desc: '「虫歯予防」「歯周病」などの有益な情報を定期発信したいが、毎回ネタを考えるのが大変。',
              },
              {
                no: '04',
                title: '新患獲得のための\nSNS活用が分からない',
                desc: 'インスタグラムを始めたいが、歯科・クリニックとして何を投稿すべきか分からない。',
              },
            ].map((p) => (
              <div key={p.no} className="bg-[#f8f8fc] rounded-3xl p-8 border border-slate-100">
                <div className="text-[10px] font-black text-slate-300 mb-4 uppercase tracking-widest">Case {p.no}</div>
                <h3 className="text-2xl font-black text-[#282d32] mb-4 leading-tight whitespace-pre-line">{p.title}</h3>
                <p className="text-base font-bold text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 解決策セクション */}
      <section className="py-20 bg-[#1823ff] text-white px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-6">
            MisePoで、<br />
            すべて解決できます
          </h2>
          <p className="text-xl font-bold text-white/75 mb-16 max-w-xl">
            クリニックに特化したAIが、専門的でありながら患者に寄り添った文章を生成します。
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🦷',
                title: '医療機関らしい投稿を即生成',
                desc: '「今日は小児歯科の予防処置が多かった」→ 親御さんに向けた親しみやすい投稿文を生成。',
              },
              {
                icon: '⭐',
                title: '口コミ返信でMEO対策',
                desc: '患者さんからの口コミへの返信文を自動生成。継続的な返信でGoogleマップの検索順位アップ。',
              },
              {
                icon: '📋',
                title: '健康情報コンテンツを簡単作成',
                desc: '「今月のテーマは歯周病予防」など、患者教育に役立つ情報発信コンテンツもAIが文章化。',
              },
            ].map((f) => (
              <div key={f.title} className="bg-white/10 rounded-3xl p-8 border border-white/10">
                <div className="text-4xl mb-6">{f.icon}</div>
                <h3 className="text-xl font-black mb-4 leading-tight">{f.title}</h3>
                <p className="text-white/70 font-bold leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-[#282d32] tracking-tighter mb-12">
            実際の生成例（歯科・クリニック）
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* インスタ投稿例 */}
            <div className="border border-slate-200 rounded-3xl overflow-hidden">
              <div className="bg-[#f8f8fc] px-6 py-4 border-b border-slate-100">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">入力（メモ一行）</span>
              </div>
              <div className="px-6 py-5 font-bold text-slate-600">
                「今日は小学生の患者さんが初めてのクリーニング。最初は緊張していたがよく頑張ってくれた。」
              </div>
              <div className="bg-[#1823ff]/5 px-6 py-4 border-t border-[#1823ff]/10">
                <span className="text-xs font-black text-[#1823ff] uppercase tracking-widest">MisePo生成</span>
              </div>
              <div className="px-6 py-5 space-y-3">
                <p className="font-bold text-[#282d32] leading-relaxed">
                  🦷 今日も頑張ってくれました！<br /><br />
                  初めてのクリーニングに少し緊張気味だったお子さんも、終わる頃には笑顔になってくれました😊<br /><br />
                  歯のクリーニングは虫歯・歯周病予防の第一歩。<br />
                  「歯医者は怖くない」と思ってもらえるよう、私たちも工夫しています。<br />
                  お子さんの定期検診、ぜひお気軽にご相談ください。
                </p>
                <p className="text-[#1823ff] text-sm font-bold">
                  #小児歯科 #予防歯科 #歯のクリーニング #[地域名]歯科 #歯医者さん
                </p>
              </div>
            </div>
            {/* 口コミ返信例 */}
            <div className="border border-slate-200 rounded-3xl overflow-hidden">
              <div className="bg-[#f0fff0] px-6 py-4 border-b border-slate-100">
                <span className="text-xs font-black text-green-500 uppercase tracking-widest">受け取った★5口コミ</span>
              </div>
              <div className="px-6 py-5 font-bold text-slate-600">
                「先生もスタッフの方も丁寧で、歯医者が苦手な私でも安心して通えています。」
              </div>
              <div className="bg-[#1823ff]/5 px-6 py-4 border-t border-[#1823ff]/10">
                <span className="text-xs font-black text-[#1823ff] uppercase tracking-widest">MisePo生成返信</span>
              </div>
              <div className="px-6 py-5">
                <p className="font-bold text-[#282d32] leading-relaxed text-sm">
                  温かいお言葉をいただきありがとうございます。歯医者が苦手な方にも「安心して通えるクリニック」でありたいと、スタッフ一同心がけております。そのように感じていただけたこと、大変嬉しく思います。お口の健康を末永くサポートできるよう、これからもどうぞよろしくお願いいたします。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="py-20 bg-[#f0eae4] px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-[#282d32] tracking-tighter mb-4">
            歯科・クリニック向けSNS運用ツールの料金プラン
          </h2>
          <p className="text-lg text-slate-400 font-bold mb-12">月額980円から。SNS運用代行の1/50のコストで始められます。</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'エントリー', price: '¥980', count: '50回 / 月', badge: null },
              { name: 'スタンダード', price: '¥1,980', count: '150回 / 月', badge: '人気No.1' },
              { name: 'プロフェッショナル', price: '¥2,980', count: '300回 / 月', badge: null },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 relative ${plan.badge ? 'bg-[#1823ff] text-white shadow-xl shadow-[#1823ff]/20' : 'bg-white border border-slate-100'}`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-[#1823ff] text-xs font-black rounded-full">
                    {plan.badge}
                  </span>
                )}
                <h3 className={`text-xl font-black mb-2 ${plan.badge ? 'text-white' : 'text-[#282d32]'}`}>{plan.name}</h3>
                <div className={`text-4xl font-black mb-1 ${plan.badge ? 'text-white' : 'text-[#282d32]'}`}>{plan.price}</div>
                <div className={`text-sm font-bold mb-6 ${plan.badge ? 'text-white/70' : 'text-slate-400'}`}>{plan.count}</div>
                <Link
                  href="/start"
                  className={`block text-center py-3 rounded-full font-black text-sm transition-opacity hover:opacity-90 ${plan.badge ? 'bg-white text-[#1823ff]' : 'bg-[#1823ff] text-white'}`}
                >
                  7日間無料で試す
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#1823ff] text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
            クリニックのSNS運用を、<br />今日からAIに任せてみませんか？
          </h2>
          <p className="text-xl font-bold text-white/70 mb-10">
            7日間無料。クレジットカード不要。いつでもキャンセル可能。
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-3 px-12 py-6 bg-white text-[#1823ff] font-black rounded-full shadow-xl text-xl hover:opacity-90 transition-opacity"
          >
            ✨ 無料で始める
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-[#282d32] text-white/50 py-8 px-6 text-center text-sm font-bold">
        <p>© 2026 MisePo（ミセポ）. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link href="/terms" className="hover:text-white transition-colors">利用規約</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
          <Link href="/" className="hover:text-white transition-colors">トップページ</Link>
        </div>
      </footer>
    </main>
  );
}
