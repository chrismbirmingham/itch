import * as fs from 'fs';

import Ast from '../../src/Ast';

import { DOMParser } from 'xmldom';
import path = require('path');
import Instance from '../../src/Instance';

import digital from './digital';
import motor from './motor';
import operator from '../../src/module/operator';
import control from '../../src/module/control';

const sourceXmlPath = path.join(__dirname, 'source.xml');
const sourceXml = fs.readFileSync(sourceXmlPath, 'utf8');

const doc = new DOMParser().parseFromString(sourceXml, 'text/xml');

const instance = new Instance({
  source: doc,
  modules: {
    digital,
    operator,
    control,
    motor
  }
});

instance.run();