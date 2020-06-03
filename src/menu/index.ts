import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Menu } from '@lumino/widgets';
import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';

import { SettingsWidget } from './settings';
import ROSLIB from 'roslib';

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

        const settings = ServerConnection.makeSettings();

        const url = URLExt.join(
          settings.wsUrl,
          'jupyterlab-ros',
          'bridge'
        );

        console.log(url);

        const ros = new ROSLIB.Ros({});
        ros.connect(url);

        ros.on('connection', function() {
          console.log('Connected to websocket server.');
          var cmdVel = new ROSLIB.Topic({
            ros : ros,
            name : '/cmd_vel',
            messageType : 'geometry_msgs/Twist'
          });
          
          var twist = new ROSLIB.Message({
            linear : {
              x : 0.1,
              y : 0.2,
              z : 0.3
            },
            angular : {
              x : -0.1,
              y : -0.2,
              z : -0.3
            }
          });
          
          console.log("Publishing cmd_vel");
          cmdVel.publish(twist);
          // ros.close();
        });
        
        ros.on('error', function(error) {
          console.log('Error connecting to websocket server: ', error);
        });
        
        ros.on('close', function() {
          console.log('Connection to websocket server closed.');
        });
      }
    });

    palette.addItem({
      command,
      category: "ROS",
      args: { status: 'stoped' }
    });

    menu.addItem({ command });
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