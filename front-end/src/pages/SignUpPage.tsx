import {
  ChatBubble,
  Email,
  Key,
  PermIdentity,
  Person,
} from "@mui/icons-material";
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
const SignUpPage = () => {
  const [showpass, setShowPass] = useState(false);

  const [values, setValues] = useState({
    email: "",
    username: "",
    global_name: "",
    password: "",
    remember_me: true,
  });

  const { isSigningUp, signUp } = useAuthStore() as any;

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
                  Sign up with your credentials
                </Typography>
              </Stack>
              <Stack gap={2}>
                <TextField
                  placeholder="Email"
                  onChange={(e) =>
                    setValues({ ...values, email: e.currentTarget.value })
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  placeholder="Username"
                  onChange={(e) =>
                    setValues({ ...values, username: e.currentTarget.value })
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
                  placeholder="Global name"
                  onChange={(e) =>
                    setValues({ ...values, global_name: e.currentTarget.value })
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PermIdentity />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  placeholder="Password"
                  type={showpass ? "text" : "password"}
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
                <Button onClick={() => signUp(values)} variant="contained">
                  {isSigningUp ? (
                    <CircularProgress size={25} color="inherit" />
                  ) : (
                    "Sign up"
                  )}
                </Button>
                <Typography color="text.secondary">
                  Already have an account? <Link to="/login">Login</Link>
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
              Sign up for an incredible chat expriance.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </section>
  );
};

export default SignUpPage;
