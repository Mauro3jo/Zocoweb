import { useContext } from "react";
import "./Footer.css";
import { DarkModeContext } from "../context/DarkModeContext";

const Footer = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <footer
      className={
        darkMode
          ? " bg-footer-dark container centrado py-3"
          : "bg-footer container centrado py-3"
      }
    >
      <div>
        <div className="lato-regular fs-14 text-center">
          Copyright © Zoco 2024 <br />
          <span
            className={
              darkMode
                ? " text-center lato-regular fs-12 text-white"
                : " text-center lato-regular fs-12 text-black-50"
            }
          >
            Versión 1.4.5
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
