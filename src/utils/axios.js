import { BASE_URL } from "../config/index";
import axios from "axios";
// import store from "../store";

const handlerResponse = res => {
  if (res.state === 200) {
    if (res.data.code === 0) {
      return res.data;
    } else {
      console.log(res.msg, "err");
    }
  } else {
    handlerError();
  }
};
const handlerError = err => {
  throw new Error(err);
};
export const request = axios.create({
  baseURL: BASE_URL,
  timeout: 600000,
  withCredentials: true
});
request.interceptors.request.use(config => {
  // let token = store.state.token;
  // token&&config.headers.Authorization=token
  return config;
});

request.interceptors.response.use(handlerResponse, handlerError);
