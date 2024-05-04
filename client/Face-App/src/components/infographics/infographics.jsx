import "./infographics.css";
import Button from "@mui/material/Button";
import { IoArrowBackCircle } from "react-icons/io5";

function Infographics({ data }) {
  console.log("Data from infographics component:", data);

  return (
    <div>
      infographics component <br />
      <Button
        startIcon={<IoArrowBackCircle />}
        variant="contained"
        type="submit"
        form="fileUploadForm"
      >
        Back To Analysis
      </Button>
    </div>
  );
}

export default Infographics;
