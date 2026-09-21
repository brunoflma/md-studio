const byId = (id) => document.getElementById(id);
const tabs = [...document.querySelectorAll('[data-mode]')];
const descriptions = {
  preview: 'Preview: uma leitura organizada, com hierarquia, tabelas e destaques.',
  source: 'Código-fonte: o mesmo documento, com a sintaxe Markdown disponível para edição.'
};

function selectMode(tab) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    byId(item.getAttribute('aria-controls')).hidden = !selected;
  }
  byId('capture-description').textContent = descriptions[tab.dataset.mode];
  byId('full-capture').href = `assets/${tab.dataset.mode}.png`;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectMode(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectMode(tabs[next]);
    tabs[next].focus();
  });
});

let inviteDismissed = false;
let toastTimer;
function showInvite() {
  if (!inviteDismissed) byId('github-invite').hidden = false;
}
byId('dismiss-invite').addEventListener('click', () => {
  inviteDismissed = true;
  byId('github-invite').hidden = true;
});
document.querySelectorAll('[data-invite]').forEach((link) => link.addEventListener('click', showInvite));

for (const button of document.querySelectorAll('[data-copy]')) {
  const source = byId(button.dataset.copy);
  if (!source) continue;
  button.disabled = false;
  button.addEventListener('click', async () => {
    const text = source.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      clearTimeout(toastTimer);
      byId('status').textContent = button.dataset.message || 'Markdown copiado. Salve em um arquivo .md e abra no MD Studio.';
      byId('status').classList.add('visible');
      toastTimer = setTimeout(() => byId('status').classList.remove('visible'), 4000);
    } catch {
      byId('copy-fallback').value = text;
      byId('copy-dialog').showModal();
      byId('copy-fallback').focus();
      byId('copy-fallback').select();
    }
    showInvite();
  });
}

const menu = document.querySelector('.menu-toggle');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir navegação');
  byId('navigation').classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação');
  byId('navigation').classList.toggle('open', open);
});
byId('navigation').querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
