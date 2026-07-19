/* Lightweight interactions: terminal playback, responsive navigation and viewport reveals. */
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  menu.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', open); });
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => links.classList.remove('open')));

  const command = 'infra-status --all';
  const commandTarget = document.getElementById('typed-command');
  const output = document.getElementById('terminal-output');
  const lines = [
    '<span class="output-info">[network]</span> tailscale0 ........ <span class="output-good">healthy</span>',
    '<span class="output-info">[server ]</span> kali-lab-01 ....... <span class="output-good">online</span>',
    '<span class="output-info">[service]</span> apache2 ........... <span class="output-good">running</span>',
    '<br><span class="output-good">✓ all systems nominal</span>'
  ];
  let index = 0;
  const type = () => {
    if (index < command.length) { commandTarget.textContent += command[index++]; setTimeout(type, 70); }
    else { setTimeout(() => lines.forEach((line, i) => setTimeout(() => { output.innerHTML += `<div>${line}</div>`; }, i * 370)), 350); }
  };
  setTimeout(type, 650);

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), { threshold: .13 });
  document.querySelectorAll('.reveal, .skill-bars').forEach(element => observer.observe(element));
});
