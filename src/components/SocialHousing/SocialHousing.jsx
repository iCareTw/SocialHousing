import { useState, useEffect } from "react";

import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Input from "@mui/material/Input";

import { Diagrams } from "./Diagrams";
import { aggregateData } from "./Calculator";
import realData from "./data";
import {
  subjectBarInfoList,
  progressBarInfoList,
  governmentBarInfoList,
  totalBarInfoList
} from "./colors";

// 排除惱人的 warning 警告訊息:
// Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.
// https://github.com/recharts/recharts/issues/3615
console.error = () => {
  return;
};

const SocialHousing = () => {
  const [category, setCategory] = useState("a"); // 總計a, 中央地方g, 主體s , 進度p
  const [checkedProgress, setCheckedProgress] = useState([1, 1, 1, 1, 1]); // [既有 , 新完工 , 興建中 ,  待開工 , 規劃中]
  const [checkedRegion, setCheckedRegion] = useState([1, 1, 1, 1, 1, 1, 1]); // [臺北市, 新北市, 桃園市, 臺中市, 臺南市, 高雄市, 其他縣市]
  const [checkedGov, setCheckedGov] = useState([1, 1]); // [地方, 中央]
  const [disableLocalCentral, setDisableLocalCentral] = useState(false);

  const [checkTpe2017, setCheckTpe2017] = useState(0);          // 選取 特殊調整 世大運
  const [triggerTpe2017, setTriggerTpe2017] = useState(false);  // 是否由世大運調整觸發

  const [checkLegacyBuilt, setCheckLegacyBuilt] = useState(0);          // 選取 特殊調整 既有
  const [triggerLegacyBuilt, setTriggerLegacyBuilt] = useState(false);  // 是否為民國早期建造之社宅

  const [rawData, setRawData] = useState([]);
  const [diagramData, setDiagramData] = useState([]);
  const [barColor, setBarColor] = useState([]);

  const [autoMax, setAutoMax] = useState(false);
  const [maxY, setMaxY] = useState(200000);

  const updateChecked = (originalList, idx) => {
    return originalList.map(
      (value, index) => (index === idx ? (value === 1 ? 0 : 1) : value)
    );
  };

  // 首次進入頁面, 一次式撈資料
  useEffect(
    () => {
      setRawData(realData);
      if (category === "p") {
        setBarColor(progressBarInfoList); // 每根 Bar 區分為 完工類別
      } else if (category === "s") {
        setBarColor(subjectBarInfoList); // 每根 Bar 區分為 興辦主體
      } else if (category === "g") {
        setBarColor(governmentBarInfoList); // 每根 Bar 區分為 中央地方
      } else if (category === "a") {
        setBarColor(totalBarInfoList); // 每根 Bar 為總計
      }

      let trigger2017 = false;
      if (triggerTpe2017) {
        trigger2017 = true;
        setTriggerTpe2017(false);
      }

      let triggerLegacy = false;
      if (triggerLegacyBuilt) {
        triggerLegacy = true;
        setTriggerLegacyBuilt(false);
      }

      const d1 = aggregateData(
        rawData.sort((a, b) => parseInt(a.t) - parseInt(b.t)),
        category,
        checkedProgress,
        checkedRegion,
        checkedGov,
        checkTpe2017,
        trigger2017,
        checkLegacyBuilt,
        triggerLegacy
      );
      setDiagramData(d1);
    },
    [rawData, category, checkedProgress, checkedRegion, checkedGov, checkTpe2017, checkLegacyBuilt]
  );

  const uiOperation = e => {
    setCategory(e.target.value);

    if (e.target.value === "g") {
      setDisableLocalCentral(true);
      setCheckedGov([1, 1]);
    } else {
      setDisableLocalCentral(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={2}>
          <Row>
            <select
              id="byCategory"
              className="form-select"
              name="byCategory"
              defaultValue={category}
              onChange={e => uiOperation(e)}
              size="4"
            >
              <option value="a">總計</option>
              <option value="g">依政府層級</option>
              <option value="s">依興辦主體</option>
              <option value="p">依進度別</option>
            </select>
          </Row>
          <Row>
            <FormLabel component="legend">進度別</FormLabel>
            <FormGroup>
              {progressBarInfoList.map(progress =>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedProgress.at(progress.id)}
                      onChange={e =>
                        setCheckedProgress(
                          updateChecked(checkedProgress, progress.id)
                        )}
                      name={String(progress.id)}
                    />
                  }
                  label={progress.name}
                />
              )}
            </FormGroup>
          </Row>
          <Row>
            <FormLabel component="legend">區域別</FormLabel>
            <FormGroup>
              {subjectBarInfoList
                .slice(0, 7)
                .map(region =>
                  <FormControlLabel
                    key={region.id}
                    control={
                      <Checkbox
                        checked={checkedRegion.at(region.id)}
                        onChange={e =>
                          setCheckedRegion(
                            updateChecked(checkedRegion, region.id)
                          )}
                        name={String(region.id)}
                      />
                    }
                    label={region.name}
                  />
                )}
            </FormGroup>
          </Row>
        </Col>
        <Col xs={8}>
          <Row>
            <Diagrams
              category={category}
              selectedProgress={checkedProgress}
              data={diagramData}
              barColor={barColor}
              maxY={maxY}
              autoMax={autoMax}
            />
          </Row>
        </Col>
        <Col xs={2}>
          <Row>
            <FormLabel component="legend">興辦主體</FormLabel>
            <FormGroup>
              {governmentBarInfoList.map(gov =>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedGov.at(gov.id)}
                      onChange={e =>
                        setCheckedGov(updateChecked(checkedGov, gov.id))}
                      disabled={disableLocalCentral}
                      name={String(gov.id)}
                    />
                  }
                  label={gov.name}
                />
              )}
            </FormGroup>
          </Row>
          <Row>
            <FormLabel component="legend">特殊調整</FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkTpe2017}
                  onChange={e => {
                    setCheckTpe2017(checkTpe2017 === 1 ? 0 : 1);
                    setTriggerTpe2017(true);
                  }}
                  name="世大運社宅調整"
                />
              }
              label="世大運社宅調整"
            />
          </Row>
          <Row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkLegacyBuilt}
                  onChange={e => {
                    setCheckLegacyBuilt(checkLegacyBuilt === 1 ? 0 : 1);  // UI 勾選與否刷新
                    setTriggerLegacyBuilt(() => {
                      if (checkLegacyBuilt === false) {
                        return false
                      } else {
                        return true
                      }
                    });
                  }}
                />
              }
              label="既有社宅調整"
            />
          </Row>
          <Row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={autoMax}
                  onChange={e => setAutoMax(!autoMax)}
                  name="3"
                />
              }
              label="自動化最大Y軸"
            />
            <Input
              type="number"
              color="primary"
              inputProps={{
                maxLength: 5,
                step: "2000",
                min: "2000",
                max: "200000"
              }}
              hidden={autoMax}
              defaultValue={maxY}
              onChange={e => setMaxY(e.target.value)}
            />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SocialHousing;
