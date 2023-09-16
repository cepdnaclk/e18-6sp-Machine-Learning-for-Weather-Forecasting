import React, {useState} from "react";
import CloseIcon from "../icons/close-icon.png";
import "./success.css";


const SuccessBox = ({successMessage, onClose}) =>{
    return (
        <div className="success-box">
            <img 
            src={CloseIcon}
            alt="Close"
            className="close-icon"
            onClick={onClose}
            />
            <div className="success-content">
                <p className="success-message">{successMessage}</p>
            </div>
        </div>
    )
}


export default SuccessBox;

