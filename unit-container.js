document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("unit-container");
  const cardFlow  = document.getElementById("container-card-flow");
  const addButton = document.getElementById("add-new-card-btn");

  if (!container || !cardFlow || !addButton) return;

  let cardCount = 0;

  // --- SPACE-OPTIMIZED BIN PACKING ENGINE ---
  const arrangeAndPackContainerTightly = () => {
    const cards = Array.from(cardFlow.querySelectorAll(".window-3d-card"));
    
    if (cards.length === 0) {
      container.style.width = "220px";
      container.style.height = "120px";
      return;
    }

    const INTERNAL_PADDING = 24; 
    const SEPARATOR_GAP = 16;   

    // Map geometric bounding footprints
    const layoutItems = cards.map((card) => {
      return {
        element: card,
        w: (card.offsetWidth || 40) + SEPARATOR_GAP,
        h: (card.offsetHeight || 32) + SEPARATOR_GAP,
        area: (card.offsetWidth || 40) * (card.offsetHeight || 32)
      };
    });

    // Sort items by size to create an optimal 2D packing tree layout
    layoutItems.sort((a, b) => b.area - a.area);

    let blockWorkspaceWidth = 600; 
    let packingTreeRootNode = { x: 0, y: 0, w: blockWorkspaceWidth, h: 5000 };

    const searchTreeToInsertItem = (node, itemW, itemH) => {
      if (node.isUsed) {
        return searchTreeToInsertItem(node.rightChild, itemW, itemH) || 
               searchTreeToInsertItem(node.bottomChild, itemW, itemH);
      } else if (itemW <= node.w && itemH <= node.h) {
        node.isUsed = true;
        node.bottomChild = { x: node.x, y: node.y + itemH, w: node.w, h: node.h - itemH };
        node.rightChild  = { x: node.x + itemW, y: node.y, w: node.w - itemW, h: itemH };
        return node;
      }
      return null;
    };

    let extremeOuterBoundX = 0;
    let extremeOuterBoundY = 0;

    layoutItems.forEach((item) => {
      let fitCoordinateNode = searchTreeToInsertItem(packingTreeRootNode, item.w, item.h);
      
      if (fitCoordinateNode) {
        const finalLeftX = fitCoordinateNode.x + INTERNAL_PADDING;
        const finalTopY  = fitCoordinateNode.y + INTERNAL_PADDING;

        item.element.style.left = `${finalLeftX}px`;
        item.element.style.top  = `${finalTopY}px`;

        if (fitCoordinateNode.x + item.w - SEPARATOR_GAP > extremeOuterBoundX) {
          extremeOuterBoundX = fitCoordinateNode.x + item.w - SEPARATOR_GAP;
        }
        if (fitCoordinateNode.y + item.h - SEPARATOR_GAP > extremeOuterBoundY) {
          extremeOuterBoundY = fitCoordinateNode.y + item.h - SEPARATOR_GAP;
        }
      }
    });

    const packedWidthTarget  = extremeOuterBoundX + (INTERNAL_PADDING * 2);
    const packedHeightTarget = extremeOuterBoundY + (INTERNAL_PADDING * 2);

    container.style.width  = `${Math.max(220, packedWidthTarget)}px`;
    container.style.height = `${Math.max(120, packedHeightTarget)}px`;
  };

  // --- DYNAMIC CARD GENERATOR DOCK FLOW ---
  addButton.addEventListener("click", () => {
    cardCount++;

    // 1. Structural window-card frame creation
    const newCard = document.createElement("div");
    newCard.className = "window-3d-card p-0";
    
    // 2. Proportional auto-textarea input creation
    const newTextarea = document.createElement("textarea");
    newTextarea.id = `unit-textarea-${cardCount}`;
    newTextarea.placeholder = "Functional unit";
    newTextarea.className = "auto-textarea text-slate-900";
    newTextarea.rows = 1;

    newCard.appendChild(newTextarea);
    cardFlow.appendChild(newCard);

    // Initial proportional measurement pass
    if (typeof window.syncTextareaProportionalSize === "function") {
      window.syncTextareaProportionalSize(newTextarea);
    }

    // 3. Bind uniform sizing events identical to standalone components
    newTextarea.addEventListener("input", () => {
      window.syncTextareaProportionalSize(newTextarea);
      // Let the box size settle, then instantly update container boundaries
      setTimeout(arrangeAndPackContainerTightly, 10);
    });

    newCard.addEventListener("mousedown", (event) => {
      // Toggle the text reduction state globally on first click
      if (!window.hasBeenClickedToTypeGlobal) {
        window.hasBeenClickedToTypeGlobal = true;
        
        // Resize all textareas inside the container instantly to reflect the text reduction rule
        const allContainedTextareas = cardFlow.querySelectorAll(".auto-textarea");
        allContainedTextareas.forEach(el => window.syncTextareaProportionalSize(el));
      } else {
        window.syncTextareaProportionalSize(newTextarea);
      }

      if (document.activeElement !== newTextarea) {
        event.preventDefault();
        newTextarea.focus();
        newTextarea.setSelectionRange(newTextarea.value.length, newTextarea.value.length);
      }
      setTimeout(arrangeAndPackContainerTightly, 15);
    });

    newTextarea.focus();

    // Trigger full binary sorting pack pass
    setTimeout(arrangeAndPackContainerTightly, 50);
  });

  setTimeout(arrangeAndPackContainerTightly, 100);
  window.addEventListener("resize", arrangeAndPackContainerTightly);
});