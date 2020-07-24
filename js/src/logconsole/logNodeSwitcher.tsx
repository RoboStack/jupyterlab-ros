import { ReactWidget } from '@jupyterlab/apputils';
import { HTMLSelect } from '@jupyterlab/ui-components';
import * as React from 'react';

import { LogConsolePanel } from './logConsolePanel';

export class LogNodeSwitcher extends ReactWidget {
  
  private logConsolePanel: LogConsolePanel = null;
  private topic: string;
  private topics: string[];

  constructor(logConsolePanel: LogConsolePanel) {
    super();
    this.addClass('jp-LogConsole-toolbarLogLevel');
    this.logConsolePanel = logConsolePanel;
    this.topic = '/all';
    this.topics = ['/all'];
  }

  private handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.topic = event.target.value;
    this.logConsolePanel.setTopic(this.topic);
    this.update();
  };

  private handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.keyCode === 13) this.logConsolePanel.activate();
  };

  public refreshNodes = (nodes: string[]): void => {
    this.topics = nodes;
    this.topics.unshift('/all');
    this.update();
  }

  public setNode = (node: string): void => {
    if (!this.topics.includes(node)) this.topics.push(node);
    this.update();
  }

  render(): JSX.Element {
    const topics = this.topics.map(value => { return {label: value.substring(1), value}; });

    return (
      <>
        <label>Node:</label>
        <HTMLSelect
          className="jp-LogConsole-toolbarLogLevelDropdown"
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          value={this.topic}
          aria-label="Log level"
          options={topics}
        />
      </>
    );
  }
}