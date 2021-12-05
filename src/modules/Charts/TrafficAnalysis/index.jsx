import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { Api } from "@services/ApiService";
import { displayFormatsMap, defaultDisplayFormat, getFilteredDisplayFormats, colorArray } from "@modules/Charts/constants";

const TrafficAnalysis = props => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(false);
    const [displayFormat, setDisplayFormat] = useState("");
    const [timeRange, setTimeRange] = useState({ min: 0, max: 0 });
    const chartRef = useRef();

    useEffect(async () => {
        console.log("TrafficAnalysis mount ");

        setDisplayFormat(defaultDisplayFormat);

        const displayFormatDetails = displayFormatsMap[defaultDisplayFormat];
        const displayFormatSuccessor = displayFormatsMap[displayFormatDetails.successor];
        const end = new Date().valueOf();
        const start = end - displayFormatSuccessor.ms;
        setTimeRange(prev => ({ ...prev, min: start, max: end }));

        let data = await fetchApiData(start, end, defaultDisplayFormat);
        console.log("TrafficAnalysis - Fetched data between " + new Date(start) + " and " + new Date(end), { data });
        let [labels, _data] = processData(data);
        setChartData({
            labels,
            datasets: [
                {
                    label: "Traffic",
                    data: _data,
                    backgroundColor: colorArray.slice(0, _data.length + 1)
                }
            ]
        });

        return () => {
            console.log("TrafficAnalysis mount cleanup ");
        };
    }, []);

    const fetchApiData = async (min, max) => {
        try {
            setLoading(true);
            let resp = await Api.root.post(
                "/digital/analytics/web-referrers-count",
                {
                    dateRange1: min,
                    dateRange1Str: new Date(min),
                    dateRange2: max,
                    dateRange2Str: new Date(max),
                    displayFormat
                }
            );
            return resp.data.results;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const processData = data => {
        let dataMap = {};
        data.forEach(el => {
            let { date, dateStr, ...rest } = el;
            Object.entries(rest).forEach( ([key, value]) => {
                if(dataMap.hasOwnProperty(key)){
                    dataMap[key] = dataMap[key] + value;
                }else{
                    dataMap[key] = value;
                }
            } );
        });
        return [[...Object.keys(dataMap)], [...Object.values(dataMap)]];
    };

    const onClickSearch = async () => {
        let data = await fetchApiData(timeRange.min, timeRange.max);
        console.log("TrafficAnalysis - Fetched data between " + new Date(timeRange.min) + " and " + new Date(timeRange.max), { data });
        let [labels, _data] = processData(data);
        setChartData({
            labels,
            datasets: [
                {
                    label: "Traffic",
                    data: _data,
                    backgroundColor: colorArray.slice(0, _data.length + 1)
                }
            ]
        });
    }

    return (
        <div style={{ height: "auto" }} className={loading ? "loader-inline" : ""}>
            <div className="chart-filters row mb-3">
                <div className="col-lg-8">
                    <div className="row">
                        {/* <div className="col-lg-3 mb-2">
                            <div className="form-group-sm">
                                <label className="form-control-label" htmlFor="display-format">
                                    Unit
                                </label>
                                <select
                                    style={{ width: "100%" }}
                                    className={"form-control-alternative form-control-sm"}
                                    id="display-format"
                                    value={displayFormat}
                                    onChange={e => setDisplayFormat(e.target.value)}
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
                        </div> */}
                        <div className="col-lg-3 mb-2">
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
                                    onChange={e =>
                                        setTimeRange(prev => ({ ...prev, min: new Date(e.target.value).valueOf() }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-3 mb-2">
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
                                    onChange={e =>
                                        setTimeRange(prev => ({ ...prev, max: new Date(e.target.value).valueOf() }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-3 mb-2 d-flex align-items-end">
                            <button className="btn btn-sm btn-primary" onClick={onClickSearch}>
                                <i className="fa fa-search" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ position: "relative", height: "450px" }}>
                <Pie
                    ref={chartRef}
                    data={chartData}
                    options={{
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                position: "top",
                                text: ctx => {
                                    return ``;
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
            </div>
        </div>
    );
};

export default TrafficAnalysis;
