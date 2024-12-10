const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Part One
  const partOnefullString = data.split("").reduce((acc, curr, i) => {
    if (isDivisibleByTwo(i) && curr !== ".") {
      return [...acc, ...Array(Number(curr)).fill(i / 2)];
    } else {
      return [...acc, ...Array(Number(curr)).fill(".")];
    }
  }, []);

  console.log(getPartOne(partOnefullString));

  // Part Two
  const partTwoFullString = data.split("").reduce((acc, curr, i) => {
    if (isDivisibleByTwo(i) && curr !== ".") {
      return [...acc, Array(Number(curr)).fill(i / 2)];
    } else {
      return [...acc, Array(Number(curr)).fill(".")];
    }
  }, []);

  console.log(getPartTwo(partTwoFullString));
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

const getPartTwo = (fullString) => {
  let hasChanges = true;

  while (hasChanges) {
    hasChanges = processFullString(fullString);
    fullString = fullString.filter((subArray) => subArray.length > 0);
  }

  return fullString
    .flat()
    .reduce((acc, curr, i) => (curr !== "." ? acc + Number(curr) * i : acc), 0);
};

const isDivisibleByTwo = (number) => Number(number) % 2 === 0;

const processFullString = (fullString) => {
  let hasChanges = false;

  for (let i = 0; i < fullString.length; i++) {
    for (let j = fullString.length - 1; j > i; j--) {
      if (
        fullString[i][0] === "." &&
        fullString[j][0] !== "." &&
        fullString[i].length >= fullString[j].length
      ) {
        for (let x = 0; x < fullString[i].length; x++) {
          if (fullString[j][x] !== undefined) {
            fullString[i][x] = fullString[j][x];
            fullString[j][x] = ".";
          } else {
            const split = splitArray(fullString[i]);
            fullString.splice(i, 1, split[0], split[1]);

            hasChanges = true;
            return true;
          }
        }
        hasChanges = true;
      }
    }
  }

  return hasChanges;
};

const splitArray = (array) => {
  const result = [[], []];

  for (const item of array) {
    if (item === ".") {
      result[1].push(item);
    } else {
      result[0].push(item);
    }
  }

  return result;
};
