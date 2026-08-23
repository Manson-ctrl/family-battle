const player = document.getElementById("player");
const fireButton = document.getElementById("fireButton");

let playerX = 50;
let bullets = [];

// Move with keyboard
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        playerX -= 5;
    }
    if (event.key === "ArrowRight") {
        playerX += 5;
    }

    // Keep player inside the screen
    if (playerX < 5) {
        playerX = 5;
    }
    if (playerX > 95) {
        playerX = 95;
    }

    player.style.left = playerX + "%";
});

// Shoot function
function shoot() {
    const bullet = document.createElement("div");
    bullet.textContent = "🔵";
    bullet.className = "bullet";
    bullet.style.left = playerX + "%";
    bullet.style.bottom = "90px";
    document.getElementById("game").appendChild(bullet);
    bullets.push(bullet);
}

// Keyboard shoot (Space)
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        shoot();
    }
});

// FIRE button (works on Android + desktop)
fireButton.addEventListener("click", shoot);
fireButton.addEventListener("touchstart", function(e) {
    e.preventDefault();
    shoot();
});

// Move the bullets up
function moveBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        let bottom = parseFloat(bullet.style.bottom);
        bottom += 10;
        bullet.style.bottom = bottom + "px";

        // Remove bullet when it goes off screen
        if (bottom > 800) {
            bullet.remove();
            bullets.splice(i, 1);
        }
    }
}

// Run the bullet movement
setInterval(moveBullets, 30);