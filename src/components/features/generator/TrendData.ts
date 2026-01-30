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
    },
    {
        date: "2026-04-01",
        title: "エイプリルフール",
        icon: "🃏",
        description: "クスッと笑える「嘘」やユーモアのある投稿で、親近感をアップさせるチャンス。",
        hashtags: ["#エイプリルフール", "#嘘のような本当の話"],
        isRecommended: false
    },
    {
        date: "2026-04-06",
        title: "新生活スタート",
        icon: "🌸",
        description: "入学・入社シーズン。歓迎会プランや「初めまして」の挨拶投稿で新規客を取り込みましょう。",
        hashtags: ["#新生活", "#歓迎会", "#春の新メニュー"],
        isRecommended: true
    },
    {
        date: "2026-04-29",
        title: "昭和の日（GW開始）",
        icon: "🎌",
        description: "ゴールデンウィーク突入。連休中の営業時間や、観光・帰省客向けの特別メニューを告知。",
        hashtags: ["#GW", "#ゴールデンウィーク", "#昭和の日"],
        isRecommended: true
    },
    {
        date: "2026-05-05",
        title: "こどもの日",
        icon: "🎏",
        description: "端午の節句。お子様ランチの紹介や、家族連れ大歓迎のメッセージを。",
        hashtags: ["#こどもの日", "#家族ランチ", "#鯉のぼり"],
        isRecommended: true
    },
    {
        date: "2026-05-10",
        title: "母の日",
        icon: "🌹",
        description: "感謝を伝える日。特別コースやテイクアウトのお弁当、ギフト券の販促に最適。",
        hashtags: ["#母の日", "#母の日ランチ", "#ありがとう"],
        isRecommended: true
    }
];
