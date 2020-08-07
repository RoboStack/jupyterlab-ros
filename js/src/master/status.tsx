import { ReactWidget, showDialog, Dialog } from '@jupyterlab/apputils';
import { defaultSanitizer } from '@jupyterlab/apputils';
import { renderText } from '@jupyterlab/rendermime';
import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';

import React from 'react';

export default class StatusMaster extends ReactWidget {
  private ws: WebSocket = null;
  private status: boolean = false;

  constructor() {
    super();
    this.node.title = "ROS Master";
    this.addClass('jp-ReactWidget');
    
    const server = ServerConnection.makeSettings();
    const url = URLExt.join(server.wsUrl, 'ros/master');
    this.ws = new WebSocket(url);
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;
    this.status = false;
  }

  dispose = () => {
    console.log("disposed");
    this.ws.close();
    this.ws = null;
  }

  onOpen = (msg) => { this.ws.send(JSON.stringify({ cmd: "start" })); }
  onError = (msg) => console.error(msg);
  onClose = (msg) => {}
  onMessage = (message) => {
    const msg = JSON.parse(message.data);
    
    if (msg['error']) {
      const body = document.createElement('div');
      renderText({host: body, sanitizer: defaultSanitizer, source: msg['error'] });

      showDialog({
        title: "Master: WARNING",
        body: <div className=".jp-RenderedText" dangerouslySetInnerHTML={{ __html: body.innerHTML }} />,
        buttons: [ Dialog.okButton() ]
      });

    } else if (msg['output']) {
      const body = document.createElement('div');
      renderText({host: body, sanitizer: defaultSanitizer, source: msg['output'] });

      showDialog({
        title: "Master FINNISHED",
        body: <div className=".jp-RenderedText" dangerouslySetInnerHTML={{ __html: body.innerHTML }} />,
        buttons: [ Dialog.okButton() ]
      });
    }

    this.status = msg['status'];
    this.update();
  }

  start = () => {
    showDialog({
      title: "Master",
      body: <pre className=".jp-RenderedText">Do you want to START ROS Master?</pre>,
      buttons: [ Dialog.okButton(), Dialog.cancelButton() ]
    }).then(res => {
      if (res.button.label != "OK") return;
      this.ws.send(JSON.stringify({ cmd: "start" }));
    }).catch( e => console.log(e) );
  }

  stop = () => {
    showDialog({
      title: "Master",
      body: <pre className=".jp-RenderedText">Do you want to STOP ROS Master?</pre>,
      buttons: [ Dialog.okButton(), Dialog.cancelButton() ]
    }).then(res => {
      if (res.button.label != "OK") return;
      this.ws.send(JSON.stringify({ cmd: "stop" }));
    }).catch( e => console.log(e) );
  }

  toggle = () => {
    if (this.status == false ) this.start();
    else this.stop();
  }
  
  render(): JSX.Element {
    return (
      <a href="#" onClick={this.toggle} className="main">
        <div className="ros-logo"/>
        { this.status ?
            <div className="ok"/>
          :
            <div className="ko"/>
        }
      </a>
    );
  }
}