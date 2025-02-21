{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c100000\c100000\c100000;\cssrgb\c0\c0\c0;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs26\fsmilli13333 \cf0 \cb2 \expnd0\expndtw0\kerning0
var config = \{\
    type: Phaser.AUTO,\
    width: 800,\
    height: 600,\
    physics: \{\
        default: 'arcade',\
        arcade: \{ gravity: \{ y: 300 \}, debug: false \}\
    \},\
    scene: \{ preload: preload, create: create, update: update \}\
\};\
var game = new Phaser.Game(config);\
\
var player, platforms, enemies, coins, cursors;\
\
function preload() \{\
    this.load.image('background', 'assets/background.png');\
    this.load.image('ground', 'assets/ground.png');\
    this.load.image('platform', 'assets/platform.png');\
    this.load.image('player', 'assets/player.png');\
    this.load.image('enemy', 'assets/enemy.png');\
    this.load.image('coin', 'assets/coin.png');\
    this.load.image('flagpole', 'assets/flagpole.png');\
\}\
\
function create() \{\
    this.add.image(400, 300, 'background');\
    platforms = this.physics.add.staticGroup();\
    for (let i = 0; i < 800; i += 64) \{\
        platforms.create(i, 568, 'ground');\
    \}\
    platforms.create(200, 400, 'platform');\
    platforms.create(500, 300, 'platform');\
\
    player = this.physics.add.sprite(100, 450, 'player');\
    player.setCollideWorldBounds(true);\
\
    enemies = this.physics.add.group();\
    enemies.create(300, 500, 'enemy').setVelocityX(100);\
\
    coins = this.physics.add.group();\
    coins.create(250, 350, 'coin');\
    coins.create(550, 250, 'coin');\
\
    flagpole = this.physics.add.staticSprite(700, 500, 'flagpole');\
\
    this.physics.add.collider(player, platforms);\
    this.physics.add.collider(enemies, platforms, (enemy) => \{\
        enemy.setVelocityX(-enemy.body.velocity.x);\
    \});\
    this.physics.add.overlap(player, enemies, (p, e) => this.scene.restart(), null, this);\
    this.physics.add.overlap(player, coins, (p, c) => c.destroy(), null, this);\
    this.physics.add.overlap(player, flagpole, () => alert('You Win!'), null, this);\
\
    cursors = this.input.keyboard.createCursorKeys();\
\}\
\
function update() \{\
    if (cursors.left.isDown) \{\
        player.setVelocityX(-160);\
    \} else if (cursors.right.isDown) \{\
        player.setVelocityX(160);\
    \} else \{\
        player.setVelocityX(0);\
    \}\
    if (cursors.up.isDown && player.body.touching.down) \{\
        player.setVelocityY(-330);\
    \}\
\}}