import { useState } from 'react'
import LCDGrid from './components/LCDGrid'
import CellEditor from './components/CellEditor'
import ArduinoCodePreview from './components/ArduinoCodePreview'

function App() {
  // Initialize 2x16 grid with empty cells
  const [cells, setCells] = useState([
    Array(16).fill(''),
    Array(16).fill('')
  ]);
  
  const [selectedCell, setSelectedCell] = useState(null);
  const [customChars, setCustomChars] = useState([]);

  const handleCustomCharAdd = (charData) => {
    if (customChars.length >= 8) {
      alert('Maximum 8 custom characters allowed!');
      return;
    }
    setCustomChars([...customChars, charData]);
  };

  const handleCustomCharUpdate = (charData) => {
    setCustomChars(customChars.map(char => 
      char.slot === charData.slot ? charData : char
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            LCD 16x2 I2C Editor
          </h1>
          <p className="text-gray-600">
            Design your LCD layout and generate Arduino code
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left section - LCD Grid */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="mb-4">
              <LCDGrid
                cells={cells}
                selectedCell={selectedCell}
                onCellSelect={setSelectedCell}
              />
            </div>
            
            {/* Instructions */}
            <div className="bg-white p-4 rounded-lg shadow-md max-w-2xl">
              <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click on any LCD cell to select and edit it</li>
                <li>• Enter text directly or create custom 5x8 pixel characters</li>
                <li>• Custom characters are limited to 8 slots (0-7)</li>
                <li>• Real-time Arduino code is generated as you edit</li>
                <li>• Export a complete .ino sketch file when ready</li>
              </ul>
            </div>
          </div>

          {/* Right section - Cell Editor */}
          <div>
            <CellEditor
              selectedCell={selectedCell}
              cells={cells}
              onCellChange={setCells}
              customChars={customChars}
              onCustomCharAdd={handleCustomCharAdd}
              onCustomCharUpdate={handleCustomCharUpdate}
            />
          </div>
        </div>

        {/* Bottom section - Arduino Code Preview */}
        <div>
          <ArduinoCodePreview
            cells={cells}
            customChars={customChars}
          />
        </div>
      </div>
    </div>
  )
}

export default App
