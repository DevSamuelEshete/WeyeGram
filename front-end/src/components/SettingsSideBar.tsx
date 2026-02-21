import { Logout, Notifications, Person } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

import useSettingsStore from "../store/useSettingsStore";
import useAuthStore from "../store/useAuthStore";

const SettingsSideBar = () => {
  const { selectedOption, setSelectedOption } = useSettingsStore() as any;
  const { logOut } = useAuthStore() as any;

  return (
    <Box
      paddingTop={8}
      height="100vh"
      width={400}
      borderRight="solid 1px"
      borderColor="grey.800"
      position="relative"
    >
      <Stack gap={3}>
        <Stack
          padding={2}
          textAlign="center"
          borderBottom="solid 1px"
          borderColor="grey.800"
        >
          <Typography fontSize={25} fontWeight="bold">
            User Settings
          </Typography>
        </Stack>
        <Stack>
          <Button
            onClick={() => {
              setSelectedOption("profile");
            }}
            color="inherit"
            variant={selectedOption === "profile" ? "contained" : "text"}
          >
            <Stack width="100%" justifyContent="start" gap={2} direction="row">
              <Person />
              Profile
            </Stack>
          </Button>
          <Button
            onClick={() => {
              setSelectedOption("notifications");
            }}
            color="inherit"
            variant={selectedOption === "notifications" ? "contained" : "text"}
          >
            <Stack width="100%" justifyContent="start" gap={2} direction="row">
              <Notifications />
              Notifications
            </Stack>
          </Button>
        </Stack>
        <Stack padding={2} width="100%" left={0} bottom={0} position="absolute">
          <Button
            onClick={() => {
              logOut();
            }}
            color="error"
          >
            <Stack direction="row" gap={2}>
              <Logout />
              LogOut
            </Stack>
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SettingsSideBar;
