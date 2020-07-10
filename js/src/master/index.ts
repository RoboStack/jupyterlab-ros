import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { IStatusBar } from '@jupyterlab/statusbar';

import StatusMaster from './status';

export const master: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-ros/master',
  autoStart: true,
  requires: [IStatusBar],
  optional: [],
  activate: (app: JupyterFrontEnd, statusBar: IStatusBar) => {
    
    if (!statusBar) { console.log("No status bar!"); return; }
    
    statusBar.registerStatusItem('jupyterlab-ros/master:status', {
      item: new StatusMaster(),
      align: 'left',
      rank: 4,
      isActive: () => true
    });
  }
};