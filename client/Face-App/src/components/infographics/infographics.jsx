import "./infographics.css";
import Button from "@mui/material/Button";
import { IoArrowBackCircle } from "react-icons/io5";
import { FaCopy } from "react-icons/fa";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Container } from "@mui/material";
import Chip from "@mui/material/Chip";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import { PieChart } from "@mui/x-charts/PieChart";
// import { BarChart } from "@mui/x-charts/BarChart";
// import { axisClasses } from "@mui/x-charts/ChartsAxis";

function Infographics({ data, changePage }) {
  console.log("Data from infographics component:", data);

  const copyData = async (data) => {
    try {
      await navigator.clipboard.writeText(data);
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  return (
    <div className="infographics_container">
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom>
          Analysis result
        </Typography>{" "}
        <br />
        <div className="inline_data_container">
          <div>
            <Tooltip
              title="Be aware that this AI feature is still in development"
              placement="top"
            >
              <Badge
                badgeContent="!"
                color="primary"
                variant="outlined"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Chip
                  label="Approximate age"
                  variant="outlined"
                  color="success"
                />
              </Badge>
            </Tooltip>
            <Typography variant="h6" component="h">
              <b> : {JSON.stringify(data.analysis_results[0].age)}</b>
            </Typography>
          </div>
        </div>
        <div className="inline_data_container">
          <div>
            <Chip label="Predicted Dominant Gender" variant="outlined" />
            <Typography variant="h6" component="h">
              <b>
                {" "}
                :{" "}
                {JSON.stringify(
                  data.analysis_results[0].dominant_gender
                ).replaceAll('"', "")}
              </b>
            </Typography>
          </div>
          <Typography variant="h6" component="h">
            Gender Ratio:
          </Typography>
          <PieChart
            series={[
              {
                data: [
                  {
                    id: 0,
                    value: parseFloat(data.analysis_results[0].gender.Man),
                    label: "Man",
                  },
                  {
                    id: 1,
                    value: parseFloat(data.analysis_results[0].gender.Woman),
                    label: "Woman",
                  },
                ],
              },
            ]}
            width={400}
            height={200}
          />
        </div>
        <div className="inline_data_container">
          <div>
            <Tooltip
              title="Be aware that this AI feature is still in development"
              placement="top"
            >
              <Badge
                badgeContent="!"
                color="primary"
                variant="outlined"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Chip
                  label="Dominant Emotion"
                  variant="outlined"
                  color="success"
                />
              </Badge>
            </Tooltip>
            <Typography variant="h6" component="h">
              <b>
                {" "}
                :{" "}
                {JSON.stringify(
                  data.analysis_results[0].dominant_emotion
                ).replaceAll('"', "")}
              </b>
            </Typography>
          </div>
        </div>
        <div className="RawAccordionContainer">
          <Accordion sx={{ width: "70%" }}>
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
                {JSON.stringify(data)}
              </Typography>
              <div className="raw_data_button_wrap">
                <Button
                  startIcon={<FaCopy />}
                  variant="contained"
                  style={{ margin: "20px" }}
                  color="success"
                  onClick={() => copyData(JSON.stringify(data))}
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
      </Container>
    </div>
  );
}

export default Infographics;
