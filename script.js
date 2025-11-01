const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');
const restartBtn = document.getElementById('restartBtn');
const closeBtn = document.getElementById('closeBtn');

// Canvas méret beállítása
function resizeCanvas() {
    const isMobile = window.innerWidth <= 768;
    canvas.width = isMobile ? window.innerWidth * 0.9 : 900;
    canvas.height = isMobile ? window.innerHeight * 0.6 : 600;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Pixel art kikapcsolása a simításnak
ctx.imageSmoothingEnabled = false;

// Animáció állapotok
const STATES = {
    MEETING: 0,
    WALKING_TO_SHOP: 1,
    AT_SHOP: 2,
    BUYING_ROSE: 3,
    GIVING_ROSE: 4,
    WALKING_TO_PLAYGROUND: 5,
    AT_SWING: 6,
    ENDED: 7
};

let currentState = STATES.MEETING;
let frame = 0;
let boyX = 100;
let girlX = 200;
let shopX = canvas.width / 2;
let playgroundX = canvas.width / 2;
let roseInBoyHand = false;
let roseInGirlHand = false;
let animationSpeed = 2;
let swingAngle = 0;
let swingDirection = 1;

// Karakterek rajzolása pixel art stílusban (nagyobb verzió - 2x méret)
function drawPixelRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

// Fiú karakter rajzolása (2x nagyobb)
function drawBoy(x, y, walkFrame = 0, scale = 2) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    const s = scale;
    
    // Lábak - fekete jogger
    if (walkFrame % 20 < 10) {
        drawPixelRect(px + 12*s, py + 50*s, 8*s, 20*s, '#1a1a1a');
        drawPixelRect(px + 24*s, py + 52*s, 8*s, 18*s, '#1a1a1a');
    } else {
        drawPixelRect(px + 12*s, py + 52*s, 8*s, 18*s, '#1a1a1a');
        drawPixelRect(px + 24*s, py + 50*s, 8*s, 20*s, '#1a1a1a');
    }
    
    // Cipők - fekete
    drawPixelRect(px + 12*s, py + 70*s, 10*s, 6*s, '#000');
    drawPixelRect(px + 24*s, py + 70*s, 10*s, 6*s, '#000');
    
    // Test - barna bőrkabát
    drawPixelRect(px + 10*s, py + 30*s, 26*s, 22*s, '#5C4033');
    drawPixelRect(px + 11*s, py + 31*s, 2*s, 20*s, '#4a3329');
    drawPixelRect(px + 21*s, py + 31*s, 3*s, 20*s, '#3a2519');
    
    // Karok
    drawPixelRect(px + 6*s, py + 32*s, 6*s, 16*s, '#5C4033');
    drawPixelRect(px + 34*s, py + 32*s, 6*s, 16*s, '#5C4033');
    drawPixelRect(px + 6*s, py + 48*s, 6*s, 6*s, '#fdd9b5');
    drawPixelRect(px + 34*s, py + 48*s, 6*s, 6*s, '#fdd9b5');
    
    // Fej
    drawPixelRect(px + 14*s, py + 12*s, 18*s, 18*s, '#fdd9b5');
    
    // NASA sapka
    drawPixelRect(px + 12*s, py + 8*s, 22*s, 8*s, '#f0f0f0');
    drawPixelRect(px + 10*s, py + 14*s, 8*s, 3*s, '#f0f0f0');
    
    // NASA felirat
    ctx.fillStyle = '#1a5490';
    ctx.fillRect(px + 16*s, py + 10*s, 2*s, 4*s);
    ctx.fillRect(px + 19*s, py + 10*s, 2*s, 4*s);
    ctx.fillRect(px + 22*s, py + 10*s, 2*s, 4*s);
    ctx.fillRect(px + 25*s, py + 10*s, 2*s, 4*s);
    
    // Szemek
    drawPixelRect(px + 18*s, py + 18*s, 3*s, 3*s, '#2a2a2a');
    drawPixelRect(px + 25*s, py + 18*s, 3*s, 3*s, '#2a2a2a');
    
    // Száj
    drawPixelRect(px + 20*s, py + 24*s, 6*s, 2*s, '#c97a6a');
}

// Lány karakter rajzolása (2x nagyobb)
function drawGirl(x, y, walkFrame = 0, scale = 2, sitting = false) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    const s = scale;
    
    if (!sitting) {
        // Álló pozíció - lábak
        if (walkFrame % 20 < 10) {
            drawPixelRect(px + 12*s, py + 50*s, 8*s, 20*s, '#a8a8a8');
            drawPixelRect(px + 24*s, py + 52*s, 8*s, 18*s, '#a8a8a8');
        } else {
            drawPixelRect(px + 12*s, py + 52*s, 8*s, 18*s, '#a8a8a8');
            drawPixelRect(px + 24*s, py + 50*s, 8*s, 20*s, '#a8a8a8');
        }
        
        // Bakancsok
        drawPixelRect(px + 11*s, py + 68*s, 11*s, 8*s, '#d4a843');
        drawPixelRect(px + 23*s, py + 68*s, 11*s, 8*s, '#d4a843');
    } else {
        // Ülő pozíció - lábak előre
        drawPixelRect(px + 12*s, py + 50*s, 8*s, 12*s, '#a8a8a8');
        drawPixelRect(px + 24*s, py + 50*s, 8*s, 12*s, '#a8a8a8');
        drawPixelRect(px + 12*s, py + 62*s, 12*s, 8*s, '#a8a8a8');
        drawPixelRect(px + 24*s, py + 62*s, 12*s, 8*s, '#a8a8a8');
        
        // Bakancsok oldalról
        drawPixelRect(px + 20*s, py + 70*s, 8*s, 6*s, '#d4a843');
        drawPixelRect(px + 32*s, py + 70*s, 8*s, 6*s, '#d4a843');
    }
    
    // Test - BOSTON pulcsi
    drawPixelRect(px + 10*s, py + 30*s, 26*s, 22*s, '#1e3a5f');
    
    // BOSTON felirat
    ctx.fillStyle = '#ffffff';
    ctx.font = `${8*s}px Arial`;
    ctx.fillText('BOSTON', px + 12*s, py + 42*s);
    
    // Karok
    drawPixelRect(px + 6*s, py + 32*s, 6*s, 16*s, '#1e3a5f');
    drawPixelRect(px + 34*s, py + 32*s, 6*s, 16*s, '#1e3a5f');
    drawPixelRect(px + 6*s, py + 48*s, 6*s, 6*s, '#fdd9b5');
    drawPixelRect(px + 34*s, py + 48*s, 6*s, 6*s, '#fdd9b5');
    
    // Fej
    drawPixelRect(px + 14*s, py + 12*s, 18*s, 18*s, '#fdd9b5');
    
    // Szőke haj
    drawPixelRect(px + 12*s, py + 8*s, 22*s, 8*s, '#f4d675');
    drawPixelRect(px + 10*s, py + 12*s, 4*s, 14*s, '#f4d675');
    drawPixelRect(px + 32*s, py + 12*s, 4*s, 14*s, '#f4d675');
    
    // Szemüveg
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 2*s;
    ctx.strokeRect(px + 16*s, py + 17*s, 6*s, 5*s);
    ctx.strokeRect(px + 24*s, py + 17*s, 6*s, 5*s);
    ctx.fillRect(px + 22*s, py + 19*s, 2*s, 2*s);
    
    // Szemek
    drawPixelRect(px + 18*s, py + 19*s, 2*s, 2*s, '#2a2a2a');
    drawPixelRect(px + 26*s, py + 19*s, 2*s, 2*s, '#2a2a2a');
    
    // Száj
    drawPixelRect(px + 19*s, py + 25*s, 8*s, 2*s, '#ff69b4');
}

// Virágbolt rajzolása
function drawShop(x, y) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    
    drawPixelRect(px - 40, py + 40, 120, 112, '#8B4513');
    
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.moveTo(px - 60, py + 40);
    ctx.lineTo(px + 20, py);
    ctx.lineTo(px + 100, py + 40);
    ctx.fill();
    
    drawPixelRect(px + 10, py + 90, 40, 62, '#5a3a1a');
    drawPixelRect(px + 32, py + 120, 6, 6, '#ffd700');
    
    ctx.fillStyle = '#fff8dc';
    ctx.fillRect(px - 20, py + 16, 80, 20);
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText('VIRÁG', px - 10, py + 32);
    
    drawPixelRect(px - 30, py + 60, 8, 12, '#ff69b4');
    drawPixelRect(px - 15, py + 56, 8, 12, '#ff0000');
    drawPixelRect(px, py + 60, 8, 12, '#ffff00');
    drawPixelRect(px + 60, py + 60, 8, 12, '#ff69b4');
    drawPixelRect(px + 45, py + 56, 8, 12, '#ff0000');
}

// Játszótér hinta rajzolása
function drawSwing(x, y, angle = 0) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    
    // Hinta állvány
    drawPixelRect(px - 80, py - 120, 8, 120, '#8B4513');
    drawPixelRect(px + 72, py - 120, 8, 120, '#8B4513');
    drawPixelRect(px - 80, py - 128, 160, 8, '#8B4513');
    
    // Láncok (mozgó)
    const chainOffset = Math.sin(angle) * 30;
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 4;
    
    ctx.beginPath();
    ctx.moveTo(px - 50, py - 120);
    ctx.lineTo(px - 30 + chainOffset, py - 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(px + 50, py - 120);
    ctx.lineTo(px + 30 + chainOffset, py - 20);
    ctx.stroke();
    
    // Hinta ülés
    drawPixelRect(px - 40 + chainOffset, py - 20, 80, 12, '#CD853F');
    drawPixelRect(px - 38 + chainOffset, py - 18, 76, 8, '#DEB887');
}

// Rózsa rajzolása
function drawRose(x, y, small = false) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    const size = small ? 1.2 : 2;
    
    drawPixelRect(px, py + 8*size, 2*size, 16*size, '#228B22');
    drawPixelRect(px - 3*size, py + 12*size, 4*size, 3*size, '#2d5016');
    drawPixelRect(px + 2*size, py + 16*size, 4*size, 3*size, '#2d5016');
    drawPixelRect(px - 3*size, py + 2*size, 8*size, 8*size, '#DC143C');
    drawPixelRect(px - 1*size, py, 4*size, 4*size, '#FF1744');
    drawPixelRect(px, py + 3*size, 2*size, 3*size, '#8B0000');
}

// Szív rajzolása
function drawHeart(x, y, size = 1) {
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    const px = Math.floor(x);
    const py = Math.floor(y);
    const s = size;
    ctx.arc(px - 5*s, py, 5*s, 0, Math.PI * 2);
    ctx.arc(px + 5*s, py, 5*s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(px - 10*s, py);
    ctx.lineTo(px, py + 12*s);
    ctx.lineTo(px + 10*s, py);
    ctx.fill();
}

// Animáció logika
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    frame++;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    switch(currentState) {
        case STATES.MEETING:
            // Kezdés - egymás mellett állnak
            drawBoy(centerX - 100, centerY - 80, 0);
            drawGirl(centerX + 20, centerY - 80, 0);
            
            if (frame > 60) {
                currentState = STATES.WALKING_TO_SHOP;
                frame = 0;
            }
            break;
            
        case STATES.WALKING_TO_SHOP:
            // Együtt mennek a bolthoz
            const shopProgress = Math.min(frame / 120, 1);
            const currentX = centerX - 60 + (shopProgress * 0);
            
            drawShop(centerX + 150, centerY - 80);
            drawBoy(currentX - 100, centerY - 80, frame);
            drawGirl(currentX + 20, centerY - 80, frame);
            
            if (frame > 120) {
                currentState = STATES.AT_SHOP;
                frame = 0;
            }
            break;
            
        case STATES.AT_SHOP:
            drawShop(centerX + 150, centerY - 80);
            drawBoy(centerX - 100, centerY - 80);
            drawGirl(centerX + 20, centerY - 80);
            
            if (frame > 60) {
                currentState = STATES.BUYING_ROSE;
                frame = 0;
            }
            break;
            
        case STATES.BUYING_ROSE:
            drawShop(centerX + 150, centerY - 80);
            drawBoy(centerX - 100, centerY - 80);
            drawGirl(centerX + 20, centerY - 80);
            
            if (frame > 90) {
                roseInBoyHand = true;
                currentState = STATES.GIVING_ROSE;
                frame = 0;
            }
            break;
            
        case STATES.GIVING_ROSE:
            drawShop(centerX + 150, centerY - 80);
            drawBoy(centerX - 100, centerY - 80);
            drawGirl(centerX + 20, centerY - 80);
            
            if (frame < 30) {
                drawRose(centerX - 10, centerY - 40, true);
            } else if (frame < 60) {
                drawRose(centerX + 10, centerY - 35, true);
            } else {
                roseInGirlHand = true;
                roseInBoyHand = false;
                
                // Szívek
                for (let i = 0; i < 3; i++) {
                    const heartY = centerY - 100 - (frame - 60) + i * 30;
                    if (heartY > 50) {
                        drawHeart(centerX - 40, heartY, 1.5);
                    }
                }
            }
            
            if (roseInGirlHand) {
                drawRose(centerX + 80, centerY - 30, true);
            }
            
            if (frame > 120) {
                currentState = STATES.WALKING_TO_PLAYGROUND;
                frame = 0;
            }
            break;
            
        case STATES.WALKING_TO_PLAYGROUND:
            // Együtt mennek a játszótérre
            drawBoy(centerX - 100, centerY - 80, frame);
            drawGirl(centerX + 20, centerY - 80, frame);
            
            if (roseInGirlHand) {
                drawRose(centerX + 80, centerY - 30, true);
            }
            
            if (frame > 120) {
                currentState = STATES.AT_SWING;
                frame = 0;
            }
            break;
            
        case STATES.AT_SWING:
            // Hinta rajzolása
            drawSwing(centerX + 100, centerY + 100, swingAngle);
            
            // Lány ül a hintán
            drawGirl(centerX + 60 + Math.sin(swingAngle) * 30, centerY - 20, 0, 2, true);
            
            // Fiú mellette áll
            drawBoy(centerX - 100, centerY - 80);
            
            // Hinta mozgatása
            swingAngle += 0.05 * swingDirection;
            if (swingAngle > 0.5) swingDirection = -1;
            if (swingAngle < -0.5) swingDirection = 1;
            
            // Rózsa a lány kezében
            if (roseInGirlHand) {
                drawRose(centerX + 120 + Math.sin(swingAngle) * 30, centerY + 20, true);
            }
            
            // Szívek
            if (frame % 30 < 15) {
                drawHeart(centerX - 40, centerY - 120, 1.5);
                drawHeart(centerX + 40, centerY - 100, 1.2);
            }
            
            if (frame > 180) {
                currentState = STATES.ENDED;
                controls.classList.remove('hidden');
            }
            break;
            
        case STATES.ENDED:
            drawSwing(centerX + 100, centerY + 100, swingAngle);
            drawGirl(centerX + 60 + Math.sin(swingAngle) * 30, centerY - 20, 0, 2, true);
            drawBoy(centerX - 100, centerY - 80);
            
            if (roseInGirlHand) {
                drawRose(centerX + 120 + Math.sin(swingAngle) * 30, centerY + 20, true);
            }
            
            swingAngle += 0.05 * swingDirection;
            if (swingAngle > 0.5) swingDirection = -1;
            if (swingAngle < -0.5) swingDirection = 1;
            break;
    }
    
    if (currentState !== STATES.ENDED || currentState === STATES.ENDED) {
        requestAnimationFrame(animate);
    }
}

// Gombok kezelése
restartBtn.addEventListener('click', () => {
    currentState = STATES.MEETING;
    frame = 0;
    roseInBoyHand = false;
    roseInGirlHand = false;
    swingAngle = 0;
    swingDirection = 1;
    controls.classList.add('hidden');
    animate();
});

closeBtn.addEventListener('click', () => {
    window.close();
    setTimeout(() => {
        window.location.href = 'about:blank';
    }, 100);
});

// Ablak átméretezéskor újrarajzolás
window.addEventListener('resize', () => {
    resizeCanvas();
});

// Animáció indítása
animate();
