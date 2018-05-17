
export interface IMyFormConfig {
  apiUrl: string;
  appUrl: string;
  icons?: string;
  formOnly?: boolean;
}

export interface IMyFormendererProps {
  config: IMyFormConfig;
  domElement: HTMLElement;
  formOptions?: any;
  readOnly?: boolean;
  viewOnly?: boolean;
  options?: any;
  hooks?: any[];
}

export interface FormioOptions {
  errors?: any;
  alerts?: any;
  disableAlerts?: boolean;
  i18n?: object;
  fileService?: object;
  hooks?: any;
}
