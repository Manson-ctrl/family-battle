const player = document.getElementById("player");

let playerX = 50;

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {
        playerX -= 5;
    }

    if (event.key === "ArrowRight") {
        playerX += 5;
    }

    if (playerX < 5) {
        playerX = 5;
    }

    if (playerX > 95) {
        playerX = 95;
    }

    player.style.left = playerX + "%";

});