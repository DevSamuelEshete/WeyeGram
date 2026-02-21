import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { ChatBubble, Login, Settings } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const { authUser, isEmailVerified } = useAuthStore() as any;

  const Navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            onClick={() => Navigate("/")}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <ChatBubble />
          </IconButton>
          <Typography
            color="inherit"
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Weyegram
          </Typography>
          {!authUser && isEmailVerified ? (
            <Button
              onClick={() => Navigate("/login", { replace: true })}
              color="inherit"
            >
              <Stack direction="row" gap={1}>
                <Login fontSize="small" />
                <Typography>Login</Typography>
              </Stack>
            </Button>
          ) : (
            <Stack gap={1} direction="row">
              <Button
                onClick={() => Navigate("/settings", { replace: true })}
                color="inherit"
              >
                <Stack gap={1} direction="row">
                  <Settings fontSize="small" />
                  Settings
                </Stack>
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
