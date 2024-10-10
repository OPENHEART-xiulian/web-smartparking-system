import type { App, Component } from "vue";

export type CustomComponent = Component & { displayName?: string };
type EventShim = {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void;
    };
  };
};
export type WithInstall<T> = T & {
  install(app: App): void;
} & EventShim;
export const withInstall = <T extends CustomComponent>(
  component: T,
  alias?: string
) => {
  (component as Record<string, unknown>).install = (app: App) => {
    const compName = component.name || component.displayName;
    if (!compName) return;
    app.component(compName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as WithInstall<T>;
};

export const _src = (
  path: string,
  api = import.meta.env.VITE_API_IMG_REPLACE,
  host = import.meta.env.VITE_API_IMGHOST
) => {
  return path?.replace(api, host);
};
