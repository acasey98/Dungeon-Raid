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

const getInvItems = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/invItems.json`)
    .then((res) => {
      const items = [];
      Object.keys(res.data).forEach((fbKey) => {
        res.data[fbKey].id = fbKey;
        items.push(res.data[fbKey]);
      });
      console.error(items);
      resolve(items);
    })
    .catch(err => reject(err));
});

const updateItems = (updatedItem, itemId) => {
  if (updatedItem.currCharges <= 0) {
    axios.delete(`${baseUrl}/invItems/${itemId}.json`);
  } else {
    axios.put(`${baseUrl}/invItems/${itemId}.json`, updatedItem);
  }
};

export default {
  getSeedItems,
  createInvItem,
  getInvItems,
  updateItems,
};
