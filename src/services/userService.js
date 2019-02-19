import axios from 'axios';
import buildUrl from '../shared/utils/buildUrl';
import getHeaders from '../shared/utils/getHeaders';

const baseUrl = process.env.REACT_APP_BASE_URL;
const userApiUrl = `${baseUrl}/users/api/v1`;
const permissionsApiUrl = `${baseUrl}/permissions/api/v1`;

const urls = {
  get: {
    list: `${userApiUrl}/list/`,
    detail: `${userApiUrl}/detail/full/`,
    email: `${userApiUrl}/detail/email/`,
    statistics: `${userApiUrl}/statistics/`,
    userPermissions: `${permissionsApiUrl}/get_user_permissions/`,
  },
  post: {
    login: `${userApiUrl}/login/`,
    register: `${userApiUrl}/register/`,
    updateUserPermission: `${permissionsApiUrl}/update_user_permission/`,
  },
};

// GET requests
const list = searchTerm => axios.get(buildUrl(urls.get.list, { search: searchTerm }), getHeaders());
const detail = id => axios.get(buildUrl(urls.get.detail, { id }), getHeaders());
const statistics = id => axios.get(buildUrl(urls.get.statistics, { id }), getHeaders());
const userPermissions = permissionsData => axios.get(buildUrl(urls.get.userPermissions, permissionsData), getHeaders());

// POST requests
const login = values => axios.post(urls.post.login, values);
const register = values => axios.post(urls.post.register, values);
const updateUserPermission = permissionData => axios.post(urls.post.updateUserPermission, permissionData, getHeaders());

const userService = {
  get: {
    list,
    detail,
    statistics,
    userPermissions,
  },
  post: {
    login,
    register,
    updateUserPermission,
  },
};

export default userService;
