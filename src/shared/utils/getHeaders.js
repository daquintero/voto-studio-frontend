const getUser = () => (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});

export default extra => ({
  headers: {
    Authorization: `Token ${getUser().token}`,
    ...extra,
  },
});
