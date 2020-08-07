import { JupyterFrontEnd } from '@jupyterlab/application';
import { MainAreaWidget, CommandToolbarButton } from '@jupyterlab/apputils';
import { listIcon, } from '@jupyterlab/ui-components';
import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';

import ROSLIB from 'roslib';

import { LogConsolePanel } from './logConsolePanel';
import { LogStatus } from './logStatus';
import { LogLevelSwitcher } from './logLevelSwitcher';
import { LogNodeSwitcher } from './logNodeSwitcher';
import { RosLog } from './log';

export class LogConsoleWidget extends MainAreaWidget<LogConsolePanel> {
  
  private logs: RosLog[];
  private url: string;
  private ros: ROSLIB.Ros;
  private listener: ROSLIB.Topic;

  private status: LogStatus;
  private levelSwitcher: LogLevelSwitcher;
  private nodeSwicher: LogNodeSwitcher;

  constructor(app: JupyterFrontEnd) {
    super({ content: new LogConsolePanel() });
    this.addClass('jp-logConsole');
    this.id = 'jupyterlab-ros/logConsole:widget';
    this.title.closable = true;
    this.title.label = 'ROS Log console';
    this.title.icon = listIcon;

    const server = ServerConnection.makeSettings();
    this.url = URLExt.join(server.wsUrl, 'ros/bridge');
    this.ros = new ROSLIB.Ros({ url: this.url });
    this.ros.on('connection', this.onConection);
    this.ros.on('error', this.onError);
    this.ros.on('close', this.onClose);
    this.listener = new ROSLIB.Topic({
      ros: this.ros,
      name: '/rosout',
      messageType: 'rosgraph_msgs/Log'
    });
    
    this.listener.subscribe(this.onMessage);

    this.status = new LogStatus(this.ros, this.url);
    this.levelSwitcher = new LogLevelSwitcher(this.content);
    this.nodeSwicher = new LogNodeSwitcher(this.content);
    this.logs = [];

    // Adding the buttons in widget toolbar
    this.toolbar.addItem('status', this.status);
    this.toolbar.addItem('checkpoint',
      new CommandToolbarButton({commands: app.commands, id: 'jupyterlab-ros/logConsole:checkpoint'})
    );
    this.toolbar.addItem('clear', 
      new CommandToolbarButton({commands: app.commands, id: 'jupyterlab-ros/logConsole:clear'})
    );
    this.toolbar.addItem('level', this.levelSwitcher);
    this.toolbar.addItem('topic', this.nodeSwicher);
  }

  dispose(): void {
    this.listener?.unsubscribe();
    this.listener = null;
    this.ros?.close();
    this.ros = null;
    super.dispose();
  }

  private onConection = (): void => {
    this.status.setConnected(true);

    this.ros.getNodes((nodes) =>{
      this.nodeSwicher.refreshNodes(nodes);
    });
  }

  private onError = (error): void => {
    this.status.setConnected(false);

    /*showDialog({
      title: "Log Console: WARNING",
      body: <span className="jp-About-body">Master not running</span>,
      buttons: [Dialog.okButton()]
    }).catch( e => console.log(e) );*/
  }

  private onClose = (): void => {
    this.status.setConnected(false);
    
    setTimeout(() => {
      this.ros?.connect(this.url);
    }, 5000);
  }

  private onMessage = (msg): void => {
    const log: RosLog = {
      date: new Date(msg.header.stamp.secs * 1000),
      level: msg.level,
      name: msg.name,
      file: msg.file,
      function: msg.function,
      line: msg.line,
      topics: msg.topics,
      msg: msg.msg,
      toggled: false
    };
    
    this.logs.push(log);
    this.content.setLogs(this.logs);
    this.nodeSwicher.setNode(msg.name);
  }

  public checkpoint = (): void => {
    const log: RosLog = {
      date: new Date(),
      level: 0,
      name: "",
      file: "",
      function: "",
      line: 0,
      topics: [],
      msg: "",
      toggled: false
    };
    this.logs.push(log);
    this.content.setLogs(this.logs);
  }
  
  public clear = (): void => {
    this.logs = [];
    this.content.setLogs(this.logs);
    this.ros.getNodes((nodes) =>{
      this.nodeSwicher.refreshNodes(nodes);
    });
  }
}