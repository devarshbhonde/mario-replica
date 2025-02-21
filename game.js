var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scene: { preload: preload, create: create, update: update }
};
var game = new Phaser.Game(config);

var player, platforms, enemies, coins, flagpole, cursors, score = 0, scoreText;

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('flagpole', 'assets/flagpole.png');
}

function create() {
    // Background - tile the 96x96 image across 2000x600
    let bg = this.add.tileSprite(0, 0, 2000, 600, 'background').setOrigin(0, 0);
    bg.tileScaleX = 1; // No scaling, keep original size
    bg.tileScaleY = 1; // No scaling, keep original size

    // Platforms
    platforms = this.physics.add.staticGroup();
    for (let i = 0; i < 2000; i += 64) {
        platforms.create(i, 568, 'ground');
    }
    platforms.create(200, 400, 'platform');
    platforms.create(500, 300, 'platform');
    platforms.create(800, 200, 'platform');
    platforms.create(1200, 350, 'platform');

    // Player
    player = this.physics.add.sprite(100, 450, 'player').setBounce(0.1);
    player.setCollideWorldBounds(false);

    // Enemies
    enemies = this.physics.add.group();
    enemies.create(300, 500, 'enemy').setVelocityX(100);
    enemies.create(600, 250, 'enemy').setVelocityX(-100);

    // Coins
    coins = this.physics.add.group();
    coins.create(250, 350, 'coin');
    coins.create(550, 250, 'coin');
    coins.create(850, 150, 'coin');

    // Flagpole
    flagpole = this.physics.add.staticSprite(1900, 500, 'flagpole');

    // Collisions
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemies, platforms, (enemy) => {
        enemy.setVelocityX(-enemy.body.velocity.x);
    });
    this.physics.add.overlap(player, enemies, handleEnemyCollision, null, this);
    this.physics.add.overlap(player, coins, collectCoin, null, this);
    this.physics.add.overlap(player, flagpole, reachGoal, null, this);

    // Camera
    this.cameras.main.setBounds(0, 0, 2000, 600);
    this.cameras.main.startFollow(player);

    // Controls
    cursors = this.input.keyboard.createCursorKeys();

    // Score
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' }).setScrollFactor(0);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }
    if (player.y > 600) {
        this.scene.restart();
        score = 0;
        scoreText.setText('Score: ' + score);
    }
}

function handleEnemyCollision(player, enemy) {
    if (player.body.touching.down && enemy.body.touching.up) {
        enemy.destroy();
        player.setVelocityY(-200);
    } else {
        this.scene.restart();
        score = 0;
        scoreText.setText('Score: ' + score);
    }
}

function collectCoin(player, coin) {
    coin.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
}

function reachGoal(player, flagpole) {
    this.add.text(400, 300, 'You Win!', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
    this.physics.pause();
}
