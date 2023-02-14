import { DispatchContext, RETURN_VALUE } from '../Instance';
import { Module } from '../Module';

export default {
  repeat_until: (context: DispatchContext) => {
    const condition = context.values['CONDITION'];
    if (!condition) throw new Error('CONDITION not found');
    const substack = context.statements['SUBSTACK'];
    if (!substack) throw new Error('SUBSTACK not found');
    while (context.resolve(condition)) {
      context.execute(substack.child);
    }
  }
} as Module;