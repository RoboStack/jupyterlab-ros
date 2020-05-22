import { JupyterFrontEndPlugin } from '@jupyterlab/application';

import { rosStatus } from "./status/index";
import { rosMenu } from "./menu/index";

const ros: JupyterFrontEndPlugin<any>[] = [
  rosStatus,
  rosMenu,
];

export default ros;
