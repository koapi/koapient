import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import Joi from 'joi'
import { validate, Input } from '../../components/form'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,
         Form } from 'reactstrap'

const formValues = {
  username: '123'
}
const schema = {
  username: Joi.string().email().required()
}

export class ModalEditor extends React.Component {
  static contextTypes = {
    location: React.PropTypes.object
  }
  close () {
    const { dispatch } = this.props
    dispatch(push(this.context.location || '/resources'))
  }
  submit (values) {
    return new Promise((resolve, reject) => {
      console.log(values, arguments)
      throw new SubmissionError({ username: 'User does not exist' })
      resolve()
    })
  }
  render () {
    const { handleSubmit } = this.props

    return (
      <Modal isOpen toggle={this.close.bind(this)}
        modalClassName='in'
        backdropClassName='in'
        backdrop>
        <Form onSubmit={handleSubmit(this.submit.bind(this))}>
          <ModalHeader>编辑</ModalHeader>
          <ModalBody>
            <Field name='username' label='用户名' component={Input} type='text' />
          </ModalBody>
          <ModalFooter>
            <Button color='primary' type='submit'>提交</Button>
            &nbsp;
            &nbsp;
            <Button onClick={this.close.bind(this)}>关闭</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}
export default connect(state => ({
  resource: state.form.resource,
  oauth: state.oauth,
  initialValues: formValues
}))(
  reduxForm({form: 'resource', validate: validate(schema)})(withRouter(ModalEditor))
)