import React from 'react'
import Joi from 'joi'
import { toastr } from 'react-redux-toastr'
import Dropzone from 'react-dropzone'
import { Field } from 'redux-form'
import { Button, Input } from 'reactstrap'
import { Select } from '../../components/form'
import modal from '../../components/resource/modal_form'
import { actions as async } from '../../reduxers/async'
import { FormattedMessage } from 'react-intl'
import { CreateForm } from './create'
import _ from 'lodash'

const schema = {
  username: Joi.string().required(),
  avatar: Joi.string().allow(''),
  roles: Joi.array(),
  email: Joi.string().email().required()
}

export class EditForm extends CreateForm {}

export default modal({
  mapStateToProps: state => {
    let res = _.get(state.async, `user.response`)
    let user
    if (res) {
      let roles
      const { username, email, avatar } = res
      if (res.roles) {
        roles = res.roles.map(role => ({value: role.id, label: role.name}))
      }
      user = {roles, username, email, avatar}
      user.avatar = user.avatar || ''
    }
    return {
      initialValues: user,
      async: state.async,
      user_form: state.form.user_form
    }
  },
  resource: 'user',
  formTitle: '编辑用户',
  method: 'patch',
  body: function (fields) {
    const { user_form, async } = this.props
    return (
      <div className='row'>
        <div className='col-sm-3'>
          <Dropzone ref={node => { this.dropzone = node }} onDrop={this.handleUpload.bind(this)} multiple={false} style={{}}>
            {({acceptedFiles}) => {
              if (_.get(async, 'avatar.status') === 'fulfilled') {
                return <div className='image rounded' style={{backgroundImage: `url(${async.avatar.response.file_path})`}} />
              } else {
                return <div className='image rounded' style={{backgroundImage: `url(${_.get(user_form, 'values.avatar')})`}} />
              }
            }}
          </Dropzone>
          <Button type='button' block color='primary' size='sm' onClick={e => this.dropzone.open()}>上传</Button>
          <Field component={({input, meta, ...others}) => (<Input {...input} {...others} />)}
            style={{display: 'none'}} type='text' name='avatar' />
        </div>
        <div className='col-sm-9'>{fields}</div>
      </div>
    )
  },
  fields: [
    {name: 'username', label: <FormattedMessage id='username' />, type: 'text'},
    {name: 'email', label: <FormattedMessage id='email' />, type: 'text'},
    function (props) {
      const { async } = this.props
      const options = _.get(async, 'roles.response', []).map(role => ({value: role.id, label: role.name}))
      return <Field key='roles' component={Select} label={<FormattedMessage id='user.role' />} multi name='roles' options={options} />
    }
  ],
  submit (values) {
    const { intl, dispatch, match } = this.props
    const { roles } = values
    const data = _.omit(values, ['id', 'roles'])
    return new Promise((resolve, reject) => {
      dispatch(async.patch('user')(`/users/${match.params.id}`, {...data, roles: roles.map(role => role.value)})).then(v => {
        this.close()
        toastr.success(intl.formatMessage({id: 'success_title'}), intl.formatMessage({id: 'success_message'}))
        return v
      }).then(resolve).catch(e => {
        console.log(e)
        reject(e)
      })
    })
  },
  validate: schema
}, EditForm)
