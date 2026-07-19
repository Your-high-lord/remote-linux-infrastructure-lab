/* ==========================================================================
   ASIR · INFRA — Portfolio Interactions
   Features: terminal typewriter, nav toggle, active nav highlight,
   viewport reveal, prefers-reduced-motion support, keyboard accessibility,
   outside-click menu close, skill bar animation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------
     REDUCED MOTION — detect OS preference once for all features
     ----------------------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------------------
     MOBILE NAVIGATION — toggle, close on link click, close on outside click,
     keyboard support (Enter / Space / Escape)
     ----------------------------------------------------------------------- */
  const menu  = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  const openNav  = () => { links.classList.add('open');    menu.setAttribute('aria-expanded', 'true');  };
  const closeNav = () => { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };

  menu.addEventListener('click', () => {
    links.classList.contains('open') ? closeNav() : openNav();
  });

  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); links.classList.contains('open') ? closeNav() : openNav(); }
    if (e.key === 'Escape') closeNav();
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !links.contains(e.target)) closeNav();
  });

  /* -------------------------------------------------------------------------
     ACTIVE NAV LINK — highlight current section as user scrolls
     ----------------------------------------------------------------------- */
  const navAnchors = links.querySelectorAll('a[href^="#"]');
  const sectionIds = Array.from(navAnchors).map(a => a.getAttribute('href').slice(1)).filter(Boolean);
  const sections   = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach(sec => navObserver.observe(sec));

  /* -------------------------------------------------------------------------
     TERMINAL TYPEWRITER — respects prefers-reduced-motion
     ----------------------------------------------------------------------- */
  const commandTarget = document.getElementById('typed-command');
  const outputEl      = document.getElementById('terminal-output');

  if (commandTarget && outputEl) {
    const command = 'infra-status --all';
    const outputLines = [
      '<span class="output-info">[network]</span> tailscale0 ........ <span class="output-good">healthy</span>',
      '<span class="output-info">[server ]</span> kali-lab-01 ....... <span class="output-good">online</span>',
      '<span class="output-info">[service]</span> apache2 ........... <span class="output-good">running</span>',
      '<br><span class="output-good">✓ all systems nominal</span>'
    ];

    const runTerminal = () => {
      commandTarget.textContent = '';
      outputEl.innerHTML = '';

      if (prefersReducedMotion) {
        // Show instantly without animation
        commandTarget.textContent = command;
        outputLines.forEach(line => { outputEl.innerHTML += `<div>${line}</div>`; });
        return;
      }

      let index = 0;
      const type = () => {
        if (index < command.length) {
          commandTarget.textContent += command[index++];
          setTimeout(type, 70);
        } else {
          // Reveal output lines one by one
          outputLines.forEach((line, i) => {
            setTimeout(() => { outputEl.innerHTML += `<div>${line}</div>`; }, 350 + i * 370);
          });
          // Replay loop after full animation completes
          const totalDelay = 350 + outputLines.length * 370 + 3000;
          setTimeout(runTerminal, totalDelay);
        }
      };
      setTimeout(type, 650);
    };

    runTerminal();
  }

  /* -------------------------------------------------------------------------
     VIEWPORT REVEAL — fade-in sections on scroll
     ----------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 }
  );

  document.querySelectorAll('.reveal, .skill-bars').forEach(el => revealObserver.observe(el));

});
