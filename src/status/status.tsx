import { JupyterFrontEnd } from '@jupyterlab/application';
import { VDomModel, VDomRenderer } from '@jupyterlab/apputils';
import { TextItem } from '@jupyterlab/statusbar';
import ROSLIB from 'roslib';

import React from 'react';


export class ROSStatusBridge extends VDomRenderer<Model> {
  
  constructor(app: JupyterFrontEnd) {
    super(new Model(app));
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

  roscoreConsole = () => {
    console.log("name: ", this.model.app.name);

    this.model.app.serviceManager.terminals.startNew()
      .then(terminal => {
        
        console.log("Terminal: ", terminal);

        const res = terminal.send({type: 'stdin', content: ["conda activate ros && roscore\n"]});
        console.log("Send: ", res);

        console.log("Hi!!, ", this.model.status);
        this.model.status = !this.model.status;
        
      }).catch(err => console.error(err));
  }
  
  render() {
    this.node.title = "Ros bridge status";

    return (
      <div className="main">
        <TextItem source={"ROS: "} />
        { this.model.status && <div className="ok" /> }
        { this.model.status == false && <div className="ko" /> }
      </div>
    );
  }
}

class Model extends VDomModel {
  private _status: boolean = false;
  private _app: JupyterFrontEnd = null;

  constructor(app: JupyterFrontEnd) {
    super();
    this._app = app;
  }

  get status() { return this._status; }
  set status(status: boolean) {
    this._status = status;
    this.stateChanged.emit(void 0)
  }

  get app() { return this._app; }
  set app(app: JupyterFrontEnd) {
    this._app = app;
    this.stateChanged.emit(void 0)
  }
}