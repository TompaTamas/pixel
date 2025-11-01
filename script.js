const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');
const restartBtn = document.getElementById('restartBtn');
const closeBtn = document.getElementById('closeBtn');

// Setup canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Animation state
let animationState = 'walking';
let animationFrame = 0;
let girlX = -100;
let boyX = -150;
let flowerShopX = canvas.width * 0.7;
let roseGiven = false;
let kissFrame = 0;
let animationComplete = false;

// Pixel size
const PIXEL = 4;

// Draw pixel function
function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, PIXEL, PIXEL);
}

// Draw girl character
function drawGirl(x, y, frame) {
    const colors = {
        skin: '#FFD1A3',
        hair: '#FFD700',
        glasses: '#333333',
        sweater: '#001f54',
        pants: '#808080',
        boots: '#D4A017'
    };
    
    // Legs animation
    const legOffset = Math.floor(frame / 10) % 2;
    
    // Left boot
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 4; j++) {
            drawPixel(x + i * PIXEL, y + (20 + j + (legOffset === 0 ? 1 : 0)) * PIXEL, colors.boots);
        }
    }
    
    // Right boot
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 4; j++) {
            drawPixel(x + (5 + i) * PIXEL, y + (20 + j + (legOffset === 1 ? 1 : 0)) * PIXEL, colors.boots);
        }
    }
    
    // Left leg (pants)
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 6; j++) {
            drawPixel(x + i * PIXEL, y + (14 + j) * PIXEL, colors.pants);
        }
    }
    
    // Right leg (pants)
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 6; j++) {
            drawPixel(x + (5 + i) * PIXEL, y + (14 + j) * PIXEL, colors.pants);
        }
    }
    
    // Sweater body
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 7; j++) {
            drawPixel(x + i * PIXEL, y + (7 + j) * PIXEL, colors.sweater);
        }
    }
    
    // BOSTON text on sweater (simplified)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${PIXEL * 2}px monospace`;
    ctx.fillText('B', x + PIXEL, y + 10 * PIXEL);
    
    // Arms
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 5; j++) {
            drawPixel(x + (-2 + i) * PIXEL, y + (8 + j) * PIXEL, colors.sweater);
            drawPixel(x + (8 + i) * PIXEL, y + (8 + j) * PIXEL, colors.sweater);
        }
    }
    
    // Hands
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 2; j++) {
            drawPixel(x + (-2 + i) * PIXEL, y + (13 + j) * PIXEL, colors.skin);
            drawPixel(x + (8 + i) * PIXEL, y + (13 + j) * PIXEL, colors.skin);
        }
    }
    
    // Head
    for(let i = 0; i < 6; i++) {
        for(let j = 0; j < 5; j++) {
            drawPixel(x + (1 + i) * PIXEL, y + (2 + j) * PIXEL, colors.skin);
        }
    }
    
    // Hair
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 3; j++) {
            drawPixel(x + i * PIXEL, y + j * PIXEL, colors.hair);
        }
    }
    
    // Glasses frame
    drawPixel(x + 2 * PIXEL, y + 4 * PIXEL, colors.glasses);
    drawPixel(x + 3 * PIXEL, y + 4 * PIXEL, colors.glasses);
    drawPixel(x + 4 * PIXEL, y + 4 * PIXEL, colors.glasses);
    drawPixel(x + 5 * PIXEL, y + 4 * PIXEL, colors.glasses);
    
    // Eyes
    drawPixel(x + 2 * PIXEL, y + 4 * PIXEL, '#000000');
    drawPixel(x + 5 * PIXEL, y + 4 * PIXEL, '#000000');
}

// Draw boy character
function drawBoy(x, y, frame) {
    const colors = {
        skin: '#FFDBAC',
        jacket: '#654321',
        pants: '#1a1a1a',
        shoes: '#000000',
        cap: '#FFFFFF',
        capNasa: '#FF0000'
    };
    
    const legOffset = Math.floor(frame / 10) % 2;
    
    // Left shoe
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            drawPixel(x + i * PIXEL, y + (21 + j + (legOffset === 0 ? 1 : 0)) * PIXEL, colors.shoes);
        }
    }
    
    // Right shoe
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            drawPixel(x + (5 + i) * PIXEL, y + (21 + j + (legOffset === 1 ? 1 : 0)) * PIXEL, colors.shoes);
        }
    }
    
    // Jogger pants
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 7; j++) {
            drawPixel(x + i * PIXEL, y + (14 + j) * PIXEL, colors.pants);
            drawPixel(x + (5 + i) * PIXEL, y + (14 + j) * PIXEL, colors.pants);
        }
    }
    
    // Leather jacket
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 7; j++) {
            drawPixel(x + i * PIXEL, y + (7 + j) * PIXEL, colors.jacket);
        }
    }
    
    // Jacket collar
    drawPixel(x + 1 * PIXEL, y + 7 * PIXEL, '#543210');
    drawPixel(x + 6 * PIXEL, y + 7 * PIXEL, '#543210');
    
    // Arms
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 5; j++) {
            drawPixel(x + (-2 + i) * PIXEL, y + (8 + j) * PIXEL, colors.jacket);
            drawPixel(x + (8 + i) * PIXEL, y + (8 + j) * PIXEL, colors.jacket);
        }
    }
    
    // Hands
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 2; j++) {
            drawPixel(x + (-2 + i) * PIXEL, y + (13 + j) * PIXEL, colors.skin);
            drawPixel(x + (8 + i) * PIXEL, y + (13 + j) * PIXEL, colors.skin);
        }
    }
    
    // Head
    for(let i = 0; i < 6; i++) {
        for(let j = 0; j < 4; j++) {
            drawPixel(x + (1 + i) * PIXEL, y + (3 + j) * PIXEL, colors.skin);
        }
    }
    
    // Baseball cap
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 3; j++) {
            drawPixel(x + i * PIXEL, y + j * PIXEL, colors.cap);
        }
    }
    
    // Cap visor
    for(let i = 0; i < 10; i++) {
        drawPixel(x + (-1 + i) * PIXEL, y + 2 * PIXEL, colors.cap);
    }
    
    // NASA logo (simplified red)
    drawPixel(x + 3 * PIXEL, y + 1 * PIXEL, colors.capNasa);
    drawPixel(x + 4 * PIXEL, y + 1 * PIXEL, colors.capNasa);
    
    // Eyes
    drawPixel(x + 2 * PIXEL, y + 4 * PIXEL, '#000000');
    drawPixel(x + 5 * PIXEL, y + 4 * PIXEL, '#000000');
    
    // Smile
    drawPixel(x + 3 * PIXEL, y + 6 * PIXEL, '#000000');
    drawPixel(x + 4 * PIXEL, y + 6 * PIXEL, '#000000');
}

// Draw flower shop
function drawFlowerShop(x, y) {
    // Shop building
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y - 80, 60, 80);
    
    // Roof
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 80);
    ctx.lineTo(x + 30, y - 100);
    ctx.lineTo(x + 70, y - 80);
    ctx.closePath();
    ctx.fill();
    
    // Window
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + 10, y - 60, 20, 20);
    
    // Door
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + 35, y - 50, 15, 50);
    
    // Sign
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(x + 5, y - 95, 50, 10);
    ctx.fillStyle = '#FF1493';
    ctx.font = '8px Arial';
    ctx.fillText('VIRÁG', x + 8, y - 87);
    
    // Flowers in window
    const flowerColors = ['#FF69B4', '#FFD700', '#FF6347'];
    for(let i = 0; i < 3; i++) {
        ctx.fillStyle = flowerColors[i];
        ctx.beginPath();
        ctx.arc(x + 15 + i * 5, y - 45, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw rose
function drawRose(x, y) {
    // Stem
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 20);
    ctx.stroke();
    
    // Leaves
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.ellipse(x - 3, y - 10, 3, 5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 3, y - 15, 3, 5, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Rose head
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.arc(x, y - 20, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Rose details
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.arc(x - 2, y - 21, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 2, y - 19, 2, 0, Math.PI * 2);
    ctx.fill();
}

// Draw heart
function drawHeart(x, y, size) {
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x - size, y + size / 3);
    ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.5, x, y + size * 2);
    ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size, x + size, y + size / 3);
    ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
    ctx.fill();
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const groundY = canvas.height - 100;
    
    if (!animationComplete) {
        animationFrame++;
        
        // Walking to shop
        if (animationState === 'walking') {
            girlX += 1;
            boyX += 1;
            
            drawFlowerShop(flowerShopX, groundY);
            drawGirl(girlX, groundY - 96, animationFrame);
            drawBoy(boyX, groundY - 96, animationFrame);
            
            if (boyX >= flowerShopX - 80) {
                animationState = 'atShop';
                animationFrame = 0;
            }
        }
        
        // At shop, boy gets rose
        else if (animationState === 'atShop') {
            drawFlowerShop(flowerShopX, groundY);
            drawGirl(girlX, groundY - 96, 0);
            drawBoy(boyX, groundY - 96, 0);
            
            if (animationFrame > 60) {
                animationState = 'givingRose';
                animationFrame = 0;
            }
        }
        
        // Boy gives rose to girl
        else if (animationState === 'givingRose') {
            drawFlowerShop(flowerShopX, groundY);
            drawGirl(girlX, groundY - 96, 0);
            drawBoy(boyX, groundY - 96, 0);
            
            const roseX = boyX + 40 - (animationFrame * 0.5);
            const roseY = groundY - 60;
            drawRose(roseX, roseY);
            
            if (animationFrame > 80) {
                roseGiven = true;
                animationState = 'kissing';
                animationFrame = 0;
            }
        }
        
        // Kissing scene
        else if (animationState === 'kissing') {
            drawFlowerShop(flowerShopX, groundY);
            
            // Move characters closer
            const targetX = (girlX + boyX) / 2;
            if (Math.abs(girlX - boyX) > 20) {
                girlX += (targetX - girlX) * 0.05;
                boyX += (targetX + 10 - boyX) * 0.05;
            }
            
            drawGirl(girlX, groundY - 96, 0);
            drawBoy(boyX, groundY - 96, 0);
            
            if (roseGiven) {
                drawRose(girlX + 20, groundY - 60);
            }
            
            // Hearts animation
            if (animationFrame > 30) {
                for (let i = 0; i < 3; i++) {
                    const heartY = groundY - 120 - (animationFrame - 30 + i * 20) % 100;
                    const heartX = (girlX + boyX) / 2 + 20 + Math.sin((animationFrame + i * 40) * 0.1) * 20;
                    const alpha = 1 - ((animationFrame - 30 + i * 20) % 100) / 100;
                    ctx.globalAlpha = alpha;
                    drawHeart(heartX, heartY, 10);
                    ctx.globalAlpha = 1;
                }
            }
            
            if (animationFrame > 150) {
                animationComplete = true;
                controls.classList.remove('hidden');
            }
        }
    }
    
    requestAnimationFrame(animate);
}

// Restart animation
function restart() {
    animationState = 'walking';
    animationFrame = 0;
    girlX = -100;
    boyX = -150;
    roseGiven = false;
    kissFrame = 0;
    animationComplete = false;
    controls.classList.add('hidden');
}

// Event listeners
restartBtn.addEventListener('click', restart);
closeBtn.addEventListener('click', () => {
    window.close();
    // If window.close() doesn't work (most modern browsers block it)
    if (!window.closed) {
        alert('Kérlek, zárd be manuálisan a böngésző tabot!');
    }
});

// Start animation
animate();