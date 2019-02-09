const buildQueryString = (params) => {
  const esc = encodeURIComponent;
  return `?${Object.keys(params)
    .map((k) => { // eslint-disable-line
      if (params[k] !== undefined) {
        return `${esc(k)}=${esc(params[k])}`;
      }
    })
    .join('&')}`;
};

export default (pathName, params) => `${pathName.toLowerCase()}${buildQueryString(params)}`;
