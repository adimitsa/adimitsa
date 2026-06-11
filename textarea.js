document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("dynamic-textarea");
  const container = document.querySelector(".textarea-container");
  const windowCard = document.querySelector(".window-3d-card");

  if (textarea && container && windowCard) {
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    // --- 1. EXISTING MULTI-AXIS EXPANSION ENGINE ---
    const matchContentSize = () => {
      textarea.style.width = "40px";
      textarea.style.height = "auto";
      
      const targetWidth = Math.max(160, textarea.scrollWidth + 24);
      const targetHeight = Math.max(48, textarea.scrollHeight);

      textarea.style.width = `${targetWidth}px`;
      textarea.style.height = `${targetHeight}px`;
    };

    matchContentSize();
    textarea.addEventListener("input", matchContentSize);

    // --- 2. RE-ARM FOCUS WHEN CLICKING ANYWHERE ON THE CARD ---
    windowCard.addEventListener("click", (event) => {
      // If the user didn't click the textarea directly, force focus onto it
      if (document.activeElement !== textarea) {
        textarea.focus();
        // Keep cursor at the end of text strings cleanly
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    });

    // --- 3. ONE-SHOT MOVEMENT ENGINE ---
    container.addEventListener("mousedown", (event) => {
      // If clicking directly inside the card/textarea components, don't jump yet
      if (windowCard.contains(event.target)) return;

      // CHECK: Is the window armed for a move? (Is the cursor active?)
      const isCursorActive = (document.activeElement === textarea);
      if (!isCursorActive) return;

      // Prevent default focus loss during the initial down-click phase
      event.preventDefault();

      // Gather viewport canvas geometric boundaries
      const containerRect = container.getBoundingClientRect();
      
      // Calculate target placement vector coordinates
      const targetX = event.clientX - containerRect.left - (windowCard.offsetWidth / 2);
      const targetY = event.clientY - containerRect.top - (windowCard.offsetHeight / 2);

      // Execute the transition update to the new target spot
      windowCard.style.left = `${targetX}px`;
      windowCard.style.top = `${targetY}px`;

      /* ONE-SHOT DEACTIVATION TRICK:
         Instantly strip focus off the input canvas. This drops the card out of its 
         active state so further background clicks are ignored until it's re-focused! */
      textarea.blur();
    });
  }
});