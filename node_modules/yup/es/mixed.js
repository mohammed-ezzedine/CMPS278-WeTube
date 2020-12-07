import BaseSchema from './schema';
export function create() {
  return new MixedSchema();
}
export default class MixedSchema extends BaseSchema {}
create.prototype = MixedSchema.prototype;