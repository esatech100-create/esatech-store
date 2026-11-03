import {
  initChrome, el, icon, ICONS, fetchOne, watchProducts, stateBox, safeUrl, formatDate,
  categoryLabel, skeletonCards, MSG, BRAND,
} from './common.js';

initChrome('products');

const root = document.getElementById('detail');
const id = new URLSearchParams(location.search).get('id');
let loaded = false;
let busy = false;

function gallery(images, name) {
  const imgs = (images ?? []).map(safeUrl).filter(Boolean);
  if (imgs.length === 0) return null;
  const main = el('img', { src: imgs[0], alt: name, decoding: 'async' });
  const thumbs = imgs.length > 1 ? el('div', { class: 'thumbs' }) : null;
  imgs.forEach((src, i) => {
    if (!thumbs) return;
    const b = el('button', {
      class: 'thumb', type: 'button', 'aria-label': `صورة ${i + 1}`, 'aria-current': String(i === 0),
      onclick: () => {
        main.src = src;
        thumbs.querySelectorAll('.thumb').forEach((x) => x.setAttribute('aria-current', 'false'));
        b.setAttribute('aria-current', 'true');
      },
    }, el('img', { src, alt: '', loading: 'lazy' }));
    thumbs.append(b);
  });
  return el('div', null, el('div', { class: 'gallery-main' }, main), thumbs);
}

function render(p) {
  document.title = `${p.name} | ${BRAND.en} — ${BRAND.ar}`;
  const cat = categoryLabel(p.category);
  const date = p.created_at ? formatDate(p.created_at) : null;
  const features = (p.features ?? []).map((f) => String(f).trim()).filter(Boolean);
  const preview = safeUrl(p.preview_url);
  const download = safeUrl(p.download_url);

  const info = el('div', { class: 'info' },
    el('div', { class: 'badges' },
      cat && el('span', { class: 'badge' }, cat),
      p.featured && el('span', { class: 'badge badge-accent' }, 'مميز')),
    el('h1', null, p.name),
    p.usage && el('p', { class: 'lead' }, p.usage),
    p.description?.trim() && [el('h2', null, 'الوصف'), el('p', { class: 'pre' }, p.description)],
    features.length > 0 && [el('h2', null, 'المميزات'), el('ul', { class: 'features' }, features.map((f) => el('li', null, f)))],
    p.requirements?.trim() && [el('h2', null, 'متطلبات التشغيل'), el('p', { class: 'pre' }, p.requirements)],
    date && el('p', { class: 'meta' }, `تاريخ الإضافة: ${date}`),
    (preview || download) && el('div', { class: 'actions' },
      // لا يظهر الزر إلا إذا وُجد رابط https صالح محفوظ للمشروع
      preview && el('a', { class: 'btn btn-primary', href: preview, target: '_blank', rel: 'noopener noreferrer' }, 'تجربة المشروع', icon(ICONS.external)),
      download && el('a', { class: 'btn btn-accent', href: download, target: '_blank', rel: 'noopener noreferrer' }, 'تنزيل المشروع', icon(ICONS.external))));

  const g = gallery(p.images, p.name);
  root.replaceChildren(el('div', { class: 'detail' }, g ?? el('div', { class: 'gallery-main' }, el('span', { class: 'card-ph' }, cat ?? '')), info));
}

async function load() {
  if (busy) return;
  busy = true;
  try {
    const p = await fetchOne(id);
    if (!p) { loaded = true; root.replaceChildren(stateBox(MSG.notFound)); return; }
    loaded = true;
    render(p);
  } catch (e) {
    console.warn('[EsaTech] load failed:', e.message);
    if (!loaded) root.replaceChildren(stateBox(MSG.loadError, 'error'));
  } finally {
    busy = false;
  }
}

root.replaceChildren(el('div', { class: 'grid' }, ...skeletonCards(1)));
load();
watchProducts(load);   // إن أُخفي المشروع أو عُدّل يتحدث العرض تلقائيًا
