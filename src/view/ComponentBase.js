// @flow
export default class ComponentBase {
  _title: string

  constructor(title: string) {
    this._title = title;
  }

  get title() {
    return this._title;
  }

  render() {
    throw new Error('Method is abstract.  Override in subclass.')
  }

  async handle(key: string): Promise<void> {
    throw new Error('Method is abstract.  Override in subclass.')
  }
}