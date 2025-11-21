# General Relativity Snake

🌊 **GitHub Game Off 2025 - WAVES Theme** 🌊

Experience Snake like never before! Watch as your snake creates **gravitational waves** that ripple through spacetime, warping the fabric of reality itself. This unique interpretation of the classic game visualizes how massive objects create waves in the gravitational field, bending and distorting everything around them.

## Features

- **🌊 Gravitational Waves**: As you move, your snake's mass creates wave-like distortions in spacetime, warping the grid in real-time
- **🌌 Spacetime Curvature**: The game grid ripples and bends around the snake's head like waves propagating through a gravitational field
- **🔴 Redshift Effect**: Grid lines shift color based on gravitational intensity - visualizing the Doppler effect of gravity waves
- **🌈 Gradient Snake**: The snake body transitions from white (head) to green (tail), representing mass distribution
- **📱 Responsive Design**: Includes mobile controls with an on-screen D-pad
- **🏆 High Score Tracking**: Automatically saves your best score to local storage

### Connection to WAVES Theme

This game explores **gravitational waves** - ripples in the curvature of spacetime that propagate as waves. Just as Einstein predicted, massive objects don't just sit in space; they create dynamic, wave-like distortions that spread outward. Every movement of your snake generates these cosmic waves, creating a mesmerizing visual representation of one of physics' most fascinating phenomena!

## Gameplay

Navigate through the warping waves of spacetime:

- Use **Arrow Keys** or **WASD** to control the snake
- Eat the red food to grow longer and increase your score
- Avoid hitting the walls or yourself
- Watch as gravitational waves ripple outward from your snake, distorting the grid in real-time
- The larger you grow, the more massive your gravitational influence becomes!

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production (outputs to docs/)
npm run build

# Watch mode for development
npm run watch
```

### Project Structure

```
general-relativity-snake/
├── src/
│   ├── config/
│   │   ├── constants.ts      # Game constants
│   │   └── gameConfig.ts     # Phaser configuration
│   ├── scenes/
│   │   └── MainScene.ts      # Main game scene
│   ├── utils/
│   │   ├── helpers.ts        # Helper functions (warping, colors)
│   │   └── ui.ts            # UI management
│   ├── styles/
│   │   └── main.css         # Game styles
│   ├── assets/              # Game assets (if any)
│   ├── index.html           # HTML template
│   └── index.ts            # Entry point
├── docs/                    # Build output (for GitHub Pages)
├── webpack.config.js
├── tsconfig.json
└── package.json
```

## Deployment

The project is configured to build to the `docs/` folder, making it easy to deploy with GitHub Pages:

1. Build the project:
   ```bash
   npm run build
   ```

2. Commit the `docs/` folder to your repository

3. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /docs

## Physics Behind the Gravitational Waves

The game simulates how massive objects create wave-like distortions in spacetime:

1. **Wave Propagation**: Each grid point calculates its distance from the snake's "gravitational source"
2. **Wave Amplitude**: A cubic falloff function determines the intensity of the gravitational wave at each point
3. **Spacetime Ripples**: Grid points are displaced toward the gravitational well, creating visible waves in the fabric of space
4. **Wave Interference**: As you move, the gravitational waves propagate outward, creating dynamic, flowing distortions
5. **Gravitational Redshift**: Colors shift from cyan to red-orange based on wave intensity - simulating how light frequencies change in strong gravitational fields

### The Science of Gravitational Waves

In Einstein's General Relativity, massive objects don't just attract - they create **waves** in spacetime itself! These gravitational waves:

- Propagate at the speed of light
- Compress and stretch space as they pass
- Were first directly detected in 2015 by LIGO
- Carry energy away from massive cosmic events

This game brings these invisible cosmic waves to life, letting you see and interact with the ripples in spacetime as you play!

## License

MIT

## Credits

Built with:
- [Phaser 3](https://phaser.io/) - Game framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Webpack](https://webpack.js.org/) - Module bundler
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
