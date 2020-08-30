import React, { Fragment } from "react";
import { Link } from "react-router-dom";
// Design
import { Navbar, Nav } from "react-bootstrap";

const Header = ({ MusicPage, ChangeMusicPage, mode404 }) => (
  <header id="Header">
    <Nav variant="tabs">
      <Nav.Item>
        <Navbar.Brand>
          <Link to="/">
            <img src="Img/MainInSite.png" alt="Logo of Incra Music" />
          </Link>
        </Navbar.Brand>
      </Nav.Item>
      {mode404 ? null : (
        <Fragment>
          <Nav.Item>
            <Nav.Link
              active={MusicPage}
              onClick={() => (MusicPage ? null : ChangeMusicPage(true))}
            >
              <span className="fas fa-music"></span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={!MusicPage}
              onClick={() => (!MusicPage ? null : ChangeMusicPage(false))}
            >
              <span className="fas fa-file-audio"></span>
            </Nav.Link>
          </Nav.Item>
        </Fragment>
      )}

      <Nav.Item id="User">
        <Nav.Link>
          <Link to="User">
            <span className="fas fa-user-alt"></span>
          </Link>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  </header>
);

export default Header;
