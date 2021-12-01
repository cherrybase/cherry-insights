import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-moment";
import * as zoom from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import {
    displayFormatsMap,
    defaultDisplayFormat,
    getFilteredDisplayFormats
} from "./constants";

const ChartExample = props => {
    const [chartData, setChartData] = useState({});
    const [displayFormat, setDisplayFormat] = useState("");
    const [timeRange, setTimeRange] = useState({ min: 0, max: 0 });
    const [timeAxisRange, setTimeAxisRange] = useState({ min: 0, max: 0 });
    const chartRef = useRef();

    const allData = [];
    let y = 100;
    for (
        let x = new Date().valueOf() - 1000 * 60 * 60 * 24 * 10;
        x <= new Date().valueOf() + 1000 * 60 * 60 * 24 * 10;
        x += 1000
    ) {
        y += 5 - Math.random() * 10;
        allData.push({ x, y });
    }

    useEffect(async () => {
        console.log("ChartExample mount ");

        setDisplayFormat(defaultDisplayFormat);

        const displayFormatDetails = displayFormatsMap[defaultDisplayFormat];
        const displayFormatSuccessor = displayFormatsMap[displayFormatDetails.successor];
        const end = new Date().valueOf();
        const start = end - displayFormatSuccessor.ms;
        setTimeRange(prev => ({ ...prev, min: start, max: end }));
        const axisEnd = end + 1000 * 60 * 60 * 24 * 365;
        const axisStart = start - 1000 * 60 * 60 * 24 * 365;
        setTimeAxisRange(prev => ({ ...prev, min: axisStart, max: axisEnd }));

        let data = fetchData(start, end);
        console.log("Fetched data between " + new Date(start) + " and " + new Date(end), { data });
        setChartData({
            // labels: [],
            datasets: [
                {
                    label: "Sales Revenue",
                    data,
                    backgroundColor: "blue"
                }
            ]
        });

        return () => {
            console.log("ChartExample mount cleanup ");
        };
    }, []);

    const onChangeDisplayFormat = e => setDisplayFormat(e.target.value);

    const zoom = value => chartRef.current.zoom(value);

    const resetZoom = () => chartRef.current.resetZoom();

    const fetchData = (x1, x2) => {
        if (!x1 || !x2) return [];
        const step = Math.max(1, Math.round((x2 - x1) / 100000));
        const data = [];
        let i = 0;
        while (i < allData.length && allData[i].x < x1) {
            i++;
        }
        while (i < allData.length && allData[i].x <= x2) {
            data.push(allData[i]);
            i += step;
        }
        return data;
    };

    let timer;
    const startFetch = ({ chart }) => {
        const { min, max } = chart.scales.x;
        clearTimeout(timer);
        timer = setTimeout(async () => {
            let d = fetchData(min, max);
            console.log("Fetched data between " + new Date(min) + " and " + new Date(max), { d });
            chart.data.datasets[0].data = d;
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
                        {/* <div className="col-lg-4 mb-2">
                            <div className="form-group-sm">
                                <label className="form-control-label" htmlFor="start-time">
                                    Start
                                </label>
                                <input
                                    style={{ width: "100%", color: !timeRange.min ? "transparent" : "" }}
                                    className={"form-control-alternative form-control-sm"}
                                    type="date"
                                    id="start-time"
                                    value={timeRange.min ? new Date(timeRange.min).toISOString().split("T")[0] : ""}
                                    onChange={e => setTimeRange(prev => ({ ...prev, min: new Date(e.target.value).valueOf() }))}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="col-lg-4 mb-2">
                            <div className="form-group-sm">
                                <label className="form-control-label" htmlFor="end-time">
                                    End
                                </label>
                                <input
                                    style={{ width: "100%", color: !timeRange.max ? "transparent" : "" }}
                                    className={"form-control-alternative form-control-sm"}
                                    type="date"
                                    id="end-time"
                                    value={timeRange.max ? new Date(timeRange.max).toISOString().split("T")[0] : ""}
                                    onChange={e => setTimeRange(prev => ({ ...prev, max: new Date(e.target.value).valueOf() }))}
                                    disabled
                                />
                            </div>
                        </div> */}
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
                            }
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
                    }
                }}
            />
        </div>
    );
};

export default ChartExample;
