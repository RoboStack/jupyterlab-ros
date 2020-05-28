import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

export const rosSettings: JupyterFrontEndPlugin<void> = {
  id: "jupyterlab-ros/settings",
  autoStart: true,
  requires: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settings: ISettingRegistry) => {

    /**
     * Load the settings for this extension
     *
     * @param setting Extension settings
     */
    function loadSetting(setting: ISettingRegistry.ISettings): void {
      // Read the settings and convert to the correct type
      let environment = setting.get('environment').composite as string;
      let bridge = setting.get('bridge').composite as string;
      
      window.alert(`ROS settings changed: ${environment} ${bridge}`);
    }

    // Wait for the application to be restored and
    // for the settings for this plugin to be loaded
    Promise.all([app.restored, settings.load("jupyterlab-ros:settings-ros")])
      .then(([, setting]) => {
        // Read the settings
        // loadSetting(setting);

        // Listen for your plugin setting changes using Signal
        setting.changed.connect(loadSetting);

      }).catch(reason => console.error(`Something went wrong when reading the settings.\n${reason}`) );
  }
};