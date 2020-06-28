import { JupyterFrontEndPlugin } from '@jupyterlab/application';

import { rosLogConsole } from "./logconsole/index";
import { rosMenu } from "./menu/index";
import { rosSettings } from "./settings/index";
import { rosStatus } from "./status/index";
import { rosZethus } from "./zethus/index";

const ros: JupyterFrontEndPlugin<any>[] = [
  rosLogConsole,
  rosMenu,
  rosSettings,
  rosStatus,
  rosZethus
];

export default ros;