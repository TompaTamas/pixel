const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');
const restartBtn = document.getElementById('restartBtn');
const closeBtn = document.getElementById('closeBtn');

// Canvas méret beállítása
function resizeCanvas() {
    const isMobile = window.innerWidth <= 768;
    canvas.width = isMobile ? window.innerWidth : window.innerWidth;
    canvas.height = 300; // Karakterek magassága
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Pixel art kikapcsolása a simításnak
ctx.imageSmoothingEnabled = false;

// Animáció állapotok
const STATES = {
    WALKING_TO_SHOP: 0,
    AT_SHOP: 1,
    BUYING_ROSE: 2,
    WALKING_TO_GIRL: 3,
    GIVING_ROSE: 4,
    KISSING: 5,
    ENDED: 6
};

let currentState = STATES.WALKING_TO_SHOP;
let frame = 0;
let boyX = 50;
let girlX = canvas.width - 150;
let shopX = canvas.width / 2;
let roseVisible = false;
let roseInBoyHand = false;
let roseInGirlHand = false;
let animationSpeed = 2;

// Karakterek rajzolása pixel art stílusban
function drawPixelRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

// Fiú karakter rajzolása (fehér bőr, bőrkabát, fekete jogger, fekete cipő, NASA sapka)
function drawBoy(x, y, walkFrame = 0) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    
    // Lábak (animált séta) - fekete jogger
    if (walkFrame % 20 < 10) {
        drawPixelRect(px + 12, py + 50, 8, 20, '#1a1a1a'); // bal láb
        drawPixelRect(px + 24, py + 52, 8, 18, '#1a1a1a'); // jobb láb
    } else {
        drawPixelRect(px + 12, py + 52, 8, 18, '#1a1a1a'); // bal láb
        drawPixelRect(px + 24, py + 50, 8, 20, '#1a1a1a'); // jobb láb
    }
    
    // Cipők - fekete
    drawPixelRect(px + 12, py + 70, 10, 6, '#000'); // bal cipő
    drawPixelRect(px + 24, py + 70, 10, 6, '#000'); // jobb cipő
    
    // Test - barna bőrkabát
    drawPixelRect(px + 10, py + 30, 26, 22, '#5C4033');
    
    // Kabát részletek
    drawPixelRect(px + 11, py + 31, 2, 20, '#4a3329'); // bal oldal árnyék
    drawPixelRect(px + 21, py + 31, 3, 20, '#3a2519'); // középső cipzár
    
    // Karok - bőrkabát
    drawPixelRect(px + 6, py + 32, 6, 16, '#5C4033'); // bal kar
    drawPixelRect(px + 34, py + 32, 6, 16, '#5C4033'); // jobb kar
    
    // Kezek - fehér bőr
    drawPixelRect(px + 6, py + 48, 6, 6, '#fdd9b5'); // bal kéz
    drawPixelRect(px + 34, py + 48, 6, 6, '#fdd9b5'); // jobb kéz
    
    // Fej - fehér bőr
    drawPixelRect(px + 14, py + 12, 18, 18, '#fdd9b5');
    
    // NASA sapka - fehér baseball sapka
    drawPixelRect(px + 12, py + 8, 22, 8, '#f0f0f0'); // sapka teteje
    drawPixelRect(px + 10, py + 14, 8, 3, '#f0f0f0'); // ellenzó
    
    // NASA felirat (egyszerűsítve)
    ctx.fillStyle = '#1a5490';
    ctx.fillRect(px + 16, py + 10, 2, 4);
    ctx.fillRect(px + 19, py + 10, 2, 4);
    ctx.fillRect(px + 22, py + 10, 2, 4);
    ctx.fillRect(px + 25, py + 10, 2, 4);
    
    // Szemek
    drawPixelRect(px + 18, py + 18, 3, 3, '#2a2a2a');
    drawPixelRect(px + 25, py + 18, 3, 3, '#2a2a2a');
    
    // Száj
    drawPixelRect(px + 20, py + 24, 6, 2, '#c97a6a');
}

// Lány karakter rajzolása (szőke, szemüveges, BOSTON pulcsi, szürke melegítő, mustársárga bakancs)
function drawGirl(x, y, walkFrame = 0) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    
    // Lábak - szürke melegítő
    if (walkFrame % 20 < 10) {
        drawPixelRect(px + 12, py + 50, 8, 20, '#a8a8a8');
        drawPixelRect(px + 24, py + 52, 8, 18, '#a8a8a8');
    } else {
        drawPixelRect(px + 12, py + 52, 8, 18, '#a8a8a8');
        drawPixelRect(px + 24, py + 50, 8, 20, '#a8a8a8');
    }
    
    // Bakancsok - mustársárga
    drawPixelRect(px + 11, py + 68, 11, 8, '#d4a843');
    drawPixelRect(px + 23, py + 68, 11, 8, '#d4a843');
    
    // Test - navy kék BOSTON pulcsi
    drawPixelRect(px + 10, py + 30, 26, 22, '#1e3a5f');
    
    // BOSTON felirat (egyszerűsített)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + 13, py + 37, 2, 6); // B
    ctx.fillRect(px + 16, py + 37, 2, 6); // O
    ctx.fillRect(px + 19, py + 37, 2, 6); // S
    ctx.fillRect(px + 22, py + 37, 2, 6); // T
    ctx.fillRect(px + 25, py + 37, 2, 6); // O
    ctx.fillRect(px + 28, py + 37, 2, 6); // N
    
    // Karok
    drawPixelRect(px + 6, py + 32, 6, 16, '#1e3a5f');
    drawPixelRect(px + 34, py + 32, 6, 16, '#1e3a5f');
    
    // Kezek - fehér bőr
    drawPixelRect(px + 6, py + 48, 6, 6, '#fdd9b5');
    drawPixelRect(px + 34, py + 48, 6, 6, '#fdd9b5');
    
    // Fej - fehér bőr
    drawPixelRect(px + 14, py + 12, 18, 18, '#fdd9b5');
    
    // Szőke haj
    drawPixelRect(px + 12, py + 8, 22, 8, '#f4d675'); // fej teteje
    drawPixelRect(px + 10, py + 12, 4, 14, '#f4d675'); // bal oldal
    drawPixelRect(px + 32, py + 12, 4, 14, '#f4d675'); // jobb oldal
    
    // Szemüveg
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 2;
    ctx.strokeRect(px + 16, py + 17, 6, 5); // bal lencse
    ctx.strokeRect(px + 24, py + 17, 6, 5); // jobb lencse
    ctx.fillRect(px + 22, py + 19, 2, 2); // oroszlánytartó
    
    // Szemek
    drawPixelRect(px + 18, py + 19, 2, 2, '#2a2a2a');
    drawPixelRect(px + 26, py + 19, 2, 2, '#2a2a2a');
    
    // Száj (mosolygós)
    drawPixelRect(px + 19, py + 25, 8, 2, '#c97a6a');
}

// Virágbolt rajzolása
function drawShop(x, y) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    
    // Bolt alapja
    drawPixelRect(px, py + 20, 60, 56, '#8B4513');
    
    // Tető
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.moveTo(px - 10, py + 20);
    ctx.lineTo(px + 30, py);
    ctx.lineTo(px + 70, py + 20);
    ctx.fill();
    
    // Ajtó
    drawPixelRect(px + 20, py + 45, 20, 31, '#5a3a1a');
    
    // Kilincs
    drawPixelRect(px + 36, py + 60, 3, 3, '#ffd700');
    
    // Tábla: "VIRÁG"
    ctx.fillStyle = '#fff8dc';
    ctx.fillRect(px + 10, py + 8, 40, 10);
    ctx.fillStyle = '#000';
    ctx.font = '8px Arial';
    ctx.fillText('VIRÁG', px + 14, py + 16);
    
    // Virágok az ablakban
    drawPixelRect(px + 8, py + 30, 4, 6, '#ff69b4'); // rózsaszín
    drawPixelRect(px + 14, py + 28, 4, 6, '#ff0000'); // piros
    drawPixelRect(px + 20, py + 30, 4, 6, '#ffff00'); // sárga
    drawPixelRect(px + 48, py + 30, 4, 6, '#ff69b4');
    drawPixelRect(px + 42, py + 28, 4, 6, '#ff0000');
}

// Rózsa rajzolása
function drawRose(x, y, small = false) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    const size = small ? 0.6 : 1;
    
    // Szár - zöld
    drawPixelRect(px, py + 8 * size, 2 * size, 16 * size, '#228B22');
    
    // Levelek
    drawPixelRect(px - 3 * size, py + 12 * size, 4 * size, 3 * size, '#2d5016');
    drawPixelRect(px + 2 * size, py + 16 * size, 4 * size, 3 * size, '#2d5016');
    
    // Virág - piros rózsa
    drawPixelRect(px - 3 * size, py + 2 * size, 8 * size, 8 * size, '#DC143C');
    drawPixelRect(px - 1 * size, py, 4 * size, 4 * size, '#FF1744');
    
    // Belső részletek
    drawPixelRect(px, py + 3 * size, 2 * size, 3 * size, '#8B0000');
}

// Szív rajzolása (csók jelzésére)
function drawHeart(x, y) {
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    const px = Math.floor(x);
    const py = Math.floor(y);
    ctx.moveTo(px, py + 8);
    ctx.bezierCurveTo(px, py + 5, px - 5, py, px - 10, py);
    ctx.bezierCurveTo(px - 15, py, px - 15, py + 8, px - 15, py + 8);
    ctx.bezierCurveTo(px - 15, py + 13, px, py + 18, px, py + 23);
    ctx.bezierCurveTo(px, py + 18, px + 15, py + 13, px + 15, py + 8);
    ctx.bezierCurveTo(px + 15, py + 8, px + 15, py, px + 10, py);
    ctx.bezierCurveTo(px + 5, py, px, py + 5, px, py + 8);
    ctx.fill();
}

// Animáció logika
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    frame++;
    
    switch(currentState) {
        case STATES.WALKING_TO_SHOP:
            // Fiú sétál a bolt felé
            if (boyX < shopX - 80) {
                boyX += animationSpeed;
                drawBoy(boyX, canvas.height - 80, frame);
            } else {
                currentState = STATES.AT_SHOP;
                frame = 0;
            }
            drawShop(shopX, canvas.height - 80);
            drawGirl(girlX, canvas.height - 80);
            break;
            
        case STATES.AT_SHOP:
            // Fiú a boltnál áll
            drawBoy(boyX, canvas.height - 80);
            drawShop(shopX, canvas.height - 80);
            drawGirl(girlX, canvas.height - 80);
            
            if (frame > 60) {
                currentState = STATES.BUYING_ROSE;
                frame = 0;
            }
            break;
            
        case STATES.BUYING_ROSE:
            // Vásárlás animáció
            drawShop(shopX, canvas.height - 80);
            drawBoy(boyX, canvas.height - 80);
            drawGirl(girlX, canvas.height - 80);
            
            if (frame > 90) {
                roseInBoyHand = true;
                currentState = STATES.WALKING_TO_GIRL;
                frame = 0;
            }
            break;
            
        case STATES.WALKING_TO_GIRL:
            // Fiú sétál a lányhoz
            drawShop(shopX, canvas.height - 80);
            drawGirl(girlX, canvas.height - 80);
            
            if (boyX < girlX - 50) {
                boyX += animationSpeed;
                drawBoy(boyX, canvas.height - 80, frame);
            } else {
                currentState = STATES.GIVING_ROSE;
                frame = 0;
            }
            
            if (roseInBoyHand) {
                drawRose(boyX + 40, canvas.height - 50, true);
            }
            break;
            
        case STATES.GIVING_ROSE:
            // Rózsa átadása
            drawShop(shopX, canvas.height - 80);
            drawBoy(boyX, canvas.height - 80);
            drawGirl(girlX, canvas.height - 80);
            
            if (frame < 30) {
                drawRose(boyX + 40, canvas.height - 50, true);
            } else if (frame < 60) {
                drawRose(boyX + 45, canvas.height - 45, true);
            } else {
                roseInGirlHand = true;
                roseInBoyHand = false;
                currentState = STATES.KISSING;
                frame = 0;
            }
            break;
            
        case STATES.KISSING:
            // Csók
            drawShop(shopX, canvas.height - 80);
            drawBoy(boyX, canvas.height - 80);
            drawGirl(girlX, canvas.height - 80);
            
            if (roseInGirlHand) {
                drawRose(girlX - 15, canvas.height - 50, true);
            }
            
            // Szívek animációja
            if (frame > 30) {
                for (let i = 0; i < 3; i++) {
                    const heartY = canvas.height - 100 - (frame - 30) + i * 20;
                    if (heartY > 0) {
                        drawHeart(boyX + girlX) / (2, heartY);
                    }
                }
            }
            
            if (frame > 120) {
                currentState = STATES.ENDED;
                controls.classList.remove('hidden');
            }
            break;
            
        case STATES.ENDED:
            // Vége - karakterek maradnak
            drawShop(shopX, canvas.height - 80);
            drawBoy(boyX, canvas.height - 80);
            drawGirl(girlX, canvas.height - 80);
            if (roseInGirlHand) {
                drawRose(girlX - 15, canvas.height - 50, true);
            }
            break;
    }
    
    if (currentState !== STATES.ENDED) {
        requestAnimationFrame(animate);
    }
}

// Gombok kezelése
restartBtn.addEventListener('click', () => {
    currentState = STATES.WALKING_TO_SHOP;
    frame = 0;
    boyX = 50;
    girlX = canvas.width - 150;
    shopX = canvas.width / 2;
    roseVisible = false;
    roseInBoyHand = false;
    roseInGirlHand = false;
    controls.classList.add('hidden');
    animate();
});

closeBtn.addEventListener('click', () => {
    window.close();
    // Ha nem sikerül bezárni (biztonsági okok), visszairányítás
    setTimeout(() => {
        window.location.href = 'about:blank';
    }, 100);
});

// Ablak átméretezéskor újrapozícionálás
window.addEventListener('resize', () => {
    resizeCanvas();
    girlX = canvas.width - 150;
    shopX = canvas.width / 2;
});

// Animáció indítása
animate();