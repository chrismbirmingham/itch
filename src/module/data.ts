import { DispatchContext } from '../Instance';
import { Module } from '../Module';
import { toNumber } from '../util';

export default {
  variable: (ctx: DispatchContext) => ctx.heap.get(ctx.getField('VARIABLE').value as string),
  showvariable: (ctx: DispatchContext) => ctx.show(ctx, ctx.getField('VARIABLE').value as string),
  hidevariable: (ctx: DispatchContext) => ctx.hide(ctx, ctx.getField('VARIABLE').value as string),
  showlist: (ctx: DispatchContext) => ctx.show(ctx, ctx.getField('LIST').value as string),
  hidelist: (ctx: DispatchContext) => ctx.hide(ctx, ctx.getField('LIST').value as string),
  itemoflist: (ctx: DispatchContext) => {
    const list = ctx.heap.get(ctx.getField('LIST').value as string);
    const index = toNumber(ctx.resolveValue('INDEX'));

    if (typeof index !== 'number') throw new Error('INDEX must be number');
    if (!Array.isArray(list)) throw new Error('LIST must be array');

    return list[index];
  },
  lengthoflist: (ctx: DispatchContext) => {
    const list = ctx.heap.get(ctx.getField('LIST').value as string)
    if (!Array.isArray(list)) throw new Error('LIST must be array');
    return list.length;
  },
  itemnumoflist: (ctx: DispatchContext) => {
    const list = ctx.heap.get(ctx.getField('LIST').value as string)

    if (!Array.isArray(list)) throw new Error('LIST must be array');

    return list.indexOf(ctx.resolveValue('ITEM'));
  },
  addtolist: (ctx: DispatchContext) => {
    const list = ctx.heap.get(ctx.getField('LIST').value as string)

    if (!Array.isArray(list)) throw new Error('LIST must be array');

    list.push(ctx.resolveValue('ITEM'));
  },
  deletealloflist: (ctx: DispatchContext) => {
    const list = ctx.heap.get(ctx.getField('LIST').value as string)
    if (Array.isArray(list)) list.length = 0;
  },
  deleteoflist: (ctx: DispatchContext) => {
    const list = ctx.heap.get(ctx.getField('LIST').value as string)
    const index = toNumber(ctx.resolveValue('INDEX'));

    if (typeof index !== 'number') throw new Error('INDEX must be number');

    if (!Array.isArray(list)) throw new Error('LIST must be array');

    list.splice(index, 1);
  },
  insertatlist: (ctx: DispatchContext) => {
    const list = ctx.heap.get(ctx.getField('LIST').value as string)
    const index = toNumber(ctx.resolveValue('INDEX'));
    const item = ctx.resolveValue('ITEM');

    if (typeof index !== 'number') throw new Error('INDEX must be number');

    if (!Array.isArray(list)) throw new Error('LIST must be array');

    list.splice(index, 0, item);
  },
  changevariableby: (ctx: DispatchContext) => {
    const variable = ctx.getField('VARIABLE');
    const value = toNumber(ctx.resolveValue('VALUE'));

    if (typeof value !== 'number') throw new Error('VALUE must be number');

    const currentValue = ctx.heap.get(variable.value as string);
    if (typeof currentValue !== 'number') throw new Error('VARIABLE must be number')

    ctx.heap.set(variable.name, currentValue + value);
  },
  setvariableto: (ctx: DispatchContext) => {
    const variable = ctx.getField('VARIABLE');
    const value = ctx.resolveValue('VALUE');

    ctx.heap.set(variable.value as string, value);
  }
} as Module;