import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { VDomModel, VDomRenderer } from '@jupyterlab/apputils';
import { IStatusBar, TextItem } from '@jupyterlab/statusbar';

import React, { Component } from 'react';

export class ROSStatus extends VDomRenderer {
  private status: boolean;

  constructor() {
    super();
    this.status = false;
  }
  
  toggle = () => {
    console.log("Hi!!, ", this.status);
    this.status = !this.status;
    this.r
  }

  render() {
    console.log("render:", this.status)
    this.node.title = "Ros bridge status";

    return (
      <div className="main" onClick={this.toggle}>
        <TextItem source={"ROS: "} />
        { this.status && <div className="ok" /> }
        { this.status == false && <div className="ko" /> }
      </div>
    );
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
