export const aggregateData = (
  data,
  category,
  checkedProgress,
  checkedRegion,
  checkedGov
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

  function processData(
    category,
    ymRange,
    data,
    filteredProgress,
    filteredRegion,
    filteredGov
  ) {
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

  return processData(
    category,
    ymRange,
    data,
    filteredProgress,
    filteredRegion,
    filteredGov
  );
};
