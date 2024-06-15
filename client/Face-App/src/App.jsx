import "./App.css";
import FileUpload from "./components/upload/upload";
import { useState } from "react";
import Infographics from "./components/infographics/infographics";

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  console.log("Current page:", page); // Add this line to check the value of page

  return (
    <div className="container">
      {page === 0 ? (
        <FileUpload changeData={(data) => setData(data)} changePage={setPage} />
      ) : (
        <Infographics data={data} changePage={setPage} />
      )}

      {/* <button
        onClick={() => {
          console.log(data);
        }}
      >
        bebr
      </button> */}
    </div>
  );
}

export default App;
