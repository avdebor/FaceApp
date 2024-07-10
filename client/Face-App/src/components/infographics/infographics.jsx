import "./infographics.css";
import Button from "@mui/material/Button";
import { IoArrowBackCircle } from "react-icons/io5";
import { FaCopy } from "react-icons/fa";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Container, Box, CardMedia } from "@mui/material";
import Chip from "@mui/material/Chip";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

function Infographics({ data, changePage }) {
  console.log(data);

  const emotion = data.analysis_results[0].emotion;
  const race = data.analysis_results[0].race;

  const valueFormatter = (value) => `${value}%`;

  const emotionChartSetting = {
    yAxis: [
      {
        label: "Emotion Percentage (%)",
      },
    ],
    series: [
      {
        dataKey: "value",
        label: "Detected emotion",
        valueFormatter,
      },
    ],
    height: 300,
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: "translateX(-10px)",
      },
    },
  };

  const raceChartSettings = {
    yAxis: [
      {
        label: "Race Percentage (%)",
      },
    ],
    series: [
      {
        dataKey: "value",
        label: "Detected race",
        valueFormatter,
      },
    ],
    height: 300,
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: "translateX(-10px)",
      },
    },
  };

  // Convert emotion object to an array
  const emotionDataArray = Object.keys(emotion).map((key) => ({
    name: key,
    value: parseFloat(emotion[key].toFixed(2)),
  }));

  const raceDataArray = Object.keys(race).map((key) => ({
    name: key,
    value: parseFloat(race[key].toFixed(3)),
  }));

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
        <Typography variant="h2" gutterBottom style={{ fontWeight: 600 }}>
          Analysis result
        </Typography>{" "}
        <Box
          sx={{
            width: 300,
            height: 300,
            display: "flex",
            justifyContent: "left",
            alignItems: "left",
            flexDirection: "column",
          }}
        >
          <CardMedia
            component="img"
            src={`data:image/png;base64,${data.mashed_file}`}
            alt="Fetched from API"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              marginTop: "20",
            }}
          ></CardMedia>
        </Box>
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
            <Typography variant="h6" component="span">
              <b> : {JSON.stringify(data.analysis_results[0].age)}</b>
            </Typography>
          </div>
        </div>
        <div className="inline_data_container">
          <div>
            <Chip label="Predicted Dominant Gender" variant="outlined" />
            <Typography variant="h6" component="span">
              <b>
                {" "}
                :{" "}
                {JSON.stringify(
                  data.analysis_results[0].dominant_gender
                ).replaceAll('"', "")}
              </b>
            </Typography>
          </div>
          <Typography variant="h6" component="span">
            Gender Ratio:
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
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
              width={400} // increased width
              height={400} // increased height
            />
          </Box>
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
            <Typography variant="h6" component="span">
              <b>
                {" "}
                :{" "}
                {JSON.stringify(
                  data.analysis_results[0].dominant_emotion
                ).replaceAll('"', "")}
              </b>
            </Typography>
          </div>
          <div className="barchart_container">
            <BarChart
              dataset={emotionDataArray}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "name", // Use "name" for the x-axis key
                },
              ]}
              {...emotionChartSetting}
            />
          </div>
        </div>
        <div className="inline_data_container">
          <div>
            <Chip label="Dominant Race" variant="outlined" />
            <Typography variant="h6" component="span">
              <b>
                {" "}
                :{" "}
                {JSON.stringify(
                  data.analysis_results[0].dominant_race
                ).replaceAll('"', "")}
              </b>
            </Typography>
          </div>
          <div className="barchart_container">
            <BarChart
              dataset={raceDataArray}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "name", // Use "name" for the x-axis key
                },
              ]}
              {...raceChartSettings}
            />
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
                {JSON.stringify(data.analysis_results)}
              </Typography>
              <div className="raw_data_button_wrap">
                <Button
                  startIcon={<FaCopy />}
                  variant="contained"
                  style={{ margin: "20px" }}
                  color="success"
                  onClick={() =>
                    copyData(JSON.stringify(data.analysis_results))
                  }
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
