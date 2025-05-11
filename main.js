const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const groundHeight = 10;
const groundY = canvas.height - groundHeight;

let cameraX = 0;

const player = {
  x: 100,
  y: groundY - 60,
  width: 20,
  height: 50,
  dx: 0,
  dy: 0,
  speed: 5,
  jumping: false,
  gravity: 1.5
};

const keys = {};
document.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
document.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

const buildings = [];

function generateBuilding(xPos) {
  const floors = 3;
  const floorHeight = 80;
  const width = 100;
  const lootTypes = ["🎒", "🪖", "🧰"]; // çanta, kask, set

  const loot = lootTypes[Math.floor(Math.random() * lootTypes.length)];

  return {
    x: xPos,
    width: width,
    floors: floors,
    floorHeight: floorHeight,
    loot: loot
  };
}

// Başlangıçta birkaç bina ekle
for (let i = 0; i < 10; i++) {
  buildings.push(generateBuilding(i * 160));
}

function update() {
  // Hareket
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  if (keys[" "] && !player.jumping) {
    player.dy = -20;
    player.jumping = true;
  }

  player.dy += player.gravity;
  player.y += player.dy;

  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.dy = 0;
    player.jumping = false;
  }

  // Kamera takibi
  cameraX = player.x - canvas.width / 2;

  // Sonsuz bina oluşturma
  const lastBuilding = buildings[buildings.length - 1];
  if (lastBuilding.x - cameraX < canvas.width) {
    buildings.push(generateBuilding(lastBuilding.x + 160));
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Zemin
  ctx.fillStyle = "#444";
  ctx.fillRect(0, groundY, canvas.width, groundHeight);

  // Evler
  buildings.forEach((building) => {
    for (let i = 0; i < building.floors; i++) {
      const bx = building.x - cameraX;
      const by = groundY - (i + 1) * building.floorHeight;

      ctx.fillStyle = "#999";
      ctx.fillRect(bx, by, building.width, building.floorHeight - 5);

      // Merdiven
      ctx.fillStyle = "#222";
      ctx.fillRect(bx + building.width - 10, by + 10, 5, building.floorHeight - 25);

      // Loot (örnek emoji)
      if (i === 1) {
        ctx.font = "20px Arial";
        ctx.fillText(building.loot, bx + 20, by + 40);
      }
    }
  });

  // Oyuncu (çöp adam)
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(player.x - cameraX + 10, player.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(player.x - cameraX + 8, player.y + 10, 4, 30); // gövde
  ctx.fillRect(player.x - cameraX, player.y + 20, 8, 4); // sol kol
  ctx.fillRect(player.x - cameraX + 12, player.y + 20, 8, 4); // sağ kol
  ctx.fillStyle = "gray";
  ctx.fillRect(player.x - cameraX + 20, player.y + 18, 12, 6); // p250
  ctx.fillStyle = "yellow";
  ctx.fillRect(player.x - cameraX + 5, player.y + 40, 4, 10); // bacak
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
