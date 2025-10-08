🎮 Haxball Tools – Day 12/365}

⚡ Features
🔥 Smooth ball charging with color transition from white to red
💪 Full PowerShot kick when charge reaches 100%
🎨 Visual feedback for charge level

🛠 Installation
Copy powershot.js into your Haxball room script.
Make sure to track players and call the following functions in your room events:
- `onGameTick` – updates the ball charge and color
- `onPlayerActivity` – detects if a player is holding the ball
- `onPlayerBallKick` – executes the PowerShot

📌 Example
// PowerShot Haxball – Day 1/365
// By TLS / Teleese
room.onGameTick = () => {
  onGameTick(room);
};

room.onPlayerActivity = (player) => {
  onPlayerActivity(room, player);
};

room.onPlayerBallKick = (player) => {
  onPlayerBallKick(room, player);
};
