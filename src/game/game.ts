import Phaser from 'phaser';

import SnakeGame from './scenes/SnakeGame';
import GameOver from './scenes/GameOver';
import Preloader from './scenes/Preloader';

function launch(name: string) {
    return new Phaser.Game({
      title: name,
      type: Phaser.AUTO,
      width: 600,
      height: 600,
      parent: "game",
      backgroundColor: "#18216D",
      physics: {
        default: 'arcade',
        arcade: {
          debug: true
        }
      },
      scene: [Preloader, SnakeGame, GameOver]
    })
  }
  
  export default launch
  export { launch }
