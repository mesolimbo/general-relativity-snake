import Phaser from 'phaser';
import {
  GRID_SIZE,
  TILE_COUNT,
  MOVE_INTERVAL,
  EXTENDED_GRID_TILES,
} from '../config/constants';
import {
  Position,
  getWarpedPixelCoordinates,
  getRedshiftColor,
  getSnakeBodyColor,
} from '../utils/helpers';

export class MainScene extends Phaser.Scene {
  private gridGraphics!: Phaser.GameObjects.Graphics;
  private snakeGraphics!: Phaser.GameObjects.Graphics;
  private snake: Position[] = [];
  private food: Position = { x: 15, y: 15 };
  private dx: number = 0;
  private dy: number = 0;
  private nextDx: number = 0;
  private nextDy: number = 0;
  private score: number = 0;
  private isGameStarted: boolean = false;
  private lastMoveTime: number = 0;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wKey!: Phaser.Input.Keyboard.Key;
  private aKey!: Phaser.Input.Keyboard.Key;
  private sKey!: Phaser.Input.Keyboard.Key;
  private dKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super('MainScene');
  }

  create(): void {
    // Graphics Objects
    this.gridGraphics = this.add.graphics();
    this.snakeGraphics = this.add.graphics();

    // Game State
    this.snake = [];
    this.food = { x: 15, y: 15 };
    this.dx = 0;
    this.dy = 0;
    this.nextDx = 0;
    this.nextDy = 0;
    this.score = 0;
    this.isGameStarted = false;
    this.lastMoveTime = 0;

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Initial render (static)
    this.snake = [{ x: 10, y: 10 }];
    this.drawGame();

    // Listen for UI events
    (window as any).startGamePhaser = () => this.startGame();
    (window as any).setDirectionPhaser = (direction: string) =>
      this.handleDirectionInput(direction);
  }

  startGame(): void {
    this.snake = [{ x: 10, y: 10 }];
    this.dx = 1;
    this.dy = 0;
    this.nextDx = 1;
    this.nextDy = 0;
    this.score = 0;
    const scoreElement = document.getElementById('score');
    if (scoreElement) scoreElement.textContent = '0';
    this.placeFood();
    this.isGameStarted = true;
  }

  placeFood(): void {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT),
      };
    } while (this.snake.some((s) => s.x === newFood.x && s.y === newFood.y));
    this.food = newFood;
  }

  handleDirectionInput(direction: string): void {
    if (!this.isGameStarted) return;

    let newDx = this.dx;
    let newDy = this.dy;

    switch (direction) {
      case 'UP':
        if (this.dy !== 1) {
          newDx = 0;
          newDy = -1;
        }
        break;
      case 'DOWN':
        if (this.dy !== -1) {
          newDx = 0;
          newDy = 1;
        }
        break;
      case 'LEFT':
        if (this.dx !== 1) {
          newDx = -1;
          newDy = 0;
        }
        break;
      case 'RIGHT':
        if (this.dx !== -1) {
          newDx = 1;
          newDy = 0;
        }
        break;
    }

    // Buffer the input to next move tick to prevent rapid self-collision
    this.nextDx = newDx;
    this.nextDy = newDy;
  }

  update(time: number, delta: number): void {
    // Poll Keyboard every frame for responsiveness
    if (this.isGameStarted) {
      if (this.cursors.up.isDown || this.wKey.isDown) this.handleDirectionInput('UP');
      else if (this.cursors.down.isDown || this.sKey.isDown)
        this.handleDirectionInput('DOWN');
      else if (this.cursors.left.isDown || this.aKey.isDown)
        this.handleDirectionInput('LEFT');
      else if (this.cursors.right.isDown || this.dKey.isDown)
        this.handleDirectionInput('RIGHT');
    }

    if (!this.isGameStarted) {
      return;
    }

    // Game Loop Logic (Tick based)
    if (time - this.lastMoveTime > MOVE_INTERVAL) {
      this.moveSnake();
      this.lastMoveTime = time;
      this.drawGame();
    }
  }

  moveSnake(): void {
    // Apply buffered direction
    this.dx = this.nextDx;
    this.dy = this.nextDy;

    const head: Position = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

    // Collision Checks
    const hitSelf = this.snake.some((s, i) => {
      if (head.x === this.food.x && head.y === this.food.y) return s.x === head.x && s.y === head.y;
      if (i === this.snake.length - 1) return false;
      return s.x === head.x && s.y === head.y;
    });

    if (
      hitSelf ||
      head.x < 0 ||
      head.x >= TILE_COUNT ||
      head.y < 0 ||
      head.y >= TILE_COUNT
    ) {
      this.gameOver();
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      const scoreElement = document.getElementById('score');
      if (scoreElement) scoreElement.textContent = this.score.toString();
      this.placeFood();
    } else {
      this.snake.pop();
    }
  }

  gameOver(): void {
    this.isGameStarted = false;
    (window as any).triggerGameOver(this.score);
  }

  drawGame(): void {
    const g = this.gridGraphics;
    const sg = this.snakeGraphics;

    g.clear();
    sg.clear();

    const head = this.snake[0];

    // 1. Draw Warped Grid
    g.lineStyle(1, 0x00ff80, 1);

    const step = GRID_SIZE / 4;
    const minTile = -EXTENDED_GRID_TILES;
    const maxTile = TILE_COUNT + EXTENDED_GRID_TILES;

    // Helper to draw line segments
    const drawWarpedLine = (x1: number, y1: number, x2: number, y2: number) => {
      const p1 = getWarpedPixelCoordinates(x1, y1, head);
      const p2 = getWarpedPixelCoordinates(x2, y2, head);

      const avgPull = (p1.pullFactor + p2.pullFactor) / 2;
      const style = getRedshiftColor(avgPull);

      g.lineStyle(1, style.color, style.alpha);
      g.beginPath();
      g.moveTo(p1.x, p1.y);
      g.lineTo(p2.x, p2.y);
      g.strokePath();
    };

    // Vertical Lines
    for (let xTile = minTile; xTile <= maxTile; xTile++) {
      const startX = xTile * GRID_SIZE;
      for (let y = minTile * GRID_SIZE; y < maxTile * GRID_SIZE; y += step) {
        drawWarpedLine(startX, y, startX, y + step);
      }
    }

    // Horizontal Lines
    for (let yTile = minTile; yTile <= maxTile; yTile++) {
      const startY = yTile * GRID_SIZE;
      for (let x = minTile * GRID_SIZE; x < maxTile * GRID_SIZE; x += step) {
        drawWarpedLine(x, startY, x + step, startY);
      }
    }

    // 2. Draw Food
    const foodPx = this.food.x * GRID_SIZE + GRID_SIZE / 2;
    const foodPy = this.food.y * GRID_SIZE + GRID_SIZE / 2;
    const wFood = getWarpedPixelCoordinates(foodPx, foodPy, head);

    const minFoodScale = 0.4;
    const foodScale = 1.0 - wFood.pullFactor * (1.0 - minFoodScale);
    const foodRadius = (GRID_SIZE / 2) * 0.8 * foodScale;

    sg.lineStyle(1, 0xff7875, 1);
    sg.fillStyle(0xff4d4f, 1);
    sg.fillCircle(wFood.x, wFood.y, foodRadius);
    sg.strokeCircle(wFood.x, wFood.y, foodRadius);

    // 3. Draw Snake
    this.snake.forEach((segment, index) => {
      const startX = segment.x * GRID_SIZE;
      const startY = segment.y * GRID_SIZE;

      if (index === 0) {
        // HEAD - Small Square
        const centerX = startX + GRID_SIZE / 2;
        const centerY = startY + GRID_SIZE / 2;
        const wCenter = getWarpedPixelCoordinates(centerX, centerY, head);
        const headSize = GRID_SIZE * 0.4;

        // Glow effect
        sg.fillStyle(0xffffff, 0.3);
        sg.fillRect(
          wCenter.x - headSize / 2 - 2,
          wCenter.y - headSize / 2 - 2,
          headSize + 4,
          headSize + 4
        );

        sg.fillStyle(0xffffff, 1);
        sg.fillRect(wCenter.x - headSize / 2, wCenter.y - headSize / 2, headSize, headSize);
      } else {
        // BODY - Warped Polygon
        const tl = getWarpedPixelCoordinates(startX, startY, head);
        const tr = getWarpedPixelCoordinates(startX + GRID_SIZE, startY, head);
        const br = getWarpedPixelCoordinates(startX + GRID_SIZE, startY + GRID_SIZE, head);
        const bl = getWarpedPixelCoordinates(startX, startY + GRID_SIZE, head);

        const color = getSnakeBodyColor(index, this.snake.length);

        sg.fillStyle(color, 1);
        sg.beginPath();
        sg.moveTo(tl.x, tl.y);
        sg.lineTo(tr.x, tr.y);
        sg.lineTo(br.x, br.y);
        sg.lineTo(bl.x, bl.y);
        sg.closePath();
        sg.fillPath();

        sg.lineStyle(1, 0x000000, 0.2);
        sg.strokePath();
      }
    });
  }
}
