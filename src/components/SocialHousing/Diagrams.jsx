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
import React from "react";

export const Diagrams = ({ data, barColor, maxY, autoMax }) => {
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
                angle={-30}
                tickFormatter={tick => {
                  return tick.toLocaleString();
                }}
                scale="linear"
                min={1000}
                domain={[
                  0,
                  dataMax => {
                    if (autoMax) return Math.ceil(dataMax / 2000) * 2000;
                    return maxY;
                  }
                ]}
              />
              <Tooltip formatter={value => value && value.toLocaleString()} />
              <Legend height={18} />
              {barColor.map(barInfo =>
                <Bar
                  key={barInfo.name} // 用來消除 warning
                  dataKey={barInfo.name}
                  stackId="a"
                  tick={{ angle: 45 }}
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
