const fs = require("fs");

const MAP = {};
const processedSquares = {};

fs.readFile("test.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const rows = data.split("\n");
  const Y_MAX = rows.length;
  const X_MAX = rows[0].length;

  rows.forEach((row, y) =>
    row.split("").forEach((char, x) => {
      if (!MAP[x]) MAP[x] = {};
      MAP[x][y] = char;
    })
  );

  const processSquare = (letter, x, y) => {
    if (
      processedSquares?.[x]?.[y] ||
      x < 0 ||
      y < 0 ||
      x >= X_MAX ||
      y >= Y_MAX
    ) {
      return;
    } else {
      processedSquares[x] = processedSquares[x] || {};
      processedSquares[x][y] = letter;
    }

    if (MAP[x + 1]?.[y] === letter) {
      processSquare(letter, x + 1, y);
    }

    if (MAP[x - 1]?.[y] === letter) {
      processSquare(letter, x - 1, y);
    }

    if (MAP[x]?.[y + 1] === letter) {
      processSquare(letter, x + 1, y);
    }

    if (MAP[x]?.[y - 1] === letter) {
      processSquare(letter, x + 1, y);
    }
  };

  rows.forEach((row, y) => {
    row.split("").forEach((letter, x) => {
      processSquare(letter, x, y);
    });
  });

  console.log(processedSquares);
});
