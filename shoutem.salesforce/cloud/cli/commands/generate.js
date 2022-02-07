import bluebird from 'bluebird';
import { generateModule } from './generate/services/code-generator';
import { getProperties } from './generate/services/input-properties-handler';
import { getAssociations } from './generate/services/input-associations-handler';
export const command = 'generate <modelName>';

export const desc = 'node-seed-project scaffolding';

async function generateModuleWrapper({ onlyDocs, modelName, properties, associations, foreignKeys, predefined }) {
  if (!predefined) {
    properties = await getProperties();
  }

  if (!predefined) {
    const data = await getAssociations();
    associations = data.associations;
    foreignKeys = data.foreignKeys;
  }

  generateModule({
    properties,
    associations,
    foreignKeys,
    modelName,
    onlyDocs,
  });
}

export async function handler(args) {
  const file = args.file;

  if (!file) {
    await generateModuleWrapper(args);
  } else {
    // modelName, properties, associations, foreignKeys
    const models = require(file).default;
    await bluebird.each(models, (model) => {
      return generateModule({
        ...args,
        modelName: model.name,
        properties: model.properties,
        associations: model.associations,
        foreignKeys: model.foreignKeys,
        predefined: true,
      });
    });
  }
}

export function builder(yargs) {
  // return yargs.commandDir('generate');
}
