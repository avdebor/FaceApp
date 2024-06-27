import "./upload.css";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { IoSend } from "react-icons/io5";
import AlertSnackbar from "../Alert/AlertComponent";

const FileUpload = (props) => {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No selected file");
  const [analysisData, setAnalysisData] = useState([]);
  const [snackContent, setSnackContent] = useState("");
  const [snackStatus, setSnackStatus] = useState("");

  useEffect(() => {
    console.log("Analysis Data updated:", analysisData);
    props.changeData(analysisData);
  }, [analysisData, props]);

  const spawnToast = (status, text) => {
    setSnackContent(<>{text}</>);
    setSnackStatus(String(status));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (image) {
      try {
        const formData = new FormData();
        formData.append("file", image);

        const response = await fetch("http://127.0.0.1:8000/api/uploadfiles/", {
          method: "POST",
          body: formData,
        });

        // Parse response as JSON
        const responseData = await response.json();

        // Update analysisData state with responseData
        setAnalysisData(responseData);
        console.log("Analysis Data:", responseData); // Add this line to check the value
        props.changeData(responseData); // Ensure this line is called

        if (!response.ok) {
          throw new Error("Upload failed");
        }
        // Optionally, reset the form after successful upload
        setFileName("No selected file");
        setImage(null);
        spawnToast("success", "File successfully uploaded");

        props.changePage(1);
      } catch (error) {
        spawnToast("error", "An unknown error has occurred");
        console.error("Error uploading file:", error);
      }
    } else {
      spawnToast("error", "No image chosen");
    }
  };

  return (
    <div>
      <main>
        <form
          onClick={() => document.querySelector(".input-field").click()}
          onSubmit={handleSubmit}
          id="fileUploadForm"
        >
          <input
            type="file"
            accept="image/*"
            className="input-field"
            hidden
            onChange={({ target: { files } }) => {
              files[0] && setFileName(files[0].name);
              if (files) {
                setImage(files[0]);
              }
            }}
          />

          {image ? (
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              src={URL.createObjectURL(image)}
              width={150}
              height={150}
              alt={fileName}
            />
          ) : (
            <>
              <MdCloudUpload color="#1475cf" size={60} />
              <p>Browse Files to upload</p>
            </>
          )}
        </form>

        <section className="uploaded-row">
          <AiFillFileImage color="#1475cf" />
          <span className="upload-content">
            {fileName} -
            <MdDelete
              onClick={() => {
                setFileName("No selected File");
                setImage(null);
              }}
            />
          </span>
        </section>
        <div className="button-container">
          <Button
            endIcon={<IoSend />}
            variant="contained"
            type="submit"
            form="fileUploadForm"
          >
            Submit
          </Button>
        </div>
      </main>
      <AlertSnackbar message={snackContent} status={snackStatus} />
    </div>
  );
};

export default FileUpload;
