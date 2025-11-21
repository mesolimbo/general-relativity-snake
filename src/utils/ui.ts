export class UIManager {
  private highScore: number;
  private startButton: HTMLElement | null;
  private restartButton: HTMLElement | null;
  private gameOverModal: HTMLElement | null;

  constructor() {
    this.highScore = parseInt(localStorage.getItem('snakeHighScore') || '0', 10);
    this.startButton = document.getElementById('startButton');
    this.restartButton = document.getElementById('restartButton');
    this.gameOverModal = document.getElementById('gameOverModal');

    this.updateHighScore();
    this.setupEventListeners();
    this.createWarpedTitle();
  }

  private updateHighScore(): void {
    const highScoreElement = document.getElementById('highScore');
    if (highScoreElement) {
      highScoreElement.textContent = this.highScore.toString();
    }
  }

  private setupEventListeners(): void {
    // Start Game
    this.startButton?.addEventListener('click', () => {
      if (this.startButton) {
        this.startButton.style.display = 'none';
      }
      if ((window as any).startGamePhaser) {
        (window as any).startGamePhaser();
      }
    });

    // Restart Game
    this.restartButton?.addEventListener('click', () => {
      this.gameOverModal?.classList.add('hidden');
      if ((window as any).startGamePhaser) {
        (window as any).startGamePhaser();
      }
    });

    // Mobile Controls
    const dpadButtons = document.querySelectorAll('.dpad-container .control-button');
    dpadButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const dir = target.dataset.direction;
        if (dir && (window as any).setDirectionPhaser) {
          (window as any).setDirectionPhaser(dir);
        }
      });
    });

    // Setup global game over handler
    (window as any).triggerGameOver = (score: number) => {
      if (this.startButton) {
        this.startButton.style.display = 'block';
      }
      const finalScoreElement = document.getElementById('finalScore');
      if (finalScoreElement) {
        finalScoreElement.textContent = score.toString();
      }

      // Update High Score
      if (score > this.highScore) {
        this.highScore = score;
        localStorage.setItem('snakeHighScore', this.highScore.toString());
        this.updateHighScore();
      }

      this.gameOverModal?.classList.remove('hidden');
    };
  }

  private createWarpedTitle(): void {
    const text = 'GENERAL RELATIVITY SNAKE';
    const container = document.getElementById('titleContainer');
    if (!container) return;

    container.innerHTML = '';

    const len = text.length;
    const center = (len - 1) / 2;
    const minSize = 0.9;
    const maxSize = 1.8;

    for (let i = 0; i < len; i++) {
      const char = text[i];
      const span = document.createElement('span');

      if (char === ' ') {
        span.style.width = '0.3rem';
        span.style.display = 'inline-block';
      } else {
        span.textContent = char;
        span.className = 'title-char';
        const dist = Math.abs(i - center) / center;
        const size = minSize + (maxSize - minSize) * Math.pow(dist, 1.3);
        span.style.fontSize = `${size}rem`;
      }
      container.appendChild(span);
    }
  }
}
