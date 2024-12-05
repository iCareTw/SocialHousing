import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { dataSources } from "./dataSources";

import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";

const HousingDescriptions = () => {
  const localPdf = (ym, source) => {
    if (source === "-" || source === "") {
      return "-";
    } else {
      const em = ym.slice(0, 4) - 1911 + ym.slice(4, 6);
      return (
        <a
          href={
            "https://github.com/iCareTw/housing/blob/main/data/pdf_SocialHousing/" +
            em +
            ".pdf"
          }
          target="_blank"
          rel="noreferrer"
        >
          {em}.pdf
        </a>
      );
    }
  };

  const sourcePdf = (ym, originUrl) => {
    if (originUrl === "-" || originUrl === "") {
      return "-";
    } else {
      return (
        <a href={`${originUrl}`} target="_blank" rel="noreferrer">
          {originUrl.split("/").pop()}
        </a>
      );
    }
  };

  return (
    <Container>
      <h2>
        <Badge bg="primary">資料說明</Badge>
      </h2>
      <ListGroup>
        <ListGroup.Item>
          2017(106) 資料來源為 <code>nlma.gov.tw</code> - 內政部國土管理署
        </ListGroup.Item>
        <ListGroup.Item>
          2018(107)起, 資料來源為 <code>pip.moi.gov.tw</code> - 內政部不動產資訊平台
        </ListGroup.Item>
        <ListGroup.Item>201809(10709)起, 開時每月公告社會住宅興辦進度</ListGroup.Item>
        <ListGroup.Item>
          202003(10903)起, 拆分出了 <code>已決標待開工</code>
        </ListGroup.Item>
        <ListGroup.Item>202004(10904)起, 開始區分 中央/地方</ListGroup.Item>
        <ListGroup.Item>
          202008(10908), Missing Data. 其前後一個月的資料筆數分別為 166 及 128 筆, 但總量並無顯著差異
        </ListGroup.Item>
        <ListGroup.Item>
          202012(10912)起, 不公告 <code>規劃中</code>
        </ListGroup.Item>
        <ListGroup.Item>
          202303(11203)起, 改以摘要表格方式公告(不公告個案), 並開始公告 <code>既有</code> 及{" "}
          <code>規劃中</code>
        </ListGroup.Item>
        <ListGroup.Item>
          202411(11311), 將六都以外的其他縣市全數揭露 
        </ListGroup.Item>
      </ListGroup>

      <h2>
        <Badge bg="info">原始資料</Badge>
      </h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>西元年</th>
            <th>自行備份保存</th>
            <th>政府公告原始檔案</th>
          </tr>
        </thead>
        <tbody>
          {dataSources.map(item =>
            <tr key={item.ym}>
              <td>
                {item.ym}
              </td>
              <td>
                {localPdf(item.ym, item.source)}
              </td>
              <td>
                {sourcePdf(item.ym, item.source)}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default HousingDescriptions;
