import { Formio } from 'formiojs';
import { FieldCustomText} from './fieldInheritedText';

/**
 * Export this method to register all custom components
 * Any new component developed should be added here.
 */
export function registerAllComponents() {
  /**
   * To maintain the key within the custom field class, pleae expose the key as Static
   * TODO: find more appropriate way to do this.
   */
  Formio.registerComponent(FieldCustomText.ComponentKey, FieldCustomText);
}
