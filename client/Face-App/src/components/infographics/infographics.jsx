import "./infographics.css";
import Button from "@mui/material/Button";
import { IoArrowBackCircle } from "react-icons/io5";
import { FaCopy } from "react-icons/fa";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import Container from "@mui/material/Container";

function Infographics({ data, changePage }) {
  // Receive changePage function as prop
  console.log("Data from infographics component:", data);

  const strData = JSON.stringify(data);

  const copyData = async (data) => {
    try {
      await navigator.clipboard.writeText(data);
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  return (
    <div className="infographics_container">
      infographics component <br />
      <div className="RawAccordionContainer">
        <Accordion sx={{ width: "50%" }}>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>Raw Data (json)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              className="json_data_holder"
              sx={{ fontSize: "20px" }}
              style={{ wordWrap: "break-word", width: "100%" }}
            >
              {strData}
            </Typography>
            <div className="raw_data_button_wrap">
              <Button
                startIcon={<FaCopy />}
                variant="contained"
                style={{ margin: "20px" }}
                color="success"
                onClick={() => copyData(strData)}
              >
                Copy to clipboard
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <Button
        startIcon={<IoArrowBackCircle />}
        variant="contained"
        type="submit"
        form="fileUploadForm"
        onClick={() => changePage(0)} // Call changePage to set page to 0
      >
        Back To Analysis
      </Button>
    </div>
  );
}

export default Infographics;
