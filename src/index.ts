import { MyFormBuilder } from './myFormBuilder'
import { MyFormioRenderer } from './myFormRenderer';

// this is used to register all custom components
import { registerAllComponents } from './components';
import './assets/styles.less';

/**
 * Registers all the custom components
 * do this before the Builder or renderer is initialized.
 */
registerAllComponents();

window['MyFormIOBuilder'] = new MyFormBuilder({
  apiUrl: 'http://localhost:3001',
  appUrl: 'http://localhost:3001'
});

window['MyFormIORenderer'] = new MyFormioRenderer({
  config: { apiUrl: 'http://localhost:3001', appUrl: 'http://localhost:3001' },
  domElement: document.getElementById('renderer')
});


window.onload = function () {
  window['MyFormIOBuilder'].builder(document.getElementById('builder'), {});
};

window['rendererElement'] = document.getElementById('renderer');
