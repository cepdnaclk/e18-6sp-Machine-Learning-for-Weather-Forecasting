import React, { useState } from "react";
import "./dropDown.css";

const DropDown = ({ options, onSelect }) => {

    return(
        <div className="select-container">
        <select onChange={ (e) => onSelect(e.target.value)}>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        </div>
        
    );
}

export default DropDown;