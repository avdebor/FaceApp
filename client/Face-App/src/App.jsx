import "./App.css";
import FileUpload from "./components/upload/upload";
import { useState } from "react";

function App() {
  const [data, setData] = useState([]);

  return (
    <div className="container">
      <FileUpload changeData={(data) => setData(data)} />

      <button
        onClick={() => {
          console.log(data);
        }}
      >
        bebr
      </button>
    </div>
  );
}

export default App;
