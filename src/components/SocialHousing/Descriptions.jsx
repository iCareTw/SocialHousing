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
    const em = ym.slice(0, 4) - 1911 + ym.slice(4, 6);
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
        <Badge bg="primary">公開資料來源</Badge>
      </h2>
      <ListGroup>
        <ListGroup.Item>
          106 年的資料來源來自 <code>nlma.gov.tw</code>, 為內政部國土管理署
        </ListGroup.Item>
        <ListGroup.Item>
          107 年以後的資料來自於 <code>pip.moi.gov.tw</code>, 為內政部不動產資訊平台
        </ListGroup.Item>
      </ListGroup>
      <h2>
        <Badge bg="danger">異動說明</Badge>
      </h2>
      <ListGroup>
        <ListGroup.Item>
          202003(10903)起, 拆分出了 <code>已決標待開工</code>
        </ListGroup.Item>
        <ListGroup.Item>202004(10904)起, 開始區分 中央/地方</ListGroup.Item>
        <ListGroup.Item>
          202008(10908), Missing Data. 其前後一個月的資料筆數分別為 166 及 128 筆, 但總量並無顯著差異
        </ListGroup.Item>
        <ListGroup.Item>
          202012(10912)起, 不揭露 <code>規劃中</code>
        </ListGroup.Item>
        <ListGroup.Item>
          202303(11203)起, 改以摘要表格方式揭露(不揭露個案), 並開始揭露 <code>既有</code> 及{" "}
          <code>規劃中</code>
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
