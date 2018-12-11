export const actionResult = (action, { id = undefined, error = null } = {}) => {
  const [actionName, actionState] = id ? [id, action.split('.')[1]] : action.split('.');
  switch (actionState) {
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

export const initializeActions = (actions) => {
  const actionsObj = {};
  for (let i = 0; i < actions.length; i += 1) {
    Object.assign(actionsObj, { [actions[i]]: { loading: false, loaded: false, init: true } });
  }
  return actionsObj;
};
