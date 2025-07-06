declare module 'analyticsDashboard/App' {
  import { Component } from 'vue'
  const component: Component
  export default component
}

declare module 'analyticsDashboard/Analytics' {
  import { Component } from 'vue'
  const component: Component
  export default component
}

declare module '@module-federation/bridge-vue3' {
  import { Component, App, ComponentPublicInstance } from 'vue'
  
  export interface BridgeComponentOptions {
    rootComponent: Component
    appOptions?: () => Record<string, any>
  }
  
  export interface LoadRemoteOptions {
    fallback?: Component
    loading?: Component
    error?: Component
    timeout?: number
    suspensible?: boolean
  }
  
  export function createBridgeComponent(options: BridgeComponentOptions): Component
  
  export function loadRemote(path: string, options?: LoadRemoteOptions): Promise<Component>
  
  export interface BridgeContext {
    app: App
    instance: ComponentPublicInstance
    destroy: () => void
  }
}