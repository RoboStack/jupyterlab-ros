import { ReactWidget, showDialog, Dialog } from '@jupyterlab/apputils';
import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';

import React from 'react';

export class ROSStatusBridge extends ReactWidget {
  constructor() {
    super();
    this.addClass('jp-ReactWidget');
  }
  
  render(): JSX.Element {
    this.node.title = "Ros bridge status";
    return <Status/>;
  }
}


type Props = {}
type State = {
  status: boolean;
}

class Status extends React.Component<Props, State> {
  readonly state: State = {
    status: false,
  };

  constructor(props: Props) {
    super(props);
  }

  componentDidMount = () => this.checkStatus();

  checkStatus = () => {
    const settings = ServerConnection.makeSettings();
    const requestUrl = URLExt.join(
      settings.baseUrl,
      'jupyterlab-ros',
      'master'
    );

    ServerConnection.makeRequest(requestUrl, {}, settings)
      .then( async (res) => {
        const data = await res.json();
        this.setState({ status: data.status });
        if (data.status) setTimeout(this.checkStatus, 5000);
      
      }).catch( err => console.log(err) );
  }

  toggle = () => {
    let label = this.state.status ? "Are you sure you want to stop bridge server?" : "Are you sure you want to launch bridge server?";

    showDialog({
      title: "Web bridge server",
      body: <span className="jp-About-body">{label}</span>,
      buttons: [
        Dialog.okButton(),
        Dialog.cancelButton()
      ]
    }).then(res => {
      let cmd = "";
      if (res.button.label != "OK") return;
      else if (res.button.label == "OK" && this.state.status) cmd = "stop";
      else cmd = "start";

      const settings = ServerConnection.makeSettings();
      const requestUrl = URLExt.join(
        settings.baseUrl,
        'jupyterlab-ros',
        'master'
      );
      const req = {
        body: JSON.stringify({ cmd }),
        method: 'POST'
      }

      ServerConnection.makeRequest(requestUrl, req, settings)
        .then( async (res) => {
          if (!res.ok) { this.setState({ status: false }); return; }
          
          const data = await res.json();
          this.setState({ status: data.status });
          if (data.status) this.checkStatus();

        }).catch( err => console.log(err) );

    }).catch( e => console.log(e) );
  }
  
  render() {
    return (
      <div className="main" onClick={this.toggle}>
        <span style={{ marginTop: '3px' }}>{"ROS: "}</span>
        { this.state.status && <div className="ok" /> }
        { this.state.status == false && <div className="ko" /> }
      </div>
    );
  }
}