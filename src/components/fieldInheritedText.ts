import TextFieldComponent from 'formiojs/components/textfield/TextField';
import BaseComponent from 'formiojs/components/base/Base';
import { Formio } from 'formiojs';
import { IComponentProps } from '../model';

export class FieldCustomText extends TextFieldComponent {
  /**
   * Required to expose the key for the custom field.
   */
  static ComponentKey = 'customText';

  constructor(component, options, data) {
    console.log(component);
    super(component, options, data);
  }

  static get builderInfo() {
    return {
      title: 'Custom Text Field',
      icon: 'fa fa-pencil',
      group: 'basic',
      documentation: 'http://help.form.io/userguide/#textfield',
      weight: 0,
      schema: TextFieldComponent.schema()
    };
  }

  get defaultSchema() {
    return FieldCustomText.schema();
  }

  static schema(...extend) {
    return TextFieldComponent.schema({
      label: 'Custom Text Field',
      key: 'textField1',
      type: 'textfield1',
      mask: false,
      inputType: 'text',
      inputMask: '',
      validate: {
        minLength: '',
        maxLength: '',
        pattern: ''
      }
    }, ...extend);
  }
}


/**
 * IMPORTANT :
 * Import this new component to within the index.ts to add to teh register function for all custom components
 * Without adding this to the register function the custom componnet cannot be used.
 */
