import { JupyterFrontEndPlugin } from '@jupyterlab/application';

import { rosMenu } from "./menu/index";
import { rosSettings } from "./settings/index";
import { rosStatus } from "./status/index";
import { rosZethus } from "./zethus/index";

const ros: JupyterFrontEndPlugin<any>[] = [
  rosMenu,
  rosSettings,
  rosStatus,
  rosZethus
];

export default ros;