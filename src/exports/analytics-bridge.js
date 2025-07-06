import { createBridgeComponent } from '@module-federation/bridge-vue3';
import App from '../App.vue';

// Create the bridge component
const bridge = createBridgeComponent({
  rootComponent: App,
  appOptions: ({ app }) => {
    // Any app-level configuration can go here
    console.log('Bridge component initialized');
    return {};
  }
});

export default bridge;