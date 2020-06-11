import { IFrame } from '@jupyterlab/apputils';
import { PageConfig } from '@jupyterlab/coreutils';

export class ZethusWidget extends IFrame {
  constructor() {
    super();
    const baseUrl = PageConfig.getBaseUrl();
    this.url = baseUrl + 'jupyterlab-ros/zethus/index.html';
    this.id = 'Zethus';
    this.title.label = 'Zethus';
    this.title.closable = true;
    this.node.style.overflowY = 'auto';
  }
}