import React from "react";
import { Link } from "react-router-dom";

import FourOhThreeImg from "../../resources/images/403.png";

const FourOhThree = props => (
    <div className="access-denied-container">
        <img src={FourOhThreeImg} alt="403" />
        <div className="access-denied-text">
            <h3>Access Denied / Forbidden</h3>
            <p>Access denied. Please select the appropriate menu.</p>
            <Link to="/">
                <i className="fa fa-long-arrow-left" /> Back to Dashboard
            </Link>
        </div>
    </div>
);

export default FourOhThree;
