const fs = require("fs");

const isDivisibleByTwo = (number) => Number(number) % 2 === 0;

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const inputNumbers = data.split("");

  let counter = 0;

  const fullString = inputNumbers.reduce((acc, curr, i) => {
    if (isDivisibleByTwo(i) && curr !== ".") {
      return acc + `${counter++}`.repeat(Number(curr));
    } else {
      return acc + ".".repeat(curr);
    }
  }, "");

  // console.log(fullString);

  let currentString = fullString.split("");

  fullString.split("").forEach((char, i) => {
    if (char === ".") {
      for (let j = currentString.length - 1; j > i; j--) {
        if (currentString[j] !== ".") {
          currentString[i] = currentString[j];
          currentString[j] = ".";
          break;
        }
      }
      // console.log(currentString.join(""));
    }
  });

  const answer = currentString.reduce(
    (acc, curr, i) => (curr !== "." ? acc + Number(curr) * i : acc),
    0
  );

  console.log(answer);
});
