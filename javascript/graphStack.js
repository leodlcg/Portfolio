/* =============================================
     Read CSS variables at runtime
     ============================================= */
  const css = getComputedStyle(document.documentElement);
  const cssVar = (name) => css.getPropertyValue(name).trim();

  /* =============================================
     Chart data
     - Adicione ou remova itens livremente em cada "labels" e "values"
     - O gráfico se ajusta automaticamente ao número de itens
     ============================================= */
  const charts = [
    {
      canvasId: 'canvas-interests',
      wrapperId: 'wrap-interests',
      labels: ['UX/UI', 'IHC', 'IA', 'Web', 'Mobile', 'Games'],
      values: [ 0.75,    0.65,  0.65,  0.80,  0.90,     0.50],
      outerFill:   '--c1-outer-fill',
      outerStroke: '--c1-outer-stroke',
      innerFill:   '--c1-inner-fill',
      innerStroke: '--c1-inner-stroke',
    },
    {
      canvasId: 'canvas-languages',
      wrapperId: 'wrap-languages',
      labels: ['Java', 'Spring', 'Junit', 'Python', 'JS', 'CSS', 'HTML', 'C', 'React Native'],
      values: [  1,       0.8,     0.8,     0.60,   0.75,  0.75,  0.75,  0.55,     0.80],
      outerFill:   '--c2-outer-fill',
      outerStroke: '--c2-outer-stroke',
      innerFill:   '--c2-inner-fill',
      innerStroke: '--c2-inner-stroke',
    },
    {
      canvasId: 'canvas-misc',
      wrapperId: 'wrap-misc',
      labels: ['Windows', 'Linux', 'VSCode', 'Git/GitHub', 'Figma', 'Trello', 'MySQL'],
      values: [    1,     0.85,    0.60,       0.90,       0.80,     0.80,      0.90],
      outerFill:   '--c3-outer-fill',
      outerStroke: '--c3-outer-stroke',
      innerFill:   '--c3-inner-fill',
      innerStroke: '--c3-inner-stroke',
    },
  ];

  /* =============================================
     Polygon geometry helpers
     - Suporta qualquer número de lados (N)
     - "radii" pode ser um número único (polígono regular)
       ou um array de raios individuais por vértice
     ============================================= */
  function polygonPoints(cx, cy, radii, n, rotationDeg = -90) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const angleDeg = rotationDeg + (360 / n) * i;
      const angleRad = (angleDeg * Math.PI) / 180;
      const r = Array.isArray(radii) ? radii[i] : radii;
      pts.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) });
    }
    return pts;
  }

  function drawPolygon(ctx, pts, fillStyle, strokeStyle, strokeWidth, shadow) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    if (shadow) {
      ctx.shadowColor = shadow;
      ctx.shadowBlur = 12;
    }
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }

  /* =============================================
     Draw a chart
     ============================================= */
  function drawChart(chart, progress = 1) {
    const canvas = document.getElementById(chart.canvasId);
    const wrapper = document.getElementById(chart.wrapperId);
    const size = wrapper.getBoundingClientRect().width;

    // HiDPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const n = chart.labels.length; // número dinâmico de lados

    const outerScale  = parseFloat(cssVar('--pentagon-outer-scale'))  || 1;
    const labelOffset = parseFloat(cssVar('--label-offset'))          || 22;
    const strokeW     = parseFloat(cssVar('--pentagon-stroke-width')) || 2;

    const outerR = (size / 2 - labelOffset) * outerScale;

    // Raios individuais por vértice, aplicando o progresso da animação
    const innerRadii = chart.values.map(v => outerR * v * progress);

    // Shadow color from inner stroke
    const shadowColor = cssVar(chart.innerStroke);

    // Outer polygon (frame) — regular, raio único
    const outerPts = polygonPoints(cx, cy, outerR, n);
    drawPolygon(
      ctx, outerPts,
      cssVar(chart.outerFill),
      cssVar(chart.outerStroke),
      strokeW
    );

    // Linhas guia do centro até cada vértice externo
    ctx.save();
    ctx.strokeStyle = cssVar(chart.outerStroke);
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    outerPts.forEach(pt => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    });
    ctx.restore();

    // Inner polygon (filled) — raios individuais por valor
    const innerPts = polygonPoints(cx, cy, innerRadii, n);
    drawPolygon(
      ctx, innerPts,
      cssVar(chart.innerFill),
      cssVar(chart.innerStroke),
      strokeW,
      shadowColor
    );

    // 3-D effect: face superior mais clara
    if (innerPts.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(innerPts[0].x, innerPts[0].y);
      ctx.lineTo(innerPts[1].x, innerPts[1].y);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fill();
    }

    // Face direita mais escura
    if (innerPts.length >= 3) {
      ctx.beginPath();
      ctx.moveTo(innerPts[1].x, innerPts[1].y);
      ctx.lineTo(innerPts[2].x, innerPts[2].y);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();
    }

    // Face inferior mais escura
    if (innerPts.length >= 4) {
      ctx.beginPath();
      ctx.moveTo(innerPts[2].x, innerPts[2].y);
      ctx.lineTo(innerPts[3].x, innerPts[3].y);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fill();
    }
  }

  /* =============================================
     Place labels (HTML elements, positioned via JS)
     ============================================= */
  function placeLabels(chart) {
    const wrapper = document.getElementById(chart.wrapperId);
    wrapper.querySelectorAll('.label').forEach(el => el.remove());

    const size = wrapper.getBoundingClientRect().width;
    const cx = size / 2;
    const cy = size / 2;
    const n = chart.labels.length; // número dinâmico de lados

    const outerScale  = parseFloat(cssVar('--pentagon-outer-scale')) || 1;
    const labelOffset = parseFloat(cssVar('--label-offset'))         || 22;
    const outerR  = (size / 2 - labelOffset) * outerScale;
    const labelR  = outerR + labelOffset;

    chart.labels.forEach((text, i) => {
      const angleDeg = -90 + (360 / n) * i;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = cx + labelR * Math.cos(angleRad);
      const y = cy + labelR * Math.sin(angleRad);

      const el = document.createElement('span');
      el.className = 'label';
      el.textContent = text;
      el.style.left = `${x}px`;
      el.style.top  = `${y}px`;
      el.style.animationDelay = `${0.4 + i * 0.08}s`;
      wrapper.appendChild(el);
    });
  }

  /* =============================================
     Animation loop (scale-in effect)
     ============================================= */
  function animateChart(chart) {
    const duration = 700; // ms
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      // ease out cubic
      const progress = 1 - Math.pow(1 - t, 3);
      drawChart(chart, progress);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* =============================================
     Init
     ============================================= */
  function init() {
    charts.forEach((chart, idx) => {
      setTimeout(() => {
        animateChart(chart);
        placeLabels(chart);
      }, idx * 120);
    });
  }

  // Re-draw on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      charts.forEach(chart => {
        drawChart(chart, 1);
        placeLabels(chart);
      });
    }, 150);
  });

  // Wait for fonts + layout
  if (document.fonts) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }