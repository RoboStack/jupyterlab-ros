import { JupyterFrontEnd, JupyterFrontEndPlugin, ILayoutRestorer} from '@jupyterlab/application';
import { WidgetTracker } from '@jupyterlab/apputils';
import { runIcon } from '@jupyterlab/ui-components';

import { BagViewFactory, BagModelFactory } from './bagFactory';
import BagDocument from './bagDocument';

export const bag: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-ros/bag',
  autoStart: true,
  requires: [ILayoutRestorer],
  optional: [],
  activate: (app: JupyterFrontEnd, restorer: ILayoutRestorer) => {
    
    app.docRegistry.addFileType({
      name: 'bag',
      icon: runIcon,
      displayName: 'Bag File',
      extensions: ['.bag'],
      contentType: 'file'
    });

    app.docRegistry.addWidgetFactory(
      new BagViewFactory({
        name: 'Bag',
        modelName: 'bag',
        fileTypes: ['bag'],
        defaultFor: ['bag'],
        defaultRendered: undefined,
        readOnly: false,
        preferKernel: true,
        canStartKernel: true,
        shutdownOnClose: true
      })
    );
    
    app.docRegistry.addModelFactory(new BagModelFactory());

    console.log("tracker start");
    const tracker = new WidgetTracker<BagDocument>({
      namespace: 'rosbag'
    });

    restorer.restore(tracker, {
      command: 'docmanager:open',
      args: widget => ({
        path: widget.context.path,
        factory: 'bag'
      }),
      name: widget => widget.context.path,
      when: app.serviceManager.ready
    });
  }
};