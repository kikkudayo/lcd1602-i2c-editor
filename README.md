# LCD 16x2 I2C Editor

A web-based visual editor for designing LCD 16x2 I2C displays and generating Arduino code. Built with React and Tailwind CSS.

## Features

- 🖥️ **Interactive 16x2 LCD Grid** - Click any cell to edit its content
- ✏️ **Cell Editor** - Enter text directly or create custom 5x8 pixel characters
- 🎨 **Custom Character Creator** - Design up to 8 custom characters with a visual pixel editor
- 📝 **Real-time Code Generation** - Arduino code updates as you edit
- 💾 **Export Functionality** - Download complete .ino sketch files ready for Arduino

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Design Your Display**: Click on any cell in the 16x2 grid to select it
2. **Add Content**: Type a character in the cell editor or create a custom character
3. **Create Custom Characters**: 
   - Click "Create New Custom Character"
   - Name your character and choose a symbol
   - Design the 5x8 pixel pattern
   - Assign to slots 0-7 (maximum 8 characters)
4. **Generate Code**: Arduino code is generated in real-time
5. **Export**: Click "Export .ino" to download a complete Arduino sketch

## Arduino Setup

The generated code uses the LiquidCrystal_I2C library. Install it via Arduino Library Manager:

```
Sketch → Include Library → Manage Libraries → Search for "LiquidCrystal I2C"
```

## Project Structure

```
src/
├── components/
│   ├── LCDGrid.jsx           # 16x2 LCD display grid
│   ├── CellEditor.jsx        # Cell content editor panel
│   ├── CustomCharEditor.jsx  # Custom character creator modal
│   └── ArduinoCodePreview.jsx # Code generation and export
├── App.jsx                    # Main application component
└── index.css                  # Tailwind CSS imports
```

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **LiquidCrystal_I2C** - Arduino library for LCD control

## License

MIT
