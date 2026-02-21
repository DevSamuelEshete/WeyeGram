import { ChatBubble, Key, Person } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useState } from "react";
import useAuthStore from "../store/useAuthStore";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
const LoginPage = () => {
  const [showpass, setShowPass] = useState(false);

  const [values, setValues] = useState({
    identifier: "",
    password: "",
    remember_me: true,
  });

  const { isLoggingIn, logIn } = useAuthStore() as any;

  return (
    <section>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        overflow="hidden"
      >
        <Stack gap={2}>
          <Box
            bgcolor="background.paper"
            border="solid 1px"
            borderColor="grey.800"
            borderRadius={1}
            textAlign="center"
            width={550}
            padding={10}
          >
            <Stack gap={5}>
              <Stack
                gap={2}
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <ChatBubble fontSize="large" />
                <Typography color="text.primary" fontSize={25}>
                  Login with your account
                </Typography>
              </Stack>
              <Stack gap={2}>
                <TextField
                  placeholder="Username or Email"
                  onChange={(e) =>
                    setValues({ ...values, identifier: e.currentTarget.value })
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  placeholder="Password"
                  type={showpass ? "text" : "password"}
                  id="outlined-start-adornment"
                  onChange={(e) =>
                    setValues({ ...values, password: e.currentTarget.value })
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Key />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPass(!showpass)}
                          size="small"
                        >
                          <InputAdornment position="end">
                            {showpass ? <Visibility /> : <VisibilityOff />}
                          </InputAdornment>
                        </IconButton>
                      ),
                    },
                  }}
                />
                <Box>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Remember Me?"
                    onClick={() =>
                      setValues({ ...values, remember_me: !values.remember_me })
                    }
                  />
                </Box>
              </Stack>
              <Stack gap={2}>
                <Button
                  disabled={isLoggingIn}
                  onClick={() => logIn(values)}
                  variant="contained"
                >
                  {isLoggingIn ? (
                    <Stack direction="row" gap={1}>
                      <Typography>Logging In</Typography>
                      <CircularProgress size={20} color="inherit" />
                    </Stack>
                  ) : (
                    "Login"
                  )}
                </Button>
                <Typography color="text.secondary">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </Typography>
                <Typography color="text.secondary">
                  Forgot password?{" "}
                  <Link color="text.secondary" to="/get-reset-code">
                    Reset password
                  </Link>
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Box
            bgcolor="background.paper"
            border="solid 1px"
            borderColor="grey.800"
            borderRadius={1}
            textAlign="center"
            width={550}
            padding={2}
          >
            <Typography color="text.secondary">
              Login with your account to continue your conversation.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </section>
  );
};

export default LoginPage;
