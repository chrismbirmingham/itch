import { DispatchContext } from '../Instance';
import { Module } from '../Module';

export default {
  variable: (ctx: DispatchContext) => ctx.resolveField('VARIABLE'),
  showvariable: (ctx: DispatchContext) => ctx.show(ctx.getField('VARIABLE').name),
  hidevariable: (ctx: DispatchContext) => ctx.hide(ctx.getField('VARIABLE').name),
  showlist: (ctx: DispatchContext) => ctx.show(ctx.getField('LIST').name),
  hidelist: (ctx: DispatchContext) => ctx.hide(ctx.getField('LIST').name),
  itemoflist: (ctx: DispatchContext) => {
    const list = ctx.resolveField('LIST');
    const index = ctx.resolveValue('INDEX');

    if (typeof index !== 'number') throw new Error('INDEX must be number');
    if (!Array.isArray(list)) throw new Error('LIST must be array');

    return list[index];
  },
  lengthoflist: (ctx: DispatchContext) => {
    const list = ctx.resolveField('LIST');
    if (!Array.isArray(list)) throw new Error('LIST must be array');
    return list.length;
  },
  itemnumoflist: (ctx: DispatchContext) => {
    const list = ctx.resolveField('LIST');

    if (!Array.isArray(list)) throw new Error('LIST must be array');

    return list.indexOf(ctx.resolveValue('ITEM'));
  },
  addtolist: (ctx: DispatchContext) => {
    const list = ctx.resolveField('LIST');

    if (!Array.isArray(list)) throw new Error('LIST must be array');

    list.push(ctx.resolveValue('ITEM'));
  },
  deletealloflist: (ctx: DispatchContext) => {
    const list = ctx.resolveField('LIST');
    if (Array.isArray(list)) list.length = 0;
  },
  deleteoflist: (ctx: DispatchContext) => {
    const list = ctx.resolveField('LIST');
    const index = ctx.resolveValue('INDEX');

    if (typeof index !== 'number') throw new Error('INDEX must be number');

    if (!Array.isArray(list)) throw new Error('LIST must be array');

    list.splice(index, 1);
  },
  insertatlist: (ctx: DispatchContext) => {
    const list = ctx.resolveField('LIST');
    const index = ctx.resolveValue('INDEX');
    const item = ctx.resolveValue('ITEM');

    if (typeof index !== 'number') throw new Error('INDEX must be number');

    if (!Array.isArray(list)) throw new Error('LIST must be array');

    list.splice(index, 0, item);
  },
  changevariableby: (ctx: DispatchContext) => {
    const variable = ctx.getField('VARIABLE');
    const value = ctx.resolveValue('VALUE');

    if (typeof value !== 'number') throw new Error('VALUE must be number');
    if (typeof variable.value !== 'number') throw new Error('VARIABLE must be number')

    ctx.heap.set(variable.name, variable.value + value);
  }

} as Module;