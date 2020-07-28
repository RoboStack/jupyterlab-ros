import { Kernel, KernelMessage, Session } from '@jupyterlab/services';

import { IOutput } from '@jupyterlab/nbformat';

type Type = {
  type: string,
  hash: string,
}

type Topic = {
  topic: string,
  type: string,
  number: number,
  connections: number,
  frequency: number
}

type Bag = {
  path: string,
  version: string,
  start: string,
  end: string,
  duration: string,
  size: string,
  messages: number,
  compression: string,
  types: Type[],
  topics: Topic[]
}

export default class BagModel {
  private _session: Session.ISessionConnection = null;
  private _error: string = null;
  private _bag: Bag = null;

  constructor(session: Session.ISessionConnection) {
    console.log("Model");
    console.log(session);
    this._session = session;
    this._session.statusChanged.connect(this.status);
  }

  get session(): Session.ISessionConnection { return this._session; }
  get error(): string { return this._error; }
  get bag(): Bag { return this._bag; }

  private status(connection: Session.ISessionConnection, status: Kernel.Status) {
    console.log(status);
  }

  private onIOPub(message: KernelMessage.IIOPubMessage): void {
    console.log("onIOPub");
    console.log(message);

    let msg = null;

    switch (message.header.msg_type) {
      case 'execute_result':
      case 'display_data':
      case 'update_display_data':
        msg = message.content as IOutput;
        console.log(msg);
        break;
      default:
        break;
    }
  }

  private onReply(msg: KernelMessage.IExecuteReplyMsg): void {
    console.log("onReply", msg);
  }

  private onStdin(msg: KernelMessage.IStdinMessage<KernelMessage.StdinMessageType>): void {
    console.log("onStdin", msg);
  }

  private infoReply(msg: any): void {
    this._bag.path = msg['path'];
    this._bag.version = msg['version'];
    this._bag.start = msg['start'];
    this._bag.end = msg['end'];
    this._bag.duration = msg['duration'];
    this._bag.size = msg['size'];
    this._bag.messages = msg['messages'];
    this._bag.compression = msg['compression'];
    this._bag.types = [];
    this._bag.topics = [];

    for (let key in msg['types']) {
      this._bag.types.push({ type: key, hash: msg['types'][key] });
    }

    for (let key in msg['topics']) {
      this._bag.topics.push({
        topic: key,
        type: msg['topics'][key][0],
        number: msg['topics'][key][1],
        connections: msg['topics'][key][2],
        frequency: msg['topics'][key][3]
      });
    }
  }

  info() {
    console.log("get info");
    if (!this._session || !this._session?.kernel) return;
    console.log("path: ", this._session.path);

    const code = 
`
from datetime import datetime
import rosbag
bag = rosbag.Bag("${this._session.path}", mode='r', allow_unindexed=True)
start = datetime.utcfromtimestamp( bag.get_start_time() )
end = datetime.utcfromtimestamp( bag.get_end_time() )
types, topics = bag.get_type_and_topic_info()

res = {
    'path': bag.filename,
    'version': float(bag.version) / 100,
    'start': str(start),
    'end': str(end),
    'duration': str(end - start),
    'size': str(round(bag.size / 1048576.0, 2)) + " MB",
    'messages': bag.get_message_count(),
    'compression': bag.compression,
    'types': types,
    'topics': topics,
}
`;

    const future = this._session?.kernel?.requestExecute({ code: somecode });
    future.onIOPub = this.onIOPub;
    future.onReply = this.onReply;
    future.onStdin = this.onStdin;
  }
}

const somecode = `
from ipylab import JupyterFrontEnd, Panel, SplitPanel
from ipywidgets import IntSlider, Layout
app = JupyterFrontEnd()
panel = Panel()
slider = IntSlider()
panel.children = [slider]
app.shell.add(panel, 'main', { 'mode': 'split-right' })
`;