document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("dynamic-textarea");

  if (textarea) {
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    const matchContentSize = () => {
      // Temporarily scale down width to get an accurate reading of raw text node lengths
      textarea.style.width = "40px";
      textarea.style.height = "auto";
      
      // Calculate layout target dimensions based on scrolling boundaries
      const targetWidth = Math.max(160, textarea.scrollWidth + 24);
      const targetHeight = Math.max(48, textarea.scrollHeight);

      // Apply the sizes back to the element properties instantly
      textarea.style.width = `${targetWidth}px`;
      textarea.style.height = `${targetHeight}px`;
    };

    // Run baseline check on load
    matchContentSize();

    // Listen to real-time keystroke alterations
    textarea.addEventListener("input", matchContentSize);
  }
});