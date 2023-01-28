import React, { createContext, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { registerUser, removeUser } from "../store/slices/authSlice";

interface IProps {
  children: React.ReactNode;
}

interface UserInterface {
  email: string | null;
  name: string;
  role: string;
}

interface ContextInterface {
  login: Function;
  user: UserInterface;
  signup: (a: SignUpBody) => Promise<boolean>;
  checkUserLoggedIn: Function;
  setUser: Function;
  logout: () => Promise<void>;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface SignUpBody {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface SendOTP {
  email: string;
}

export const AuthContext = createContext<ContextInterface>({
  login: (body: LoginBody) => null,
  user: { email: null, name: "", role: "" },
  signup: async (body: SignUpBody) =>
    new Promise((resolve, reject) => resolve(true)),
  checkUserLoggedIn: () => null,
  setUser: () => null,
  logout: () => new Promise((resolve, reject) => resolve()),
});

const AuthContextProvider: React.FC<IProps> = ({ children }) => {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<UserInterface>({
    email: null,
    name: "",
    role: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    checkUserLoggedIn().then((data) => {
      setAuthReady(true);
    });
  }, []);

  const login = async (body: LoginBody) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    console.log({ data });

    if (!res.ok) {
      throw new Error("Invalid Credentials");
      // return toast.error(data.message)
    }

    if (res.ok) {
      setUser(() => ({ email: data.email, name: data.name, role: data.role }));

      dispatch(
        registerUser({ email: data.email, name: data.name, role: data.role })
      );
    }
  };

  const signup = async (body: SignUpBody) => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      if (typeof data.message == "string") {
        toast.error(data.message);
      }
      data.message?.forEach((message: string) => toast.error(message));
      return false;
    } else {
      return true;
    }
  };

  const logout = async () => {
    console.log("entered");
    const res = await fetch("/api/logout", {
      method: "POST",
    });

    if (res.ok) {
      setUser(() => ({ email: null, name: "", role: "" }));
      dispatch(removeUser());
    }
    toast.info("Successfully logged out");
  };

  const checkUserLoggedIn = async () => {
    const res = await fetch("/api/current-user", {
      method: "POST",
    });

    if (res.ok) {
      const data = await res.json();

      return data;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        user,
        signup,
        logout,
        setUser,
        checkUserLoggedIn,
      }}
    >
      <div className=" !font-body">{authReady && children}</div>
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
