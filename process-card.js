document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("process-textarea");
  const card     = document.getElementById("main-process-card");

  if (!textarea || !card) return;

  // --- WIDTH EXPANSION ENGINE (mirror-based) ---
  let historicalMaxWidth = 220;

  const mirror = document.createElement("div");
  mirror.style.position      = "absolute";
  mirror.style.visibility    = "hidden";
  mirror.style.height        = "0";
  mirror.style.overflow      = "hidden";
  mirror.style.whiteSpace    = "pre";
  mirror.style.fontFamily    = "sans-serif";
  mirror.style.fontSize      = "16px";
  mirror.style.fontWeight    = "700";
  mirror.style.letterSpacing = "normal";
  document.body.appendChild(mirror);

  const lockWidthToTrueLayout = () => {
    const lines = textarea.value.split("\n");
    let longestLinePixelWidth = 0;

    lines.forEach(line => {
      mirror.textContent = line === "" ? " " : line;
      const w = mirror.offsetWidth;
      if (w > longestLinePixelWidth) longestLinePixelWidth = w;
    });

    const currentMaxNeeded = longestLinePixelWidth + 45;
    historicalMaxWidth = currentMaxNeeded > historicalMaxWidth
      ? currentMaxNeeded
      : Math.max(220, currentMaxNeeded);

    textarea.style.width  = `${historicalMaxWidth}px`;
    card.style.width      = `${historicalMaxWidth + 32}px`;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  lockWidthToTrueLayout();
  textarea.addEventListener("input", lockWidthToTrueLayout);

  // --- RE-ARM: clicking anywhere on the card focuses the textarea ---
  card.addEventListener("mousedown", (event) => {
    if (document.activeElement !== textarea) {
      event.preventDefault();
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  });

  // --- MOVEMENT ENGINE ---
  document.addEventListener("mousedown", (event) => {
    // Ignore clicks inside own card
    if (card.contains(event.target)) return;

    // Ignore clicks inside any other card on the canvas
    if (event.target.closest(".window-3d-card")) return;

    // Only move if this card's textarea is focused
    if (document.activeElement !== textarea) return;

    event.preventDefault();

    // Dynamically target the shared level canvas or the standalone parent layout container
    const canvasEl   = document.querySelector(".level-canvas") || card.offsetParent || document.documentElement;
    const canvasRect = canvasEl.getBoundingClientRect();
    const targetX    = event.clientX - canvasRect.left - (card.offsetWidth  / 2);
    const targetY    = event.clientY - canvasRect.top  - (card.offsetHeight / 2);

    card.style.left = `${targetX}px`;
    card.style.top  = `${targetY}px`;

    textarea.blur();
  });
});