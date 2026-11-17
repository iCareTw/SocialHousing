import {
  GOVERNMENTS,
  PROGRESSES,
  REGIONS,
  type Government,
  type Progress,
  type Region,
} from "./housingRows";

/** 圖表的一組長條：name 為資料中的分類值，label 為畫面顯示名稱 (未設定時沿用 name) */
export interface BarInfo {
  id: number;
  name: string;
  label?: string;
  color: string;
}

// 每個分類都必須有顏色；housingRows 新增分類時，這裡少了對應顏色會無法通過型別檢查
const REGION_COLORS: Record<Region, string> = {
  "臺北市": "#28c7c7",
  "新北市": "#0000FF",
  "桃園市": "#e8606a",
  "臺中市": "#87CEFA",
  "臺南市": "green",
  "高雄市": "#75e561",
  "其他縣市": "#e5e561",
};

const PROGRESS_COLORS: Record<Progress, string> = {
  "既有": "#0000FF",
  "新完工": "#28c7c7",
  "興建中": "#ffcc00",
  "已決標待開工": "#75e561",
  "規劃中": "#cdcdcd",
};

// 本站用語與 data.json 官方欄位值不同的分類 (見 GLOSSARY.md)
const PROGRESS_LABELS: Partial<Record<Progress, string>> = {
  "新完工": "已完工",
};

const GOVERNMENT_COLORS: Record<Government, string> = {
  "地方": "#86e056",
  "中央": "#ffcf2d",
};

// id 即分類在清單中的位置，對應勾選陣列的索引
export const subjectBarInfoList: BarInfo[] = REGIONS.map((name, id) => ({
  id,
  name,
  color: REGION_COLORS[name],
}));

export const progressBarInfoList: BarInfo[] = PROGRESSES.map((name, id) => ({
  id,
  name,
  label: PROGRESS_LABELS[name],
  color: PROGRESS_COLORS[name],
}));

export const governmentBarInfoList: BarInfo[] = GOVERNMENTS.map((name, id) => ({
  id,
  name,
  color: GOVERNMENT_COLORS[name],
}));

export const totalBarInfoList: BarInfo[] = [
  { id: 0, name: "合計", color: "#66B2FF" },
];
