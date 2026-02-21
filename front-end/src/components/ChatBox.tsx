import { Box, Skeleton, Stack } from "@mui/material";
import ChatInput from "./ChatInput";

import useChatStore from "../store/useChatStore";
import { useEffect } from "react";
import NoMessages from "./NoMessages";
import MessagesBox from "./MessagesBox";
import ChatBar from "./ChatBar";

const ChatBox = () => {
  const {
    messages,
    isGettingMessages,
    getMessages,
    selectedContact,
    ListenForMessages,
    UnListenForMessages,
  } = useChatStore() as any;

  useEffect(() => {
    const run = async () => {
      await getMessages();
      ListenForMessages();

      return () => UnListenForMessages();
    };

    run();
  }, [getMessages, selectedContact.id, ListenForMessages, UnListenForMessages]);

  if (isGettingMessages && !messages) {
    return (
      <Stack width="100%" height="100%">
        <Stack gap={7} p={5} overflow="scroll">
          {[...Array(25)].map((_, i) => {
            return (
              <Box
                key={i}
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems={i % 2 === 0 ? "start" : "end"}
              >
                <Stack gap={2}>
                  {i % 3 === 0 ? (
                    <Skeleton variant="rectangular" width={500} height={300} />
                  ) : null}
                  <Skeleton
                    variant="rectangular"
                    width={450}
                    height={100}
                  ></Skeleton>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack width="100%" height="100%">
      {messages && messages[0] ? (
        <Stack height="100%" width="100%" py={10}>
          <ChatBar />
          <MessagesBox />
        </Stack>
      ) : (
        <NoMessages />
      )}
      <ChatInput />
    </Stack>
  );
};

export default ChatBox;
