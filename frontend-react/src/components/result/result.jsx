import React, {useState} from "react";
import CloseIcon from "../icons/close-icon.png";
import PrecIcon from "../icons/prec-icon.png";
import "./result.css";
import Button from "../button";


const ResultBox = ({value, onClose}) =>{
    return (
        <div className="result-box">
            <img 
            src={CloseIcon}
            alt="Close"
            className="close-icon"
            onClick={onClose}
            />
            <div className="result-content">
                <h2 className="result-title">Predicted Precipitation is</h2>
                <img className="prec-icon" src={PrecIcon} alt="precipitation"/>
                <h3 className="result-value">{value}</h3>
                <Button text="Go back" handleClickButton={onClose} />
            </div>
        </div>
    )
}


export default ResultBox;

