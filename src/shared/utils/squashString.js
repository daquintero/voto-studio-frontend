import numeral from 'numeral';

export default (val, len, noNumeral) => {
  if (val) {
    if (typeof val === 'string') {
      return `${val.toString().substring(0, len)}${val.toString().length > len ? '...' : ''}`;
    }
    if (typeof val === 'number') {
      return noNumeral ? val : numeral(val).format('O.0a').toUpperCase();
    }
  }
  return null;
};
