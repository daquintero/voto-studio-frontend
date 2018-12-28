export default input => input
  .replace(/([A-Z])/g, ' $1')
  .replace(/^./, str => str.toUpperCase());
