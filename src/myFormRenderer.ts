import { each, isEmpty, get } from 'lodash';
import { Formio } from 'formiojs';
import { IMyFormendererProps } from './config';
import { FieldCustomText } from './components';

export class MyFormioRenderer {
  public ready: Promise<object>;
  public readyResolve: any;
  form?: any;
  submission?: any = {};
  src?: string;
  url?: string;
  service?: any; // FormioService;
  options?: any; // FormioOptions;
  readOnly?= false;
  viewOnly?= false;
  hideComponents?: string[];
  refresh?: () => any; // EventEmitter<FormioRefreshValue>;
  error?: () => any; // EventEmitter<any>;
  success?: () => any; // EventEmitter<object>;
  language?: () => any; // EventEmitter<string>;
  hooks?: any = {};
  renderElement: HTMLElement;

  // outputs
  render: () => any; // EventEmitter<object>;
  customEvent: (data: any) => any; // EventEmitter<object>;
  submit: (data: any) => any; // EventEmitter<object>;
  prevPage: (data: any) => any; // EventEmitter<object>;
  nextPage: (data: any) => any; // EventEmitter<object>;
  beforeSubmit: (data: any) => any; // EventEmitter<object>;
  change: (data: any) => any; // EventEmitter<object>;
  invalid: (data: any) => any; // EventEmitter<boolean>;
  errorChange: (data: any) => any; // EventEmitter<any>;
  formLoad: (data: any) => any; // EventEmitter<any>;  

  public formio: any;
  public initialized: boolean;
  private alerts: any; // FormioAlerts;
  constructor(private rendererConfig: IMyFormendererProps) {
    if (this.rendererConfig) {
      Formio.setBaseUrl(this.rendererConfig.config.apiUrl);
      Formio.setProjectUrl(this.rendererConfig.config.appUrl);
    } else {
      console.warn('You must provide an AppConfig within your application!');
    }

    this.ready = new Promise((resolve: any) => {
      this.readyResolve = resolve;
    });

    this.alerts = this.dummyFunc;
    this.beforeSubmit = this.dummyFunc;
    this.prevPage = this.dummyFunc;
    this.nextPage = this.dummyFunc;
    this.submit = this.dummyFunc;
    this.errorChange = this.dummyFunc;
    this.invalid = this.dummyFunc;
    this.change = this.dummyFunc;
    this.customEvent = this.dummyFunc;
    this.render = () => console.log('rendered');
    this.formLoad = this.dummyFunc;
    this.initialized = false;
    this.alerts.alerts = [];

    this.registerCustomComponents();
  }

  dummyFunc = (data: any) => {
    console.log(data);
  }

  setForm(rendererElement: HTMLElement, form: any) {
    this.form = form;
    this.renderElement = rendererElement;

    // Only initialize a single formio instance.
    if (this.formio) {
      this.formio.form = this.form;
      return;
    }

    const { config } = this.rendererConfig;
    // Create the form.
    return Formio.createForm(
      rendererElement,
      this.form,
      {
        icons: config && config.icons ? config.icons : '',
        noAlerts: true,
        readOnly: this.readOnly,
        viewAsHtml: this.viewOnly,
        i18n: get(this.options, 'i18n', null),
        fileService: get(this.options, 'fileService', null),
        hooks: this.hooks
      }
    ).then((formio: any) => {
      this.formio = formio;
      if (this.url) {
        this.formio.url = this.url;
      }
      if (this.src) {
        this.formio.url = this.src;
      }
      this.formio.nosubmit = true;
      this.formio.on('prevPage', (data: any) => this.onPrevPage(data));
      this.formio.on('nextPage', (data: any) => this.onNextPage(data));
      this.formio.on('change', (value: any) => this.change(value));
      this.formio.on('customEvent', (event: any) =>
        this.customEvent(event)
      );
      this.formio.on('submit', (submission: any) =>
        this.submitForm(submission)
      );
      this.formio.on('error', (err: any) => this.onError(err));
      this.formio.on('render', () => this.render());
      this.formio.on('formLoad', (loadedForm: any) =>
        this.formLoad(loadedForm)
      );
      this.readyResolve(this.formio);
      return this.formio;
    });
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    this.options = Object.assign(
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
      this.options
    );
    this.initialized = true;
  }


  onRefresh(refresh: any) {
    this.ready.then(() => {
      switch (refresh.property) {
        case 'submission':
          this.formio.submission = refresh.value;
          break;
        case 'form':
          this.formio.form = refresh.value;
          break;
      }
    });
  }
  OnChanges(changes: any) {
    this.initialize();

    if (changes.form && changes.form.currentValue) {
      this.setForm(this.renderElement, changes.form.currentValue);
    }

    this.ready.then(() => {
      if (changes.submission && changes.submission.currentValue) {
        this.formio.submission = changes.submission.currentValue;
      }

      if (changes.hideComponents) {
        this.formio.hideComponents(changes.hideComponents.currentValue);
      }
    });
  }
  onPrevPage(data: any) {
    this.alerts.setAlerts([]);
    this.prevPage(data);
  }
  onNextPage(data: any) {
    this.alerts.setAlerts([]);
    this.nextPage(data);
  }
  onSubmit(submission: any, saved: boolean) {
    if (saved) {
      this.formio('submitDone', submission);
    }
    this.submit(submission);
    if (!this.success) {
      this.alerts.setAlert({
        type: 'success',
        message: get(this.options, 'alerts.submitMessage')
      });
    }
  }
  onError(err: any) {
    this.alerts.setAlerts([]);
    if (!err) {
      return;
    }

    // Make sure it is an array.
    err = err instanceof Array ? err : [err];

    // Emit these errors again.
    this.errorChange(err);

    // Iterate through each one and set the alerts array.
    each(err, (error: any) => {
      this.alerts.setAlert({
        type: 'danger',
        message: error.message || error.toString()
      });
    });
  }
  submitExecute(submission: object) {
    if (this.service) {
      this.service
        .saveSubmission(submission)
        .subscribe(
        (sub: {}) => this.onSubmit(sub, true),
        err => this.onError(err)
        );
    } else {
      this.onSubmit(submission, false);
    }
  }
  submitForm(submission: any) {
    this.beforeSubmit(submission);

    // if they provide a beforeSubmit hook, then allow them to alter the submission asynchronously
    // or even provide a custom Error method.
    const beforeSubmit = get(this.options, 'hooks.beforeSubmit');
    if (beforeSubmit) {
      beforeSubmit(submission, (err: any, sub: object) => {
        if (err) {
          this.onError(err);
          return;
        }
        this.submitExecute(sub);
      });
    } else {
      this.submitExecute(submission);
    }
  }
  registerCustomComponents = () => {
    Formio.registerComponent('custom', FieldCustomText);
  }
}
