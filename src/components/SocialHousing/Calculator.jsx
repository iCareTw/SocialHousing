const monthlyTotalCalculate = data => {
  // 回傳像是年度 v 的加總, example:
  // {'201703': 100, '201704': 200}
  return data.reduce((acc, item) => {
    if (acc[item.t]) {
      acc[item.t] += item.v;
    } else {
      acc[item.t] = item.v;
    }
    return acc;
  }, {});
};


const adjustTpe2017 = (data, chk) => {
  // 此為特殊處理, 因林口世大運社會住宅屬於 內政部委託台北市政府興建
  // https://pip.moi.gov.tw/V3/F/SCRF0401.aspx
  // https://pip.moi.gov.tw/Upload/File/SocialHousing/社會住宅興辦計畫彙整表之執行進度-1070321(上網用).pdf
  // 20180831 完工
  // 201809 以前, 揭露資訊為 3408 戶 (當時列為新北市政府)
  // 201810 以後, 揭露資訊減少為 2907 戶 (當時列為新北市政府) (原因不明)
  // 202004 以後, 開始區分地方及中央, 完工歸屬到 新北市 中央

  let chkAdj = chk === 1 ? 1 : -1;
  const monthlyTotal = monthlyTotalCalculate(data);

  for (let item of data) {
    if (monthlyTotal[item["t"]] === 0) continue; // 缺資料月份不處理

    if (item["c"] === "興建中" && parseInt(item["t"]) < 201809) {
      if (item["r"] === "臺北市" && item["g"] === "地方") {
        item["v"] += 3408 * chkAdj;
      } else if (item["r"] === "新北市" && item["g"] === "地方") {
        item["v"] -= 3408 * chkAdj;
      }
    } else if (item["c"] === "新完工" && 201809 <= parseInt(item["t"]) && parseInt(item["t"]) < 202004) {
      if (item["r"] === "臺北市" && item["g"] === "地方") {
        item["v"] += 2907 * chkAdj;
      } else if (item["r"] === "新北市" && item["g"] === "地方") {
        item["v"] -= 2907 * chkAdj;
      }
    } else if (item["c"] === "新完工" && parseInt(item["t"]) >= 202004) {
      if (item["r"] === "臺北市" && item["g"] === "地方") {
        item["v"] += 2907 * chkAdj;
      } else if (item["r"] === "新北市" && item["g"] === "中央") {
        item["v"] -= 2907 * chkAdj;
      }
    // 其他無關資料, 不處理
    }
  }
  return data;
};


export const aggregateData = (
  data,
  category,
  checkedProgress,
  checkedRegion,
  checkedGov,
  checkTpe2017,
  trigger2017
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
    (status, index) => checkedProgress[index] === 1
  );

  if (trigger2017) {  // 世大運社會住宅調整
    data = adjustTpe2017([...data], checkTpe2017);
  }

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
      categorySet = new Set("t");
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