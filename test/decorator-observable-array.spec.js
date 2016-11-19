import './setup';
import {observableArray} from '../src/decorator-observable-array.js';
// import {decorators} from 'aurelia-metadata';
// import {SetterObserver} from '../src/property-observation';
// import {Logger} from 'aurelia-logging';
import {Container} from 'aurelia-dependency-injection';
import {TaskQueue} from 'aurelia-task-queue';

describe('observableArray decorator', () => {
  const oldValue = ['old'];
  const newValue = ['new'];
  let container;
  let taskQueue;

  beforeEach(() => {
    container = new Container().makeGlobal();
    taskQueue = container.get(TaskQueue);
  });

  fit('should call valueChanged when changing the property', (done) => {
    const instance = new class {
      @observableArray value = oldValue;
      valueChanged() { }
    };
    spyOn(instance, 'valueChanged');

    console.log('pushing')
    instance.value.push(newValue[0]);

    taskQueue.queueTask(() => {
      console.log('checking')
      expect(instance.valueChanged).toHaveBeenCalledWith(newValue, oldValue, 'value');
      done();
    });
  });

  // it('should call valueChanged when changing the undefined property', () => {
  //   const instance = new class {
  //     @observableArray value;
  //     valueChanged() { }
  //   };
  //   spyOn(instance, 'valueChanged');

  //   instance.value = newValue;
  //   expect(instance.valueChanged).toHaveBeenCalledWith(newValue, undefined, 'value');
  // });

  // it('should call customHandler when changing the property', () => {
  //   const instance = new class Test {
  //     @observableArray({ changeHandler: 'customHandler' }) value = oldValue;
  //     customHandler() { }
  //   };
  //   spyOn(instance, 'customHandler');

  //   instance.value = newValue;
  //   expect(instance.customHandler).toHaveBeenCalledWith(newValue, oldValue, 'value');
  // });

  // it('should call customHandler when changing the undefined property', () => {
  //   const instance = new class {
  //     @observableArray({ changeHandler: 'customHandler' }) value;
  //     customHandler() { }
  //   };
  //   spyOn(instance, 'customHandler');

  //   instance.value = newValue;
  //   expect(instance.customHandler).toHaveBeenCalledWith(newValue, undefined, 'value');
  // });

  // it('should work when valueChanged is undefined', () => {
  //   const instance = new class {
  //     @observableArray value = oldValue;
  //   };

  //   expect(instance.valueChanged).not.toBeDefined();
  //   instance.value = newValue;
  //   expect(instance.value).toEqual(newValue);
  // });

  // it('should work when valueChanged is undefined and property is undefined', () => {
  //   const instance = new class {
  //     @observableArray value;
  //   };

  //   expect(instance.valueChanged).not.toBeDefined();
  //   instance.value = newValue;
  //   expect(instance.value).toEqual(newValue);
  // });

  // describe('es2015 with decorators function', () => {
  //   it('should work when decorating property', () => {
  //     class MyClass {
  //       constructor() {
  //         this.value = oldValue;
  //       }
  //       valueChanged() { }
  //     }
  //     decorators(observable).on(MyClass.prototype, 'value');
  //     const instance = new MyClass();
  //     spyOn(instance, 'valueChanged');

  //     instance.value = newValue;
  //     expect(instance.valueChanged).toHaveBeenCalledWith(newValue, oldValue, 'value');
  //   });

  //   it('should work when decorating class', () => {
  //     class MyClass {
  //       constructor() {
  //         this.value = oldValue;
  //       }
  //       valueChanged() { }
  //     }
  //     decorators(observable('value')).on(MyClass);
  //     const instance = new MyClass();
  //     spyOn(instance, 'valueChanged');

  //     instance.value = newValue;
  //     expect(instance.valueChanged).toHaveBeenCalledWith(newValue, oldValue, 'value');
  //   });

  //   it('should work when property is undefined', () => {
  //     class MyClass {
  //       valueChanged() { }
  //     }
  //     decorators(observable).on(MyClass.prototype, 'value');
  //     const instance = new MyClass();
  //     spyOn(instance, 'valueChanged');

  //     instance.value = newValue;
  //     expect(instance.valueChanged).toHaveBeenCalledWith(newValue, undefined, 'value');
  //   });

  //   it('should work with customHandler', () => {
  //     class MyClass {
  //       constructor() {
  //         this.value = oldValue;
  //       }
  //       customHandler() { }
  //     }
  //     decorators(observable({ changeHandler: 'customHandler' })).on(MyClass.prototype, 'value');
  //     const instance = new MyClass();
  //     spyOn(instance, 'customHandler');

  //     instance.value = newValue;
  //     expect(instance.customHandler).toHaveBeenCalledWith(newValue, oldValue, 'value');
  //   });
  // });

  // it('should return a valid descriptor', () => {
  //   const target = class { };
  //   const descriptor = observableArray(target, 'value');

  //   expect(typeof descriptor.value).toBe('undefined');
  //   expect(typeof descriptor.writable).toBe('undefined');
  //   expect(typeof descriptor.get).toBe('function');
  //   expect(typeof descriptor.set).toBe('function');
  //   expect(Reflect.defineProperty(target, 'value', descriptor)).toBe(true);
  // });

  // it('should create an enumerable accessor', () => {
  //   const instance = new class {
  //     @observableArray value;
  //   };
  //   const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(instance), 'value');

  //   expect(descriptor.enumerable).toBe(true);
  //   expect(typeof descriptor.set).toBe('function');
  //   expect(typeof descriptor.get).toBe('function');
  // });

  // describe('private property', () => {
  //   describe(`when public property's value is not changed`, () => {
  //     const instance = new class {
  //       @observableArray value;
  //     };
  //     const prototype = Object.getPrototypeOf(instance);

  //     it('should exist on the prototype', () => {
  //       expect(prototype.hasOwnProperty('_value')).toBe(true);
  //     });

  //     it('should be nonenumerable', () => {
  //       expect(prototype.propertyIsEnumerable('_value')).toBe(false);
  //     });

  //     describe('observation', () => {
  //       const observer = new SetterObserver(null, prototype, '_value');

  //       it('should convert to accessors without warning', () => {
  //         spyOn(Logger.prototype, 'warn');
  //         observer.convertProperty();
  //         expect(Logger.prototype.warn).not.toHaveBeenCalled();
  //       });

  //       it('should exist', () => {
  //         const descriptor = Object.getOwnPropertyDescriptor(prototype, '_value');
  //         expect(typeof descriptor.get).toBe('function');
  //         expect(typeof descriptor.set).toBe('function');
  //       });

  //       it('should be nonenumerable', () => {
  //         expect(prototype.propertyIsEnumerable('_value')).toBe(false);
  //       });
  //     });
  //   });

  //   describe(`when public property's value is changed`, () => {
  //     const instance = new class {
  //       @observableArray value;
  //     };
  //     instance.value = newValue;

  //     it('should exist on the instance', () => {
  //       expect(instance.hasOwnProperty('_value')).toBe(true);
  //     });

  //     it('should be nonenumerable', () => {
  //       expect(instance.propertyIsEnumerable('_value')).toBe(false);
  //     });

  //     describe('observation', () => {
  //       const observer = new SetterObserver(null, instance, '_value');

  //       it('should convert to accessors without warning', () => {
  //         spyOn(Logger.prototype, 'warn');
  //         observer.convertProperty();
  //         expect(Logger.prototype.warn).not.toHaveBeenCalled();
  //       });

  //       it('should exist', () => {
  //         const descriptor = Object.getOwnPropertyDescriptor(instance, '_value');
  //         expect(typeof descriptor.get).toBe('function');
  //         expect(typeof descriptor.set).toBe('function');
  //       });

  //       it('should be nonenumerable', () => {
  //         expect(instance.propertyIsEnumerable('_value')).toBe(false);
  //       });
  //     });
  //   });

  //   it('should have distinct values between instances', () => {
  //     class MyClass {
  //       @observableArray value = oldValue;
  //     }

  //     const instance1 = new MyClass();
  //     const instance2 = new MyClass();

  //     instance1.value = newValue;
  //     expect(instance2.value).toBe(oldValue);
  //   });
  // });
});
