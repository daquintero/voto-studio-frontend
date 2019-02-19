export const actionResult = (action, { id = undefined, error = null } = {}) => {
  const [actionName, actionState] = id ? [id, action.split('.')[1]] : action.split('.');
  switch (actionState) {
    case 'INIT':
      return {
        [actionName]: {
          loading: false, loaded: false, init: true, denied: false,
        },
      };
    case 'REQUEST':
      return { [actionName]: { loading: true, loaded: false, init: false } };
    case 'SUCCESS':
      return { [actionName]: { loading: false, loaded: true, init: false } };
    case 'ERROR':
      return {
        [actionName]: {
          loading: false, loaded: false, init: false, error,
        },
      };
    default:
      return Error('No matching action state provided');
  }
};

// TODO: Is there a better way to handle the relLevel?

export const actionResultUnnamed = (action, { error = null, relLevel = null } = {}) => {
  const actionState = action.split('.')[1];
  switch (actionState) {
    case 'INIT':
      return { loading: false, loaded: false, init: true };
    case 'REQUEST':
      return {
        loading: true, loaded: false, init: false, relLevel,
      };
    case 'SUCCESS':
      return {
        loading: false, loaded: true, init: false,
      };
    case 'ERROR':
      return {
        loading: false, loaded: false, init: false, error,
      };
    default:
      return Error('No matching action state provided');
  }
};

export const initializeActions = (actions) => {
  const actionsObj = {};
  for (let i = 0; i < actions.length; i += 1) {
    Object.assign(actionsObj, {
      [actions[i]]: {
        loading: false, loaded: false, init: true,
      },
    });
  }
  return actionsObj;
};
