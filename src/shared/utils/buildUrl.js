const buildQueryString = (params) => {
  const esc = encodeURIComponent;
  return `?${Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&')}`;
};

export default obj => `${obj.pathname.toLowerCase()}${buildQueryString(obj.params)}`;
