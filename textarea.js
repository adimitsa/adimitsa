document.addEventListener("DOMContentLoaded", () => {
  // Global activation flag tracking across the workspace
  window.hasBeenClickedToTypeGlobal = window.hasBeenClickedToTypeGlobal || false;

  // --- UNIVERSAL MIRROR-BASED SIZING CONTROLLER ---
  // This function can be called on any textarea to size it perfectly relative to its text length
  window.syncTextareaProportionalSize = (textarea) => {
    if (!textarea) return;
    
    const windowCard = textarea.closest(".window-3d-card");
    if (!windowCard) return;

    // Create or reuse a single hidden global mirror element for ultra-precise text measurements
    let mirror = document.getElementById("global-text-measurement-mirror");
    if (!mirror) {
      mirror = document.createElement("div");
      mirror.id = "global-text-measurement-mirror";
      mirror.style.position      = "absolute";
      mirror.style.visibility    = "hidden";
      mirror.style.height        = "0";
      mirror.style.overflow      = "hidden";
      mirror.style.whiteSpace    = "pre";
      mirror.style.fontFamily    = "sans-serif";
      mirror.style.fontSize      = "16px";
      mirror.style.lineHeight    = "1.3";
      mirror.style.padding       = "8px 12px"; // Must exactly match .auto-textarea padding
      document.body.appendChild(mirror);
    }

    let textToMeasure = textarea.value;

    // Phase 1: Show full placeholder if it hasn't been clicked/activated yet
    if (!window.hasBeenClickedToTypeGlobal && !textToMeasure) {
      textToMeasure = textarea.placeholder || "Functional unit";
    }

    // Phase 2: Collapse immediately to fit exactly 1 character if activated but empty
    if (window.hasBeenClickedToTypeGlobal && !textToMeasure) {
      textToMeasure = " "; 
    }

    // Measure line tracks to support vertical paragraph wrapping smoothly
    const lines = textToMeasure.split("\n");
    let maximumLineWidth = 0;

    lines.forEach(line => {
      mirror.textContent = line === "" ? " " : line;
      if (mirror.offsetWidth > maximumLineWidth) {
        maximumLineWidth = mirror.offsetWidth;
      }
    });

    // Apply pixel dimensions directly to the textarea
    textarea.style.width = `${maximumLineWidth}px`;
    textarea.style.height = "auto";
    const calculatedHeight = textarea.scrollHeight;
    textarea.style.height = `${calculatedHeight}px`;

    // Resize the outer 3D card shell cleanly around the input metrics
    windowCard.style.width  = `${maximumLineWidth}px`;
    windowCard.style.height = `${calculatedHeight}px`;
  };

  // Bind behaviors to existing cards on initialization
  const initialTextarea = document.getElementById("dynamic-textarea");
  const initialCard     = document.querySelector(".window-3d-card");

  if (initialTextarea && initialCard) {
    window.syncTextareaProportionalSize(initialTextarea);

    initialTextarea.addEventListener("input", () => {
      window.syncTextareaProportionalSize(initialTextarea);
    });

    initialCard.addEventListener("mousedown", (event) => {
      if (!window.hasBeenClickedToTypeGlobal) {
        window.hasBeenClickedToTypeGlobal = true;
        window.syncTextareaProportionalSize(initialTextarea);
      }

      if (document.activeElement !== initialTextarea) {
        event.preventDefault();
        initialTextarea.focus();
        initialTextarea.setSelectionRange(initialTextarea.value.length, initialTextarea.value.length);
      }
    });
  }

  // --- STANDALONE CANVAS Drag MOVEMENT ENGINE ---
  const canvas = initialCard ? initialCard.offsetParent : null;
  if (canvas) {
    canvas.addEventListener("mousedown", (event) => {
      if (initialCard.contains(event.target)) return;
      if (event.target.closest(".unit-master-container, .window-3d-card")) return;
      if (document.activeElement !== initialTextarea) return;

      event.preventDefault();
      const canvasRect = canvas.getBoundingClientRect();
      const targetX    = event.clientX - canvasRect.left - (initialCard.offsetWidth  / 2);
      const targetY    = event.clientY - canvasRect.top  - (initialCard.offsetHeight / 2);

      initialCard.style.left = `${targetX}px`;
      initialCard.style.top  = `${targetY}px`;
    });
  }
});