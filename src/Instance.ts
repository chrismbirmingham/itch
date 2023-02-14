import Ast, { Block, Shadow, Statement, Value } from './Ast';
import { Module } from './Module';

export interface InstanceIncompleteOptions {
  /**
   * The source of the instance (scratch v3.0 XML)
   */
  source: XMLDocument;

  modules?: { [name: string]: Module };
}

export namespace InstanceIncompleteOptions {
  export const complete = (options: InstanceIncompleteOptions): InstanceCompleteOptions => {
    return {
      source: Ast.parse(options.source),
      modules: options.modules || {},
    };
  };
}

export interface InstanceCompleteOptions {
  source: Ast;

  modules: { [name: string]: Module };
}

export const RETURN_VALUE = '$$$RETURN_VALUE$$$';

export interface DispatchContext {
  readonly heap: Map<string, unknown>;
  readonly values: { [name: string]: Value; };
  readonly statements: { [name: string]: Statement; };
  readonly execute: (block: Block) => unknown;
  readonly resolve: (value: Value) => unknown;
}

class Instance {
  private options_: InstanceCompleteOptions;
  
  get options() { return this.options_; }

  constructor(options: InstanceIncompleteOptions) {
    this.options_ = InstanceIncompleteOptions.complete(options);
    for (const name in this.options_.modules) {
      this.registerModule(name, this.options_.modules[name]);
    }
    console.log(this.options_.source);
  }


  private modules_: Map<string, Module> = new Map();
  readonly registerModule = (name: string, module: Module) => {
    this.modules_.set(name, module);
  };

  private resolve_ = (value: Value): unknown => {
    switch (value.child.t) {
      case 'block': {
        return this.executeBlock_(value.child);
      }
      case 'shadow': {
        return value.child.field.value;
      }
    }
  };

  private executeBlock_ = (block: Block): unknown => {
    console.log('executing', block.type, '...');
    let context: DispatchContext = {
      heap: this.heap_,
      values: {},
      statements: {},
      execute: this.executeBlock_,
      resolve: this.resolve_,
    };

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
      }
    }

    const moduleName = block.type.split('_')[0];
    const module = this.modules_.get(moduleName);
    if (!module) throw new Error(`No module registered for block type ${moduleName}`);
    const func = module[block.type.slice(moduleName.length + 1)];
    if (!func) throw new Error(`No function registered for block type ${block.type}`);
    const ret = func(context);

    if (block.next) {
      console.log('next block found, executing...');
      this.executeBlock_(block.next);
    }

    return ret;
  }

  private heap_: Map<string, unknown> = new Map();

  run() {
    this.executeBlock_(this.options.source.block);
  }
}

export default Instance;