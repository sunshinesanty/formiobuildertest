import { MyFormBuilder } from './myFormBuilder'
import { MyFormioRenderer } from './myFormRenderer';
import * as config from './config';

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
