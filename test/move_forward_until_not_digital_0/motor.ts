import { Module } from '../../src/Module';
import { DispatchContext } from '../../src/Instance';

export default {
  fd: (context: DispatchContext) => {
    const motor = context.values['MOTOR'];
    if (!motor) throw new Error('MOTOR not found');
    const motorPort = context.resolve(motor);
    console.log(`fd(${motorPort})`);
    return undefined;
  },
  off: (context: DispatchContext) => {
    const motor = context.values['MOTOR'];
    if (!motor) throw new Error('MOTOR not found');
    const motorPort = context.resolve(motor);
    console.log(`off(${motorPort})`);
    return undefined;
  },
} as Module;