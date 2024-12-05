const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const [pageOrderingRulesData, pageUpdatesData] = data.split("\n\n");
  const orderingRules = pageOrderingRulesData.split("\n");
  const pageUpdates = pageUpdatesData.split("\n");

  const rulesIndex = orderingRules.reduce((acc, rule) => {
    const [currentPage, afterCurrentPage] = rule.split("|");
    return {
      ...acc,
      [currentPage]: [...(acc[currentPage] || []), afterCurrentPage],
    };
  }, {});

  let totalMiddleNumber = 0;
  let invalidPageUpdates = [];

  // Part One
  pageUpdates.forEach((pageUpdate) => {
    const pages = pageUpdate.split(",");
    const pageIndexMap = pages.reduce(
      (acc, page, idx) => ({
        ...acc,
        [page]: idx,
      }),
      {}
    );

    let validPage = true;

    pages.forEach((currentPage) => {
      if (!validPage) return;

      const currentPageIndex = pageIndexMap[currentPage];
      const pagesThatMustBeAfterCurrentPage = rulesIndex[currentPage];

      if (!pagesThatMustBeAfterCurrentPage) {
        return;
      }

      pagesThatMustBeAfterCurrentPage.forEach((pageInQuestion) => {
        if (!validPage) return;

        const pageIndexOfPageInQuestion = pageIndexMap[pageInQuestion];
        if (pageIndexOfPageInQuestion < currentPageIndex) {
          validPage = false;

          invalidPageUpdates.push(pages);
        }
      });
    });

    if (validPage) {
      totalMiddleNumber += Number(pages[(pages.length - 1) / 2]);
    }
  });

  console.log("Total middle number:", totalMiddleNumber);

  // Part Two
  const fixedInvalidPageUpdates = invalidPageUpdates
    .map((pages) => {
      const fixedPages = fixInvalidUpdate(pages, rulesIndex);
      if (fixedPages) {
        return fixedPages;
      } else {
        return null;
      }
    })
    .filter((pages) => pages !== null);

  const partTwoAnswer = fixedInvalidPageUpdates.reduce((acc, pages) => {
    return acc + Number(pages[(pages.length - 1) / 2]);
  }, 0);

  console.log("Part two answer:", partTwoAnswer);
});

// Part Two Helper functions
const fixInvalidUpdate = (pages, rulesIndex, triedPagesSet = new Set()) => {
  const pagesKey = pages.join(",");

  if (triedPagesSet.has(pagesKey)) {
    return null;
  }

  triedPagesSet.add(pagesKey);

  const validationResult = validatePages(pages, rulesIndex);

  if (validationResult.isValid) {
    return pages;
  }

  const invalidPairs = validationResult.invalidPairs;

  for (let [currentPageIndex, pageIndexOfPageInQuestion] of invalidPairs) {
    // Swap the pages causing invalidity
    const newPages = [...pages];
    [newPages[currentPageIndex], newPages[pageIndexOfPageInQuestion]] = [
      newPages[pageIndexOfPageInQuestion],
      newPages[currentPageIndex],
    ];

    // Recursively try to fix the ordering
    const result = fixInvalidUpdate(newPages, rulesIndex, triedPagesSet);

    if (result) {
      return result;
    }
  }

  return null;
};

const validatePages = (pages, rulesIndex) => {
  const pageIndexMap = pages.reduce(
    (acc, page, idx) => ({
      ...acc,
      [page]: idx,
    }),
    {}
  );

  let invalidPairs = [];

  for (let currentPage of pages) {
    const currentPageIndex = pageIndexMap[currentPage];
    const pagesThatMustBeAfterCurrentPage = rulesIndex[currentPage];

    if (!pagesThatMustBeAfterCurrentPage) {
      continue;
    }

    for (let pageInQuestion of pagesThatMustBeAfterCurrentPage) {
      const pageIndexOfPageInQuestion = pageIndexMap[pageInQuestion];
      if (pageIndexOfPageInQuestion === undefined) {
        continue;
      }

      if (pageIndexOfPageInQuestion < currentPageIndex) {
        invalidPairs.push([currentPageIndex, pageIndexOfPageInQuestion]);
      }
    }
  }

  if (invalidPairs.length === 0) {
    return { isValid: true };
  } else {
    return { isValid: false, invalidPairs };
  }
};
