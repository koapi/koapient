const compose = require('koa-compose')
const { authenticate } = require('./passport')
const _ = require('lodash')

exports.default = {
  required () {
    return authenticate('bearer')
  },
  grant (permission) {
    return compose([authenticate('bearer'), async (ctx, next) => {
      // load role
      await ctx.state.user.load('roles')
      let result = ctx.state.user.related('roles').find(role => {
        // super role
        if (role.get('permissions') === true) return true
        // check permission item
        return _.get(role.get('permissions').features, permission) === true
      })
      if (!result) {
        return ctx.throw(`Access Denied - You don't have permission to: ${permission}`, 403)
      }
      return await next()
    }])
  }
}