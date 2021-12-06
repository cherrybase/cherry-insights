import React, { useState, useEffect, useRef } from "react";
import { Table } from "reactstrap";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { displayFormatsMap, defaultDisplayFormat, getFilteredDisplayFormats } from "@modules/Charts/constants";
import { Api } from "@services/ApiService";
import FormField from "@modules/Common/FormField";
import { Row, Col, Button, Input, CustomInput } from "reactstrap";

const DefaultColumnFilter = ({
    column: {
        filterValue,
        setFilter,
        preFilteredRows: { length }
    }
}) => {
    return (
        <Input
            value={filterValue || ""}
            onChange={e => {
                setFilter(e.target.value || undefined);
            }}
            placeholder={`search (${length}) ...`}
        />
    );
};

const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
    const options = React.useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach(row => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    return (
        <CustomInput
            id="custom-select"
            type="select"
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined);
            }}
        >
            <option value="">All</option>
            {options.map(option => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </CustomInput>
    );
};

const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
};

const Filter = ({ column }) => {
    return <div style={{ marginTop: 5 }}>{column.canFilter && column.render("Filter")}</div>;
};

export default function UserJourney() {
    const [loading, setLoading] = useState([]);

    const [opts, setOpts] = useState([]);
    const [selectedOpt, setSelectedOpt] = useState([]);

    const [tableStuff, setTableStuff] = useState({});

    const [timeRange, setTimeRange] = useState({ min: 0, max: 0 });

    const [displayFormat, setDisplayFormat] = useState("");

    const displayFormatRef = useRef();
    const columnsConfigRef = useRef();
    const timeRangeMinRef = useRef();

    useEffect(async () => {
        console.log("UserJourney mount - setOpts");

        try {
            let resp = await Api.root.get(
                "/client/register/event",
                {},
                {
                    headers: {
                        consumerKey: "1fxb4orbwe8sr"
                    }
                }
            );
            let results = resp.data.results[0].metaEventDoc;
            setOpts(results.map(el => ({ label: el.eventDesc ? el.eventDesc : el.eventName, value: el.eventName })));
        } catch (error) {}

        return () => {
            console.log("UserJourney mount - setOpts cleanup ");
        };
    }, []);

    useEffect(async () => {
        console.log("UserJourney mount ");

        setDisplayFormat(defaultDisplayFormat);

        const displayFormatDetails = displayFormatsMap[defaultDisplayFormat];
        const displayFormatSuccessor = displayFormatsMap[displayFormatDetails.successor];
        const end = new Date().valueOf();
        const start = end - displayFormatSuccessor.ms;
        setTimeRange(prev => ({ ...prev, min: start, max: end }));

        return () => {
            console.log("UserJourney mount cleanup ");
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

    const fetchData = async (min, max, eventNameList) => {
        let resp = await Api.root.post(
            "/digital/analytics/user-events-count",
            {
                dateRange1: min,
                dateRange1Str: new Date(min),
                dateRange2: max,
                dateRange2Str: new Date(max),
                displayFormat: displayFormat.value,
                eventNameList
            }
        );
        return resp.data.results;
    };

    const onClickSearch = async () => {
        if ([displayFormatRef.current.isValid()].includes(false)) return;
        let configuredCols = columnsConfigRef.current.val() || [];
        let configuredColsList = configuredCols.map(el => el.value);
        let data = await fetchData(timeRange.min, timeRange.max, configuredColsList);
        console.log(
            "UserJourney - Fetched data between " +
                new Date(timeRange.min) +
                " and " +
                new Date(timeRange.max) +
                " for",
            configuredColsList,
            { data }
        );
        setTableStuff(prev => ({
            columns: configuredCols && configuredCols.length ? configuredCols : opts,
            data
        }));
    };

    let data = React.useMemo(() => {
        console.log("memorising data");
        return tableStuff.data || [];
    }, [tableStuff]);

    let columns = React.useMemo(() => {
        console.log("memorising columns");
        let defaultsCols = [
            {
                Header: "Date / Time",
                accessor: "dateStr"
            }
        ];
        let cols = (tableStuff.columns || []).map(el => ({
            Header: el.label,
            accessor: el.value,
            Cell: row => row.value || "-"
        }));
        return cols.length ? defaultsCols.concat(cols) : [];
    }, [tableStuff]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        // rows, -> we change 'rows' to 'page'
        page,
        prepareRow,
        // below new props related to 'usePagination' hook
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable(
        { columns, data, defaultColumn: { Filter: DefaultColumnFilter }, initialState: { pageIndex: 0, pageSize: 10 } },
        useFilters,
        useSortBy,
        usePagination
    );

    const onChangeInSelect = event => {
        setPageSize(Number(event.target.value));
    };

    const onChangeInInput = event => {
        const page = event.target.value ? Number(event.target.value) - 1 : 0;
        gotoPage(page);
    };

    console.log("#render#", { columns, data, tableStuff });
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
                        <div className="col-lg-9 mb-2">
                            <FormField
                                ref={columnsConfigRef}
                                type="select"
                                id="columnsConfig"
                                placeholder={`configure columns`}
                                options={opts}
                                isSearchable
                                isMulti
                            />
                        </div>
                        <div className="col-lg-3 mb-2 d-flex align-items-start">
                            <button className="btn btn-primary" onClick={onClickSearch}>
                                <i className="fa fa-search" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {data.length ? (
                <>
                    {/* <div className="table-responsive">
                    <table {...getTableProps()} className="align-items-center table-flush table"> */}
                    <Table {...getTableProps()} className="align-items-center table-flush" responsive bordered>
                        <thead className="thead-light">
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        // <th {...column.getHeaderProps()}>{column.render("Header")}</th>

                                        // <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        //     {column.render("Header")}
                                        //     {generateSortingIndicator(column)}
                                        // </th>

                                        <th {...column.getHeaderProps()} style={{ padding: "1rem", fontSize: "13px" }}>
                                            <div {...column.getSortByToggleProps()}>
                                                {column.render("Header")}
                                                {generateSortingIndicator(column)}
                                            </div>
                                            {/* <Filter column={column} /> */}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    {/* </table>
                </div> */}
                    <Row style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
                        <Col md={3}>
                            <Button color="primary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                                {"<<"}
                            </Button>
                            <Button color="primary" onClick={previousPage} disabled={!canPreviousPage}>
                                {"<"}
                            </Button>
                        </Col>
                        <Col md={2} style={{ marginTop: 7 }}>
                            Page{" "}
                            <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>
                        </Col>
                        <Col md={2}>
                            <Input
                                type="number"
                                min={1}
                                style={{ width: 70 }}
                                max={pageOptions.length}
                                defaultValue={pageIndex + 1}
                                onChange={onChangeInInput}
                            />
                        </Col>
                        <Col md={2}>
                            <CustomInput id="page-size" type="select" value={pageSize} onChange={onChangeInSelect}>
                                {[5, 10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </CustomInput>
                        </Col>
                        <Col md={3}>
                            <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
                                {">"}
                            </Button>
                            <Button color="primary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                                {">>"}
                            </Button>
                        </Col>
                    </Row>
                </>
            ) : null}
        </>
    );
}
