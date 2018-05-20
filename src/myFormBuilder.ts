
import { Formio } from 'formiojs';
import { IMyFormConfig } from './model';
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
  setPreview = (action: string, formSchema: any) => {
    console.log(action);
    window['MyFormCurrentContext'] = formSchema ? formSchema : {};
    if (window['MyFormIORenderer'] && window['rendererElement']) {
      (<MyFormioRenderer>window['MyFormIORenderer']).setForm(window['rendererElement'], window['MyFormCurrentContext'] || {});
    }
  }
  builder = async (domELement: HTMLElement, form: any, options: any = {}): Promise<any> => {
    const instance = await Formio.builder(domELement, form || { display: 'form'  }, options);
    this.formio = instance;
    instance.on('saveComponent', () => this.setPreview('save', instance.schema));
    instance.on('editComponent', (event) => console.log('edit', event));
    instance.on('updateComponent', (event) => console.log('update', event));
    instance.on('deleteComponent', (event) => console.log('delete', event));
    return instance;
  }
}
