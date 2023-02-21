const find = (element: Element, name: string): Element => {
  const ret = element.getElementsByTagName(name)[0];
  if (ret === undefined) throw new Error(`Expected element <${name}> not found`);
  return ret;
};

export interface Variable {
  t: 'variable';
  name: string;
  type: string;
  id: string;
  islocal: boolean;
  iscloud: boolean;
}

export namespace Variable {
  export const parse = (element: Element): Variable => {
    return {
      t: 'variable',
      name: element.getAttribute('name') || '',
      type: element.getAttribute('type') || '',
      id: element.getAttribute('id') || '',
      islocal: element.getAttribute('islocal') === 'true',
      iscloud: element.getAttribute('iscloud') === 'true'
    };
  };
}

export interface Block {
  t: 'block';
  type: string;
  id: string;
  members: Member[];
  next?: Block;
}

export namespace Block {
  export const is = (value: unknown): value is Block  => {
    return typeof value === 'object' && value !== null && value['t'] === 'block';
  };

  export const parse = (element: Element): Block => {
    
    const memberNodes = [];
    for (let i = 0; i < element.childNodes.length; i++) {
      const node = element.childNodes[i];
      if (node.nodeName !== 'value' && node.nodeName !== 'statement' && node.nodeName !== 'field') continue;
      memberNodes.push(node);
    }

    const nextElement = element.getElementsByTagName('next')[0];
    let next: Block;
    if (nextElement !== undefined) {
      next = Block.parse(find(nextElement, 'block'));
    }
    
    return {
      t: 'block',
      type: element.getAttribute('type') || '',
      id: element.getAttribute('id') || '',
      members: memberNodes.map(Member.parse),
      next
    };
  }
}

export interface Field {
  t: 'field';
  name: string;
  value: unknown;
  variabletype?: string;
}

export namespace Field {
  export const parse = (element: Element): Field => {
    return {
      t: 'field',
      name: element.getAttribute('name') || '',
      value: element.textContent || '',
      variabletype: element.getAttribute('variabletype')
    };
  };
}

export interface Shadow {
  t: 'shadow';
  type: string;
  id: string;
  field: Field;
}

export namespace Shadow {
  export const is = (value: unknown): value is Shadow  => {
    return typeof value === 'object' && value !== null && value['t'] === 'shadow';
  };

  export const parse = (element: Element): Shadow => {
    const field = find(element, 'field');
    return {
      t: 'shadow',
      type: element.getAttribute('type') || '',
      id: element.getAttribute('id') || '',
      field: Field.parse(field)
    };
  };
}

export interface Value {
  t: 'value';
  name: string;
  child: Block | Shadow;
}

export namespace Value {
  export const is = (value: unknown): value is Value => {
    return typeof value === 'object' && value !== null && value['t'] === 'value';
  };

  export const parse = (element: Element): Value => {
    let child: Block | Shadow;
    try {
      child = Block.parse(find(element, 'block'));
    } catch(e) {
      child = Shadow.parse(find(element, 'shadow'));
    }
    return {
      t: 'value',
      name: element.getAttribute('name') || '',
      child
    };
  };
}

export interface Statement {
  t: 'statement';
  name: string;
  child: Block;
}

export namespace Statement {
  export const is = (value: unknown): value is Statement  => {
    return typeof value === 'object' && value !== null && value['t'] === 'statement';
  };

  export const parse = (element: Element): Statement => {
    const child = find(element, 'block');
    return {
      t: 'statement',
      name: element.getAttribute('name') || '',
      child: Block.parse(child)
    };
  };
}

export type Member = Value | Statement | Field;

export namespace Member {
  export const parse = (element: Element): Member => {
    switch (element.nodeName) {
      case 'value': return Value.parse(element);
      case 'statement': return Statement.parse(element);
      case 'field': return Field.parse(element);
      default: throw new Error(`Unexpected member type: ${element.nodeName}`);
    }
  };
}

export interface Ast {
  variables: Variable[];
  block: Block;
}

export namespace Ast {
  export const parse = (source: XMLDocument): Ast => {
    const root = source.documentElement;

    const variables: Variable[] = [];
    const variablesElement = find(root, 'variables');
    if (variablesElement) {
      for (let i = 0; i < variablesElement.childNodes.length; ++i) {
        let node = variablesElement.childNodes[i] as Element;
        if (node.nodeName !== 'variable') continue;
        variables.push(Variable.parse(node));
      }
    }

    let controlRun: Element;
    for (let i = 0; i < root.childNodes.length; ++i) {
      const node = root.childNodes[i];
      const element = node as Element;

      if (element.nodeName !== 'block' || element.getAttribute('type') !== 'control_run') continue;

      if (controlRun !== undefined) throw new Error('Multiple control_run blocks found');
      controlRun = node as Element;
    }

    if (!controlRun) throw new Error('control_run block not found');

    const block = Block.parse(controlRun);
    return { variables, block };
  };
}

export default Ast;