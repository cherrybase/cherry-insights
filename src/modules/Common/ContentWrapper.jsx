import React from "react";
import { Container } from "reactstrap";

const ContentWrapper = (props) => {
    return (
        <>
            {/* content header */}
            <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                <Container fluid>
                    <div className="header-body">
                        {props.contentHeader}
                    </div>
                </Container>
            </div>
            {/* content body */}
            <Container className="mt--7" fluid style={{ minHeight: "519px" }}>
                {props.children}
            </Container>
        </>
    );
};

export default ContentWrapper;
