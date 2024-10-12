import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import { useEffect } from "react";
import { useState } from "react";

import { Diagrams } from "./Diagrams";
import { aggregateData } from "./Calculator";
import realData from "./data";
import { subjectBarInfoList, progressBarInfoList } from "./colors";

// 排除惱人的 warning 警告訊息:
// Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.
// https://github.com/recharts/recharts/issues/3615
console.error = () => {
  return;
};

const SocialHousing = () => {
  const [category, setCategory] = useState("p"); // 主體s , 進度p
  const [checkedProgress, setCheckedProgress] = useState([0, 1, 1, 1, 0]); // [既有 , 新完工 , 興建中 ,  待開工 , 規劃中]
  const [checkedGov, setCheckedGov] = useState([1, 1, 1, 1, 1, 1, 1, 0]); // [臺北市, 新北市, 桃園市, 臺中市, 臺南市, 高雄市, 其他縣市, 中央]

  const [rawData, setRawData] = useState([]);
  const [diagramData, setDiagramData] = useState([]);
  const [barColor, setBarColor] = useState([]);

  const [autoMax, setAutoMax] = useState(true);
  const [maxY, setMaxY] = useState(120000);

  const updateCheckedProgress = (originalList, idx) => {
    return originalList.map(
      (value, index) => (index === idx ? (value === 1 ? 0 : 1) : value)
    );
  };

  const updateSelectedGov = (originalList, idx) => {
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
      } else {
        setBarColor(subjectBarInfoList); // 每根 Bar 區分為 興辦主體
      }
      const d1 = aggregateData(
        rawData.sort((a, b) => parseInt(a.t) - parseInt(b.t)),
        category,
        checkedProgress,
        checkedGov
      );
      setDiagramData(d1);
    },
    [rawData, category, checkedProgress, checkedGov]
  );

  return (
    <Row>
      <Col xs={2}>
        <Row>
          <select
            id="byCategory"
            className="form-select"
            name="byCategory"
            defaultValue={category}
            onChange={e => setCategory(e.target.value)}
            size="2"
          >
            <option value="p">依進度別</option>
            <option value="s">依興辦主體</option>
          </select>
        </Row>
        <Row>
          <FormLabel component="legend">進度別</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedProgress.at(0)}
                  onChange={e =>
                    setCheckedProgress(
                      updateCheckedProgress(checkedProgress, 0)
                    )}
                  name="0"
                />
              }
              label="既有"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedProgress.at(4)}
                  onChange={e =>
                    setCheckedProgress(
                      updateCheckedProgress(checkedProgress, 4)
                    )}
                  name="4"
                />
              }
              label="規劃中"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedProgress.at(3)}
                  onChange={e =>
                    setCheckedProgress(
                      updateCheckedProgress(checkedProgress, 3)
                    )}
                  name="3"
                />
              }
              label="已決標待開工"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedProgress.at(2)}
                  onChange={e =>
                    setCheckedProgress(
                      updateCheckedProgress(checkedProgress, 2)
                    )}
                  name="2"
                />
              }
              label="興建中"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedProgress.at(1)}
                  onChange={e =>
                    setCheckedProgress(
                      updateCheckedProgress(checkedProgress, 1)
                    )}
                  name="1"
                />
              }
              label="新完工"
            />
          </FormGroup>
        </Row>
        <Row>
          <FormLabel component="legend">興辦主體</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedGov.at(0)}
                  onChange={e =>
                    setCheckedGov(updateSelectedGov(checkedGov, 0))}
                  name="0"
                />
              }
              label="臺北市"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedGov.at(1)}
                  onChange={e =>
                    setCheckedGov(updateSelectedGov(checkedGov, 1))}
                  name="1"
                />
              }
              label="新北市"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedGov.at(2)}
                  onChange={e =>
                    setCheckedGov(updateSelectedGov(checkedGov, 2))}
                  name="2"
                />
              }
              label="桃園市"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedGov.at(3)}
                  onChange={e =>
                    setCheckedGov(updateSelectedGov(checkedGov, 3))}
                  name="3"
                />
              }
              label="臺中市"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedGov.at(4)}
                  onChange={e =>
                    setCheckedGov(updateSelectedGov(checkedGov, 4))}
                  name="4"
                />
              }
              label="臺南市"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedGov.at(5)}
                  onChange={e =>
                    setCheckedGov(updateSelectedGov(checkedGov, 5))}
                  name="5"
                />
              }
              label="高雄市"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedGov.at(6)}
                  onChange={e =>
                    setCheckedGov(updateSelectedGov(checkedGov, 6))}
                  name="6"
                />
              }
              label="其他縣市"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedGov.at(7)}
                  onChange={e =>
                    setCheckedGov(updateSelectedGov(checkedGov, 7))}
                  name="7"
                />
              }
              label="中央"
            />
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
          <input
            className="form-control"
            type="number"
            step="1000"
            max="140000"
            min="1000"
            hidden={autoMax}
            value={maxY}
            onChange={e => setMaxY(e.target.value)}
          />
        </Row>
      </Col>
    </Row>
  );
};

export default SocialHousing;
