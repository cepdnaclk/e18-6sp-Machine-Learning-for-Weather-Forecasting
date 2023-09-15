import React from "react";
import "./numberCircle.css";

const NumberCircle = ({ number }) => {

    return (
        <div>
            <span className="number">{number}</span>
        </div>
    );

}

export default NumberCircle;