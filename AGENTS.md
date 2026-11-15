# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案

台灣社會住宅興辦進度的視覺化網站 (React, Create React App)。發布在 GitHub Pages：https://icaretw.github.io/SocialHousing/
資料來源是內政部不動產資訊平台 (`pip.moi.gov.tw`) 每月公告的「社會住宅興辦案件執行情形彙整表」PDF。

## 指令

- `yarn start`：本機開發
- `yarn build`：正式 build。CI (`.github/workflows/gh-page.yaml`) 在 push 到 `main` 時會 build 並部署到 gh-pages
- `yarn lint`：eslint，含禁止串接比較 (`a <= b <= c`) 的規則
- `CI=true yarn test --watchAll=false`：跑測試。`Calculator.test.js` 涵蓋既有社宅調整的每個期間邊界，新增邊界時要補對應案例
- CI 依序跑 lint → test → build

## 架構

全部程式都在 `src/components/SocialHousing/`，用 HashRouter 分成兩頁：首頁 `/` 是圖表，`/description` 是資料說明。

- `data.json`：所有資料，是扁平陣列，每列 `{t: "YYYYMM", r: 地區, g: "地方"|"中央", c: 進度, v: 戶數}`
  - 檔案很大 (8000+ 列)，**不要整份讀**，用 `jq` 查特定月份
  - 每月由 user 手動擷取官方揭露資料，在 Google Sheet 整理後轉成 json 附加進來
- `Calculator.jsx`：`aggregateData` 會先做兩個可選的資料修正，再依「合計 / 中央地方 / 地區 / 進度」分組：
  - `adjUniversiade2017`：把林口世大運社宅從新北市改算到臺北市
  - `adjustLegacy`：補上「既有」社宅的戶數。官方在不同期間的揭露方式不同，所以按年月分段處理，部分期間用寫死的數字補
- `SocialHousing.jsx`：畫面狀態與勾選框。勾選陣列的順序要和 `colors.jsx` 裡的分類清單、`Calculator.jsx` 裡的 `filteredProgress` 對齊
- `Descriptions.jsx`：資料說明頁，記錄歷次官方格式異動。表格內容來自 `dataSources.jsx`

## 每月資料更新 (`impl: YYYYMM` commit)

一次更新會一起改這些檔案：
- `data/pdf_SocialHousing/<民國年月>.pdf`：PDF 本地備份，例如 202610 → `11510.pdf`
- `data/README.md` 與 `dataSources.jsx`：在最上方加一列官方 PDF 網址
- `data.json`
- `README.md`：「最近一次資料更新」時間

`latest` (最新資料年月) 另外用 `chore: 最新資料年月` 提交。

官方 PDF 格式常常改，例如進度分類合併或拆分、既有社宅改併入或拆出新完工。遇到格式異動時：
- 在 `Descriptions.jsx` 補一條說明
- 檢查 `Calculator.jsx` 的分段修正需不需要加新的年月邊界

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
