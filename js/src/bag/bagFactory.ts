import { ABCWidgetFactory, DocumentRegistry } from '@jupyterlab/docregistry';
import { SessionContext, sessionContextDialogs } from '@jupyterlab/apputils';
import { Contents, ServiceManager } from '@jupyterlab/services';

import BagDocument from './bagDocument';
import BagModel from './bagModel';
import BagPanel from './bagPanel';
import { ISignal } from '@lumino/signaling';

export class BagViewFactory implements DocumentRegistry.IWidgetFactory<BagDocument, BagModel> {
  name: string;
  fileTypes: readonly string[];
  defaultFor?: readonly string[];
  defaultRendered?: readonly string[];
  readOnly?: boolean;
  modelName?: string;
  preferKernel?: boolean;
  canStartKernel?: boolean;
  shutdownOnClose?: boolean;
  isDisposed: boolean;

  widgetCreated: ISignal<DocumentRegistry.IWidgetFactory<BagDocument, BagModel>, BagDocument>;

  constructor(options: DocumentRegistry.IWidgetFactoryOptions) {
    this.name = options.name;
    this.fileTypes = options.fileTypes;
    this.defaultFor = options.defaultFor;
    this.defaultRendered = options.defaultRendered;
    this.readOnly = options.readOnly;
    this.modelName = options.modelName;
    this.preferKernel = options.preferKernel;
    this.canStartKernel = options.canStartKernel;
    this.shutdownOnClose = options.shutdownOnClose;
  }

  dispose(): void {}

  createNew(context: DocumentRegistry.IContext<BagModel>, source?: BagDocument): BagDocument {
    /*console.log("new widget: ", context.sessionContext.path);

    context.sessionContext.initialize()
    .then( async value => {

      if (value) {
        await sessionContextDialogs.selectKernel(context.sessionContext);
        console.log("session: ", context.sessionContext);
        console.log("session: ", context.sessionContext.session.kernel);
        context.model.setSession(context.sessionContext);
      }
    
    }).catch( err => console.error(`Failed to initialize the session.\n${err}`) );*/

    console.log("new");
    console.log("session: ", context.sessionContext);
    context.model.setSession(context.sessionContext);

    return new BagDocument(new BagPanel(context.path, context.model), context);
  }

  createNewWidget(context: DocumentRegistry.IContext<BagModel>): BagDocument{

    console.log("new widget");
    console.log("session: ", context.sessionContext);
    console.log("kernel: ", context.sessionContext.session.kernel);
    context.model.setSession(context.sessionContext);

    return new BagDocument(new BagPanel(context.path, context.model), context);
  }
  
  toolbarFactory?: (widget: import("@lumino/widgets").Widget) => DocumentRegistry.IToolbarItem[];
}

export class BagModelFactory implements DocumentRegistry.IModelFactory<BagModel> {
  
  private _disposed = false;

  constructor() {
  }

  get name(): string {
    return 'bag';
  }

  get contentType(): Contents.ContentType {
    return 'file';
  }

  get fileFormat(): Contents.FileFormat {
    return 'base64';
  }

  get isDisposed(): boolean {
    return this._disposed;
  }

  dispose(): void {
    this._disposed = true;
  }

  createNew(): BagModel {
    return new BagModel();
  }
  
  preferredLanguage(path: string): string {
    return '';
  }
}