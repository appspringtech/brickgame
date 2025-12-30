// Brick Game - Main game logic
// Designed for 3-year-olds: large blocks, drag and drop, no text, positive feedback

const GRID_SIZE = 30; // Snap-to-grid size in pixels
const SNAP_THRESHOLD = 40; // How close bricks need to be to snap together

// Brick types with colors and sizes
const brickTypes = [
    { size: 'small', color: 'red' },
    { size: 'small', color: 'blue' },
    { size: 'small', color: 'green' },
    { size: 'medium', color: 'yellow' },
    { size: 'medium', color: 'purple' },
    { size: 'medium', color: 'orange' },
    { size: 'large', color: 'pink' },
    { size: 'large', color: 'red' },
    { size: 'square', color: 'blue' },
    { size: 'square', color: 'green' },
    { size: 'tall', color: 'yellow' },
    { size: 'tall', color: 'purple' }
];

// Game state
let draggedBrick = null;
let offsetX = 0;
let offsetY = 0;
let bricks = [];
let brickIdCounter = 0;

// Sound settings
let soundEnabled = true;

// Initialize the game
function init() {
    const brickPalette = document.getElementById('brickPalette');
    const buildingArea = document.getElementById('buildingArea');
    
    // Create brick templates in the toolbar
    brickTypes.forEach(type => {
        const template = createBrickTemplate(type.size, type.color);
        brickPalette.appendChild(template);
    });
    
    // Set up event listeners for the building area
    buildingArea.addEventListener('mousemove', handleMouseMove);
    buildingArea.addEventListener('mouseup', handleMouseUp);
    
    console.log('Brick Game initialized');
}

// Create a brick template in the toolbar
function createBrickTemplate(size, color) {
    const template = document.createElement('div');
    template.className = `brick-template brick-${size} brick-${color}`;
    template.dataset.size = size;
    template.dataset.color = color;
    
    template.addEventListener('mousedown', (e) => {
        e.preventDefault();
        playSound('pickupSound');
        createBrickFromTemplate(e, size, color);
    });
    
    return template;
}

// Create a new brick from a template
function createBrickFromTemplate(e, size, color) {
    const buildingArea = document.getElementById('buildingArea');
    const rect = buildingArea.getBoundingClientRect();
    
    const brick = document.createElement('div');
    brick.className = `brick brick-${size} brick-${color}`;
    brick.id = `brick-${brickIdCounter++}`;
    
    const brickData = {
        id: brick.id,
        element: brick,
        size: size,
        color: color,
        x: 0,
        y: 0
    };
    
    bricks.push(brickData);
    buildingArea.appendChild(brick);
    
    // Calculate offset for smooth dragging
    const brickRect = brick.getBoundingClientRect();
    offsetX = brickRect.width / 2;
    offsetY = brickRect.height / 2;
    
    // Position new brick near center of building area
    const centerX = rect.width / 2 - brickRect.width / 2;
    const centerY = rect.height / 2 - brickRect.height / 2;
    
    // Add some randomness so bricks don't stack exactly on top of each other
    const randomOffsetX = (Math.random() - 0.5) * 100;
    const randomOffsetY = (Math.random() - 0.5) * 100;
    
    const x = centerX + randomOffsetX;
    const y = centerY + randomOffsetY;
    
    brick.style.left = x + 'px';
    brick.style.top = y + 'px';
    
    brickData.x = x;
    brickData.y = y;
    
    // Start dragging immediately
    draggedBrick = brickData;
    brick.classList.add('dragging');
    
    // Set up drag listeners on the brick itself
    brick.addEventListener('mousedown', handleBrickMouseDown);
}

// Handle mouse down on existing brick
function handleBrickMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const brick = e.currentTarget;
    const brickData = bricks.find(b => b.id === brick.id);
    
    if (brickData) {
        playSound('pickupSound');
        draggedBrick = brickData;
        brick.classList.add('dragging');
        
        const buildingArea = document.getElementById('buildingArea');
        const areaRect = buildingArea.getBoundingClientRect();
        const brickRect = brick.getBoundingClientRect();
        
        offsetX = e.clientX - brickRect.left;
        offsetY = e.clientY - brickRect.top;
    }
}

// Handle mouse move
function handleMouseMove(e) {
    if (!draggedBrick) return;
    
    const buildingArea = document.getElementById('buildingArea');
    const rect = buildingArea.getBoundingClientRect();
    
    let x = e.clientX - rect.left - offsetX;
    let y = e.clientY - rect.top - offsetY;
    
    // Keep brick within bounds
    const brickRect = draggedBrick.element.getBoundingClientRect();
    x = Math.max(0, Math.min(x, rect.width - brickRect.width));
    y = Math.max(0, Math.min(y, rect.height - brickRect.height));
    
    draggedBrick.element.style.left = x + 'px';
    draggedBrick.element.style.top = y + 'px';
    
    draggedBrick.x = x;
    draggedBrick.y = y;
}

// Handle mouse up
function handleMouseUp(e) {
    if (!draggedBrick) return;
    
    const brick = draggedBrick.element;
    brick.classList.remove('dragging');
    
    // Snap to grid for easier stacking
    let snapped = false;
    const snapPos = snapToNearbyBrick(draggedBrick);
    
    if (snapPos) {
        brick.style.left = snapPos.x + 'px';
        brick.style.top = snapPos.y + 'px';
        draggedBrick.x = snapPos.x;
        draggedBrick.y = snapPos.y;
        
        brick.classList.add('snapping');
        setTimeout(() => brick.classList.remove('snapping'), 300);
        
        playSound('snapSound');
        snapped = true;
    } else {
        // Snap to grid
        const gridX = Math.round(draggedBrick.x / GRID_SIZE) * GRID_SIZE;
        const gridY = Math.round(draggedBrick.y / GRID_SIZE) * GRID_SIZE;
        
        brick.style.left = gridX + 'px';
        brick.style.top = gridY + 'px';
        draggedBrick.x = gridX;
        draggedBrick.y = gridY;
        
        playSound('placeSound');
    }
    
    // Create sparkle effect
    createSparkles(
        draggedBrick.x + brick.offsetWidth / 2,
        draggedBrick.y + brick.offsetHeight / 2
    );
    
    draggedBrick = null;
}

// Snap brick to nearby bricks for easy stacking
function snapToNearbyBrick(currentBrick) {
    const brick = currentBrick.element;
    const brickRect = {
        left: currentBrick.x,
        top: currentBrick.y,
        right: currentBrick.x + brick.offsetWidth,
        bottom: currentBrick.y + brick.offsetHeight,
        width: brick.offsetWidth,
        height: brick.offsetHeight
    };
    
    // Check all other bricks for snap points
    for (let otherBrick of bricks) {
        if (otherBrick.id === currentBrick.id) continue;
        
        const otherElement = otherBrick.element;
        const otherRect = {
            left: otherBrick.x,
            top: otherBrick.y,
            right: otherBrick.x + otherElement.offsetWidth,
            bottom: otherBrick.y + otherElement.offsetHeight,
            width: otherElement.offsetWidth,
            height: otherElement.offsetHeight
        };
        
        // Check if we can snap on top
        if (Math.abs(brickRect.bottom - otherRect.top) < SNAP_THRESHOLD &&
            Math.abs(brickRect.left - otherRect.left) < SNAP_THRESHOLD) {
            return {
                x: otherRect.left,
                y: otherRect.top - brickRect.height
            };
        }
        
        // Check if we can snap below
        if (Math.abs(brickRect.top - otherRect.bottom) < SNAP_THRESHOLD &&
            Math.abs(brickRect.left - otherRect.left) < SNAP_THRESHOLD) {
            return {
                x: otherRect.left,
                y: otherRect.bottom
            };
        }
        
        // Check if we can snap to the right
        if (Math.abs(brickRect.left - otherRect.right) < SNAP_THRESHOLD &&
            Math.abs(brickRect.top - otherRect.top) < SNAP_THRESHOLD) {
            return {
                x: otherRect.right,
                y: otherRect.top
            };
        }
        
        // Check if we can snap to the left
        if (Math.abs(brickRect.right - otherRect.left) < SNAP_THRESHOLD &&
            Math.abs(brickRect.top - otherRect.top) < SNAP_THRESHOLD) {
            return {
                x: otherRect.left - brickRect.width,
                y: otherRect.top
            };
        }
    }
    
    return null;
}

// Create sparkle effect when placing brick
function createSparkles(x, y) {
    const sparkleContainer = document.getElementById('sparkleContainer');
    const sparkleEmojis = ['✨', '⭐', '🌟', '💫', '🌈'];
    
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
        
        const angle = (Math.PI * 2 * i) / 6;
        const distance = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.setProperty('--tx', tx + 'px');
        sparkle.style.setProperty('--ty', ty + 'px');
        
        sparkleContainer.appendChild(sparkle);
        
        // Remove after animation
        setTimeout(() => {
            sparkleContainer.removeChild(sparkle);
        }, 1000);
    }
}

// Play sound effect
function playSound(soundId) {
    if (!soundEnabled) return;
    
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.volume = 0.3; // Keep sounds gentle
        sound.play().catch(err => {
            // Silently handle play errors (e.g., user hasn't interacted yet)
            console.log('Sound play prevented:', err.message);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
