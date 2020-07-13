import { ReactWidget } from '@jupyterlab/apputils';
import * as React from 'react';

import ROSLIB from 'roslib';

export class LogStatus extends ReactWidget {

  private connected: boolean = false;
  private ros: ROSLIB.Ros = null;
  
  constructor(ros: ROSLIB.Ros) {
    super();
    this.addClass('jp-LogConsole-toolbarLogLevel');
    this.ros = ros;
  }

  private connect = (): void => this.ros?.connect("ws://"+window.location.host+"/jupyterlab-ros/bridge");
  private disconnect = (): void => this.ros?.close();

  public setConnected = (connected: boolean) => {
    this.connected = connected;
    this.update();
  }

  render(): JSX.Element {
    return (
      <div className="main">
        {
          this.connected ?
          <div onClick={this.disconnect} className="ok"/> :
          <div onClick={this.connect} className="ko"/>
        }
      </div>
    );
  }
}