import Nav from "./components/Nav";
import Container from "react-bootstrap/Container";

import SocialHousing from "./components/SocialHousing/SocialHousing";

function App() {
  return (
    <div className="App">
      <Container>
        <Nav />
        <SocialHousing />
      </Container>
    </div>
  );
}

export default App;
