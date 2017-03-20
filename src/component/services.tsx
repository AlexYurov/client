import React = require("react")
import { serviceStore, appStore } from "../store"
import { createSortOnProperty, bytesToSize } from "../util"
import { sendCommandToDefault } from "../socket"
import { Stats, LoadingScreen, dialogEvents } from "./"
import { Panel } from "./ui"
import { Button, Input, Glyphicon } from "react-bootstrap"
import setIntervals from "../interval"
import { intervals } from "../api-layer"
import { AutoAffix } from "react-overlays"

export class ServiceList extends React.Component<
    {},
    { services?: Array<ServiceInfo>, sortProperty?: string, sortType?: string }
    > {
    columns: { [key: string]: string }
    constructor(props) {
        super(props)
        this.state = { services: [], sortProperty: "ServiceName", sortType: "asc" }
        this.onChange = this.onChange.bind(this)
        this.columns = { ServiceName: "ServiceName", DisplayName: "DisplayName", StartType: "StartType", Status: "Status" }
    }
    componentDidMount() {
        serviceStore.listen(this.onChange)
        if (appStore.getState().auth.loggedIn) {
            _.assign(intervals, setIntervals())
            this.setState(serviceStore.getState())
        }
    }
    componentWillUnmount() {
        serviceStore.unlisten(this.onChange)
        console.log(intervals)
        _.forEach(intervals, (v: number, k) => {
            clearInterval(v)
        })
    }
    getName(property: string) {
        if (this.state.sortProperty == property) {
            return <span>
                <Glyphicon glyph={(this.state.sortType == "asc" ? "menu-up" : "menu-down")} />
                <br />
                {this.columns[property]}
            </span>
        }
        else {
            return <span>{this.columns[property]}</span>
        }
    }
    onChange(tasks) {
        this.setState(tasks)
    }
    setSort(prop: string) {
        if (this.state.sortProperty == prop) {
            this.setState({ sortType: (this.state.sortType == "asc" ? "desc" : "asc") })
        }
        else {
            this.setState({ sortProperty: prop })
        }
    }
    render() {
        if (this.state.services.length == 0) {
            return <LoadingScreen>
                Loading task list
            </LoadingScreen>
            /*
            return (
                <p>Loading task list; hang on pleaaase...</p>
            )
            */
        }
        if (this.state.sortProperty.length > 0) {
            this.state.services.sort(createSortOnProperty<ServiceInfo>(this.state.sortProperty, this.state.sortType))
        }
        return (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Icon</th>
                        <th className="task-name-head" onClick={() => this.setSort("ServiceName")}>
                            {this.getName("ServiceName")}
                        </th>
                        <th className="task-name-head" onClick={() => this.setSort("DisplayName")}>
                            {this.getName("DisplayName")}
                        </th>
                        <th className="task-name-head" onClick={() => this.setSort("StartType")}>
                            {this.getName("StartType")}
                        </th>
                        <th className="task-name-head" onClick={() => this.setSort("Status")}>
                            {this.getName("Status")}
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.services.map(service => {
                        return (<Service key={service.ServiceName} info={service} />)
                    })}
                </tbody>
            </table>
        )
    }
}

export class Service extends React.Component<
    { key: string, info: ServiceInfo },
    { expanded?: boolean, gonnaDie?: boolean }> {
    constructor(props) {
        super(props)
        this.state = { expanded: false, gonnaDie: false }
    }
    startSelf = () => {
        sendCommandToDefault("StartService", this.props.info.ServiceName.toString())
    }
    stopSelf = () => {
        sendCommandToDefault("StopService", this.props.info.ServiceName.toString())
    }
    render() {
        if (!this.state.expanded) {
            return (
                //onClick={() => this.setState({expanded: true})}
                //<button className="btn btn-danger">confirm</button>
                <tr>
                    <td className="task-name">
                        {this.props.info.ServiceName.slice(0, 30)}
                    </td>
                    <td className="task-name">
                        {this.props.info.DisplayName}
                    </td>
                    <td className="task-name">
                        {this.props.info.StartType}
                    </td>
                    <td className="task-name">
                        {this.props.info.Status}
                    </td>
                    <td
                        className="button"
                        onClick={() => { this.startSelf() }}
                        style={{ width: 60, textAlign: "right" }}>
                        Start
                    </td>
                    <td
                        className="button"
                        onClick={() => { this.stopSelf() }}
                        style={{ width: 60, textAlign: "right" }}>
                        Stop
                    </td>
                </tr>
            )
        }
        else {
            return (
                <tr onClick={() => this.setState({ expanded: false })}>
                    <td colSpan={5}>ssssssssssssssssssssssssssssssssssssssssssss</td>
                </tr>
            )
        }
    }
}


export function ServicePage(props: any) {
    return <div className="task-page" style={{ height: "100%" }}>
        <div className="row">

        </div>
        <div className="row" style={{ height: "100%" }}>
            <div className="col-md-7" style={{ minHeight: "600px", height: "100%" }}>
                <Panel className="full-height">
                    <div className="header">services</div>
                    <div className="body" style={{ overflow: "auto" }}>
                        <ServiceList />
                    </div>
                </Panel>
            </div>
            <div className="col-md-5 col-collapsed-left">
                <div>
                    <Stats />
                </div>
            </div>
        </div>
    </div>
}
