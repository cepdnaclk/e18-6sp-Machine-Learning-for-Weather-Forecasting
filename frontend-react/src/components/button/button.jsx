import React from "react";
import "./button.css";

const Button = ({text, img = "", handleClickButton}) => {

    return (
        <button onClick={handleClickButton}>
            <span className="button-text">{text}</span>
            {img && <img src={img} alt="Button icon" />}
        </button>
    );
}

export default Button;