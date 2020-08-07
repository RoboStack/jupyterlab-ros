import { JupyterFrontEnd, JupyterFrontEndPlugin, ILayoutRestorer } from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';

import SettingsWidget from './settings';

export const settings: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-ros/settings',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer, ISettingRegistry],
  optional: [],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer, settings: ISettingRegistry) => {
    const { commands } = app;
    const server = ServerConnection.makeSettings();
    const url = URLExt.join(server.baseUrl, 'ros/setting');

    let content: SettingsWidget = null;
    let widget: MainAreaWidget<SettingsWidget> = null;

    const tracker = new WidgetTracker<MainAreaWidget<SettingsWidget>>({
      namespace: 'rossettings'
    });

    restorer.restore(tracker, {
      command: 'jupyterlab-ros/settings:open',
      name: () => 'rossettings'
    });

    const command = 'jupyterlab-ros/settings:open';
    commands.addCommand(command, {
      label: 'Settings',
      caption: 'Specify your JupyterLab-ROS env.',
      isVisible: () => true,
      isEnabled: () => true,
      isToggled: () => widget !== null,
      execute: () => {
        if (widget) {
          widget.dispose();
        } else {
          content = new SettingsWidget(settings, '@robostack/jupyterlab-ros:settings');
          widget = new MainAreaWidget<SettingsWidget>({ content });
          widget.title.label = 'ROS Settings';

          widget.disposed.connect(() => {
            content.dispose();
            content = null;
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

    const loadSetting = (setting: ISettingRegistry.ISettings): void => {
      const env = setting.get('env').composite as string;
      const master = setting.get('master').composite as string;

      if ( env != "" || master != "" ) {
        const msg = { method: 'PUT', body: JSON.stringify({ env, master }) };
  
        ServerConnection.makeRequest(url, msg, server)
        .then( resp => {})
        .catch( err => console.log(err) );
      }
    }

    settings.load('@robostack/jupyterlab-ros:settings')
      .then(rosSetting => {
        rosSetting.changed.connect(loadSetting);
        loadSetting(rosSetting);
      }).catch(err => console.log(err));
  }
};