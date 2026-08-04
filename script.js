const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const grid = document.getElementById('writeups-grid');
const statusBox = document.getElementById('writeups-status');
const modal = document.getElementById('writeup-modal');
let writeups = [];

function isSupabaseConfigured() {
  const cfg = window.PORTFOLIO_CONFIG || {};
  return cfg.supabaseUrl?.startsWith('https://') &&
    !cfg.supabaseUrl.includes('COLE_AQUI') &&
    cfg.supabaseAnonKey && !cfg.supabaseAnonKey.includes('COLE_AQUI');
}

function difficultyClass(value = '') {
  const normalized = value.toLowerCase();
  if (normalized.includes('fácil') || normalized.includes('facil')) return 'easy';
  if (normalized.includes('médio') || normalized.includes('medio')) return 'medium';
  return 'lab';
}

function normalizeTools(tools) {
  if (Array.isArray(tools)) return tools;
  if (typeof tools === 'string') return tools.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
}

function renderWriteups(items) {
  writeups = items;
  grid.innerHTML = '';
  statusBox.hidden = items.length > 0;
  if (!items.length) {
    statusBox.textContent = 'Nenhum write-up publicado ainda.';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'project-card';

    const top = document.createElement('div');
    top.className = 'project-top';

    const difficulty = document.createElement('span');
    difficulty.className = `tag ${difficultyClass(item.difficulty)}`;
    difficulty.textContent = item.difficulty || 'Laboratório';

    const platform = document.createElement('span');
    platform.className = 'platform';
    platform.textContent = item.platform || 'CTF';

    top.append(difficulty, platform);

    const title = document.createElement('h3');
    title.textContent = item.title;

    const summary = document.createElement('p');
    summary.textContent = item.summary || '';

    const tools = document.createElement('div');
    tools.className = 'tech-list';
    normalizeTools(item.tools).forEach((tool) => {
      const chip = document.createElement('span');
      chip.textContent = tool;
      tools.appendChild(chip);
    });

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'project-link project-button';
    button.textContent = 'Ler write-up →';
    button.addEventListener('click', () => openModal(item));

    card.append(top, title, summary, tools, button);
    grid.appendChild(card);
  });
}

function openModal(item) {
  document.getElementById('modal-title').textContent = item.title || '';
  document.getElementById('modal-platform').textContent = item.platform || '';
  const difficulty = document.getElementById('modal-difficulty');
  difficulty.textContent = item.difficulty || 'Laboratório';
  difficulty.className = `tag ${difficultyClass(item.difficulty)}`;
  document.getElementById('modal-summary').textContent = item.summary || '';

  const tools = document.getElementById('modal-tools');
  tools.innerHTML = '';
  normalizeTools(item.tools).forEach((tool) => {
    const chip = document.createElement('span');
    chip.textContent = tool;
    tools.appendChild(chip);
  });

  const content = document.getElementById('modal-content');
  content.innerHTML = '';
  String(item.content || 'Conteúdo não informado.')
    .split(/\n{2,}/)
    .forEach((block) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = block;
      content.appendChild(paragraph);
    });

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('[data-close-modal]').forEach((element) => {
  element.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('show')) closeModal();
});

async function loadWriteups() {
  try {
    if (isSupabaseConfigured()) {
      const { createClient } = window.supabase;
      const client = createClient(
        window.PORTFOLIO_CONFIG.supabaseUrl,
        window.PORTFOLIO_CONFIG.supabaseAnonKey
      );
      const { data, error } = await client
        .from('writeups')
        .select('id,title,platform,difficulty,summary,tools,content,created_at')
        .eq('published', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      renderWriteups(data || []);
      return;
    }

    const response = await fetch('data/writeups.json');
    if (!response.ok) throw new Error('Falha ao carregar os exemplos.');
    renderWriteups(await response.json());
    statusBox.textContent = 'Modo de demonstração: configure o Supabase para usar o painel.';
  } catch (error) {
    console.error(error);
    statusBox.hidden = false;
    statusBox.textContent = 'Não foi possível carregar os write-ups.';
  }
}

loadWriteups();
