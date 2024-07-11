import { Container, Typography, Button, Box } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { Outlet, Link } from "react-router-dom";

function NotFound() {
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        <b>Oops!</b>
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        The page youre looking for doesnt exist.
      </Typography>
      <Box mt={4}>
        <Link to="/">
          <Button variant="contained" color="primary" startIcon={<HomeIcon />}>
            Take Me Home
          </Button>
        </Link>
      </Box>
      <Outlet />
    </Container>
  );
}

export default NotFound;
