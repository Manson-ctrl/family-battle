const game = document.getElementById("game");
const player = document.getElementById("player");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const fireButton = document.getElementById("fireButton");

const playerHealthBar =
    document.getElementById("playerHealth");

const playerHealthText =
    document.getElementById("playerHealthText");

const killCount =
    document.getElementById("killCount");


// ============================
// GAME VARIABLES
// ============================

let playerX = 50;

let playerHealth = 100;

let kills = 0;

let bullets = [];

let enemies = [];

let lastShot = 0;

let lastDamage = 0;


// ============================
// PLAYER MOVEMENT
// ============================

function movePlayer(direction) {

    // MUCH faster movement
    playerX += direction * 25;

    if (playerX < 5) {
        playerX = 5;
    }

    if (playerX > 95) {
        playerX = 95;
    }

    player.style.left = playerX + "%";
}


// Phone controls

leftBtn.addEventListener("touchstart", function(e) {
    e.preventDefault();
    movePlayer(-1);
});

rightBtn.addEventListener("touchstart", function(e) {
    e.preventDefault();
    movePlayer(1);
});


// Also allow tapping

leftBtn.addEventListener("click", function() {
    movePlayer(-1);
});

rightBtn.addEventListener("click", function() {
    movePlayer(1);
});


// Keyboard controls

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


// ============================
// SHOOTING
// ============================

function shoot() {

    const now = Date.now();

    if (now - lastShot < 250) {
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


// FIRE BUTTON

fireButton.addEventListener("click", shoot);

fireButton.addEventListener("touchstart", function(e) {

    e.preventDefault();

    shoot();

});


// ============================
// CREATE ENEMY
// ============================

function spawnEnemy() {

    const enemy = document.createElement("div");

    enemy.className = "enemy";

    enemy.innerHTML = `
        <div class="enemyHp">
            <div class="enemyHpBar"></div>
        </div>
        <div class="enemyBody">👾</div>
    `;

    // Random horizontal position

    const x = 5 + Math.random() * 90;

    enemy.style.left = x + "%";

    enemy.style.top = "-70px";

    enemy.health = 100;

    // Different enemy speeds

    enemy.speed =
        1.5 + Math.random() * 2;

    // Attack cooldown

    enemy.lastAttack = 0;

    game.appendChild(enemy);

    enemies.push(enemy);
}


// Start with 5 enemies

for (let i = 0; i < 5; i++) {

    setTimeout(function() {

        spawnEnemy();

    }, i * 500);

}


// ============================
// BULLET UPDATE
// ============================

function updateBullets() {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet = bullets[i];

        let bottom =
            parseFloat(bullet.style.bottom);

        bottom += 14;

        bullet.style.bottom =
            bottom + "px";


        // Check collision
        // with every enemy

        for (
            let j = enemies.length - 1;
            j >= 0;
            j--
        ) {

            const enemy = enemies[j];

            if (checkCollision(bullet, enemy)) {

                // Bullet damage

                enemy.health -= 25;

                updateEnemyHealth(enemy);

                bullet.remove();

                bullets.splice(i, 1);


                // Enemy dies ONLY at zero

                if (enemy.health <= 0) {

                    killEnemy(enemy, j);

                }

                break;
            }
        }


        // Remove bullet
        // outside game

        if (
            bottom >
            game.clientHeight
        ) {

            bullet.remove();

            bullets.splice(i, 1);
        }
    }
}


// ============================
// ENEMY HEALTH
// ============================

function updateEnemyHealth(enemy) {

    const bar =
        enemy.querySelector(".enemyHpBar");

    bar.style.width =
        enemy.health + "%";
}


// ============================
// KILL ENEMY
// ============================

function killEnemy(enemy, index) {

    enemy.remove();

    enemies.splice(index, 1);

    kills++;

    killCount.textContent =
        kills;

    // Spawn replacement

    setTimeout(function() {

        spawnEnemy();

    }, 300);
}


// ============================
// ENEMY MOVEMENT + ATTACK
// ============================

function updateEnemies() {

    const playerRect =
        player.getBoundingClientRect();


    enemies.forEach(function(enemy) {

        let top =
            parseFloat(enemy.style.top);


        // Enemy falls FAST

        top += enemy.speed;


        enemy.style.top =
            top + "px";


        const enemyRect =
            enemy.getBoundingClientRect();


        // Enemy attacks when
        // close to Success

        const verticalDistance =
            Math.abs(
                enemyRect.bottom -
                playerRect.top
            );


        const horizontalDistance =
            Math.abs(
                enemyRect.left -
                playerRect.left
            );


        if (
            verticalDistance < 80 &&
            horizontalDistance < 70
        ) {

            const now = Date.now();


            // Damage once every 700ms

            if (
                now - enemy.lastAttack >
                700
            ) {

                enemy.lastAttack =
                    now;

                damagePlayer(10);
            }
        }


        // Enemy passes the player

        if (
            top >
            game.clientHeight
        ) {

            enemy.remove();

            enemies =
                enemies.filter(function(item) {

                    return item !== enemy;

                });

            spawnEnemy();
        }

    });
}


// ============================
// PLAYER DAMAGE
// ============================

function damagePlayer(amount) {

    const now = Date.now();

    if (
        now - lastDamage <
        300
    ) {
        return;
    }

    lastDamage = now;

    playerHealth -= amount;


    if (playerHealth < 0) {

        playerHealth = 0;

    }


    playerHealthBar.style.width =
        playerHealth + "%";

    playerHealthText.textContent =
        playerHealth + " / 100";


    // Game over

    if (playerHealth <= 0) {

        gameOver();

    }
}


// ============================
// GAME OVER
// ============================

function gameOver() {

    alert(
        "SUCCESS HAS FALLEN!\n\n" +
        "Kills: " + kills
    );

    location.reload();
}


// ============================
// COLLISION
// ============================

function checkCollision(a, b) {

    const rectA =
        a.getBoundingClientRect();

    const rectB =
        b.getBoundingClientRect();


    return (

        rectA.left <
        rectB.right &&

        rectA.right >
        rectB.left &&

        rectA.top <
        rectB.bottom &&

        rectA.bottom >
        rectB.top

    );
}


// ============================
// GAME LOOP
// ============================

function gameLoop() {

    updateBullets();

    updateEnemies();

    requestAnimationFrame(
        gameLoop
    );
}


gameLoop();
                

                

                    

                 

                   

                   
          