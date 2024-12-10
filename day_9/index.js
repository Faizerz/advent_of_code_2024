const fs = require("fs");

const isDivisibleByTwo = (number) => Number(number) % 2 === 0;

fs.readFile("test.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const inputNumbers = data.split("");

  let counter = 0;
  let dotCounter = 0;
  let justNumbers = [];

  const fullString = inputNumbers.reduce((acc, curr, i) => {
    if (isDivisibleByTwo(i) && curr !== ".") {
      const repeated = `${counter++}`.repeat(Number(curr));
      justNumbers.push(...repeated);
      return acc + repeated;
    } else {
      dotCounter += Number(curr);
      return acc + ".".repeat(curr);
    }
  }, "");

  let currentString = fullString.split("");
  let numbersToInsert = justNumbers.reverse();
  let dotCount = 0;

  currentString.forEach((char, i) => {
    if (char === "." && dotCount < dotCounter) {
      dotCount++;
      currentString[i] = numbersToInsert.shift();
    }
  });

  const answer = currentString
    .slice(0, currentString.length - dotCounter) // Use currentString.length here
    .reduce((acc, curr, i) => (curr !== "." ? acc + Number(curr) * i : acc), 0);

  console.log(answer);
});
