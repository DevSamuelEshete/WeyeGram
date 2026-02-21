import { Box, Stack, Typography } from "@mui/material";
import ContactsSideBar from "../components/ContactsSideBar";

import useChatStore from "../store/useChatStore";

import conversation from "../assets/conversation.png";
import ChatBox from "../components/ChatBox";

const HomePage = () => {
  const { selectedContact } = useChatStore() as any;

  return (
    <Box
      display="flex"
      width="100vw"
      height="100vh"
      overflow="clip"
      justifyContent="center"
      alignItems="center"
    >
      <ContactsSideBar />

      {selectedContact ? (
        <Stack position="relative" width="100%" height="100%">
          <ChatBox />
        </Stack>
      ) : (
        <Stack
          gap={5}
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <img width={450} src={conversation} />
          <Typography fontSize={20} color="text.secondary">
            Select a contact to continue your conversation
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default HomePage;
