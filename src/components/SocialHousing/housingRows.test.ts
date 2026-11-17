import { describe, expect, test } from "vitest";
import { findInvalidRows } from "./housingRows";
import data from "./data.json";

const validRow = { t: "202610", r: "臺北市", g: "地方", c: "興建中", v: 100 };

describe("檢查 data.json 每一列的年月格式、分類與戶數", () => {
  test("官方出現新的進度分類時會被列出", () => {
    const newProgress = { ...validRow, c: "已完工待配租" };

    expect(findInvalidRows([validRow, newProgress])).toEqual([
      { index: 1, row: newProgress, fields: ["c"] },
    ]);
  });

  test("年月不是 YYYYMM 字串時會被列出", () => {
    const numericMonth = { ...validRow, t: 202504 };

    expect(findInvalidRows([numericMonth])).toEqual([
      { index: 0, row: numericMonth, fields: ["t"] },
    ]);
  });

  test("戶數不是數字時會被列出", () => {
    const textCount = { ...validRow, v: "100" };

    expect(findInvalidRows([textCount])).toEqual([
      { index: 0, row: textCount, fields: ["v"] },
    ]);
  });

  test("目前的 data.json 每一列都符合格式", () => {
    expect(findInvalidRows(data)).toEqual([]);
  });
});
