import { PartialJSONValue, ReadonlyPartialJSONValue } from '@lumino/coreutils';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ReactWidget } from '@jupyterlab/apputils';
import React, { useState, useEffect } from 'react';


type Props = {
  settings: ISettingRegistry;
  idSettings: string;
};

type Properties = {
  key: string,
  title: string,
  description: string,
  type: string,
  default: PartialJSONValue,
  value: ReadonlyPartialJSONValue,
  save: Function
}

/**
 * React component for a settings widget.
 *
 * @returns The React component
 */
const SettingsComponent: React.FC<Props> = props => {
  const { settings, idSettings } = props;
  const [properties, setProperties] = useState(new Array<Properties>());
  
  useEffect(() => {
    settings.load(idSettings)
      .then(setting => {
        const aux: { [property: string]: ISettingRegistry.IProperty; } = setting.schema.properties;

        const values = new Array<Properties>()
        Object.keys(aux).map(k => {
          
          const prop = {
            key: k,
            title: aux[k].title,
            description: aux[k].description,
            type: aux[k].type.toString(),
            default: aux[k].default,
            value: setting.get(k).composite,
            save: (value: any) => { setting.set(k, value); },
          }

          values.push(prop);
        })

        setProperties(values);
      }).catch(err => console.log(err));
  }, []);

  const submit = (e: any) => {
    e.preventDefault();

    properties.forEach( (prop, i) => {
      let value: any = "";
      switch(prop.type) {
        case "string": {}
        case "number": {
          value = e.target[i].value;
          break;
        }

        case "null": {
          if (e.target[i].value == "null") value = null;
          else value = e.target[i].value;
          break;
        }

        case "boolean": {
          value = e.target[i].checked;
          break;
        }

        case "array": {
          value = e.target[i].value.substring(1, e.target[i].value.length-1).split(", ");
          break;
        }

        case "object": {
          value = JSON.parse(e.target[i].value);
          break;
        }

        default: {
          value = e.target[i].value.toString();
          break;
        }
      }

      if (prop.value != value) {
        prop.value = value;
        prop.save(prop.value);
      }
    });
  }

  const typeInput = (prop: Properties): JSX.Element => {
    switch(prop.type) {
      case "string": {}
      case "null": {
        return (
          <input className="lm-CommandPalette-input p-CommandPalette-input"
            name="text" type={prop.type} defaultValue={ prop.value.toString() } />
        );
      }

      case "boolean": {
        return (
          <input className="lm-CommandPalette-input p-CommandPalette-input"
            name="checkbox" type={prop.type} defaultValue={ prop.value.toString() } value={prop.title} />
        );
      }

      case "number": {
        return (
          <input className="lm-CommandPalette-input p-CommandPalette-input"
            name="number" type={prop.type} defaultValue={ prop.value.toString() } />
        );
      }

      case "array": {}
      case "object": {}
      default: {
        return (
          <input className="lm-CommandPalette-input p-CommandPalette-input"
            name="textarea" type={prop.type} defaultValue={ prop.value.toString() } />
        );
      }
    }
  }

  return (
    <form className="jp-Launcher-content" onSubmit={submit}>
      {
        properties.map( prop => (
          <div key={prop.key} className="jp-Launcher-section">
            <div className="jp-Launcher-sectionHeader">
              <span className="jp-Launcher-sectionTitle">{prop.title}</span>
            </div>
            <pre className="jp-About-body" >{prop.description}</pre>
            <div className="jp-Launcher-cardContainer">
              <div className="bp3-input-group jp-extensionmanager-search-wrapper jp-InputGroup"
                  style={{ width: "100%" }}>
                { typeInput(prop) }
              </div>
            </div>
          </div>
        ))
      }
      <button className="bp3-button jp-Button" type="submit">Save</button>
    </form>
  );
};

/**
 * A SettingsWidget Lumino Widget that wraps a SettingsComponent.
 */
export default class SettingsWidget extends ReactWidget {
  private settings: ISettingRegistry;
  private idSettings: string;
  /**
   * Constructs a new Settings.
   */
  constructor(settings: ISettingRegistry, idSettings: string) {
    super();
    this.settings = settings;
    this.idSettings = idSettings;
    this.addClass('jp-ReactWidget');
  }

  render(): JSX.Element {
    return <SettingsComponent settings={this.settings} idSettings={this.idSettings}/>;
  }
}