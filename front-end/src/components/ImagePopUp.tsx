import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

const ImagePopUp = (props: {
  isOpen: boolean;
  setIsOpen: CallableFunction;
  image_url: string;
}) => {
  return (
    <React.Fragment>
      <Dialog
        fullWidth
        open={props.isOpen}
        onClose={() => {
          props.setIsOpen(!props.isOpen);
        }}
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle>
          <Typography fontWeight="bold" fontSize={20}>
            Image Preview
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack width="100%" maxHeight={550}>
            <img src={props.image_url} alt="Preview Image" />
          </Stack>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ImagePopUp;
