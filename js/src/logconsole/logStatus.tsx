import { ReactWidget } from '@jupyterlab/apputils';
import * as React from 'react';

import ROSLIB from 'roslib';

export class LogStatus extends ReactWidget {

  private connected: boolean = false;
  private ros: ROSLIB.Ros = null;
  private url: string;
  
  constructor(ros: ROSLIB.Ros, url: string) {
    super();
    this.addClass('jp-LogConsole-toolbarLogLevel');
    this.ros = ros;
    this.url = url;
  }

  private connect = (): void => this.ros?.connect(this.url);
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