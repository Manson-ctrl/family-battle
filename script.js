const player = document.getElementById("player");

let playerX = 50;

document.addEventListener("keydown", function(event) {

    // Move left
    if (event.key === "ArrowLeft") {
        playerX -= 5;
    }

    // Move right
    if (event.key === "ArrowRight") {
        playerX += 5;
    }

    // Keep Success inside the screen
    if (playerX < 5) {
        playerX = 5;
    }

    if (playerX > 95) {
        playerX = 95;
    }

    player.style.left = playerX + "%";

let bullets = [];

function shoot() {

    const bullet = document.createElement("div");

    bullet.textContent = "🔵";

    bullet.className = "bullet";

    bullet.style.left = playerX + "%";

    bullet.style.bottom = "90px";

    document.getElementById("game").appendChild(bullet);

    bullets.push(bullet);
}
document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {
        shoot();
    }

});
setInterval(function() {

    moveBullets();

}, 30);