import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';

import { SettingsWidget } from './settings';

export const rosSettings: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-ros/settings',
  autoStart: true,
  requires: [ICommandPalette, ISettingRegistry],
  optional: [],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, settings: ISettingRegistry) => {
    
    const { commands } = app;

    const command = 'jupyterlab-ros/settings:open';
    commands.addCommand(command, {
      label: 'Settings',
      caption: 'Configurate your JupyterLab-ROS env.',
      execute: (args: any) => {
        const content = new SettingsWidget(settings, 'jupyterlab-ros:settings-ros');
        const widget = new MainAreaWidget<SettingsWidget>({ content });
        widget.title.label = 'ROS Settings';
        app.shell.add(widget, 'main');
      }
    });

    palette.addItem({ command, category: 'ROS' });
  }
};