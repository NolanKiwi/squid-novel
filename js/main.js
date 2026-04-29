/* ====================================================
   SQUID 대서사시 — JavaScript
   ==================================================== */

// ──── 읽기 진행률 ────
function initProgress() {
  const fill = document.querySelector('.progress-fill');
  if (!fill) return;
  const content = document.querySelector('.novel-content');
  if (!content) return;

  function updateProgress() {
    const rect = content.getBoundingClientRect();
    const contentHeight = content.offsetHeight;
    const scrolled = Math.max(0, -rect.top);
    const pct = Math.min(100, (scrolled / contentHeight) * 100);
    fill.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// ──── 목차 활성 항목 ────
function initTOC() {
  const chapters = document.querySelectorAll('.novel-content h2, .novel-content .chapter-anchor');
  const navItems = document.querySelectorAll('.sidebar-chapter');
  if (!chapters.length || !navItems.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          item.classList.toggle('active', item.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  chapters.forEach(ch => { if (ch.id) observer.observe(ch); });
}

// ──── 부드러운 스크롤 ────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ──── 기술 박스 토글 ────
function initTechBoxes() {
  document.querySelectorAll('.tech-box-header').forEach(header => {
    header.style.cursor = 'pointer';
    const body = header.nextElementSibling;
    if (!body) return;
    header.addEventListener('click', () => {
      const isOpen = body.style.display !== 'none';
      body.style.display = isOpen ? 'none' : 'block';
      header.querySelector('.tech-box-toggle').textContent = isOpen ? '▶' : '▼';
    });
  });
}

// ──── 모바일 사이드바 ────
function initMobileSidebar() {
  const btn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.novel-sidebar');
  if (!btn || !sidebar) return;

  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    sidebar.style.display = open ? 'flex' : '';
    if (open) {
      sidebar.style.position = 'fixed';
      sidebar.style.zIndex = '50';
      sidebar.style.top = '0';
      sidebar.style.left = '0';
      sidebar.style.height = '100vh';
      sidebar.style.width = '280px';
      sidebar.style.boxShadow = '4px 0 24px rgba(0,0,0,.7)';
    }
    btn.textContent = open ? '✕' : '☰';
  });

  // 외부 클릭으로 닫기
  document.addEventListener('click', e => {
    if (open && !sidebar.contains(e.target) && e.target !== btn) {
      open = false;
      sidebar.style.display = '';
      btn.textContent = '☰';
    }
  });
}

// ──── 타이핑 효과 (히어로 페이지) ────
function initTypewriter() {
  const el = document.querySelector('.typewriter');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(interval);
  }, 50);
}

// ──── 패럴랙스 히어로 ────
function initParallax() {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bg.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
}

// ──── 볼륨 색상 CSS 변수 설정 ────
function setVolumeColor() {
  const body = document.body;
  const vol = body.dataset.volume;
  const colors = {
    '1': '#c9a84c',
    '2': '#e05c5c',
    '3': '#4ecdc4',
    '4': '#5b9bd5',
    '5': '#9b72cf',
  };
  if (vol && colors[vol]) {
    document.documentElement.style.setProperty('--vol-color', colors[vol]);
  }
}

// ──── 코드 블록 복사 버튼 ────
function initCodeCopy() {
  document.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.textContent = '복사';
    btn.style.cssText = `
      position: absolute; top: .5rem; right: .5rem;
      padding: .2rem .6rem; background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.15); border-radius: 4px;
      color: #888; font-size: .72rem; cursor: pointer;
      font-family: monospace; transition: all .2s;
    `;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.textContent).then(() => {
        btn.textContent = '✓';
        btn.style.color = '#4ecdc4';
        setTimeout(() => { btn.textContent = '복사'; btn.style.color = '#888'; }, 1500);
      });
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
}

// ──── 장 읽기 완료 표시 ────
function initReadTracker() {
  const key = `squid-read-${location.pathname}`;
  const content = document.querySelector('.novel-content');
  if (!content) return;

  // 이미 읽었으면 사이드바에 체크 표시
  const stored = JSON.parse(localStorage.getItem('squid-progress') || '{}');

  window.addEventListener('scroll', () => {
    const bottom = content.getBoundingClientRect().bottom;
    if (bottom < window.innerHeight * 1.5) {
      stored[location.pathname] = true;
      localStorage.setItem('squid-progress', JSON.stringify(stored));
    }
  }, { passive: true });

  // 사이드바 아이콘
  document.querySelectorAll('.sidebar-chapter').forEach(item => {
    const href = item.getAttribute('href');
    if (href && stored[href]) {
      const icon = document.createElement('span');
      icon.textContent = ' ✓';
      icon.style.color = 'var(--accent-teal)';
      icon.style.fontSize = '.7rem';
      item.appendChild(icon);
    }
  });
}

// ──── 초기화 ────
document.addEventListener('DOMContentLoaded', () => {
  setVolumeColor();
  initProgress();
  initTOC();
  initSmoothScroll();
  initMobileSidebar();
  initTypewriter();
  initParallax();
  initCodeCopy();
  initReadTracker();
});
