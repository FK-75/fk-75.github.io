/* LOADER LOGIC */
(function () {
  const loaderEl = document.getElementById("loader");
  const bar = document.getElementById("loader-bar");
  const pct = document.getElementById("loader-pct");
  const statusEl = document.getElementById("loader-status");
  const enterEl = document.getElementById("loader-enter");
  const timeEl = document.getElementById("loader-time");
  const dots = [0, 1, 2, 3, 4].map((i) => document.getElementById(`ld${i}`));

  function tickClock() {
    if (!timeEl) return;
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString("en-GB", { hour12: false });
  }

  tickClock();
  setInterval(tickClock, 1000);

  const steps = [
    { at: 0, msg: "Booting neural core…" },
    { at: 18, msg: "Loading EmoSMS weights…" },
    { at: 35, msg: "Calibrating EEG pipeline…" },
    { at: 52, msg: "Compiling satellite CNN…" },
    { at: 68, msg: "Mounting SLAM grid…" },
    { at: 82, msg: "Rendering three.js scene…" },
    { at: 95, msg: "Awaiting signal — ready" },
  ];
  let stepIdx = 0;

  const loaderCanvas = document.getElementById("loader-canvas");
  loaderCanvas.width = window.innerWidth;
  loaderCanvas.height = window.innerHeight;
  const loaderCtx = loaderCanvas.getContext("2d");
  const loaderParticles = Array.from({ length: 120 }, () => ({
    x: loaderCanvas.width / 2 + (Math.random() - 0.5) * loaderCanvas.width * 0.7,
    y: loaderCanvas.height / 2 + (Math.random() - 0.5) * loaderCanvas.height * 0.7,
    r: Math.random() * 1.6 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.18,
    a: Math.random() * 0.45 + 0.05,
  }));

  function drawLoaderParticles() {
    loaderCtx.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
    loaderParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > loaderCanvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > loaderCanvas.height) particle.vy *= -1;
      loaderCtx.beginPath();
      loaderCtx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      loaderCtx.fillStyle = `rgba(201,168,76,${particle.a})`;
      loaderCtx.fill();
    });
  }

  let loaderParticlesFrame;
  function loaderParticleLoop() {
    drawLoaderParticles();
    loaderParticlesFrame = requestAnimationFrame(loaderParticleLoop);
  }

  loaderParticleLoop();

  let progress = 0;
  let done = false;
  const duration = 2600;
  const startTime = performance.now();

  function updateDots(value) {
    const filled = Math.floor(value / 20);
    dots.forEach((dot, index) => {
      dot.classList.toggle("done", index < filled);
      dot.classList.toggle("active", index === filled && value < 100);
    });
  }

  function tick(now) {
    if (done) return;
    const elapsed = now - startTime;
    const raw = Math.min(elapsed / duration, 1);
    const eased = raw < 1 ? 1 - Math.pow(1 - raw, 2.2) : 1;
    progress = eased * 100;

    bar.style.width = `${progress}%`;
    pct.textContent = `${Math.round(progress)}%`;
    updateDots(progress);

    for (let index = steps.length - 1; index >= 0; index -= 1) {
      if (progress >= steps[index].at && stepIdx <= index) {
        statusEl.textContent = steps[index].msg;
        stepIdx = index + 1;
        break;
      }
    }

    if (progress >= 100) {
      done = true;
      bar.style.width = "100%";
      pct.textContent = "100%";
      statusEl.textContent = "System online ✦";
      dots.forEach((dot) => {
        dot.classList.remove("active");
        dot.classList.add("done");
      });
      enterEl.classList.add("show");
      setTimeout(dismiss, 1100);
      window.addEventListener("keydown", dismiss, { once: true });
      window.addEventListener("click", dismiss, { once: true });
      window.addEventListener("touchstart", dismiss, { once: true });
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    cancelAnimationFrame(loaderParticlesFrame);
    loaderEl.classList.add("exit");
    setTimeout(() => {
      loaderEl.style.display = "none";
    }, 750);
    document.body.style.overflow = "";
  }

  document.body.style.overflow = "hidden";
  window.addEventListener("resize", () => {
    loaderCanvas.width = window.innerWidth;
    loaderCanvas.height = window.innerHeight;
  });
})();

/* THREE.JS BACKGROUND */
const canvas = document.getElementById("bg-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 0, 18);

const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener("mousemove", (event) => {
  mouse.tx = (event.clientX / window.innerWidth - 0.5) * 2;
  mouse.ty = -(event.clientY / window.innerHeight - 0.5) * 2;
});

const PARTICLE_COUNT = 4000;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(PARTICLE_COUNT * 3);
const pSizes = new Float32Array(PARTICLE_COUNT);

for (let index = 0; index < PARTICLE_COUNT; index += 1) {
  pPos[index * 3] = (Math.random() - 0.5) * 60;
  pPos[index * 3 + 1] = (Math.random() - 0.5) * 40;
  pPos[index * 3 + 2] = (Math.random() - 0.5) * 30;
  pSizes[index] = Math.random() * 1.4 + 0.4;
}

pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
pGeo.setAttribute("size", new THREE.BufferAttribute(pSizes, 1));

const pMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() } },
  vertexShader: `attribute float size;uniform float uTime;uniform vec2 uMouse;varying float vAlpha;void main(){vec3 pos=position;pos.x+=sin(uTime*0.3+pos.y*0.4)*0.15;pos.y+=cos(uTime*0.2+pos.x*0.3)*0.08;vec2 diff=pos.xy-uMouse*vec2(14.0,10.0);float dist=length(diff);float repulse=smoothstep(4.0,0.0,dist);pos.xy+=normalize(diff+0.001)*repulse*2.2;vAlpha=0.2+0.5*smoothstep(15.0,0.0,abs(pos.z));vec4 mvPos=modelViewMatrix*vec4(pos,1.0);gl_PointSize=size*(22.0/-mvPos.z);gl_Position=projectionMatrix*mvPos;}`,
  fragmentShader: `varying float vAlpha;void main(){float d=length(gl_PointCoord-0.5);if(d>0.5)discard;float alpha=(1.0-d*2.0)*vAlpha;gl_FragColor=vec4(0.82,0.72,0.38,alpha*0.55);}`,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
scene.add(new THREE.Points(pGeo, pMat));

const brain = new THREE.Mesh(
  new THREE.IcosahedronGeometry(4.2, 2),
  new THREE.MeshBasicMaterial({ color: 0xc9a84c, wireframe: true, transparent: true, opacity: 0.18 })
);
brain.position.set(6, 1, 0);
scene.add(brain);

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(2.1, 1),
  new THREE.MeshBasicMaterial({ color: 0xf0c040, wireframe: true, transparent: true, opacity: 0.35 })
);
core.position.set(6, 1, 0);
scene.add(core);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(5.1, 0.05, 8, 80),
  new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.22 })
);
torus.position.set(6, 1, 0);
torus.rotation.x = Math.PI / 3;
scene.add(torus);

const torus2 = torus.clone();
torus2.rotation.x = Math.PI / 1.5;
torus2.rotation.z = Math.PI / 4;
scene.add(torus2);

const torus3 = new THREE.Mesh(
  new THREE.TorusGeometry(5.1, 0.04, 8, 80),
  new THREE.MeshBasicMaterial({ color: 0xf0c040, transparent: true, opacity: 0.12 })
);
torus3.position.set(6, 1, 0);
torus3.rotation.x = Math.PI / 6;
torus3.rotation.y = Math.PI / 3;
scene.add(torus3);

const debris = [];
for (let index = 0; index < 18; index += 1) {
  const mesh = new THREE.Mesh(
    new THREE.TetrahedronGeometry(0.12 + Math.random() * 0.22),
    new THREE.MeshBasicMaterial({
      color: index % 4 === 0 ? 0xc0392b : 0xc9a84c,
      wireframe: true,
      transparent: true,
      opacity: 0.25 + Math.random() * 0.3,
    })
  );
  mesh.position.set((Math.random() - 0.5) * 24, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 8);
  mesh.userData = {
    rotX: (Math.random() - 0.5) * 0.012,
    rotY: (Math.random() - 0.5) * 0.018,
    floatSpeed: 0.3 + Math.random() * 0.5,
    floatAmp: 0.3 + Math.random() * 0.6,
    baseY: mesh.position.y,
  };
  debris.push(mesh);
  scene.add(mesh);
}

const gridHelper = new THREE.GridHelper(60, 40, 0xc9a84c, 0x1a1710);
gridHelper.position.y = -8;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.12;
scene.add(gridHelper);

const pentagon = new THREE.Mesh(
  new THREE.RingGeometry(7, 7.04, 5),
  new THREE.MeshBasicMaterial({ color: 0xc9a84c, side: THREE.DoubleSide, transparent: true, opacity: 0.06 })
);
pentagon.position.set(-8, -2, -6);
scene.add(pentagon);

const pent2 = new THREE.Mesh(
  new THREE.RingGeometry(4, 4.03, 5),
  new THREE.MeshBasicMaterial({ color: 0xc0392b, side: THREE.DoubleSide, transparent: true, opacity: 0.1 })
);
pent2.position.set(10, -5, -4);
scene.add(pent2);

let scrollY = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

let time = 0;
let frameCount = 0;
function animate() {
  requestAnimationFrame(animate);
  frameCount += 1;
  if (window._skipFrame && frameCount % 2 === 0) return;
  time += 0.008;
  mouse.x += (mouse.tx - mouse.x) * 0.06;
  mouse.y += (mouse.ty - mouse.y) * 0.06;
  pMat.uniforms.uTime.value = time;
  pMat.uniforms.uMouse.value.set(mouse.x, mouse.y);
  brain.rotation.x = time * 0.11 + mouse.y * 0.18;
  brain.rotation.y = time * 0.17 + mouse.x * 0.22;
  core.rotation.x = -time * 0.19 + mouse.y * 0.12;
  core.rotation.y = -time * 0.13 + mouse.x * 0.15;
  torus.rotation.y = time * 0.22;
  torus2.rotation.z = time * 0.15;
  torus3.rotation.x = time * 0.09;
  camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
  camera.position.y += (mouse.y * 0.8 + scrollY * -0.003 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);
  debris.forEach((mesh, index) => {
    mesh.rotation.x += mesh.userData.rotX;
    mesh.rotation.y += mesh.userData.rotY;
    mesh.position.y = mesh.userData.baseY + Math.sin(time * mesh.userData.floatSpeed + index) * mesh.userData.floatAmp;
  });
  pentagon.rotation.z = time * 0.04;
  pent2.rotation.z = -time * 0.06;
  gridHelper.position.y = -8 - scrollY * 0.005;
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* custom cursor */
const cursorEl = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");
let cx = 0;
let cy = 0;
let rx = 0;
let ry = 0;

window.addEventListener("mousemove", (event) => {
  cx = event.clientX;
  cy = event.clientY;
});

(function cursorLoop() {
  requestAnimationFrame(cursorLoop);
  rx += (cx - rx) * 0.14;
  ry += (cy - ry) * 0.14;
  cursorEl.style.left = `${cx}px`;
  cursorEl.style.top = `${cy}px`;
  ring.style.left = `${rx}px`;
  ring.style.top = `${ry}px`;
})();

document.querySelectorAll("a,button,.proj-card,.award-item,.skill-item").forEach((element) => {
  element.addEventListener("mouseenter", () => {
    cursorEl.style.width = "20px";
    cursorEl.style.height = "20px";
    ring.style.width = "52px";
    ring.style.height = "52px";
    ring.style.opacity = "1";
  });
  element.addEventListener("mouseleave", () => {
    cursorEl.style.width = "12px";
    cursorEl.style.height = "12px";
    ring.style.width = "36px";
    ring.style.height = "36px";
    ring.style.opacity = ".5";
  });
});

/* intersection observer reveals */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal,.tl-item,.proj-card,.award-item,.jnode").forEach((element) => io.observe(element));
document.querySelectorAll(".proj-card").forEach((element, index) => {
  element.style.transitionDelay = `${index * 0.08}s`;
});
document.querySelectorAll(".award-item").forEach((element, index) => {
  element.style.transitionDelay = `${index * 0.07}s`;
});
document.querySelectorAll(".tl-item").forEach((element, index) => {
  element.style.transitionDelay = `${index * 0.12}s`;
});
document.querySelectorAll(".jnode").forEach((element, index) => {
  element.style.transitionDelay = `${index * 0.1}s`;
});

/* GitHub */
async function loadGitHub() {
  const username = "FK-75";
  const statsEl = document.getElementById("gh-stats");
  const reposEl = document.getElementById("gh-repos");
  if (!statsEl) return;
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
    ]);
    const user = await userRes.json();
    const repos = await reposRes.json();
    if (user.message === "Not Found") throw new Error();
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const langs = {};
    repos.forEach((repo) => {
      if (repo.language) langs[repo.language] = (langs[repo.language] || 0) + 1;
    });
    const topLangs = Object.entries(langs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([lang]) => lang);
    statsEl.innerHTML = `<div class="gh-stat-box"><div class="gh-num">${user.public_repos}</div><div class="gh-lbl">Public Repos</div></div><div class="gh-stat-box"><div class="gh-num">${totalStars}</div><div class="gh-lbl">Total Stars</div></div><div class="gh-stat-box"><div class="gh-num">${user.followers}</div><div class="gh-lbl">Followers</div></div><div class="gh-stat-box"><div class="gh-num">${topLangs.join(" · ")}</div><div class="gh-lbl">Top Languages</div></div>`;
    const top = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 4);
    reposEl.innerHTML = top
      .map((repo) => `<a class="gh-repo" href="${repo.html_url}" target="_blank"><div class="gh-repo-top"><span class="gh-repo-name">${repo.name}</span><span class="gh-repo-stars">★ ${repo.stargazers_count}</span></div><div class="gh-repo-desc">${repo.description || "No description"}</div><div class="gh-repo-lang">${repo.language || ""}</div></a>`)
      .join("");
    const imgEl = document.getElementById("gh-contrib");
    if (imgEl) {
      imgEl.src = `https://ghchart.rshah.org/c9a84c/${username}`;
      imgEl.style.display = "block";
    }
  } catch (_error) {
    statsEl.innerHTML = `<div class="gh-stat-box" style="grid-column:span 4"><div class="gh-lbl">Could not load GitHub data.</div></div>`;
  }
}

loadGitHub();

/* Radar */
function drawRadar() {
  const container = document.getElementById("radar-canvas");
  if (!container) return;
  const skills = [
    { label: "NLP & LLMs", pct: 92 },
    { label: "Comp. Vision", pct: 88 },
    { label: "ML Research", pct: 85 },
    { label: "Robotics/SLAM", pct: 72 },
    { label: "Web / Backend", pct: 70 },
    { label: "Systems & Infra", pct: 65 },
  ];
  const count = skills.length;
  const centerX = 220;
  const centerY = 220;
  const radius = 110;
  const labelRadius = 162;
  const levels = 5;
  const toAngle = (index) => (index / count) * Math.PI * 2 - Math.PI / 2;
  const px = (index, r) => (centerX + r * Math.cos(toAngle(index))).toFixed(2);
  const py = (index, r) => (centerY + r * Math.sin(toAngle(index))).toFixed(2);

  let rings = "";
  for (let level = 1; level <= levels; level += 1) {
    const ringRadius = radius * level / levels;
    const path = skills.map((_, index) => `${index ? "L" : "M"}${px(index, ringRadius)},${py(index, ringRadius)}`).join("") + "Z";
    rings += `<path d="${path}" fill="none" stroke="rgba(201,168,76,0.15)" stroke-width="1"/>`;
  }

  const axes = skills.map((_, index) => `<line x1="${centerX}" y1="${centerY}" x2="${px(index, radius)}" y2="${py(index, radius)}" stroke="rgba(201,168,76,0.12)" stroke-width="1"/>`).join("");
  const dotsMarkup = skills.map((skill, index) => `<circle cx="${px(index, radius * skill.pct / 100)}" cy="${py(index, radius * skill.pct / 100)}" r="4" fill="#f0c040"/>`).join("");
  const labels = skills.map((skill, index) => {
    const angle = toAngle(index);
    const labelX = centerX + labelRadius * Math.cos(angle);
    const labelY = centerY + labelRadius * Math.sin(angle);
    const anchor = Math.cos(angle) < -0.15 ? "end" : Math.cos(angle) > 0.15 ? "start" : "middle";
    return `<text x="${labelX.toFixed(2)}" y="${(labelY - 9).toFixed(2)}" text-anchor="${anchor}" font-family="'DM Mono',monospace" font-size="9" font-weight="500" fill="#8a8070" letter-spacing="0.6">${skill.label.toUpperCase()}</text><text x="${labelX.toFixed(2)}" y="${(labelY + 9).toFixed(2)}" text-anchor="${anchor}" font-family="'DM Mono',monospace" font-size="11" font-weight="600" fill="#c9a84c">${skill.pct}%</text>`;
  }).join("");

  container.innerHTML = `<svg viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;overflow:visible">${rings}${axes}<polygon points="${skills.map((skill, index) => `${px(index, radius * skill.pct / 100)},${py(index, radius * skill.pct / 100)}`).join(" ")}" fill="rgba(201,168,76,0.11)" stroke="#c9a84c" stroke-width="2" stroke-dasharray="800" stroke-dashoffset="800" style="animation:radarIn 1.3s cubic-bezier(.4,0,.2,1) forwards"/>${dotsMarkup}${labels}</svg><style>@keyframes radarIn{to{stroke-dashoffset:0}}</style>`;
}

(function initRadar() {
  const section = document.getElementById("radar-section");
  if (!section) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      drawRadar();
      document.querySelectorAll(".radar-bar").forEach((barEl) => {
        barEl.style.width = `${barEl.dataset.w}%`;
      });
      observer.disconnect();
    }
  }, { threshold: 0.15 });
  observer.observe(section);
})();

/* Easter egg */
let eggBuffer = "";
let wormActive = false;
window.addEventListener("keydown", (event) => {
  eggBuffer = (eggBuffer + event.key.toUpperCase()).slice(-5);
  if (eggBuffer === "SPICE" && !wormActive) triggerWorm();
});

function triggerWorm() {
  wormActive = true;
  const msg = document.createElement("div");
  msg.id = "spice-msg";
  msg.innerHTML = `<div class="spice-inner"><div class="spice-title">THE SPICE MUST FLOW</div><div class="spice-sub">Shai-Hulud awakens beneath the sand...</div></div>`;
  document.body.appendChild(msg);
  const style = document.createElement("style");
  style.textContent = `#spice-msg{position:fixed;inset:0;z-index:9990;display:flex;align-items:center;justify-content:center;pointer-events:none;animation:spiceFadeIn 0.4s ease both,spiceFadeOut 0.6s 3.4s ease both forwards}.spice-inner{text-align:center;background:rgba(8,7,10,0.85);border:1px solid #c9a84c;padding:32px 52px}.spice-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2.5rem,8vw,5rem);letter-spacing:.1em;color:#c9a84c;text-shadow:0 0 40px #c9a84c88}.spice-sub{font-family:'DM Mono',monospace;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:#6e6a60;margin-top:8px}@keyframes spiceFadeIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}@keyframes spiceFadeOut{to{opacity:0;transform:scale(1.04)}}#worm-canvas{position:fixed;inset:0;z-index:9985;pointer-events:none}`;
  document.head.appendChild(style);
  const wormCanvas = document.createElement("canvas");
  wormCanvas.id = "worm-canvas";
  wormCanvas.width = window.innerWidth;
  wormCanvas.height = window.innerHeight;
  document.body.appendChild(wormCanvas);
  const wormCtx = wormCanvas.getContext("2d");
  const width = wormCanvas.width;
  const height = wormCanvas.height;
  const segments = 40;
  const worm = Array.from({ length: segments }, (_, index) => ({
    x: width / 2 + (index - segments / 2) * 18,
    y: height + 80,
  }));
  let wormTime = 0;
  const wormAnim = setInterval(() => {
    wormTime += 0.04;
    wormCtx.clearRect(0, 0, width, height);
    worm[0].x = width / 2 + Math.sin(wormTime * 1.2) * width * 0.28;
    worm[0].y = height * 0.5 - Math.min(wormTime * 38, height * 0.72) + Math.sin(wormTime * 2.5) * 30;
    for (let index = 1; index < segments; index += 1) {
      const dx = worm[index - 1].x - worm[index].x;
      const dy = worm[index - 1].y - worm[index].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 16) {
        worm[index].x += dx / dist * (dist - 16);
        worm[index].y += dy / dist * (dist - 16);
      }
    }
    for (let index = segments - 1; index >= 0; index -= 1) {
      const age = index / segments;
      const radius = 28 - age * 18;
      const alpha = 1 - age * 0.5;
      const hue = Math.round(30 + age * 10);
      wormCtx.beginPath();
      wormCtx.arc(worm[index].x, worm[index].y, radius, 0, Math.PI * 2);
      wormCtx.fillStyle = `hsla(${hue},40%,${14 + age * 6}%,${alpha})`;
      wormCtx.fill();
      if (index % 3 === 0) {
        wormCtx.beginPath();
        wormCtx.arc(worm[index].x, worm[index].y, radius, 0, Math.PI * 2);
        wormCtx.strokeStyle = `hsla(38,55%,38%,${alpha * 0.6})`;
        wormCtx.lineWidth = 1.5;
        wormCtx.stroke();
      }
    }
    wormCtx.beginPath();
    wormCtx.arc(worm[0].x, worm[0].y, 30, 0, Math.PI * 2);
    wormCtx.fillStyle = "#3a2a10";
    wormCtx.fill();
    wormCtx.beginPath();
    wormCtx.arc(worm[0].x, worm[0].y, 16 + Math.sin(wormTime * 8) * 4, 0, Math.PI * 2);
    wormCtx.fillStyle = "#0a0806";
    wormCtx.fill();
    for (let tentacle = 0; tentacle < 8; tentacle += 1) {
      const angle = tentacle / 8 * Math.PI * 2 + wormTime * 0.3;
      const targetX = worm[0].x + Math.cos(angle) * 14;
      const targetY = worm[0].y + Math.sin(angle) * 14;
      wormCtx.beginPath();
      wormCtx.moveTo(worm[0].x + Math.cos(angle) * 10, worm[0].y + Math.sin(angle) * 10);
      wormCtx.lineTo(targetX, targetY);
      wormCtx.strokeStyle = "#c9a84c";
      wormCtx.lineWidth = 1.5;
      wormCtx.stroke();
    }
    for (let particle = 0; particle < 6; particle += 1) {
      const particleX = worm[segments - 1].x + (Math.random() - 0.5) * 80;
      const particleY = worm[segments - 1].y + Math.random() * 20;
      wormCtx.beginPath();
      wormCtx.arc(particleX, particleY, Math.random() * 3 + 1, 0, Math.PI * 2);
      wormCtx.fillStyle = `rgba(201,168,76,${Math.random() * 0.4})`;
      wormCtx.fill();
    }
  }, 16);
  setTimeout(() => {
    clearInterval(wormAnim);
    wormCanvas.remove();
    msg.remove();
    style.remove();
    wormActive = false;
    eggBuffer = "";
  }, 4000);
}

/* hamburger */
const hamburger = document.getElementById("nav-hamburger");
const navLinksEl = document.getElementById("nav-links");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinksEl.classList.toggle("open");
  document.body.style.overflow = navLinksEl.classList.contains("open") ? "hidden" : "";
});
navLinksEl.querySelectorAll("a").forEach((anchor) => {
  anchor.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinksEl.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/* mobile perf */
function tuneMobilePerf() {
  const isMobile = window.innerWidth < 760;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
  if (pMat) pMat.opacity = isMobile ? 0.35 : 1;
  window._skipFrame = isMobile;
}

tuneMobilePerf();
window.addEventListener("resize", tuneMobilePerf);
