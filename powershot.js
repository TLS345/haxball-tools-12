// Powershoot – Day 12/365
// By TLS / Teleese

const BALL_INDEX = 0;
const CHARGE_INCREMENT = 0.008;
const POWER_MULTIPLIER = 2; // Change this Value for more or less Power :) 
const HOLD_TOLERANCE = 5;
const playerCharge = {};

function onGameTick(room) {
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
}

function onPlayerActivity(room, player) {
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
}

function onPlayerBallKick(room, player) {
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
}
