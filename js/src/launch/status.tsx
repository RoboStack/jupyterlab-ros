import { ReactWidget, showDialog, Dialog } from '@jupyterlab/apputils';
import { renderText } from '@jupyterlab/rendermime';
import { defaultSanitizer } from '@jupyterlab/apputils';
import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';

import React from 'react';

export default class StatusLaunch extends ReactWidget {
  private paths: string[] = null;
  private ws: WebSocket = null;

  constructor() {
    super();
    this.node.title = 'Launch status.';
    this.addClass('jp-ReactWidget');

    this.paths = [];
    const server = ServerConnection.makeSettings();
    const url = URLExt.join(server.wsUrl, 'ros/launch');
    this.ws = new WebSocket(url);
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;
  }

  onOpen = (event) => { } // console.log(event); }
  onError = (event) => { console.error(event); }
  onClose = (event) => { } // console.log(event); }
  onMessage = (message) => {
    const msg = JSON.parse(message.data);
    const body = document.createElement('div');
    
    switch (msg.code) {
      case 0: this.paths = msg.paths; break;
      case 1: this.paths.push(msg.path); break;
      case 2:
        renderText({host: body, sanitizer: defaultSanitizer, source: msg.msg });
        showDialog({
          title: "WARNING: " + msg.path,
          body: <div className=".jp-RenderedText" dangerouslySetInnerHTML={{ __html: body.innerHTML }}></div>,
          buttons: [ Dialog.okButton() ]
        });
        break;
      case 3:
      case 4:
        var index = this.paths.indexOf(msg.path);
        if (index !== -1) this.paths.splice(index, 1);

        renderText({host: body, sanitizer: defaultSanitizer, source: msg.msg });
        showDialog({
          title: (msg.code == 3 ? "FINISHED: " : "ERROR: " ) + msg.path,
          body: <div className=".jp-RenderedText" dangerouslySetInnerHTML={{ __html: body.innerHTML }}></div>,
          buttons: [ Dialog.okButton() ]
        });
        break;
      
      default:
        break;
    }
    this.update();
  }

  launch = (path) => {
    this.ws.send( JSON.stringify({ cmd: 'start', path }) );
  }

  toggle = (path) => {
    showDialog({
      title: path,
      body: <pre className=".jp-RenderedText">This execution will be stoped. Are you sure?</pre>,
      buttons: [ Dialog.okButton(), Dialog.cancelButton() ]
    }).then(res => {
      if (res.button.label != "OK") return;
      this.ws.send( JSON.stringify({ cmd: 'stop', path }) );

    }).catch( e => console.log(e) );
  }
  
  render(): JSX.Element {
    return (
      <a href="#" className="main">
        {
          this.paths.map( (path, i) => {
            return (
              <span key={i} style={{ margin: '3px' }} onClick={() => this.toggle(path)}>
                { path.split('/').pop() }
              </span>
            );
          })
        }
      </a>
    );
  }
}