import axios from 'axios';
import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

const postCharacter = newChar => axios.post(`${baseUrl}/characters.json`, newChar);

const getCurrentChar = uid => new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/characters.json?orderBy="uid"&equalTo="${uid}"`)
    .then((res) => {
      const characters = [];
      console.error(uid);
      if (res.data !== null) {
        Object.keys(res.data).forEach((fbKey) => {
          res.data[fbKey].id = fbKey;
          characters.push(res.data[fbKey]);
        });
      }
      console.error(characters);
      resolve(characters);
    })
    .catch(err => reject(err));
});

export default { postCharacter, getCurrentChar };
