import _ from 'lodash';

const ioSequelizeSortMapping = {
  desc: 'DESC',
  asc: 'ASC',
};

export default function mapIoSortToSequelizeSort(ioSort) {
  const sequelizeSort = [];
  _.forEach(ioSort, (sort) => {
    if (_.startsWith(sort, '-')) {
      sequelizeSort.push([_.trimStart(sort, '-'), ioSequelizeSortMapping.desc]);
      return;
    }

    if (_.startsWith(sort, '+')) {
      sequelizeSort.push([_.trimStart(sort, '+'), ioSequelizeSortMapping.asc]);
      return;
    }

    sequelizeSort.push([sort]);
  });

  return sequelizeSort;
}
