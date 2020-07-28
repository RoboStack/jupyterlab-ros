import { JupyterFrontEnd, JupyterFrontEndPlugin, ILayoutRestorer} from '@jupyterlab/application';
import { WidgetTracker, SessionContext, sessionContextDialogs } from '@jupyterlab/apputils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { Session } from '@jupyterlab/services';
import { runIcon } from '@jupyterlab/ui-components';

import BagWidget from './bagWidget';
import BagPanel from './bagPanel';
import BagModel from './bagModel';

export const bag: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-ros/bag',
  autoStart: true,
  requires: [IFileBrowserFactory, ILayoutRestorer],
  optional: [],
  activate: (app: JupyterFrontEnd, factory: IFileBrowserFactory, restorer: ILayoutRestorer) => {
    
    app.docRegistry.addFileType({
      name: 'bag',
      icon: runIcon,
      displayName: 'Bag File',
      extensions: ['.bag'],
      contentType: 'file',
      fileFormat: 'base64',
      iconClass: runIcon.name,
      iconLabel: runIcon.name,
      mimeTypes: ['application/octet-stream']
    });

    const tracker = new WidgetTracker<BagWidget>({ namespace: 'rosbag' });

    restorer.restore(tracker, {
      command: 'jupyterlab-ros/bag:launch',
      args: widget => ({ path: widget.content.model.session.path }),
      name: widget => widget.content.model.session.name
    });

    app.commands.addCommand('jupyterlab-ros/bag:launch', {
      label: 'Open Bag',
      caption: 'Open ROS bag file.',
      icon: runIcon,
      execute: (args: any) => {
        console.log("launch");

        const path = ( args.path || factory.tracker.currentWidget.selectedItems().next().path );

        app.serviceManager.sessions.findByPath(path)
        .then( model => {

          if (model) {
            const session = app.serviceManager.sessions.connectTo({ model });
            const widget = new BagWidget(new BagPanel(new BagModel(session)));
  
            app.shell.add(widget, 'main');
            tracker.add(widget);
          
          } else {
            const session = new SessionContext({
              sessionManager: app.serviceManager.sessions,
              specsManager: app.serviceManager.kernelspecs,
              name: path,
              path: path
            });
  
            session.initialize()
            .then( async value => {
              if (value) {
                await sessionContextDialogs.selectKernel(session);
                const widget = new BagWidget(new BagPanel(new BagModel(session.session)));
                
                app.shell.add(widget, 'main');
                tracker.add(widget);
              }
            }).catch( err => console.error(err) );
          }
          
        }).catch( err => console.log(err) );
      }
    });

    app.contextMenu.addItem({
      command: 'jupyterlab-ros/bag:launch',
      selector: '.jp-DirListing-item[data-file-type="bag"]',
      rank: 0
    });
  }
};