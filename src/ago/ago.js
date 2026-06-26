const UNIFORM_SEPARATOR = " ⬆ in order to "; 
const TITLE_GOAL = "describe goal: ";
const TITLE_SITUATION = "describe current situation: ";
const TITLE_PREFIX_OBJECTIVE = "Objective ";

let dynamicFlowData = [
    { id: Date.now() + 1, textareaVal: TITLE_GOAL, width: '50px', height: '50px' },
    { id: Date.now() + 2, textareaVal: TITLE_SITUATION, width: '50px', height: '50px' }
];

document.addEventListener('input', function(event) {
    const el = event.target;
    if (el.tagName === 'TEXTAREA') {
        const itemId = Number(el.dataset.id);
        const itemIndex = dynamicFlowData.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            const itemData = dynamicFlowData[itemIndex];
            
            let expectedTitle = getExpectedTitle(itemIndex);

            preserveTitle(el, expectedTitle);

            if (itemIndex == 0) {
                updateTabTitleBasedOnGoal(el.value);
            }

            const [newWidth, newHeight] = getTargetSize(el);
            updateTargetSize(el, newWidth, newHeight);
            preserveItemData(el, itemData, newWidth, newHeight);
        }
    }
});

function toggleVisibility() {
  const div = document.getElementById("principles-processes");
  div.classList.toggle("hidden");
}

function preserveTitle(el, expectedTitle) {
    if (!el.value.startsWith(expectedTitle)) {
        const userEnteredText = el.value.replace(expectedTitle.trim(), "").trimStart();
        el.value = expectedTitle + userEnteredText;
    }
}

function preserveItemData(el, itemData, newWidth, newHeight) {
    itemData.textareaVal = el.value;
    itemData.width = newWidth;
    itemData.height = newHeight;
}

function updateTargetSize(el, newWidth, newHeight) {
    el.style.width = newWidth;
    el.style.height = newHeight;
}

function getTargetSize(el) {
    el.style.width = 'auto';
    el.style.height = '50px';
    
    const newWidth = `${el.scrollWidth}px`;
    const newHeight = `${el.scrollHeight}px`;

    return [newWidth, newHeight];
}

function updateTabTitleBasedOnGoal(textAreaVal) {
    let rawUserGoal = textAreaVal.substring(TITLE_GOAL.length).trim();
    document.title = rawUserGoal || "goal";
}

function getExpectedTitle(itemIndex) {
    let expectedTitle = "";
    let totalItems = dynamicFlowData.length;
    if (itemIndex === 0) {
        expectedTitle = TITLE_GOAL;
    } else if (itemIndex === totalItems - 1) {
        expectedTitle = TITLE_SITUATION;
    } else {
        expectedTitle = `${TITLE_PREFIX_OBJECTIVE}${totalItems-1-itemIndex}: `;
    }
    return expectedTitle;
}

function createTextArea(item) {
    let textarea = document.createElement('textarea');
    textarea.className = 'auto-resize-textarea';
    textarea.value = item.textareaVal;
    textarea.dataset.id = item.id; 
    textarea.style.width = item.width;
    textarea.style.height = item.height;
    return textarea
}

function createObjectWrapper() {
    let objWrapper = document.createElement('div');
    objWrapper.className = 'obj-wrapper';
    return objWrapper;
}

function createRemoveBtn(item) {
    let removeBtn = document.createElement('button');
    removeBtn.innerText = '×';
    removeBtn.className = 'obj-remove-btn';
    removeBtn.onclick = () => removeTextArea(item.id);
    return removeBtn;
}

function createAddBtn(index) {
    const addBtn = document.createElement('button');
    addBtn.innerText = '+';
    addBtn.className = 'obj-add-btn';
    addBtn.onclick = () => addTextAreaAfter(index);
    return addBtn;
}

function createSeperatorSpan() {
    let separatorSpan = document.createElement('span');
    separatorSpan.className = 'obj-seperator';
    separatorSpan.innerText = UNIFORM_SEPARATOR;
    return separatorSpan;
}

function createNewDataItem(initialText) {
    let newItem = {
        id: Date.now(),
        textareaVal: initialText,
        width: '50px',
        height: '50px'
    };
    return newItem;
}

function renderFlow() {
    const container = document.getElementById('ago-container');
    container.innerHTML = ''; 

    dynamicFlowData.forEach((item, index) => {
        let assignedTitle = getExpectedTitle(index);

        if (!item.textareaVal.startsWith(assignedTitle)) {
            const rawInput = item.textareaVal.replace(/^(describe goal:|describe current situation:|Objective \d+:)/, "").trimStart();
            item.textareaVal = assignedTitle + rawInput;
        }

        let objWrapper = createObjectWrapper();

        let textarea = createTextArea(item);
        objWrapper.appendChild(textarea);

        const isFirst = (index === 0);
        const isLast = (index === dynamicFlowData.length - 1);

        if (!isFirst && !isLast) {
            let removeBtn = createRemoveBtn(item);
            objWrapper.appendChild(removeBtn);
        }

        if (!isLast) {
            let addBtn = createAddBtn(index);
            objWrapper.appendChild(addBtn);
        }

        container.appendChild(objWrapper);

        if (!isLast) {
            let separatorSpan = createSeperatorSpan();
            container.appendChild(separatorSpan);
        }
    });
}

function addTextAreaAfter(index) {
    const targetIndex = index + 1;
    const initialText = `${TITLE_PREFIX_OBJECTIVE}${targetIndex}: `;

    let newItem = createNewDataItem(initialText);
    
    dynamicFlowData.splice(targetIndex, 0, newItem);
    renderFlow();
    
    const newEl = document.querySelector(`textarea[data-id="${newItem.id}"]`);
    if (newEl) {
        newEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

function removeTextArea(idToKill) {
    dynamicFlowData = dynamicFlowData.filter(item => item.id !== idToKill);
    renderFlow();
    
    dynamicFlowData.forEach(item => {
        const el = document.querySelector(`textarea[data-id="${item.id}"]`);
        if (el) el.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

// Initial Run

// todo: create function to invoke render flow, toggle visitblity, dispatchi
// events that can be used repeatedly
renderFlow();
toggleVisibility();
dynamicFlowData.forEach(item => {
    const el = document.querySelector(`textarea[data-id="${item.id}"]`);
    if (el) el.dispatchEvent(new Event('input', { bubbles: true }));
});
const container = document.getElementById('ago-container');
container.addEventListener('focusin', (event) => {
    // TODO: instead of creating new event listener for each textarea, 
    // get the id of text area and only create event for that one
    if (event.target.tagName == 'TEXTAREA') {
        toggleVisibility();
    }
});
container.addEventListener('focusout', (event) => {
    if (event.target.tagName == 'TEXTAREA') {
        toggleVisibility();
    }
});
