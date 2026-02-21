import React, { useEffect, useState } from "react";
// import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Box, InputAdornment, Stack, TextField } from "@mui/material";
import { Message, PersonOutline } from "@mui/icons-material";
import useChatStore from "../store/useChatStore";

import defaultProfile from "../assets/default_avatar.png";
import useAuthStore from "../store/useAuthStore";

interface AddContactBoxProps {
  isOpen: boolean;
  setIsOpen: CallableFunction;
}

export default function AddContactBox({
  isOpen,
  setIsOpen,
}: AddContactBoxProps) {
  const [searchValue, setSearchValue] = useState("");

  const [filteredUsers, setFilteredUsers] = useState([]);

  const { authUser } = useAuthStore() as any;
  const {
    users,
    isGettingUsers,
    getUsers,
    addContact,
    contacts,
    setSelectedContact,
  } = useChatStore() as any;

  const HandleAddContact = async (user2_id: string) => {
    setIsOpen(false);
    const contact = contacts.filter(
      (contact: any) => contact.id === user2_id,
    )[0];

    if (!contact?.id) await addContact(user2_id);

    setSelectedContact(contact);
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    setFilteredUsers(
      users?.filter((user: any) => {
        return user.username.includes(searchValue) && user.id !== authUser.id;
      }),
    );
  }, [setFilteredUsers, searchValue]);

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        onClose={() => setIsOpen(!isOpen)}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <Stack bgcolor="grey.900">
          <Stack>
            <DialogTitle
              sx={{
                m: 0,
                p: 2,
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
              }}
              id="customized-dialog-title"
            >
              Add Contacts
              <Typography
                textAlign="center"
                color="text.secondary"
                fontSize={15}
              >
                Look up a user with their username
              </Typography>
            </DialogTitle>
          </Stack>

          <IconButton
            aria-label="close"
            onClick={() => setIsOpen(!isOpen)}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <TextField
              placeholder="Username"
              fullWidth
              onChange={(e) => {
                setSearchValue(e.currentTarget.value);
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 4 }}>
            <Stack gap={2} width="100%" height={250} overflow="scroll">
              {isGettingUsers && !users ? (
                <Box></Box>
              ) : filteredUsers ? (
                filteredUsers.map((user: any) => {
                  return (
                    <Box
                      padding={2}
                      border="solid 1px"
                      borderColor="grey.700"
                      borderRadius={2}
                      key={user.id}
                    >
                      <Stack justifyContent="space-between" direction="row">
                        <Stack direction="row">
                          <img
                            width={55}
                            src={
                              user.profile_url
                                ? user.profile_url
                                : defaultProfile
                            }
                          />
                          <Stack p={1}>
                            <Typography fontWeight="bold">
                              {user.global_name}
                            </Typography>
                            <Typography color="text.secondary" fontSize={13}>
                              {user.username}
                            </Typography>
                          </Stack>
                        </Stack>

                        <IconButton
                          onClick={() => {
                            HandleAddContact(user.id);
                          }}
                        >
                          <Message />
                        </IconButton>
                      </Stack>
                    </Box>
                  );
                })
              ) : (
                <Box
                  display="flex"
                  height="80%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography color="text.secondary">
                    User doesn't exist
                  </Typography>
                </Box>
              )}
            </Stack>
          </DialogActions>
        </Stack>
      </Dialog>
    </React.Fragment>
  );
}
