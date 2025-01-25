import axios from 'axios';


export const backend =  axios.create({
  baseURL: `${import.meta.env.VITE_HOSTED_BACKEND_URL}`
});