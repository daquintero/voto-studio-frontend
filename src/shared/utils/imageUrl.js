export default (url) => {
  const mediaUrl = process.env.REACT_APP_MEDIA_URL;
  if (mediaUrl !== 's3') {
    return `${process.env.REACT_APP_MEDIA_URL}${url}`;
  }
  return url;
};
