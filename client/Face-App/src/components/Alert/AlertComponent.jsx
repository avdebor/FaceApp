//src/AlertComponent.jsx
import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// eslint-disable-next-line no-unused-vars
export default function AlertSnackbar({ message, status }) {
  const [content, setContent] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [pack, setPack] = useState([]);

  const handleClose = () => {
    setOpen(false);
    setContent(undefined);
  };

  //update content pack
  useEffect(() => {
    message &&
      setPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  }, [message]);

  //handle consecutive snackbars
  useEffect(() => {
    if (pack.length && !content) {
      //set a new snack when no active snack
      setContent({ ...pack[0] });
      setPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (pack.length && content && open && pack[0].key !== content.key) {
      //Close an active snack when a new one is added
      setOpen(false);
    }
  }, [pack, content, open]);

  const handleExited = () => {
    setContent(undefined);
  };

  return (
    <>
      {" "}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        key={content?.key}
      >
        <Alert onClose={handleClose} severity={status} sx={{ width: "100%" }}>
          <div>{content?.message}</div>
        </Alert>
      </Snackbar>
    </>
  );
}
