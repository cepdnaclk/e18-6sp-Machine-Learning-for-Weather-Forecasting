import { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';
import Button from "./button";
import DropDown from "./dropDown";
import ResultBox from './result';
import NumberCircle from "./numberCircle";
import Header from './header';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import UploadIcon from "./upload-icon.png";

function App() {
  const [ data, setData ] = useState("");
  const [ val, setVal ] = useState("Upload data file if needed");
  const [ fileName, setFileName ] = useState("No file uploaded");

  const [ selectedDate, setSelectedDate ] = useState("");
  const [ selectedArea, setSelectedArea ] = useState("Puttalam");

  const Areas = [
    {label: "Puttalam", value: "Puttalam"},
    {label: "Battaramulla", value:"Battaramulla"},
    {label: "Chilaw", value:"Chilaw"},
  ];

  useEffect(() => {
    fetch("http://localhost:5000")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setData(data.message);
    });
  }, []);

  const [ file, setFile ] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new formData();
    formData.append("file", file);

    try {
      axios.post("http://localhost:5000/upload", formData).then((res) =>{
        console.log(res.data.message);
        setVal(res.data.message);
      });
      alert("File uploaded sucessfully");
    } catch(error){
      console.error(error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
  };

 return (
    <>
      <Header />
      <div className='section'>
        <div className="section-row">
          <NumberCircle number="1"/>
          <h2 className='section-title'>Select a Date</h2>
        </div>
        <div className='section-row'>
          {/* <DropDown options={Areas} onSelect={setSelectedArea} /> */}
          <ReactDatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showYearDropdown
          dateFormatCalendar='MMMM'
          yearDropdownItemNumber={15}
          scrollableYearDropdown
          />
        </div>
      </div>
      <div className='section'>
        <div className='section-row'>
          <NumberCircle number="2" />
          <h2 className='section-title'>Upload Data file</h2>
        </div>
        <div className='upload-area'>
          <form onSubmit={handleSubmit}>
          <input type="file"  name="file"  className="upload-file" onChange={(e) => {setFile(e.target.files[0]); handleFileUpload(e) }}/>
          <p>Click to browse, or drag and drop a file</p>
          </form>
        </div>
      </div>
      <div className='section'>
        <Button text="Predict" />
      </div>
      <div className='result-box'>
        <ResultBox value="500" img="" />
      </div>

      <div className=" mt-[5rem] mb-4 text-2xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-violet-600 from-blue-900 font-black">
          Precipitation is : {val}
        </span>
      </div>
    </>
  );
}
export default App;
