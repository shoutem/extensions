import Feed from './feed-model';
import { CrudSequelizeRepository } from '../../shared/repository';

export class FeedRepository extends CrudSequelizeRepository<Feed> {
  constructor() {
    super(Feed);
  }
}

export default new FeedRepository();
