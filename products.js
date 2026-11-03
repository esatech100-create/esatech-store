import {
  initChrome, el, icon, ICONS, fetchPublished, watchProducts, productCard, skeletonCards,
  stateBox, norm, CATEGORIES, CONTACT, MSG,
} from './common.js';

initChrome('products');

const grid = document.getElementById('grid');
const chipsBox = document.getElementById('chips');
const search = document.getElementById('search');

const params = new URLSearchParams(location.search);
const state = {
  all: [],
  loaded: false,
  q: params.get('q') ?? '',
  cat: Object.hasOwn(CATEGORIES, params.get('cat')) ? params.get('cat') : 'all',
};
search.value = state.q;

function buildChips() {
  const items = [['all', 'الكل'], ...Object.entries(CATEGORIES)];
  chipsBox.replaceChildren(
    ...items.map(([key, label]) =>
      el('button', {
        class: 'chip', type: 'button', 'data-cat': key,
        'aria-pressed': String(state.cat === key),
        onclick: () => { state.cat = key; syncUrl(); buildChips(); render(); },
      }, label)),
    // خدمة: طلب إنشاء موقع (ليست تصنيف منتجات) — تفتح واتساب مباشرة
    el('a', { class: 'chip chip-action', href: CONTACT.whatsapp, target: '_blank', rel: 'noopener noreferrer' },
      'طلب إنشاء موقع', icon(ICONS.external)),
  );
}

function syncUrl() {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  if (state.cat !== 'all') p.set('cat', state.cat);
  const qs = p.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

function filtered() {
  const q = norm(state.q);
  return state.all.filter((p) => {
    if (state.cat !== 'all' && p.category !== state.cat) return false;
    if (!q) return true;
    const hay = norm([p.name, p.usage, p.description].filter(Boolean).join(' '));
    return hay.includes(q);
  });
}

function render() {
  if (!state.loaded) return;
  if (state.all.length === 0) { grid.replaceChildren(stateBox(MSG.empty)); return; }
  const list = filtered();
  grid.replaceChildren(...(list.length ? list.map(productCard) : [stateBox(MSG.noResults)]));
}

let busy = false;
async function load() {
  if (busy) return;
  busy = true;
  try {
    state.all = await fetchPublished();   // مرتبة من الأحدث إلى الأقدم
    state.loaded = true;
    render();
  } catch (e) {
    console.warn('[EsaTech] load failed:', e.message);
    if (!state.loaded) grid.replaceChildren(stateBox(MSG.loadError, 'error'));
  } finally {
    busy = false;
  }
}

let t;
search.addEventListener('input', () => {
  clearTimeout(t);
  t = setTimeout(() => { state.q = search.value; syncUrl(); render(); }, 150);
});

buildChips();
grid.replaceChildren(...skeletonCards(6));
load();
watchProducts(load);
