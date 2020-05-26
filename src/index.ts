import { JupyterFrontEndPlugin } from '@jupyterlab/application';

import { rosStatus } from "./status/index";
import { rosMenu } from "./menu/index";
import { rosSettings } from "./settings/index";

const ros: JupyterFrontEndPlugin<any>[] = [
  rosStatus,
  rosMenu,
  rosSettings
];

export default ros;
