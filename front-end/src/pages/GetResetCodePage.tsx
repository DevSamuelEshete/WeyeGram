import { Email } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { is_email } from "../utils";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const GetResetCodePage = () => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  const { getResetCode, isGettingResetCode } = useAuthStore() as any;
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) {
      toast.error("Email is required");
    } else if (!is_email.test(email)) {
      return toast.error("Email in invalid format");
    } else {
      setEmailValid(true);
    }
  };

  useEffect(() => {
    if (!emailValid || !email) return;

    getResetCode(email).then(() => {
      navigate(`/verify-reset-code/${email}`, { replace: true });
    });
  }, [getResetCode, emailValid]);

  return (
    <section>
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          padding={10}
          border="solid 1px"
          borderColor="grey.800"
          borderRadius={1}
          width="100%"
          maxWidth={650}
        >
          <Stack gap={4} textAlign="center">
            <Stack gap={1}>
              <Typography fontSize={25} fontWeight="bold">
                Accounts Email
              </Typography>
              <Typography fontSize={15} color="text.secondary">
                Enter the account's email which you want to reset the password
                for
              </Typography>
            </Stack>
            <Stack alignItems="center" gap={4}>
              <TextField
                disabled={isGettingResetCode}
                fullWidth
                placeholder="Email"
                onChange={(e) => setEmail(e.currentTarget.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="outlined"
              />
              <Button
                disabled={isGettingResetCode}
                onClick={() => validateEmail()}
                variant="outlined"
              >
                {isGettingResetCode ? (
                  <Stack gap={1} direction="row">
                    Send Code
                    <CircularProgress color="inherit" size={20} />
                  </Stack>
                ) : (
                  "Send Code"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </section>
  );
};

export default GetResetCodePage;
