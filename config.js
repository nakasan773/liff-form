// ==========================================================
//  環境ごとの設定（本番・テストでここだけ書き換える）
// ==========================================================
window.APP_CONFIG = {
  CIRCLE_NAME: 'ラクっとバドミントン',

  // 一般用 LIFF（index.html をエンドポイントにしたもの）
  LIFF_ID: 'ここに一般用LIFF IDを貼る',

  // 管理者用 LIFF（admin.html をエンドポイントにしたもの）
  ADMIN_LIFF_ID: 'ここに管理者用LIFF IDを貼る',

  // GAS ウェブアプリの URL（…/exec）
  GAS_URL: 'ここにGASのウェブアプリURLを貼る',

  // admin.html の公開URL（LINEで共有できないときに Safari で開く先）
  ADMIN_PAGE_URL: 'https://rakutto-badminton.github.io/liff-register/admin.html',

  // 参加者一覧を自動更新する間隔（秒）
  POLL_SECONDS: 20,
};
