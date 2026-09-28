// ==========================================================
//  環境ごとの設定（本番・テストでここだけ書き換える）
// ==========================================================
window.APP_CONFIG = {
  CIRCLE_NAME: 'ラクっとバドミントン',

  // 一般用 LIFF（index.html をエンドポイントにしたもの）
  LIFF_ID: '2011766917-KDaJlDCv',

  // 管理者用 LIFF（admin.html をエンドポイントにしたもの）
  ADMIN_LIFF_ID: '2011766917-pwYnWsmc',

  // GAS ウェブアプリの URL（…/exec）
  GAS_URL: 'https://script.google.com/macros/s/AKfycbzSVeFwBRa81dE5t3kUwNBHynr5Kuqtxu5nKg1Ayp275UTkXfFh39C34A-vcfVimhU4qg/exec',

  // admin.html の公開URL（LINEで共有できないときに Safari で開く先）
  ADMIN_PAGE_URL: 'https://nakasan773.github.io/liff-form/admin.html',

  // 参加者一覧を自動更新する間隔（秒）
  POLL_SECONDS: 20,
};
