import { defaultSanitizer } from '@jupyterlab/apputils';
import { renderText } from '@jupyterlab/rendermime';
import React, { useState } from 'react';

export type RosLog = {
  date: Date,
  level: number,
  name: string,
  file: string,
  function: string,
  line: number,
  topics: string[],
  msg: string,
  toggled: boolean
};

type Props = {
  log: RosLog;
};

export const Log: React.FC<Props> = (props): JSX.Element => {
  const { log } = props;
  const [toggled, setToggled] = useState(log.toggled);

  let level = 'debug';
  switch(log.level) {
    case 1:
      level = 'debug';
      break;
    case 2:
      level = 'info';
      break;
    case 4:
      level = 'warning';
      break;
    case 8:
      level = 'error';
      break;
    case 16:
      level = 'critical';
      break;
    default:
      level = 'info';
  }

  const open = ():void => {
    log.toggled = !log.toggled;
    setToggled(log.toggled);
  }

  const title = log.date.toLocaleDateString()+" "+log.date.toLocaleTimeString()+"; "+level+" level";
  const msg = document.createElement('div');
  renderText({host: msg, sanitizer: defaultSanitizer, source: log.msg });

  return (
    <a href="#" onClick={open} className="lm-Widget p-Widget lm-Panel p-Panel jp-OutputArea-child">
      <div title={title}
          data-log-level={level}
          className="jp-OutputArea-prompt"
          style={{width: "55px"}}>
        { !toggled ?
          <div style={{width: "55px"}}>{log.date.toLocaleTimeString()}</div>
          :
          <div style={{width: "55px"}}>{log.date.toLocaleTimeString()}</div>
        }
      </div>
      { !toggled ?
        <div className="jp-RenderedText jp-OutputArea-output">
          <pre>
            <span>{log.name}; {log.file.split('/').pop()}:ln {log.line}</span>
          </pre>
          <pre>
            { log.msg.length < 50 ?
              <div dangerouslySetInnerHTML={{ __html: msg.innerHTML }}></div>
              :
              <span>{log.msg.substr(0, 50)}...</span>
            }
          </pre>
        </div>
        :
        <div className="jp-RenderedText jp-OutputArea-output">
          <table>
            <tbody>
              <tr>
                <th>Node:</th>
                <td>{log.name}</td>
              </tr>
              <tr>
                <th>File:</th>
                <td>{log.file}:ln {log.line}</td>
              </tr>
              <tr>
                <th>Function:</th>
                <td>{log.function}</td>
              </tr>
              <tr>
                <th>Topics:</th>
                <td>{log.topics}</td>
              </tr>
              <tr>
                <th>Message:</th>
                <td><div dangerouslySetInnerHTML={{ __html: msg.innerHTML }}></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      }
    </a>
  );
}

export const Checkpoint: React.FC<Props> = (props): JSX.Element => {
  const { log } = props;

  const title = log.date.toLocaleDateString()+" "+log.date.toLocaleTimeString()+"; debug level";

  return (
    <div className="lm-Widget p-Widget lm-Panel p-Panel jp-OutputArea-child">
      <div title={title}
          data-log-level={'debug'}
          style={{ width: "80px"}}
          className="lm-Widget p-Widget jp-OutputArea-prompt" >
        <div>{log.date.toLocaleTimeString()}</div>
      </div>
      <div className="lm-Widget p-Widget jp-RenderedText jp-OutputArea-output">
        <pre>
          <hr/>
        </pre>
      </div>
    </div>
  );
}