import React, {useState} from "react";
import "./result.css";


const ResultBox = ({value, img}) =>{
    return (
        <div className="result-box">
            <h2>Predicted Precipitation is</h2>
            <img src={img} alt="precipitation"/>
            <h3>{value}</h3>
        </div>
    )
}


export default ResultBox;

