// Ana karakter ve oyun dünyasının temelini oluşturuyoruz
const canvas = document.createElement('canvas');
document.body.style.margin = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let keys = {};
let bullets = [];
let loots = [];
let buildings = [];

const player = {
  x: 100,
  y: canvas.height - 150,
  width: 30,
  height: 50,
  color: 'yellow',
  speed: 5,
  vx: 0,
  vy: 0,
  jumping: false,
  gravity: 0.5,
  jumpPower: -10,
  onGround: false,
  inventory: []
};

const camera = {
  x: 0,
  y: 0
};

function createBuilding(x) {
  const floors = 3;
  const floorHeight = 100;
  const width = 80;
  const height = floors * floorHeight;
  let building = {
    x,
    y: canvas.height - height - 50,
    width,
    height,
    floors,
    loots: [],
    stairs: []
  };
  for (let i = 0; i < floors; i++) {
    const hasLoot = Math.random() < 0.6;
    if (hasLoot) {
      building.loots.push({
        x: x + 20,
        y: canvas.height - 50 - i * floorHeight - 60,
        width: 20,
        height: 20,
        type: ['çanta', 'kask', 'ayakkabı'][Math.floor(Math.random() * 3)],
        collected: false
      });
    }
    building.stairs.push({
      x: x + width - 10,
      y: canvas.height - 50 - (i + 1) * floorHeight,
      width: 10,
      height: floorHeight
    });
  }
  return building;
}

for (let i = 0; i < 10; i++) {
  buildings.push(createBuilding(i * 160));
}

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

window.addEventListener('blur', () => {
  keys = {}; // Sekme değişince tüm tuşlar bırakılmış sayılır
});

canvas.addEventListener('click', () => {
  bullets.push({
    x: player.x + player.width / 2,
    y: player.y + player.height / 2,
    vx: 10,
    vy: 0
  });
});

function update() {
  // Hareket
  if (keys['a']) player.vx = -player.speed;
  else if (keys['d']) player.vx = player.speed;
  else player.vx = 0;

  if (keys[' '] && player.onGround) {
    player.vy = player.jumpPower;
    player.jumping = true;
    player.onGround = false;
  }

  player.vy += player.gravity;
  player.x += player.vx;
  player.y += player.vy;

  // Yere çarpma
  if (player.y + player.height >= canvas.height - 50) {
    player.y = canvas.height - 50 - player.height;
    player.vy = 0;
    player.onGround = true;
  }

  // Kamera takibi
  camera.x = player.x - canvas.width / 2 + player.width / 2;

  // Loot alma
  if (keys['e']) {
    buildings.forEach(b => {
      b.loots.forEach(l => {
        if (!l.collected &&
            player.x + player.width > l.x &&
            player.x < l.x + l.width &&
            player.y + player.height > l.y &&
            player.y < l.y + l.height) {
          l.collected = true;
          player.inventory.push(l.type);
        }
      });
    });
  }

  // Mermi güncelleme
  bullets.forEach(b => {
    b.x += b.vx;
  });

  bullets = bullets.filter(b => b.x < camera.x + canvas.width);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  // Zemin
  ctx.fillStyle = 'gray';
  ctx.fillRect(camera.x, canvas.height - 50, 10000, 50);

  // Oyuncu
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Binalar
  buildings.forEach(b => {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(b.x, b.y, b.width, b.height);
    b.stairs.forEach(s => {
      ctx.fillStyle = 'brown';
      ctx.fillRect(s.x, s.y, s.width, s.height);
    });
    b.loots.forEach(l => {
      if (!l.collected) {
        ctx.fillStyle = 'orange';
        ctx.fillRect(l.x, l.y, l.width, l.height);
        ctx.fillStyle = 'black';
        ctx.fillText(`E: ${l.type}`, l.x - 10, l.y - 5);
      }
    });
  });

  // Mermiler
  ctx.fillStyle = 'orange';
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, 10, 4);
  });

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
