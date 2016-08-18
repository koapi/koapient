import { handleActions } from 'redux-actions'
import {async_state} from '../lib/helper'

export const async = handleActions({
  FETCH_FULFILLED: (state, action) => async_state(action.payload.data, true),
  FETCH_REJECTED: (state, action) => async_state(action.payload.data || action.payload.toString(), false),
  FETCH_PENDING: (state, action) => async_state(null, false, true)
}, async_state());
