import { XJsonApiSerializer } from './serializer';
import { createInputMiddleware } from './input';
import { createOutputMiddleware } from './output';

const serializer = new XJsonApiSerializer({
  jsonapiObject: false,
  topLevelLinks: (extraData) => {
    if (extraData.paginationLinks) {
      return extraData.paginationLinks;
    }
    return null;
  },
  topLevelMeta: (extraData) => {
    if (extraData.meta) {
      return extraData.meta;
    }
    return null;
  },
});

export function registerType(type: string, options) {
  serializer.register(type, options);
}

export function parseInput(type?: string) {
  return createInputMiddleware(serializer, type);
}

export function generateOutput(type?: string, options?) {
  return createOutputMiddleware(serializer, type, options);
}
