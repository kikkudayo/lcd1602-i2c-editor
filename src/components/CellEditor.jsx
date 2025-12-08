import { useState, useEffect } from 'react';
import CustomCharEditor from './CustomCharEditor';

export default function CellEditor({ selectedCell, cells, onCellChange, customChars, onCustomCharAdd, onCustomCharUpdate }) {
  const [cellValue, setCellValue] = useState('');
  const [showCustomCharEditor, setShowCustomCharEditor] = useState(false);
  const [editingChar, setEditingChar] = useState(null);

  useEffect(() => {
    if (selectedCell) {
      setCellValue(cells[selectedCell.row][selectedCell.col] || '');
    }
  }, [selectedCell, cells]);

  const handleValueChange = (e) => {
    const value = e.target.value.slice(0, 1); // Only allow single character
    setCellValue(value);
    if (selectedCell) {
      const newCells = [...cells];
      newCells[selectedCell.row][selectedCell.col] = value;
      onCellChange(newCells);
    }
  };

  const handleClear = () => {
    setCellValue('');
    if (selectedCell) {
      const newCells = [...cells];
      newCells[selectedCell.row][selectedCell.col] = '';
      onCellChange(newCells);
    }
  };

  const handleCreateCustomChar = () => {
    if (customChars.length >= 8) {
      alert('Maximum 8 custom characters allowed!');
      return;
    }
    setEditingChar(null);
    setShowCustomCharEditor(true);
  };

  const handleEditCustomChar = (char) => {
    setEditingChar(char);
    setShowCustomCharEditor(true);
  };

  const handleCustomCharSave = (charData) => {
    if (editingChar) {
      onCustomCharUpdate(charData);
    } else {
      onCustomCharAdd(charData);
    }
    setShowCustomCharEditor(false);
    setEditingChar(null);
  };

  const handleUseCustomChar = (char) => {
    setCellValue(char.symbol);
    if (selectedCell) {
      const newCells = [...cells];
      newCells[selectedCell.row][selectedCell.col] = char.symbol;
      onCellChange(newCells);
    }
  };

  if (!selectedCell) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Cell Editor</h2>
        <p className="text-gray-500">Select a cell to edit</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Cell Editor</h2>
      
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <p className="text-sm text-gray-600">
          Selected: Row {selectedCell.row + 1}, Column {selectedCell.col + 1}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cell Content
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={cellValue}
            onChange={handleValueChange}
            maxLength={1}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono"
            placeholder="Enter character"
          />
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Custom Characters</h3>
          <span className="text-sm text-gray-500">{customChars.length}/8 slots used</span>
        </div>
        
        <button
          onClick={handleCreateCustomChar}
          disabled={customChars.length >= 8}
          className={`w-full px-4 py-2 rounded-md transition-colors mb-4 ${
            customChars.length >= 8
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {customChars.length >= 8 ? 'Maximum Characters Reached' : 'Create New Custom Character'}
        </button>

        {customChars.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {customChars.map((char) => (
              <div
                key={char.slot}
                className="p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{char.name}</p>
                    <p className="text-xs text-gray-500">Slot {char.slot}</p>
                    <p className="text-xs text-gray-500">Symbol: {char.symbol}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCustomChar(char)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleUseCustomChar(char)}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Use
                    </button>
                  </div>
                </div>
                <div className="flex gap-1">
                  {char.pixels.map((row, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      {row.map((pixel, j) => (
                        <div
                          key={j}
                          className={`w-2 h-2 ${pixel ? 'bg-black' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCustomCharEditor && (
        <CustomCharEditor
          editingChar={editingChar}
          usedSlots={customChars.map(c => c.slot)}
          onSave={handleCustomCharSave}
          onCancel={() => {
            setShowCustomCharEditor(false);
            setEditingChar(null);
          }}
        />
      )}
    </div>
  );
}
