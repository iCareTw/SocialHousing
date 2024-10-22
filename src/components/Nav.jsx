import srcCode from "./img/github-logo.png";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/SocialHousing" aria-disabled="true">
        社會住宅
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
            <Link className="nav-link" to="/">
              趨勢圖
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/description">
              資料簡介
            </Link>
          </li>
        </ul>
      </div>

      <ul className="navbar-nav mr-auto my-2 my-sm-0">
        <li className="nav-item active">
          <a
            className="nav-link"
            href="https://github.com/iCareTw/housing"
            target="_blank"
            rel="noreferrer"
          >
            Source Code <img src={srcCode} class="img-fluid" alt="原始碼" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
