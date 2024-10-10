import srcCode from "./img/github-logo.png";

const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/#">
        CareTw
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a className="nav-link disabled" href="/">
              社會住宅
            </a>
          </li>
        </ul>
      </div>

      <ul className="navbar-nav mr-auto my-2 my-sm-0">
        <li className="nav-item active">
          <a
            className="nav-link"
            href="https://github.com/iCareTw/housing"
            target="_blank"
          >
            Source Code <img src={srcCode} class="img-fluid" alt="原始碼" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;

/* <span className="navbar-brand mb-0 h1">
        <Col xs={10}></Col>
        <Col xs={1}>
          <select
            name="buildSubject"
            id="buildSubject"
            size="3"
            // onChange={(e) => {
            //   setGov(e.target.value);
            // }}
            // defaultValue={gov}
          >
            <option value="0">地方</option>
            <option value="1">中央+地方</option>
            <option value="2">中央</option>
          </select>
        </Col>
        <Col xs={1}>
          <select
            name="cumulativeProgress"
            id="cumulativeProgress"
            size="2"
            // onChange={(e) => {
            //   setIsCumulative(e.target.value);
            // }}
            // defaultValue={isCumulative}
          >
            <option value="0">個別</option>
            <option value="1">累計</option>
          </select>
        </Col>
        </span> */
