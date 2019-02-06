const buildQueryString = (params) => {
  const esc = encodeURIComponent;
  return `?${Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&')}`;
};

export default (pathName, params) => `${pathName.toLowerCase()}${buildQueryString(params)}`;
