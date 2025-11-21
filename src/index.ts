import Phaser from 'phaser';
import { config } from './config/gameConfig';
import { UIManager } from './utils/ui';
import './styles/main.css';

// Initialize the UI Manager
const uiManager = new UIManager();

// Initialize the Phaser Game
const game = new Phaser.Game(config);
