import * as React from 'react';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader';
import { App } from './components/App';

const element = document.createElement('div');
element.id = 'root'
document.body.appendChild(element);

const app = render(<App />, document.getElementById('root'));
export default (Object.is(process.env.NODE_ENV, 'production') ? app : hot(module)(app));
