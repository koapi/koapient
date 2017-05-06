const { router } = require('koapi')
const { User } = require('../../../models')
const { default: user } = require('../middlewares/user')
const _ = require('lodash')

exports.default = router.define('resource', {
  model: User,
  setup (router) {
    router.use(user.grant('admin.users'))
    router.create(async (ctx, next) => {
      const roles = ctx.request.body.roles
      ctx.state.attributes = _.omit(ctx.request.body, ['roles'])
      await next()
      if (roles) ctx.state.resource.roles().attach(roles)
    }).read({
      list: {
        sortable: ['created_at'],
        searchable: ['username', 'email']
      },
      item: {
        fetch: {
          withRelated: ['roles']
        }
      }
    }).update(async (ctx, next) => {
      const roles = ctx.request.body.roles
      ctx.state.attributes = _.omit(ctx.request.body, ['roles'])
      await next()
      if (roles) {
        await ctx.state.resource.roles().detach()
        await ctx.state.resource.roles().attach(roles)
      }
    }).destroy(async (ctx, next) => {
      if (ctx.state.user.get('id') === parseInt(ctx.params.id)) {
        throw new Error('can not destroy yourself')
      }
      await next()
    })
  }
})