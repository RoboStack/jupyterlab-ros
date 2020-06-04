import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

import Zethus from "zethus/dist/zethus";

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
    return <Zethus/>;
  }
}