// 파일 경로에 ./가 없으면 오류가 나는 거 같음
//import {Player} from 'player.js'

import {Player} from './player.js';
import {InputHandler} from './input.js';
import {Background} from './background.js';

window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 50;
            this.speed = 0;
            this.maxSpeed = 3;

            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler();
        }
        update(deltaTime){
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
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
        requestAnimationFrame(animate);
    }
    animate(0);
});