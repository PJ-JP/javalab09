function crearPecera(dimensiones) {
    const peceraContainer = document.getElementById('pecera-container');

    const nemoArea = document.getElementById('nemo-area');
    const doryArea = document.getElementById('dory-area');

    peceraContainer.innerHTML = '';

    peceraContainer.style.gridTemplateColumns = `repeat(${dimensiones}, 1fr)`;
    peceraContainer.style.gridTemplateRows = `repeat(${dimensiones}, 1fr)`;
    peceraContainer.style.width = `${dimensiones * 50 + (dimensiones - 1) * 2 + 10}px`;
    peceraContainer.style.height = `${dimensiones * 50 + (dimensiones - 1) * 2 + 10}px`;

    for (let i = 0; i < dimensiones * dimensiones; i++) {
        const celda = document.createElement('div');
        celda.classList.add('pecera-celda');
        peceraContainer.appendChild(celda);
    }

    if (nemoArea) peceraContainer.appendChild(nemoArea);
    if (doryArea) peceraContainer.appendChild(doryArea);
}

const nemoCounterDisplay = document.getElementById('nemo-counter');
const doryCounterDisplay = document.getElementById('dory-counter');
const nemoFishImg = document.getElementById('nemo-fish');
const doryFishImg = document.getElementById('dory-fish');
const cleanPeceraBtn = document.getElementById('clean-pecera-btn');
const peceraContainer = document.getElementById('pecera-container');
const nemoDropArea = document.getElementById('nemo-area');
const doryDropArea = document.getElementById('dory-area');


let colorIntervalId;
const INITIAL_HUE = 200;
const TARGET_HUE = 120;
let currentPeceraHue = INITIAL_HUE;

function initializeCounters() {
    let nemoCount = parseInt(localStorage.getItem('nemoCount')) || 0;
    nemoCounterDisplay.textContent = nemoCount;

    let doryCount = parseInt(sessionStorage.getItem('doryCount')) || 0;
    doryCounterDisplay.textContent = doryCount;
}

function incrementNemoCount() {
    let nemoCount = parseInt(localStorage.getItem('nemoCount')) || 0;
    nemoCount++;
    localStorage.setItem('nemoCount', nemoCount);
    nemoCounterDisplay.textContent = nemoCount;
}

function incrementDoryCount() {
    let doryCount = parseInt(sessionStorage.getItem('doryCount')) || 0;
    doryCount++;
    sessionStorage.setItem('doryCount', doryCount);
    doryCounterDisplay.textContent = doryCount;
}

function updatePeceraColor() {
    currentPeceraHue -= 0.5;
    if (currentPeceraHue < TARGET_HUE) {
        currentPeceraHue = INITIAL_HUE;
    }
    peceraContainer.style.backgroundColor = `hsl(${currentPeceraHue}, 70%, 70%)`;
}

function startColorChangeCycle() {
    if (colorIntervalId) {
        clearInterval(colorIntervalId);
    }
    currentPeceraHue = INITIAL_HUE;
    peceraContainer.style.backgroundColor = `hsl(${currentPeceraHue}, 70%, 70%)`;

    colorIntervalId = setInterval(updatePeceraColor, 1000);
}

let bubbleIntervalId;
let currentDraggedBubble = null;

function createBubble() {
    const bubbleType = Math.random() < 0.5 ? 'nemo' : 'dory';
    const bubble = document.createElement('div');
    bubble.classList.add('bubble', `bubble-${bubbleType}`);
    bubble.textContent = '💧';
    bubble.setAttribute('draggable', true);
    bubble.dataset.fishType = bubbleType;

    const peceraRect = peceraContainer.getBoundingClientRect();
    const startX = Math.random() * (peceraRect.width - 40);
    bubble.style.top = '-50px';
    bubble.style.left = `${startX}px`;

    peceraContainer.appendChild(bubble);

    // *** ¡Añade estas líneas para iniciar la animación de flotar! ***
    setTimeout(() => {
        bubble.style.top = `${peceraRect.height + 50}px`; // Que baje hasta 50px por debajo del final de la pecera
    }, 10); // Un pequeño retraso para asegurar que la transición se aplique

    bubble.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', bubble.dataset.fishType);
        currentDraggedBubble = bubble;
        setTimeout(() => {
            bubble.style.opacity = '0.5';
        }, 0);
    });

    bubble.addEventListener('dragend', (event) => {
        if (currentDraggedBubble) {
            currentDraggedBubble.style.opacity = '1';
            currentDraggedBubble = null;
        }
    });

    // Esta parte ya la tenías para remover la burbuja si no se interactúa con ella
    setTimeout(() => {
        if (bubble.parentNode === peceraContainer && !currentDraggedBubble) {
            bubble.remove();
        }
    }, 10000);
}

function startBubbleCreation() {
    if (bubbleIntervalId) {
        clearInterval(bubbleIntervalId);
    }
    bubbleIntervalId = setInterval(createBubble, 2000);
}

nemoDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    nemoDropArea.classList.add('drag-over');
});
doryDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    doryDropArea.classList.add('drag-over');
});

nemoDropArea.addEventListener('dragleave', () => {
    nemoDropArea.classList.remove('drag-over');
});
doryDropArea.addEventListener('dragleave', () => {
    doryDropArea.classList.remove('drag-over');
});

nemoDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    nemoDropArea.classList.remove('drag-over');

    const bubbleType = event.dataTransfer.getData('text/plain');
    if (bubbleType === 'nemo' && currentDraggedBubble) {
        incrementNemoCount();
        currentDraggedBubble.remove();
        currentDraggedBubble = null;
    } else if (currentDraggedBubble) {
        currentDraggedBubble.style.transition = 'none';
        currentDraggedBubble.style.top = '-50px';
        currentDraggedBubble.style.left = `${Math.random() * (peceraContainer.getBoundingClientRect().width - 40)}px`;
        currentDraggedBubble.style.opacity = '1';
        currentDraggedBubble = null;
    }
});

doryDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    doryDropArea.classList.remove('drag-over');

    const bubbleType = event.dataTransfer.getData('text/plain');
    if (bubbleType === 'dory' && currentDraggedBubble) {
        incrementDoryCount();
        currentDraggedBubble.remove();
        currentDraggedBubble = null;
    } else if (currentDraggedBubble) {
        currentDraggedBubble.style.transition = 'none';
        currentDraggedBubble.style.top = '-50px';
        currentDraggedBubble.style.left = `${Math.random() * (peceraContainer.getBoundingClientRect().width - 40)}px`;
        currentDraggedBubble.style.opacity = '1';
        currentDraggedBubble = null;
    }
});

nemoFishImg.addEventListener('click', incrementNemoCount);
doryFishImg.addEventListener('click', incrementDoryCount);

document.addEventListener('DOMContentLoaded', () => {
    crearPecera(6);
    initializeCounters();
    startColorChangeCycle();
    startBubbleCreation();
});

cleanPeceraBtn.addEventListener('click', () => {
    location.reload();
});