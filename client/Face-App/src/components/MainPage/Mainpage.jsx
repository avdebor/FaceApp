import FileUpload from "../upload/upload"; // Corrected import path
import { useState } from "react";
import Infographics from "../infographics/infographics";

//./infographics/infographics

function Mainpage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  console.log("Current page:", page); // Add this line to check the value of page

  return (
    <div className="container">
      {page === 0 ? (
        <div className="file_uploader">
          <FileUpload
            changeData={(data) => setData(data)}
            changePage={setPage}
          />
        </div>
      ) : (
        <Infographics data={data} changePage={setPage} />
      )}
    </div>
  );
}

export default Mainpage;
