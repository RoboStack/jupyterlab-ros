import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { IStatusBar } from '@jupyterlab/statusbar';

import { ROSStatusBridge } from './status';

export const rosStatus: JupyterFrontEndPlugin<void> = {
  id: 'jlab-ros:status',
  autoStart: true,
  requires: [IStatusBar],
  optional: [],
  activate: (app: JupyterFrontEnd, statusBar: IStatusBar) => {
    
    if (!statusBar) { console.log("No status bar!"); return; }
    
    statusBar.registerStatusItem('jlab-ros:status-bridge', {
      item: new ROSStatusBridge(app),
      align: 'left',
      rank: 4,
      isActive: () => true
    });
  }
  };