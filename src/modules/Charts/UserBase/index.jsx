import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-moment";
import * as zoom from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import { Api } from "@services/ApiService";
import { displayFormatsMap, defaultDisplayFormat, getFilteredDisplayFormats } from "@modules/Charts/constants";

const UserBase = props => {
    const [chartData, setChartData] = useState({});
    const [displayFormat, setDisplayFormat] = useState("");
    const [timeRange, setTimeRange] = useState({ min: 0, max: 0 });
    const [timeAxisRange, setTimeAxisRange] = useState({ min: 0, max: 0 });
    const chartRef = useRef();

    useEffect(async () => {
        console.log("UserBase mount ");

        setDisplayFormat(defaultDisplayFormat);

        const displayFormatDetails = displayFormatsMap[defaultDisplayFormat];
        const displayFormatSuccessor = displayFormatsMap[displayFormatDetails.successor];
        const end = new Date().valueOf();
        const start = end - displayFormatSuccessor.ms;
        setTimeRange(prev => ({ ...prev, min: start, max: end }));
        const axisEnd = end + 1000 * 60 * 60 * 24 * 365;
        const axisStart = start - 1000 * 60 * 60 * 24 * 365;
        setTimeAxisRange(prev => ({ ...prev, min: axisStart, max: axisEnd }));

        let data = await fetchApiData(start, end);
        console.log("UserBase - Fetched data between " + new Date(start) + " and " + new Date(end), { data });
        setChartData({
            datasets: [
                {
                    label: "Active customers",
                    data: processData(data.activeCustomers),
                    parsing: {
                        xAxisKey: "date",
                        yAxisKey: "Count"
                    },
                    borderColor: "#a8ddb5",
                    backgroundColor: "#a8ddb5",
                    stack: "1"
                },
                {
                    label: "Inactive customers",
                    data: processData(data.inActiveCustomers),
                    parsing: {
                        xAxisKey: "date",
                        yAxisKey: "Count"
                    },
                    borderColor: "#fdbb84",
                    backgroundColor: "#fdbb84",
                    stack: "1"
                },
                {
                    label: "Lost customers",
                    data: processData(data.lostCustomers),
                    parsing: {
                        xAxisKey: "date",
                        yAxisKey: "Count"
                    },
                    borderColor: "#e34a33",
                    backgroundColor: "#e34a33",
                    stack: "1"
                },
                {
                    label: "New Users",
                    data: processData(data.newUser),
                    parsing: {
                        xAxisKey: "date",
                        yAxisKey: "Count"
                    },
                    borderColor: "#31a354",
                    backgroundColor: "#31a354",
                    stack: "1"
                },
                {
                    label: "Active Users",
                    data: processData(data.activeUser),
                    parsing: {
                        xAxisKey: "date",
                        yAxisKey: "Count"
                    },
                    borderColor: "#ffeda0",
                    backgroundColor: "#ffeda0",
                    stack: "1"
                }
            ]
        });

        return () => {
            console.log("UserBase mount cleanup ");
        };
    }, []);

    const onChangeDisplayFormat = e => {
        let df = e.target.value;
        setDisplayFormat(df);
        const displayFormatDetails = displayFormatsMap[df];
        const displayFormatSuccessor = displayFormatsMap[displayFormatDetails.successor];
        const end = new Date().valueOf();
        const start = end - displayFormatSuccessor.ms;
        setTimeRange(prev => ({ ...prev, min: start, max: end }));
        startFetch({ chart: chartRef.current }, start, end, df);
    };

    const zoom = value => chartRef.current.zoom(value);

    const resetZoom = () => chartRef.current.resetZoom();

    const fetchApiData = async (min, max, df = displayFormat) => {
        let resp = await Api.root.post(
            "https://apib-kwt.almullaexchange.com/xms/api/v1/digital/analytics/app-user-base",
            {
                dateRange1: min,
                dateRange1Str: new Date(min),
                dateRange2: max,
                dateRange2Str: new Date(max),
                displayFormat: df
            }
        );
        return resp.data.results[0];
    };

    const processData = data => {
        return data
            .map(el => {
                return {
                    Count: 0,
                    ...el
                };
            })
            .sort((el1, el2) => (el1.date < el2.date ? 1 : el1.date > el2.date ? -1 : 0));
    };

    let timer;
    const startFetch = ({ chart }, _min, _max, df) => {
        const min = _min || chart.scales.x.min;
        const max = _max || chart.scales.x.max;
        clearTimeout(timer);
        timer = setTimeout(async () => {
            let data = await fetchApiData(min, max, df);
            console.log("UserBase - Fetched data between " + new Date(min) + " and " + new Date(max), { data });
            chart.data.datasets[0].data = processData(data.activeCustomers);
            chart.data.datasets[1].data = processData(data.inActiveCustomers);
            chart.data.datasets[2].data = processData(data.lostCustomers);
            chart.data.datasets[3].data = processData(data.newUser);
            chart.data.datasets[4].data = processData(data.activeUser);
            chart.stop(); // make sure animations are not running
            chart.update("none");
        }, 300);
    };

    return (
        // <div style={{ width: "600px", height: "600px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ height: "auto" }}>
            <div className="chart-filters row mb-3">
                <div className="col-lg-8">
                    <div className="row">
                        <div className="col-lg-4 mb-2">
                            <div className="form-group-sm">
                                <label className="form-control-label" htmlFor="display-format">
                                    Unit
                                </label>
                                <select
                                    style={{ width: "100%" }}
                                    className={"form-control-alternative form-control-sm"}
                                    id="display-format"
                                    value={displayFormat}
                                    onChange={onChangeDisplayFormat}
                                >
                                    <option key="" value="">
                                        Select Display Format
                                    </option>
                                    {Object.entries(getFilteredDisplayFormats()).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {key.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 text-right mb-2">
                    <button className={"btn btn-sm btn-primary"} title="Zoom In" onClick={() => zoom(1.1)}>
                        <i className="fa fa-search-plus"></i>
                    </button>
                    <button className={"btn btn-sm btn-primary"} title="Zoom Out" onClick={() => zoom(0.9)}>
                        <i className="fa fa-search-minus"></i>
                    </button>
                    <button className={"btn btn-sm btn-primary"} title="Reset" onClick={resetZoom}>
                        <i className="fa fa-sync"></i>
                    </button>
                </div>
            </div>
            <Line
                ref={chartRef}
                data={chartData}
                options={{
                    // maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            beginAtZero: true,
                            position: "bottom",
                            type: "time",
                            min: timeRange.min,
                            max: timeRange.max,
                            ticks: {
                                autoSkip: true,
                                autoSkipPadding: 5,
                                maxRotation: 0
                            },
                            time: {
                                unit: displayFormat,
                                displayFormats: getFilteredDisplayFormats()
                            }
                        },
                        y: {
                            grid: {
                                display: false
                            },
                            beginAtZero: true,
                            position: "left",
                            type: "linear",
                            ticks: {
                                autoSkip: true
                            },
                            stacked: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            position: "top",
                            text: ctx => {
                                return `
                                    Chart Info [ zoom level : ${ctx.chart.getZoomLevel()} ] [ start : ${
                                    ctx.chart.scales.x.min &&
                                    ctx.chart.scales.x.min != -1 &&
                                    ctx.chart.scales.x.min != 1
                                        ? new Date(ctx.chart.scales.x.min).toISOString().split("T")[0]
                                        : "-"
                                }, end : ${
                                    ctx.chart.scales.x.max &&
                                    ctx.chart.scales.x.max != -1 &&
                                    ctx.chart.scales.x.max != 1
                                        ? new Date(ctx.chart.scales.x.max).toISOString().split("T")[0]
                                        : "-"
                                } ]
                                `;
                            }
                        },
                        legend: {
                            display: true,
                            position: "top",
                            labels: {
                                usePointStyle: true,
                                pointStyle: "rectRounded"
                            }
                        },
                        zoom: {
                            pan: {
                                enabled: true,
                                mode: "x",
                                // overScaleMode: "x",
                                threshold: 100,
                                onPanComplete: startFetch
                            },
                            zoom: {
                                mode: "x",
                                // overScaleMode: "x",
                                wheel: {
                                    enabled: true,
                                    speed: 0.1
                                },
                                drag: {
                                    enabled: false
                                },
                                pinch: {
                                    enabled: false
                                }, // for mobile devices. would need to add a third party dependency - 'hammer.js'
                                onZoomComplete: startFetch
                            },
                            limits: {
                                x: {
                                    minRange: 60 * 1000,
                                    min: timeAxisRange.min,
                                    max: timeAxisRange.max
                                }
                            }
                        }
                    },
                    transitions: {
                        zoom: {
                            animation: {
                                duration: 100
                            }
                        }
                    },
                    elements: {
                        line: {
                            pointRadius: 1,
                            tension: 0.4
                        }
                    }
                }}
            />
        </div>
    );
};

export default UserBase;
