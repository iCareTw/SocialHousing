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
    const grpKey = category === "p" ? "c" : "r"; // p -> c ; s -> r

    for (const ym of ymRange.values()) {
      const rows = data.filter(item => item.t === ym);
      const categorySet = new Set(rows.map(item => item[grpKey]));
      const tmp = { t: ym };

      for (const grp of categorySet.values()) {
        tmp[grp] = rows
          .filter(item => item[grpKey] === grp)
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
