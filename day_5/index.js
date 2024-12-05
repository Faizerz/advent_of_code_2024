const fs = require("fs");

fs.readFile("test.txt", "utf8", (err, data) => {
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

  console.log("\n\n", rulesIndex, "\n\n");

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

    pages.forEach((currentPage, idx) => {
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
          console.log(
            `Invalid ordering: ${pageInQuestion} must be after ${currentPage}`
          );
          validPage = false;

          const fixedPageOrder = fixInvalidUpdate(
            pages,
            currentPageIndex,
            pageIndexOfPageInQuestion
          );

          invalidPageUpdates.push(pages);
        }
      });
    });

    if (validPage) {
      console.log(`Valid page - Adding ${pages[(pages.length - 1) / 2]}`);
      totalMiddleNumber += Number(pages[(pages.length - 1) / 2]);
    }
  });

  // console.log("Total middle number:", totalMiddleNumber);
});

// Part Two
const fixInvalidUpdate = (
  pages,
  currentPageIndex,
  pageIndexOfPageInQuestion
) => {
  console.log(pages, pages[currentPageIndex], pages[pageIndexOfPageInQuestion]);
};
