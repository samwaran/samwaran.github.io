(function() {
  // 1. THEME SWITCH LOGIC
  const themeToggle = document.getElementById('theme-toggle');
  const modeText = document.getElementById('mode-text');
  const html = document.documentElement;

  // Sync initial state
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  if (isDark) {
    html.classList.add('dark');
    if (modeText) modeText.textContent = 'LIGHT';
  } else {
    html.classList.remove('dark');
    if (modeText) modeText.textContent = 'DARK';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeDark = html.classList.toggle('dark');
      if (modeText) {
        modeText.textContent = activeDark ? 'LIGHT' : 'DARK';
      }
    });
  }

  // 2. LIVE IST CLOCK
  const sysTime = document.getElementById('system-time');
  if (sysTime) {
    const istFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    });

    const updateTime = () => {
      const parts = Object.fromEntries(
        istFormatter.formatToParts(new Date()).map(({ type, value }) => [type, value])
      );
      const timestamp = `${parts.year}-${parts.month}-${parts.day} · ${parts.hour}:${parts.minute}:${parts.second}`;
      sysTime.textContent = 'SYS IST: ' + timestamp;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  // 3. PURE VANILLA JS ASCII TOPOLOGICAL VISUALIZER
  // Renders a smooth rotating ring/torus & sphere field that nods to Samwaran's iconic circle
  const canvas = document.getElementById('ascii-canvas');
  const fpsElem = document.getElementById('ascii-fps');
  const btnToggle = document.getElementById('btn-toggle-kinetic');
  const btnShape = document.getElementById('btn-toggle-shape');
  const viewport = document.getElementById('ascii-viewport');

  let A = 0;
  let B = 0;
  let isRunning = true;
  let shapeMode = 0; // 0 = 3D Torus/Ring, 1 = Polar Circle/Sphere
  let mouseX = 0;
  let mouseY = 0;
  let lastTime = performance.now();
  let frames = 0;

  const charPalette = " .:-=+*#%@";

  if (viewport) {
    viewport.addEventListener('mousemove', (e) => {
      const rect = viewport.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    viewport.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
    });
  }

  function renderAsciiTorus() {
    const width = 48;
    const height = 20;
    const b = [];
    const z = [];
    const total = width * height;

    for (let k = 0; k < total; k++) {
      b[k] = ' ';
      z[k] = 0;
    }

    const cosA = Math.cos(A + mouseX * 0.8);
    const sinA = Math.sin(A + mouseX * 0.8);
    const cosB = Math.cos(B + mouseY * 0.8);
    const sinB = Math.sin(B + mouseY * 0.8);

    // Torus parameter step
    for (let theta = 0; theta < 6.28; theta += 0.08) {
      const costheta = Math.cos(theta);
      const sintheta = Math.sin(theta);

      for (let phi = 0; phi < 6.28; phi += 0.04) {
        const sinphi = Math.sin(phi);
        const cosphi = Math.cos(phi);

        const circlex = costheta + 2.1;
        const circley = sintheta;

        const D = 1 / (sinphi * circlex * sinA + circley * cosA + 4.8);
        const t = sinphi * circlex * cosA - circley * sinA;

        const x = Math.floor(width / 2 + 26 * D * (cosphi * circlex * cosB - t * sinB));
        const y = Math.floor(height / 2 + 13 * D * (cosphi * circlex * sinB + t * cosB));
        const o = x + width * y;

        const N = Math.floor(8 * ((circley * sinA - sinphi * costheta * cosA) * cosB - sinphi * costheta * sinA - circley * cosA - cosphi * costheta * sinB));

        if (height > y && y >= 0 && x >= 0 && width > x && D > z[o]) {
          z[o] = D;
          const idx = Math.max(0, Math.min(charPalette.length - 1, N > 0 ? N : 0));
          b[o] = charPalette[idx];
        }
      }
    }

    let out = '';
    for (let k = 0; k < total; k++) {
      out += (k % width === width - 1) ? '\n' : b[k];
    }
    return out;
  }

  function renderAsciiCircleWave() {
    const width = 48;
    const height = 20;
    let out = '';

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = (x - width / 2) * 0.09 + mouseX * 0.3;
        const ny = (y - height / 2) * 0.18 + mouseY * 0.3;
        const r = Math.sqrt(nx * nx + ny * ny);
        const ringEdge = Math.abs(r - 1.15);

        // Circle outline nod
        if (ringEdge < 0.1) {
          out += '#';
        } else if (ringEdge < 0.22) {
          out += '+';
        } else if (r < 1.15) {
          const v = Math.sin(r * 4.5 - A * 3);
          const charIdx = Math.floor(((v + 1) / 2) * 4);
          out += " .:-"[Math.max(0, Math.min(3, charIdx))];
        } else {
          out += ' ';
        }
      }
      out += '\n';
    }
    return out;
  }

  function tick(time) {
    if (!isRunning) return;

    frames++;
    if (time - lastTime >= 1000) {
      if (fpsElem) fpsElem.textContent = frames + ' FPS';
      frames = 0;
      lastTime = time;
    }

    A += 0.035;
    B += 0.02;

    if (canvas) {
      canvas.textContent = shapeMode === 0 ? renderAsciiTorus() : renderAsciiCircleWave();
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      isRunning = !isRunning;
      if (isRunning) requestAnimationFrame(tick);
      btnToggle.textContent = isRunning ? '[PAUSE]' : '[RUN]';
    });
  }

  if (btnShape) {
    btnShape.addEventListener('click', () => {
      shapeMode = shapeMode === 0 ? 1 : 0;
      btnShape.textContent = shapeMode === 0 ? '[RING // SPHERE]' : '[ORB // TORUS]';
    });
  }

})();