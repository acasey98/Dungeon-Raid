import axios from 'axios';
import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

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
    .catch(err => reject(err));
});

const generateCampaign = (campLength, charId) => {
  getEncounters()
    .then((encs) => {
      const normEncs = encs.filter(x => x.finalEnctr === false);
      const finalEncs = encs.filter(x => x.finalEnctr === true);
      let fullCamp = [];
      for (let i = 0; i <= campLength; i + 1) {
        const randomNum = Math.random(0, normEncs.length);
        fullCamp += normEncs[randomNum].id;
        normEncs.pop(randomNum);
      }
      fullCamp += finalEncs.pop(Math.random(0, finalEncs.length));
      fullCamp.charid = charId;
      fullCamp.
      axios.post(`${baseUrl}/campaigns.json`, fullCamp);
    })
    .catch(err => console.error('cant get encounters', err));
};


export default generateCampaign;
