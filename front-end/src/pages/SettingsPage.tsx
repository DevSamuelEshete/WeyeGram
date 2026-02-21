import { Box } from "@mui/material";
import ProfileSection from "../components/ProfileSection";
import SettingsSideBar from "../components/SettingsSideBar";

const SettingsPage = () => {
  return (
    <section>
      <Box flex={1} display="flex" width="100vw" height="100vh">
        <SettingsSideBar />

        <Box
          display="flex"
          flex={1}
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <ProfileSection />
        </Box>
      </Box>
    </section>
  );
};

export default SettingsPage;
