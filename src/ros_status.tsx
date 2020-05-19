import { VDomModel, VDomRenderer } from '@jupyterlab/apputils';

import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';

import * as React from 'react';

import { IStatusBar } from '@jupyterlab/statusbar';

import { TextItem } from '@jupyterlab/statusbar';

export class ROSStatus extends VDomRenderer {
  /**
   * Construct a new ROSStatus status item.
   */

  // constructor() {
  //   super(new CommandEditStatus.Model());
  // }

  /**
   * Render the ROSStatus status item.
   */
  render() {
    // if (!this.model) {
    //   return null;
    // }
    this.node.title = `Notebook is in NO mode`;
    return <TextItem source={`Status: online?`} />;
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
  activate: (
    app: JupyterFrontEnd,
    statusBar: IStatusBar
  ) => {
    if (!statusBar)
    {
      console.log("ERROR NO STATUS BAR?!");
    }

    const { shell } = app;
    const item = new ROSStatus();
    if (!statusBar) {
      // Automatically disable if statusbar missing
      console.log("No status bar.");
      return;
    }

    statusBar.registerStatusItem('@jupyterlab/notebook-extension:mode-status', {
      item,
      align: 'right',
      rank: 4,
      isActive: () =>
        true
    });
  }
};
