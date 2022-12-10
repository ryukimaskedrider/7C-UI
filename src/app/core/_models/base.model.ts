export abstract class BaseModel {

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  deserialize(data: any): this {
    Object.assign(this, data);

    return this;
  }

  has(attr: string): boolean {
    return this.hasOwnProperty(attr);
  }
}
