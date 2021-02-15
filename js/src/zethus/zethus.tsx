import { IFrame } from '@jupyterlab/apputils';
import { PageConfig } from '@jupyterlab/coreutils';

type TSandboxPerm = 'allow-forms' | 'allow-modals' | 'orientation-lock' |
    'allow-pointer-lock' | 'allow-popups' | 'allow-popups-to-escape-sandbox' |
    'allow-presentation' | 'allow-same-origin' | 'allow-scripts' | 'allow-top-navigation';


/** A type that can enable sandbox permissions */
type TSandboxOptions = {[P in TSandboxPerm]?: boolean};

const DEFAULT_SANDBOX: TSandboxOptions = {
  'allow-forms': true,
  'allow-presentation': true,
  'allow-same-origin': true,
  'allow-scripts': true,
};

export default class ZethusWidget extends IFrame {
  constructor() {
    super();
    const baseUrl = PageConfig.getBaseUrl();
    this.url = baseUrl + 'ros/zethus/index.html';
    this.id = 'Zethus';
    this.title.label = 'Zethus';
    this.title.closable = true;
    this.node.style.overflowY = 'auto';
    this.node.style.background = '#FFF';

    this.sandbox = ["allow-forms", "allow-modals", "allow-orientation-lock", "allow-pointer-lock", "allow-popups", "allow-presentation", "allow-same-origin", "allow-scripts", "allow-top-navigation", "allow-top-navigation-by-user-activation"];
  }

  dispose(): void { super.dispose(); }
  onCloseRequest(): void { this.dispose() }
}