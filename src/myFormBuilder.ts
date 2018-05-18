
import { Formio } from 'formiojs';
import { IMyFormConfig } from './config';
import { MyFormioRenderer } from './myFormRenderer';
import { FieldCustomText } from './components';

export class MyFormBuilder {
  public formio: any;
  constructor(private builderConfig: IMyFormConfig) {
    if (this.builderConfig) {
      Formio.setBaseUrl(this.builderConfig.apiUrl);
      Formio.setProjectUrl(this.builderConfig.appUrl);
    } else {
      console.warn('You must provide Formio IO appa nd API url!');
    }
    this.registerCustomComponents();
  }
  handleEvent = (action: string, formIntance: any) => {
    console.log(action);
    window['MyFormCurrentContext'] = formIntance ? formIntance.component : {};
    if (window['MyFormIORenderer'] && action === 'save' &&
      window['rendererElement']) {
      (<MyFormioRenderer>window['MyFormIORenderer']).setForm(window['rendererElement'], window['MyFormCurrentContext'] || {});
    }
  }
  builder = async (domELement: HTMLElement, form: any, options: any = {}): Promise<any> => {
    const instance = await Formio.builder(domELement, form, options);
    this.formio = instance;
    instance.on('saveComponent', () => this.handleEvent('save', instance));
    instance.on('updateComponent', () => this.handleEvent('update', instance));
    instance.on('deleteComponent', () => this.handleEvent('delete', instance));
    return instance;
  }

  registerCustomComponents = () => {
    Formio.registerComponent('custom', FieldCustomText);
  }
}
