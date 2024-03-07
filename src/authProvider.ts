import { AuthProvider, HttpError ,fetchUtils} from "react-admin";

/**
 * This authProvider is only for test purposes. Don't use it in production.
 */

export const authProvider: AuthProvider = {
  login: async({ username, password }) => {
    const request = new Request('http://192.168.1.59:5007/login', {
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
  })

  },
  logout: () => {
    localStorage.removeItem("user");
    return Promise.resolve(); 
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    return Promise.resolve(undefined);
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
};

export default authProvider;
