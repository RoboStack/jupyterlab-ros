import { DocumentRegistry, DocumentWidget } from '@jupyterlab/docregistry';
import { runIcon, stopIcon } from '@jupyterlab/ui-components';
import { ToolbarButton,  } from '@jupyterlab/apputils';

import React from 'react';

import BagModel from './bagModel';
import BagPanel from './bagPanel';

export default class BagDocument extends DocumentWidget<BagPanel, BagModel> {

  constructor(content: BagPanel, context: DocumentRegistry.IContext<BagModel>) {
    super({ content, context });
    this.id = 'jupyterlab-ros/bag:widget';
    this.title.label = context.localPath;
    this.title.closable = true;

    this.toolbar.addItem('play', new Play(this.onPlay));
    this.toolbar.addItem('stop', new Stop(this.onStop));
  }

  onPlay = (event) => {
    // PLAY: { 'code': 1, 'path': this.path, 'options': "" }
  }

  onStop = (event) => {
    // STOP: { 'code': 2, 'path': this.path, 'options': "" }
  }  
}

class Play extends ToolbarButton {
  private onClick: any = null;

  constructor(onClick: any) {
    super();
    this.id = 'jupyterlab-ros/bag:play';
    this.title.label = "Play";
    this.title.icon = runIcon;

    this.onClick = onClick;
  }

  render(): JSX.Element {
    return (
      <a href="#" onClick={this.onClick}>
        <runIcon.react tag="span" right="7px" top="5px" />
      </a>
    );
  }
}

class Stop extends ToolbarButton {
  private onClick: any = null;

  constructor(onClick: any) {
    super();
    this.id = 'jupyterlab-ros/bag:stop';
    this.title.label = "Stop";
    this.title.icon = stopIcon;

    this.onClick = onClick;
  }

  render(): JSX.Element {
    return (
      <a href="#" onClick={this.onClick}>
        <stopIcon.react tag="span" right="7px" top="5px" />
      </a>
    );
  }
}