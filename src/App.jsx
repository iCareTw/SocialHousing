import { HashRouter, Route, Routes } from "react-router-dom";

import Nav from "./components/Nav";
import Container from "react-bootstrap/Container";
import SocialHousing from "./components/SocialHousing/SocialHousing";
import HousingDescription from "./components/SocialHousing/Descriptions";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Container>
          <Nav />
          <Routes>
            <Route>
              <Route index element={<SocialHousing />} />
              <Route path="description" element={<HousingDescription />} />
            </Route>
          </Routes>
        </Container>
      </div>
    </HashRouter>
  );
}

export default App;
