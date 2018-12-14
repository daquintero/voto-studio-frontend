import changeService from '../../services/changesService';
import {
  LIST_CHANGES,
  COMMIT_CHANGES,
} from '../actionCreators/changesActionCreators';

export const getChangeList = () => (dispatch) => {
  dispatch({
    type: LIST_CHANGES.REQUEST,
  });
  return changeService.get.list().then(
    response =>
      dispatch({
        type: LIST_CHANGES.SUCCESS,
        changes: response.data.changes,
      }),
    error =>
      dispatch({
        type: LIST_CHANGES.ERROR,
        error,
      }),
  );
};

export const commitChange = selected => (dispatch) => {
  dispatch({
    type: COMMIT_CHANGES.REQUEST,
    ids: selected,
  });
  return changeService.post.commit(selected).then(
    response =>
      dispatch({
        type: COMMIT_CHANGES.SUCCESS,
        ids: selected,
        changes: response.data.changes,
      }),
    error =>
      dispatch({
        type: COMMIT_CHANGES.ERROR,
        ids: selected,
        error,
      }),
  );
};
