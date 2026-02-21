import { create } from "zustand";
import { io } from "socket.io-client";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { BASE_URI } from "../constants";

const useAuthStore = create((set, get: any) => ({
  authUser: null,
  isEmailVerified: true,

  emailVerificationMessage: null,
  resetCodeMessage: null,

  isFetchingUser: true,

  isLoggingIn: false,
  isSigningUp: false,

  isSendingEmailCode: false,
  isVerifyingEmail: false,

  isGettingResetCode: false,
  isVerifyingResetCode: false,
  resetCodeVerified: false,
  isResetingPassword: false,

  socket: null,
  onlineUsers: [],

  fetchUser: async () => {
    try {
      const response = await axiosInstance.get("/users/@me");
      const user = response.data.data.user;

      set({ authUser: user });

      get().connectSocket();
    } catch (e: any) {
      if (e.status === 403) {
        set({ isEmailVerified: false });
        set({ emailVerificationMessage: e.response.data.message });
      }
      console.error(e);
      set({ authUser: null });
    } finally {
      set({ isFetchingUser: false });
    }
  },

  logIn: async (data: any) => {
    if (!data.identifier) return toast.error("Username or Email required");
    if (!data.password) return toast.error("Password required");

    set({ isLoggingIn: true });

    const is_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier);
    const email = is_email ? data.identifier : undefined;

    try {
      const response = await axiosInstance.post("/auth/login", {
        email: email,
        username: is_email ? undefined : data.identifier,
        password: data.password,
      });
      const user = response.data.data.user;
      const message = response.data.message;

      if (user) {
        set({ authUser: user });
        get().connectSocket();

        return toast.success(message);
      } else {
        set({ isEmailVerified: false });
        set({ emailVerificationMessage: message });
      }
    } catch (e: any) {
      if (e.status === 403) {
        set({ isEmailVerified: false });
        set({ emailVerificationMessage: e.response.data.message });
      }
      console.error(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signUp: async (value: any) => {
    if (!value.email) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email))
      return toast.error("Email in invalid format");
    if (!value.username) return toast.error("Username is required");
    if (!value.global_name) return toast.error("Global name is required");
    if (!value.password) return toast.error("Password is required");

    set({ isSigningUp: true });

    try {
      const response = await axiosInstance.post("/auth/register", value);
      const user = response.data.data.user;

      set({ authUser: user });
    } catch (e: any) {
      if (e.status === 403) {
        set({ isEmailVerified: false });
        set({ emailVerificationMessage: e.response.data.message });
      }
      console.error(e);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logOut: async () => {
    try {
      const response = await axiosInstance.get("/users/logout");
      const message = response.data.message;
      set({ authUser: null });
      set({ isEmailVerified: true });

      get().disConnectSocket();

      return toast.success(message);
    } catch (e) {
      return toast.error("Oops! Something went wrong, try again letter");
    }
  },

  getEmailCode: async () => {
    set({ isSendingEmailCode: true });
    try {
      const response = await axiosInstance.get("/users/@me/verify/email");
      const message = response.data.message;

      return toast.success(message);
    } catch (e: any) {
      console.error(e);
      return toast.error(e.response.data.message);
    } finally {
      set({ isSendingEmailCode: false });
    }
  },

  verifyEmail: async (otp: string) => {
    const verify = async () => {
      const response = await axiosInstance.post(
        `/users/@me/verify/email/${otp}`,
      );
      const user = response.data.data.user;
      set({ authUser: user });
      set({ isEmailVerified: true });
    };
    set({ isVerifyingEmail: true });
    toast.promise(verify, {
      loading: "Verifying ...",
      success: "Email verified!",
      error: "Code didn't match",
    });
    set({ isVerifyingEmail: false });
  },

  getResetCode: async (email: string) => {
    set({ isGettingResetCode: true });
    try {
      const response = await axiosInstance.get(`/auth/reset-password/${email}`);
      const message = response.data.message;

      set({ resetCodeMessage: message });
      toast.success("Successfully Sent!");
    } catch (e: any) {
      console.error(e);
      return toast.error(e.response.data.message);
    } finally {
      set({ isGettingResetCode: false });
    }
  },

  verifyResetCode: async (code: string) => {
    set({ isVerifyingResetCode: true });
    try {
      const response = await axiosInstance.get(
        `/auth/reset-password/verify/${code}`,
      );
      const message = response.data.message;

      set({ resetCodeVerified: true });
      toast.success(message);
    } catch (e: any) {
      console.log(e);
      return toast.error(e.response.data.message);
    } finally {
      set({ isVerifyingResetCode: false });
    }
  },

  resetPassword: async (password: string) => {
    set({ isResetingPassword: true });
    try {
      const response = await axiosInstance.put("/auth/reset-password", {
        password,
      });

      console.log("resptore data: ", response);

      const message = response.data.message;
      return toast.success(message);
    } catch (e: any) {
      console.error(e);
      const message = e.response.data.message;
      return toast.error(message);
    } finally {
      set({ isResetingPassword: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser || socket?.connected) return;

    const new_socket = io(BASE_URI, {
      query: { user_id: authUser.id },
    });

    new_socket.on("getOnlineUsers", (users_id) => {
      set({ onlineUsers: users_id });
    });

    set({ socket: new_socket });
  },

  disConnectSocket: () => {
    const { socket } = get();

    if (!socket?.connected) return;

    socket.disconnect();
    set({ socket: null });
  },
}));

export default useAuthStore;
