import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { launcherIcon } from '@jupyterlab/ui-components';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { IStatusBar } from '@jupyterlab/statusbar';

import StatusLaunch from './status';

export const launch: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-ros/launch',
  autoStart: true,
  requires: [IFileBrowserFactory, IStatusBar],
  optional: [],
  activate: (app: JupyterFrontEnd, factory: IFileBrowserFactory, statusBar: IStatusBar) => {
    let status: StatusLaunch = null;
    
    app.docRegistry.addFileType({
      name: 'launch',
      icon: launcherIcon,
      displayName: 'Launch File',
      extensions: ['.launch'],
      fileFormat: 'text',
      contentType: 'file',
      mimeTypes: ['application/xml']
    });

    app.commands.addCommand('jupyterlab-ros/launch:launch', {
      label: 'Launch',
      caption: 'Launch ROS launch file.',
      icon: launcherIcon,
      isVisible: () => true,
      isEnabled: () => true,
      execute: () => {
        const file = factory.tracker.currentWidget.selectedItems().next();
        status?.launch(file.path);
      }
    });

    app.contextMenu.addItem({
      command: 'jupyterlab-ros/launch:launch',
      selector: '.jp-DirListing-item[data-file-type="launch"]',
      rank: 0
    });

    if (!statusBar) { console.log("No status bar!"); return; }
    status = new StatusLaunch();

    const item = statusBar.registerStatusItem('jupyterlab-ros/launch:status', {
      item: status,
      align: 'left',
      rank: 4,
      isActive: () => true
    });
  }
};