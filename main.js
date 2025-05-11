const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const groundHeight = 10;
const groundY = canvas.height - groundHeight;

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
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function update() {
  if (keys['a']) player.x -= player.speed;
  if (keys['d']) player.x += player.speed;

  if (keys[' '] && !player.jumping) {
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
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Zemin
  ctx.fillStyle = '#444';
  ctx.fillRect(0, groundY, canvas.width, groundHeight);

  // Çöp adam: kafa
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(player.x + 10, player.y, 10, 0, Math.PI * 2);
  ctx.fill();

  // gövde
  ctx.fillRect(player.x + 8, player.y + 10, 4, 30);

  // kollar
  ctx.fillRect(player.x, player.y + 20, 8, 4);           // sol kol
  ctx.fillRect(player.x + 12, player.y + 20, 8, 4);      // sağ kol

  // silah (P250)
  ctx.fillStyle = 'gray';
  ctx.fillRect(player.x + 20, player.y + 18, 12, 6);     // P250 sağ elde

  // bacaklar
  ctx.fillStyle = 'yellow';
  ctx.fillRect(player.x + 5, player.y + 40, 4, 10);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
