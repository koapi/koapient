import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import querystring from 'query-string'
import { push, replace } from 'react-router-redux'
import { withRouter } from 'react-router'
import { reduxForm } from 'redux-form'
import { ButtonDropdown,
         DropdownToggle,
         DropdownMenu,
         DropdownItem } from 'reactstrap'
import Table, { column } from '../../components/table'
import responsive, { components } from '../../components/table/presets/responsive'
import Pagination from '../../components/pagination'
import { toastr } from 'react-redux-toastr'
import { actions as async } from '../../reduxers/async'
import { actions as check } from '../../reduxers/checklist'
import SearchForm from '../../components/table/search'

export class List extends React.Component {
  static childContextTypes = {
    list: React.PropTypes.object,
    location: React.PropTypes.object
  }
  getChildContext () {
    return {
      list: this,
      location: this.currentLocation
    }
  }
  fetch (search) {
    const { dispatch, location } = this.props
    search = querystring.parse(search || location.search)
    return dispatch(async.list('table')('/resources', search)).then(res => dispatch(check.init(res.action.payload.data)))
  }
  handlePageChange ({ selected }) {
    const { location, dispatch } = this.props
    let search = querystring.parse(location.search)
    search.page = selected + 1
    let newSearch = querystring.stringify(search)
    dispatch(replace({...location, search: newSearch}))
  }
  componentWillMount () {
    this.fetch()
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.fetch(nextProps.location.search)
    }
  }
  componentWillUnmount () {
    this.props.dispatch(check.clear())
  }
  gotoEdit () {
    const { dispatch } = this.props
    this.currentLocation = this.props.location
    dispatch(push('/resources/edit'))
  }
  render () {
    const { checklist, async, dispatch, location } = this.props
    const query = querystring.parse(location.search)
    const page = parseInt(query.page || 1) - 1

    const ReduxSearchForm = reduxForm({form: 'search', initialValues: {q: query.q}})(SearchForm)

    const columns = [
      column('id', 'ID', responsive.checkbox({
        checklist,
        onCheckAll (e) {
          dispatch(check.all(e.target.checked))
        },
        onCheckItem (id, e) {
          dispatch(check.one(id, e.target.checked))
        }
      })),
      column('media', 'Media', responsive.image(
        {
          header: {
            props: {
              className: 'item-col-header fixed item-col-img md'
            }
          },
          cell: {
            props: {
              className: 'fixed item-col-img md'
            },
            href: data => 'haha'
          }
        }
      )),
      column('name', 'Name', responsive.link({
        header: {
          props: {
            className: 'item-col-header item-col-title'
          }
        },
        cell: {
          props: {
            className: 'fixed pull-left item-col-title'
          },
          href: item => 'kk'
        }
      })),
      column('sales', 'Sales', responsive.text({
        header: { props: { className: 'item-col-header item-col-sales' } },
        cell: { props: { className: 'item-col-sales' } }
      })),
      column('stats', 'Stats', responsive.text({
        header: { props: { className: 'item-col-header item-col-stats' } },
        cell: { props: { className: 'item-col-stats no-overflow' } }
      })),
      column('category', 'Category', responsive.text({
        header: { props: { className: 'item-col-header item-col-category' } },
        cell: { props: { className: 'item-col-category no-overflow' }, formatters: [ value => (<div className='no-overflow'><a href=''>{value}</a></div>) ] }
      })),
      column('author', 'Author', responsive.text({
        header: {
          props: {
            className: 'item-col-header item-col-author'
          }
        },
        cell: {
          props: {
            className: 'item-col-author'
          },
          formatters: [
            value => (<div className='no-overflow'> {value} </div>)
          ]
        }
      })),
      column('created_at', 'Published', responsive.text({
        header: {
          props: {
            className: 'item-col-header item-col-date'
          }
        },
        cell: {
          props: {
            className: 'item-col-date'
          },
          formatters: [ value => (<div className='no-overflow'> {value} </div>) ]
        }
      })),
      column('id', 'Action', responsive.actions({
        header: {
          props: {
            className: 'item-col-header item-col-actions-dropdown'
          }
        },
        cell: {
          props: {
            className: 'item-col-actions-dropdown'
          },
          actions: {
            label: <span><i className='fa fa-pencil-square-o' /> 编辑 </span>,
            props: { onClick: this.gotoEdit.bind(this) },
            dropdown: item => (
              <DropdownMenu>
                <DropdownItem onClick={e => toastr.confirm('确定删除吗', {
                  onOk: e => console.log(item),
                  onCancel: e => console.log('cancel')
                })}>删除</DropdownItem>
              </DropdownMenu>
            )
          }
        }
      }))
    ]
    return (
      <article className='content items-list-page'>
        <div className='title-search-block'>
          <div className='title-block'>
            <div className='row'>
              <div className='col-md-6'>
                <h3 className='title'> 资源列表&nbsp;<Link to='/resources/create' className='btn btn-primary btn-sm rounded-s'> 添加 </Link>
                  &nbsp;
                  <ButtonDropdown style={{marginBottom: '5px'}} group toggle={function () {}}>
                    <DropdownToggle className='rounded-s' caret size='sm'>操作</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem tag='a'><i className='fa fa-pencil-square-o icon' /> 编辑 </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </h3>
                <p className='title-description'> 资源描述...... </p>
              </div>
            </div>
          </div>
          <div className='items-search'>
            <ReduxSearchForm />
          </div>
        </div>
        <div className='card items'>
          <Table data={async.table} columns={columns} components={components} />
        </div>
        <nav className='text-xs-right'>
          <Pagination initialPage={page} onPageChange={this.handlePageChange.bind(this)} />
        </nav>
        {this.props.children}
      </article>
    )
  }
}

export default connect(state => ({
  async: state.async,
  checklist: state.checklist,
  items: state.items,
  oauth: state.oauth }))(withRouter(List))