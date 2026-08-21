const player = document.querySelector("p");

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {
        player.textContent = "⬅️ Success is moving left!";
    }

    if (event.key === "ArrowRight") {
        player.textContent = "Success is moving right! ➡️";
    }

});