import ext from '../src/const';

export default class Page {
  constructor(context, parameters) {

    this.pageContext = {
      extensionName: ext(),
      ...context,
    };

    this.parameters = parameters;
  }

  getPageContext() {
    return this.pageContext;
  }

  getParameters() {
    return this.parameters;
  }
}
