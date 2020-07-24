import { DocumentRegistry, Context } from '@jupyterlab/docregistry';

import BagModel from'./bagModel';
import { ISignal } from '@lumino/signaling';
import { Contents } from '@jupyterlab/services';
import { ISessionContext } from '@jupyterlab/apputils';
import { IRenderMime } from '@jupyterlab/rendermime';
import { Widget } from '@lumino/widgets';
import { IDisposable } from '@lumino/disposable';

export class BagContext<T extends BagModel> implements DocumentRegistry.IContext<T> {
  /**
   * Construct a new document context.
   */
  constructor(options: Context.IOptions<BagModel>) {}
  
  pathChanged: ISignal<this, string>;
  fileChanged: ISignal<this, Contents.IModel>;
  saveState: ISignal<this, DocumentRegistry.SaveState>;
  disposed: ISignal<this, void>;
  model: T;
  sessionContext: ISessionContext;
  path: string;
  localPath: string;
  contentsModel: Contents.IModel;
  urlResolver: IRenderMime.IResolver;
  isReady: boolean;
  ready: Promise<void>;

  save(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  saveAs(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  download(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  revert(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createCheckpoint(): Promise<import("@jupyterlab/services").Contents.ICheckpointModel> {
    throw new Error("Method not implemented.");
  }
  deleteCheckpoint(checkpointID: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  restoreCheckpoint(checkpointID?: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  listCheckpoints(): Promise<import("@jupyterlab/services").Contents.ICheckpointModel[]> {
    throw new Error("Method not implemented.");
  }
  addSibling(widget: Widget, options?: DocumentRegistry.IOpenOptions): IDisposable {
    throw new Error("Method not implemented.");
  }
  isDisposed: boolean;
  dispose(): void {
    throw new Error("Method not implemented.");
  }
}