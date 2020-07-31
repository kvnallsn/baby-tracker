import App from "./App.svelte";
import { state } from "./stores";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
    .then(reg => console.log("Registration succedded. Scope is " + reg.scope))
    .catch(err => console.error("Registration failed with " + err));

  navigator.serviceWorker.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.type === 'state-update') {
      state.handleMessage(message);
    }
  };
}

const app = new App({
  target: document.body,
});

export default app;
