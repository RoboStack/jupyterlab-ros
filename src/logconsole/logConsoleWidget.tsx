import { JupyterFrontEnd } from '@jupyterlab/application';
import { MainAreaWidget, CommandToolbarButton, showDialog, Dialog } from '@jupyterlab/apputils';
import { listIcon, } from '@jupyterlab/ui-components';
import React from 'react';

import ROSLIB from 'roslib';

import { LogConsolePanel } from './logConsolePanel';
import { LogStatus } from './logStatus';
import { LogLevelSwitcher } from './logLevelSwitcher';
import { LogNodeSwitcher } from './logNodeSwitcher';
import { RosLog } from './log';

export class LogConsoleWidget extends MainAreaWidget<LogConsolePanel> {
  
  private logs: RosLog[];
  private ros: ROSLIB.Ros;

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

    this.ros = new ROSLIB.Ros({url:"ws://" + window.location.host + "/jupyterlab-ros/bridge"});
    this.ros.on('connection', this.onConection);
    this.ros.on('error', this.onError);
    this.ros.on('close', this.onClose);

    this.status = new LogStatus(this.ros);
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
    console.log("disposed");
    this.ros = null;
    super.dispose();
  }

  private onConection = (): void => {
    console.log('Connected to websocket server.');
    this.status.setConnected(true);

    this.ros.getNodes((nodes) =>{
      this.nodeSwicher.refreshNodes(nodes);
      
      const listener = new ROSLIB.Topic({
        ros: this.ros,
        name: '/rosout',
        messageType: 'rosgraph_msgs/Log'
      });
  
      listener.subscribe(this.onMessage);
    });
  }

  private onError = (error): void => {
    this.status.setConnected(false);

    showDialog({
      title: "Warning",
      body: <span className="jp-About-body">Web bridge server is not running!</span>,
      buttons: [Dialog.okButton()]
    }).catch( e => console.log(e) );
  }

  private onClose = (): void => {
    console.log('Connection close with websocket server.');
    this.status.setConnected(false);
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