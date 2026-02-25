import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '美容院・美容室のSNS投稿＆Google口コミ返信をAI自動作成 | MisePo（ミセポ）',
  description: '美容院・美容室オーナー向けSNS運用AIツール。インスタグラム投稿文・Googleマップ口コミ返信をメモ一行から10秒で生成。指名客増加・新規集客をAIで効率化。7日間無料。',
  keywords: ['美容院 インスタ 投稿 例文', '美容室 口コミ 返信', '美容院 SNS 集客', '美容室 インスタグラム 運用', 'Google口コミ 返信 美容院', 'MEO対策 美容室'],
  alternates: {
    canonical: 'https://www.misepo.jp/beauty',
  },
  openGraph: {
    title: '美容院・美容室のSNS投稿＆Google口コミ返信をAI自動作成 | MisePo',
    description: '美容院・美容室オーナー向けSNS運用AIツール。インスタ投稿・口コミ返信をメモ一行から10秒で自動生成。',
    url: 'https://www.misepo.jp/beauty',
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function BeautyPage() {
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
            美容院・美容室向け専用
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-[#282d32] mb-8">
            美容院・美容室の<br />
            SNS投稿と口コミ返信を<br />
            <span className="text-[#1823ff]">10秒で自動作成</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-slate-500 leading-tight mb-12 max-w-2xl">
            インスタグラムの投稿文・ハッシュタグ、Googleマップの口コミ返信。<br />
            施術後の一言メモを入力するだけで、AIがお店らしい文章を即生成。
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
            美容院オーナーの「あるある」な悩み
          </h2>
          <p className="text-lg text-slate-400 font-bold mb-12">こんなことで時間を取られていませんか？</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                no: '01',
                title: '施術後のインスタ投稿に\n毎回30分以上かかる',
                desc: 'ヘアカラーやカットの写真は撮れても、キャプション・ハッシュタグを考える時間がない。',
              },
              {
                no: '02',
                title: '★3以下のGoogle口コミへの\n返信が怖くて後回しに',
                desc: '「何と返せばいいか分からない」「下手に返事して炎上したくない」と悩んでいる。',
              },
              {
                no: '03',
                title: 'スタッフが投稿すると\nトーンがバラバラになる',
                desc: '任せたいが、文体・語調が統一されず「お店らしさ」が失われてしまう。',
              },
              {
                no: '04',
                title: '投稿を続けているのに\nフォロワーが増えない',
                desc: 'ハッシュタグの選び方が分からず、新規のお客様にリーチできていない。',
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
            美容院に特化したAIが、あなたのお店の「個性」を学習して文章を生成します。
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '📸',
                title: 'インスタ投稿を10秒で生成',
                desc: '「今日はナチュラルブラウンのハイライトを施術した」→ キャプション＋ハッシュタグを即生成。',
              },
              {
                icon: '⭐',
                title: '口コミ返信で炎上を防ぐ',
                desc: '★1〜2の低評価口コミも、誠実で温かみのある返信文をAIが自動生成。MEO対策にも効果的。',
              },
              {
                icon: '✂️',
                title: 'お店の個性を学習',
                desc: '「親しみやすい」「プロフェッショナル」など、あなた独自のペルソナを設定して文体を統一。',
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
            実際の生成例（美容院）
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* インスタ投稿例 */}
            <div className="border border-slate-200 rounded-3xl overflow-hidden">
              <div className="bg-[#f8f8fc] px-6 py-4 border-b border-slate-100">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">入力（メモ一行）</span>
              </div>
              <div className="px-6 py-5 font-bold text-slate-600">
                「今日はお客様にナチュラルブラウンのハイライトカラーを施術。すごく喜んでくれた。」
              </div>
              <div className="bg-[#1823ff]/5 px-6 py-4 border-t border-[#1823ff]/10">
                <span className="text-xs font-black text-[#1823ff] uppercase tracking-widest">MisePo生成</span>
              </div>
              <div className="px-6 py-5 space-y-3">
                <p className="font-bold text-[#282d32] leading-relaxed">
                  ✨ ナチュラルブラウンのハイライト、完成です！<br /><br />
                  柔らかい光と影で、自然な立体感が生まれました🌿<br />
                  「こんなに変わるとは思わなかった！」と喜んでいただけてとっても嬉しいです☺️<br /><br />
                  毎日のスタイリングがもっと楽しくなりますように。<br />
                  ありがとうございました！
                </p>
                <p className="text-[#1823ff] text-sm font-bold">
                  #ハイライトカラー #ナチュラルブラウン #ヘアカラー #透明感カラー #[地域名]美容室
                </p>
              </div>
            </div>
            {/* 口コミ返信例 */}
            <div className="border border-slate-200 rounded-3xl overflow-hidden">
              <div className="bg-[#fff0f0] px-6 py-4 border-b border-slate-100">
                <span className="text-xs font-black text-red-400 uppercase tracking-widest">受け取った★2口コミ</span>
              </div>
              <div className="px-6 py-5 font-bold text-slate-600">
                「予約時間より15分遅れてスタート。仕上がりも少しイメージと違った。」
              </div>
              <div className="bg-[#1823ff]/5 px-6 py-4 border-t border-[#1823ff]/10">
                <span className="text-xs font-black text-[#1823ff] uppercase tracking-widest">MisePo生成返信</span>
              </div>
              <div className="px-6 py-5">
                <p className="font-bold text-[#282d32] leading-relaxed text-sm">
                  この度はご来店いただきありがとうございます。お待たせしてしまったこと、またご希望のイメージに沿いきれなかったこと、心よりお詫び申し上げます。お客様のお時間を大切にするため、スケジュール管理を改善してまいります。またカウンセリングの精度を高め、次回は理想の仕上がりをご提供できるよう努めます。もし機会がございましたら、ぜひまたのご来店をお待ちしております。
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
            美容院向けSNS運用ツールの料金プラン
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
            美容院のSNS運用を、<br />今日からAIに任せてみませんか？
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
