import { Stack, Typography } from "@mui/material";
import EmptyChat from "../assets/EmptyChat.png";
import useChatStore from "../store/useChatStore";

const NoMessages = () => {
  const { selectedContact } = useChatStore() as any;

  return (
    <Stack gap={5} height="100%" justifyContent="center" alignItems="center">
      <img width={530} src={EmptyChat} />
      <Typography color="text.secondary">
        You have no chat history with <b>{selectedContact.username}</b>. Start
        by saying Hi!
      </Typography>
    </Stack>
  );
};

export default NoMessages;
