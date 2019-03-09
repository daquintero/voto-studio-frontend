import axios from 'axios';
import buildUrl from '../shared/utils/buildUrl';
import getHeaders from '../shared/utils/getHeaders';

const baseUrl = process.env.REACT_APP_BASE_URL;
const mediaApiUrl = `${baseUrl}/media/api/v1`;

const urls = {
  get: {
    files: `${mediaApiUrl}/list_files/`,
  },
  post: {
    files: `${mediaApiUrl}/upload_files/`,
    updateFile: `${mediaApiUrl}/update_file/`,
  },
  delete: {
    files: `${mediaApiUrl}/delete_files/`,
  },
};

// GET requests
const getFiles = ({
  pageNumber, excludeIds, modelLabel,
}) => axios.get(buildUrl(urls.get.files, {
  page: pageNumber,
  exclude: excludeIds.join('-'),
  ml: modelLabel,
}), getHeaders());

// POST requests
const uploadFiles = uploadData => axios.post(urls.post.files, uploadData, getHeaders({
  'Content-Type': 'multipart/form-data',
}));
const updateFile = updateData => axios.post(urls.post.updateFile, updateData, getHeaders());

// DELETE requests
const deleteFiles = deleteData => axios.delete(urls.delete.files, { data: deleteData, ...getHeaders() });


const mediaService = {
  get: {
    files: getFiles,
  },
  post: {
    files: uploadFiles,
    updateFile,
  },
  delete: {
    files: deleteFiles,
  },
};

export default mediaService;
