import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Define the shape of the auth context
interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Action types
type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string | null }
  | { type: 'SIGN_IN'; token: string }
  | { type: 'SIGN_OUT' };

interface AuthState {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
}

const initialState: AuthState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

const authReducer = (prevState: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
      };
    default:
      return prevState;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for token in localStorage on mount
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = localStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // In a real app, validate the token with the backend here
       if (userToken) {
           axios.defaults.headers.common.Authorization = `Token ${userToken}`;
       }


      dispatch({ type: 'RESTORE_TOKEN', token: userToken || null });
    };

    bootstrapAsync();
  }, []);

  const authContext: AuthContextType = React.useMemo(
    () => ({
      user: state.userToken ? 'user' : null, // Simplification for now
      token: state.userToken,
      isLoading: state.isLoading,
      login: async (username, token) => {
        localStorage.setItem('userToken', token);
        axios.defaults.headers.common.Authorization = `Token ${token}`;
        dispatch({ type: 'SIGN_IN', token: token });
      },
      logout: () => {
        localStorage.removeItem('userToken');
        delete axios.defaults.headers.common.Authorization;
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    [state]
  );

  if (state.isLoading) {
      // You might want a loading spinner here
      return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
