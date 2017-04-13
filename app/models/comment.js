const { model } = require('koapi')
const Joi = require('joi')

exports.default = class Comment extends model.Base {
  get tableName () {
    return 'comments'
  }
  get hasTimestamps () {
    return true
  }

  static get fields () {
    return {
      title: Joi.string().min(3).max(30).required(),
      contents: Joi.string(),
      user_id: Joi.number().integer(),
      post_id: Joi.number().integer()
    }
  };
}
