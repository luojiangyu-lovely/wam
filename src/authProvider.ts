import { AuthProvider  ,fetchUtils} from "react-admin";
import {apiUrl} from './CONST'
/**
 * This authProvider is only for test purposes. Don't use it in production.
 */

export const authProvider: AuthProvider = {
  login: async({ username, password }) => {
    const request = new Request(apiUrl +'/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return fetch(request)
  .then(response => {
      if (response.status < 200 || response.status >= 300) {
          throw new Error('账号或者密码错误！');
      }
      return response.json();
  })
  .then(auth => {
      localStorage.setItem('user', JSON.stringify(auth));
  })},
  logout: () => {
    localStorage.removeItem("user");
    return Promise.resolve(); 
  },
  checkError: () => {
    return Promise.resolve()},
  checkAuth: () =>{
    console.log(localStorage.getItem("user"))
    return localStorage.getItem("user") ? Promise.resolve() : Promise.reject({ redirectTo: '/login' })
  },
  getPermissions: () => {
 
    const user:any = localStorage.getItem('user')
    const {premissions} = user?JSON.parse(user):[]
    return Promise.resolve(premissions);
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;
    return Promise.resolve(user);
  },
};

export default authProvider;
