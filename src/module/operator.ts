import { DispatchContext, RETURN_VALUE } from '../Instance';
import { Module } from '../Module';
import { toNumber } from '../util';

export default {
  add: (ctx: DispatchContext) => {
    const num1 = toNumber(ctx.resolveValue('NUM1'));
    const num2 = toNumber(ctx.resolveValue('NUM2'));

    return num1 + num2;
  },
  subtract: (ctx: DispatchContext) => {
    const num1 = toNumber(ctx.resolveValue('NUM1'));
    const num2 = toNumber(ctx.resolveValue('NUM2'));

    return num1 - num2;
  },
  multiply: (ctx: DispatchContext) => {
    const num1 = toNumber(ctx.resolveValue('NUM1'));
    const num2 = toNumber(ctx.resolveValue('NUM2'));
    
    return num1 * num2;
  },
  divide: (ctx: DispatchContext) => {
    const num1 = toNumber(ctx.resolveValue('NUM1'));
    const num2 = toNumber(ctx.resolveValue('NUM2'));

    return num1 / num2;
  },
  random: (ctx: DispatchContext) => {
    const from = toNumber(ctx.resolveValue('FROM'));
    const to = toNumber(ctx.resolveValue('TO'));

    if (typeof from === 'number' && typeof to === 'number') return Math.floor(Math.random() * (to - from + 1)) + from;
    throw new Error('Invalid operand type');
  },
  lt: (ctx: DispatchContext) => {
    const num1 = toNumber(ctx.resolveValue('OPERAND1'));
    const num2 = toNumber(ctx.resolveValue('OPERAND2'));

    return num1 < num2;
  },
  eq: (ctx: DispatchContext) => {
    const num1 = ctx.resolveValue('OPERAND1');
    const num2 = ctx.resolveValue('OPERAND2');

    if (typeof num1 === 'number' && typeof num2 === 'number') return num1 === num2;
    if (typeof num1 === 'string' && typeof num2 === 'string') return num1 === num2;
    throw new Error('Invalid operand type');
  },
  gt: (ctx: DispatchContext) => {
    const num1 = toNumber(ctx.resolveValue('OPERAND1'));
    const num2 = toNumber(ctx.resolveValue('OPERAND2'));

    return num1 > num2;
  },
  and: (ctx: DispatchContext) => {
    const num1 = ctx.resolveValue('OPERAND1');
    const num2 = ctx.resolveValue('OPERAND2');

    if (typeof num1 === 'boolean' && typeof num2 === 'boolean') return num1 && num2;
    throw new Error('Invalid operand type');
  },
  or: (context: DispatchContext) => {
    const operand1 = context.values['OPERAND1'];
    if (!operand1) throw new Error('OPERAND1 not found');
    const operand2 = context.values['OPERAND2'];
    if (!operand2) throw new Error('OPERAND2 not found');

    const num1 = context.instance.resolve(operand1);
    const num2 = context.instance.resolve(operand2);

    if (typeof num1 === 'boolean' && typeof num2 === 'boolean') return num1 || num2;
    throw new Error('Invalid operand type');
  },
  not: (context: DispatchContext) => {
    const operand = context.values['OPERAND'];
    if (!operand) throw new Error('OPERAND not found');
    return !context.instance.resolve(operand);
  },
  join: (context: DispatchContext) => {
    const string1 = context.values['STRING1'];
    if (!string1) throw new Error('STRING1 not found');
    const string2 = context.values['STRING2'];
    if (!string2) throw new Error('STRING2 not found');

    const str1 = context.instance.resolve(string1);
    const str2 = context.instance.resolve(string2);

    if (typeof str1 === 'string' && typeof str2 === 'string') return str1 + str2;
    throw new Error('Invalid operand type');
  },
  letter_of: (context: DispatchContext) => {
    const string = context.values['STRING'];
    if (!string) throw new Error('STRING not found');
    const letter = context.values['LETTER'];
    if (!letter) throw new Error('LETTER not found');

    const str = context.instance.resolve(string);
    const idx = context.instance.resolve(letter);

    if (typeof str === 'string' && typeof idx === 'number') return str[idx];
    throw new Error('Invalid operand type');
  },
  length: (context: DispatchContext) => {
    const string = context.values['STRING'];
    if (!string) throw new Error('STRING not found');
    const str = context.instance.resolve(string);
    if (typeof str === 'string') return str.length;
    throw new Error('Invalid operand type');
  },
  contains: (context: DispatchContext) => {
    const string = context.values['STRING1'];
    if (!string) throw new Error('STRING1 not found');
    const substring = context.values['STRING2'];
    if (!substring) throw new Error('STRING2 not found');

    const str = context.instance.resolve(string);
    const sub = context.instance.resolve(substring);

    if (typeof str === 'string' && typeof sub === 'string') return str.includes(sub);
    throw new Error('Invalid operand type');
  },
  mod: (context: DispatchContext) => {
    const num1 = toNumber(context.resolveValue('NUM1'));
    const num2 = toNumber(context.resolveValue('NUM2'));

    return num1 % num2;
  },
  round: (context: DispatchContext) => Math.round(toNumber(context.resolveValue('NUM'))),
  mathop: (context: DispatchContext) => {
    const n = toNumber(context.resolveValue('NUM'));
    const operator = context.resolveField('OPERATOR');
    if (!operator) throw new Error('OPERATOR not found');

    const op = context.instance.resolve(operator);

    if (typeof op !== 'string') throw new Error('Invalid operand type');

    switch (op) {
      case 'abs': return Math.abs(n);
      case 'floor': return Math.floor(n);
      case 'ceiling': return Math.ceil(n);
      case 'sqrt': return Math.sqrt(n);
      case 'sin': return Math.sin(n);
      case 'cos': return Math.cos(n);
      case 'tan': return Math.tan(n);
      case 'asin': return Math.asin(n);
      case 'acos': return Math.acos(n);
      case 'atan': return Math.atan(n);
      case 'ln': return Math.log(n);
      case 'log': return Math.log10(n);
      case 'e ^': return Math.exp(n);
      case '10 ^': return Math.pow(10, n);
      default: throw new Error('Invalid operator');
    }
  }
} as Module;