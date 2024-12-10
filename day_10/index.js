const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const input = data.split("\n");
  const numericInput = input.map((row) => row.split("").map(Number));

  getPartOne(numericInput);
});

let partOneCounter = 0;
let partTwoCounter = 0;
let nineLocations = [];

const getPartOne = (input) => {
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

  const neighbours = geValidNeighbours(input, Number(target), x, y);

  if (neighbours.length === 0) {
    return;
  }

  neighbours.forEach((neighbour) => {
    searchGraph(input, target + 1, neighbour.x, neighbour.y);
  });

  if (target === 9 && neighbours.length !== 0) {
    neighbours.forEach((neighbour) => {
      partTwoCounter++;
      const hasBeenVisited = nineLocations.some(
        (location) => location.x === neighbour.x && location.y === neighbour.y
      );

      if (!hasBeenVisited) {
        nineLocations.push({ x: neighbour.x, y: neighbour.y });
        partOneCounter++;
      }
    });
  }
};

const geValidNeighbours = (input, target, x, y) => {
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
