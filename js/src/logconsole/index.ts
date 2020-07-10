import { JupyterFrontEnd, JupyterFrontEndPlugin, ILayoutRestorer } from '@jupyterlab/application';
import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';
import { addIcon, clearIcon } from '@jupyterlab/ui-components';

import { LogConsoleWidget } from './logConsoleWidget';

export const logConsole: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-ros/logConsole',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  optional: [],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer) => {
    const { commands } = app;

    let widget: LogConsoleWidget = null;

    const tracker = new WidgetTracker<LogConsoleWidget>({
      namespace: 'roslogconsole'
    });

    restorer.restore(tracker, {
      command: 'jupyterlab-ros/logConsole:open',
      name: () => 'roslogconsole'
    });

    // Creating some buttons for the widget toolbar
    commands.addCommand('jupyterlab-ros/logConsole:checkpoint', {
      execute: () => widget?.checkpoint(),
      icon: addIcon,
      label: 'Add Checkpoint'
    });

    commands.addCommand('jupyterlab-ros/logConsole:clear', {
      execute: () =>  widget?.clear(),
      icon: clearIcon,
      label: 'Clear Log'
    });

    commands.addCommand('jupyterlab-ros/logConsole:open', {
      label: 'Ros log',
      caption: 'Log console for ROS.',
      isVisible: () => true,
      isEnabled: () => true,
      isToggled: () => widget !== null,
      execute: () => {
        if (widget) {
          widget.dispose();
        } else {
          widget = new LogConsoleWidget(app);

          widget.disposed.connect(() => {
            widget = null;
            commands.notifyCommandChanged();
          });

          app.shell.add(widget, 'main', { mode: 'split-bottom' });
          tracker.add(widget);

          widget.update();
          commands.notifyCommandChanged();
        }
      }
    });

    palette.addItem({ command: 'jupyterlab-ros/logConsole:open', category: 'ROS' });
  }
};