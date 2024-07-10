import {=modelName.pascalCase=} from './{=moduleName=}-model';
import { CrudSequelizeRepository } from '../../shared/repository';

export class {=modelName.pascalCase=}Repository extends CrudSequelizeRepository<{=modelName.pascalCase=}> {
  constructor() {
    super({=modelName.pascalCase=});
  }
}

export default new {=modelName.pascalCase=}Repository();
