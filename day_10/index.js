const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const input = data.split("\n");
  const numericInput = input.map((row) => row.split("").map(Number));

  getAnswer(numericInput);
});

let partOneCounter = 0;
let partTwoCounter = 0;
let nineLocations = [];

const getAnswer = (input) => {
  input.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 0) {
        nineLocations = [];
        searchGraph(input, cell + 1, x, y);
      }
    });
  });

  console.log("Part one:", partOneCounter);
  console.log("Part two:", partTwoCounter);
};

const searchGraph = (input, target, x, y) => {
  if (target === 10) return;

  const neighbours = getValidNeighbours(input, target, x, y);
  if (!neighbours.length) return;

  neighbours.forEach(({ x: neighbourX, y: neighbourY }) =>
    searchGraph(input, target + 1, neighbourX, neighbourY)
  );

  if (target === 9) {
    neighbours.forEach(({ x: neighbourX, y: neighbourY }) => {
      partTwoCounter++;
      if (
        !nineLocations.some(({ x, y }) => x === neighbourX && y === neighbourY)
      ) {
        nineLocations.push({ x: neighbourX, y: neighbourY });
        partOneCounter++;
      }
    });
  }
};

const getValidNeighbours = (input, target, x, y) => {
  const neighbours = [];

  if (input[y - 1]?.[x] === target) {
    neighbours.push({ x, y: y - 1 });
  }

  if (input[y + 1]?.[x] === target) {
    neighbours.push({ x, y: y + 1 });
  }

  if (input[y]?.[x - 1] === target) {
    neighbours.push({ x: x - 1, y });
  }

  if (input[y]?.[x + 1] === target) {
    neighbours.push({ x: x + 1, y });
  }

  if (neighbours.length === 0) {
    return [];
  }

  return neighbours;
};
