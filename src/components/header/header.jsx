import React from "react";
import HeaderLogo from "../icons/header-logo.png";
import "./header.css";

const Header = () => {
    return (
        <div className="header">
            <img src={HeaderLogo} className="header-logo" />
            <h2>Weather Forecaster</h2>
        </div>
    )
}

export default Header;