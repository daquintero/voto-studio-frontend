export default (str, len) => {
  if (str) {
    return `${str.toString().substring(0, len)}${str.toString().length > len ? '...' : ''}`;
  }
  return null;
};
