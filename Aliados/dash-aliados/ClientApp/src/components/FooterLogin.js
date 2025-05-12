import { useContext } from "react";
import "./Footer.css";
import { DarkModeContext } from "../context/DarkModeContext";

const FooterLogin = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <footer className="copy ">
      <div>
        <div className=" lato-regular fs-14">Copyright © Zoco 2024</div>
        <div
          className={
            darkMode
              ? " text-center lato-regular fs-12 text-white"
              : " text-center lato-regular fs-12 text-black-50"
          }
        >
          Versión 1.4.5
        </div>
      </div>
    </footer>
  );
};

export default FooterLogin;
