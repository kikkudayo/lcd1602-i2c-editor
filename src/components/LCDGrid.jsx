import { useState } from 'react';

export default function LCDGrid({ cells, selectedCell, onCellSelect, onCellChange }) {
  const rows = 2;
  const cols = 16;

  const handleCellChange = (row, col, value) => {
    const newCells = [...cells];
    newCells[row][col] = value;
    onCellChange(newCells);
  };

  return (
    <div className="bg-green-900 p-4 rounded-lg shadow-xl inline-block">
      <div className="bg-green-700 p-2 rounded">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 mb-1 last:mb-0">
            {Array.from({ length: cols }).map((_, colIndex) => {
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const cellValue = cells[rowIndex][colIndex];
              
              return (
                <div
                  key={colIndex}
                  onClick={() => onCellSelect({ row: rowIndex, col: colIndex })}
                  className={`w-8 h-10 bg-green-500 flex items-center justify-center cursor-pointer font-mono text-lg border-2 transition-all ${
                    isSelected ? 'border-yellow-400 ring-2 ring-yellow-300' : 'border-green-600'
                  } ${cellValue ? 'text-black' : 'text-green-600'}`}
                  title={`Row ${rowIndex + 1}, Col ${colIndex + 1}`}
                >
                  {cellValue || ' '}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
