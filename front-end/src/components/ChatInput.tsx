import { Add, Close, Image, Send } from "@mui/icons-material";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import useChatStore from "../store/useChatStore";

const ChatInput = () => {
  const [chatInputs, setChatInputs] = useState<{
    images_url: string[];
    content: string;
  }>({
    images_url: [],
    content: "",
  });

  const [sendActive, setSendActive] = useState(false);

  useEffect(() => {
    setSendActive(false);
    if (
      chatInputs.content ||
      (chatInputs.images_url && chatInputs.images_url[0])
    ) {
      setSendActive(true);
    }
  }, [chatInputs, setSendActive]);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result as string;
      setChatInputs({
        ...chatInputs,
        images_url: [...chatInputs.images_url, base64Image],
      });
    };
    console.log(chatInputs);
  };

  const { sendMessage, isSendingMessage, selectedContact } =
    useChatStore() as any;

  const handleSendMessage = async () => {
    await sendMessage({
      ...chatInputs,
      contacts_id: selectedContact.contacts_id,
      receiver_id: selectedContact.id,
    });
    setChatInputs({ content: "", images_url: [] });
  };

  return (
    <Stack
      gap={1}
      direction="row"
      position="absolute"
      width="100%"
      bottom={0}
      padding={2}
    >
      <Stack
        visibility={!chatInputs.images_url[0] ? "hidden" : "visible"}
        direction="row"
        gap={5}
        overflow="scroll"
        position="absolute"
        bgcolor="grey.900"
        padding={2}
        bottom={100}
      >
        {chatInputs.images_url.map((img) => {
          return (
            <Stack position="relative">
              <Stack position="absolute" top={10} right={0}>
                <IconButton
                  onClick={() => {
                    setChatInputs({
                      ...chatInputs,
                      images_url: [
                        ...chatInputs.images_url.filter(
                          (image) => image !== img
                        ),
                      ],
                    });
                  }}
                >
                  <Close />
                </IconButton>
              </Stack>
              <img height={150} src={img} />
            </Stack>
          );
        })}
      </Stack>
      <Stack direction="row" width="100%">
        <Button variant="outlined">
          <Add />
        </Button>
        <Button variant="outlined">
          <label style={{ height: 25 }}>
            <Image />
            <input
              onChange={(e) => handleImageUpload(e)}
              type="file"
              accept="images/*"
              multiple
              style={{ display: "none", visibility: "hidden" }}
            />
          </label>
        </Button>
        <TextField
          value={chatInputs.content}
          onChange={(e) => {
            setChatInputs({ ...chatInputs, content: e.target.value });
          }}
          placeholder="Type your message"
          fullWidth
        />
        <Button
          onClick={() => {
            handleSendMessage();
          }}
          disabled={!sendActive || isSendingMessage}
          variant="contained"
          endIcon={<Send />}
        >
          Send
        </Button>
      </Stack>
    </Stack>
  );
};

export default ChatInput;
