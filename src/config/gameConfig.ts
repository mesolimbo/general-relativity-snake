import Phaser from 'phaser';
import { MainScene } from '../scenes/MainScene';
import { CANVAS_SIZE } from './constants';

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
  parent: 'phaser-game',
  backgroundColor: '#161b22',
  scene: MainScene,
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
};
