import { VDomModel, VDomRenderer, Dialog, ReactWidget } from '@jupyterlab/apputils';
import { TextItem } from '@jupyterlab/statusbar';

import ROSLIB from 'roslib';
import React from 'react';

export class ROSStatusBridge extends VDomRenderer<Model> {
  
  constructor() {
    super(new Model());
  }

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
    this.model.status = true;
    console.log("Connected to rosbridge");
  }

  onError = () => {
    this.model.status = false;
    console.log("No va.");
  }

  onDisconect = () => {
    this.model.status = false;
    console.log("Disconnected from rosbridges.");
  }

  onClick = () => {
    this.model.status = !this.model.status;
    console.log("Status changed.");
  }
  
  render() {
    this.node.title = "Ros bridge status";

    return (
      <div className="main" onClick={this.onClick}>
        <TextItem source={"ROS: "} />
        { this.model.status && <div className="ok" /> }
        { this.model.status == false && <div className="ko" /> }
      </div>
    );
  }
}

class Model extends VDomModel {
  private _status: boolean = false;

  constructor() {
    super();
  }

  get status() { return this._status; }
  set status(status: boolean) {
    this._status = status;
    this.stateChanged.emit(void 0)
  }
}

class MyDialog extends Dialog<ReactWidget> {
  
  show() {

  }
}