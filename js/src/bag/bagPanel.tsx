import { ReactWidget, defaultSanitizer, showDialog, Dialog } from '@jupyterlab/apputils';
import { renderText } from '@jupyterlab/rendermime';
import { Signal } from '@lumino/signaling';

import { runIcon } from '@jupyterlab/ui-components';
import React from 'react';

import BagModel from './bagModel';

export default class BagPanel extends ReactWidget {
  private _model: BagModel = null;

  private _isLoading = true;
  private _isTypesVisible = false;
  private _isTopicsVisible = false;
  
  constructor(model: BagModel){
    super();
    this._model = model;

    this._model.stateChanged.connect(this._modelChanged, this);
    this._model.statusChanged.connect(this._statusChanged, this);

    this._model.info();
  }

  dispose() {
    this._model.session?.dispose();
    Signal.clearData(this);
    super.dispose();
  }

  get model(): BagModel { return this._model; }

  private _modelChanged(): void {
    this._isLoading = false;
    this.update();
  }

  private _statusChanged(sender: BagModel, status: string): void {
    if (status == "loading") {
      this._isLoading = true;
    }

    this.update();
  }

  private _showTypes(hide: boolean): void {
    if (hide) this._isTypesVisible = !this._isTypesVisible;
    else this._isTypesVisible = false;
    this.update();
  }

  private _showTopics(hide: boolean): void {
    if (hide) this._isTopicsVisible = !this._isTopicsVisible;
    else this._isTopicsVisible = false;
    this.update();
  }

  render(): JSX.Element {
    if (this._model?.error) {
      const body = document.createElement('div');
      renderText({host: body, sanitizer: defaultSanitizer, source: this._model?.error });

      showDialog({
        title: "ERROR Bag: " + this._model.session.name,
        body: <div className=".jp-RenderedText" dangerouslySetInnerHTML={{ __html: body.innerHTML }} />,
        buttons: [ Dialog.okButton() ]
      });
    }

    return (
      <div className="bagPanel">
        { this._isLoading ?
            <div className="loader"> <div className="lds-ring"><div></div><div></div><div></div><div></div></div> </div>
          :
            <div className="bag">
              <div>Path: {this._model.bag?.path}</div>
              <div>Version: {this._model.bag?.version}</div>
              <div>Duration: {this._model.bag?.duration}</div>
              <div>Start: {this._model.bag?.start}</div>
              <div>End: {this._model.bag?.end}</div>
              <div>Size: {this._model.bag?.size}</div>
              <div>Messages: {this._model.bag?.messages}</div>
              <div>Compresion: {this._model.bag?.compression}</div>
              
              <div onClick={()=>{ this._showTypes(true); }}>
                Types: { !this._isTypesVisible &&
                  <runIcon.react tag="span" top="5px" width="14px" height="14px" />
                }
              </div>
              { this._isTypesVisible && 
                <table onClick={() => {this._showTypes(false);}} style={{paddingLeft: "15px"}}>
                  <tbody>
                    {this._model.bag?.types.map( type => {
                      return (<tr key={type.type}><td>{type.type}</td><td>{type.hash}</td></tr>);
                    })}
                  </tbody>
                </table>
              }

              <div onClick={() => {this._showTopics(true);}}>
                Topics: { !this._isTopicsVisible &&
                  <runIcon.react tag="span" top="5px" width="14px" height="14px" />
                }
              </div>
              
              { this._isTopicsVisible &&
                <table onClick={() => {this._showTopics(false);}} style={{paddingLeft: "15px"}}>
                  <tbody>
                    <tr><th>Topic</th><th>Message type</th><th>Message count</th><th>Connections</th><th>Frequency</th></tr>
                    {this._model.bag?.topics?.map( topic => {
                      return (<tr key={topic.topic}><td>{topic.topic}</td><td>{topic.msg_type}</td><td>{topic.message_count}</td><td>{topic.connections}</td><td>{topic.frequency}</td></tr>);
                    })}
                  </tbody>
                </table>
              }
            </div>
        }
      </div>
    );
  }
}