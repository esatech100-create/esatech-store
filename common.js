// ============================================================
// EsaTech | عيسى تك — دوال مشتركة للمتجر
// ============================================================
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const BRAND = { en: 'EsaTech', ar: 'عيسى تك' };

export const CATEGORIES = {
  websites: 'مواقع الويب',
  games: 'ألعاب',
  'web-apps': 'تطبيقات ويب',
  other: 'مشاريع أخرى',
};

export const CONTACT = {
  facebook: 'https://www.facebook.com/share/1E4tbVtGok/',
  whatsapp: 'https://wa.me/201030996952',
  whatsappDisplay: '+20 103 099 6952',
  email: 'esatech100@gmail.com',
};

export const MSG = {
  empty: 'لا توجد مشاريع منشورة حاليًا، تابعنا قريبًا.',
  noResults: 'لم نعثر على مشاريع مطابقة، جرّب كلمات أخرى أو غيّر التصنيف.',
  loadError: 'تعذّر تحميل المشاريع. تحقق من اتصالك وحاول مجددًا.',
  notFound: 'هذا المشروع غير متاح.',
};

const SUPABASE_ESM = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

// ---------- أدوات DOM آمنة (لا innerHTML مع بيانات قادمة من القاعدة) ----------
export function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

// SVG ثابتة من ملفنا نحن فقط (ليست من القاعدة)
function icon(svg) {
  const t = document.createElement('template');
  t.innerHTML = svg.trim();
  return t.content.firstChild;
}
const ICONS = {
  sun: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.7c0-.9.3-1.5 1.5-1.5h1.6V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H7.9v3h2.6V21z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.5z"/><path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5l1.2-1.2-1.8-1-.8.6c-.8-.4-1.5-1.1-1.9-1.9l.6-.8-1-1.8z"/></svg>',
  external: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
};
export { icon, ICONS };

export function safeUrl(u) {
  if (typeof u !== 'string') return null;
  try {
    const x = new URL(u);
    return x.protocol === 'https:' ? x.href : null;
  } catch { return null; }
}

// تطبيع عربي للبحث: إزالة التشكيل وتوحيد الألف والياء والتاء المربوطة
export function norm(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim();
}

export function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return new Intl.DateTimeFormat('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

// ---------- الوضع النهاري/الليلي ----------
function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}
function applyTheme(t, btn) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('esatech-theme', t); } catch {}
  if (btn) {
    btn.replaceChildren(icon(t === 'dark' ? ICONS.sun : ICONS.moon));
    btn.setAttribute('aria-pressed', String(t === 'dark'));
    btn.setAttribute('aria-label', t === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي');
  }
}

// ---------- الهيكل المشترك: الرأس والتذييل ----------
const NAV = [
  ['index', 'index.html', 'الرئيسية'],
  ['products', 'products.html', 'المنتجات'],
  ['about', 'about.html', 'عن المتجر'],
  ['policies', 'policies.html', 'سياسات المتجر'],
  ['contact', 'contact.html', 'تواصل معنا'],
];

export function initChrome(active) {
  // الرأس
  const themeBtn = el('button', { class: 'icon-btn', type: 'button' });
  themeBtn.addEventListener('click', () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', themeBtn));
  applyTheme(currentTheme(), themeBtn);

  const nav = el('nav', { class: 'nav', id: 'main-nav', 'aria-label': 'التنقل الرئيسي' },
    NAV.map(([key, href, label]) =>
      el('a', { href, class: 'nav-link', 'aria-current': key === active ? 'page' : null }, label)));

  const menuBtn = el('button', {
    class: 'icon-btn menu-btn', type: 'button',
    'aria-controls': 'main-nav', 'aria-expanded': 'false', 'aria-label': 'القائمة',
  });
  menuBtn.append(icon(ICONS.menu));
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  const brand = el('a', { class: 'brand', href: 'index.html', 'aria-label': `${BRAND.en} — ${BRAND.ar}` },
    el('span', { class: 'brand-en' }, 'Esa', el('b', null, 'Tech')),
    el('span', { class: 'brand-ar' }, BRAND.ar));

  const header = el('header', { class: 'site-header' },
    el('div', { class: 'container header-inner' }, brand, nav, el('div', { class: 'header-actions' }, themeBtn, menuBtn)));
  document.getElementById('site-header')?.replaceWith(header);

  // التذييل
  const footer = el('footer', { class: 'site-footer' },
    el('div', { class: 'container footer-inner' },
      el('div', null,
        el('strong', null, `${BRAND.en} — ${BRAND.ar}`),
        el('p', { class: 'muted' }, 'حلول رقمية وإبداع بلا حدود')),
      el('nav', { class: 'footer-nav', 'aria-label': 'روابط التذييل' },
        NAV.map(([, href, label]) => el('a', { href }, label)))));
  document.getElementById('site-footer')?.replaceWith(footer);
}

// ---------- البيانات ----------
export function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && safeUrl(SUPABASE_URL));
}

async function rest(query, table = 'products') {
  if (!isConfigured()) throw new Error('not-configured');
  const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${table}?${query}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('http-' + res.status);
  return res.json();
}

// المنتجات المنشورة فقط (RLS يفرض ذلك على الخادم أيضًا)
export function fetchPublished() {
  return rest('select=*&published=eq.true&order=created_at.desc');
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function fetchOne(id) {
  if (!UUID.test(id || '')) return null;
  const rows = await rest(`select=*&id=eq.${id}&published=eq.true&limit=1`);
  return rows[0] ?? null;
}

// المزامنة (ثلاث طبقات، أي واحدة تكفي لوصول التغيير):
//  1) Realtime: تحديث فوري عند الإضافة/التعديل/النشر.
//  2) catalog_meta: صف واحد يتغير وقته عند أي تغيير (بما فيه الإخفاء والحذف)
//     نفحصه كل 30 ثانية وعند عودة التبويب. هذا ما يضمن اختفاء المنتج المخفي،
//     لأن Realtime يحترم RLS فلا يصل للزائر حدث إخفاء منتج.
//  3) إن تعذّر تحميل مكتبة Realtime يبقى فحص catalog_meta يعمل وحده.
export function watchProducts(onChange) {
  let timer;
  let last = null;
  const trigger = () => { clearTimeout(timer); timer = setTimeout(onChange, 400); };

  async function check() {
    try {
      const rows = await rest('select=updated_at&id=eq.1', 'catalog_meta');
      const v = rows[0]?.updated_at ?? null;
      if (last !== null && v !== last) trigger();
      last = v;
    } catch { /* نحاول في الدورة التالية */ }
  }

  if (!isConfigured()) return;
  check();
  setInterval(() => { if (!document.hidden) check(); }, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });

  import(SUPABASE_ESM).then(({ createClient }) => {
    const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    sb.channel('store-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, trigger)
      .subscribe();
  }).catch((e) => console.warn('[EsaTech] Realtime غير متاح، يعمل الفحص الدوري فقط:', e));
}

// ---------- مكوّنات العرض ----------
export function categoryLabel(key) { return CATEGORIES[key] ?? null; }

export function productCard(p) {
  const img = safeUrl(p.images?.[0]);
  const media = el('div', { class: 'card-media' },
    img
      ? el('img', { src: img, alt: p.name, loading: 'lazy', decoding: 'async' })
      : el('span', { class: 'card-ph' }, categoryLabel(p.category) ?? ''));
  const cat = categoryLabel(p.category);
  return el('article', { class: 'card' },
    media,
    el('div', { class: 'card-body' },
      el('div', { class: 'badges' },
        cat && el('span', { class: 'badge' }, cat),
        p.featured && el('span', { class: 'badge badge-accent' }, 'مميز')),
      el('h3', { class: 'card-title' }, p.name),
      el('p', { class: 'card-usage' }, p.usage),
      el('a', { class: 'btn btn-primary card-link', href: `product.html?id=${encodeURIComponent(p.id)}` }, 'عرض التفاصيل')));
}

export function skeletonCards(n = 6) {
  return Array.from({ length: n }, () =>
    el('div', { class: 'card skeleton', 'aria-hidden': 'true' },
      el('div', { class: 'card-media' }),
      el('div', { class: 'card-body' }, el('i'), el('i'), el('i'))));
}

export function stateBox(text, kind = 'info') {
  return el('div', { class: `state state-${kind}`, role: kind === 'error' ? 'alert' : 'status' }, text);
}
