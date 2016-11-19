import {BindingEngine} from './binding-engine';
import {Container} from 'aurelia-dependency-injection';

export function observableArray(targetOrConfig: any, key: string, descriptor?: PropertyDescriptor) {
  function deco(target, key, descriptor, config) {
    let container = Container.instance;
    let bindingEngine = container.get(BindingEngine);

    // determine callback name based on config or convention.
    const callbackName = (config && config.changeHandler) || `${key}Changed`;
    let value;

    if (descriptor) {
      // babel passes in the property descriptor with a method to get the initial value.

      // set the initial value of the property if it is defined.
      if (typeof descriptor.initializer === 'function') {
        value = descriptor.initializer();
      }
    } else {
      value = [];
    }
    target[key] = value;

    // Subscribe to the array changes
    let subscription = bindingEngine.collectionObserver(value)
      .subscribe((splices, test) => {
        if (target[callbackName]) {
          target[callbackName](splices, key);
        }
      });

    return descriptor;
    // TODO: Dispose of the subscription later
    //subscription.dispose();
  }

  if (key === undefined) {
    // parens...
    return (t, k, d) => deco(t, k, d, targetOrConfig);
  }
  return deco(targetOrConfig, key, descriptor);
}
