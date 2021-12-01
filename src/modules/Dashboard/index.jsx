import React, { useRef } from "react";
import { useEffect } from "react";
import { Button, Card, CardHeader, CardTitle, CardBody, NavItem, NavLink, Nav, Table, Row, Col } from "reactstrap";
import ContentWrapper from "@modules/Common/ContentWrapper";

import { Chart } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin);

// import ChartExample from "@modules/Charts";
import UserBase from "@modules/Charts/UserBase";
import ActiveUsers from "@modules/Charts/ActiveUsers";
import CrashAnalysis from "@modules/Charts/CrashAnalysis";
import TrafficAnalysis from "@modules/Charts/TrafficAnalysis";
import UserJourney from "@modules/Charts/UserJourney";

const scrollToRef = ref => ref.current.scrollIntoView({ behavior: "smooth" });

const Dashboard = props => {
    const cardStats1 = useRef();

    useEffect(async () => {
        console.log("Dashboard Mount :: ");

        return () => {
            console.log("Dashboard unMount :: ");
        };
    }, []);

    return (
        <ContentWrapper
            contentHeader={
                <Row>
                    <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0 cursor-pointer" onClick={() => scrollToRef(cardStats1)}>
                            <CardBody>
                                <Row>
                                    <div className="col">
                                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                                            Traffic
                                        </CardTitle>
                                        <span className="h2 font-weight-bold mb-0">350,897</span>
                                    </div>
                                    <Col className="col-auto">
                                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                            <i className="fas fa-chart-bar" />
                                        </div>
                                    </Col>
                                </Row>
                                <p className="mt-3 mb-0 text-muted text-sm">
                                    <span className="text-success mr-2">
                                        <i className="fa fa-arrow-up" /> 3.48%
                                    </span>{" "}
                                    <span className="text-nowrap">Since last month</span>
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                            <CardBody>
                                <Row>
                                    <div className="col">
                                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                                            New users
                                        </CardTitle>
                                        <span className="h2 font-weight-bold mb-0">2,356</span>
                                    </div>
                                    <Col className="col-auto">
                                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                            <i className="fas fa-chart-pie" />
                                        </div>
                                    </Col>
                                </Row>
                                <p className="mt-3 mb-0 text-muted text-sm">
                                    <span className="text-danger mr-2">
                                        <i className="fas fa-arrow-down" /> 3.48%
                                    </span>{" "}
                                    <span className="text-nowrap">Since last week</span>
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                            <CardBody>
                                <Row>
                                    <div className="col">
                                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                                            Sales
                                        </CardTitle>
                                        <span className="h2 font-weight-bold mb-0">924</span>
                                    </div>
                                    <Col className="col-auto">
                                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                            <i className="fas fa-users" />
                                        </div>
                                    </Col>
                                </Row>
                                <p className="mt-3 mb-0 text-muted text-sm">
                                    <span className="text-warning mr-2">
                                        <i className="fas fa-arrow-down" /> 1.10%
                                    </span>{" "}
                                    <span className="text-nowrap">Since yesterday</span>
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                            <CardBody>
                                <Row>
                                    <div className="col">
                                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                                            Performance
                                        </CardTitle>
                                        <span className="h2 font-weight-bold mb-0">49,65%</span>
                                    </div>
                                    <Col className="col-auto">
                                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                                            <i className="fas fa-percent" />
                                        </div>
                                    </Col>
                                </Row>
                                <p className="mt-3 mb-0 text-muted text-sm">
                                    <span className="text-success mr-2">
                                        <i className="fas fa-arrow-up" /> 12%
                                    </span>{" "}
                                    <span className="text-nowrap">Since last month</span>
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            }
        >
            <Row>
                <Col className="mb-5 mb-xl-0" xl="12">
                    <Card className="shadow">
                        <CardHeader className="bg-transparent">
                            <Row className="align-items-center">
                                <div className="col">
                                    <h6 className="text-uppercase text-light ls-1 mb-1">Stacked Line</h6>
                                    <h2 className="mb-0">App User Base</h2>
                                </div>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <UserBase />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col className="mb-5 mb-xl-0" xl="12">
                    <Card className="shadow">
                        <CardHeader className="bg-transparent">
                            <Row className="align-items-center">
                                <div className="col">
                                    <h6 className="text-uppercase text-light ls-1 mb-1">Stacked Bar</h6>
                                    <h2 className="mb-0">Active Users</h2>
                                </div>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <ActiveUsers />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col className="mb-5 mb-xl-0" xl="12">
                    <Card className="shadow">
                        <CardHeader className="bg-transparent">
                            <Row className="align-items-center">
                                <div className="col">
                                    <h6 className="text-uppercase text-light ls-1 mb-1">Pie</h6>
                                    <h2 className="mb-0">Traffic Analysis</h2>
                                </div>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <TrafficAnalysis />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col className="mb-5 mb-xl-0" xl="12">
                    <Card className="shadow" innerRef={cardStats1}>
                        <CardHeader className="bg-transparent">
                            <Row className="align-items-center">
                                <div className="col">
                                    <h6 className="text-uppercase text-light ls-1 mb-1">Table</h6>
                                    <h3 className="mb-0">User Journey</h3>
                                </div>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <UserJourney />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col className="mb-5 mb-xl-0" xl="12">
                    <Card className="shadow">
                        <CardHeader className="bg-transparent">
                            <Row className="align-items-center">
                                <div className="col">
                                    <h6 className="text-uppercase text-light ls-1 mb-1">Stacked Bar</h6>
                                    <h2 className="mb-0">Crash Analysis</h2>
                                </div>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <CrashAnalysis />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {/* <Row className="mt-5">
                <Col className="mb-5 mb-xl-0" xl="12">
                    <Card className="shadow">
                        <CardHeader className="bg-transparent">
                            <Row className="align-items-center">
                                <div className="col">
                                    <h6 className="text-uppercase text-light ls-1 mb-1">Example Line + zoom & pan</h6>
                                    <h2 className="mb-0">Sales value</h2>
                                </div>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <ChartExample />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col className="mb-5 mb-xl-0" xl="12">
                    <Card className="shadow">
                        <CardHeader className="border-0">
                            <Row className="align-items-center">
                                <div className="col">
                                    <h3 className="mb-0">Page visits</h3>
                                </div>
                                <div className="col text-right">
                                    <Button color="primary" href="#pablo" onClick={e => e.preventDefault()} size="sm">
                                        See all
                                    </Button>
                                </div>
                            </Row>
                        </CardHeader>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Page name</th>
                                    <th scope="col">Visitors</th>
                                    <th scope="col">Unique users</th>
                                    <th scope="col">Bounce rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">/argon/</th>
                                    <td>4,569</td>
                                    <td>340</td>
                                    <td>
                                        <i className="fas fa-arrow-up text-success mr-3" /> 46,53%
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">/argon/index.html</th>
                                    <td>3,985</td>
                                    <td>319</td>
                                    <td>
                                        <i className="fas fa-arrow-down text-warning mr-3" /> 46,53%
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">/argon/charts.html</th>
                                    <td>3,513</td>
                                    <td>294</td>
                                    <td>
                                        <i className="fas fa-arrow-down text-warning mr-3" /> 36,49%
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">/argon/tables.html</th>
                                    <td>2,050</td>
                                    <td>147</td>
                                    <td>
                                        <i className="fas fa-arrow-up text-success mr-3" /> 50,87%
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">/argon/profile.html</th>
                                    <td>1,795</td>
                                    <td>190</td>
                                    <td>
                                        <i className="fas fa-arrow-down text-danger mr-3" /> 46,53%
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row> */}
        </ContentWrapper>
    );
};

export default Dashboard;
