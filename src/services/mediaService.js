import axios from 'axios';
import buildUrl from '../shared/utils/buildUrl';
import getHeaders from '../shared/utils/getHeaders';

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
    images: `${mediaApiUrl}/delete_images/`,
  },
};

// GET requests
const getImages = (pageNumber, excludeIds) => axios.get(buildUrl(urls.get.images, {
  page: pageNumber,
  exclude: excludeIds.join('-'),
}), getHeaders());

// POST requests
const uploadImages = uploadData => axios.post(urls.post.images, uploadData, getHeaders({
  'Content-Type': 'multipart/form-data',
}));
const updateImage = updateData => axios.post(urls.post.updateImage, updateData, getHeaders());

// DELETE requests
const deleteImages = deleteData => axios.delete(urls.delete.images, { data: deleteData, ...getHeaders() });


const mediaService = {
  get: {
    images: getImages,
  },
  post: {
    images: uploadImages,
    updateImage,
  },
  delete: {
    images: deleteImages,
  },
};

export default mediaService;
