import { JupyterFrontEndPlugin } from '@jupyterlab/application';

import { rosStatus } from "./status/index";
import { rosMenu } from "./menu/index";
//import { rosZethus } from "./ros_zethus/index";

const ros: JupyterFrontEndPlugin<any>[] = [
  rosStatus,
  rosMenu
  //rosZethus
];

export default ros;
