import axios from 'axios';
import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

const getSeedItems = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/items.json`)
    .then((res) => {
      const items = [];
      Object.keys(res.data).forEach((fbKey) => {
        res.data[fbKey].id = fbKey;
        items.push(res.data[fbKey]);
      });
      resolve(items);
    })
    .catch(err => reject(err));
});

const createInvItem = newItem => axios.post(`${baseUrl}/invItems.json`, newItem);

export default {
  getSeedItems,
  createInvItem,
};
