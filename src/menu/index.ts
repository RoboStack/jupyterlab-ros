import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Menu } from '@lumino/widgets';

export const rosMenu: JupyterFrontEndPlugin<void> = {
  id: 'jlab-ros:menu',
  autoStart: true,
  requires: [ICommandPalette, IMainMenu],
  optional: [],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, mainMenu: IMainMenu) => {
    
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
    let command = 'jlab-ros:menu-newEnv';
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
    command = 'jlab-ros:menu-delEnv';
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
    command = 'jlab-ros:menu-bridgeServer';
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
    command = 'jlab-ros:menu-settings';
    commands.addCommand(command, {
      label: 'Settings',
      caption: 'Configurate your JupyterLab-ROS env.',
      execute: (args: any) => {
        window.alert("Settings file launched.");
      }
    });

    palette.addItem({
      command,
      category: "ROS"
    });
    
    menu.addItem({ command });
  }
};