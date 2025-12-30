# Brick Game

A safe, fun brick construction game designed for 3-year-old children. Build towers and houses with colorful, large blocks using simple drag-and-drop mechanics.

## Features

- 🧱 Large, colorful blocks that are easy for small hands to control
- 🎯 Drag and drop mechanics using mouse only
- 📐 Smart snap-to-grid and snap-to-brick functionality
- ✨ Positive visual feedback with sparkles and animations
- 🔇 Calm, gentle sound effects (can be muted)
- 🚫 No text, no scores, no failure states
- 💻 Offline-friendly Windows application
- 🎨 Multiple brick types: small, medium, large, square, and tall
- 🌈 Seven vibrant colors: red, blue, green, yellow, purple, orange, and pink

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Run the game in development mode:
```bash
npm start
```

### Building for Windows

To create a Windows installer:

```bash
npm run build-win
```

The installer will be created in the `dist/` folder.

## How to Play

1. **Choose a brick**: Click on any colored brick in the toolbar at the top
2. **Place it**: The brick will follow your mouse - move it where you want
3. **Release**: Click again to place the brick
4. **Build**: Keep adding bricks to build towers, houses, or anything you imagine!
5. **Move bricks**: Click and drag any placed brick to move it around

### Smart Snapping

- Bricks automatically snap to a grid for easier placement
- Bricks snap together when placed close to each other
- Build stable towers by stacking bricks on top of each other
- Place bricks side-by-side to create walls

## Game Design Philosophy

This game is designed specifically for 3-year-old children with the following principles:

- **No failure**: There's no wrong way to play
- **Positive feedback**: Every action results in happy sparkles and gentle sounds
- **Motor skills**: Develops hand-eye coordination and fine motor control
- **Spatial awareness**: Helps understand how objects fit together
- **Creativity**: Encourages free-form creative building
- **Safety**: No ads, no internet required, completely offline

## Sound Files

The game includes gentle sound effects for:
- Picking up bricks
- Placing bricks
- Snapping bricks together

Currently, placeholder sound files are included. For the best experience, replace the files in the `sounds/` directory with appropriate calm, gentle sound effects in MP3 format:
- `place.mp3` - Soft placement sound
- `pickup.mp3` - Gentle pickup sound
- `snap.mp3` - Satisfying snap sound

## Technical Details

- Built with Electron for Windows desktop deployment
- Pure HTML5, CSS3, and JavaScript
- No external dependencies in runtime
- Responsive design that adapts to window size

## License

MIT
