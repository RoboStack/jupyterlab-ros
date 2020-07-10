import { ReactWidget } from '@jupyterlab/apputils';
import { UUID } from '@lumino/coreutils';
import React from 'react';

import { Log, Checkpoint, RosLog } from './log';

export class LogConsolePanel extends ReactWidget {
  
  private level: number;
  private topic: string;
  private logs: RosLog[];

  constructor() {
    super();
    this.addClass('jp-LogConsolePanel');

    this.level = 1;
    this.topic = '/all';
    this.logs = [];
  }

  public setLevel = (level: number): void => {
    this.level = level;
    this.update();
  }

  public setTopic = (topic: string): void => {
    this.topic = topic;
    this.update();
  }

  public setLogs = (logs: RosLog[]): void => {
    this.logs = logs;
    this.update();
  }

  render(): JSX.Element {
    const logsLevel: JSX.Element[] = [];

    for(let i=0; i<this.logs.length; i++) {
      if (this.topic == '/all' || this.logs[i].name == this.topic) {
        
        if (this.logs[i].level == 0) {
          logsLevel.push(<Checkpoint key={UUID.uuid4()} log={this.logs[i]}/>);
        
        } else if (this.logs[i].level >= this.level) {
          logsLevel.push(<Log key={UUID.uuid4()} log={this.logs[i]}/>);
        }
      }
    }

    return (
      <div className="lm-Widget p-Widget jp-Scrolling lm-StackedPanel-child p-StackedPanel-child">
        <div className="lm-Widget p-Widget jp-OutputArea">
          { logsLevel }
        </div>
      </div>
    );
  }
}