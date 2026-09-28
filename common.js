// 一般用・管理者用で共通の処理
(function () {
  const C = window.APP_CONFIG;

  // システム側のエラー時の表示文言（ここだけ変えれば全画面に反映される）
  const SYSTEM_ERROR = 'システムエラーが発生しました。';

  /** 利用者が対処できるエラー。文言をそのまま表示する */
  function userError(message) {
    const err = new Error(message);
    err.isUserError = true;
    return err;
  }

  /** 画面に出す文言を決める。想定外のエラーはすべて SYSTEM_ERROR にする */
  function errMsg(e) {
    if (e && e.isUserError) return e.message;
    console.error(e); // 詳細は開発者向けにコンソールへ
    return SYSTEM_ERROR;
  }

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
      throw userError('通信できませんでした。電波の良い場所でもう一度お試しください');
    }
    let json;
    try {
      json = await res.json();
    } catch (e) {
      throw new Error('GASの応答を読み取れません（HTTP ' + res.status + '）');
    }
    if (!json.ok) {
      if (json.system) throw new Error('GAS側のシステムエラー');
      throw userError(json.error);
    }
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

  /** 文字列ならそのまま、エラーなら errMsg で変換して表示する */
  function showError(msg) {
    if (msg instanceof Error) msg = errMsg(msg);
    const el = $('error');
    if (!el) return console.warn(msg);
    el.textContent = msg;
    el.hidden = !msg;
    if (msg) window.scrollTo(0, 0);
  }

  /**
   * 画面内の確認ダイアログ（ブラウザ標準の confirm はドメイン名が出るため使わない）
   * 使い方: if (await confirmDialog({ title, message, ok: '中止にする', danger: true })) { ... }
   */
  function confirmDialog(opt) {
    return new Promise((resolve) => {
      const wrap = document.createElement('div');
      wrap.className = 'dialog-backdrop';
      wrap.innerHTML = `
        <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title">
          <div class="dialog-title" id="dlg-title">${esc(opt.title || '確認')}</div>
          ${opt.message ? `<div class="dialog-msg">${esc(opt.message)}</div>` : ''}
          <div class="dialog-actions">
            <button type="button" class="btn btn-outline" data-r="0">${esc(opt.cancel || 'やめる')}</button>
            <button type="button" class="btn ${opt.danger ? 'btn-danger' : 'btn-dark'}" data-r="1">${esc(opt.ok || 'OK')}</button>
          </div>
        </div>`;
      const close = (r) => {
        document.removeEventListener('keydown', onKey);
        wrap.remove();
        resolve(r);
      };
      const onKey = (e) => { if (e.key === 'Escape') close(false); };
      wrap.addEventListener('click', (e) => {
        if (e.target === wrap) return close(false); // 背景タップで閉じる
        const b = e.target.closest('[data-r]');
        if (b) close(b.dataset.r === '1');
      });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(wrap);
      wrap.querySelector('[data-r="0"]').focus();
    });
  }

  function genderTag(g) {
    const cls = g === '男性' ? 'tag-m' : g === '女性' ? 'tag-f' : 'tag-n';
    return `<span class="tag ${cls}">${esc(g || '—')}</span>`;
  }

  window.App = { C, api, initLiff, day, hm, ymd, range, esc, $, showError, genderTag, confirmDialog, userError, errMsg, SYSTEM_ERROR };
})();
