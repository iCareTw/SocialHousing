import Container from "react-bootstrap/Container";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ReferenceLine,
  Brush,
} from "recharts";
import type { TextProps } from "recharts";
import type { ChartPoint } from "./Calculator";
import type { BarInfo } from "./colors";

// recharts 的 tick 型別未列出 angle，但實際會傳給刻度文字 (Text) 旋轉
const Y_AXIS_TICK: TextProps = { angle: -30 };

interface DiagramsProps {
  data: ChartPoint[];
  barColor: BarInfo[];
  maxY: number;
  autoMax: boolean;
}

export const Diagrams = ({ data, barColor, maxY, autoMax }: DiagramsProps) => {
  return (
    <div>
      <Container className="container pt-3">
        <div
          style={{
            width: "100%",
            height: 600,
            paddingTop: 30,
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 10,
            borderColor: "red"
          }}
        >
          <ResponsiveContainer width="90%" height="90%">
            <BarChart data={data} barCategoryGap="2%">
              <CartesianGrid strokeDasharray="7 7" />
              <XAxis dataKey="t" />
              <YAxis
                tick={Y_AXIS_TICK}
                tickFormatter={(tick: number) => {
                  return tick.toLocaleString();
                }}
                scale="linear"
                min={1000}
                domain={[
                  0,
                  (dataMax: number) => {
                    if (autoMax) return Math.ceil(dataMax / 2000) * 2000;
                    return maxY;
                  }
                ]}
              />
              <Tooltip formatter={(value: number) => value && value.toLocaleString()} />
              <Legend height={18} />
              {barColor.map(barInfo =>
                <Bar
                  key={barInfo.name} // 用來消除 warning
                  dataKey={barInfo.name}
                  name={barInfo.label ?? barInfo.name}
                  stackId="a"
                  fill={barInfo.color}
                >
                  <LabelList dataKey="v" position="top" />
                </Bar>
              )}
              <ReferenceLine y={0} stroke="#000" />
              <Brush dataKey="ym" height={30} stroke="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Container>
    </div>
  );
};
