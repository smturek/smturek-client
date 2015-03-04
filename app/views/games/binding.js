import Ember from 'ember';

export default Ember.View.extend({

  didInsertElement: function () {
    var that = this;
    var MyState = function(viewContext){
      this.game = null;
      this.walls = null;
      this.exit = null;
      this.noExit = false;
      this.PowerUp = null;

      this.viewContext = viewContext;
      this.keys = game.input.keyboard.createCursorKeys();

      this.level = 0;
      this.levelString = "";
      this.levelText = null;
      this.announcement = null;
      this.gameOver = null;
      this.startOver = null;
      this.kills = null;

      this.player = null;
      this.playerMaxLife = 3;
      this.playerFiringRate = 300;
      this.lives = null;
      this.life = null;

      this.tutorials = null;
      this.tutorial = null;
      this.textRight = null;
      this.textLeft = null;
      this.exitText = null;

      this.drops = null;
      this.drop = null;
      this.doubleSpeed = false;
      this.doubleShot = false;

      this.monsters = null;
      this.monster = null;
      this.monsterFireRate = 1200;
      this.killCount = 0;
      this.variant = false;

      this.bullets = null;
      this.bulletTimer = 0;

      this.enemyBullets = null;
      this.enemyTimer = 0;

      this.moveUp = null;
      this.moveDown = null;
      this.moveRight = null;
      this.moveLeft = null;
      // initialize all other variables here (lots)
    };

    MyState.prototype.hitsWall = function(bullet) {
      bullet.kill();
    };

    MyState.prototype.preload = function(game) {
      this.game = game;
      game.load.image('wide', 'assets/binding/wide.png');
      game.load.image('tall', 'assets/binding/tall.png');
      game.load.image('exit', 'assets/binding/exit.png');
      game.load.spritesheet('player', 'assets/binding/player.png', 20, 20, 2);
      game.load.image('monster', 'assets/binding/monster.png');
      game.load.image('blastMonster', 'assets/binding/blastmonster.png');
      game.load.image('monster2', 'assets/binding/monster2.png');
      game.load.image('monster3', 'assets/binding/monster3.png');
      game.load.image('boss', 'assets/binding/boss.png');
      game.load.image('bullet', 'assets/binding/bullet.png');
      game.load.image('enemyBullet', 'assets/binding/ebullet.png');
      game.load.spritesheet('life', 'assets/binding/life.png', 16, 16, 2);
      game.load.image('powerUp', 'assets/binding/powerup.png');
      game.load.image('lifeUp', 'assets/binding/lifeup.png');
    };

    MyState.prototype.create = function(game) {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      this.moveUp = game.input.keyboard.addKey(87);
      this.moveDown = game.input.keyboard.addKey(83);
      this.moveLeft = game.input.keyboard.addKey(65);
      this.moveRight = game.input.keyboard.addKey(68);

      //walls
      this.walls = game.add.group();
      this.walls.enableBody = true;

      var wall = this.walls.create(0, 0, 'wide');
      wall.body.immovable = true;

      wall = this.walls.create(0, 520, 'wide');
      wall.body.immovable = true;

      wall = this.walls.create(0, 0, 'tall');
      wall.body.immovable = true;

      wall = this.walls.create(920, 0, 'tall');
      wall.body.immovable = true;

      //player's bullet group
      this.bullets = game.add.group();
      this.bullets.enableBody = true;
      this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
      this.bullets.createMultiple(30, 'bullet');
      this.bullets.setAll('outOfBoundsKill', true);
      this.bullets.setAll('checkWorldBounds', true);

      //enemy's bullet group
      this.enemyBullets = game.add.group();
      this.enemyBullets.enableBody = true;
      this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
      this.enemyBullets.createMultiple(200, 'enemyBullet');
      this.enemyBullets.setAll('outOfBoundsKill', true);
      this.enemyBullets.setAll('checkWorldBounds', true);

      this.monsters = game.add.group();
      this.monsters.enableBody = true;

      this.lives = game.add.group();
      var life;
      for(var i = 0; i < this.playerMaxLife; i++) {
        life = this.lives.create(854 + 25 * i, 2, 'life', 0);
      }

      this.drops = game.add.group();
      this.drops.enableBody = true;

      this.tutorials = game.add.group();

      this.tutorial = this.tutorials.create(225, game.world.centerY, 'powerUp');
      this.tutorial.anchor.setTo(0.5, 0.5);

      this.textLeft = game.add.text(225, game.world.centerY + 30, 'Power Up', {font: '20px Arial', fill: '#fff'});
      this.textLeft.anchor.setTo(0.5, 0.5);

      this.tutorial = this.tutorials.create(675, game.world.centerY, 'lifeUp');
      this.tutorial.anchor.setTo(0.5, 0.5);

      this.textRight = game.add.text(675, game.world.centerY + 30, 'Life Up', {font: '20px Arial', fill: '#fff'});
      this.textRight.anchor.setTo(0.5, 0.5);

      this.exitText = game.add.text(880, 460, 'Exit', {font: '20px Arial', fill: '#fff'});
      this.exitText.anchor.setTo(0.5, 0.5);

      this.gameOver = game.add.text(game.world.centerX,game.world.centerY - 30,' ', { font: '84px Arial', fill: '#fff' });
      this.gameOver.anchor.setTo(0.5, 0.5);
      this.gameOver.visible = false;

      this.kills = game.add.text(game.world.centerX, game.world.centerY + 40, ' ', {font: '26px Arial', fill: '#fff'});
      this.kills.anchor.setTo(0.5, 0.5);
      this.kills.visible = false;

      this.startOver = game.add.text(game.world.centerX, game.world.centerY + 110, 'Is that the best you can do?  Click to try again!', {font: '20px Arial', fill: '#fff'});
      this.startOver.anchor.setTo(0.5, 0.5);
      this.startOver.visible = false;

      this.announcement = game.add.text(game.world.centerX, 50, ' ', {font: '26px Arial', fill: '#fff'});
      this.announcement.anchor.setTo(0.5, 0.5);
      this.announcement.alpha = 0;

      this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player', 0);
      game.physics.arcade.enable(this.player);
      this.player.body.collideWorldBounds= true;
      this.player.anchor.setTo(0.5, 0.5);

      this.levelString = 'Level: ';
      this.levelText = game.add.text(20, 1, this.levelString + this.level, { font: '16px arial', fill: '#fff' });

      this.showExit();
    };

    MyState.prototype.update = function(game) {
      game.physics.arcade.collide(this.player, this.walls);
      game.physics.arcade.collide(this.player, this.monsters);
      game.physics.arcade.collide(this.monsters, this.walls);
      game.physics.arcade.overlap(this.bullets, this.walls, this.hitsWall.bind(this));
      game.physics.arcade.overlap(this.enemyBullets, this.walls, this.hitsWall.bind(this));
      game.physics.arcade.overlap(this.monsters, this.bullets, this.monsterHit.bind(this));
      game.physics.arcade.overlap(this.enemyBullets, this.player, this.playerHit.bind(this));
      game.physics.arcade.overlap(this.exit, this.player, this.renderLevel.bind(this));
      game.physics.arcade.overlap(this.drops, this.player, this.pickUp.bind(this));



      this.player.body.velocity.y = 0;
      this.player.body.velocity.x = 0;

      if(this.player.alive) {
        if ( this.moveUp.isDown) {
          this.player.body.velocity.y -= 250;
        }
        else if (this.moveDown.isDown) {
          this.player.body.velocity.y += 250;
        }
        else if (this.moveRight.isDown) {
          this.player.body.velocity.x += 250;
        }
        else if (this.moveLeft.isDown) {
          this.player.body.velocity.x -= 250;
        }

        if (keys.left.isDown)
          {
            this.fireBullet("left");
          }
        else if (keys.right.isDown)
          {
            this.fireBullet("right");
          }
        else if (keys.up.isDown)
          {
            this.fireBullet("up");
          }
        else if (keys.down.isDown)
          {
            this.fireBullet("down");
          }

        if (this.monsters.getFirstAlive() === null && this.noExit)
          {
            this.showExit();
          }
      }

      if (game.time.now > this.enemyTimer) {
        this.enemyFires();
        this.enemyTimer = game.time.now + this.monsterFireRate;
      }

    };

    MyState.prototype.renderLevel = function() {
      this.textLeft.visible = false;
      this.textRight.visible = false;
      this.exitText.visible = false;
      this.variant = false;
      this.level++;
      this.announcement.text = "Level " + this.level;
      this.game.add.tween(this.announcement).to( { alpha: 1 }, 2000, "Linear", true, 0, 0, true);
      //get rid of everything from the previous level
      this.exit.kill();
      this.drops.callAll("kill");
      this.bullets.callAll("kill");
      this.enemyBullets.callAll("kill");
      this.tutorials.callAll('kill');
      this.noExit = true;

      //if player has all powerups don't drop anymore
      if(this.doubleShot && this.doubleSpeed) {
        this.PowerUp = false;
      }
      else {
        this.PowerUp = true;
      }

      if(this.level % 10 === 0) {
        this.monster = this.monsters.create(this.game.world.centerX,  this.game.world.centerY, 'boss');
        this.monster.anchor.setTo(0.5, 0.5);
        this.monster.health = 5 + this.level;
      }
      else if(this.level === 1) {
        this.monster = this.monsters.create(225, this.game.world.centerY, 'monster');
        this.monster.anchor.setTo(0.5, 0.5);
        this.monster.body.immovable = true;
        this.textLeft.text = "Bug";
        this.textLeft.visible = true;

        this.monster = this.monsters.create(675, this.game.world.centerY, 'monster');
        this.monster.anchor.setTo(0.5, 0.5);
        this.monster.body.immovable = true;
        this.textRight.text = "Kill all bugs to reveal exit";
        this.textRight.visible = true;

        this.exitText.text = "It is said other variants exist, but no one has proof.  Take care.";
        this.exitText.x = this.game.world.centerX;
        this.exitText.y = 490;
        this.exitText.visible = true;
      }
      else {
        //monster fire rate
        if(this.level < 21) {
          this.monsterFireRate = this.monsterFireRate - 50;
        }

        var min;
        var max;
        var x;
        var y;

        if(this.level < 5) {
          min = 3;
          max = this.level;
        }
        else if(this.level < 10) {
          min = 4;
          max = 8;
        }
        else {
          min = 6;
          max = 12;
        }

        var randMonsters = this.game.rnd.integerInRange(min, max);

        for(var i = 0; i < randMonsters; i++) {
          x = this.game.rnd.integerInRange(50, 860);
          y = this.game.rnd.integerInRange(50, 460);
          this.randomMonster(x, y);
        }
      }
      this.levelText.text = this.levelString + this.level;
      if(this.level === 1) {
        this.enemyTimer = this.game.time.now + 2000;
      }
      else {
        this.enemyTimer = this.game.time.now + 500;
      }
    };

    MyState.prototype.showExit = function() {
      var x;
      var y;
      if(this.level === 0 || this.level === 1) {
        x = 870;
        y = 470;
      }
      else {
        x = this.game.rnd.integerInRange(40, 870);
        y = this.game.rnd.integerInRange(40, 470);
      }
      this.exit = this.game.add.sprite(x, y, 'exit');
      this.game.physics.arcade.enable(this.exit);
      this.noExit = false;
    };

    MyState.prototype.fireBullet = function(direction) {
      if (this.game.time.now > this.bulletTimer) {
        var bullet = this.bullets.getFirstExists(false);
        bullet.anchor.setTo(0.5, 0.5);
        if (bullet)
        {
            if(this.doubleShot) {
              bullet.reset(this.player.x - 6, this.player.y - 6);
            }
            else {
              bullet.reset(this.player.x, this.player.y);
            }

            if(direction === "up") {
              bullet.body.velocity.y = -400;
            }
            else if(direction === "down") {
              bullet.body.velocity.y = 400;
            }
            else if(direction === "right") {
              bullet.body.velocity.x = 400;
            }
            else if(direction === "left") {
              bullet.body.velocity.x = -400;
            }

            if(this.doubleShot) {
              bullet = this.bullets.getFirstExists(false);
              if (bullet)
              {
                bullet.reset(this.player.x + 6, this.player.y + 6);
                if(direction === "up") {
                  bullet.body.velocity.y = -400;
                }
                else if(direction === "down") {
                  bullet.body.velocity.y = 400;
                }
                else if(direction === "right") {
                  bullet.body.velocity.x = 400;
                }
                else if(direction === "left") {
                  bullet.body.velocity.x = -400;
                }
              }
            }
            this.bulletTimer = this.game.time.now + this.playerFiringRate;
        }
      }
    };

    MyState.prototype.pickUp = function(player, drop) {
      drop.kill();
      if(drop.key === "lifeUp") {
        // makes sure to add the life at the end of the missing lives so that diplay is consistent
        var missingLife = this.lives.getFirstDead();
        if(missingLife) {
          //probably better as a for loop if I start adding more lives
          var missingLifeIndex = this.lives.getChildIndex(missingLife);
          if(this.lives.getChildAt(missingLifeIndex + 1).alive === false) {
            missingLife = this.lives.getChildAt(missingLifeIndex + 1);
          }
          missingLife.reset(missingLife.x, missingLife.y);
          missingLife.frame = 0;
        }
      }
      else if(drop.key === "powerUp") {
        var rand;
        if(!this.doubleSpeed && !this.doubleShot) {
          rand = this.game.rnd.integerInRange(0, 1);
        }
        else if(this.doubleSpeed) {
          rand = 1;
        }
        else if(this.doubleShot) {
          rand = 0;
        }

        if(rand === 0 && !this.doubleSpeed) {
          this.playerFiringRate = this.playerFiringRate - (this.playerFiringRate / 2);
          this.doubleSpeed = true;
          this.announcement.text = "Speed Shot";
          this.game.add.tween(this.announcement).to( { alpha: 1 }, 2000, "Linear", true, 0, 0, true);
        }
        else if(rand === 1 && !this.doubleShot) {
          this.doubleShot = true;
          this.announcement.text = "Double Shot";
          this.game.add.tween(this.announcement).to( { alpha: 1 }, 2000, "Linear", true, 0, 0, true);
        }
      }

    };

    MyState.prototype.monsterHit = function(monster, bullet) {
      bullet.kill();
      monster.damage(1);
      if(monster.key === 'boss' && monster.health % 2 === 0) {
          var x = this.game.rnd.integerInRange(50, 860);
          var y = this.game.rnd.integerInRange(50, 460);
          this.randomMonster(x, y);
      }

      if(monster.health === 0) {
        this.killCount++;
        if(monster.key === 'monster2') {
          //create two monsters
          var offspring = this.monsters.create(monster.x - 20, monster.y - 20, 'monster');
          offspring.body.immovable = true;
          offspring = this.monsters.create(monster.x + 20, monster.y + 20, 'monster');
          offspring.body.immovable = true;
        }
        else{
          var rand = this.game.rnd.integerInRange(0, 10);
          if(rand < 1 && this.PowerUp && this.level > 4) {
            this.drop = this.drops.create(monster.x, monster.y, "powerUp");
            this.drop.body.immovable = true;
            this.PowerUp = false;
          }
          else if(rand < 3 && this.level !== 1) {
            this.drop = this.drops.create(monster.x, monster.y, "lifeUp");
            this.drop.body.immovable = true;
          }
        }
      }
    };

    MyState.prototype.playerHit = function(player, bullet) {
      bullet.kill();

      var life = this.lives.getFirstAlive();

      if(life) {
        life.kill();
        life.visible = true;
        life.frame = 1;
      }

      if (this.lives.countLiving() < 1) {
        player.kill();
        player.visible = true;
        player.frame = 1;
        this.gameOver.text = "YOU'RE DEAD!";
        this.kills.text = "AND YOU ONLY KILLED " + this.killCount + " BUGS...";
        this.kills.visible = true;
        this.gameOver.visible = true;
        this.startOver.visible = true;
        this.textRight.visible = false;
        this.textLeft.visible = false;
        this.keys = null;
        this.viewContext.get('controller').send('endGame', this.killCount);
        game.input.onTap.addOnce(this.restart,this);
      }
    };

    MyState.prototype.restart = function() {
      this.exit.kill();
      this.player.destroy();
      this.drops.callAll("kill");
      this.bullets.callAll("kill");
      this.enemyBullets.callAll("kill");
      this.monsters.destroy(true, true);
      this.tutorials.callAll('kill');
      this.doubleShot = false;
      this.doubleSpeed = false;
      this.kills.visible = false;
      this.gameOver.visible = false;
      this.startOver.visible = false;
      this.textRight.visible = false;
      this.textLeft.visible = false;
      this.exitText.visible = false;
      this.level = 0;
      this.killCount = 0;
      this.monsterFireRate = 1200;
      this.playerFiringRate = 300;
      this.create();
    };

    MyState.prototype.randomMonster = function(x, y) {
      var monsterType;

      if(this.level < 4) {
        monsterType = 0;
      }
      else if(this.level === 4) {
        if(!this.variant) {
          monsterType = 1;
          this.variant = true;
        }
        else {
          monsterType = 0;
        }
      }
      else if(this.level === 5) {
        if(!this.variant) {
          monsterType = 2;
          this.variant = true;
        }
        else {
          monsterType = 0;
        }
      }
      else if(this.level === 6) {
        if(!this.variant) {
          monsterType = 3;
          this.variant = true;
        }
        else {
          monsterType = 0;
        }
      }
      else {
        monsterType = this.game.rnd.integerInRange(0, 3);
      }

      if(monsterType === 0) {
        this.monster = this.monsters.create(x, y, 'monster');
      }
      else if(monsterType === 1) {
        this.monster = this.monsters.create(x, y, 'blastMonster');
      }
      else if(monsterType === 2) {
        this.monster = this.monsters.create(x, y, 'monster2');
      }
      else if(monsterType === 3) {
        this.monster = this.monsters.create(x, y, 'monster3');
        this.monster.health = 3;
      }
      this.monster.body.immovable = true;
      this.monster.anchor.setTo(0.5, 0.5);
    };

    MyState.prototype.enemyFires = function() {
      var livingMonsters = [];

      this.monsters.forEachAlive(function(monster) {
        livingMonsters.push(monster);
      });

      if(livingMonsters.length > 0) {
        for(var i = 0; i < livingMonsters.length; i++) {
          var enemyBullet = this.enemyBullets.getFirstExists(false);
          if(enemyBullet) {
            enemyBullet.anchor.setTo(0.5, 0.5);
            if(livingMonsters[i].key === "monster") {
              enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
              this.game.physics.arcade.moveToObject(enemyBullet,this.player,200);
            }
            else if(livingMonsters[i].key === "blastMonster") {
              enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
              enemyBullet.body.velocity.y = -200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
              enemyBullet.body.velocity.y = 200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
              enemyBullet.body.velocity.x = -200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
              enemyBullet.body.velocity.x = 200;
            }
            else if(livingMonsters[i].key === "monster2") {
              enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
              this.game.physics.arcade.moveToObject(enemyBullet,this.player,200);
            }
            else if(livingMonsters[i].key === "monster3") {
              enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
              this.game.physics.arcade.moveToObject(enemyBullet,this.player,400);
            }
            else if(livingMonsters[i].key === "boss") {
              enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
              enemyBullet.body.velocity.y = -200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
              enemyBullet.body.velocity.y = 200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
              enemyBullet.body.velocity.x = -200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
              enemyBullet.body.velocity.x = 200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
              enemyBullet.body.velocity.y = -200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
              enemyBullet.body.velocity.y = 200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
              enemyBullet.body.velocity.x = -200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
              enemyBullet.body.velocity.x = 200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
              enemyBullet.body.velocity.y = -200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
              enemyBullet.body.velocity.y = 200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
              enemyBullet.body.velocity.x = -200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
              enemyBullet.body.velocity.x = 200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
              enemyBullet.body.velocity.y = -200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
              enemyBullet.body.velocity.y = 200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
              enemyBullet.body.velocity.x = -200;

              enemyBullet = this.enemyBullets.getFirstExists(false);
              enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
              enemyBullet.body.velocity.x = 200;
            }
          }
        }
      }
    };

    MyState.prototype.callbacks = function () {
      return {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this),
      };
    };

    // function that returns an object that contains bound functions to preload / update / create

    // add all other methods as MyState.prototype methods
    // and refer to all globals as this....

    var state = new MyState(that);

    var game = new Phaser.Game(940, 540, Phaser.AUTO, 'binding', state.callbacks());

  } // end of didInsertElement

});
