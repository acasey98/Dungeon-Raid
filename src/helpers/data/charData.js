import axios from 'axios';
import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

const postCharacter = newChar => axios.post(`${baseUrl}/characters.json`, newChar);

export default { postCharacter };
