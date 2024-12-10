const fs = require("fs");

const isDivisibleByTwo = (number) => Number(number) % 2 === 0;

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const fullString = data.split("").reduce((acc, curr, i) => {
    if (isDivisibleByTwo(i) && curr !== ".") {
      return [...acc, ...Array(Number(curr)).fill(i / 2)];
    } else {
      return [...acc, ...Array(Number(curr)).fill(".")];
    }
  }, []);

  console.log(getPartOne(fullString));
});

const getPartOne = (fullString) => {
  fullString.forEach((char, i) => {
    if (char === ".") {
      for (let j = fullString.length - 1; j > i; j--) {
        if (fullString[j] !== ".") {
          fullString[i] = fullString[j];
          fullString[j] = ".";
          break;
        }
      }
    }
  });

  return fullString.reduce(
    (acc, curr, i) => (curr !== "." ? acc + Number(curr) * i : acc),
    0
  );
};
