"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.default = void 0;

var _schema = _interopRequireDefault(require("./schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  return new MixedSchema();
}

class MixedSchema extends _schema.default {}

exports.default = MixedSchema;
create.prototype = MixedSchema.prototype;