const game = document.getElementById("game");
const player = document.getElementById("player");

const fireButton = document.getElementById("fireButton");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let playerX = 50;
let bullets = [];
let enemies = [];

let playerHealth = 100;
let kills = 0;

let lastShot = 0;
const shotDelay = 300;


// ============================
// PLAYER MOVEMENT
// ============================

function movePlayer(direction) {

    playerX += direction * 5;

    if (playerX < 5) playerX = 5;
    if (playerX > 95) playerX = 95;

    player.style.left = playerX + "%";
}


// Keyboard movement
document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {
        movePlayer(-1);
    }

    if (event.key === "ArrowRight") {
        movePlayer(1);
    }

    if (event.code === "Space") {
        shoot();
    }

});


// Phone movement
leftBtn.addEventListener("click", function() {
    movePlayer(-1);
});

rightBtn.addEventListener("click", function() {
    movePlayer(1);
});


// ============================
// SHOOTING
// ============================

function shoot() {

    const now = Date.now();

    // Prevent extremely rapid firing
    if (now - lastShot < shotDelay) {
        return;
    }

    lastShot = now;

    const bullet = document.createElement("div");

    bullet.className = "bullet";
    bullet.textContent = "🔵";

    bullet.style.left = playerX + "%";
    bullet.style.bottom = "100px";

    game.appendChild(bullet);

    bullets.push(bullet);
}


// Fire button
fireButton.addEventListener("click", shoot);

fireButton.addEventListener("touchstart", function(event) {

    event.preventDefault();

    shoot();

});


// ============================
// ENEMY CREATION
// ============================

function spawnEnemy() {

    const enemy = document.createElement("div");

    enemy.className = "enemy";

    enemy.textContent = "👾";

    // Random starting position
    const x = Math.random() * 90 + 5;

    enemy.style.left = x + "%";
    enemy.style.top = "30px";

    enemy.dataset.health = "100";

    game.appendChild(enemy);

    enemies.push(enemy);
}


// Create several enemies
spawnEnemy();
spawnEnemy();
spawnEnemy();


// ============================
// BULLET MOVEMENT
// ============================

function updateBullets() {

    for (let i = bullets.length - 1; i >= 0; i--) {

        const bullet = bullets[i];

        let bottom = parseFloat(bullet.style.bottom);

        bottom += 10;

        bullet.style.bottom = bottom + "px";


        // Check every enemy
        for (let j = enemies.length - 1; j >= 0; j--) {

            const enemy = enemies[j];

            if (checkCollision(bullet, enemy)) {

                let health = Number(enemy.dataset.health);

                health -= 25;

                enemy.dataset.health = health;

                bullet.remove();

                bullets.splice(i, 1);

                // Enemy only dies at zero health
                if (health <= 0) {

                    enemy.remove();

                    enemies.splice(j, 1);

                    kills++;

                    console.log("Enemy defeated!");

                    // New enemy appears
                    setTimeout(spawnEnemy, 500);
                }

                break;
            }
        }


        // Remove bullet when it leaves the game
        if (bottom > game.clientHeight) {

            bullet.remove();

            bullets.splice(i, 1);
        }
    }
}


// ============================
// COLLISION DETECTION
// ============================

function checkCollision(object1, object2) {

    const a = object1.getBoundingClientRect();
    const b = object2.getBoundingClientRect();

    return (

        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top

    );
}


// ============================
// ENEMY MOVEMENT
// ============================

function updateEnemies() {

    enemies.forEach(function(enemy) {

        let top = parseFloat(enemy.style.top);

        top += 0.5;

        enemy.style.top = top + "px";


        // Enemy reached Success
        if (top > game.clientHeight - 120) {

            playerHealth -= 5;

            enemy.remove();

            enemies = enemies.filter(function(item) {

                return item !== enemy;

            });

            setTimeout(spawnEnemy, 500);

            console.log("Success HP:", playerHealth);
        }

    });

}


// ============================
// GAME LOOP
// ============================

function gameLoop() {

    updateBullets();

    updateEnemies();

    requestAnimationFrame(gameLoop);
}

gameLoop();