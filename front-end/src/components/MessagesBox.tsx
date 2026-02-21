import { Box, Stack, Typography } from "@mui/material";
import useChatStore from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ImagePopUp from "./ImagePopUp";

const MessagesBox = () => {
  const { messages, selectedContact } = useChatStore() as any;

  const toLocalTime = (date: string) => {
    const new_date = new Date(date);

    new_date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return new_date.toLocaleTimeString();
  };

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedContact.id]);

  const [isOpen, setIsOpen] = useState(false);
  const [image_url, setImageUrl] = useState("");

  return (
    <Stack gap={7} p={2} overflow="scroll">
      {messages.map((message: any) => {
        return (
          <Box
            key={message.id}
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems={
              message.sender_id === selectedContact.id ? "start" : "end"
            }
          >
            <Stack gap={2}>
              <Stack>
                {message.images_url.map((url: string) => {
                  return (
                    <img
                      onClick={() => {
                        setIsOpen(true);
                        setImageUrl(url);
                      }}
                      key={url}
                      width={300}
                      src={url ? `${url}` : undefined}
                    />
                  );
                })}
              </Stack>
              <Stack
                p={3}
                gap={1}
                borderRadius={3}
                borderRight={message.sender_id === selectedContact.id ? 0 : 4}
                borderLeft={message.sender_id === selectedContact.id ? 4 : 0}
                borderColor="grey.800"
                bgcolor="grey.900"
              >
                <Typography>{message.content}</Typography>
                <Typography color="text.secondary" fontSize={14}>
                  {toLocalTime(message.created_at)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        );
      })}
      <div ref={ref} />
      <ImagePopUp isOpen={isOpen} setIsOpen={setIsOpen} image_url={image_url} />
    </Stack>
  );
};

export default MessagesBox;
