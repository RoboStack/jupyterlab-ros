import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Menu } from '@lumino/widgets';

export const menu: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-ros/menu',
  autoStart: true,
  requires: [IMainMenu],
  optional: [],
  activate: (app: JupyterFrontEnd, mainMenu: IMainMenu) => {
    
    const { commands } = app;

    // Create a new menu
    const menu: Menu = new Menu({ commands });
    menu.title.label = 'ROS';
    mainMenu.addMenu(menu, { rank: 80 });
    
    // Open Zethus
    menu.addItem({ command: 'jupyterlab-ros/zethus:open' });
    menu.addItem({ type: 'separator' });

    // Open Logger
    menu.addItem({ command: 'jupyterlab-ros/logConsole:open' });
    menu.addItem({ type: 'separator' });

    // Open Settings
    menu.addItem({ command: 'jupyterlab-ros/settings:open' });
  }
};