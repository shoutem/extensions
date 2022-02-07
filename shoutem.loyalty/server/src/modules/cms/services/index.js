import CmsApi from './cmsApi';
import rsaaPromise from './rsaaPromise';
const cmsApi = new CmsApi();
const getCmsUrl = cmsApi.getUrl;

export { cmsApi, getCmsUrl, rsaaPromise };
