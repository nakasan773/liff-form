// ==========================================================
//  環境ごとの設定（本番・テストでここだけ書き換える）
// ==========================================================
window.APP_CONFIG = {
  CIRCLE_NAME: 'ヌルっとバドミントン',

  // 一般用 LIFF（index.html をエンドポイントにしたもの）
  LIFF_ID: '2011766917-KDaJlDCv',

  // 管理者用 LIFF（admin.html をエンドポイントにしたもの）
  ADMIN_LIFF_ID: '2011766917-pwYnWsmc',

  // GAS ウェブアプリの URL（…/exec）
  GAS_URL: 'https://script.google.com/macros/s/AKfycbxT1c6MBtQgW7uV2Z8Oy0SYtXwSzv0g4h928qzMCCjXQ_VNI22QSXrYpqxDRd0aAeV4jQ/exec',

  // admin.html の公開URL（LINEで共有できないときに Safari で開く先）
  ADMIN_PAGE_URL: 'https://nakasan773.github.io/liff-form/admin.html',

  // 参加者一覧を自動更新する間隔（秒）
  POLL_SECONDS: 20,
};
