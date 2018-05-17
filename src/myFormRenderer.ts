import { each, isEmpty, get } from 'lodash';
import { Formio } from 'formiojs';
import { IMyFormendererProps } from './config';

export class MyFormioRenderer {
  public formio: any;
  public initialized: boolean;
  constructor(private formProps: IMyFormendererProps) {
    const { config } = this.formProps;
    if (config) {
      Formio.setBaseUrl(config.apiUrl);
      Formio.setProjectUrl(config.appUrl);
    } else {
      console.warn('You must provide an AppConfig within your application!');
    }
    this.initialized = false;
  }
  get form() {
    return window['MyFormCurrentContext'];
  }

  set form(value: any) {
    window['MyFormCurrentContext'] = value;
  }

  handleEvent = (action: string, formIntance: any) => {
    console.log(action);
    this.form = formIntance;
  }

  setForm() {

    // Only initialize a single formio instance.
    if (this.formio) {
      this.formio.form = this.form;
      return;
    }

    const { config, readOnly, viewOnly, options, hooks, domElement } = this.formProps;
    // Create the form.
    return Formio.createForm(
      get(domElement, 'nativeElement', null),
      this.form,
      {
        icons: config ? config.icons : '',
        noAlerts: true,
        readOnly: readOnly || false,
        viewAsHtml: viewOnly || false,
        i18n: get(options, 'i18n', null),
        fileService: get(options, 'fileService', null),
        hooks: hooks
      }
    ).then((formio: any) => {
      this.formio = formio;
      if (config.appUrl) {
        this.formio.url = config.appUrl;
      }
      this.formio.nosubmit = true;
      return this.formio;
    });
  }

  initialize() {
    if (this.initialized) {
      return;
    }
    this.form = window['MyFormCurrentContext'];
    this.formProps.options = Object.assign(
      {
        errors: {
          message: 'Please fix the following errors before submitting.'
        },
        alerts: {
          submitMessage: 'Submission Complete.'
        },
        disableAlerts: false,
        hooks: {
          beforeSubmit: null
        }
      },
      this.formProps.options
    );
    this.initialized = true;
    this.setForm();
  }
}
