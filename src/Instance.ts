import Ast, { Block, Field, Shadow, Statement, Value } from './Ast';
import { Module } from './Module';

export interface InstanceIncompleteOptions {
  /**
   * The source of the instance (scratch v3.0 XML)
   */
  source: XMLDocument;

  modules?: { [name: string]: Module };

  show?: (ctx: DispatchContext, name: string) => void;

  hide?: (ctx: DispatchContext, name: string) => void;

  tick?: (ctx: DispatchContext) => void;
}

export namespace InstanceIncompleteOptions {
  export const complete = (options: InstanceIncompleteOptions): InstanceCompleteOptions => {
    return {
      source: Ast.parse(options.source),
      modules: options.modules || {},
      show: options.show || ((ctx, name) => console.log('show', name, ctx.instance.heap.get(name))),
      hide: options.hide || ((ctx, name) => console.log('hide', name, ctx.instance.heap.get(name))),
      tick: options.tick,
    };
  };
}

export interface InstanceCompleteOptions {
  source: Ast;

  modules: { [name: string]: Module };

  show: (ctx: DispatchContext, name: string) => void;
  hide: (ctx: DispatchContext, name: string) => void;
  tick?: (ctx: DispatchContext) => void;
}

export const RETURN_VALUE = '$$$RETURN_VALUE$$$';

export class DispatchContext {
  readonly instance: Instance;
  readonly values: { [name: string]: Value; } = {};
  readonly statements: { [name: string]: Statement; } = {};
  readonly fields: { [name: string]: Field; } = {};

  constructor(instance: Instance) {
    this.instance = instance;
  }

  get show() { return this.instance.show; }
  get hide() { return this.instance.hide; }
  get heap() { return this.instance.heap; }

  getValue(name: string) {
    const ret = this.values[name];
    if (!ret) throw new Error(`No value named ${name}`);
    return ret;
  }

  getStatement(name: string) {
    const ret = this.statements[name];
    if (!ret) throw new Error(`No statement named ${name}`);
    return ret;
  }

  getField(name: string) {
    const ret = this.fields[name];
    if (!ret) throw new Error(`No field named ${name}`);
    return ret;
  }

  resolveValue(name: string) {
    return this.instance.resolve(this.getValue(name));
  }

  resolveField(name: string) {
    return this.heap[this.getField(name).name];
  }
}

export interface InstanceError {
  t: 'instance-error';
  module: string;
  function: string;
  original: Error;
}

export namespace InstanceError {
  export const is = (value: unknown): value is InstanceError => {
    return typeof value === 'object' && value !== null && value['t'] === 'instance-error';
  };
}

class Instance {
  private options_: InstanceCompleteOptions;
  get options() { return this.options_; }

  get source() { return this.options_.source; }
  get modules() { return this.options_.modules; }
  get show() { return this.options_.show; }
  get hide() { return this.options_.hide; }

  private heap_: Map<string, unknown> = new Map();
  get heap() { return this.heap_; }

  constructor(options: InstanceIncompleteOptions) {
    this.options_ = InstanceIncompleteOptions.complete(options);
    for (const name in this.options_.modules) {
      this.registerModule_(name, this.options_.modules[name]);
    }
    this.updateSortedModuleNames_();
  }

  private modules_: Map<string, Module> = new Map();
  private sortedModuleNames_: string[] = [];
  private updateSortedModuleNames_() {
    this.sortedModuleNames_ = [...this.modules_.keys()];
    this.sortedModuleNames_.sort((a, b) => b.length - a.length);
  }
  
  readonly registerModule = (name: string, module: Module) => {
    this.registerModule_(name, module);
    this.updateSortedModuleNames_();
  };

  private readonly registerModule_ = (name: string, module: Module) => {
    this.modules_.set(name, module);
  };

  readonly resolve = (value: Value): unknown => {
    switch (value.child.t) {
      case 'block': {
        return this.execute(value.child);
      }
      case 'shadow': {
        return value.child.field.value;
      }
    }
  };

  readonly execute = (block: Block): unknown => {
    let context = new DispatchContext(this);

    for (const member of block.members) {
      switch (member.t) {
        case 'value': {
          context.values[member.name] = member;
          break;
        }
        case 'statement': {
          context.statements[member.name] = member;
          break;
        }
        case 'field': {
          context.fields[member.name] = member;
          break;
        }
      }
    }

    let moduleName: string;
    for (const module of this.sortedModuleNames_) {
      if (!block.type.startsWith(module + '_')) continue;
      moduleName = module;
    }

    const module = this.modules_.get(moduleName);
    if (!module) throw new Error(`No module registered for block type ${moduleName}`);
    const functionName = block.type.slice(moduleName.length + 1);
    const func = module[functionName];
    if (!func) throw new Error(`No function registered for block type ${block.type}`);
    

    let ret: unknown;
    try {
      ret = func(context);
    } catch (e) {
      console.log('instance error', e);
      throw {
        module: moduleName,
        function: functionName,
        original: e,
        t: 'instance-error',
      } as InstanceError;
    }
    this.options_.tick?.(context);

    if (block.next) {
      this.execute(block.next);
    }

    return ret;
  }

  run() {

    for (const variable of this.options_.source.variables || []) {
      this.heap_.set(variable.name, undefined);
    }
    this.execute(this.options_.source.block);
  }
}

export default Instance;