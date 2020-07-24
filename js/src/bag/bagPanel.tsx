import { ReactWidget, defaultSanitizer, showDialog, Dialog } from '@jupyterlab/apputils';
import { renderText } from '@jupyterlab/rendermime';

import React from 'react';

import BagModel from './bagModel';

export default class BagPanel extends ReactWidget {
  private path: string = null;
  private model: BagModel = null;
  
  constructor(path: string, model: BagModel){
    super();
    this.path = path;
    this.model = model;
    this.model.contentChanged.connect(this.update, this);
    console.log("panel");
  }

  render(): JSX.Element {
    if (this.model.error) {
      const body = document.createElement('div');
      renderText({host: body, sanitizer: defaultSanitizer, source: this.model.error });

      showDialog({
        title: "ERROR Bag: " + this.path,
        body: <div className=".jp-RenderedText" dangerouslySetInnerHTML={{ __html: body.innerHTML }} />,
        buttons: [ Dialog.okButton() ]
      });
    }

    return (
      <div>
        <div>Path: {this.model.path}</div>
        <div>Version: {this.model.version}</div>
        <div>Duration: {this.model.duration}</div>
        <div>Start: {this.model.start}</div>
        <div>End: {this.model.end}</div>
        <div>Size: {this.model.size}</div>
        <div>Messages: {this.model.messages}</div>
        <div>Compresion: {this.model.compression}</div>
        <div>Types:</div>
          <table>
            <tbody>
              {this.model.types.map( type => {
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
            {this.model.topics.map( topic => {
              <tr><td>{topic.topic}</td><td>{topic.type}</td><td>{topic.number}</td><td>{topic.connections}</td><td>{topic.frequency}</td></tr>
            })}
          </tbody>
        </table>
      </div>
    );
  }
}