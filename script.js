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
let girlX = -150;
let boyX = -220;
let flowerShopX = canvas.width * 0.65;
let roseGiven = false;
let animationComplete = false;
let roseX = 0;
let roseY = 0;

// Pixel size
const PIXEL = 5;

// Draw pixel function
function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), PIXEL, PIXEL);
}

// Draw girl character - more detailed
function drawGirl(x, y, frame, holdingRose = false) {
    const colors = {
        skin: '#FFD1A3',
        skinShadow: '#E8B888',
        hair: '#FFD700',
        hairShade: '#FFC700',
        glassesFrame: '#2C3E50',
        glassesLens: '#A8DADC',
        sweater: '#001f54',
        sweaterText: '#FFFFFF',
        pants: '#808080',
        pantsShade: '#6B6B6B',
        boots: '#D4A017',
        bootsShade: '#B8860B'
    };
    
    const walkCycle = Math.floor(frame / 8) % 4;
    const legSwing = [0, 1, 0, -1];
    const leftLegOffset = legSwing[walkCycle];
    const rightLegOffset = legSwing[(walkCycle + 2) % 4];
    const armSwing = Math.sin(frame * 0.15) * 2;
    
    // Left boot
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 5; j++) {
            const bootColor = j < 3 ? colors.boots : colors.bootsShade;
            drawPixel(x + i * PIXEL, y + (24 + j + leftLegOffset) * PIXEL, bootColor);
        }
    }
    // Boot sole
    for(let i = 0; i < 5; i++) {
        drawPixel(x + i * PIXEL, y + (29 + leftLegOffset) * PIXEL, '#654321');
    }
    
    // Right boot
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 5; j++) {
            const bootColor = j < 3 ? colors.boots : colors.bootsShade;
            drawPixel(x + (7 + i) * PIXEL, y + (24 + j + rightLegOffset) * PIXEL, bootColor);
        }
    }
    // Boot sole
    for(let i = 0; i < 5; i++) {
        drawPixel(x + (6 + i) * PIXEL, y + (29 + rightLegOffset) * PIXEL, '#654321');
    }
    
    // Left leg (pants) - more detailed
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 9; j++) {
            const pantColor = i === 0 || i === 3 ? colors.pantsShade : colors.pants;
            drawPixel(x + i * PIXEL, y + (15 + j + leftLegOffset * 0.5) * PIXEL, pantColor);
        }
    }
    
    // Right leg (pants)
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 9; j++) {
            const pantColor = i === 0 || i === 3 ? colors.pantsShade : colors.pants;
            drawPixel(x + (7 + i) * PIXEL, y + (15 + j + rightLegOffset * 0.5) * PIXEL, pantColor);
        }
    }
    
    // Sweater body - more detailed
    for(let i = 0; i < 11; i++) {
        for(let j = 0; j < 9; j++) {
            drawPixel(x + i * PIXEL, y + (6 + j) * PIXEL, colors.sweater);
        }
    }
    
    // BOSTON text on sweater - better font
    ctx.fillStyle = colors.sweaterText;
    ctx.font = `bold ${PIXEL * 1.8}px monospace`;
    ctx.fillText('BOSTON', x + PIXEL * 1.5, y + 11 * PIXEL);
    
    // Sweater collar
    for(let i = 2; i < 9; i++) {
        drawPixel(x + i * PIXEL, y + 6 * PIXEL, '#003380');
    }
    
    // Left arm
    const leftArmY = holdingRose ? -2 : armSwing;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 7; j++) {
            drawPixel(x + (-2 + i) * PIXEL, y + (7 + j + leftArmY) * PIXEL, colors.sweater);
        }
    }
    
    // Right arm
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 7; j++) {
            drawPixel(x + (10 + i) * PIXEL, y + (7 + j - armSwing) * PIXEL, colors.sweater);
        }
    }
    
    // Left hand
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            const handColor = j === 0 ? colors.skin : colors.skinShadow;
            drawPixel(x + (-2 + i) * PIXEL, y + (14 + j + leftArmY) * PIXEL, handColor);
        }
    }
    
    // Right hand
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            const handColor = j === 0 ? colors.skin : colors.skinShadow;
            drawPixel(x + (10 + i) * PIXEL, y + (14 + j - armSwing) * PIXEL, handColor);
        }
    }
    
    // Neck
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 2; j++) {
            drawPixel(x + (3.5 + i) * PIXEL, y + (4 + j) * PIXEL, colors.skin);
        }
    }
    
    // Head - more detailed
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 7; j++) {
            const faceColor = j > 4 ? colors.skinShadow : colors.skin;
            drawPixel(x + (1.5 + i) * PIXEL, y + (-3 + j) * PIXEL, faceColor);
        }
    }
    
    // Hair - detailed with layers
    // Top hair
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 4; j++) {
            const hairColor = j < 2 ? colors.hair : colors.hairShade;
            drawPixel(x + (0.5 + i) * PIXEL, y + (-6 + j) * PIXEL, hairColor);
        }
    }
    // Side hair
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 6; j++) {
            drawPixel(x + (0.5 + i) * PIXEL, y + (-3 + j) * PIXEL, colors.hairShade);
            drawPixel(x + (8.5 + i) * PIXEL, y + (-3 + j) * PIXEL, colors.hairShade);
        }
    }
    
    // Glasses frame - detailed
    // Left lens frame
    for(let i = 0; i < 3; i++) {
        drawPixel(x + (2.5 + i) * PIXEL, y + 0 * PIXEL, colors.glassesFrame);
        drawPixel(x + (2.5 + i) * PIXEL, y + 2 * PIXEL, colors.glassesFrame);
    }
    drawPixel(x + 2.5 * PIXEL, y + 1 * PIXEL, colors.glassesFrame);
    drawPixel(x + 5.5 * PIXEL, y + 1 * PIXEL, colors.glassesFrame);
    
    // Right lens frame
    for(let i = 0; i < 3; i++) {
        drawPixel(x + (6.5 + i) * PIXEL, y + 0 * PIXEL, colors.glassesFrame);
        drawPixel(x + (6.5 + i) * PIXEL, y + 2 * PIXEL, colors.glassesFrame);
    }
    drawPixel(x + 6.5 * PIXEL, y + 1 * PIXEL, colors.glassesFrame);
    drawPixel(x + 9.5 * PIXEL, y + 1 * PIXEL, colors.glassesFrame);
    
    // Bridge
    drawPixel(x + 5.5 * PIXEL, y + 1 * PIXEL, colors.glassesFrame);
    drawPixel(x + 6.5 * PIXEL, y + 1 * PIXEL, colors.glassesFrame);
    
    // Lenses (transparent blue)
    ctx.globalAlpha = 0.3;
    drawPixel(x + 3.5 * PIXEL, y + 1 * PIXEL, colors.glassesLens);
    drawPixel(x + 4.5 * PIXEL, y + 1 * PIXEL, colors.glassesLens);
    drawPixel(x + 7.5 * PIXEL, y + 1 * PIXEL, colors.glassesLens);
    drawPixel(x + 8.5 * PIXEL, y + 1 * PIXEL, colors.glassesLens);
    ctx.globalAlpha = 1;
    
    // Eyes
    drawPixel(x + 3.5 * PIXEL, y + 1 * PIXEL, '#5C4033');
    drawPixel(x + 7.5 * PIXEL, y + 1 * PIXEL, '#5C4033');
    
    // Eye highlights
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 3.5 * PIXEL + 1, y + 1 * PIXEL + 1, 2, 2);
    ctx.fillRect(x + 7.5 * PIXEL + 1, y + 1 * PIXEL + 1, 2, 2);
    
    // Nose
    drawPixel(x + 5.5 * PIXEL, y + 2.5 * PIXEL, colors.skinShadow);
    
    // Smile
    drawPixel(x + 4 * PIXEL, y + 3.5 * PIXEL, '#C0665C');
    drawPixel(x + 5 * PIXEL, y + 3.5 * PIXEL, '#C0665C');
    drawPixel(x + 6 * PIXEL, y + 3.5 * PIXEL, '#C0665C');
}

// Draw boy character - more detailed with black jacket
function drawBoy(x, y, frame, holdingRose = false) {
    const colors = {
        skin: '#FFDBAC',
        skinShadow: '#E8C29A',
        jacket: '#1a1a1a',
        jacketHighlight: '#2d2d2d',
        jacketShade: '#0d0d0d',
        pants: '#0a0a0a',
        pantsHighlight: '#1f1f1f',
        shoes: '#000000',
        shoeSole: '#333333',
        cap: '#F5F5F5',
        capShadow: '#D3D3D3',
        nasaRed: '#FC3D21',
        nasaBlue: '#0B3D91'
    };
    
    const walkCycle = Math.floor(frame / 8) % 4;
    const legSwing = [0, 1, 0, -1];
    const leftLegOffset = legSwing[walkCycle];
    const rightLegOffset = legSwing[(walkCycle + 2) % 4];
    const armSwing = Math.sin(frame * 0.15) * 2;
    
    // Left shoe - detailed
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            drawPixel(x + i * PIXEL, y + (25 + j + leftLegOffset) * PIXEL, colors.shoes);
        }
    }
    // Shoe sole with details
    for(let i = 0; i < 5; i++) {
        drawPixel(x + i * PIXEL, y + (29 + leftLegOffset) * PIXEL, colors.shoeSole);
    }
    // Shoe highlight
    drawPixel(x + PIXEL, y + (26 + leftLegOffset) * PIXEL, '#1a1a1a');
    
    // Right shoe
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            drawPixel(x + (7 + i) * PIXEL, y + (25 + j + rightLegOffset) * PIXEL, colors.shoes);
        }
    }
    for(let i = 0; i < 5; i++) {
        drawPixel(x + (6 + i) * PIXEL, y + (29 + rightLegOffset) * PIXEL, colors.shoeSole);
    }
    drawPixel(x + (8) * PIXEL, y + (26 + rightLegOffset) * PIXEL, '#1a1a1a');
    
    // Left jogger leg - elastic cuff detail
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 9; j++) {
            const legColor = i === 1 || i === 2 ? colors.pants : colors.pantsHighlight;
            drawPixel(x + i * PIXEL, y + (16 + j + leftLegOffset * 0.5) * PIXEL, legColor);
        }
    }
    // Elastic cuff
    for(let i = 0; i < 4; i++) {
        drawPixel(x + i * PIXEL, y + (24 + leftLegOffset * 0.5) * PIXEL, colors.pantsHighlight);
    }
    
    // Right jogger leg
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 9; j++) {
            const legColor = i === 1 || i === 2 ? colors.pants : colors.pantsHighlight;
            drawPixel(x + (7 + i) * PIXEL, y + (16 + j + rightLegOffset * 0.5) * PIXEL, legColor);
        }
    }
    for(let i = 0; i < 4; i++) {
        drawPixel(x + (7 + i) * PIXEL, y + (24 + rightLegOffset * 0.5) * PIXEL, colors.pantsHighlight);
    }
    
    // Black leather jacket body - detailed with highlights
    for(let i = 0; i < 11; i++) {
        for(let j = 0; j < 10; j++) {
            let jacketColor = colors.jacket;
            if (i === 0 || i === 10) jacketColor = colors.jacketShade;
            if (j === 0) jacketColor = colors.jacketHighlight;
            drawPixel(x + i * PIXEL, y + (6 + j) * PIXEL, jacketColor);
        }
    }
    
    // Jacket zipper
    for(let j = 0; j < 8; j++) {
        drawPixel(x + 5.5 * PIXEL, y + (7 + j) * PIXEL, '#404040');
    }
    
    // Jacket collar - detailed
    for(let i = 1; i < 4; i++) {
        for(let j = 0; j < 2; j++) {
            drawPixel(x + i * PIXEL, y + (6 + j) * PIXEL, colors.jacketHighlight);
            drawPixel(x + (7 + i) * PIXEL, y + (6 + j) * PIXEL, colors.jacketHighlight);
        }
    }
    
    // Jacket pockets
    for(let i = 0; i < 3; i++) {
        drawPixel(x + (1 + i) * PIXEL, y + 12 * PIXEL, colors.jacketShade);
        drawPixel(x + (7 + i) * PIXEL, y + 12 * PIXEL, colors.jacketShade);
    }
    
    // Left arm with rose holding position
    const leftArmY = holdingRose ? -3 : armSwing;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 8; j++) {
            const armColor = i === 0 ? colors.jacketShade : colors.jacket;
            drawPixel(x + (-2 + i) * PIXEL, y + (7 + j + leftArmY) * PIXEL, armColor);
        }
    }
    
    // Right arm
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 8; j++) {
            const armColor = i === 2 ? colors.jacketShade : colors.jacket;
            drawPixel(x + (10 + i) * PIXEL, y + (7 + j - armSwing) * PIXEL, armColor);
        }
    }
    
    // Left hand
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            const handColor = j === 0 ? colors.skin : colors.skinShadow;
            drawPixel(x + (-2 + i) * PIXEL, y + (15 + j + leftArmY) * PIXEL, handColor);
        }
    }
    
    // Right hand
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            const handColor = j === 0 ? colors.skin : colors.skinShadow;
            drawPixel(x + (10 + i) * PIXEL, y + (15 + j - armSwing) * PIXEL, handColor);
        }
    }
    
    // Neck
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 2; j++) {
            drawPixel(x + (3.5 + i) * PIXEL, y + (4 + j) * PIXEL, colors.skin);
        }
    }
    
    // Head - detailed
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 6; j++) {
            const faceColor = j > 4 ? colors.skinShadow : colors.skin;
            drawPixel(x + (1.5 + i) * PIXEL, y + (-1 + j) * PIXEL, faceColor);
        }
    }
    
    // Baseball cap - white with NASA logo
    // Cap crown
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 3; j++) {
            const capColor = j === 2 ? colors.capShadow : colors.cap;
            drawPixel(x + (0.5 + i) * PIXEL, y + (-6 + j) * PIXEL, capColor);
        }
    }
    
    // Cap visor
    for(let i = 0; i < 12; i++) {
        for(let j = 0; j < 2; j++) {
            const visorColor = j === 1 ? colors.capShadow : colors.cap;
            drawPixel(x + (-0.5 + i) * PIXEL, y + (-3 + j) * PIXEL, visorColor);
        }
    }
    
    // NASA logo on cap - simplified but recognizable
    // Red swoosh
    drawPixel(x + 2.5 * PIXEL, y + -5 * PIXEL, colors.nasaRed);
    drawPixel(x + 3.5 * PIXEL, y + -5 * PIXEL, colors.nasaRed);
    drawPixel(x + 4.5 * PIXEL, y + -4.5 * PIXEL, colors.nasaRed);
    // Blue circle
    drawPixel(x + 6 * PIXEL, y + -5 * PIXEL, colors.nasaBlue);
    drawPixel(x + 7 * PIXEL, y + -5 * PIXEL, colors.nasaBlue);
    
    // Eyes - detailed
    drawPixel(x + 3.5 * PIXEL, y + 1 * PIXEL, '#3d2817');
    drawPixel(x + 7.5 * PIXEL, y + 1 * PIXEL, '#3d2817');
    
    // Eye highlights
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 3.5 * PIXEL + 1, y + 1 * PIXEL + 1, 2, 2);
    ctx.fillRect(x + 7.5 * PIXEL + 1, y + 1 * PIXEL + 1, 2, 2);
    
    // Nose
    drawPixel(x + 5.5 * PIXEL, y + 2.5 * PIXEL, colors.skinShadow);
    
    // Smile - bigger
    for(let i = 0; i < 4; i++) {
        drawPixel(x + (3.5 + i) * PIXEL, y + 3.5 * PIXEL, '#C0665C');
    }
    drawPixel(x + 3 * PIXEL, y + 3 * PIXEL, '#C0665C');
    drawPixel(x + 7.5 * PIXEL, y + 3 * PIXEL, '#C0665C');
}

// Draw detailed flower shop
function drawFlowerShop(x, y) {
    // Shop building
    const gradient = ctx.createLinearGradient(x, y - 100, x + 80, y);
    gradient.addColorStop(0, '#A0522D');
    gradient.addColorStop(1, '#8B4513');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y - 100, 80, 100);
    
    // Building texture
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    for(let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y - 90 + i * 20);
        ctx.lineTo(x + 80, y - 90 + i * 20);
        ctx.stroke();
    }
    
    // Roof
    ctx.fillStyle = '#C04000';
    ctx.beginPath();
    ctx.moveTo(x - 15, y - 100);
    ctx.lineTo(x + 40, y - 125);
    ctx.lineTo(x + 95, y - 100);
    ctx.closePath();
    ctx.fill();
    
    // Roof shadow
    ctx.fillStyle = '#802800';
    ctx.beginPath();
    ctx.moveTo(x + 40, y - 125);
    ctx.lineTo(x + 95, y - 100);
    ctx.lineTo(x + 80, y - 100);
    ctx.closePath();
    ctx.fill();
    
    // Window frame
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + 10, y - 75, 28, 28);
    
    // Window glass
    const windowGradient = ctx.createLinearGradient(x + 12, y - 73, x + 36, y - 49);
    windowGradient.addColorStop(0, '#B8E0F6');
    windowGradient.addColorStop(1, '#87CEEB');
    ctx.fillStyle = windowGradient;
    ctx.fillRect(x + 12, y - 73, 24, 24);
    
    // Window reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(x + 13, y - 72, 10, 10);
    
    // Window grid
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 24, y - 73);
    ctx.lineTo(x + 24, y - 49);
    ctx.moveTo(x + 12, y - 61);
    ctx.lineTo(x + 36, y - 61);
    ctx.stroke();
    
    // Door frame
    ctx.fillStyle = '#4A2511';
    ctx.fillRect(x + 45, y - 65, 25, 65);
    
    // Door
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + 47, y - 63, 21, 63);
    
    // Door handle
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + 63, y - 35, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Door panels
    ctx.strokeStyle = '#4A2511';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 50, y - 58, 15, 25);
    ctx.strokeRect(x + 50, y - 30, 15, 25);
    
    // Shop sign board
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(x + 5, y - 118, 70, 15);
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 5, y - 118, 70, 15);
    
    // Sign text
    ctx.fillStyle = '#C41E3A';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('🌹 VIRÁGBOLT', x + 8, y - 106);
    
    // Flower decorations in window
    const flowers = [
        {x: x + 18, y: y - 58, color: '#FF1493'},
        {x: x + 24, y: y - 60, color: '#FFD700'},
        {x: x + 30, y: y - 57, color: '#FF6347'},
        {x: x + 21, y: y - 53, color: '#9370DB'},
        {x: x + 27, y: y - 55, color: '#FF69B4'}
    ];
    
    flowers.forEach(flower => {
        // Flower petals
        ctx.fillStyle = flower.color;
        for(let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const px = flower.x + Math.cos(angle) * 3;
            const py = flower.y + Math.sin(angle) * 3;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        // Flower center
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(flower.x, flower.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Awning
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.moveTo(x, y - 100);
    ctx.lineTo(x, y - 85);
    ctx.lineTo(x + 80, y - 85);
    ctx.lineTo(x + 80, y - 100);
    ctx.closePath();
    ctx.fill();
    
    // Awning stripes
    ctx.fillStyle = '#FFB6C1';
    for(let i = 0; i < 4; i++) {
        ctx.fillRect(x + i * 20, y - 100, 10, 15);
    }
}

// Draw detailed rose
function drawRose(x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    // Stem
    ctx.strokeStyle = '#2D5016';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-2, -10, 0, -25);
    ctx.stroke();
    
    // Thorns
    ctx.fillStyle = '#2D5016';
    ctx.beginPath();
    ctx.moveTo(-2, -8);
    ctx.lineTo(-5, -10);
    ctx.lineTo(-2, -12);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(2, -15);
    ctx.lineTo(5, -17);
    ctx.lineTo(2, -19);
    ctx.fill();
    
    // Leaves
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.ellipse(-5, -12, 4, 7, Math.PI / 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(5, -18, 4, 7, -Math.PI / 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Leaf veins
    ctx.strokeStyle = '#1a6b1a';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-5, -15);
    ctx.lineTo(-5, -9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5, -21);
    ctx.lineTo(5, -15);
    ctx.stroke();
    
    // Rose head - layered petals
    // Outer petals
    ctx.fillStyle = '#DC143C';
    for(let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const px = Math.cos(angle) * 5;
        const py = -25 + Math.sin(angle) * 5;
        ctx.beginPath();
        ctx.ellipse(px, py, 4, 6, angle, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Middle petals
    ctx.fillStyle = '#C41E3A';
    for(let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 + 0.3;
        const px = Math.cos(angle) * 3;
        const py = -25 + Math.sin(angle) * 3;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Inner petals
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.arc(0, -25, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlights on petals
    ctx.fillStyle = 'rgba(255, 100, 100, 0.5)';
    ctx.beginPath();
    ctx.arc(-1, -26, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Draw heart with animation
function drawHeart(x, y, size, pulse = 0) {
    const scale = 1 + Math.sin(pulse) * 0.1;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.moveTo(0, size / 4);
    ctx.bezierCurveTo(0, 0, -size / 2, -size / 2, -size, size / 3);
    ctx.bezierCurveTo(-size, size, 0, size * 1.5, 0, size * 2);
    ctx.bezierCurveTo(0, size * 1.5, size, size, size, size / 3);
    ctx.bezierCurveTo(size / 2, -size / 2, 0, 0, 0, size / 4);
    ctx.fill();
    
    // Heart highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(-size * 0.3, -size * 0.1, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Draw sparkles
function drawSparkle(x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    for(let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        ctx.lineTo(px, py);
        const midAngle = angle + Math.PI / 4;
        const mpx = Math.cos(midAngle) * (size * 0.3);
        const mpy = Math.sin(midAngle) * (size * 0.3);
        ctx.lineTo(mpx, mpy);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const groundY = canvas.height - 100;
    
    if (!animationComplete) {
        animationFrame++;
        
        // Walking to shop
        if (animationState === 'walking') {
            girlX += 1.2;
            boyX += 1.2;
            
            drawFlowerShop(flowerShopX, groundY);
            drawGirl(girlX, groundY - 150, animationFrame, false);
            drawBoy(boyX, groundY - 150, animationFrame, false);
            
            if (boyX >= flowerShopX - 120) {
                animationState = 'arriving';
                animationFrame = 0;
            }
        }
        
        // Arriving at shop - characters slow down
        else if (animationState === 'arriving') {
            const slowDown = 1 - (animationFrame / 30);
            girlX += slowDown * 0.8;
            boyX += slowDown * 0.8;
            
            drawFlowerShop(flowerShopX, groundY);
            drawGirl(girlX, groundY - 150, animationFrame, false);
            drawBoy(boyX, groundY - 150, animationFrame, false);
            
            if (animationFrame > 30) {
                animationState = 'atShop';
                animationFrame = 0;
            }
        }
        
        // At shop - boy looks at flowers
        else if (animationState === 'atShop') {
            drawFlowerShop(flowerShopX, groundY);
            drawGirl(girlX, groundY - 150, 0, false);
            drawBoy(boyX, groundY - 150, 0, false);
            
            // Sparkle on flower shop
            if (animationFrame % 20 < 10) {
                drawSparkle(flowerShopX + 40, groundY - 110, 8, animationFrame * 0.1);
            }
            
            if (animationFrame > 80) {
                animationState = 'buyingRose';
                animationFrame = 0;
            }
        }
        
        // Boy goes to buy rose (moves closer to shop)
        else if (animationState === 'buyingRose') {
            drawFlowerShop(flowerShopX, groundY);
            drawGirl(girlX, groundY - 150, 0, false);
            
            const targetX = flowerShopX - 40;
            if (boyX < targetX - 5) {
                boyX += 0.8;
                drawBoy(boyX, groundY - 150, animationFrame, false);
            } else {
                drawBoy(boyX, groundY - 150, 0, false);
            }
            
            if (animationFrame > 60) {
                animationState = 'takingRose';
                animationFrame = 0;
                roseX = flowerShopX - 20;
                roseY = groundY - 80;
            }
        }
        
        // Rose appears and boy takes it
        else if (animationState === 'takingRose') {
            drawFlowerShop(flowerShopX, groundY);
            drawGirl(girlX, groundY - 150, 0, false);
            drawBoy(boyX, groundY - 150, 0, true);
            
            // Rose moves from shop to boy's hand
            const progress = Math.min(animationFrame / 40, 1);
            roseX = flowerShopX - 20 + (boyX - 10 - (flowerShopX - 20)) * progress;
            roseY = (groundY - 80) + ((groundY - 120) - (groundY - 80)) * progress;
            
            drawRose(roseX, roseY, 1);
            
            if (animationFrame > 40) {
                animationState = 'walkingToGirl';
                animationFrame = 0;
            }
        }
        
        // Boy walks back to girl with rose
        else if (animationState === 'walkingToGirl') {
            drawFlowerShop(flowerShopX, groundY);
            drawGirl(girlX, groundY - 150, 0, false);
            
            const targetX = girlX + 60;
            if (boyX > targetX + 5) {
                boyX -= 0.8;
                drawBoy(boyX, groundY - 150, animationFrame, true);
                roseX = boyX - 10;
                roseY = groundY - 120;
            } else {
                drawBoy(boyX, groundY - 150, 0, true);
                roseX = boyX - 10;
                roseY = groundY - 120;
            }
            
            drawRose(roseX, roseY, 1);
            
            if (boyX <= targetX + 5 && animationFrame > 30) {
                animationState = 'givingRose';
                animationFrame = 0;
            }
        }
        
        // Boy gives rose to girl
        else if (animationState === 'givingRose') {
            drawFlowerShop(flowerShopX, groundY);
            drawGirl(girlX, groundY - 150, 0, false);
            drawBoy(boyX, groundY - 150, 0, true);
            
            // Rose moves from boy to girl
            const progress = Math.min(animationFrame / 50, 1);
            roseX = (boyX - 10) + ((girlX + 20) - (boyX - 10)) * progress;
            roseY = (groundY - 120) + ((groundY - 115) - (groundY - 120)) * progress;
            
            drawRose(roseX, roseY, 1);
            
            // Sparkles during transfer
            if (animationFrame > 20) {
                for(let i = 0; i < 3; i++) {
                    const sparkleX = roseX + Math.cos(animationFrame * 0.2 + i) * 15;
                    const sparkleY = roseY + Math.sin(animationFrame * 0.2 + i) * 15;
                    const alpha = Math.sin(animationFrame * 0.1) * 0.5 + 0.5;
                    ctx.globalAlpha = alpha;
                    drawSparkle(sparkleX, sparkleY, 5, animationFrame * 0.1 + i);
                    ctx.globalAlpha = 1;
                }
            }
            
            if (animationFrame > 50) {
                roseGiven = true;
                animationState = 'movingTogether';
                animationFrame = 0;
            }
        }
        
        // Characters move closer for kiss
        else if (animationState === 'movingTogether') {
            drawFlowerShop(flowerShopX, groundY);
            
            const midX = (girlX + boyX) / 2;
            const distance = Math.abs(boyX - girlX);
            
            if (distance > 40) {
                girlX += (midX - 20 - girlX) * 0.08;
                boyX += (midX + 20 - boyX) * 0.08;
            }
            
            drawGirl(girlX, groundY - 150, 0, true);
            drawBoy(boyX, groundY - 150, 0, false);
            
            // Girl holds rose
            drawRose(girlX + 20, groundY - 115, 1);
            
            if (animationFrame > 60) {
                animationState = 'kissing';
                animationFrame = 0;
            }
        }
        
        // Kissing scene with hearts
        else if (animationState === 'kissing') {
            drawFlowerShop(flowerShopX, groundY);
            
            drawGirl(girlX, groundY - 150, 0, true);
            drawBoy(boyX, groundY - 150, 0, false);
            
            // Girl still holds rose
            drawRose(girlX + 20, groundY - 115, 1);
            
            // Multiple hearts floating up
            if (animationFrame > 30) {
                const heartCount = 8;
                for (let i = 0; i < heartCount; i++) {
                    const heartAge = (animationFrame - 30 + i * 10) % 120;
                    const heartY = groundY - 140 - heartAge * 1.5;
                    const heartX = (girlX + boyX) / 2 + 20 + Math.sin((animationFrame + i * 40) * 0.08) * 30;
                    const alpha = Math.max(0, 1 - (heartAge / 120));
                    const size = 8 + Math.sin(heartAge * 0.1) * 3;
                    
                    if (alpha > 0) {
                        ctx.globalAlpha = alpha;
                        drawHeart(heartX, heartY, size, animationFrame * 0.2);
                        ctx.globalAlpha = 1;
                    }
                }
            }
            
            // Sparkles around couple
            if (animationFrame > 20) {
                for(let i = 0; i < 5; i++) {
                    const angle = (animationFrame * 0.05 + i * Math.PI * 2 / 5);
                    const sparkleX = (girlX + boyX) / 2 + Math.cos(angle) * 50;
                    const sparkleY = groundY - 120 + Math.sin(angle) * 40;
                    const alpha = (Math.sin(animationFrame * 0.1 + i) + 1) / 2;
                    ctx.globalAlpha = alpha;
                    drawSparkle(sparkleX, sparkleY, 6, angle);
                    ctx.globalAlpha = 1;
                }
            }
            
            if (animationFrame > 180) {
                animationComplete = true;
                controls.classList.remove('hidden');
            }
        }
    } else {
        // Animation complete - show final frame
        drawFlowerShop(flowerShopX, groundY);
        drawGirl(girlX, groundY - 150, 0, true);
        drawBoy(boyX, groundY - 150, 0, false);
        drawRose(girlX + 20, groundY - 115, 1);
    }
    
    requestAnimationFrame(animate);
}

// Restart animation
function restart() {
    animationState = 'walking';
    animationFrame = 0;
    girlX = -150;
    boyX = -220;
    flowerShopX = canvas.width * 0.65;
    roseGiven = false;
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
