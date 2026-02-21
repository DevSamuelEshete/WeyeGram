import { ConfirmationNumber, Key } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";

const ResetPassword = () => {
  const [data, setData] = useState({ password: "", confirm_password: "" });
  const { resetPassword, isResetingPassword } = useAuthStore() as any;

  const validateData = async () => {
    if (!data.password) return toast.error("Password is required");
    if (data.password !== data.confirm_password)
      return toast.error("Confirm password doesn't match");

    await resetPassword(data.password);
  };

  return (
    <section>
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Box padding={12} border="solid 1px" borderColor="grey.800">
          <Stack gap={4} alignItems="center">
            <Stack textAlign="center">
              <Typography fontSize={25} fontWeight="bold">
                Reset Password
              </Typography>
              <Typography color="text.secondary">
                Enter your new password, make sure to not loose it this time
              </Typography>
            </Stack>
            <Stack gap={2} width="100%">
              <TextField
                disabled={isResetingPassword}
                fullWidth
                placeholder="Password"
                variant="outlined"
                onChange={(e) =>
                  setData({ ...data, password: e.currentTarget.value })
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Key />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                disabled={isResetingPassword}
                fullWidth
                placeholder="Confirm Password"
                variant="outlined"
                onChange={(e) =>
                  setData({ ...data, confirm_password: e.currentTarget.value })
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <ConfirmationNumber />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
            <Button
              disabled={isResetingPassword}
              onClick={() => validateData()}
              fullWidth
              variant="contained"
            >
              {isResetingPassword ? (
                <Stack gap={2} direction="row">
                  <Typography>Reseting</Typography>
                  <CircularProgress color="inherit" size={20} />
                </Stack>
              ) : (
                "Reset Password"
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </section>
  );
};

export default ResetPassword;
