// Main Application Logic: Projects Rendering & Typing Effect
(() => {
  const P = [
    {
      n: 'Home Services',
      t: 'Team project',
      d: 'A full-stack web app for home maintenance and cleaning services. It has service browsing, appointment booking, order tracking, and admin management tools.',
      i: 'assets/images/project-home-services.jpg',
      tags: ['next', 'tw', 'supa', 'stripe'],
      l: [
        ['GitHub (FE)', 'https://github.com/AphisakDev/Project_Home_Services_FrontEnd'],
        ['GitHub (BE)', 'https://github.com/AphisakDev/Project_Home_Services_backend/'],
        ['Website', 'https://project-home-service-client.vercel.app/']
      ]
    },
    {
      n: 'Pet Sitter',
      t: 'Team project',
      d: 'An online pet-sitting booking platform where pet owners can find, book, and review sitters, while sitters manage profiles and appointments with real-time updates.',
      i: 'assets/images/project-pet-sitter.jpg',
      tags: ['react', 'tw', 'node', 'express', 'pg'],
      l: [
        ['GitHub (FE)', 'https://github.com/AphisakDev/Project_Pet_Sitter_Client'],
        ['GitHub (BE)', 'https://github.com/AphisakDev/Project_Pet_Sitter_Server'],
        ['Website', 'https://petsitterclient.vercel.app/']
      ]
    },
    {
      n: 'Personal Blog',
      t: 'Personal project',
      d: 'A modern tech and AI blog with interactive content, article bookmarks, newsletter subscription, and responsive reading experience.',
      i: 'assets/images/project-personal-blog.jpg',
      tags: ['next', 'tw', 'ts'],
      l: [
        ['GitHub', 'https://github.com/AphisakDev/ai-holographic-blog'],
        ['Website', 'https://ai-holographic-blog-virq.vercel.app/']
      ]
    }
  ];

  const pj = document.getElementById('pj');
  if (pj && window.tag) {
    pj.innerHTML = P.map((p, i) => `
      <div class="proj${i % 2 ? ' r' : ''}">
        <div class="shot">
          <img src="${p.i}" alt="${p.n}" loading="lazy">
        </div>
        <div class="txt">
          <small>${p.t}</small>
          <h3>${p.n}</h3>
          <p>${p.d}</p>
          <div class="tags">${p.tags.map(window.tag).join('')}</div>
          <div class="lk">${p.l.map(l => `<a href="${l[1]}" target="_blank" rel="noopener">${l[0]}</a>`).join('')}</div>
        </div>
      </div>
    `).join('');
  }

  // Hero Multi-Phrase Typing Effect
  const tp = document.querySelector('.type span');
  const phrases = [
    "I build modern full-stack web apps.",
    "I craft interactive 3D web experiences.",
    "I turn complex ideas into clean products."
  ];

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (tp) {
    if (still) {
      tp.textContent = phrases[0];
    } else {
      let pIdx = 0;
      let charIdx = 0;
      let isDeleting = false;

      function typeLoop() {
        const currentPhrase = phrases[pIdx];

        if (isDeleting) {
          charIdx--;
          tp.textContent = currentPhrase.slice(0, charIdx);
        } else {
          charIdx++;
          tp.textContent = currentPhrase.slice(0, charIdx);
        }

        let speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIdx === currentPhrase.length) {
          // Finished typing sentence, pause so the user can read comfortably
          speed = 2200;
          isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
          // Finished deleting sentence, switch to next phrase
          isDeleting = false;
          pIdx = (pIdx + 1) % phrases.length;
          speed = 450;
        }

        setTimeout(typeLoop, speed);
      }

      typeLoop();
    }
  }
})();
