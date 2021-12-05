import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-moment";
import * as zoom from "chartjs-plugin-zoom";
import { Bar } from "react-chartjs-2";
import { Api } from "@services/ApiService";
import { displayFormatsMap, defaultDisplayFormat, getFilteredDisplayFormats } from "@modules/Charts/constants";

const ActiveUsers = props => {
    const [chartData, setChartData] = useState({});
    const [displayFormat, setDisplayFormat] = useState("");
    const [timeRange, setTimeRange] = useState({ min: 0, max: 0 });
    const [timeAxisRange, setTimeAxisRange] = useState({ min: 0, max: 0 });
    const chartRef = useRef();

    useEffect(async () => {
        console.log("ActiveUsers mount ");

        setDisplayFormat(defaultDisplayFormat);

        const displayFormatDetails = displayFormatsMap[defaultDisplayFormat];
        const displayFormatSuccessor = displayFormatsMap[displayFormatDetails.successor];
        const end = new Date().valueOf();
        const start = end - displayFormatSuccessor.ms;
        setTimeRange(prev => ({ ...prev, min: start, max: end }));
        const axisEnd = end + 1000 * 60 * 60 * 24 * 365;
        const axisStart = start - 1000 * 60 * 60 * 24 * 365;
        setTimeAxisRange(prev => ({ ...prev, min: axisStart, max: axisEnd }));

        let data = await fetchData(start, end, defaultDisplayFormat);
        console.log("ActiveUsers - Fetched data between " + new Date(start) + " and " + new Date(end), { data });
        setChartData({
            datasets: [
                {
                    label: "WEB",
                    data: processData(data),
                    parsing: {
                        xAxisKey: "date",
                        yAxisKey: "WEB"
                    },
                    backgroundColor: "#fc8d59",
                    borderColor: "#fc8d59",
                    borderColor: "white"
                },
                {
                    label: "IOS",
                    data: processData(data),
                    parsing: {
                        xAxisKey: "date",
                        yAxisKey: "IOS"
                    },
                    backgroundColor: "#67a9cf",
                    borderColor: "#67a9cf",
                    borderColor: "white"
                },
                {
                    label: "ANDROID",
                    data: processData(data),
                    parsing: {
                        xAxisKey: "date",
                        yAxisKey: "ANDROID"
                    },
                    backgroundColor: "#af8dc3",
                    borderColor: "#af8dc3",
                    borderColor: "white"
                }
            ]
        });

        return () => {
            console.log("ActiveUsers mount cleanup ");
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

    const fetchData = async (min, max, df = displayFormat) => {
        let resp = await Api.root.post(
            "/digital/analytics/active-users-count",
            {
                dateRange1: min,
                dateRange1Str: new Date(min),
                dateRange2: max,
                dateRange2Str: new Date(max),
                displayFormat: df
            }
        );
        return resp.data.results;
    };

    const processData = data => {
        return data
            .map(el => {
                return {
                    WEB: 0,
                    IOS: 0,
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
            let data = await fetchData(min, max, df);
            console.log("ActiveUsers - Fetched data between " + new Date(min) + " and " + new Date(max), { data });
            chart.data.datasets[0].data = processData(data);
            chart.data.datasets[1].data = processData(data);
            chart.data.datasets[2].data = processData(data);
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
            <Bar
                ref={chartRef}
                data={chartData}
                options={{
                    // maintainAspectRatio: false,
                    responsive: true,
                    barThickness: 30,
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
                            },
                            stacked: true
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
                    }
                }}
            />
        </div>
    );
};

export default ActiveUsers;
