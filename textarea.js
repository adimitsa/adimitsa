document.addEventListener("DOMContentLoaded", () => {
  const textarea   = document.getElementById("dynamic-textarea");
  const windowCard = document.querySelector(".window-3d-card");
  const canvas     = windowCard ? windowCard.offsetParent : null;

  if (!textarea || !windowCard || !canvas) return;

  // State to track if the initial user activation click has occurred
  let hasBeenClickedToType = false;

  // --- 1. PROPORTIONAL RESIZING MIRROR ENGINE ---
  // Create an invisible mirror element that measures exact text metrics on the fly
  const textMirror = document.createElement("div");
  textMirror.style.position      = "absolute";
  textMirror.style.visibility    = "hidden";
  textMirror.style.height        = "0";
  textMirror.style.overflow      = "hidden";
  textMirror.style.whiteSpace    = "pre";
  textMirror.style.fontFamily    = "sans-serif";
  textMirror.style.fontSize      = "16px";
  textMirror.style.lineHeight    = "1.3";
  textMirror.style.padding       = "8px 12px"; // Must match text area padding exactly
  document.body.appendChild(textMirror);

  const resizeInputToExactContent = () => {
    let textToMeasure = textarea.value;

    // Before the first interaction check, calculate size using the placeholder text string
    if (!hasBeenClickedToType && !textToMeasure) {
      textToMeasure = textarea.placeholder || "";
    }

    // If active/clicked but empty, collapse down to show exactly 1 character width spacer
    if (hasBeenClickedToType && !textToMeasure) {
      textToMeasure = " "; 
    }

    // Split text into individual rows to handle line breaks perfectly
    const lines = textToMeasure.split("\n");
    let maximumLineWidthPixelOffset = 0;

    lines.forEach(line => {
      textMirror.textContent = line === "" ? " " : line;
      if (textMirror.offsetWidth > maximumLineWidthPixelOffset) {
        maximumLineWidthPixelOffset = textMirror.offsetWidth;
      }
    });

    // Calculate exact proportional width needed
    const calculatedWidth = maximumLineWidthPixelOffset;
    
    // Calculate exact vertical height using a fast, scrollHeight measure loop
    textarea.style.width  = `${calculatedWidth}px`;
    textarea.style.height = "auto";
    const calculatedHeight = textarea.scrollHeight;
    textarea.style.height = `${calculatedHeight}px`;

    // Resize the outer 3D card shell cleanly around the input metrics (retaining shadows)
    windowCard.style.width  = `${calculatedWidth}px`;
    windowCard.style.height = `${calculatedHeight}px`;
  };

  // Run baseline layout size calculation pass
  resizeInputToExactContent();
  textarea.addEventListener("input", resizeInputToExactContent);

  // --- 2. ACTIVATION & FOCUS RE-ARM CIRCUIT ---
  windowCard.addEventListener("mousedown", (event) => {
    // Check if this is the first activation trigger step
    if (!hasBeenClickedToType) {
      hasBeenClickedToType = true;
      // Shrink immediately down to 1-character size bounds
      resizeInputToExactContent();
    }

    if (document.activeElement !== textarea) {
      event.preventDefault();
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  });

  // --- 3. MOVEMENT ENGINE CONTROLLER ---
  canvas.addEventListener("mousedown", (event) => {
    // Ignore clicks inside own card structure
    if (windowCard.contains(event.target)) return;

    // Ignore clicks inside any other interactive block components on screen
    if (event.target.closest(".process-card, .window-3d-card")) return;

    // Only allow drag movement shifts if this card is currently active and focused
    if (document.activeElement !== textarea) return;

    event.preventDefault();

    const canvasRect = canvas.getBoundingClientRect();
    const targetX    = event.clientX - canvasRect.left - (windowCard.offsetWidth  / 2);
    const targetY    = event.clientY - canvasRect.top  - (windowCard.offsetHeight / 2);

    windowCard.style.left = `${targetX}px`;
    windowCard.style.top  = `${targetY}px`;
  });
});