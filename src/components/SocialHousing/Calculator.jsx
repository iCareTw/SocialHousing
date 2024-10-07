export const aggregateData = (data, category, checkedProgress, checkedGov) => {
  const ymRange = new Set(data.map(item => item.t));

  let filteredGov = [];
  if (checkedGov[0]) filteredGov.push("臺北市");
  if (checkedGov[1]) filteredGov.push("新北市");
  if (checkedGov[2]) filteredGov.push("桃園市");
  if (checkedGov[3]) filteredGov.push("臺中市");
  if (checkedGov[4]) filteredGov.push("臺南市");
  if (checkedGov[5]) filteredGov.push("高雄市");
  if (checkedGov[6]) filteredGov.push("其他縣市");
  if (checkedGov[7]) filteredGov.push("中央");

  const filteredProgress = ["既有", "新完工", "興建中", "已決標待開工", "規劃中"].filter(
    (status, index) => checkedProgress[index] === 1
  );

  function processData(category, ymRange, data, filteredProgress, filteredGov) {
    let result = [];
    const grpKey = category === "p" ? "c" : "g"; // p -> c ; s -> g

    for (const ym of ymRange.values()) {
      const rows = data.filter(item => item.t === ym);
      const grpSet = new Set(rows.map(item => item[grpKey]));
      const tmp = { t: ym };

      for (const grp of grpSet.values()) {
        tmp[grp] = rows
          .filter(item => item[grpKey] === grp)
          .filter(
            item =>
              filteredProgress.includes(item.c) && filteredGov.includes(item.g)
          )
          .reduce((accu, curr) => accu + curr.v, 0);
      }
      result.push(tmp);
    }
    return result;
  }

  return processData(category, ymRange, data, filteredProgress, filteredGov);
};
