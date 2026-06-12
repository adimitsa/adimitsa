document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("unit-container");
  const cardFlow = document.getElementById("container-card-flow");
  const addButton = document.getElementById("add-new-card-btn");

  if (!container || !cardFlow || !addButton) return;

  let cardCount = 0;

  // --- 2D BIN-PACKING TREE GEOMETRY ENGINE ---
  const arrangeAndPackContainerTightly = () => {
    const cards = Array.from(cardFlow.querySelectorAll(".window-3d-card"));
    
    if (cards.length === 0) {
      container.style.width = "200px";
      container.style.height = "100px";
      return;
    }

    // Geometry parameters: Padding from outer box edge and separating gap size
    const INTERNAL_PADDING = 24; 
    const SEPARATOR_GAP = 16;   

    // Step 1: Map dimensions and sort elements from biggest area footprint to smallest
    const layoutItems = cards.map((card) => {
      return {
        element: card,
        w: (card.offsetWidth || 184) + SEPARATOR_GAP,
        h: (card.offsetHeight || 80) + SEPARATOR_GAP,
        area: ((card.offsetWidth || 184) + SEPARATOR_GAP) * ((card.offsetHeight || 80) + SEPARATOR_GAP)
      };
    });

    // Sort items descending to build a highly optimized packing layout tree
    layoutItems.sort((a, b) => b.area - a.area);

    // Step 2: Initialize tree node mesh roots
    // Start with a large initial boundary workspace width proxy that expands dynamically
    let blockWorkspaceWidth = 650; 
    let packingTreeRootNode = { x: 0, y: 0, w: blockWorkspaceWidth, h: 5000 };

    const searchTreeToInsertItem = (node, itemW, itemH) => {
      if (node.isUsed) {
        return searchTreeToInsertItem(node.rightChild, itemW, itemH) || 
               searchTreeToInsertItem(node.bottomChild, itemW, itemH);
      } else if (itemW <= node.w && itemH <= node.h) {
        // Create child branch tracks split along element dimensions
        node.isUsed = true;
        node.bottomChild = { x: node.x, y: node.y + itemH, w: node.w, h: node.h - itemH };
        node.rightChild  = { x: node.x + itemW, y: node.y, w: node.w - itemW, h: itemH };
        return node;
      }
      return null;
    };

    let extremeOuterBoundX = 0;
    let extremeOuterBoundY = 0;

    // Step 3: Loop items over spatial coordinate trees
    layoutItems.forEach((item) => {
      let fitCoordinateNode = searchTreeToInsertItem(packingTreeRootNode, item.w, item.h);
      
      if (fitCoordinateNode) {
        // Commit coordinate transforms relative to the box layout structure
        const finalLeftX = fitCoordinateNode.x + INTERNAL_PADDING;
        const finalTopY  = fitCoordinateNode.y + INTERNAL_PADDING;

        item.element.style.left = `${finalLeftX}px`;
        item.element.style.top  = `${finalTopY}px`;

        // Calculate maximum dimensions used by items minus empty trailing gap separations
        if (fitCoordinateNode.x + item.w - SEPARATOR_GAP > extremeOuterBoundX) {
          extremeOuterBoundX = fitCoordinateNode.x + item.w - SEPARATOR_GAP;
        }
        if (fitCoordinateNode.y + item.h - SEPARATOR_GAP > extremeOuterBoundY) {
          extremeOuterBoundY = fitCoordinateNode.y + item.h - SEPARATOR_GAP;
        }
      }
    });

    // Step 4: Shrink container borders tightly against elements (plus padding cushion)
    const packedWidthTarget  = extremeOuterBoundX + (INTERNAL_PADDING * 2);
    const packedHeightTarget = extremeOuterBoundY + (INTERNAL_PADDING * 2);

    container.style.width  = `${Math.max(200, packedWidthTarget)}px`;
    container.style.height = `${Math.max(120, packedHeightTarget)}px`;
  };

  // --- DYNAMIC CARD CREATION FLOW ---
  addButton.addEventListener("click", () => {
    cardCount++;

    const newCard = document.createElement("div");
    newCard.className = "window-3d-card pt-2 pb-1 px-2";
    
    const newTextarea = document.createElement("textarea");
    newTextarea.id = `unit-textarea-${cardCount}`;
    
    // Vary placeholder lengths slightly to test dynamic packing adjustments
    const variations = [
      "Task track logs",
      "Process optimization node vector",
      "Core unit shell tracking logic parameters",
      "Alpha profile",
      "Database schema query track cluster layout"
    ];
    newTextarea.placeholder = variations[cardCount % variations.length];
    newTextarea.className = "auto-textarea px-4 pt-3 pb-1 text-slate-900";

    newCard.appendChild(newTextarea);
    cardFlow.appendChild(newCard);

    // Native size sync routine matching textarea size properties
    const matchContentSize = () => {
      newTextarea.style.width  = "40px";
      newTextarea.style.height = "auto";

      const targetWidth  = Math.max(160, newTextarea.scrollWidth + 24);
      const targetHeight = Math.max(48,  newTextarea.scrollHeight);

      newTextarea.style.width  = `${targetWidth}px`;
      newTextarea.style.height = `${targetHeight}px`;
    };

    matchContentSize();
    
    newTextarea.addEventListener("input", () => {
      matchContentSize();
      // Instantly recalculate the 2D layout tree as typing updates card boundaries
      setTimeout(arrangeAndPackContainerTightly, 10);
    });

    newTextarea.focus();

    // Trigger full binary sorting pack pass
    setTimeout(arrangeAndPackContainerTightly, 50);
  });

  setTimeout(arrangeAndPackContainerTightly, 100);
  window.addEventListener("resize", arrangeAndPackContainerTightly);
});