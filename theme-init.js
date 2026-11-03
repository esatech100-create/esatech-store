// يُحمَّل في <head> قبل الرسم لمنع وميض الوضع الخاطئ.
(function () {
  var t = null;
  try { t = localStorage.getItem('esatech-theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') {
    try { t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    catch (e) { t = 'light'; }
  }
  document.documentElement.setAttribute('data-theme', t);
})();
