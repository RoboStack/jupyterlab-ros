import { Kernel, KernelMessage } from '@jupyterlab/services';
import { DocumentModel } from '@jupyterlab/docregistry';
import { ISessionContext } from '@jupyterlab/apputils';
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

export default class BagModel extends DocumentModel {
  private session: ISessionContext = null;

  private _error: string = null;

  private _path: string = null;
  private _version: string = null;
  private _start: string = null;
  private _end: string = null;
  private _duration: string = null;
  private _size: string = null;
  private _messages: number = 0;
  private _compression: string = null;
  private _types: Type[] = [];
  private _topics: Topic[] = [];
  
  constructor() {
    super();
    console.log("entra init");
  }

  dispose(): void {
    this.session.shutdown();
    this.session.dispose();
  }

  public setSession(session: ISessionContext): void {
    this.session = session;
    this.session.ready.then( () => {
      console.log("ready");
      this.getInfo(this.session.path);
    }).catch( err => console.log(err) );
  }

  private info(message: KernelMessage.IIOPubMessage): void {
    console.log("Info");
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

    this._path = msg['path'];
    this._version = msg['version'];
    this._start = msg['start'];
    this._end = msg['end'];
    this._duration = msg['duration'];
    this._size = msg['size'];
    this._messages = msg['messages'];
    this._compression = msg['compression'];
    this._types = [];
    this._topics = [];

    for (let key in msg['types']) {
      this.types.push({ type: key, hash: msg['types'][key] });
    }

    for (let key in msg['topics']) {
      this.topics.push({
        topic: key,
        type: msg['topics'][key][0],
        number: msg['topics'][key][1],
        connections: msg['topics'][key][2],
        frequency: msg['topics'][key][3]
      });
    }

    this.triggerContentChange();
  }

  private onReply(msg: KernelMessage.IExecuteReplyMsg): void {
    console.log("onReply", msg);
  }

  private onStdin(msg: KernelMessage.IStdinMessage<KernelMessage.StdinMessageType>): void {
    console.log("onStdin", msg);
  }

  get error(): string { return this._error; }

  get path(): string { return this._path; }
  get version(): string { return this._version; }
  get start(): string { return this._start; }
  get end(): string { return this._end; }
  get duration(): string { return this._duration; }
  get size(): string { return this._size; }
  get messages(): number { return this._messages; }
  get compression(): string { return this._compression; }
  get types(): Type[] { return this._types; }
  get topics(): Topic[] { return this._topics; }

  getInfo(path: string): void {
    console.log("get info");
    if (!this.session || !this.session.session?.kernel) return;
    console.log("path: ", path);

    const code = 
`
from datetime import datetime
import rosbag
bag = rosbag.Bag("${path}", mode='r', allow_unindexed=True)
start = datetime.utcfromtimestamp( bag.get_start_time() )
end = datetime.utcfromtimestamp( bag.get_end_time() )
types, topics = bag.get_type_and_topic_info()

return {
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

    const future = this.session.session?.kernel?.requestExecute({ code });
    future.onIOPub = this.info;
    future.onReply = this.onReply;
    future.onStdin = this.onStdin;
  }
}