import { BrowserRouter, Route, Routes } from "react-router-dom";

import Nav from "./components/Nav";
import Container from "react-bootstrap/Container";
import SocialHousing from "./components/SocialHousing/SocialHousing";
import HousingDescription from "./components/SocialHousing/Descriptions";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
