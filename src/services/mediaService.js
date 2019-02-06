import axios from 'axios';
import buildUrl from '../shared/utils/buildUrl';

const baseUrl = process.env.REACT_APP_BASE_URL;
const mediaApiUrl = `${baseUrl}/media/api/v1`;

const urls = {
  get: {
    images: `${mediaApiUrl}/list_images/`,
  },
  post: {
    images: `${mediaApiUrl}/upload_images/`,
    updateImage: `${mediaApiUrl}/update_image/`,
  },
  delete: {
  },
};

const getUser = () => (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});

const getHeaders = () => ({
  headers: {
    Authorization: `Token ${getUser().token}`,
  },
});

// GET requests
const getImages = pageNumber => axios.get(buildUrl(urls.get.images, { page: pageNumber }), getHeaders());

// POST requests
const uploadImages = uploadData => axios.post(urls.post.images, uploadData, {
  headers: {
    ...getHeaders().headers,
    'Content-Type': 'multipart/form-data',
  },
});

const updateImage = updateData => axios.post(urls.post.updateImage, updateData, getHeaders());

const mediaService = {
  get: {
    images: getImages,
  },
  post: {
    images: uploadImages,
    updateImage,
  },
  delete: {
  },
};

export default mediaService;
