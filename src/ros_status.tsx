import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { VDomModel, VDomRenderer } from '@jupyterlab/apputils';
import { IStatusBar, TextItem } from '@jupyterlab/statusbar';

import React, { Component } from 'react';

export class ROSStatus extends VDomRenderer<ROSStatus.Model> {
  
  constructor() {
    super(new ROSStatus.Model());
  }
  
  toggle = () => {
    console.log("Hi!!, ", this.model.status);
    this.model.status = !this.model.status;
    //this.render()
  }

  render() {
    console.log("render:", this.model.status)
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

export namespace ROSStatus {
  export class Model extends VDomModel {
    private _status: boolean = false;
  
    get status() { return this._status; }
    set status(status: boolean) { this._status = status; }
  }
}

/**
 * A VDomRenderer widget for displaying the status of Log Console logs.
 */
export const rosStatusItem: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab/rostatus',
  autoStart: true,
  requires: [IStatusBar],
  optional: [],
  activate: (app: JupyterFrontEnd, statusBar: IStatusBar) => {
    const { shell } = app;
    
    if (!statusBar) { console.log("No status bar!"); return; }
    
    statusBar.registerStatusItem('@jupyterlab/ros:status', {
      item: new ROSStatus(),
      align: 'left',
      rank: 4,
      isActive: () => true
    });
  }
};
