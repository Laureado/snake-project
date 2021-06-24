import Phaser from "phaser";

import floor from '../assets/floor.png';
import snake from '../assets/snake.png';
import greenApple from '../assets/green-apple.png';
import redApple from '../assets/red-apple.png';
import obstacle from '../assets/obstacle.png';

export default class Preloader extends Phaser.Scene
{

    constructor(){
        super('preloader')
    }

    preload(){
        this.load.image('floor', floor);
        this.textures.addBase64('snake', snake);
        this.textures.addBase64('greenApple', greenApple);
        this.textures.addBase64('redApple', redApple);
        this.textures.addBase64('obstacle', obstacle);
    }

    create(){
        this.scene.start('snake-game');
    }

}