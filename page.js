// صفحات ثابتة: عن المتجر، السياسات، التواصل
import { initChrome, el, icon, ICONS, CONTACT } from './common.js';

const path = location.pathname.split('/').pop().replace('.html', '') || 'index';
initChrome(path);

const grid = document.getElementById('contact-grid');
if (grid) {
  const card = (ico, title, value, href, external) =>
    el('a', { class: 'contact-card', href, target: external ? '_blank' : null, rel: external ? 'noopener noreferrer' : null },
      el('span', { class: 'contact-ico' }, icon(ico)),
      el('h2', null, title),
      value && el('span', { class: 'contact-val' }, value));

  grid.append(
    card(ICONS.mail, 'البريد الإلكتروني', CONTACT.email, `mailto:${CONTACT.email}`, false),
    card(ICONS.facebook, 'فيسبوك', 'الصفحة الرسمية', CONTACT.facebook, true),
    card(ICONS.whatsapp, 'واتساب', CONTACT.whatsappDisplay, CONTACT.whatsapp, true),
  );
}
