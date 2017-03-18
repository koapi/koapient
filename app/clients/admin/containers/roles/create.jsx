import React from 'react'
import Joi from 'joi'
import modal from '../../components/resource/modal_form'
import PermissionEditor from './permission_editor'
import { FormattedMessage } from 'react-intl'

const schema = {
  name: Joi.string().required(),
  desc: Joi.string(),
  permissions: Joi.object()
}

export default modal({
  resource: 'role',
  formTitle: '添加权限',
  method: 'post',
  fields: [
    {name: 'name', label: <FormattedMessage id='role.name' />, type: 'text'},
    {name: 'desc', label: <FormattedMessage id='role.desc' />, type: 'text'},
    (Field, Input) => (<PermissionEditor key='permission' />)
  ],
  validate: schema
})
