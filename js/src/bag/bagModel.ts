import { Kernel, KernelMessage, Session } from '@jupyterlab/services';
import { ISignal, Signal } from '@lumino/signaling';

type Type = {
  type: string,
  hash: string,
}

type Topic = {
  topic: string,
  msg_type: string,
  message_count: number,
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
  private _stateChanged = new Signal<BagModel, void>(this);
  private _error: string = null;
  private _bag: Bag = null;

  constructor(session: Session.ISessionConnection) {
    console.log("Model");
    console.log(session);
    this._session = session;
    this._session.statusChanged.connect(this.status);
  }

  get stateChanged(): ISignal<BagModel, void> { return this._stateChanged; }
  get session(): Session.ISessionConnection { return this._session; }
  get error(): string { return this._error; }
  get bag(): Bag { return this._bag; }

  private status(connection: Session.ISessionConnection, status: Kernel.Status) {
    //console.log(status);
  }

  info() {
    console.log("get info");
    if (!this._session || !this._session?.kernel) return;
    console.log("path: ", this._session.path);

    const code = `
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
        'types': [ {'type':k, 'hash':v} for k, v in types.items()],
        'topics': [ {'topic':k, 'msg_type':v[0], 'message_count':v[1], 'connections':v[2], 'frequency':v[3]} for k, v in types.items()],
    }
    res`;

    const future = this._session?.kernel?.requestExecute({ code });
    future.onIOPub = (msg: KernelMessage.IIOPubMessage) => {
      console.log("onIOPub: ", msg);
      if ( msg.header.msg_type === 'execute_result' ) {
        const data = (msg as KernelMessage.IExecuteResultMsg).content.data['text/plain'];
        this._bag = data as Bag;
      }
    } 
    future.onReply = (msg: KernelMessage.IExecuteReplyMsg) => console.log("onReply: ", msg);
    future.onStdin = (msg: KernelMessage.IStdinMessage<KernelMessage.StdinMessageType>) => console.log("onStdin: ", msg);
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