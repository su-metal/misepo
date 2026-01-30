export interface TrendEvent {
    date: string; // "YYYY-MM-DD"
    title: string;
    icon: string; // Emoji or Icon Name
    description: string;
    hashtags: string[];
    isRecommended: boolean;
}

export const MOCK_TRENDS: TrendEvent[] = [
    {
        date: "2026-02-05",
        title: "笑顔の日",
        icon: "😊",
        description: "「ニ(2)コ(5)」の語呂合わせ。スタッフの笑顔や、お客様との楽しいエピソードを紹介してみましょう。",
        hashtags: ["#笑顔の日", "#スマイル", "#スタッフ紹介"],
        isRecommended: false
    },
    {
        date: "2026-02-09",
        title: "肉の日",
        icon: "🍖",
        description: "毎月29日だけでなく、2月9日も「肉の日」。ガッツリ系メニューや、肉料理のこだわりを語るチャンス。",
        hashtags: ["#肉の日", "#お肉大好き", "#スタミナ"],
        isRecommended: true
    },
    {
        date: "2026-02-03",
        title: "節分",
        icon: "👹",
        description: "季節の分かれ目。恵方巻の宣伝や、「邪気払い」メニューの提案に最適です。",
        hashtags: ["#節分", "#恵方巻", "#季節限定"],
        isRecommended: true
    },
    {
        date: "2026-02-14",
        title: "バレンタインデー",
        icon: "🍫",
        description: "チョコレートやギフトの一大イベント。カップルプランや限定スイーツ、ギフトセットをアピールしましょう。",
        hashtags: ["#バレンタイン", "#チョコ好き", "#デート"],
        isRecommended: true
    },
    {
        date: "2026-02-22",
        title: "猫の日",
        icon: "🐱",
        description: "「ニャン(2)ニャン(2)ニャン(2)」の日。猫モチーフのメニューや、癒しの画像を投稿してエンゲージメントを高めましょう。",
        hashtags: ["#猫の日", "#にゃんにゃんにゃんの日", "#癒し"],
        isRecommended: true
    },
    {
        date: "2026-02-23",
        title: "富士山の日",
        icon: "🗻",
        description: "日本の象徴を祝う日。景色の良い席の紹介や、和のテイストを取り入れた投稿がおすすめ。",
        hashtags: ["#富士山の日", "#絶景"],
        isRecommended: false
    },
    {
        date: "2026-03-03",
        title: "ひな祭り",
        icon: "🎎",
        description: "桃の節句。ちらし寿司や桜餅、家族向けのお祝いプランを提案しましょう。",
        hashtags: ["#ひな祭り", "#桃の節句", "#家族時間"],
        isRecommended: true
    },
    {
        date: "2026-03-09",
        title: "サンキュー(3.9)の日",
        icon: "🙏",
        description: "「3.9(サンキュー)」の語呂合わせ。日頃の感謝をフォロワーに伝える絶好の機会です。",
        hashtags: ["#サンキューの日", "#感謝", "#ありがとう"],
        isRecommended: true
    },
    {
        date: "2026-03-14",
        title: "ホワイトデー",
        icon: "🎁",
        description: "お返しの日。クッキーやマシュマロ、感謝を伝えるディナーコースの紹介に。",
        hashtags: ["#ホワイトデー", "#お返しギフト"],
        isRecommended: true
    }
];
