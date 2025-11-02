const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');
const restartBtn = document.getElementById('restartBtn');
const closeBtn = document.getElementById('closeBtn');

// Canvas méret beállítása
function resizeCanvas() {
    const isMobile = window.innerWidth <= 768;
    canvas.width = isMobile ? window.innerWidth * 0.9 : 1000;
    canvas.height = isMobile ? window.innerHeight * 0.6 : 700;
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
    GIVING_ROSE: 3,
    WALKING_TO_PLAYGROUND: 4,
    AT_SWING: 5,
    ENDED: 6
};

let currentState = STATES.WALKING_TO_SHOP;
let frame = 0;
let boyX = -150;
let girlX = -50;
let roseInBoyHand = false;
let roseInGirlHand = false;
let animationSpeed = 1.5;
let swingAngle = 0;
let swingDirection = 1;

// Karakterek rajzolása pixel art stílusban
function drawPixelRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

// Fiú karakter rajzolása - részletesebb (fekete bőrkabát)
function drawBoy(x, y, walkFrame = 0, scale = 2.5) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    const s = scale;
    
    // Lábak - fekete jogger animálva
    if (walkFrame % 30 < 15) {
        // Bal láb előre
        drawPixelRect(px + 12*s, py + 48*s, 9*s, 22*s, '#1a1a1a');
        drawPixelRect(px + 24*s, py + 52*s, 9*s, 18*s, '#0a0a0a');
        // Nadrág redők
        drawPixelRect(px + 13*s, py + 50*s, 2*s, 18*s, '#2a2a2a');
        drawPixelRect(px + 25*s, py + 54*s, 2*s, 14*s, '#151515');
    } else {
        // Jobb láb előre
        drawPixelRect(px + 12*s, py + 52*s, 9*s, 18*s, '#0a0a0a');
        drawPixelRect(px + 24*s, py + 48*s, 9*s, 22*s, '#1a1a1a');
        drawPixelRect(px + 13*s, py + 54*s, 2*s, 14*s, '#151515');
        drawPixelRect(px + 25*s, py + 50*s, 2*s, 18*s, '#2a2a2a');
    }
    
    // Sport cipők - fekete részletesen
    drawPixelRect(px + 11*s, py + 70*s, 12*s, 7*s, '#000');
    drawPixelRect(px + 23*s, py + 70*s, 12*s, 7*s, '#000');
    // Cipő talp
    drawPixelRect(px + 10*s, py + 76*s, 13*s, 2*s, '#3a3a3a');
    drawPixelRect(px + 22*s, py + 76*s, 13*s, 2*s, '#3a3a3a');
    // Cipő részletek - fehér csík
    drawPixelRect(px + 13*s, py + 72*s, 6*s, 2*s, '#fff');
    drawPixelRect(px + 25*s, py + 72*s, 6*s, 2*s, '#fff');
    
    // Test - FEKETE bőrkabát részletesen
    drawPixelRect(px + 9*s, py + 28*s, 28*s, 24*s, '#1a1a1a');
    
    // Kabát árnyékok és részletek
    drawPixelRect(px + 10*s, py + 29*s, 3*s, 22*s, '#0a0a0a'); // bal oldal árnyék
    drawPixelRect(px + 33*s, py + 29*s, 3*s, 22*s, '#0a0a0a'); // jobb oldal árnyék
    
    // Cipzár közép
    drawPixelRect(px + 20*s, py + 29*s, 4*s, 22*s, '#2a2a2a');
    drawPixelRect(px + 21*s, py + 30*s, 2*s, 20*s, '#404040');
    
    // Zipzár fogantyú
    drawPixelRect(px + 21*s, py + 32*s, 2*s, 3*s, '#808080');
    
    // Kabát zsebek
    drawPixelRect(px + 11*s, py + 40*s, 6*s, 4*s, '#0a0a0a');
    drawPixelRect(px + 29*s, py + 40*s, 6*s, 4*s, '#0a0a0a');
    
    // Gallér
    drawPixelRect(px + 14*s, py + 28*s, 4*s, 3*s, '#1a1a1a');
    drawPixelRect(px + 28*s, py + 28*s, 4*s, 3*s, '#1a1a1a');
    
    // Karok - bőrkabát ujjak
    drawPixelRect(px + 4*s, py + 30*s, 7*s, 18*s, '#1a1a1a');
    drawPixelRect(px + 35*s, py + 30*s, 7*s, 18*s, '#1a1a1a');
    // Ujj redők
    drawPixelRect(px + 5*s, py + 32*s, 2*s, 14*s, '#0a0a0a');
    drawPixelRect(px + 38*s, py + 32*s, 2*s, 14*s, '#0a0a0a');
    
    // Kezek - fehér bőr
    drawPixelRect(px + 4*s, py + 48*s, 7*s, 7*s, '#fdd9b5');
    drawPixelRect(px + 35*s, py + 48*s, 7*s, 7*s, '#fdd9b5');
    // Ujjak részletei
    drawPixelRect(px + 5*s, py + 52*s, 2*s, 2*s, '#f5c89a');
    drawPixelRect(px + 38*s, py + 52*s, 2*s, 2*s, '#f5c89a');
    
    // Nyak
    drawPixelRect(px + 18*s, py + 26*s, 10*s, 4*s, '#fdd9b5');
    
    // Fej - fehér bőr
    drawPixelRect(px + 14*s, py + 10*s, 18*s, 18*s, '#fdd9b5');
    // Fej árnyékok
    drawPixelRect(px + 15*s, py + 24*s, 16*s, 2*s, '#f5c89a');
    
    // NASA sapka - fehér baseball sapka részletesen
    drawPixelRect(px + 11*s, py + 6*s, 24*s, 9*s, '#f5f5f5');
    // Sapka árnyék
    drawPixelRect(px + 12*s, py + 13*s, 22*s, 2*s, '#e0e0e0');
    // Ellenzó
    drawPixelRect(px + 9*s, py + 13*s, 10*s, 4*s, '#f0f0f0');
    drawPixelRect(px + 10*s, py + 15*s, 8*s, 2*s, '#d0d0d0');
    
    // NASA felirat - kék piros fehér
    ctx.fillStyle = '#0B3D91'; // NASA kék
    ctx.fillRect(px + 15*s, py + 9*s, 3*s, 5*s); // N
    ctx.fillRect(px + 19*s, py + 9*s, 3*s, 5*s); // A
    ctx.fillRect(px + 23*s, py + 9*s, 3*s, 5*s); // S
    ctx.fillRect(px + 27*s, py + 9*s, 3*s, 5*s); // A
    // NASA piros "csík"
    ctx.fillStyle = '#FC3D21';
    ctx.fillRect(px + 16*s, py + 11*s, 14*s, 1*s);
    
    // Szemek - részletesebben
    drawPixelRect(px + 17*s, py + 17*s, 4*s, 4*s, '#fff');
    drawPixelRect(px + 25*s, py + 17*s, 4*s, 4*s, '#fff');
    drawPixelRect(px + 18*s, py + 18*s, 3*s, 3*s, '#4a3c2a');
    drawPixelRect(px + 26*s, py + 18*s, 3*s, 3*s, '#4a3c2a');
    drawPixelRect(px + 19*s, py + 19*s, 1*s, 1*s, '#000');
    drawPixelRect(px + 27*s, py + 19*s, 1*s, 1*s, '#000');
    // Szemöldök
    drawPixelRect(px + 17*s, py + 15*s, 4*s, 1*s, '#3a2a1a');
    drawPixelRect(px + 25*s, py + 15*s, 4*s, 1*s, '#3a2a1a');
    
    // Orr
    drawPixelRect(px + 21*s, py + 20*s, 2*s, 3*s, '#f5c89a');
    
    // Száj - mosoly
    drawPixelRect(px + 19*s, py + 24*s, 8*s, 2*s, '#c97a6a');
    drawPixelRect(px + 18*s, py + 25*s, 2*s, 1*s, '#c97a6a');
    drawPixelRect(px + 26*s, py + 25*s, 2*s, 1*s, '#c97a6a');
}

// Lány karakter rajzolása - részletesebb
function drawGirl(x, y, walkFrame = 0, scale = 2.5, sitting = false) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    const s = scale;
    
    if (!sitting) {
        // Álló pozíció - lábak animálva
        if (walkFrame % 30 < 15) {
            drawPixelRect(px + 12*s, py + 48*s, 9*s, 22*s, '#b0b0b0');
            drawPixelRect(px + 24*s, py + 52*s, 9*s, 18*s, '#a0a0a0');
            drawPixelRect(px + 13*s, py + 50*s, 2*s, 18*s, '#c0c0c0');
            drawPixelRect(px + 25*s, py + 54*s, 2*s, 14*s, '#909090');
        } else {
            drawPixelRect(px + 12*s, py + 52*s, 9*s, 18*s, '#a0a0a0');
            drawPixelRect(px + 24*s, py + 48*s, 9*s, 22*s, '#b0b0b0');
            drawPixelRect(px + 13*s, py + 54*s, 2*s, 14*s, '#909090');
            drawPixelRect(px + 25*s, py + 50*s, 2*s, 18*s, '#c0c0c0');
        }
        
        // Bakancsok - mustársárga részletesen
        drawPixelRect(px + 10*s, py + 69*s, 13*s, 9*s, '#d4a843');
        drawPixelRect(px + 22*s, py + 69*s, 13*s, 9*s, '#d4a843');
        // Bakancs sötétebb rész
        drawPixelRect(px + 11*s, py + 70*s, 11*s, 2*s, '#b89538');
        drawPixelRect(px + 23*s, py + 70*s, 11*s, 2*s, '#b89538');
        // Fűzők
        drawPixelRect(px + 13*s, py + 71*s, 2*s, 1*s, '#8b7935');
        drawPixelRect(px + 17*s, py + 72*s, 2*s, 1*s, '#8b7935');
        drawPixelRect(px + 25*s, py + 71*s, 2*s, 1*s, '#8b7935');
        drawPixelRect(px + 29*s, py + 72*s, 2*s, 1*s, '#8b7935');
        // Talp
        drawPixelRect(px + 9*s, py + 77*s, 14*s, 2*s, '#a58939');
        drawPixelRect(px + 21*s, py + 77*s, 14*s, 2*s, '#a58939');
    } else {
        // Ülő pozíció - lábak előre
        drawPixelRect(px + 12*s, py + 48*s, 9*s, 14*s, '#b0b0b0');
        drawPixelRect(px + 24*s, py + 48*s, 9*s, 14*s, '#b0b0b0');
        drawPixelRect(px + 12*s, py + 62*s, 14*s, 9*s, '#a8a8a8');
        drawPixelRect(px + 24*s, py + 62*s, 14*s, 9*s, '#a8a8a8');
        
        // Bakancsok oldalról
        drawPixelRect(px + 22*s, py + 71*s, 9*s, 7*s, '#d4a843');
        drawPixelRect(px + 34*s, py + 71*s, 9*s, 7*s, '#d4a843');
        drawPixelRect(px + 23*s, py + 72*s, 7*s, 2*s, '#b89538');
        drawPixelRect(px + 35*s, py + 72*s, 7*s, 2*s, '#b89538');
    }
    
    // Test - BOSTON navy kék pulcsi részletesen
    drawPixelRect(px + 9*s, py + 28*s, 28*s, 24*s, '#1e3a5f');
    
    // Pulcsi árnyékok
    drawPixelRect(px + 10*s, py + 29*s, 3*s, 22*s, '#152b45');
    drawPixelRect(px + 33*s, py + 29*s, 3*s, 22*s, '#152b45');
    
    // Pulcsi redők
    drawPixelRect(px + 20*s, py + 30*s, 2*s, 20*s, '#2a4a6f');
    
    // BOSTON felirat - részletesebb
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${7*s}px Arial`;
    ctx.fillText('BOSTON', px + 11*s, py + 40*s);
    // Felirat árnyék
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillText('BOSTON', px + 11.5*s, py + 40.5*s);
    
    // Karok
    drawPixelRect(px + 4*s, py + 30*s, 7*s, 18*s, '#1e3a5f');
    drawPixelRect(px + 35*s, py + 30*s, 7*s, 18*s, '#1e3a5f');
    drawPixelRect(px + 5*s, py + 32*s, 2*s, 14*s, '#152b45');
    drawPixelRect(px + 38*s, py + 32*s, 2*s, 14*s, '#152b45');
    
    // Kezek - fehér bőr
    drawPixelRect(px + 4*s, py + 48*s, 7*s, 7*s, '#fdd9b5');
    drawPixelRect(px + 35*s, py + 48*s, 7*s, 7*s, '#fdd9b5');
    drawPixelRect(px + 5*s, py + 52*s, 2*s, 2*s, '#f5c89a');
    drawPixelRect(px + 38*s, py + 52*s, 2*s, 2*s, '#f5c89a');
    
    // Nyak
    drawPixelRect(px + 18*s, py + 26*s, 10*s, 4*s, '#fdd9b5');
    
    // Fej - fehér bőr
    drawPixelRect(px + 14*s, py + 10*s, 18*s, 18*s, '#fdd9b5');
    drawPixelRect(px + 15*s, py + 24*s, 16*s, 2*s, '#f5c89a');
    
    // Szőke haj - részletesebb
    drawPixelRect(px + 11*s, py + 6*s, 24*s, 9*s, '#f4d675');
    drawPixelRect(px + 9*s, py + 10*s, 5*s, 16*s, '#f4d675');
    drawPixelRect(px + 32*s, py + 10*s, 5*s, 16*s, '#f4d675');
    // Haj fények
    drawPixelRect(px + 18*s, py + 8*s, 2*s, 4*s, '#f9e8a0');
    drawPixelRect(px + 26*s, py + 8*s, 2*s, 4*s, '#f9e8a0');
    // Haj árnyék
    drawPixelRect(px + 10*s, py + 12*s, 2*s, 12*s, '#d4b960');
    drawPixelRect(px + 34*s, py + 12*s, 2*s, 12*s, '#d4b960');
    
    // Szemüveg - részletes keret
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 2;
    ctx.strokeRect(px + 15*s, py + 16*s, 7*s, 6*s);
    ctx.strokeRect(px + 24*s, py + 16*s, 7*s, 6*s);
    // Orrhíd
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(px + 22*s, py + 18*s, 2*s, 2*s);
    // Szárnyak
    ctx.strokeRect(px + 11*s, py + 18*s, 4*s, 1*s);
    ctx.strokeRect(px + 31*s, py + 18*s, 4*s, 1*s);
    
    // Szemek a szemüveg mögött
    drawPixelRect(px + 17*s, py + 18*s, 4*s, 3*s, '#fff');
    drawPixelRect(px + 26*s, py + 18*s, 4*s, 3*s, '#fff');
    drawPixelRect(px + 18*s, py + 19*s, 3*s, 2*s, '#4a7c9e');
    drawPixelRect(px + 27*s, py + 19*s, 3*s, 2*s, '#4a7c9e');
    drawPixelRect(px + 19*s, py + 19*s, 1*s, 1*s, '#000');
    drawPixelRect(px + 28*s, py + 19*s, 1*s, 1*s, '#000');
    
    // Szemöldök
    drawPixelRect(px + 16*s, py + 14*s, 5*s, 1*s, '#d4b960');
    drawPixelRect(px + 25*s, py + 14*s, 5*s, 1*s, '#d4b960');
    
    // Orr
    drawPixelRect(px + 21*s, py + 20*s, 2*s, 3*s, '#f5c89a');
    
    // Száj - mosoly
    drawPixelRect(px + 19*s, py + 24*s, 8*s, 2*s, '#ff8a9a');
    drawPixelRect(px + 18*s, py + 25*s, 2*s, 1*s, '#ff8a9a');
    drawPixelRect(px + 26*s, py + 25*s, 2*s, 1*s, '#ff8a9a');
}

// Virágbolt rajzolása - részletesebb
function drawShop(x, y) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    
    // Bolt alapja - részletes fal
    drawPixelRect(px - 60, py + 40, 140, 140, '#a0785a');
    drawPixelRect(px - 58, py + 42, 136, 136, '#b88a6f');
    
    // Tégla minta
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 8; j++) {
            const offsetX = (i % 2) * 10;
            drawPixelRect(px - 55 + j * 18 + offsetX, py + 45 + i * 18, 16, 16, '#c9956a');
            drawPixelRect(px - 54 + j * 18 + offsetX, py + 46 + i * 18, 14, 14, '#d4a378');
        }
    }
    
    // Tető - részletes
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(px - 80, py + 40);
    ctx.lineTo(px, py - 10);
    ctx.lineTo(px + 100, py + 40);
    ctx.fill();
    
    // Tető árnyék
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.moveTo(px - 75, py + 35);
    ctx.lineTo(px, py);
    ctx.lineTo(px + 95, py + 35);
    ctx.fill();
    
    // Ajtó - részletes
    drawPixelRect(px - 20, py + 110, 50, 70, '#5a3a1a');
    drawPixelRect(px - 18, py + 112, 46, 66, '#6b4a2a');
    
    // Ajtó táblák
    drawPixelRect(px - 15, py + 115, 18, 25, '#7a5a3a');
    drawPixelRect(px + 7, py + 115, 18, 25, '#7a5a3a');
    drawPixelRect(px - 15, py + 145, 18, 25, '#7a5a3a');
    drawPixelRect(px + 7, py + 145, 18, 25, '#7a5a3a');
    
    // Kilincs - arany
    drawPixelRect(px + 20, py + 145, 5, 5, '#ffd700');
    drawPixelRect(px + 21, py + 146, 3, 3, '#ffed4e');
    
    // Tábla: "VIRÁG"
    ctx.fillStyle = '#fff8dc';
    ctx.fillRect(px - 45, py + 8, 100, 25);
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.strokeRect(px - 45, py + 8, 100, 25);
    
    ctx.fillStyle = '#d4145a';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('VIRÁGBOLT', px - 40, py + 28);
    
    // Ablak
    drawPixelRect(px - 55, py + 55, 35, 40, '#87ceeb');
    drawPixelRect(px - 54, py + 56, 33, 38, '#b0e0e6');
    // Ablakkeret
    drawPixelRect(px - 55, py + 74, 35, 2, '#5a3a1a');
    drawPixelRect(px - 38, py + 55, 2, 40, '#5a3a1a');
    
    // Virágok az ablakban - részletesebben
    drawPixelRect(px - 52, py + 65, 6, 8, '#ff69b4');
    drawPixelRect(px - 51, py + 63, 4, 4, '#ff1493');
    
    drawPixelRect(px - 44, py + 62, 6, 8, '#ff0000');
    drawPixelRect(px - 43, py + 60, 4, 4, '#dc143c');
    
    drawPixelRect(px - 36, py + 65, 6, 8, '#ffff00');
    drawPixelRect(px - 35, py + 63, 4, 4, '#ffd700');
    
    // Száruk
    drawPixelRect(px - 49, py + 73, 1, 8, '#228B22');
    drawPixelRect(px - 41, py + 70, 1, 8, '#228B22');
    drawPixelRect(px - 33, py + 73, 1, 8, '#228B22');
}

// Játszótér hinta rajzolása - lassabb mozgással
function drawSwing(x, y, angle = 0) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    
    // Hinta állvány - részletes
    drawPixelRect(px - 100, py - 150, 12, 150, '#8B4513');
    drawPixelRect(px + 88, py - 150, 12, 150, '#8B4513');
    // Állvány árnyék
    drawPixelRect(px - 98, py - 148, 4, 146, '#654321');
    drawPixelRect(px + 90, py - 148, 4, 146, '#654321');
    
    // Felső gerenda
    drawPixelRect(px - 100, py - 162, 200, 12, '#8B4513');
    drawPixelRect(px - 98, py - 160, 196, 8, '#a0622d');
    
    // Támaszok
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(px - 90, py - 150);
    ctx.lineTo(px - 20, py - 150);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px + 90, py - 150);
    ctx.lineTo(px + 20, py - 150);
    ctx.stroke();
    
    // Láncok - fém láncok
    const chainOffset = Math.sin(angle) * 40;
    ctx.strokeStyle = '#505050';
    ctx.lineWidth = 6;
    
    // Bal lánc
    ctx.beginPath();
    ctx.moveTo(px - 60, py - 150);
    ctx.lineTo(px - 40 + chainOffset, py - 30);
    ctx.stroke();
    
    // Jobb lánc
    ctx.beginPath();
    ctx.moveTo(px + 60, py - 150);
    ctx.lineTo(px + 40 + chainOffset, py - 30);
    ctx.stroke();
    
    // Lánc részletek
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(px - 59, py - 150);
    ctx.lineTo(px - 39 + chainOffset, py - 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px + 61, py - 150);
    ctx.lineTo(px + 41 + chainOffset, py - 30);
    ctx.stroke();
    
    // Hinta ülés - fa
    drawPixelRect(px - 50 + chainOffset, py - 30, 100, 15, '#CD853F');
    drawPixelRect(px - 48 + chainOffset, py - 28, 96, 11, '#DEB887');
    // Fa ér minta
    drawPixelRect(px - 45 + chainOffset, py - 27, 2, 9, '#c19a6b');
    drawPixelRect(px - 20 + chainOffset, py - 27, 2, 9, '#c19a6b');
    drawPixelRect(px + 5 + chainOffset, py - 27, 2, 9, '#c19a6b');
    drawPixelRect(px + 30 + chainOffset, py - 27, 2, 9, '#c19a6b');
}

// Rózsa rajzolása - részletesebb
function drawRose(x, y, small = false) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    const size = small ? 1.5 : 2.5;
    
    // Szár - zöld részletesen
    drawPixelRect(px, py + 8*size, 3*size, 20*size, '#228B22');
    drawPixelRect(px + 0.5*size, py + 9*size, 2*size, 18*size, '#2eb82e');
    
    // Töviskék
    drawPixelRect(px - 2*size, py + 12*size, 2*size, 1*size, '#1a5c1a');
    drawPixelRect(px + 3*size, py + 15*size, 2*size, 1*size, '#1a5c1a');
    drawPixelRect(px - 2*size, py + 19*size, 2*size, 1*size, '#1a5c1a');
    drawPixelRect(px + 3*size, py + 22*size, 2*size, 1*size, '#1a5c1a');
    
    // Levelek - részletesebb
    drawPixelRect(px - 4*size, py + 14*size, 6*size, 4*size, '#2d5016');
    drawPixelRect(px - 3*size, py + 15*size, 5*size, 3*size, '#3a6b1f');
    
    drawPixelRect(px + 2*size, py + 19*size, 6*size, 4*size, '#2d5016');
    drawPixelRect(px + 2.5*size, py + 20*size, 5*size, 3*size, '#3a6b1f');
    
    // Virág - piros rózsa részletesen
    drawPixelRect(px - 4*size, py + 2*size, 10*size, 10*size, '#DC143C');
    drawPixelRect(px - 3*size, py + 3*size, 8*size, 8*size, '#FF1744');
    
    // Rózsa közepe - belső szirmok
    drawPixelRect(px - 1*size, py - 1*size, 5*size, 5*size, '#ff4757');
    drawPixelRect(px, py, 3*size, 3*size, '#ff6b81');
    
    // Belső árnyék
    drawPixelRect(px, py + 4*size, 3*size, 4*size, '#8B0000');
    drawPixelRect(px - 2*size, py + 5*size, 6*size, 3*size, '#a01010');
    
    // Szirmok széle
    drawPixelRect(px - 4*size, py + 2*size, 2*size, 2*size, '#b01030');
    drawPixelRect(px + 4*size, py + 2*size, 2*size, 2*size, '#b01030');
    drawPixelRect(px - 3*size, py + 9*size, 2*size, 2*size, '#b01030');
    drawPixelRect(px + 3*size, py + 9*size, 2*size, 2*size, '#b01030');
}

// Szív rajzolása
function drawHeart(x, y, size = 1.5) {
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    const px = Math.floor(x);
    const py = Math.floor(y);
    const s = size;
    ctx.arc(px - 6*s, py, 6*s, 0, Math.PI * 2);
    ctx.arc(px + 6*s, py, 6*s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(px - 12*s, py);
    ctx.lineTo(px, py + 15*s);
    ctx.lineTo(px + 12*s, py);
    ctx.fill();
    
    // Szív fény
    ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
    ctx.beginPath();
    ctx.arc(px - 6*s, py - 2*s, 3*s, 0, Math.PI * 2);
    ctx.fill();
}

// Animáció logika
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    frame++;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    switch(currentState) {
        case STATES.WALKING_TO_SHOP:
            // Bolt középen
            drawShop(centerX, centerY - 100);
            
            // Karakterek oldalról jönnek
            if (boyX < centerX - 220) {
                boyX += animationSpeed;
                girlX += animationSpeed;
            } else {
                currentState = STATES.AT_SHOP;
                frame = 0;
            }
            
            drawBoy(boyX, centerY - 40, frame);
            drawGirl(girlX, centerY - 40, frame);
            break;
            
        case STATES.AT_SHOP:
            drawShop(centerX, centerY - 100);
            drawBoy(boyX, centerY - 40);
            drawGirl(girlX, centerY - 40);
            
            if (frame > 60) {
                currentState = STATES.BUYING_ROSE;
                frame = 0;
            }
            break;
            
        case STATES.BUYING_ROSE:
            drawShop(centerX, centerY - 100);
            drawBoy(boyX, centerY - 40);
            drawGirl(girlX, centerY - 40);
            
            // Vásárlás animáció
            if (frame > 30 && frame < 60) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '20px Arial';
                ctx.fillText('💐', centerX, centerY - 150);
            }
            
            if (frame > 90) {
                roseInBoyHand = true;
                currentState = STATES.GIVING_ROSE;
                frame = 0;
            }
            break;
            
        case STATES.GIVING_ROSE:
            drawShop(centerX, centerY - 100);
            drawBoy(boyX, centerY - 40);
            drawGirl(girlX, centerY - 40);
            
            if (frame < 40) {
                drawRose(boyX + 120, centerY + 30, true);
            } else if (frame < 80) {
                // Átadás animáció
                const progress = (frame - 40) / 40;
                const roseX = boyX + 120 + (girlX - boyX - 20) * progress;
                const roseY = centerY + 30 - Math.sin(progress * Math.PI) * 30;
                drawRose(roseX, roseY, true);
            } else {
                roseInGirlHand = true;
                roseInBoyHand = false;
                
                // Szívek
                for (let i = 0; i < 5; i++) {
                    const heartY = centerY - 100 - (frame - 80) * 2 + i * 40;
                    const heartX = centerX - 100 + Math.sin((frame + i * 20) / 10) * 30;
                    if (heartY > 0) {
                        drawHeart(heartX, heartY, 1.8);
                    }
                }
            }
            
            if (roseInGirlHand) {
                drawRose(girlX - 30, centerY + 35, true);
            }
            
            if (frame > 150) {
                currentState = STATES.WALKING_TO_PLAYGROUND;
                frame = 0;
            }
            break;
            
        case STATES.WALKING_TO_PLAYGROUND:
            // Elhalványuló bolt
            ctx.globalAlpha = Math.max(0, 1 - frame / 60);
            drawShop(centerX, centerY - 100);
            ctx.globalAlpha = 1;
            
            drawBoy(boyX, centerY - 40, frame);
            drawGirl(girlX, centerY - 40, frame);
            
            if (roseInGirlHand) {
                drawRose(girlX - 30, centerY + 35, true);
            }
            
            if (frame > 90) {
                currentState = STATES.AT_SWING;
                frame = 0;
            }
            break;
            
        case STATES.AT_SWING:
            // Hinta megjelenése
            drawSwing(centerX + 150, centerY + 120, swingAngle);
            
            // Lány ül a hintán
            const swingX = centerX + 100 + Math.sin(swingAngle) * 40;
            const swingY = centerY - 60 + Math.abs(Math.sin(swingAngle)) * 10;
            drawGirl(swingX, swingY, 0, 2.5, true);
            
            // Fiú mellette áll
            drawBoy(boyX, centerY - 40);
            
            // Hinta mozgatása - LASSABB
            swingAngle += 0.03 * swingDirection;
            if (swingAngle > 0.4) swingDirection = -1;
            if (swingAngle < -0.4) swingDirection = 1;
            
            // Rózsa a lány kezében
            if (roseInGirlHand) {
                drawRose(swingX + 130, swingY + 65, true);
            }
            
            // Szívek folyamatosan
            if (frame % 40 < 20) {
                drawHeart(centerX - 50, centerY - 150, 2);
                drawHeart(centerX + 80, centerY - 120, 1.5);
            }
            if ((frame + 20) % 40 < 20) {
                drawHeart(centerX + 20, centerY - 140, 1.8);
                drawHeart(centerX + 150, centerY - 100, 1.3);
            }
            
            if (frame > 240) {
                currentState = STATES.ENDED;
                controls.classList.remove('hidden');
            }
            break;
            
        case STATES.ENDED:
            drawSwing(centerX + 150, centerY + 120, swingAngle);
            
            const endSwingX = centerX + 100 + Math.sin(swingAngle) * 40;
            const endSwingY = centerY - 60 + Math.abs(Math.sin(swingAngle)) * 10;
            drawGirl(endSwingX, endSwingY, 0, 2.5, true);
            drawBoy(boyX, centerY - 40);
            
            if (roseInGirlHand) {
                drawRose(endSwingX + 130, endSwingY + 65, true);
            }
            
            // Hinta továbbra is mozog
            swingAngle += 0.03 * swingDirection;
            if (swingAngle > 0.4) swingDirection = -1;
            if (swingAngle < -0.4) swingDirection = 1;
            break;
    }
    
    requestAnimationFrame(animate);
}

// Gombok kezelése
restartBtn.addEventListener('click', () => {
    currentState = STATES.WALKING_TO_SHOP;
    frame = 0;
    boyX = -150;
    girlX = -50;
    roseInBoyHand = false;
    roseInGirlHand = false;
    swingAngle = 0;
    swingDirection = 1;
    controls.classList.add('hidden');
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
