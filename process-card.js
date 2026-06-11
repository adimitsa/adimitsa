document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("process-textarea");
  const card = document.getElementById("main-process-card");

  if (textarea && card) {
    textarea.focus();

    // Track the historical peak width of our bounding text box
    let historicalMaxWidth = 220;

    // 1. CREATE A HIDDEN MIRROR ELEMENT TO PARSE EXACT BROWSER LAYOUT METRICS
    const mirror = document.createElement("div");
    
    // Mirror must perfectly duplicate the font rendering specs of the textarea
    mirror.style.position = "absolute";
    mirror.style.visibility = "hidden";
    mirror.style.height = "0";
    mirror.style.overflow = "hidden";
    mirror.style.whiteSpace = "pre";
    mirror.style.fontFamily = "sans-serif";
    mirror.style.fontSize = "16px";
    mirror.style.fontWeight = "700";
    mirror.style.letterSpacing = "normal";
    
    document.body.appendChild(mirror);

    const lockWidthToTrueLayout = () => {
      const lines = textarea.value.split("\n");
      let longestLinePixelWidth = 0;

      // 2. MEASURE EACH INDIVIDUAL LINE IN THE ACTIVE BROWSER VIEWPORT
      lines.forEach(line => {
        // Fallback to a space character to preserve trailing newlines accurately
        mirror.textContent = line === "" ? " " : line;
        
        // Read the true physical layout footprint calculated by the browser
        const currentLineWidth = mirror.offsetWidth;
        if (currentLineWidth > longestLinePixelWidth) {
          longestLinePixelWidth = currentLineWidth;
        }
      });

      // Add a 45px safety buffer to ensure the text cursor has clear breathing room on the right
      const currentMaxNeeded = longestLinePixelWidth + 45;

      // 3. ONE-WAY EXPANSION RATCHET
      if (currentMaxNeeded > historicalMaxWidth) {
        historicalMaxWidth = currentMaxNeeded;
      } else {
        // Fallback structural safety minimum floor limit
        historicalMaxWidth = Math.max(220, currentMaxNeeded);
      }

      // 4. DESIGNATE COORDINATE GEOMETRY VALUES
      textarea.style.width = `${historicalMaxWidth}px`;
      card.style.width = `${historicalMaxWidth + 32}px`; // Factoring card padding

      // 5. AUTO-MANAGE DYNAMIC TRACK HEIGHT
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    // Run baseline check on load
    lockWidthToTrueLayout();

    // Listen to real-time keystroke alterations
    textarea.addEventListener("input", lockWidthToTrueLayout);
  }
});