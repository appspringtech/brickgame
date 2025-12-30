# Building the Brick Game for Windows

This guide provides step-by-step instructions for building and distributing the Brick Game as a Windows application.

## Prerequisites

Before building, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/

## Installation

1. Clone the repository:
```bash
git clone https://github.com/appspringtech/brickgame.git
cd brickgame
```

2. Install dependencies:
```bash
npm install
```

This will install:
- Electron v35.7.5 (latest secure version)
- Electron Builder for packaging

## Development Mode

To run the game in development mode:

```bash
npm start
```

This will:
- Launch the Electron application
- Open a window with the game
- Enable hot-reloading for development

## Building for Windows

### Option 1: Build Installer (Recommended for Distribution)

Create a Windows installer (.exe):

```bash
npm run build-win
```

This will:
- Package the application
- Create an NSIS installer
- Output to `dist/` folder

The installer will be named something like:
- `Brick Game Setup 1.0.0.exe`

### Option 2: Build Portable Version

To create a portable version without an installer, modify `package.json`:

```json
"win": {
  "target": ["portable"],
  "icon": "assets/icon.ico"
}
```

Then run:
```bash
npm run build-win
```

### Option 3: Build Both

To create both installer and portable versions:

```json
"win": {
  "target": ["nsis", "portable"],
  "icon": "assets/icon.ico"
}
```

## Build Output

After building, you'll find:

```
dist/
├── Brick Game Setup 1.0.0.exe     # Installer
├── Brick Game 1.0.0.exe           # Portable (if configured)
├── win-unpacked/                   # Unpacked application files
└── builder-debug.yml               # Build metadata
```

## Distribution

### For End Users

Distribute the installer file:
- `Brick Game Setup 1.0.0.exe`

Users can:
1. Double-click the installer
2. Follow installation wizard
3. Launch from Start Menu or Desktop shortcut

### System Requirements

- **Operating System**: Windows 7 or later
- **RAM**: 512 MB minimum
- **Disk Space**: 200 MB
- **Display**: 1024x768 minimum resolution

## Testing the Build

Before distribution, test the built application:

1. Install from the .exe file
2. Launch the game
3. Test all features:
   - Click on bricks in the toolbar
   - Drag and drop bricks
   - Verify snap-to-grid works
   - Verify snap-to-brick works
   - Check sound effects (if audio files added)
   - Test on different screen resolutions

## Troubleshooting

### Build Fails

If the build fails:

1. **Clear cache**:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

2. **Update dependencies**:
```bash
npm update
```

3. **Check Node.js version**:
```bash
node --version
# Should be v16 or higher
```

### Audio Not Working

The game includes placeholder audio files. For the best experience:

1. Replace files in `sounds/` directory:
   - `place.mp3` - Soft placement sound
   - `pickup.mp3` - Gentle pickup sound
   - `snap.mp3` - Satisfying snap sound

2. Recommended: Use short (0.3-0.5s), gentle sounds

### Icon Not Found

If you see "icon not found" warnings:

1. Create an `assets/` folder
2. Add `icon.ico` file (256x256 pixels recommended)
3. Or remove the icon line from package.json

## Advanced Configuration

### Customizing the Build

Edit `package.json` build section:

```json
"build": {
  "appId": "com.brickgame.app",
  "productName": "Brick Game",
  "win": {
    "target": ["nsis"],
    "icon": "assets/icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  }
}
```

### Code Signing (Optional)

For production distribution, consider code signing:

1. Obtain a code signing certificate
2. Configure in `package.json`:

```json
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "your-password",
  "signingHashAlgorithms": ["sha256"]
}
```

## Continuous Integration

For automated builds, you can use GitHub Actions:

1. Create `.github/workflows/build.yml`
2. Configure Windows build job
3. Artifacts will be built on each push

## License

This project is licensed under the MIT License.

## Support

For build issues or questions:
- Check the Electron documentation: https://www.electronjs.org/docs
- Check Electron Builder docs: https://www.electron.build/
- Open an issue in the repository
