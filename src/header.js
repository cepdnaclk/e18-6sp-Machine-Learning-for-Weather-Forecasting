import React from "react";
import "./header.css";
import headerLogo from "./header-logo.png";

const Header = () => {
    return (
        <div className="header">
            <img src={headerLogo} className="header-logo" />
            <h2>Weather Forecaster</h2>
        </div>
    )
}

export default Header;