import axios from 'axios';

import firebase from 'firebase/app';
import 'firebase/auth';

import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

const getRandom = (min, max) => {
  const minNum = Math.ceil(min);
  const maxNum = Math.floor(max);
  const finalNum = Math.floor(Math.random() * (maxNum - minNum)) + minNum;
  return finalNum;
};

const normIds = [];

const getEncounters = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/encounters.json`)
    .then((res) => {
      const encounters = [];
      Object.keys(res.data).forEach((fbKey) => {
        res.data[fbKey].id = fbKey;
        encounters.push(res.data[fbKey]);
      });
      resolve(encounters);
    })
    .catch(err => reject(err, 'cannot get encounters'));
});

const generateCamp = (campLength, charId) => {
  getEncounters()
    .then((encs) => {
      const normEncs = encs.filter(x => x.finalEnctr === false);
      const finalEncs = encs.filter(x => x.finalEnctr === true);
      const fullCamp = {};
      for (let i = 0; i < campLength; i += 1) {
        const randomNum = getRandom(0, normEncs.length);
        // console.error(normEncs.length);
        normIds.push(normEncs[randomNum].id);
        normEncs.splice(randomNum, 1);
      }
      fullCamp.enctr1 = normIds.shift();
      fullCamp.enctr2 = normIds.shift();
      fullCamp.enctr3 = normIds.shift();
      if (campLength === 5 || campLength === 7) {
        fullCamp.enctr4 = normIds.shift();
        fullCamp.enctr5 = normIds.shift();
        if (campLength === 7) {
          fullCamp.enctr6 = normIds.shift();
          fullCamp.enctr7 = normIds.shift();
        }
      }
      const randomFinal = getRandom(0, finalEncs.length);
      fullCamp.enctrFinal = finalEncs[randomFinal].id;
      fullCamp.charid = charId;
      fullCamp.campaignPos = 1;
      fullCamp.tempId = firebase.auth().currentUser.uid;
      axios.post(`${baseUrl}/campaigns.json`, fullCamp);
    })
    .catch(err => console.error('campaign gen error', err));
};

const getCamp = charId => new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/campaigns.json?orderBy="charid"&equalTo="${charId}"`)
    .then((res) => {
      const campaigns = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((fbKey) => {
          res.data[fbKey].id = fbKey;
          campaigns.push(res.data[fbKey]);
        });
      }
      resolve(campaigns);
    })
    .catch(err => reject(err));
});

export default {
  generateCamp, getCamp,
};
