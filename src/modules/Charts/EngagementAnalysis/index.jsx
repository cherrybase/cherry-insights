import React, { useState, useEffect, useRef } from "react";
import { displayFormatsMap, defaultDisplayFormat, getFilteredDisplayFormats } from "@modules/Charts/constants";
import { Bar } from "react-chartjs-2";
import { Api } from "@services/ApiService";
import FormField from "@modules/Common/FormField";

export default function EngagementAnalysis() {
    const [loading, setLoading] = useState([]);
    const [chartData, setChartData] = useState({});
    const [timeRange, setTimeRange] = useState({ min: 0, max: 0 });
    const [displayFormat, setDisplayFormat] = useState("");
    const chartRef = useRef();
    const displayFormatRef = useRef();
    // const timeRangeMinRef = useRef();

    useEffect(async () => {
        console.log("EngagementAnalysis mount ");

        setDisplayFormat(defaultDisplayFormat);

        const displayFormatDetails = displayFormatsMap[defaultDisplayFormat];
        const displayFormatSuccessor = displayFormatsMap[displayFormatDetails.successor];
        const end = new Date().valueOf();
        const start = end - displayFormatSuccessor.ms;
        setTimeRange(prev => ({ ...prev, min: start, max: end }));

        let data = await fetchData(start, end, { value: defaultDisplayFormat });
        console.log("EngagementAnalysis - Fetched data between " + new Date(start) + " and " + new Date(end), {
            data
        });
        setChartData({
            labels: data.map(el => Object.keys(el)[0]),
            datasets: [
                {
                    label: "Total",
                    data: data.map(el => Object.values(el)[0]),
                    parsing: {
                        xAxisKey: "durationRange",
                        yAxisKey: "count"
                    },
                    backgroundColor: "#fc8d59",
                    borderColor: "#fc8d59",
                    borderColor: "white"
                }
            ]
        });

        return () => {
            console.log("EngagementAnalysis mount cleanup ");
        };
    }, []);

    const onChangeDisplayFormat = newVal => {
        setDisplayFormat(newVal);
        const displayFormatDetails = displayFormatsMap[newVal.value];
        const displayFormatSuccessor = displayFormatsMap[displayFormatDetails.successor];
        const end = new Date().valueOf();
        const start = end - displayFormatSuccessor.ms;
        setTimeRange(prev => ({ ...prev, min: start, max: end }));
    };

    const fetchData = async (min, max, df = displayFormat) => {
        let resp = await Api.root.post("/digital/analytics/engagement-duration", {
            dateRange1: min,
            dateRange1Str: new Date(min),
            dateRange2: max,
            dateRange2Str: new Date(max),
            displayFormat: df.value
        });
        return resp.data.results;
    };

    const onClickSearch = async () => {
        if ([displayFormatRef.current.isValid()].includes(false)) return;
        let data = await fetchData(timeRange.min, timeRange.max);
        console.log(
            "EngagementAnalysis - Fetched data between " +
                new Date(timeRange.min) +
                " and " +
                new Date(timeRange.max) +
                " for",
            { data }
        );
        setChartData({
            labels: data.map(el => Object.keys(el)[0]),
            datasets: [
                {
                    label: "Total",
                    data: data.map(el => Object.values(el)[0]),
                    parsing: {
                        xAxisKey: "durationRange",
                        yAxisKey: "count"
                    },
                    backgroundColor: "#fc8d59",
                    borderColor: "#fc8d59",
                    borderColor: "white"
                }
            ]
        });
    };

    return (
        <>
            <div className="table-filters row mb-3">
                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-3 mb-2">
                            <FormField
                                ref={displayFormatRef}
                                controlled={true}
                                type="select"
                                id="displayFormat"
                                label="Unit"
                                options={Object.entries(getFilteredDisplayFormats()).map(([key, value]) => ({
                                    label: key.toUpperCase(),
                                    value: key
                                }))}
                                value={displayFormat}
                                onChange={onChangeDisplayFormat}
                            />
                        </div>
                        <div className="col-lg-3 mb-2">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="start-time">
                                    Start
                                </label>
                                <input
                                    style={{ width: "100%", color: !timeRange.min ? "transparent" : "" }}
                                    className={"form-control-alternative form-control"}
                                    type="date"
                                    id="start-time"
                                    value={timeRange.min ? new Date(timeRange.min).toISOString().split("T")[0] : ""}
                                    onChange={e =>
                                        setTimeRange(prev => ({ ...prev, min: new Date(e.target.value).valueOf() }))
                                    }
                                />
                            </div>
                            {/* <FormField
                                ref={timeRangeMinRef}
                                type="date"
                                id="timeRangeMin"
                                label="Start"
                            /> */}
                        </div>
                        <div className="col-lg-3 mb-2">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="end-time">
                                    End
                                </label>
                                <input
                                    style={{ width: "100%", color: !timeRange.max ? "transparent" : "" }}
                                    className={"form-control-alternative form-control"}
                                    type="date"
                                    id="end-time"
                                    value={timeRange.max ? new Date(timeRange.max).toISOString().split("T")[0] : ""}
                                    onChange={e =>
                                        setTimeRange(prev => ({ ...prev, max: new Date(e.target.value).valueOf() }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-3 mb-2">
                            <button className="btn btn-primary" style={{ marginTop: "31px" }} onClick={onClickSearch}>
                                <i className="fa fa-search" />
                            </button>
                        </div>
                    </div>
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
                        },
                        y: {
                            grid: {
                                display: false
                            },
                            beginAtZero: true,
                            position: "left"
                        }
                    },
                    plugins: {
                        title: {
                            display: false,
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
        </>
    );
}
