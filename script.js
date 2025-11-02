const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');
const restartBtn = document.getElementById('restartBtn');
const closeBtn = document.getElementById('closeBtn');

// Canvas méret beállítása - TELJES KÉPERNYŐ
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
let animationSpeed = 0.8; // LASSABB (volt 1.5)
let swingAngle = 0;
let swingDirection = 1;

// Karakterek rajzolása pixel art stílusban
function drawPixelRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

// Fiú karakter rajzolása - részletesebb (fekete bőrkabát)
function drawBoy(x, y, walkFrame = 0, scale = 3) { // NAGYOBB (volt 2.5)
    const px = Math.floor(x);
    const py = Math.floor(y);
    const s = scale;
    
    // Lábak - fekete jogger animálva - LASSABB
    if (walkFrame % 50 < 25) { // LASSABB (volt 30 < 15)
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
function drawGirl(x, y, walkFrame = 0, scale = 3, sitting = false) { // NAGYOBB (volt 2.5)
    const px = Math.floor(x);
    const py = Math.floor(y);
    const s = scale;
    
    if (!sitting) {
        // Álló pozíció - lábak animálva - LASSABB
        if (walkFrame % 50 < 25) { // LASSABB (volt 30 < 15)
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

// Virágbolt rajzolása - részletesebb, NAGYOBB
function drawShop(x, y, scale = 1.3) { // NAGYOBB
    const px = Math.floor(x);
    const py = Math.floor(y);
    const s = scale;
    
    // Bolt alapja - részletes fal
    drawPixelRect(px - 60*s, py + 40*s, 140*s, 140*s, '#a0785a');
    drawPixelRect(px - 58*s, py + 42*s, 136*s, 136*s, '#b88a6f');
    
    // Tégla minta
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 8; j++) {
            const offsetX = (i % 2) * 10*s;
            drawPixelRect(px - 55*s + j * 18*s + offsetX, py + 45*s + i * 18*s, 16*s, 16*s, '#c9956a');
            drawPixelRect(px - 54*s + j * 18*s + offsetX, py + 46*s + i * 18*s, 14*s, 14*s, '#d4a378');
        }
    }
    
    // Tető - részletes
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(px - 80*s, py + 40*s);
    ctx.lineTo(px, py - 10*s);
    ctx.lineTo(px + 100*s, py + 40*s);
    ctx.fill();
    
    // Tető árnyék
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.moveTo(px - 75*s, py + 35*s);
    ctx.lineTo(px, py);
    ctx.lineTo(px + 95*s, py + 35*s);
    ctx.fill();
    
    // Ajtó - részletes
    drawPixelRect(px - 20*s, py + 110*s, 50*s, 70*s, '#5a3a1a');
    drawPixelRect(px - 18*s, py + 112*s, 46*s, 66*s, '#6b4a2a');
    
    // Ajtó táblák
    drawPixelRect(px - 15*s, py + 115*s, 18*s, 25*s, '#7a5a3a');
    drawPixelRect(px + 7*s, py + 115*s, 18*s, 25*s, '#7a5a3a');
    drawPixelRect(px - 15*s, py + 145*s, 18*s, 25*s, '#7a5a3a');
    drawPixelRect(px + 7*s, py + 145*s, 18*s, 25*s, '#7a5a3a');
    
    // Kilincs - arany
    drawPixelRect(px + 20*s, py + 145*s, 5*s, 5*s, '#ffd700');
    drawPixelRect(px + 21*s, py + 146*s, 3*s, 3*s, '#ffed4e');
    
    // Tábla: "VIRÁG"
    ctx.fillStyle = '#fff8dc';
    ctx.fillRect(px - 45*s, py + 8*s, 100*s, 25*s);
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3*s;
    ctx.strokeRect(px - 45*s, py + 8*s, 100*s, 25*s);
    
    ctx.fillStyle = '#d4145a';
    ctx.font = `bold ${20*s}px Arial`;
    ctx.fillText('VIRÁGBOLT', px - 40*s, py + 28*s);
    
    // Ablak
    drawPixelRect(px - 55*s, py + 55*s, 35*s, 40*s, '#87ceeb');
    drawPixelRect(px - 54*s, py + 56*s, 33*s, 38*s, '#b0e0e6');
    // Ablakkeret
    drawPixelRect(px - 55*s, py + 74*s, 35*s, 2*s, '#5a3a1a');
    drawPixelRect(px - 38*s, py + 55*s, 2*s, 40*s, '#5a3a1a');
    
    // Virágok az ablakban - részletesebben
    drawPixelRect(px - 52*s, py + 65*s, 6*s, 8*s, '#ff69b4');
    drawPixelRect(px - 51*s, py + 63*s, 4*s, 4*s, '#ff1493');
    
    drawPixelRect(px - 44*s, py + 62*s, 6*s, 8*s, '#ff0000');
    drawPixelRect(px - 43*s, py + 60*s, 4*s, 4*s, '#dc143c');
    
    drawPixelRect(px - 36*s, py + 65*s, 6*s, 8*s, '#ffff00');
    drawPixelRect(px - 35*s, py + 63*s, 4*s, 4*s, '#ffd700');
    
    // Száruk
    drawPixelRect(px - 49*s, py + 73*s, 1*s, 8*s, '#228B22');
    drawPixelRect(px - 41*s, py + 70*s, 1*s, 8*s, '#228B22');
    drawPixelRect(px - 33*s, py + 73*s, 1*s, 8*s, '#228B22');
}

// Játszótér hinta rajzolása - lassabb mozgással, NAGYOBB
function drawSwing(x, y, angle = 0, scale = 1.3) { // NAGYOBB
    const px = Math.floor(x);
    const py = Math.floor(y);
    const s = scale;
    
    // Hinta állvány - részletes
    drawPixelRect(px - 100*s, py - 150*s, 12*s, 150*s, '#8B4513');
    drawPixelRect(px + 88*s, py - 150*s, 12*s, 150*s, '#8B4513');
    // Állvány árnyék
    drawPixelRect(px - 98*s, py - 148*s, 4*s, 146*s, '#654321');
    drawPixelRect(px + 90*s, py - 148*s, 4*s, 146*s, '#654321');
    
    // Felső gerenda
    drawPixelRect(px - 100*s, py - 162*s, 200*s, 12*s, '#8B4513');
    drawPixelRect(px - 98*s, py - 160*s, 196*s, 8*s, '#a0622d');
    
    // Támaszok
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 6*s;
    ctx.beginPath();
    ctx.moveTo(px - 90*s, py - 150*s);
    ctx.lineTo(px - 20*s, py - 150*s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px + 90*s, py - 150*s);
    ctx.lineTo(px + 20*s, py - 150*s);
    ctx.stroke();
    
    // Láncok - fém láncok
    const chainOffset = Math.sin(angle) * 40*s;
    ctx.strokeStyle = '#505050';
    ctx.lineWidth = 6*s;
    
    // Bal lánc
    ctx.beginPath();
    ctx.moveTo(px - 60*s, py - 150*s);
    ctx.lineTo(px - 40*s + chainOffset, py - 30*s);
    ctx.stroke();
    
    // Jobb lánc
    ctx.beginPath();
    ctx.moveTo(px + 60*s, py - 150*s);
    ctx.lineTo(px + 40*s + chainOffset, py - 30*s);
    ctx.stroke();
    
    // Lánc részletek
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 4*s;
    ctx.beginPath();
    ctx.moveTo(px - 59*s, py - 150*s);
    ctx.lineTo(px - 39*s + chainOffset, py - 30*s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px + 61*s, py - 150*s);
    ctx.lineTo(px + 41*s + chainOffset, py - 30*s);
    ctx.stroke();
    
    // Hinta ülés - fa
    drawPixelRect(px - 50*s + chainOffset, py - 30*s, 100*s, 15*s, '#CD853F');
    drawPixelRect(px - 48*s + chainOffset, py - 28*s, 96*s, 11*s, '#DEB887');
    // Fa ér minta
    drawPixelRect(px - 45*s + chainOffset, py - 27*s, 2*s, 9*s, '#c19a6b');
    drawPixelRect(px - 20*s + chainOffset, py - 27*s, 2*s, 9*s, '#c19a6b');
    drawPixelRect(px + 5*s + chainOffset, py - 27*s, 2*s, 9*s, '#c19a6b');
    drawPixelRect(px + 30*s + chainOffset, py - 27*s, 2*s, 9*s, '#c19a6b');
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
            
            // Karakterek oldalról jönnek - LASSABBAN
            if (boyX < centerX - 280) { // Több távolság
                boyX += animationSpeed;
                girlX += animationSpeed;
            } else {
                currentState = STATES.AT_SHOP;
                frame = 0;
            }
            
            drawBoy(boyX, centerY - 100, frame);
            drawGirl(girlX, centerY - 100, frame);
            break;
            
        case STATES.AT_SHOP:
            drawShop(centerX, centerY - 100);
            drawBoy(boyX, centerY - 100);
            drawGirl(girlX, centerY - 100);
            
            if (frame > 120) { // LASSABB (volt 60)
                currentState = STATES.BUYING_ROSE;
                frame = 0;
            }
            break;
            
        case STATES.BUYING_ROSE:
            drawShop(centerX, centerY - 100);
            drawBoy(boyX, centerY - 100);
            drawGirl(girlX, centerY - 100);
            
            // Vásárlás animáció - LASSABB
            if (frame > 60 && frame < 120) { // LASSABB (volt 30-60)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '40px Arial'; // Nagyobb emoji
                ctx.fillText('💐', centerX, centerY - 200);
            }
            
            if (frame > 180) { // LASSABB (volt 90)
                roseInBoyHand = true;
                currentState = STATES.GIVING_ROSE;
                frame = 0;
            }
            break;
            
        case STATES.GIVING_ROSE:
            drawShop(centerX, centerY - 100);
            drawBoy(boyX, centerY - 100);
            drawGirl(girlX, centerY - 100);
            
            if (frame < 60) {
                // Fiú nyújtja a rózsát
                drawRose(boyX + 160, centerY + 20, true);
            } else if (frame < 120) {
                // Rózsa lebeg a kettejük között
                const progress = (frame - 60) / 60;
                const roseX = boyX + 160 + (girlX - boyX - 60) * progress;
                const roseY = centerY + 20 - 30; // Magasabban
                drawRose(roseX, roseY, true);
                
                // Kezek mozgása jelzése - kis körök
                ctx.fillStyle = 'rgba(255, 182, 193, 0.5)';
                ctx.beginPath();
                ctx.arc(boyX + 170, centerY + 50, 10 * (1 - progress), 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(girlX - 30, centerY + 50, 10 * progress, 0, Math.PI * 2);
                ctx.fill();
            } else {
                roseInGirlHand = true;
                roseInBoyHand = false;
                
                // Konfetti effekt az átadásnál
                if (frame < 180) {
                    for (let i = 0; i < 15; i++) {
                        const confettiX = centerX - 100 + Math.random() * 200;
                        const confettiY = centerY - 50 - (frame - 120) * 2 + i * 10;
                        const confettiSize = 4 + Math.random() * 6;
                        ctx.fillStyle = ['#ff69b4', '#ff1493', '#ffc0cb', '#ff85a2'][i % 4];
                        ctx.fillRect(confettiX, confettiY, confettiSize, confettiSize);
                    }
                }
                
                // Szívek - szebb animáció
                for (let i = 0; i < 5; i++) {
                    const heartY = centerY - 150 - (frame - 160) * 1.5 + i * 50;
                    const heartX = centerX - 140 + Math.sin((frame + i * 30) / 15) * 40;
                    if (heartY > 0) {
                        const alpha = Math.max(0, 1 - (frame - 160) / 100);
                        ctx.globalAlpha = alpha;
                        drawHeart(heartX, heartY, 2.2);
                        ctx.globalAlpha = 1;
                    }
                }
            }
            
            if (roseInGirlHand) {
                drawRose(girlX - 40, centerY + 60, true);
            }
            
            if (frame > 300) {
                currentState = STATES.WALKING_TO_PLAYGROUND;
                frame = 0;
            }
            break;
            
        case STATES.WALKING_TO_PLAYGROUND:
            // Elhalványuló bolt
            ctx.globalAlpha = Math.max(0, 1 - frame / 120);
            drawShop(centerX, centerY - 100);
            ctx.globalAlpha = 1;
            
            // Karakterek sétálnak jobbra a hinta felé - LASSABBAN
            const walkProgress = frame / 240; // LASSABB (volt 180)
            const targetX = canvas.width - 550; // Bal oldalra, hogy ne takarják el a hintát
            
            boyX = centerX - 280 + (targetX - (centerX - 280)) * walkProgress;
            girlX = centerX - 180 + (targetX + 100 - (centerX - 180)) * walkProgress;
            
            drawBoy(boyX, centerY - 100, frame);
            drawGirl(girlX, centerY - 100, frame);
            
            if (roseInGirlHand) {
                drawRose(girlX - 40, centerY + 60, true);
            }
            
            if (frame > 240) { // LASSABB (volt 180)
                currentState = STATES.AT_SWING;
                frame = 0;
            }
            break;
            
        case STATES.AT_SWING:
            // Hinta a jobb szélen
            const swingPosX = canvas.width - 280;
            
            // Hinta beúszik - animáció - LASSABBAN
            let swingAnimX = swingPosX;
            if (frame < 90) { // LASSABB (volt 60)
                const slideProgress = frame / 90;
                swingAnimX = canvas.width + 300 - (canvas.width + 300 - swingPosX) * slideProgress;
            }
            
            drawSwing(swingAnimX, centerY + 150, swingAngle);
            
            // Lány odamegy a hintához és leül
            let girlSwingX, girlSwingY;
            if (frame < 120) { // LASSABB (volt 60) - séta a hintához
                const walkToSwing = frame / 120;
                girlSwingX = girlX + (swingAnimX - 70 - girlX) * walkToSwing; // Pontosabb pozíció
                girlSwingY = centerY - 100;
                drawGirl(girlSwingX, girlSwingY, frame, 3, false);
                
                // Fiú háttérben áll - NEM TAKARJA EL
                drawBoy(boyX, centerY - 100);
                
                if (roseInGirlHand) {
                    drawRose(girlSwingX - 40, centerY + 60, true);
                }
            } else if (frame < 170) { // LASSABB (volt 90) - leülés
                const sitProgress = (frame - 120) / 50;
                girlSwingX = swingAnimX - 70; // Pontosan a hinta közepére
                girlSwingY = centerY - 100 + (centerY - 80 - (centerY - 100)) * sitProgress;
                
                // Fiú ELÖL rajzolva
                drawBoy(boyX, centerY - 100);
                // Lány HÁTUL (később rajzolva = felül)
                drawGirl(girlSwingX, girlSwingY, 0, 3, sitProgress > 0.5);
                
                if (roseInGirlHand) {
                    drawRose(girlSwingX + (sitProgress > 0.5 ? 170 : -40), girlSwingY + (sitProgress > 0.5 ? 80 : 60), true);
                }
            } else {
                // Hintázás - LÁNY MINDIG ELÖL
                girlSwingX = swingAnimX - 70 + Math.sin(swingAngle) * 50; // Pontosan a hinta közepén
                girlSwingY = centerY - 80 + Math.abs(Math.sin(swingAngle)) * 15;
                
                // Fiú ELŐSZÖR (háttér)
                drawBoy(boyX, centerY - 100);
                // Lány UTÁNA (előtér)
                drawGirl(girlSwingX, girlSwingY, 0, 3, true);
                
                // Hinta csak a leülés után mozog
                swingAngle += 0.015 * swingDirection;
                if (swingAngle > 0.35) swingDirection = -1;
                if (swingAngle < -0.35) swingDirection = 1;
                
                // Rózsa a lány kezében
                if (roseInGirlHand) {
                    drawRose(girlSwingX + 170, girlSwingY + 100, true);
                }
                
                // Szívek folyamatosan
                if (frame % 60 < 30) {
                    drawHeart(swingAnimX - 100, centerY - 200, 2.5);
                    drawHeart(swingAnimX + 150, centerY - 150, 2);
                }
                if ((frame + 30) % 60 < 30) {
                    drawHeart(swingAnimX + 30, centerY - 180, 2.2);
                    drawHeart(swingAnimX + 200, centerY - 130, 1.8);
                }
            }
            
            if (frame > 540) { // LASSABB (volt 480) - több idő a hintázásra
                currentState = STATES.ENDED;
                controls.classList.remove('hidden');
            }
            break;
            
        case STATES.ENDED:
            const finalSwingPosX = canvas.width - 280;
            drawSwing(finalSwingPosX, centerY + 150, swingAngle);
            
            const endSwingX = finalSwingPosX - 70 + Math.sin(swingAngle) * 50; // Pontosan a hinta közepén
            const endSwingY = centerY - 80 + Math.abs(Math.sin(swingAngle)) * 15;
            
            // Fiú ELŐSZÖR (háttér)
            drawBoy(boyX, centerY - 100);
            // Lány UTÁNA (előtér)
            drawGirl(endSwingX, endSwingY, 0, 3, true);
            
            if (roseInGirlHand) {
                drawRose(endSwingX + 170, endSwingY + 100, true);
            }
            
            // Hinta továbbra is mozog
            swingAngle += 0.015 * swingDirection;
            if (swingAngle > 0.35) swingDirection = -1;
            if (swingAngle < -0.35) swingDirection = 1;
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
