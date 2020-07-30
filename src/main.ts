import App from "./App.svelte";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
    .then(reg => console.log("Registration succedded. Scope is " + reg.scope))
    .catch(err => console.error("Registration failed with " + err));
}

const app = new App({
  target: document.body,
});

export default app;
