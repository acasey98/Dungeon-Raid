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

// const checkDupes = uid => new Promise((resolve, reject) => {
//   axios
//     .get(`${baseUrl}/campaigns.json?orderBy="id"&equalTo="${campId}"`)
//     .then((res) => {
//       const campaigns = [];
//       if (res.data !== null) {
//         Object.keys(res.data).forEach((fbKey) => {
//           res.data[fbKey].id = fbKey;
//           campaigns.push(res.data[fbKey]);
//         });
//       }
//       console.error(campaigns);
//       resolve(campaigns);
//     })
//     .catch(err => reject(err));
// });

const getCampById = campId => new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/campaigns.json?orderBy="id"&equalTo="${campId}"`)
    .then((res) => {
      const campaigns = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((fbKey) => {
          res.data[fbKey].id = fbKey;
          campaigns.push(res.data[fbKey]);
        });
      }
      console.error(campaigns);
      resolve(campaigns);
    })
    .catch(err => reject(err));
});

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

const generateCamp = (campLength, charId) => new Promise((resolve, reject) => {
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
      fullCamp.enctr1id = normIds.shift();
      fullCamp.enctr2id = normIds.shift();
      fullCamp.enctr3id = normIds.shift();
      if (campLength === 5 || campLength === 7) {
        fullCamp.enctr4id = normIds.shift();
        fullCamp.enctr5id = normIds.shift();
        if (campLength === 7) {
          fullCamp.enctr6id = normIds.shift();
          fullCamp.enctr7id = normIds.shift();
        }
      }
      const randomFinal = getRandom(0, finalEncs.length);
      fullCamp.enctrFinal = finalEncs[randomFinal].id;
      fullCamp.charid = charId;
      fullCamp.campaignPos = 1;
      const uidPlusCid = charId.concat(firebase.auth().currentUser.uid);
      fullCamp.tempId = uidPlusCid;
      axios.post(`${baseUrl}/campaigns.json`, fullCamp);
      resolve();
    })
    .catch(err => reject(err, 'campaign gen error'));
});

const getCamp = charid => new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/campaigns.json?orderBy="charid"&equalTo="${charid}"`)
    .then((res) => {
      const campaigns = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((fbKey) => {
          res.data[fbKey].id = fbKey;
          campaigns.push(res.data[fbKey]);
        });
      }
      console.error(campaigns);
      resolve(campaigns);
    })
    .catch(err => reject(err));
});

const updateCamp = (campId, newCamp) => axios.put(`${baseUrl}/campaigns/${campId}.json`, newCamp);

const getEnemyByName = enemyId => new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/enemies.json?orderBy="id"&equalTo="${enemyId}"`)
    .then((res) => {
      const enemy = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((fbKey) => {
          res.data[fbKey].id = fbKey;
          enemy.push(res.data[fbKey]);
        });
      }
      resolve(enemy);
    })
    .catch(err => reject(err));
});

export default {
  generateCamp, getCamp, updateCamp, getCampById, getEncounters, getEnemyByName,
};
