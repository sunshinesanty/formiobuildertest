
import { Formio } from 'formiojs';
import { IMyFormConfig } from './config';
import { MyFormioRenderer } from './myFormRenderer';

export class MyFormBuilder {
  public formio: any;
  constructor(private builderConfig: IMyFormConfig) {
    if (this.builderConfig) {
      Formio.setBaseUrl(this.builderConfig.apiUrl);
      Formio.setProjectUrl(this.builderConfig.appUrl);
    } else {
      console.warn('You must provide Formio IO appa nd API url!');
    }
  }
  handleEvent = (action: string, formIntance: any) => {
    console.log(action);
    window['MyFormCurrentContext'] = formIntance;
    if(window['MyFormIORenderer'] && action === 'save'){
      (<MyFormioRenderer>window['MyFormIORenderer']).initialize();
    }
  }
  builder = async (domELement: HTMLElement, form: any, options: any = {}): Promise<any> => {
    const instance = await Formio.builder(domELement, form, options);
    this.formio = instance;
    instance.on('saveComponent', () => this.handleEvent('save', instance));
    instance.on('updateComponent', () => this.handleEvent('update', instance));
    instance.on('deleteComponent', () => this.handleEvent('delete', instance));
    instance.on('saveComponent', () => this.handleEvent('save', instance));
    return instance;
  }
}
