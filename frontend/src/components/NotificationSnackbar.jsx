import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import * as React from "react";
import { GREY, WHITE } from "./consts";

export const errorMessageEN = "Error!";
export const errorFetchDataMessageEN = "Error retrieving data!";

export default function NotificationSnackbar({ message, open, setOpen }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      ContentProps={{
        sx: {
          background: GREY,
          color: WHITE,
        },
      }}
      open={open}
      autoHideDuration={2500}
      onClose={handleClose}
      message={message}
      action={action}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    />
  );
}
