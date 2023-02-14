import { DispatchContext } from './Instance';

export interface Module {
  [name: string]: (context: DispatchContext) => unknown;
}