import { Box, IconButton, Stack, Typography } from "@mui/material";
import useChatStore from "../store/useChatStore";
import { Call, VideoCall } from "@mui/icons-material";

const ChatBar = () => {
  const { selectedContact } = useChatStore() as any;

  return (
    <Box width="100%" px={5} py={1.5} borderBottom={1} borderColor="grey.700">
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" gap={2} alignItems="center">
          <Stack width={50} height={50} bgcolor="#fff" borderRadius="100%">
            <img
              style={{ borderRadius: "100%" }}
              width={50}
              height={50}
              src={selectedContact.profile_url || ""}
            />
          </Stack>
          <Stack>
            <Typography fontSize={18} fontWeight="bold">
              {selectedContact.global_name}
            </Typography>
            <Typography fontSize={15} color="text.secondary">
              {selectedContact.username}
            </Typography>
          </Stack>
        </Stack>
        <Stack alignItems="center" height="100%" direction="row" gap={2}>
          <IconButton>
            <Call />
          </IconButton>
          <IconButton>
            <VideoCall />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatBar;
