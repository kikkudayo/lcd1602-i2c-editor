import { useState } from 'react';

export default function ArduinoCodePreview({ cells, customChars }) {
  const [copied, setCopied] = useState(false);

  const escapeForArduinoString = (value) => value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');

  const getDisplayCommands = (indent = '') => {
    const symbolToSlot = new Map(customChars.map((char) => [char.symbol, char.slot]));
    const commands = [];

    cells.forEach((rowCells, rowIndex) => {
      let textStart = null;
      let textBuffer = '';

      const flushText = () => {
        if (textStart === null) {
          return;
        }

        commands.push(`${indent}lcd.setCursor(${textStart}, ${rowIndex});`);
        commands.push(`${indent}lcd.print("${escapeForArduinoString(textBuffer)}");`);
        textStart = null;
        textBuffer = '';
      };

      rowCells.forEach((cellValue, colIndex) => {
        if (!cellValue) {
          flushText();
          return;
        }

        const slot = symbolToSlot.get(cellValue);
        if (slot !== undefined) {
          flushText();
          commands.push(`${indent}lcd.setCursor(${colIndex}, ${rowIndex});`);
          commands.push(`${indent}lcd.write(byte(${slot}));`);
          return;
        }

        if (textStart === null) {
          textStart = colIndex;
        }
        textBuffer += cellValue;
      });

      flushText();
    });

    return commands;
  };

  const generateArduinoCode = () => {
    let code = '';
    

    // Generate custom character definitions
    if (customChars.length > 0) {
      code += '// Custom character definitions\n';
      customChars.forEach(char => {
        code += `byte ${char.name.replace(/\s+/g, '_')}[] = {\n`;
        

        // Convert 5x8 pixel array to 8 bytes
        for (let row = 0; row < 8; row++) {
          let byte = 0;
          for (let col = 0; col < 5; col++) {
            if (char.pixels[col][row]) {
              byte |= (1 << (4 - col));
            }
          }
          code += `  B${byte.toString(2).padStart(5, '0')},\n`;
        }
        code += '};\n\n';
      });
    }

const displayCommands = getDisplayCommands();
if (displayCommands.length > 0) {
  code += '// LCD display content\n';
  code += `${displayCommands.join('\n')}\n`;
} else {
  code += '// No characters placed on the LCD grid\n';
}

return code;
};

const generateFullSketch = () => {
let sketch = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27, 16, 2);

`;

// Add custom character definitions
if (customChars.length > 0) {
  sketch += '// Custom character definitions\n';
  customChars.forEach(char => {
    sketch += `byte ${char.name.replace(/\s+/g, '_')}[] = {\n`;
        for (let row = 0; row < 8; row++) {
          let byte = 0;
          for (let col = 0; col < 5; col++) {
            if (char.pixels[col][row]) {
              byte |= (1 << (4 - col));
            }
          }
          sketch += `  B${byte.toString(2).padStart(5, '0')},\n`;
        }
        sketch += '};\n\n';
      });
    }

    sketch += `void setup() {
  // Initialize the LCD
  lcd.init();
  lcd.backlight();
  
`;

    // Create custom characters
    if (customChars.length > 0) {
      sketch += '  // Create custom characters\n';
      customChars.forEach(char => {
        sketch += `  lcd.createChar(${char.slot}, ${char.name.replace(/\s+/g, '_')});\n`;
      });
      sketch += '\n';
    }
const displayCommands = getDisplayCommands('  ');
if (displayCommands.length > 0) {
  sketch += '  // Display text\n';
  sketch += `${displayCommands.join('\n')}\n`;
} else {
  sketch += '  // No characters placed on the LCD grid\n';
}

sketch += `}

void loop() {
// Your code here
}
`;

return sketch;
};

const handleCopy = () => {
navigator.clipboard.writeText(generateArduinoCode());
setCopied(true);
setTimeout(() => setCopied(false), 2000);
};

const handleExport = () => {
const sketch = generateFullSketch();
const blob = new Blob([sketch], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'lcd_sketch.ino';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Arduino Code</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Export .ino
          </button>
        </div>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
        <pre>{generateArduinoCode()}</pre>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-gray-700">
          <strong>Tip:</strong> Click "Export .ino" to download a complete Arduino sketch with all setup code and library includes.
        </p>
      </div>
    </div>
  );
}