# 改用 Vite 與 TypeScript，並以固定清單檢查官方分類

轉成 TypeScript 時，我們同時把建置工具從 Create React App 換成 Vite，測試改用 Vitest。CRA 已停止維護，內建的 TypeScript 只到 4.x；只轉語言而留在 CRA，之後仍得再搬一次。網站對使用者沒有差異。

型別採 `strict`，不允許 `any`。進度、地區、中央/地方三種分類定為固定清單，並以測試檢查 `data.json` 每一列都在清單內。官方新增或改名分類時 CI 會失敗，提醒同步更新說明頁、`Calculator` 的分期修正與勾選清單（見 ADR 0001 的維護方式）。

這次重構不改變畫面與計算結果；驗收標準是同一份資料畫出相同的圖表。
