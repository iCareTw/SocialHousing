import { aggregateData } from "./Calculator";

// 既有社宅調整的期間邊界, 規則見 docs/adr/0001-保留官方原始數字並以可開關修正處理揭露格式異動.md
const RAW_EXISTING = 100; // 官方揭露的既有 (僅部分期間有值)
const RAW_FINISHED = 20000; // 官方揭露的新完工

const monthRows = (t, g = "地方") => [
  { t, r: "臺北市", g, c: "既有", v: RAW_EXISTING },
  { t, r: "臺北市", g, c: "新完工", v: RAW_FINISHED },
  { t, r: "臺北市", g, c: "興建中", v: 1 }
];

const byProgress = (rows, adjustLegacy) =>
  aggregateData(
    rows,
    "p",
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1],
    false,
    adjustLegacy
  );

const legacyAdjusted = (t, g) => {
  const [month] = byProgress(monthRows(t, g), true);
  return { 既有: month["既有"], 已完工: month["新完工"] };
};

describe("既有社宅調整 (開關開啟, 臺北市地方)", () => {
  test.each([
    // 202302 以前: 以 202303 首次揭露值往回補既有, 已完工不動
    ["202302", RAW_EXISTING + 5592, RAW_FINISHED],
    // 202303 ~ 202411: 官方已拆分揭露, 不調整
    ["202303", RAW_EXISTING, RAW_FINISHED],
    ["202411", RAW_EXISTING, RAW_FINISHED],
    // 202412 ~ 202505: 沿用 202411 揭露值, 從已完工拆出
    ["202412", RAW_EXISTING + 5508, RAW_FINISHED - 5508],
    ["202505", RAW_EXISTING + 5508, RAW_FINISHED - 5508],
    // 202506 ~ 202609: 人工抄寫值, 從已完工拆出
    ["202506", RAW_EXISTING + 5506, RAW_FINISHED - 5506],
    ["202609", RAW_EXISTING + 5506, RAW_FINISHED - 5506],
    // 202610 起: 官方重新拆分揭露, 不調整
    ["202610", RAW_EXISTING, RAW_FINISHED]
  ])("%s", (t, existing, finished) => {
    expect(legacyAdjusted(t)).toEqual({ 既有: existing, 已完工: finished });
  });

  test("中央不調整", () => {
    expect(legacyAdjusted("202506", "中央")).toEqual({
      既有: RAW_EXISTING,
      已完工: RAW_FINISHED
    });
  });

  test("調整前後當月合計不變 (202412 起只在既有與已完工之間搬移)", () => {
    const total = adjust =>
      Object.entries(byProgress(monthRows("202506"), adjust)[0])
        .filter(([k]) => k !== "t")
        .reduce((sum, [, v]) => sum + v, 0);
    expect(total(true)).toBe(total(false));
  });
});

describe("既有社宅調整 (開關關閉)", () => {
  test("顯示官方原始數字", () => {
    const [month] = byProgress(monthRows("202506"), false);
    expect(month["既有"]).toBe(RAW_EXISTING);
    expect(month["新完工"]).toBe(RAW_FINISHED);
  });
});
