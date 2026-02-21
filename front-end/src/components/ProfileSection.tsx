import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import default_avatar from "../assets/default_avatar.png";
import useSettingsStore from "../store/useSettingsStore";

import useAuthStore from "../store/useAuthStore";
import {
  CameraAlt,
  Edit,
  EditOff,
  Email,
  PermIdentity,
  Person,
  Phone,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { blur_email, is_email } from "../utils";
import { styled } from "@mui/material/styles";

const HiddenUpload = styled("input")({
  display: "none",
});

const ProfileSection = () => {
  const { authUser, fetchUser } = useAuthStore() as any;
  const [editMode, setEditMode] = useState(false);
  const [saveAllowed, setSaveAllowed] = useState(false);

  const { isUpdatingProfile, updateProfile } = useSettingsStore() as any;

  const [userValues, setUserValues] = useState({
    global_name: authUser.global_name,
    profile_url: "",
    username: authUser.username,
    email: authUser.email,
    phone: authUser.phone || "",
  });

  const validateUserValue = () => {
    console.log("Validate");
    if (
      userValues.global_name === authUser.global_name &&
      userValues.username === authUser.username &&
      userValues.email === authUser.email &&
      userValues.phone === (authUser.phone || "") &&
      userValues.profile_url === (authUser.profile_url || "")
    )
      return setSaveAllowed(false);
    else if (!userValues.email) return setSaveAllowed(false);
    else if (!userValues.global_name) return setSaveAllowed(false);
    else if (!userValues.username) return setSaveAllowed(false);
    else if (!is_email.test(userValues.email)) return setSaveAllowed(false);
    else setSaveAllowed(true);
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result as string;
      setUserValues({ ...userValues, profile_url: base64Image });
    };
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser, isUpdatingProfile]);

  useEffect(() => {
    validateUserValue();
  }, [userValues, validateUserValue]);

  return (
    <Box width="100%" maxWidth={850} padding={10}>
      <Stack
        gap={4}
        textAlign="center"
        justifyContent="center"
        alignContent="center"
      >
        <Typography fontWeight="bold" fontSize={25}>
          Profile Settings
        </Typography>
        <Stack position="relative" alignItems="center" gap={2}>
          <Box
            border="solid 1px"
            borderColor="grey.600"
            borderRadius="100%"
            width="120px"
            height="120px"
            bgcolor={"#fff"}
          >
            <img
              style={{ width: "120px", height: "120px", borderRadius: "100%" }}
              src={
                userValues.profile_url || authUser.profile_url || default_avatar
              }
              alt=""
            />
            <Stack
              position="absolute"
              bgcolor="grey.900"
              borderRadius={500}
              height={40}
              width={40}
              right={290}
              top={90}
            >
              <IconButton>
                <label>
                  <CameraAlt color="primary" />
                  <HiddenUpload
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      handleFileUpload(e);
                    }}
                  />
                </label>
              </IconButton>
            </Stack>
          </Box>
          <Typography fontWeight="bold" color="primary.main" fontSize={20}>
            {authUser.global_name}
          </Typography>
        </Stack>
        <Stack justifyContent="space-between" direction="row">
          <Typography fontSize={18} textAlign="left">
            User properties
          </Typography>
          <IconButton onClick={() => setEditMode(!editMode)}>
            {editMode ? (
              <Edit fontSize="medium" color="inherit" />
            ) : (
              <EditOff fontSize="medium" color="inherit" />
            )}
          </IconButton>
        </Stack>
        <Stack gap={2}>
          <TextField
            disabled={!editMode || isUpdatingProfile}
            label="Global name"
            value={userValues.global_name}
            variant="standard"
            onChange={(e) => {
              setUserValues({
                ...userValues,
                global_name: e.target.value,
              });
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="inherit" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            disabled={!editMode || isUpdatingProfile}
            label="Username"
            value={userValues.username}
            variant="standard"
            onChange={(e) => {
              setUserValues({
                ...userValues,
                username: e.target.value,
              });
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PermIdentity color="inherit" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            disabled={!editMode || isUpdatingProfile}
            label="Email"
            value={editMode ? userValues.email : blur_email(userValues.email)}
            variant="standard"
            onChange={(e) => {
              setUserValues({
                ...userValues,
                email: e.target.value,
              });
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="inherit" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            type="number"
            disabled={!editMode || isUpdatingProfile}
            label="Phone"
            placeholder="Input your phone number"
            value={userValues.phone}
            variant="standard"
            onChange={(e) => {
              setUserValues({
                ...userValues,
                phone: e.target.value,
              });
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="inherit" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
        <Button
          onClick={() => {
            updateProfile(userValues);
          }}
          disabled={!saveAllowed || isUpdatingProfile}
          variant={!saveAllowed ? "outlined" : "contained"}
        >
          Save Settings
        </Button>
      </Stack>
    </Box>
  );
};

export default ProfileSection;
