import { JupyterFrontEnd, JupyterFrontEndPlugin, ILayoutRestorer } from '@jupyterlab/application';
import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';

import ZethusWidget from './zethus';

export const zethus: JupyterFrontEndPlugin<void> = {
  id: "jupyterlab-ros/zethus",
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer) => {
    const { commands } = app;
    let widget = null;

    const tracker = new WidgetTracker<ZethusWidget>({
      namespace: 'zethus'
    });

    restorer.restore(tracker, {
      command: 'jupyterlab-ros/zethus:open',
      name: () => 'zethus'
    });

    let command = 'jupyterlab-ros/zethus:open';
    commands.addCommand(command, {
      label: 'Open Zethus',
      caption: 'Open a new Zethus view.',
      isVisible: () => true,
      isEnabled: () => true,
      isToggled: () => widget !== null,
      execute: () => {
        if (widget) {
          widget.dispose();
        } else {
          widget = new ZethusWidget();

          widget.disposed.connect(() => {
            widget = null;
            commands.notifyCommandChanged();
          });

          app.shell.add(widget, 'main');
          tracker.add(widget);

          widget.update();
          commands.notifyCommandChanged();
        }
      }
    });

    palette.addItem({ command, category: 'ROS' });
  }
};