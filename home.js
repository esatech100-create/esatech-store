import { initChrome, fetchPublished, watchProducts, productCard, skeletonCards, stateBox, MSG } from './common.js';

initChrome('index');

const latestGrid = document.getElementById('latest-grid');
const featuredGrid = document.getElementById('featured-grid');
const featuredSection = document.getElementById('featured-section');
let loaded = false;
let busy = false;

function render(products) {
  // أحدث المشاريع
  if (products.length === 0) {
    latestGrid.replaceChildren(stateBox(MSG.empty));
  } else {
    latestGrid.replaceChildren(...products.slice(0, 6).map(productCard));
  }
  // المشاريع المميزة: لا يظهر القسم إلا إذا وُجد منتج مميز فعلًا
  const featured = products.filter((p) => p.featured).slice(0, 6);
  featuredSection.hidden = featured.length === 0;
  featuredGrid.replaceChildren(...featured.map(productCard));
}

async function load() {
  if (busy) return;
  busy = true;
  try {
    render(await fetchPublished());
    loaded = true;
  } catch (e) {
    console.warn('[EsaTech] load failed:', e.message);
    // إن فشل تحديث لاحق نُبقي البيانات المعروضة كما هي
    if (!loaded) {
      featuredSection.hidden = true;
      latestGrid.replaceChildren(stateBox(MSG.loadError, 'error'));
    }
  } finally {
    busy = false;
  }
}

latestGrid.replaceChildren(...skeletonCards(3));
load();
watchProducts(load);
