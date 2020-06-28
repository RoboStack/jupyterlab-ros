import { ReactWidget } from '@jupyterlab/apputils';
import * as React from 'react';

import ROSLIB from 'roslib';

export class LogStatus extends ReactWidget {

  private _connected: boolean = false;
  private _ros: ROSLIB.Ros = null;
  
  constructor(ros: ROSLIB.Ros) {
    super();
    this.addClass('jp-LogConsole-toolbarLogLevel');
    this._ros = ros;
  }

  private connect = (): void => this._ros?.connect("ws://"+window.location.host+"/jupyterlab-ros/bridge");
  private disconnect = (): void => this._ros?.close();

  public setConnected = (connected: boolean) => {
    this._connected = connected;
    this.update();
  }

  render(): JSX.Element {
    return (
      <a href="#" style={{ width: "20px", height: "24px" }}>
        {
          this._connected ?
          <div onClick={this.disconnect} className="ok"/> :
          <div onClick={this.connect} className="ko"/>
        }
      </a>
    );
  }
}