/* ============================
   GAME SETUP
============================ */

const game = document.getElementById("game");
const player = document.getElementById("player");
const playerHealth = document.getElementById("playerHealth");
const killsDisplay = document.getElementById("kills");

const enemyBullets = [];
const bullets = [];
const enemies = [];

let kills = 0;
let health = 100;


/* ============================
   PLAYER DAMAGE
============================ */

function damagePlayer(amount) {

    health -= amount;

    if (health < 0) {
        health = 0;
    }

    playerHealth.style.width = health + "%";

    if (health <= 0) {
        gameOver();
    }
}


/* ============================
   GAME OVER
============================ */

function gameOver() {

    alert("GAME OVER");

    location.reload();
}


/* ============================
   COLLISION
============================ */

function checkCollision(a, b) {

    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();

    return (
        rectA.left < rectB.right &&
        rectA.right > rectB.left &&
        rectA.top < rectB.bottom &&
        rectA.bottom > rectB.top
    );
}


/* ============================
   ENEMY SHOOTING
============================ */

function enemyShoot(enemy) {

    const projectile = document.createElement("div");

    projectile.className = "enemyBullet";

    projectile.textContent = "💣";

    const enemyLeft =
        parseFloat(enemy.style.left) || 0;

    const enemyTop =
        parseFloat(enemy.style.top) || 0;

    projectile.style.left =
        enemyLeft + 20 + "px";

    projectile.style.top =
        enemyTop + 50 + "px";

    game.appendChild(projectile);

    enemyBullets.push(projectile);
}


/* ============================
   UPDATE ENEMY BULLETS
============================ */

function updateEnemyBullets() {

    for (
        let i = enemyBullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet = enemyBullets[i];

        let top =
            parseFloat(bullet.style.top) || 0;

        // FAST enemy bullets
        top += 8;

        bullet.style.top =
            top + "px";


        /* Hit player */

        if (
            checkCollision(
                bullet,
                player
            )
        ) {

            bullet.remove();

            enemyBullets.splice(i, 1);

            damagePlayer(15);

            continue;
        }


        /* Bullet leaves screen */

        if (
            top >
            game.clientHeight
        ) {

            bullet.remove();

            enemyBullets.splice(i, 1);
        }
    }
}


/* ============================
   UPDATE ENEMIES
============================ */

function updateEnemies() {

    const now = Date.now();

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        const enemy = enemies[i];


        /* ========================
           ENEMY SHOOTING
        ======================== */

        if (
            now - enemy.lastAttack >=
            enemy.attackDelay
        ) {

            enemy.lastAttack = now;

            enemyShoot(enemy);
        }


        /* ========================
           ENEMY MOVEMENT
        ======================== */

        let top =
            parseFloat(enemy.style.top) || 0;

        top += enemy.speed || 1;

        enemy.style.top =
            top + "px";


        /* Remove enemy if
           it reaches bottom */

        if (
            top >
            game.clientHeight
        ) {

            enemy.remove();

            enemies.splice(i, 1);
        }
    }
}


/* ============================
   CREATE ENEMY
============================ */

function createEnemy() {

    const enemy =
        document.createElement("div");

    enemy.className = "enemy";


    /* Enemy body */

    const body =
        document.createElement("div");

    body.className = "enemyBody";

    body.textContent = "👾";


    /* Health bar */

    const hp =
        document.createElement("div");

    hp.className = "enemyHp";


    const hpBar =
        document.createElement("div");

    hpBar.className = "enemyHpBar";

    hp.appendChild(hpBar);


    enemy.appendChild(body);
    enemy.appendChild(hp);

    /* Random position */

    const maxLeft =
        game.clientWidth - 65;

    const left =
        Math.random() * maxLeft;

    enemy.style.left =
        left + "px";

    enemy.style.top =
        "-70px";


    /* Enemy settings */

    enemy.speed =
        0.8 + Math.random() * 1.2;

    enemy.lastAttack =
        Date.now();

    // Fast enemy shooting
    enemy.attackDelay =
        700 + Math.random() * 500;


    game.appendChild(enemy);

    enemies.push(enemy);
}


/* ============================
   SPAWN ENEMIES
============================ */

setInterval(() => {

    createEnemy();

}, 1200);


/* ============================
   PLAYER SHOOTING
============================ */

function playerShoot() {

    const bullet =
        document.createElement("div");

    bullet.className = "bullet";

    bullet.textContent = "🔥";


    const playerLeft =
        player.offsetLeft;

    const playerTop =
        player.offsetTop;


    bullet.style.left =
        playerLeft + "px";

    bullet.style.top =
        playerTop - 25 + "px";


    game.appendChild(bullet);

    bullets.push(bullet);
}


/* ============================
   UPDATE PLAYER BULLETS
============================ */

function updateBullets() {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet =
            bullets[i];

        let top =
            parseFloat(bullet.style.top) || 0;

        // FAST player bullets
        top -= 12;

        bullet.style.top =
            top + "px";


        let hitEnemy = false;


        /* Check enemy collisions */

        for (
            let j = enemies.length - 1;
            j >= 0;
            j--
        ) {

            const enemy =
                enemies[j];


            if (
                checkCollision(
                    bullet,
                    enemy
                )
            ) {

                bullet.remove();

                bullets.splice(i, 1);

                enemy.remove();

                enemies.splice(j, 1);

                kills++;

                if (killsDisplay) {
                    killsDisplay.textContent =
                        "Kills: " + kills;
                }

                hitEnemy = true;

                break;
            }
        }


        if (hitEnemy) {
            continue;
        }


        /* Remove bullet
           when it leaves screen */

        if (top < -30) {

            bullet.remove();

            bullets.splice(i, 1);
        }
    }
}


/* ============================
   FIRE BUTTON
============================ */

const fireButton =
    document.getElementById(
        "fireButton"
    );


if (fireButton) {

    fireButton.addEventListener(
        "click",
        playerShoot
    );
}


/* ============================
   PLAYER MOVEMENT
============================ */

let playerX = 50;

function movePlayer(direction) {

    playerX += direction * 5;

    if (playerX < 5) {
        playerX = 5;
    }

    if (playerX > 95) {
        playerX = 95;
    }

    player.style.left =
        playerX + "%";
}


/* ============================
   KEYBOARD CONTROLS
============================ */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            movePlayer(-1);
        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            movePlayer(1);
        }


        if (
            event.code === "Space"
        ) {

            playerShoot();
        }
    }
);


/* ============================
   GAME LOOP
============================ */

function gameLoop() {

    updateEnemies();

    updateEnemyBullets();

    updateBullets();

    requestAnimationFrame(
        gameLoop
    );
}


/* ============================
   START GAME
============================ */

gameLoop();         

                    

                 

                   

                   
          