import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import useChatStore from "../store/useChatStore";
import { useEffect, useState } from "react";

import AddContactBox from "./AddContactBox";
import defaultProfile from "../assets/default_avatar.png";
import useAuthStore from "../store/useAuthStore";

const ContactsSideBar = () => {
  const { onlineUsers } = useAuthStore() as any;

  const {
    contacts,
    getContacts,
    isGettingContacts,
    selectedContact,
    setSelectedContact,
  } = useChatStore() as any;

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  const [isOpen, setIsOpen] = useState(false);

  if (!contacts && isGettingContacts) {
    return (
      <Box
        height="100%"
        width={1 / 4}
        padding={2}
        paddingTop={10}
        borderRight="solid 1px"
        borderColor="grey.800"
      >
        <Stack
          direction="row"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress color="inherit" size="3rem" />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      height="100%"
      padding={2}
      paddingTop={10}
      borderRight="solid 1px"
      borderColor="grey.800"
      width={1 / 4}
    >
      <Stack
        direction="row"
        padding={2}
        borderBottom="solid 1px"
        borderColor="grey.700"
        justifyContent="space-between"
        alignContent="center"
      >
        <Typography fontSize={20} fontWeight="bold">
          Contacts
        </Typography>
        <IconButton onClick={() => setIsOpen(true)}>
          <Search fontSize="medium" />
        </IconButton>
      </Stack>
      <Stack
        direction="column"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        gap={5}
      >
        {contacts && contacts[0] ? (
          <Stack width="100%" height="100%" paddingTop={2}>
            {contacts.map((contact: any) => {
              return (
                <Button
                  onClick={() => {
                    setSelectedContact(contact);
                  }}
                  disabled={selectedContact?.id === contact.id}
                  key={contact.id}
                  fullWidth
                >
                  <Stack width="100%" direction="row">
                    <Stack position="relative">
                      <img
                        style={{
                          borderRadius: "100%",
                          backgroundColor: "#fff",
                        }}
                        width={55}
                        height={55}
                        src={
                          contact.profile_url
                            ? contact.profile_url
                            : defaultProfile
                        }
                      />

                      <Stack
                        width={10}
                        height={10}
                        borderRadius="100%"
                        bgcolor="#00ff26"
                        position="absolute"
                        right={0}
                        bottom={0}
                        visibility={
                          onlineUsers?.includes(contact.id)
                            ? "visible"
                            : "hidden"
                        }
                      />
                    </Stack>
                    <Stack textAlign="left" p={1}>
                      <Typography fontWeight="bold">
                        {contact.global_name}
                      </Typography>
                      <Typography color="text.secondary" fontSize={13}>
                        {contact.username}
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
              );
            })}
            <AddContactBox isOpen={isOpen} setIsOpen={setIsOpen} />
          </Stack>
        ) : (
          <Box>
            <AddContactBox isOpen={isOpen} setIsOpen={setIsOpen} />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ContactsSideBar;
