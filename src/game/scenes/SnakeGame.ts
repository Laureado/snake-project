import Phaser, { GameObjects, Input, Math, Physics } from "phaser";

import { RankApi } from '../../helpers/RankApi';

enum Direction {
    N, NE, E, SE, S, SW, W, NW
}

export default class HelloWorld extends Phaser.Scene{

    private player?: Phaser.Physics.Arcade.Sprite
    private greenApple?: Phaser.Physics.Arcade.Sprite
    private redApple?: Phaser.Physics.Arcade.Sprite
    private obstacle?: Phaser.Physics.Arcade.Sprite
    private snakeBody?: Phaser.Physics.Arcade.Group
    private lastPosition: any

    private score = 0
    private scoreText?: Phaser.GameObjects.Text

    private moveDistance: number
    private moveTime: number
    private timeTic: number
    private ticCount: number
    private currentDirection: Direction


    constructor(){
        super("snake-game");

        this.score = 0;

        this.lastPosition = new Phaser.Geom.Point(300, 300);
        this.moveDistance = 40;
        this.moveTime = 0;
        this.timeTic = 500;
        this.ticCount = 0;
        this.currentDirection = Direction.N;
    }

    preload(){
        console.log("game loaded");
    }

    create(){

        this.moveDistance = 40;
        this.score = 0;
        this.add.image(0, 0, 'floor').setOrigin(0, 0);
        
        this.player = this.physics.add.sprite(300, 300, 'snake');
        this.greenApple = this.physics.add.sprite(460, 300, 'greenApple');
        this.redApple = this.physics.add.sprite(300, 60, 'redApple');
        this.obstacle = this.physics.add.sprite(-100, -100, 'obstacle');
        this.snakeBody = this.physics.add.group();

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px'
        });

        this.physics.add.collider(this.player, this.greenApple, this.handleCollectGreenApple, undefined, this);
        this.physics.add.collider(this.player, this.redApple, this.handleCollectRedApple, undefined, this);
        this.physics.add.collider(this.player, this.obstacle, this.handleTouchObstacle, undefined, this);

    }

    update(time: number){

        // Calculate snake next step direction
        this.changeDirection(); 

        // Make snake movement
        if( time >= this.moveTime && this.moveDistance != 0){

            this.ticCount += 1;
            this.moveTime = time + this.timeTic;
            this.snakeMove();

        } 

        // Change red apple position
        if(this.ticCount > 19){
            this.ticCount = 0;
            const vector = this.getFreeGrid();
            this.redApple?.setPosition( vector.x!*40 - 20, vector.y!*40 - 20 );
        }

    }

    grow() {
        const newPart = this.snakeBody?.create(this.player!.x - 20, this.player!.y - 20, 'snake');
        newPart.setOrigin(0);
    }

    handleCollectGreenApple(){

        // Change Green Apple Position
        let vector = this.getFreeGrid();
        this.greenApple?.setPosition( vector.x!*40 - 20, vector.y!*40 - 20 );

        // Change score
        this.score += 1;
        this.scoreText?.setText(`Score: ${this.score}`);
        this.grow()

        // Add or change obstacle
        if(this.score%10 == 0){
            vector = this.getFreeGrid();
            this.obstacle?.setPosition( vector.x!*40 - 20, vector.y!*40 - 20 );
        }

    }

    handleCollectRedApple(){

        if( this.snakeBody!.getLength() > 1 ){
            // Remove two body parts
            this.snakeBody?.remove(this.snakeBody!.getLast(true), true, true)
            this.snakeBody?.remove(this.snakeBody!.getLast(true), true, true)

            // Change Red Apple Position
            const vector = this.getFreeGrid();
            this.redApple?.setPosition( vector.x!*40 - 20, vector.y!*40 - 20 );

        } else {
            this.gameOver();
        }

    }

    handleTouchObstacle(){

        this.gameOver();

    }

    getFreeGrid(): Phaser.Types.Math.Vector2Like {

        const freeGrids: boolean[][] = [];
        let isPositionOld = true;
        let rndX = 0
        let rndY = 0

        for (let x = 0; x < 15; x++) {
            freeGrids[x] = [];

            for (let y = 0; y < 15; y++) {
                freeGrids[x][y] = true;
            }

        }

        freeGrids[ (this.player!.x + 20)/40 - 1 ][ (this.player!.y + 20)/40 - 1 ] = false;
        freeGrids[ (this.greenApple!.x + 20)/40 - 1 ][ (this.greenApple!.y + 20)/40 - 1 ] = false;
        freeGrids[ (this.redApple!.x + 20)/40 - 1 ][ (this.redApple!.y + 20)/40 - 1 ] = false;
        if(this.score > 10){
            freeGrids[ (this.obstacle!.x + 20)/40 - 1 ][ (this.obstacle!.y + 20)/40 - 1 ] = false;
        }

        this.snakeBody?.children.iterate(c => {
            const child = c as Phaser.Physics.Arcade.Sprite
            freeGrids[ (child.x + 40)/40 - 1 ][ (child.y + 40)/40 - 1 ] = false;
        })

        while(isPositionOld){

            rndX = Phaser.Math.RND.between(1, 15);
            rndY = Phaser.Math.RND.between(1, 15);

            if( freeGrids[rndX-1][rndY-1] ){
                isPositionOld = false;
            }

        }

        return { x: rndX, y: rndY }

    }

    changeDirection(){
        const angle = ((Phaser.Math.Angle.CounterClockwise (  Phaser.Math.Angle.Between(this.player!.x, this.player!.y, this.game.input.mousePointer.x, this.game.input.mousePointer.y) ) ) * 180) / (Math.PI2/2);
        
        const degreePerDirection = 360/8;

        const offsetAngle = angle + degreePerDirection / 2;

        return (offsetAngle >= 0 * degreePerDirection && offsetAngle < 1 * degreePerDirection) ? this.currentDirection = Direction.N
        : (offsetAngle >= 1 * degreePerDirection && offsetAngle < 2 * degreePerDirection) ? this.currentDirection = Direction.NW
          : (offsetAngle >= 2 * degreePerDirection && offsetAngle < 3 * degreePerDirection) ? this.currentDirection = Direction.W
            : (offsetAngle >= 3 * degreePerDirection && offsetAngle < 4 * degreePerDirection) ? this.currentDirection = Direction.SW
              : (offsetAngle >= 4 * degreePerDirection && offsetAngle < 5 * degreePerDirection) ? this.currentDirection = Direction.S
                : (offsetAngle >= 5 * degreePerDirection && offsetAngle < 6 * degreePerDirection) ? this.currentDirection = Direction.SE
                  : (offsetAngle >= 6 * degreePerDirection && offsetAngle < 7 * degreePerDirection) ? this.currentDirection = Direction.E
                    : (offsetAngle > 360 && offsetAngle <= 382.5 ) ? this.currentDirection = Direction.N
                      : this.currentDirection = Direction.NE;

    }

    snakeMove(){

        if(!this.player){
            return;
        }

        let newXPosition = this.player.x; 
        let newYPosition = this.player.y; 

        // Create new position for the snake head depending on the currentDirection
        switch (this.currentDirection) {

            case Direction.N:
                newYPosition -= this.moveDistance
                break;
            
            case Direction.NW:
                newXPosition -= this.moveDistance; 
                newYPosition -= this.moveDistance; 
                break;

            case Direction.W:
                newXPosition -= this.moveDistance; 
                break;

            case Direction.SW:
                newXPosition -= this.moveDistance; 
                newYPosition += this.moveDistance; 
                break;

            case Direction.S:
                newYPosition += this.moveDistance; 
                break;

            case Direction.SE:
                newXPosition += this.moveDistance; 
                newYPosition += this.moveDistance; 
                break;

            case Direction.E:
                newXPosition += this.moveDistance;
                break;

            case Direction.NE:
                newXPosition += this.moveDistance; 
                newYPosition -= this.moveDistance; 
                break;
            
        }

        // If the snake would pass the game wall, transport it
        if( newXPosition >= 600 ) {
            newXPosition = this.moveDistance/2;
        } else if( newXPosition<= 0 ){
            newXPosition = 600 - this.moveDistance/2
        }

        if( newYPosition >= 600 ) {
            newYPosition = this.moveDistance/2;
        } else if( newYPosition<= 0 ){
            newYPosition = 600 - this.moveDistance/2
        }

        // Set new snake head position
        this.lastPosition = new Phaser.Geom.Point(this.player?.x , this.player?.y);
        this.player?.setPosition( newXPosition, newYPosition );

        if (this.snakeBody?.getLength() != 0 ){
            Phaser.Actions.ShiftPosition(this.snakeBody!.getChildren(), this.lastPosition.x - 20, this.lastPosition.y - 20, 1, this.lastPosition )
        }

        // Detect if the snake collides with it's own body
        const hitBody = Phaser.Actions.GetFirst( this.snakeBody!.getChildren(), { x: newXPosition - 20 , y: newYPosition - 20 }, 1 )

        if( hitBody ){
            this.gameOver();
        }
        
    }

    gameOver(){
        if(this.moveDistance > 0){

            this.moveDistance = 0;

            RankApi.createTopRank(this.game.config.gameTitle, this.score);

            this.scene.run('game-over');  

        }      
    }

}