import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Login from '../pages/Login';

const AuthContext = createContext({});

// const contextRef = createRef();

export function AuthProvider({ authService, authErrorEventBus, children }) {
  const [user, setUser] = useState(undefined);
  const [text, setText] = useState('');
  const [isAlert, setIsAlert] = useState(false);

  // useImperativeHandle(contextRef, () => (user ? user.token : undefined));

  useEffect(() => {
    authErrorEventBus.listen(err => {
      setUser(undefined);
      throw err;
    });
  }, [authErrorEventBus]);

  useEffect(() => {
    authService
      .me() //
      .then(setUser)
      .catch(err => {
        console.error(err);
        setError(err);
      });
  }, [authService]);

  const signUp = useCallback(
    async (username, password, name, email) =>
      authService
        .signup(username, password, name, email) //
        .then(user => setUser(user)),
    [authService]
  );

  const logIn = useCallback(
    async (username, password) =>
      authService
        .login(username, password) //
        .then(user => setUser(user)),
    [authService]
  );

  const logout = useCallback(
    async () =>
      authService
        .logout() //
        .then(() => setUser(undefined)),
    [authService]
  );

  // TODO: 개선 필요
  const setError = error => {
    setText(error.toString());
    setIsAlert(true);
  };

  const context = useMemo(
    () => ({
      user,
      signUp,
      logIn,
      logout,
    }),
    [user, signUp, logIn, logout]
  );

  return (
    <AuthContext.Provider value={context}>
      {user ? (
        children
      ) : (
        <div className="app">
          <Header />
          <Login onSignUp={signUp} onLogin={logIn} setError={setError} text={text} isAlert={isAlert} />
        </div>
      )}
    </AuthContext.Provider>
  );
}

export class AuthErrorEventBus {
  listen(callback) {
    this.callback = callback;
  }
  notify(error) {
    this.callback(error);
  }
}

export default AuthContext;
// export const fetchToken = () => contextRef.current;
export const useAuth = () => useContext(AuthContext);
