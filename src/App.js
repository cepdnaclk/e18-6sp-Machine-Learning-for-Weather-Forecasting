import { useState, useEffect } from 'react';
import axios from "axios";
import { Button } from "./components";
import {ResultBox} from './components';
import {NumberCircle} from "./components";
import {Header} from './components';
import {DropDown} from "./components";
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

function App() {
  const [ data, setData ] = useState("");
  const [ val, setVal ] = useState("Upload data file if needed");
  const [ fileName, setFileName ] = useState("No file uploaded");

  const [ selectedDate, setSelectedDate ] = useState("");
  const [ selectedArea, setSelectedArea ] = useState("Puttalam");

  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ value, setValue ] = useState(null);

  const handlePredictClick = () => {
    const predictedValue = "5632";
    setValue(predictedValue);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }
  const Areas = [
    {label: "Puttalam", value: "Puttalam"},
    {label: "Colombo", value: "Colombo"},
    {label: "Gampaha", value: "Gampaha"},
    {label: "Kalutara", value: "Kalutara"},
    {label: "Jaffna", value:"Jaffna"},
    {label: "Anuradhapura", value:"Anuradhapura"},
    {label: "Galle", value: "Galle"},
    {label: "Dambulla", value:"Dambulla"},
    {label: "Kandy", value:"Kandy"},
    {label: "Matale", value:"Matale"},
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
    <div>
      <Header />
      <div className='section'>
        <h2 className='greeting'>
          Predict the precipitation of any day!
        </h2>
      </div>
      <div className='card-section'>
          <div className='card'>
            <NumberCircle number="1"/>
            <h2 className='section-title'>Select a Date</h2>
            <div className='data-section'>
            <ReactDatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showYearDropdown
              dateFormatCalendar='MMMM'
              yearDropdownItemNumber={15}
              scrollableYearDropdown
              className='custom-date-picker'
            />
            </div>
          </div>
          <div className='card'>
            <NumberCircle number="2" />
            <h2 className='section-title'>Select Area</h2>
            <div className='data-section'>
            <DropDown options={Areas} onSelect={setSelectedArea} />
            </div>
          </div>
          <div className='card'>
          <NumberCircle number="3" />
            <h2 className='section-title'>Upload Data File</h2>
            <form onSubmit={handleSubmit}>
              <div className='upload-area'>
                <input type="file"  name="file"  className="upload-file" onChange={(e) => {setFile(e.target.files[0]); handleFileUpload(e) }}/>
                <p className='upload-instruction'>Click to browse, or drag and drop a file</p>
              </div>
            </form>
          </div>
        </div>
      <div className='section'>
        <div className='section-row'>
        <Button text="Predict" handleClickButton={handlePredictClick}/>
        </div>
      </div>
      <div>
        {isModalOpen && (
          <ResultBox value="500" onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}
export default App;
