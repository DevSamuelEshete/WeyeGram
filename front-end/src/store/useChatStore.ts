import toast from "react-hot-toast";
import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";

import useAuthStore from "./useAuthStore";

import audio from "../assets/notification.wav";

const useChatStore = create((set, get) => ({
  users: null,
  isGettingUsers: false,

  contacts: null,
  isGettingContacts: false,
  isAddingContact: false,

  selectedContact: null,

  messages: null,
  isGettingMessages: false,
  isSendingMessage: false,

  notifications: [],

  getUsers: async () => {
    set({ isGettingUsers: true });
    try {
      const response = await axiosInstance.get("/users/all");
      const users = response.data.data.users;

      set({ users: users });
    } catch (e: any) {
      console.error(e);
      return toast.error(e.response.data.message);
    } finally {
      set({ isGettingUsers: false });
    }
  },

  getContacts: async () => {
    set({ isGettingContacts: true });
    try {
      const response = await axiosInstance.get("/contacts");
      const contacts = response.data.data.contacts;

      set({ contacts: contacts });
    } catch (e: any) {
      console.error(e);
      return toast.error(e.response.data.message);
    } finally {
      set({ isGettingContacts: false });
    }
  },

  addContact: async (user_id: string) => {
    set({ isAddingContact: true });
    try {
      const add = async () => {
        const response = await axiosInstance.post("/contacts/new", {
          user2_id: user_id,
        });

        const contact = response.data.data.contact;
        const { contacts } = get() as any;

        set({ contacts: [...contacts, contact] });
      };

      await toast.promise(add, {
        success: "Contact Added!",
        loading: "Adding Contact",
        error: "Oops! an error occured, try again later.",
      });
    } catch (e: any) {
      console.error(e);
      return toast.error(e.response.data.message);
    } finally {
      set({ isAddingContact: false });
    }
  },

  setSelectedContact: (contact: any) => {
    set({ selectedContact: contact });
  },

  getMessages: async () => {
    set({ messages: null });
    set({ isGettingMessages: true });
    try {
      const { selectedContact } = get() as any;
      const response = await axiosInstance.get(
        `/messages/${selectedContact.contacts_id}`,
      );
      const messages = response.data.data.messages;

      set({ messages: messages });
    } catch (e: any) {
      console.error(e);
      return toast.error(e.response.data.message);
    } finally {
      set({ isGettingMessages: false });
    }
  },

  sendMessage: async (data: any) => {
    set({ isSendingMessage: true });
    try {
      const response = await axiosInstance.post("/messages/send", data);
      const new_message = response.data.data.message;
      const { messages } = get() as any;

      set({ messages: [...messages, new_message] });
    } catch (e) {
      console.error(e);
      return toast.error("Oops! try again later.");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  soundNotification: (message: string) => {
    const sound = new Audio(audio);
    sound.play();

    const { notifications } = get() as any;

    set({ notifications: [...notifications, message] });
  },

  ListenForMessages: () => {
    const { selectedContact, soundNotification } = get() as any;
    if (!selectedContact.id) return;

    const authStore = useAuthStore as any;
    const socket = authStore.getState().socket;

    socket.on("newMessage", (new_message: any) => {
      if (new_message.sender_id !== selectedContact.id)
        soundNotification(new_message);
      const { messages } = get() as any;

      set({ messages: [...messages, new_message] });
    });
  },

  UnListenForMessages: () => {
    const authStore = useAuthStore as any;
    const socket = authStore.getState().socket;

    if (!socket?.connection) return;

    socket.off("newMessage");
  },
}));

export default useChatStore;
