// --- Navigation & Mobile Menu ---
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const header = document.querySelector('header');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navItems.forEach(item => {
  item.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Scroll listener for header style and active navigation states
window.addEventListener('scroll', () => {
  // Sticky header class
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Active navigation link based on scroll position
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= (sectionTop - 150)) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});


// --- Philosophy Section Tabs ---
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.philosophy-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetTab = button.getAttribute('data-tab');

    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected button and content
    button.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
  });
});


// --- Interactive Science Lab (Atom Builder Sandbox) ---
const canvas = document.getElementById('labCanvas');
const ctx = canvas.getContext('2d');

// State variables
let protons = 1;
let neutrons = 0;
let electrons = 1;

// Controls
const btnAddProton = document.getElementById('btnAddProton');
const btnSubProton = document.getElementById('btnSubProton');
const btnAddNeutron = document.getElementById('btnAddNeutron');
const btnSubNeutron = document.getElementById('btnSubNeutron');
const btnAddElectron = document.getElementById('btnAddElectron');
const btnSubElectron = document.getElementById('btnSubElectron');
const btnResetLab = document.getElementById('btnResetLab');

const lblProton = document.getElementById('protonCount');
const lblNeutron = document.getElementById('neutronCount');
const lblElectron = document.getElementById('electronCount');

const elemName = document.getElementById('elementName');
const elemCharge = document.getElementById('elementCharge');
const elemMass = document.getElementById('elementMass');
const elemStability = document.getElementById('elementStability');

// Element database (Z = 1 to 10)
const elements = [
  { name: 'None (Free Particles)', symbol: 'n/a', stableNeutrons: [] },
  { name: 'Hydrogen', symbol: 'H', stableNeutrons: [0, 1] },
  { name: 'Helium', symbol: 'He', stableNeutrons: [1, 2] },
  { name: 'Lithium', symbol: 'Li', stableNeutrons: [3, 4] },
  { name: 'Beryllium', symbol: 'Be', stableNeutrons: [5] },
  { name: 'Boron', symbol: 'B', stableNeutrons: [5, 6] },
  { name: 'Carbon', symbol: 'C', stableNeutrons: [6, 7] },
  { name: 'Nitrogen', symbol: 'N', stableNeutrons: [7, 8] },
  { name: 'Oxygen', symbol: 'O', stableNeutrons: [8, 9, 10] },
  { name: 'Fluorine', symbol: 'F', stableNeutrons: [10] },
  { name: 'Neon', symbol: 'Ne', stableNeutrons: [10, 11, 12] }
];

// Electron configuration rules (Bohr orbits max capacities)
const orbitCapacities = [2, 8, 8];

// Animation variables
let electronAngles = [0, 0, 0]; // Angles for orbiting electrons in each shell
let nucleusParticles = []; // Cache to store static nucleus layout

// Initialize particle counts
function updateCountsDisplay() {
  lblProton.textContent = protons;
  lblNeutron.textContent = neutrons;
  lblElectron.textContent = electrons;
}

// Recalculate properties and periodic table mapping
function updateAtomicAnalysis() {
  // Mass number
  const mass = protons + neutrons;
  elemMass.textContent = mass;

  // Charge
  const netCharge = protons - electrons;
  if (netCharge > 0) {
    elemCharge.textContent = `Positive (+${netCharge})`;
    elemCharge.style.color = '#fb7185'; // Soft Red
  } else if (netCharge < 0) {
    elemCharge.textContent = `Negative (${netCharge})`;
    elemCharge.style.color = '#38bdf8'; // Soft Blue
  } else {
    elemCharge.textContent = 'Neutral (0)';
    elemCharge.style.color = '#f8fafc'; // White
  }

  // Element Name lookup
  if (protons <= 10) {
    const el = elements[protons];
    elemName.textContent = el.name + (protons > 0 ? ` (${el.symbol})` : '');
    
    // Stability calculation
    if (protons === 0) {
      elemStability.textContent = 'n/a';
      elemStability.style.color = 'var(--text-muted)';
    } else {
      const isStable = el.stableNeutrons.includes(neutrons);
      if (isStable) {
        elemStability.textContent = 'Stable';
        elemStability.style.color = 'var(--accent-science)';
      } else {
        elemStability.textContent = 'Unstable (Radioactive)';
        elemStability.style.color = '#fb7185';
      }
    }
  } else {
    elemName.textContent = `Superheavy Isotope (Z=${protons})`;
    elemStability.textContent = 'Extremely Unstable';
    elemStability.style.color = '#fb7185';
  }
}

// Seed the nucleus particles layout randomly but tightly clustered
function generateNucleusLayout() {
  nucleusParticles = [];
  const total = protons + neutrons;
  if (total === 0) return;

  // Golden ratio/spiral layout for tight packing
  const scale = 8;
  for (let i = 0; i < total; i++) {
    const type = (i < protons) ? 'proton' : 'neutron';
    const angle = i * 2.39996; // Golden angle
    const r = Math.sqrt(i) * scale;
    nucleusParticles.push({
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
      type: type,
      jiggleOffset: Math.random() * Math.PI * 2
    });
  }
}

// Interaction Event Listeners
btnAddProton.addEventListener('click', () => {
  if (protons < 15) { protons++; updateAll(); }
});
btnSubProton.addEventListener('click', () => {
  if (protons > 0) { protons--; updateAll(); }
});

btnAddNeutron.addEventListener('click', () => {
  if (neutrons < 15) { neutrons++; updateAll(); }
});
btnSubNeutron.addEventListener('click', () => {
  if (neutrons > 0) { neutrons--; updateAll(); }
});

btnAddElectron.addEventListener('click', () => {
  if (electrons < 18) { electrons++; updateAll(); }
});
btnSubElectron.addEventListener('click', () => {
  if (electrons > 0) { electrons--; updateAll(); }
});

btnResetLab.addEventListener('click', () => {
  protons = 1;
  neutrons = 0;
  electrons = 1;
  updateAll();
});

function updateAll() {
  updateCountsDisplay();
  updateAtomicAnalysis();
  generateNucleusLayout();
}

// Canvas animation loop
function draw(timestamp) {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // 1. Draw Orbits (shells)
  const baseRadius = 70;
  const orbitSpacing = 45;
  const totalShells = Math.ceil(electrons / 2) > 0 ? Math.min(3, Math.ceil((electrons - 2) / 8) + 1) : 0;
  
  // Always draw at least 1 orbit if there are any electrons
  const shellsToDraw = electrons > 0 ? Math.max(1, totalShells) : 0;

  for (let s = 0; s < shellsToDraw; s++) {
    const r = baseRadius + s * orbitSpacing;
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 2. Draw Nucleus (Protons & Neutrons)
  const time = timestamp * 0.003;
  nucleusParticles.forEach(p => {
    // Thermal vibration/jiggle
    const jiggleX = Math.sin(time + p.jiggleOffset) * 0.8;
    const jiggleY = Math.cos(time + p.jiggleOffset) * 0.8;
    const px = centerX + p.x + jiggleX;
    const py = centerY + p.y + jiggleY;

    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);

    if (p.type === 'proton') {
      // Proton: Orange-Red
      const grad = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, 7);
      grad.addColorStop(0, '#fda4af');
      grad.addColorStop(1, '#e11d48');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 4;
      ctx.fill();
      
      // "+" symbol
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 9px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+', px, py);
    } else {
      // Neutron: Neutral Grey-Slate
      const grad = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, 7);
      grad.addColorStop(0, '#cbd5e1');
      grad.addColorStop(1, '#475569');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#64748b';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  });

  // 3. Draw Orbiting Electrons
  let remainingElectrons = electrons;
  electronAngles[0] += 0.02; // Shell 1 speed
  electronAngles[1] += 0.015; // Shell 2 speed
  electronAngles[2] += 0.01; // Shell 3 speed

  for (let s = 0; s < 3; s++) {
    if (remainingElectrons <= 0) break;
    
    // Determine how many electrons are in this specific shell
    let countInShell = 0;
    if (s === 0) {
      countInShell = Math.min(remainingElectrons, 2);
    } else if (s === 1) {
      countInShell = Math.min(remainingElectrons, 8);
    } else {
      countInShell = Math.min(remainingElectrons, 8);
    }
    remainingElectrons -= countInShell;

    const r = baseRadius + s * orbitSpacing;

    for (let e = 0; e < countInShell; e++) {
      // Distribute electrons evenly around orbit
      const spacingAngle = (Math.PI * 2) / countInShell;
      const angle = electronAngles[s] + e * spacingAngle;
      
      const ex = centerX + r * Math.cos(angle);
      const ey = centerY + r * Math.sin(angle);

      // Draw electron
      ctx.beginPath();
      ctx.arc(ex, ey, 5, 0, Math.PI * 2);
      
      const grad = ctx.createRadialGradient(ex - 1, ey - 1, 1, ex, ey, 5);
      grad.addColorStop(0, '#a7f3d0'); // Mint Light
      grad.addColorStop(1, '#10b981'); // Emerald Accent
      ctx.fillStyle = grad;
      
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Draw electron inner negative sign
      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('-', ex, ey - 0.5);
    }
  }

  requestAnimationFrame(draw);
}

// Initialize simulation
updateAll();
requestAnimationFrame(draw);
