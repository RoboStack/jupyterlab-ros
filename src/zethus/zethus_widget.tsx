import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

// @ts-ignore
import Zethus from '../../thirdparty/zethus/build-lib/zethus.umd.js';
// @ts-ignore
import Panels from '../../thirdparty/zethus/build-lib/panels.umd.js';

/**
 * A SettingsWidget Lumino Widget that wraps a SettingsComponent.
 */
export class ZethusWidget extends ReactWidget {
  /**
   * Constructs a new Settings.
   */
  constructor() {
    super();
    this.addClass('jp-ReactWidget');
  }

  render(): JSX.Element {
    return (
      <Zethus/>
    );
  }
}