import { ReactWidget, defaultSanitizer, showDialog, Dialog } from '@jupyterlab/apputils';
import { renderText } from '@jupyterlab/rendermime';

import React from 'react';

import BagModel from './bagModel';

export default class BagPanel extends ReactWidget {
  private _model: BagModel = null;
  
  constructor(model: BagModel){
    super();
    console.log("Panel");
    this._model = model;

    this._model.info();
  }

  dispose() {
    this._model.session?.shutdown();
    super.dispose();
  }

  get model(): BagModel { return this._model; }

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
      <div>
        <div>Path: {this._model.bag?.path}</div>
        <div>Version: {this._model.bag?.version}</div>
        <div>Duration: {this._model.bag?.duration}</div>
        <div>Start: {this._model.bag?.start}</div>
        <div>End: {this._model.bag?.end}</div>
        <div>Size: {this._model.bag?.size}</div>
        <div>Messages: {this._model.bag?.messages}</div>
        <div>Compresion: {this._model.bag?.compression}</div>
        <div>Types:</div>
          <table>
            <tbody>
              {this._model.bag?.types.map( type => {
                <tr>
                  <td>{type.type}</td>
                  <td>{type.hash}</td>
                </tr>
              })}
            </tbody>
          </table>

        <div>Topics:</div>
        <table>
          <tbody>
            <tr><th>Topic</th><th>Message type</th><th>Message count</th><th>Connections</th><th>Frequency</th></tr>
            {this._model.bag?.topics.map( topic => {
              <tr><td>{topic.topic}</td><td>{topic.type}</td><td>{topic.number}</td><td>{topic.connections}</td><td>{topic.frequency}</td></tr>
            })}
          </tbody>
        </table>
      </div>
    );
  }
}