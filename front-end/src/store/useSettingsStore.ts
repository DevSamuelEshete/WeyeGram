import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const useSettingsStore = create((set) => ({
  selectedOption: "profile",
  isUpdatingProfile: false,

  setSelectedOption: (option: string) => {
    set({ selectedOption: option.toLowerCase() });
  },

  updateProfile: async (data: any) => {
    set({ isUpdatingProfile: true });
    try {
      const update = async () => {
        if (data.profile_url) {
          await axiosInstance.put("/users/@me/profile", {
            profile_url: data.profile_url,
          });
          data.profile_url = undefined;
        }
        await axiosInstance.put("/users/@me", data);
      };

      await toast.promise(update, {
        loading: "Updating Profile",
        success: "Successfully updated Profile!",
        error: "Oops! Something went wrong",
      });
    } catch (e: any) {
      console.log(e);
      return toast.error(e.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

export default useSettingsStore;
