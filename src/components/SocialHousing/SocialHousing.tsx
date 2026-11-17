import { useState, useEffect, type ChangeEvent } from "react";

import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Input from "@mui/material/Input";

import { Diagrams } from "./Diagrams";
import { aggregateData, type Category, type ChartPoint, type CheckedList } from "./Calculator";
import { housingRows } from "./housingRows";
import {
  subjectBarInfoList,
  progressBarInfoList,
  governmentBarInfoList,
  totalBarInfoList,
  type BarInfo
} from "./colors";

// 排除惱人的 warning 警告訊息:
// Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.
// https://github.com/recharts/recharts/issues/3615
console.error = () => {
  return;
};

const barColors: Record<Category, BarInfo[]> = {
  a: totalBarInfoList,
  g: governmentBarInfoList,
  s: subjectBarInfoList,
  p: progressBarInfoList,
};

const sortedRealData = [...housingRows].sort((a, b) => parseInt(a.t) - parseInt(b.t));

const SocialHousing = () => {
  const [category, setCategory] = useState<Category>("a"); // 總計a, 中央地方g, 主體s , 進度p
  const [checkedProgress, setCheckedProgress] = useState<CheckedList>([1, 1, 1, 1, 1]); // [既有 , 已完工 , 興建中 ,  待開工 , 規劃中]
  const [checkedRegion, setCheckedRegion] = useState<CheckedList>([1, 1, 1, 1, 1, 1, 1]); // [臺北市, 新北市, 桃園市, 臺中市, 臺南市, 高雄市, 其他縣市]
  const [checkedGov, setCheckedGov] = useState<CheckedList>([1, 1]); // [地方, 中央]
  const [disableLocalCentral, setDisableLocalCentral] = useState(false);

  // 特殊調整
  const [universiade2017, setUniversiade2017] = useState(false);
  const [legacyBuilding, setLegacyBuilding] = useState(false);

  const [diagramData, setDiagramData] = useState<ChartPoint[]>([]);

  const [autoMax, setAutoMax] = useState(false);
  const [maxY, setMaxY] = useState(200000);

  const updateChecked = (originalList: CheckedList, idx: number): CheckedList => {
    return originalList.map(
      (value, index) => (index === idx ? (value === 1 ? 0 : 1) : value)
    );
  };

  // 重新計算數據
  useEffect(() => {
    const d1 = aggregateData(
      sortedRealData,
      category,
      checkedProgress,
      checkedRegion,
      checkedGov,
      universiade2017,
      legacyBuilding,
    );
    setDiagramData(d1);
  }, [category, checkedProgress, checkedRegion, checkedGov, universiade2017, legacyBuilding]);

  const uiOperation = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Category;
    setCategory(value);

    if (value === "g") {
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
              size={4}
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
                  key={progress.id}
                  control={
                    <Checkbox
                      checked={checkedProgress.at(progress.id) === 1}
                      onChange={() =>
                        setCheckedProgress(
                          updateChecked(checkedProgress, progress.id)
                        )}
                      name={String(progress.id)}
                    />
                  }
                  label={progress.label ?? progress.name}
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
                        checked={checkedRegion.at(region.id) === 1}
                        onChange={() =>
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
              data={diagramData}
              barColor={barColors[category]}
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
                  key={gov.id}
                  control={
                    <Checkbox
                      checked={checkedGov.at(gov.id) === 1}
                      onChange={() =>
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
                  checked={universiade2017}
                  onChange={() => setUniversiade2017(v => !v)}
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
                  checked={legacyBuilding}
                  onChange={() => setLegacyBuilding(v => !v)}
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
                  onChange={() => setAutoMax(!autoMax)}
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
              onChange={e => setMaxY(Number(e.target.value))}
            />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SocialHousing;
