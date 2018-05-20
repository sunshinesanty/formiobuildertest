export interface IComponentProps {
  /**
   * Determines if this component provides an input.
   */
  input?: boolean;

  /**
   * The data key for this component (how the data is stored in the database).
   */
  key: string;

  /**
   * The input placeholder for this component.
   */
  placeholder?: string;

  /**
   * The input prefix
   */
  prefix?: string;

  /**
   * The custom CSS class to provide to this component.
   */
  customClass?: string;

  /**
   * The input suffix.
   */
  suffix?: string;

  /**
   * If this component should allow an array of values to be captured.
   */
  multiple?: false;

  /**
   * The default value of this compoennt.
   */
  defaultValue?: any;

  /**
   * If the data of this component should be protected (no GET api requests can see the data)
   */
  protected?: boolean;

  /**
   * Validate if the value of this component should be unique within the form.
   */
  unique?: boolean;

  /**
   * If the value of this component should be persisted within the backend api database.
   */
  persistent?: boolean;

  /**
   * Determines if the component should be within the form, but not visible.
   */
  hidden?: boolean;

  /**
   * If the component should be cleared when hidden.
   */
  clearOnHide?: boolean;

  /**
   * If this component should be included as a column within a submission table.
   */
  tableView?: boolean;

  /**
   * The input label provided to this component.
   */
  label: string;
  labelPosition?: string;
  labelWidth?: 30;
  labelMargin?: 3;
  description?: string;
  errorLabel?: string;
  tooltip?: string;
  hideLabel?: boolean;
  tabindex?: string;
  disabled?: boolean;
  autofocus?: boolean;
  dbIndex?: boolean;
  customDefaultValue?: string;
  calculateValue?: string;

  /**
   * Defines the type of the field that can be mapped to the data.
   */
  type: string;

  /**
   * The validation criteria for this component.
   */
  validate?: IComponentValidate;

  /**
   * The simple conditional settings for a component.
   */
  conditional?: IComponentCondition;
  spellcheck?: any;
  mask?: any;
}

export interface IComponentCondition {
  show: any;
  when: any;
  eq: string;
}

export interface IComponentValidate {
  /**
   * If this component is required.
   */
  required: boolean;

  /**
   * Custom JavaScript validation.
   */
  custom: string;

  /**
   * If the custom validation should remain private (only the backend will see it and execute it).
   */
  customPrivate: boolean;
}
