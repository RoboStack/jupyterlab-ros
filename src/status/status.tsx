import { JupyterFrontEnd } from '@jupyterlab/application';
import { VDomModel, VDomRenderer } from '@jupyterlab/apputils';
import { TextItem } from '@jupyterlab/statusbar';

import React from 'react';


export class ROSStatusBridge extends VDomRenderer<Model> {
  
  constructor(app: JupyterFrontEnd) {
    super(new Model(app));
  }
  
  toggle = () => {
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

  session = () => {
    try {
      async () => {
        const terminal = await this.model.app.serviceManager.terminals.startNew();
        const aux = await terminal.send({type: 'stdin', content: ["conda activate ros && which roscore"]});
        console.log(aux);
      }
    } catch (e) { console.error(e); }
  }

  

  render() {
    this.node.title = "Ros bridge status";

    return (
      <div className="main" onClick={this.toggle}>
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