import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    // Create a simple loading display
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);

    // Loading text
    const loadingText = this.add.text(width / 2, height / 2, 'LOADING...', {
      fontSize: '24px',
      color: '#00ff80',
      fontFamily: 'Inter, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Pulsing effect
    this.tweens.add({
      targets: loadingText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Simulate minimum load time for smooth transition
    this.time.delayedCall(500, () => {
      this.scene.start('MainScene');
    });
  }
}
