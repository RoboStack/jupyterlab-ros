import { VDomModel, VDomRenderer } from '@jupyterlab/apputils';

import ROSLIB from 'roslib';
import React from 'react';

export class ROSStatusBridge extends VDomRenderer<Model> {
  private state: Model = new Model();

  onAfterAttach = () => {
    const ros = new ROSLIB.Ros({});
    console.log("entra");

    ros.on('connection', this.onConnect);
    ros.on('error', this.onError);
    ros.on('close', this.onDisconect);
    console.log("entra 2");

    ros.connect('ws://localhost:9090');
    console.log("entra end");
  }
  
  onConnect = () => {
    this.state.status = true;
    console.log("Connected to rosbridge");
  }

  onError = () => {
    this.state.status = false;
    console.log("No va.");
  }

  onDisconect = () => {
    this.state.status = false;
    console.log("Disconnected from rosbridges.");
  }

  toggle = () => {
    this.state.status = !this.state.status;
    console.log("Status changed.");
  }

  render() {
    this.node.title = "Ros bridge status";
    return (
      <div className="main" onClick={this.toggle}>
        <span style={{ marginTop: '3px' }}>{"ROS: "}</span>
        { this.state.status && <div className="ok" /> }
        { this.state.status == false && <div className="ko" /> }
        { /*Dialog.l*/ }
      </div>
    );
  }
}

class Model extends VDomModel {
  private _status: boolean;
  
  constructor(){
    super();
    this._status = false;
  }

  get status() { return this._status; }
  set status(status: boolean) {
    this._status = status;
    this.stateChanged.emit(void 0);
  }
}

/*
type Props = {}
type State = {
  status: boolean;
}

class Status extends React.Component<Props, State> {
  readonly state: State = {
    status: false
  };

  constructor(props: Props) {
    super(props);
  }

  componentDidMount = () => {
    const ros = new ROSLIB.Ros({});
    console.log("entra");

    ros.on('connection', this.onConnect);
    ros.on('error', this.onError);
    ros.on('close', this.onDisconect);
    console.log("entra 2");

    ros.connect('ws://localhost:9090');
    console.log("entra end");
  }
  
  onConnect = () => {
    this.setState({ status: true });
    console.log("Connected to rosbridge");
  }

  onError = () => {
    this.setState({ status: false });
    console.log("No va.");
  }

  onDisconect = () => {
    this.setState({ status: false });
    console.log("Disconnected from rosbridges.");
  }

  toggle = () => {
    this.setState({ status: !this.state.status });
    console.log("Status changed.");
  }
  
  render() {
    return (
      <div className="main" onClick={this.toggle}>
        <span style={{ marginTop: '3px' }}>{"ROS: "}</span>
        { this.state.status && <div className="ok" /> }
        { this.state.status == false && <div className="ko" /> }
        { Dialog.l }
      </div>
    );
  }
}
*/