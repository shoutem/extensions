import _ from 'lodash';

export class PageInfo {
  public limit!: number;

  public offset!: number;

  public hasNext?: boolean;
}

export class PageMeta {
  public count?: number;
}

export class PagedCollection<T> {
  private _pageItems: T[];

  private _pageInfo: PageInfo;

  private _pageMeta: PageMeta;

  constructor(pageItems: T[], pageInfo: PageInfo, pageMeta: PageMeta) {
    this._pageItems = pageItems;
    this._pageInfo = pageInfo;
    this._pageMeta = pageMeta;
  }

  static createFromNPlus1Result<T>(resultItems: T[], requestedPage) {
    const hasNext = resultItems.length > requestedPage.limit;
    const items = _.take(resultItems, requestedPage.limit);
    return new PagedCollection<T>(items, { ...requestedPage, hasNext }, {});
  }

  static createFromNPlus1CountAllResult<T>(resultItems: T[], count: number, requestedPage) {
    const hasNext = resultItems.length > requestedPage.limit;
    const items = _.take(resultItems, requestedPage.limit);

    return new PagedCollection<T>(items, { ...requestedPage, hasNext }, { count });
  }

  static createFromCompleteResult<T>(resultItems: T[], requestedPage) {
    const hasNext = resultItems.length > requestedPage.limit + requestedPage.offset;
    const items = _.take(_.drop(resultItems, requestedPage.offset), requestedPage.limit);
    return new PagedCollection<T>(items, { ...requestedPage, hasNext }, {});
  }

  [Symbol.iterator]() {
    let index = -1;
    const pageItems = this._pageItems;

    return {
      next: () => ({ value: pageItems[++index], done: !(index in pageItems) }),
    };
  }

  getPageInfo(): PageInfo {
    return this._pageInfo;
  }

  getPageItems(): T[] {
    return this._pageItems;
  }

  getPageMeta(): PageMeta {
    return this._pageMeta;
  }

  setPageItems(items: T[]) {
    this._pageItems = items;
  }
}
