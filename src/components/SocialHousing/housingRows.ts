import data from "./data.json";

// 官方揭露過的分類值。順序即畫面勾選框的順序。
// 官方新增或改名分類時，housingRows.test.ts 會失敗，提醒同步更新這裡、colors.ts、
// Descriptions 的格式異動說明與 Calculator 的分期修正 (見 docs/adr/0002)。
export const PROGRESSES = ["既有", "新完工", "興建中", "已決標待開工", "規劃中"] as const;
export const REGIONS = ["臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市", "其他縣市"] as const;
export const GOVERNMENTS = ["地方", "中央"] as const;

export type Progress = (typeof PROGRESSES)[number];
export type Region = (typeof REGIONS)[number];
export type Government = (typeof GOVERNMENTS)[number];

/** data.json 的一列：某年月、某地區、某層級政府、某進度的戶數 */
export interface HousingRow {
  /** 資料年月 YYYYMM */
  t: string;
  r: Region;
  g: Government;
  c: Progress;
  /** 戶數 */
  v: number;
}

type CheckedField = keyof HousingRow;

export interface InvalidRow {
  index: number;
  row: unknown;
  fields: CheckedField[];
}

const isOneOf = (known: readonly string[]) => (value: unknown) =>
  typeof value === "string" && known.includes(value);

const IS_VALID: Record<CheckedField, (value: unknown) => boolean> = {
  t: value => typeof value === "string" && /^\d{6}$/.test(value),
  r: isOneOf(REGIONS),
  g: isOneOf(GOVERNMENTS),
  c: isOneOf(PROGRESSES),
  v: value => typeof value === "number" && Number.isFinite(value),
};

export const findInvalidRows = (rows: readonly Record<string, unknown>[]): InvalidRow[] =>
  rows.flatMap((row, index) => {
    const fields = (Object.keys(IS_VALID) as CheckedField[]).filter(
      field => !IS_VALID[field](row[field])
    );
    return fields.length > 0 ? [{ index, row, fields }] : [];
  });

/** data.json 全部資料；格式由 housingRows.test.ts 檢查，CI 會在不合格時擋下 */
export const housingRows = data as HousingRow[];
