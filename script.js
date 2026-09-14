(() => {
  const cfg = window.WTF || {};
  const solMint = "So11111111111111111111111111111111111111112";
  const contract = (cfg.contract || "").trim();
  const dexBase = cfg.dexBase || "https://dexscreener.com/solana";
  const chartUrl = contract ? `${dexBase}/${contract}` : dexBase;
  const buyUrl = contract
    ? `${cfg.pumpswap || "https://swap.pump.fun/"}?input=${solMint}&output=${contract}`
    : cfg.pumpswap || "https://swap.pump.fun/";
  const xUrl = cfg.x || "https://x.com/WTFmemesol";
  const embed = `${chartUrl}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15`;

  const applyLinks = () => {
    document.querySelectorAll("[data-link='buy']").forEach((el) => el.setAttribute("href", buyUrl));
    document.querySelectorAll("[data-link='chart']").forEach((el) => el.setAttribute("href", chartUrl));
    document.querySelectorAll("[data-link='x']").forEach((el) => el.setAttribute("href", xUrl));
    const frame = document.getElementById("dex-embed");
    if (frame) frame.src = embed;
  };

  const caChip = document.getElementById("ca-chip");
  const caValue = document.getElementById("ca-value");
  if (caValue) caValue.textContent = contract || "dropping soon";
  if (caChip) {
    caChip.addEventListener("click", async () => {
      if (!contract) return;
      try {
        await navigator.clipboard.writeText(contract);
        caValue.textContent = "copied";
        setTimeout(() => {
          caValue.textContent = contract;
        }, 1400);
      } catch (_) {
        caValue.textContent = contract;
      }
    });
  }

  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links?.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealables = document.querySelectorAll(".manifesto, .inquiry, .fuse-step, .chart-portal, .billboard, .join-card");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
  revealables.forEach((el) => io.observe(el));

  const canvas = document.getElementById("burst-field");
  const ctx = canvas?.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && ctx && !reduce) {
    const bits = [];
    const words = ["WTF", "wtf", "WTF"];
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const spawn = (count) => {
      bits.length = 0;
      for (let i = 0; i < count; i += 1) {
        const kind = i % 5 === 0 ? "word" : i % 3 === 0 ? "cube" : "spark";
        bits.push({
          kind,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: 0.35 + Math.random() * 1.4,
          vx: (Math.random() - 0.5) * 0.28,
          vy: -0.12 - Math.random() * 0.32,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.01,
          size: kind === "cube" ? 6 + Math.random() * 10 : 1.2 + Math.random() * 2.4,
          text: words[i % words.length],
          tone: Math.random() > 0.7 ? "#79e7ff" : Math.random() > 0.45 ? "#f4c43a" : "#fff4dc",
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      bits.forEach((bit) => {
        bit.x += bit.vx * bit.z;
        bit.y += bit.vy * bit.z;
        bit.rot += bit.vr;
        if (bit.y < -30) bit.y = window.innerHeight + 20;
        if (bit.x < -40) bit.x = window.innerWidth + 20;
        if (bit.x > window.innerWidth + 40) bit.x = -20;

        ctx.save();
        ctx.translate(bit.x, bit.y);
        ctx.rotate(bit.rot);
        ctx.globalAlpha = 0.28 + bit.z * 0.28;

        if (bit.kind === "word") {
          ctx.fillStyle = bit.tone;
          ctx.font = `${11 + bit.z * 10}px "Bagel Fat One", sans-serif`;
          ctx.fillText(bit.text, 0, 0);
        } else if (bit.kind === "cube") {
          ctx.fillStyle = bit.tone === "#79e7ff" ? "#e23b2c" : bit.tone;
          ctx.fillRect(-bit.size / 2, -bit.size / 2, bit.size, bit.size);
        } else {
          ctx.fillStyle = bit.tone;
          ctx.beginPath();
          ctx.arc(0, 0, bit.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };

    resize();
    spawn(window.innerWidth < 700 ? 36 : 64);
    draw();
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      resize();
      spawn(window.innerWidth < 700 ? 36 : 64);
      draw();
    });
  }

  applyLinks();
})();
