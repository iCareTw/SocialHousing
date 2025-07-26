
/*
  回傳像是年度 v 的加總, example:
  {'201703': 100, '201704': 200}
*/
const monthlyTotalCalculate = data => {
  return data.reduce((acc, item) => {
    if (acc[item.t]) {
      acc[item.t] += item.v;
    } else {
      acc[item.t] = item.v;
    }
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
*/
const adjustLegacy = (data, gonnaAdjust) => {
  const monthlyTotal = monthlyTotalCalculate(data);

  if (!gonnaAdjust) return data; // 不調整, 直接返回原始值

  let result = []
  for (const item of data) {
    if (monthlyTotal[item.t] === 0) { // 缺資料月份不處理，返回拷貝
      result.push(item);
      continue;
    } else if (item.c !== "既有" && item.c !== "新完工") {  // 既有社宅的調整, 只會調整到 既有
      result.push(item);
      continue;
    } else if (item.g !== "地方") {  // 只處理 地方 的社宅
      result.push(item);
      continue;
    } else if (item.t >= 202303 && item.t <= 202411) {  // 只處理 202303 ~ 202411 的既有社宅
      result.push(item);
      continue;
    } else if (item.r !== "臺北市" && item.r !== "新北市" && item.r !== "高雄市" && item.r !== "其他縣市") {  // 只處理這四個縣市
      result.push(item);
      continue;
    } else {  // 既有社宅調整
      let v = 0
      let adjFinished = item.t <= 202302 ? 0 : -1;
      v = item.v + adjustLegacyValue(item, adjFinished);
      result.push({ ...item, v: v });
    }
  }
  return result;
} 


/* 既有社宅實際調整值
  t: 隨著時間經過, 既有社宅可能會減少. 留意社宅僅些漏 202303 ~ 202411
  r: 只有地方 有既有社宅
  g: 只有 臺北市 / 新北市 / 高雄市 / 其他縣市 有既有社宅
  c: 只有 既有 / 新完工 需要做調整異動
*/
const adjustLegacyValue = (item, adjFinished) => {
  let timeInt = parseInt(item.t);
  let newVal = {}

  if (timeInt < 202303) {
    newVal = { "臺北市": 5592, "新北市": 418, "高雄市": 241, "其他縣市": 6 }
  } else if (202412 <= timeInt <= 202505) {
    newVal = { "臺北市": 5508, "新北市": 453, "高雄市": 241, "其他縣市": 6 }
  } else if (timeInt >= 202506) {
    newVal = { "臺北市": 5506, "新北市": 445, "高雄市": 241, "其他縣市": 6 }
  }

  if (item.c === "既有") {
    return newVal[item.r];
  } else if (item.c === "新完工") {
    if (adjFinished === 0) {
      return 0;  // 202302(含) 以前, 新完工社宅不需做調整
    } else {
      return -newVal[item.r];  // 202412(含) 以後, 新完工社宅已內含既有, 需扣除
    }
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
const adjUniversiade2017 = (data, shouldAdjustValue) => {
  const monthlyTotal = monthlyTotalCalculate(data);

  return data.map(item => {
    if (monthlyTotal[item["t"]] === 0) return { ...item }; // 缺資料月份不處理，返回拷貝

    const timeInt = parseInt(item["t"]);
    const newItem = { ...item }; // 創建深拷貝

    if (item["c"] === "興建中" && timeInt < 201809) {
      // 201809 以前的興建中調整
      if (shouldAdjustValue) {
        if (item["r"] === "臺北市" && item["g"] === "地方") {
          newItem["v"] += 3408;
        } else if (item["r"] === "新北市" && item["g"] === "地方") {
          newItem["v"] = Math.max(0, item["v"] - 3408);
        }
      }
    } else if (item["c"] === "新完工" && timeInt >= 201809 && timeInt < 202004) {
      // 201809-202003 期間的新完工調整 (201810起數量變為2907)
      const adjustmentValue = timeInt >= 201810 ? 2907 : 3408;
      if (shouldAdjustValue) {
        if (item["r"] === "臺北市" && item["g"] === "地方") {
          newItem["v"] += adjustmentValue;
        } else if (item["r"] === "新北市" && item["g"] === "地方") {
          newItem["v"] = Math.max(0, item["v"] - adjustmentValue);
        }
      }
    } else if (item["c"] === "新完工" && timeInt >= 202004) {
      // 202004 以後的新完工調整
      if (shouldAdjustValue) {
        if (item["r"] === "臺北市" && item["g"] === "地方") {
          newItem["v"] += 2907;
        } else if (item["r"] === "新北市" && item["g"] === "中央") {
          newItem["v"] = Math.max(0, item["v"] - 2907);
        }
      }
    }
    
    return newItem;
  });
};


export const aggregateData = (
  data,
  category,
  checkedProgress,
  checkedRegion,
  checkedGov,
  universiade2017,
  checkAdjustLegacy,
) => {
  const ymRange = new Set(data.map(item => item.t));

  let filteredRegion = [];
  if (checkedRegion[0]) filteredRegion.push("臺北市");
  if (checkedRegion[1]) filteredRegion.push("新北市");
  if (checkedRegion[2]) filteredRegion.push("桃園市");
  if (checkedRegion[3]) filteredRegion.push("臺中市");
  if (checkedRegion[4]) filteredRegion.push("臺南市");
  if (checkedRegion[5]) filteredRegion.push("高雄市");
  if (checkedRegion[6]) filteredRegion.push("其他縣市");

  let filteredGov = [];
  if (checkedGov[0]) filteredGov.push("地方");
  if (checkedGov[1]) filteredGov.push("中央");

  const filteredProgress = ["既有", "新完工", "興建中", "已決標待開工", "規劃中"].filter(
    (_, index) => checkedProgress[index] === 1
  );

  // data = adjUniversiade2017(data, universiade2017 === 1);
  data = adjustLegacy(data, checkAdjustLegacy === 1);

  return diagramProcessedData(
    category,
    ymRange,
    data,
    filteredProgress,
    filteredRegion,
    filteredGov
  );
};

const diagramProcessedData = (
  category,
  ymRange,
  data,
  filteredProgress,
  filteredRegion,
  filteredGov
) => {
  let result = [];

  let itemKey;
  if (category === "p") {
    itemKey = "c";
  } else if (category === "s") {
    itemKey = "r";
  } else if (category === "g") {
    itemKey = "g";
  } else {
    itemKey = "t";
  }

  for (let ym of ymRange.values()) {
    const rows = data.filter(item => item.t === ym);

    let categorySet;
    if (itemKey === "t") {
      categorySet = new Set(["t"]);
    } else {
      categorySet = new Set(rows.map(item => item[itemKey]));
    }
    const tmp = { t: ym };

    for (const cat of categorySet.values()) {
      let { kk, vv } =
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
      let { a, ...rest } = item;
      return { ...rest, 合計: a };
    });
  }

  return result;
}