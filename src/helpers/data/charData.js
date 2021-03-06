import axios from 'axios';
import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

const postCharacter = newChar => axios.post(`${baseUrl}/characters.json`, newChar);

const getCurrentChar = uid => new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/characters.json?orderBy="uid"&equalTo="${uid}"`)
    .then((res) => {
      const characters = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((fbKey) => {
          res.data[fbKey].id = fbKey;
          characters.push(res.data[fbKey]);
        });
      }
      resolve(characters);
    })
    .catch(err => reject(err));
});

const deleteCurrentChar = (uid) => {
  axios
    .get(`${baseUrl}/characters.json?orderBy="uid"&equalTo="${uid}"`)
    .then((res) => {
      const characters = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((fbKey) => {
          res.data[fbKey].id = fbKey;
          characters.push(res.data[fbKey]);
        });
      }
      characters.forEach((character) => {
        axios.delete(`${baseUrl}/characters/${character.id}.json`);
      });
    })
    .catch(err => err);
};


const updateChar = (charId, updatedChar) => axios.put(`${baseUrl}/characters/${charId}.json`, updatedChar);

export default {
  postCharacter,
  getCurrentChar,
  updateChar,
  deleteCurrentChar,
};
