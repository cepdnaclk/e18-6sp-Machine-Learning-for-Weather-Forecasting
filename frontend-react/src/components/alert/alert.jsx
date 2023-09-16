import React, {useState} from "react";
import CloseIcon from "../icons/close-icon.png";
import "./alert.css";


const AlertBox = ({errorMessage, onClose}) =>{
    return (
        <div className="alert-box">
            <img 
            src={CloseIcon}
            alt="Close"
            className="close-icon"
            onClick={onClose}
            />
            <div className="alert-content">
                <p className="alert-message">{errorMessage}</p>
            </div>
        </div>
    )
}


export default AlertBox;

