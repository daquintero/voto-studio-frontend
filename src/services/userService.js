import axios from 'axios';

export const login = (email, password) => {
  const requestOptions = {
    method: 'POST',
    url: 'http://127.0.0.1:8000/users/api/v1/login/',
    data: JSON.stringify({ email, password }),
  };

  return axios(requestOptions)
    .then((response) => {
      if (!response.status === 200) {
        return Promise.reject(response.statusText);
      }
      return response.data;
    })
    .then((user) => {
      if (user.token) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    });
};

export const logout = () => {
  localStorage.removeItem('user');
};
