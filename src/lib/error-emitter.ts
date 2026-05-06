
import { EventEmitter } from 'events';
import { SimulatedPermissionError } from './errors';

class ErrorEmitter extends EventEmitter {
  emit(event: 'permission-error', error: SimulatedPermissionError): boolean {
    return super.emit(event, error);
  }

  on(event: 'permission-error', listener: (error: SimulatedPermissionError) => void): this {
    return super.on(event, listener);
  }
}

export const errorEmitter = new ErrorEmitter();
