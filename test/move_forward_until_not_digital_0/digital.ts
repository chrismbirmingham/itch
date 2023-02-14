import { Module } from '../../src/Module';
import { DispatchContext, RETURN_VALUE } from '../../src/Instance';

let i = 0;

export default {
  digital: (context: DispatchContext) => {
    return i++ > 10;
  },
} as Module;