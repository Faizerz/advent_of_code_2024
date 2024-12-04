const fs = require("fs");

const Directions = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
  UP_LEFT: [-1, -1],
  UP_RIGHT: [1, -1],
  DOWN_LEFT: [-1, 1],
  DOWN_RIGHT: [1, 1],
};

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const rows = data.split("\n");
  const Y_MAX = rows.length;
  const X_MAX = rows[0].length;
  const isValidCell = (x, y) => x >= 0 && x < X_MAX && y >= 0 && y < Y_MAX;

  // Part One - XMAS
  let xmasCount = 0;
  const TARGET_WORD = "XMAS";

  const checkAdjacents = (x, y, targetLetterIndex, [dx, dy]) => {
    const newX = x + dx;
    const newY = y + dy;

    if (!isValidCell(newX, newY)) return;

    if (rows[newY][newX] === TARGET_WORD[targetLetterIndex]) {
      if (targetLetterIndex === TARGET_WORD.length - 1) {
        xmasCount++;
        return;
      }
      return checkAdjacents(newX, newY, targetLetterIndex + 1, [dx, dy]);
    }
  };

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] === TARGET_WORD[0]) {
        Object.values(Directions).forEach((direction) => {
          checkAdjacents(x, y, 1, direction);
        });
      }
    }
  }

  console.log("XMAS count:", xmasCount);

  // Part Two - MAS Cross
  let crossMasCount = 0;
  const TARGET_LETTERS = ["M", "S"];

  const checkDiagnolAdjacent = (x, y, [dx, dy]) => {
    const newX = x + dx;
    const newY = y + dy;

    if (!isValidCell(newX, newY)) return "";

    const cell = rows[newY][newX];
    return TARGET_LETTERS.includes(cell) ? cell : "";
  };

  const isValidPair = (a, b) =>
    (a === "M" && b === "S") || (a === "S" && b === "M");

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] === "A") {
        const upRight = checkDiagnolAdjacent(x, y, Directions.UP_RIGHT);
        const downRight = checkDiagnolAdjacent(x, y, Directions.DOWN_RIGHT);
        const upLeft = checkDiagnolAdjacent(x, y, Directions.UP_LEFT);
        const downLeft = checkDiagnolAdjacent(x, y, Directions.DOWN_LEFT);

        if (!upRight || !downRight || !upLeft || !downLeft) continue;

        if (isValidPair(upRight, downLeft) && isValidPair(upLeft, downRight)) {
          crossMasCount++;
        }
      }
    }
  }

  console.log("MAS Cross count:", crossMasCount);
});
