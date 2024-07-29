import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";

const linkTheme = createTheme({
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: "white",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "none",
          },
          "&:focus": {
            textDecoration: "none",
          },
        },
      },
    },
  },
});

export default function Hero() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const validateEmail = (email) => {
    // Simple email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const harvestEmail = () => {
    //TODO - add a function on backend to save the entered emails into temporary database after the second round of validation
    if (isValid) {
      console.log(email);
      window.location.href = "/app";
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundImage:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, #CEE5FD, #FFF)"
            : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
        backgroundSize: "100% 20%",
        backgroundRepeat: "no-repeat",
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignSelf: "center",
              textAlign: "center",
              fontSize: "clamp(3.5rem, 10vw, 4rem)",
            }}
          >
            Join The Open&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: "clamp(3rem, 10vw, 4rem)",
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "primary.main"
                    : "primary.light",
              }}
            >
              Demo.
            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}
          >
            Our web app offers a unique and entertaining way to determine age,
            race, gender, and emotions from facial images.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}
          >
            <TextField
              id="outlined-basic"
              hiddenLabel
              size="small"
              color="error"
              variant="outlined"
              aria-label="Enter your email address"
              placeholder="Your email address"
              inputProps={{
                autoComplete: "off",
                "aria-label": "Enter your email address",
              }}
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: !touched || isValid ? "grey" : "red",
                  },
                  "&:hover fieldset": {
                    borderColor: !touched || isValid ? "grey" : "red",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: !touched || isValid ? "grey" : "red",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={!isValid}
              onClick={harvestEmail}
            >
              <ThemeProvider theme={linkTheme}>
                <span style={{ color: "white", textDecoration: "none" }}>
                  Access The Demo
                </span>
              </ThemeProvider>
            </Button>
          </Stack>
          <Typography
            variant="caption"
            textAlign="center"
            sx={{ opacity: 0.8 }}
          >
            By clicking &quot;Access The Demo&quot; you agree to our&nbsp;
            <a href="https://business.gov.nl/regulation/general-terms-conditions/">
              Terms & Conditions
            </a>
            .
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
