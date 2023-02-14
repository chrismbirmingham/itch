import { DispatchContext, RETURN_VALUE } from '../Instance';
import { Module } from '../Module';

export default {
  not: (context: DispatchContext) => {
    const operand = context.values['OPERAND'];
    if (!operand) throw new Error('OPERAND not found');
    return !context.resolve(operand);
  }
} as Module;