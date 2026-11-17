import { GOVERNMENTS, PROGRESSES, REGIONS, type HousingRow } from "./housingRows";

/** 圖表分組方式：總計a, 中央地方g, 主體s, 進度p */
export type Category = "a" | "g" | "s" | "p";

/** 勾選狀態，1 為勾選、0 為未勾選；順序與 housingRows 的分類清單一致 */
export type CheckedList = readonly number[];

/** 圖表的一個月份：t 為年月，其餘鍵為各分組的戶數 */
export type ChartPoint = { t: string } & Record<string, number | string>;

const monthOf = (item: HousingRow): number => parseInt(item.t);

/*
  回傳像是年度 v 的加總, example:
  {'201703': 100, '201704': 200}
*/
const monthlyTotalCalculate = (data: readonly HousingRow[]): Record<string, number> => {
  return data.reduce<Record<string, number>>((acc, item) => {
    acc[item.t] = (acc[item.t] ?? 0) + item.v;
    return acc;
  }, {});
};


/* 進行既有社宅的調整
  params:
  - data: 原始資料
  - gonnaAdjust: 是否進行 既有 社宅調整

  既有社宅調整邏輯
  此為特殊處理, 因 202303 ~ 202411 揭露了 既有
  此期間以前, 通通不計入既有                          -> 將此既有加入歷史
  此期間以後, 又將既有通通納入到新完工, 並重新命名為已完工 -> 將此分拆出來
  202610 起, 官方再次將既有從新完工拆分揭露           -> 不調整
*/
const adjustLegacy = (data: readonly HousingRow[], gonnaAdjust: boolean): readonly HousingRow[] => {
  if (!gonnaAdjust) return data; // 不調整, 直接返回原始值
  const monthlyTotal = monthlyTotalCalculate(data);

  const result: HousingRow[] = [];
  for (const item of data) {
    const month = monthOf(item);
    if (monthlyTotal[item.t] === 0) { // 缺資料月份不處理，返回拷貝
      result.push(item);
    } else if (item.c !== "既有" && item.c !== "新完工") {  // 既有社宅的調整, 只會調整到 既有
      result.push(item);
    } else if (item.g !== "地方") {  // 只處理 地方 的社宅
      result.push(item);
    } else if (month >= 202303 && month <= 202411) {  // 只處理 202303 ~ 202411 的既有社宅
      result.push(item);
    } else if (month >= 202610) {  // 202610 起官方重新揭露 既有, 不需調整
      result.push(item);
    } else if (!isLegacyRegion(item.r)) {  // 只處理這四個縣市
      result.push(item);
    } else {  // 既有社宅調整
      const v = item.v + adjustLegacyValue(month, item.c, item.r);
      result.push({ ...item, v: v });
    }
  }
  return result;
}


/** 有既有社宅的縣市 */
const LEGACY_REGIONS = ["臺北市", "新北市", "高雄市", "其他縣市"] as const;
type LegacyRegion = (typeof LEGACY_REGIONS)[number];

const isLegacyRegion = (region: string): region is LegacyRegion =>
  (LEGACY_REGIONS as readonly string[]).includes(region);


/* 既有社宅實際調整值
  t: 隨著時間經過, 既有社宅可能會減少. 留意社宅僅些漏 202303 ~ 202411
  r: 只有地方 有既有社宅
  g: 只有 臺北市 / 新北市 / 高雄市 / 其他縣市 有既有社宅
  c: 只有 既有 / 新完工 需要做調整異動
*/
const adjustLegacyValue = (
  month: number,
  progress: "既有" | "新完工",
  region: LegacyRegion
): number => {
  let newVal: Record<LegacyRegion, number>;

  if (month < 202303) {
    newVal = { "臺北市": 5592, "新北市": 418, "高雄市": 241, "其他縣市": 6 }
  } else if (month >= 202412 && month <= 202505) {
    newVal = { "臺北市": 5508, "新北市": 453, "高雄市": 241, "其他縣市": 6 }
  } else if (month >= 202506) {
    newVal = { "臺北市": 5506, "新北市": 445, "高雄市": 241, "其他縣市": 6 }
  } else {
    throw new Error(`既有社宅調整不適用於 ${month}`);  // 202303 ~ 202411 已在 adjustLegacy 排除
  }

  if (progress === "既有") {
    return newVal[region];
  } else if (month <= 202302) {
    return 0;  // 202302(含) 以前, 新完工社宅不需做調整
  } else {
    return -newVal[region];  // 202412(含) 以後, 新完工社宅已內含既有, 需扣除
  }
}


/* 世大運社宅調整邏輯
  此為特殊處理, 因林口世大運社會住宅屬於 內政部委託台北市政府興建
  https://pip.moi.gov.tw/V3/F/SCRF0401.aspx
  https://pip.moi.gov.tw/Upload/File/SocialHousing/社會住宅興辦計畫彙整表之執行進度-1070321(上網用).pdf
  20180831 完工
  201809 以前, 揭露資訊為 3408 戶 (當時列為新北市政府)
  201810 以後, 揭露資訊減少為 2907 戶 (當時列為新北市政府) (原因不明)
  202004 以後, 開始區分地方及中央, 完工歸屬到 新北市 中央
*/
const adjUniversiade2017 = (data: readonly HousingRow[], gonnaAdjust2017: boolean): readonly HousingRow[] => {
  if (!gonnaAdjust2017) return data; // 不調整, 直接返回原始值
  const monthlyTotal = monthlyTotalCalculate(data);

  return data.map(item => {
    if (monthlyTotal[item.t] === 0) return { ...item }; // 缺資料月份不處理，返回拷貝

    const timeInt = monthOf(item);
    const newItem = { ...item };

    if (item.c === "興建中" && timeInt < 201809) {
      if (item.r === "臺北市" && item.g === "地方") {
        newItem.v += 3408;
      } else if (item.r === "新北市" && item.g === "地方") {
        newItem.v = Math.max(0, item.v - 3408);
      }
    } else if (item.c === "新完工" && timeInt >= 201809 && timeInt < 202004) {
      // 201810起數量變為2907
      const adjustmentValue = timeInt >= 201810 ? 2907 : 3408;
      if (item.r === "臺北市" && item.g === "地方") {
        newItem.v += adjustmentValue;
      } else if (item.r === "新北市" && item.g === "地方") {
        newItem.v = Math.max(0, item.v - adjustmentValue);
      }
    } else if (item.c === "新完工" && timeInt >= 202004) {
      if (item.r === "臺北市" && item.g === "地方") {
        newItem.v += 2907;
      } else if (item.r === "新北市" && item.g === "中央") {
        newItem.v = Math.max(0, item.v - 2907);
      }
    }

    return newItem;
  });
};


const pickChecked = <T>(list: readonly T[], checked: CheckedList): T[] =>
  list.filter((_, index) => checked[index] === 1);

export const aggregateData = (
  data: readonly HousingRow[],
  category: Category,
  checkedProgress: CheckedList,
  checkedRegion: CheckedList,
  checkedGov: CheckedList,
  universiade2017: boolean,
  checkAdjustLegacy: boolean,
): ChartPoint[] => {
  const ymRange = new Set(data.map(item => item.t));

  const filteredRegion: readonly string[] = pickChecked(REGIONS, checkedRegion);
  const filteredGov: readonly string[] = pickChecked(GOVERNMENTS, checkedGov);
  const filteredProgress: readonly string[] = pickChecked(PROGRESSES, checkedProgress);

  let adjusted = adjUniversiade2017(data, universiade2017);
  adjusted = adjustLegacy(adjusted, checkAdjustLegacy);

  return diagramProcessedData(
    category,
    ymRange,
    adjusted,
    filteredProgress,
    filteredRegion,
    filteredGov
  );
};


const GROUP_KEY = { p: "c", s: "r", g: "g", a: "t" } as const satisfies Record<Category, keyof HousingRow>;

const diagramProcessedData = (
  category: Category,
  ymRange: Set<string>,
  data: readonly HousingRow[],
  filteredProgress: readonly string[],
  filteredRegion: readonly string[],
  filteredGov: readonly string[]
): ChartPoint[] => {
  let result: ChartPoint[] = [];

  const itemKey = GROUP_KEY[category];

  for (const ym of ymRange.values()) {
    const rows = data.filter(item => item.t === ym);

    const categorySet = itemKey === "t"
      ? new Set(["t"])
      : new Set(rows.map(item => item[itemKey]));
    const tmp: ChartPoint = { t: ym };

    for (const cat of categorySet.values()) {
      const { kk, vv } =
        cat === "t" ? { kk: "a", vv: ym } : { kk: cat, vv: cat };

      tmp[kk] = rows
        .filter(item => item[itemKey] === vv)
        .filter(
          item =>
            filteredProgress.includes(item.c) &&
            filteredRegion.includes(item.r) &&
            filteredGov.includes(item.g)
        )
        .reduce((accu, curr) => accu + curr.v, 0);
    }
    result.push(tmp);
  }

  // 當期合計
  if (category === "a") {
    result = result.map(item => {
      const { a, ...rest } = item;
      return { ...rest, 合計: a } as ChartPoint;
    });
  }

  return result;
};
