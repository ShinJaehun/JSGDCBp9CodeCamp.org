// 파일 경로에 ./가 없으면 오류가 나는 거 같음
//import {Player} from 'player.js'

import {Player} from './player.js';
import {InputHandler} from './input.js';
import {Background} from './background.js';
import {FlyingEnemy, ClimbingEnemy, GroundEnemy} from './enemies.js';
import {UI} from './UI.js'

window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;

            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);

            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];

            this.maxParticles = 50;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;

            this.debug = false;
            this.score = 0;
            this.winningScore = 40;
            this.gameOver = false;
            this.lives = 5;

            this.fontColor = 'black';

            this.time = 0;
            this.maxTime = 30000;

            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }
        update(deltaTime){
            this.time += deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;

            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                //if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });

            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            // handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
                //if (particle.markedForDeletion) this.particles.splice(index, 1);
            });
            // 이걸로 particle이 어느정도 커졌을 때 줄이는 건데...
            // 어떤 효과가 있는 건지는 정확히 모르겠음.
            if (this.particles.length > this.maxParticles) {
                //this.particles = this.particles.slice(0, this.maxParticles);
                this.particles.length = this.maxParticles;
            }

            this.particles = this.particles.filter(particle => !particle.markedForDeletion);

            // console.log(this.particles);
            // 그래도 50개만 유지되는 것은 확실함.

            // handle messages
            this.floatingMessages.forEach(message => {
                message.update();
            });

            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);

            //handle collison sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                //if (collision.markedForDeletion) this.collisions.splice(index, 1);
            })

            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);

        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);

            // handle enemies
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })

            // handle particles
            this.particles.forEach((particle, index) => {
                particle.draw(context);
            });

            // handle messages
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });

            //handle collison sprites
            this.collisions.forEach((collision, index) => {
                collision.draw(context);
            });
            
            this.UI.draw(context);
        }
        addEnemy(){
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
            //console.log(this.enemies);
        }
    }

    const game = new Game(canvas.width, canvas.height);
    //console.log(game);

    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        //console.log(deltaTime)
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});