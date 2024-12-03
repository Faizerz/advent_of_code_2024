const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Part One
  const cleanString = data.match(/mul\(\d+,\d+\)/g) || [];

  const sumPartOne = cleanString.reduce((acc, instr) => {
    const [a, b] = instr.match(/\d+/g).map(Number);
    return acc + a * b;
  }, 0);

  console.log("Sum Part One:", sumPartOne);

  // Part Two
  const instructions = data.match(/(?:don't\(\)|do\(\)|mul\(\d+,\d+\))/g) || [];

  console.log("Instructions:", instructions);

  let isEnabled = true;

  const sumPartTwo = instructions.reduce((acc, instr) => {
    if (instr === "don't()") {
      isEnabled = false;
    } else if (instr === "do()") {
      isEnabled = true;
    } else if (isEnabled && instr.startsWith("mul")) {
      const [a, b] = instr.match(/\d+/g).map(Number);
      return acc + a * b;
    }
    return acc;
  }, 0);

  console.log("Sum Part Two:", sumPartTwo);
});
