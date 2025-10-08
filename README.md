🎮 Haxball Tools – Day 12/365
Welcome to Day 12 of my 1-year GitHub challenge! 🚀
Every day I release a new Haxball tool. Today’s tool is **PowerShot**, a script that lets players charge the ball and kick it with full power. ⚡

⚡ Features
🔥 Smooth ball charging with a visual color transition from white to red
💪 Full PowerShot kick when the charge reaches 100%
🎨 Visual feedback for charge level directly on the ball
✨ Marks every action with By TLS / Teleese

🛠 Installation
1. Copy `powershot.js` into your Haxball room script.
2. Track players and call these functions in your room events:
   - `onGameTick` – updates the ball charge and color
   - `onPlayerActivity` – detects if a player is holding the ball
   - `onPlayerBallKick` – executes the PowerShot
   - `onPlayerJoin` – initializes player charge tracking

📌 Example
```javascript
// PowerShot Haxball – Day 12/365
// By TLS / Teleese

const BALL_INDEX = 0;
const CHARGE_INCREMENT = 0.008;
const POWER_MULTIPLIER = 2;
const HOLD_TOLERANCE = 5;

const playerCharge = {};

room.onPlayerJoin = (player) => {
  playerCharge[player.id] = { charge: 0, holding: false, ready: false };
};

room.onGameTick = () => {
  const ball = room.getDiscProperties(BALL_INDEX);
  if(!ball) return;

  for(let id in playerCharge){
    const p = playerCharge[id];
    if(p.holding){ 
      p.charge = Math.min(p.charge + CHARGE_INCREMENT, 1);
      const eased = Math.pow(p.charge, 2.2);
      const red = Math.floor(255 * eased);
      const green = Math.floor(255 * (1 - eased) ** 2);
      const colorInt = (red << 16) | (green << 8);
      room.setDiscProperties(BALL_INDEX, { color: colorInt });
    }
  }
};

room.onPlayerActivity = (player) => {
  const ball = room.getDiscProperties(BALL_INDEX);
  const disc = room.getPlayerDiscProperties(player.id);
  if(!ball || !disc) return;

  const dist = Math.hypot(ball.x - disc.x, ball.y - disc.y);
  const p = playerCharge[player.id];

  if(dist < disc.radius + ball.radius + HOLD_TOLERANCE){
    p.holding = true;
    p.ready = true;
  } else if(p.holding){
    p.holding = false;
    p.charge = 0;
    p.ready = false;
    room.setDiscProperties(BALL_INDEX, { color: 0xFFFFFF });
  }
};

room.onPlayerBallKick = (player) => {
  const p = playerCharge[player.id];
  if(p?.ready && p.charge >= 1){
    const ball = room.getDiscProperties(BALL_INDEX);
    if(!ball) return;

    const vx = ball.xspeed * (1 + POWER_MULTIPLIER * p.charge);
    const vy = ball.yspeed * (1 + POWER_MULTIPLIER * p.charge);
    room.setDiscProperties(BALL_INDEX, { xspeed: vx, yspeed: vy });

    p.charge = 0;
    p.ready = false;
    room.setDiscProperties(BALL_INDEX, { color: 0xFFFFFF });
  }
};
