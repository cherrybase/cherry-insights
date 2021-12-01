import React from "react";

const TypicalPopup = ({ data = {}, onClickYes, onClickNo }) => (
    <div className="typical-popup">
        <h5 style={{ textAlign: "center" }}>
            <strong>INFO</strong>
        </h5>
        <p style={{ textAlign: "center", whiteSpace: "pre-wrap" }}>{data.text}</p>
        {!data.noButtons ? (
            <div style={{ margin: "0 auto", width: 175, textAlign: "center" }}>
                <div>
                    <button className="btn btn-success marginr10" onClick={onClickYes}>
                        {data.yesBtnText ? data.yesBtnText : "Yes"}
                    </button>
                    <button className="btn btn-success" onClick={onClickNo}>
                        {data.noBtnText ? data.noBtnText : "No"}
                    </button>
                </div>
            </div>
        ) : (
            <div style={{ margin: "0 auto", width: 50 }}>
                <button className="btn btn-success" onClick={onClickNo}>
                    Ok
                </button>
            </div>
        )}
    </div>
);

export default TypicalPopup;
