// 一般用・管理者用で共通の処理
(function () {
  const C = window.APP_CONFIG;

  // GAS 呼び出し。Content-Type を text/plain にすると CORS の事前確認が起きない
  async function api(action, params) {
    const body = Object.assign({ action: action }, params || {});
    if (window.liff && liff.getIDToken && !body.token) body.idToken = liff.getIDToken();
    let res;
    try {
      res = await fetch(C.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new Error('通信できませんでした。電波の良い場所でもう一度お試しください');
    }
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'エラーが発生しました');
    return json;
  }

  async function initLiff(liffId) {
    await liff.init({ liffId: liffId });
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: location.href });
      return false;
    }
    return true;
  }

  const fmtDay = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', month: 'long', day: 'numeric', weekday: 'short' });
  const fmtHm = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false });
  const fmtYmd = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' });

  const day = (iso) => fmtDay.format(new Date(iso));        // 10月4日(土)
  const hm = (iso) => fmtHm.format(new Date(iso));          // 18:00
  const ymd = (iso) => fmtYmd.format(new Date(iso));        // 2026-10-04
  const range = (ev) => `${day(ev.start)} ${hm(ev.start)}〜${hm(ev.end)}`;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  const $ = (id) => document.getElementById(id);

  function showError(msg) {
    const el = $('error');
    if (!el) return alert(msg);
    el.textContent = msg;
    el.hidden = !msg;
    if (msg) window.scrollTo(0, 0);
  }

  function genderTag(g) {
    const cls = g === '男性' ? 'tag-m' : g === '女性' ? 'tag-f' : 'tag-n';
    return `<span class="tag ${cls}">${esc(g || '—')}</span>`;
  }

  window.App = { C, api, initLiff, day, hm, ymd, range, esc, $, showError, genderTag };
})();
