import { DispatchContext, RETURN_VALUE } from '../Instance';
import { Module } from '../Module';
import { toNumber } from '../util';

export default {
  repeat_until: (context: DispatchContext) => {
    const condition = context.values['CONDITION'];
    if (!condition) throw new Error('CONDITION not found');
    const substack = context.statements['SUBSTACK'];
    if (!substack) {
      while (context.instance.resolve(condition));
      return;
    }
    while (context.instance.resolve(condition)) {
      context.instance.execute(substack.child);
    }
  },
  repeat: (context: DispatchContext) => {
    const times = toNumber(context.resolveValue('TIMES'));
    const substack = context.statements['SUBSTACK'];
    if (!substack) return;
    for (let i = 0; i < times; i++) {
      context.instance.execute(substack.child);
    }
  },
  if: (context: DispatchContext) => {
    const condition = context.values['CONDITION'];
    if (!condition) throw new Error('CONDITION not found');
    const substack = context.statements['SUBSTACK'];
    if (!substack) throw new Error('if blocks (SUBSTACK) not found');
    if (context.instance.resolve(condition)) {
      context.instance.execute(substack.child);
    }
  },
  if_else: (context: DispatchContext) => {
    const condition = context.values['CONDITION'];
    if (!condition) throw new Error('CONDITION not found');
    const substack = context.statements['SUBSTACK'];
    if (!substack) throw new Error('if blocks (SUBSTACK) not found');
    const substack2 = context.statements['SUBSTACK2'];
    if (!substack2) throw new Error('else blocks (SUBSTACK2) not found');
    if (context.instance.resolve(condition)) {
      context.instance.execute(substack.child);
    } else {
      context.instance.execute(substack2.child);
    }
  },
  forever: (context: DispatchContext) => {
    const substack = context.statements['SUBSTACK'];
    if (!substack) for (;;);
    while (true) {
      context.instance.execute(substack.child);
    }
  },
  wait_until: (context: DispatchContext) => {
    const condition = context.values['CONDITION'];
    if (!condition) throw new Error('CONDITION not found');
    while (!context.instance.resolve(condition)) {
      // NOP
    }
  },
  run: (context: DispatchContext) => {
    // NOP
  },
} as Module;