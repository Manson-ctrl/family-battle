const player = document.getElementById("player");
const fireButton = document.getElementById("fireButton");
const game = document.getElementById("game");

let playerX = 50;
let bullets = [];
let enemy = document.getElementById("enemy");
let enemyAlive = true;

// Move player with keyboard
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        playerX -= 5;
    }
    if (event.key === "ArrowRight") {
        playerX += 5;
    }

    // Keep player inside screen
    if (playerX < 8) playerX = 8;
    if (playerX > 92) playerX = 92;

    player.style.left = playerX + "%";
});

// Shoot function
function shoot() {
    const bullet = document.createElement("div");
    bullet.textContent = "🔵";
    bullet.className = "bullet";
    bullet.style.left = playerX + "%";
    bullet.style.bottom = "100px";
    game.appendChild(bullet);
    bullets.push(bullet);
}

// Keyboard shoot
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        shoot();
    }
});

// FIRE button (works on phone)
fireButton.addEventListener("click", shoot);
fireButton.addEventListener("touchstart", function(e) {
    e.preventDefault();
    shoot();
});

// Move bullets and check collision
function moveBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        let bottom = parseFloat(bullet.style.bottom);
        bottom += 12;
        bullet.style.bottom = bottom + "px";

        // Check if bullet hits enemy
        if (enemyAlive && bottom > 500) {
            // Simple hit detection
            let bulletLeft = parseFloat(bullet.style.left);
            let enemyLeft = 50; // enemy is in the middle

            if (Math.abs(bulletLeft - enemyLeft) < 12) {
                // Enemy dies
                enemyAlive = false;
                enemy.style.display = "none"; // hide enemy
                bullet.remove();
                bullets.splice(i, 1);

                // Bring new enemy after 1 second
                setTimeout(function() {
                    spawnNewEnemy();
                }, 1000);
                continue;
            }
        }

        // Remove bullet if it goes too high
        if (bottom > 750) {
            bullet.remove();
            bullets.splice(i, 1);
        }
    }
}

// Spawn new enemy
function spawnNewEnemy() {
    enemy.style.display = "block";
    enemyAlive = true;

    
}

// Run the game loop
setInterval(moveBullets, 30);