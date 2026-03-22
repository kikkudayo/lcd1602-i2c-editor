import { useState, useEffect } from 'react';

export default function CustomCharEditor({ editingChar, usedSlots, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [slot, setSlot] = useState(0);
  const [pixels, setPixels] = useState(
    Array(5).fill().map(() => Array(8).fill(false))
  );

  useEffect(() => {
    if (editingChar) {
      setName(editingChar.name);
      setSymbol(editingChar.symbol);
      setSlot(editingChar.slot);
      setPixels(editingChar.pixels);
    } else {
      // Reset state for new character
      setName('');
      setSymbol('');
      setPixels(Array(5).fill().map(() => Array(8).fill(false)));
      // Find first available slot
      const availableSlot = [0, 1, 2, 3, 4, 5, 6, 7].find(s => !usedSlots.includes(s));
      setSlot(availableSlot !== undefined ? availableSlot : 0);
    }
  }, [editingChar, usedSlots]);

  const togglePixel = (col, row) => {
    const newPixels = pixels.map((column, c) =>
      c === col ? column.map((pixel, r) => (r === row ? !pixel : pixel)) : column
    );
    setPixels(newPixels);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a character name');
      return;
    }
    if (!symbol.trim()) {
      alert('Please enter a symbol');
      return;
    }
    if (symbol.length > 1) {
      alert('Symbol must be a single character');
      return;
    }

    onSave({
      name: name.trim(),
      symbol: symbol.trim(),
      slot,
      pixels
    });
  };

  const availableSlots = [0, 1, 2, 3, 4, 5, 6, 7].filter(
    s => !usedSlots.includes(s) || (editingChar && s === editingChar.slot)
  );

  return (
    <div className="fixed inset-0  flex items-center justify-center p-4 bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {editingChar ? 'Edit Custom Character' : 'Create Custom Character'}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Character Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Heart, Arrow, Custom"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symbol (single character to represent this)
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.slice(0, 1))}
              maxLength={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., ♥, →, @"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Character Slot (0-7)
            </label>
            <select
              value={slot}
              onChange={(e) => setSlot(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableSlots.map(s => (
                <option key={s} value={s}>
                  Slot {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Design Your Character (5x8 pixels)
            </label>
            <div className="inline-block bg-gray-200 p-4 rounded-lg">
              <div className="flex gap-1">
                {pixels.map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-1">
                    {column.map((pixel, rowIndex) => (
                      <button
                        key={rowIndex}
                        onClick={() => togglePixel(colIndex, rowIndex)}
                        className={`w-8 h-8 border-2 transition-colors ${
                          pixel
                            ? 'bg-black border-gray-700'
                            : 'bg-white border-gray-400'
                        }`}
                        type="button"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Save Character
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
