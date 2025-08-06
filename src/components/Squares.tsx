import { useState } from "react";

function Squares() {
  const [board, setBoard] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [animatedCells, setAnimatedCells] = useState<Set<string>>(new Set());

  const handleChange = (row: number, col: number, value: string) => {
    const num = parseInt(value);
    if (value === "" || (!isNaN(num) && num >= 1 && num <= 9)) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = value === "" ? 0 : num;
      setBoard(newBoard);
    }
  };

  const isValid = (
    b: number[][],
    row: number,
    col: number,
    num: number
  ): boolean => {
    for (let i = 0; i < 9; i++) {
      if (b[row][i] === num || b[i][col] === num) return false;
      const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const boxCol = 3 * Math.floor(col / 3) + (i % 3);
      if (b[boxRow][boxCol] === num) return false;
    }
    return true;
  };

  const solveSudoku = (b: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(b, row, col, num)) {
              b[row][col] = num;
              if (solveSudoku(b)) return true;
              b[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const handleSolve = () => {
    const newBoard = board.map((row) => [...row]);
    const newAnimatedCells = new Set<string>();

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newBoard[row][col] === 0) {
          newAnimatedCells.add(`${row}-${col}`);
        }
      }
    }

    if (solveSudoku(newBoard)) {
      setBoard(newBoard);
      setAnimatedCells(newAnimatedCells);
      // Remove animation effect after it's played once
      setTimeout(() => setAnimatedCells(new Set()), 500);
    } else {
      alert("This puzzle is unsolvable!");
    }
  };

  return (
    <>
      <div>
        <h1>Sudoku Solver</h1>
      </div>
      <div className="container">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const baseClass = `square row${rowIndex + 1} column${colIndex + 1}`;
            const animClass =
              animatedCells.has(`${rowIndex}-${colIndex}`) && cell !== 0
                ? "filled"
                : "";

            return (
              <textarea
                key={`${rowIndex}-${colIndex}`}
                className={`${baseClass} ${animClass}`}
                value={cell === 0 ? "" : cell}
                onChange={(e) =>
                  handleChange(rowIndex, colIndex, e.target.value)
                }
                rows={1}
                cols={1}
                maxLength={1}
                style={{ resize: "none" }}
              />
            );
          })
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleSolve}>Solve</button>
      </div>
    </>
  );
}

export default Squares;
