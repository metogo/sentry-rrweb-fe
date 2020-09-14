// import * as rrweb from 'rrweb';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import LessText from './lessText';
import * as serviceWorker from './serviceWorker';
// import RandomList from './RandomList';
// import LoginForm from './LoginForm';
import StepTracker from './StepTracker';

// import * as Sentry from '@sentry/browser';
import * as Sentry from "@sentry/react";
import SentryRRWeb from './plugin/index';


Sentry.init({
  dsn: 'http://5fe09b30b5b249f99b60c6783e00b819@sentry.zuoyebang.cc/34',
  environment: 'dev',
  integrations: [
    new SentryRRWeb({
      checkoutEveryNth: 100,
      checkoutEveryNms: 15 * 60 * 1000,
      maskAllInputs: false,
    }),
  ],
  // ...
});

// let events = []
// rrweb.record({
//   emit(event) {
//     events.push(event)
//   },
// });

// setInterval(function() {
//   console.log(events)
// }, 10 * 1000);
// const events_player = events


// setTimeout(() => {
//   console.log(events)
//   const replayer = new rrweb.Replayer(events);

//   replayer.play();
// }, 2000);
// function save() {
//   const body = JSON.stringify({ events });
//   events = [];
//   fetch('http://YOUR_BACKEND_API', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body,
//   });
// }

ReactDOM.render(
  <React.StrictMode>
    <StepTracker />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
