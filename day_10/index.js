const fs = require("fs");

fs.readFile("test.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const input = data.split("\n");
  const numericInput = input.map((row) => row.split("").map(Number));

  getPartOne(numericInput);
});

const getPartOne = (input) => {
  input.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 0) {
        console.log("Found 0 at", x, y);
        searchGraph(input, cell + 1, x, y);
      }
    });
  });
};

const searchGraph = (input, target, x, y) => {
  console.log("Searching for", target, "at", x, y);
  const neighbours = getNeighbours(input, Number(target), x, y);
  console.log("Neighbours", neighbours);
};

const getNeighbours = (input, target, x, y) => {
  const neighbours = [];

  if (input[y - 1]?.[x] === target) {
    neighbours.push({ x, y: y - 1 });
  } else if (input[y + 1]?.[x] === target) {
    neighbours.push({ x, y: y + 1 });
  } else if (input[y]?.[x - 1] === target) {
    neighbours.push({ x: x - 1, y });
  } else if (input[y]?.[x + 1] === target) {
    neighbours.push({ x: x + 1, y });
  } else {
    return [];
  }

  return neighbours;
};
