import { createScopedReducer } from '@shoutem/api';

/*
export default createScopedReducer({
  extension: {
    test: () => {
      return { a: 2 };
    },
  },
});*/

export default (page) => (
  createScopedReducer({
    extension: {
      test: () => {
        return { a: page.getPageContext().extensionName };
      },
    },
  })
);
