const Model = require('objection').Model;
const schema = require('./type.schema.json');

class Type extends Model {
  static get tableName() {
    return 'type';
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Type;
