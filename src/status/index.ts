import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { IStatusBar } from '@jupyterlab/statusbar';

import { ROSStatusBridge } from './status';

export const rosStatus: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-ros/status',
  autoStart: true,
  requires: [IStatusBar],
  optional: [],
  activate: (app: JupyterFrontEnd, statusBar: IStatusBar) => {
    
    if (!statusBar) { console.log("No status bar!"); return; }
    
    statusBar.registerStatusItem('jupyterlab-ros/status:web-bridge', {
      item: new ROSStatusBridge(),
      align: 'left',
      rank: 4,
      isActive: () => true
    });
  }
  };