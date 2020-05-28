import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Menu } from '@lumino/widgets';
import { SettingsWidget } from './settings';

export const rosMenu: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-ros/menu',
  autoStart: true,
  requires: [ICommandPalette, IMainMenu, ISettingRegistry],
  optional: [],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, mainMenu: IMainMenu, settings: ISettingRegistry) => {
    
    const { commands } = app;

    // Create a new menu
    const menu: Menu = new Menu({ commands });
    menu.title.label = 'ROS';
    mainMenu.addMenu(menu, { rank: 80 });

    /************************************************************************
     *                      Environment section
     ************************************************************************/
    // CREATE ENV
    // Create and add a new command
    let command = 'jupyterlab-ros/menu:new-env';
    commands.addCommand(command, {
      label: 'New env',
      caption: 'Create a new conda env with all ROS packages.',
      execute: (args: any) => {
        window.alert("New conda env created with ROS packages.");
      }
    });

    // Add the command to the command palette
    palette.addItem({
      command,
      category: "ROS",
      args: { arg: 'example' }
    });

    // Add the command to the menu
    menu.addItem({ command, args: { arg: 'example' } });
    // DELETE ENV
    command = 'jupyterlab-ros/menu:del-env';
    commands.addCommand(command, {
      label: 'Delete env',
      caption: 'Delete an existing conda env with ros packages.',
      execute: (args: any) => {
        window.alert("Environment deleted");
      }
    });

    palette.addItem({
      command,
      category: "ROS"
    });

    menu.addItem({ command });
    menu.addItem({ type: "separator" })

    // START/STOP WEB BRIDGE SERVER
    command = 'jupyterlab-ros/menu:bridge-server';
    commands.addCommand(command, {
      label: 'Bridge server',
      caption: 'Start/Stop the web bridge server.',
      execute: (args: any) => {
        window.alert(`Server ${args['status']}.`);
      }
    });

    palette.addItem({
      command,
      category: "ROS",
      args: { status: 'stoped' }
    });

    menu.addItem({ command, args: { status: 'running' } });
    menu.addItem({ type: "separator" })

    // DELETE ENV
    command = 'jupyterlab-ros/menu:settings';
    commands.addCommand(command, {
      label: 'Settings',
      caption: 'Configurate your JupyterLab-ROS env.',
      execute: (args: any) => {
        const content = new SettingsWidget(settings, "jupyterlab-ros:settings-ros");
        const widget = new MainAreaWidget<SettingsWidget>({ content });
        widget.title.label = 'ROS Settings';
        app.shell.add(widget, 'main');
      }
    });

    palette.addItem({
      command,
      category: "ROS"
    });
    
    menu.addItem({ command });
  }
};