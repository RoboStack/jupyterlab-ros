import { runIcon, stopIcon } from '@jupyterlab/ui-components';
import { MainAreaWidget, ToolbarButton } from '@jupyterlab/apputils';
import { Signal } from '@lumino/signaling';

import React from 'react';

import BagPanel from './bagPanel';
import BagModel from './bagModel';

export default class BagWidget extends MainAreaWidget<BagPanel> {

  private _play: Play;
  private _stop: Stop;
  private _running: Running;

  constructor(content: BagPanel) {
    super({ content });
    this.id = 'jupyterlab-ros/bag:widget';
    this.title.label = this.content.model.session.name;
    this.title.closable = true;

    this._play = new Play(this.onPlay);
    this.toolbar.addItem('play', this._play);

    this._stop = new Stop(this.onStop);
    this.toolbar.addItem('stop', this._stop);

    this._running = new Running();
    this.toolbar.addItem('running', this._running);

    this.content.model.statusChanged.connect(this._statusChanged, this);
  }

  dispose(): void {
    super.dispose();
    Signal.clearData(this);
  }

  onPlay = (event) => {
    this.content.model.play();
  }

  onStop = (event) => {
    this.content.model.stop();
  }

  private _statusChanged(sender: BagModel, status: string): void {
    if (status === "idle") {
      this._play.disable(false);
      this._stop.disable(true);
      this._running.disable(true);

    } else if (status == "busy") {
      this._play.disable(true);
      this._stop.disable(false);
      this._running.disable(false);
    }

    this.update();
  }
}

class Play extends ToolbarButton {
  private onClick: any = null;
  private _disabled: boolean = true;

  constructor(onClick: any) {
    super();
    this.id = 'jupyterlab-ros/bag:play';
    this.title.label = "Play";
    this.title.icon = runIcon;

    this.onClick = onClick;
  }

  disable(disable: boolean): void {
    this._disabled = disable;
    this.update();
  }

  render(): JSX.Element {
    return (
      <>
      { this._disabled ?
        <a href="#" onClick={this.onClick} className="btn-disabled">
          <runIcon.react tag="span" right="7px" top="5px" />
        </a>
        :
        <a href="#" onClick={this.onClick}>
          <runIcon.react tag="span" right="7px" top="5px" />
        </a>
      }
      </>
    );
  }
}

class Stop extends ToolbarButton {
  private onClick: any = null;
  private _disabled: boolean = true;

  constructor(onClick: any) {
    super();
    this.id = 'jupyterlab-ros/bag:stop';
    this.title.label = "Stop";
    this.title.icon = stopIcon;

    this.onClick = onClick;
  }

  disable(disable: boolean): void {
    this._disabled = disable;
    this.update();
  }

  render(): JSX.Element {
    return (
      <>
      { this._disabled ?
        <a href="#" onClick={this.onClick} className="btn-disabled">
          <stopIcon.react tag="span" right="7px" top="5px" />
        </a>
        :
        <a href="#" onClick={this.onClick}>
          <stopIcon.react tag="span" right="7px" top="5px" />
        </a>
      }
      </>
    );
  }
}

class Running extends ToolbarButton {
  private _disabled: boolean = true;

  constructor() {
    super();
    this.id = 'jupyterlab-ros/bag:running';
    this.title.label = "Running";
    this.title.icon = "running";
  }

  disable(disable: boolean): void {
    this._disabled = disable;
    this.update();
  }

  render(): JSX.Element {
    return (
      <>
      { this._disabled ? <div/> :
        <div className="loader"><div className="lds-running"><div></div><div></div><div></div><div></div></div></div>
      }
      </>
    );
  }
}