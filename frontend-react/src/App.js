import { useState, useEffect } from 'react';
import axios from "axios";
import { Button } from "./components";
import { ResultBox } from './components';
import { NumberCircle } from "./components";
import { Header } from './components';
import { DropDown } from "./components";
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

function App() {
  const [ data, setData ] = useState("");
  const [ value, setValue ] = useState("Upload data file if needed");
  const [ fileName, setFileName ] = useState("No file uploaded");
  const [ file, setFile ] = useState(null);
  const [ message, setMessage ] = useState("");

  const [ selectedDate, setSelectedDate ] = useState("");
  const [ selectedArea, setSelectedArea ] = useState("Puttalam");
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [isFileUploadVisible, setIsFileUploadVisible ] = useState(false);

  const handleUploadButton = () => {
    setIsFileUploadVisible(!isFileUploadVisible);
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
    fetch("https://precipitation-prediction.azurewebsites.net")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data.message);
      });
  }, []);

  const handlePredictClick = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleSubmitFileAndLocation = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("location", selectedArea);
    // formData.append("date", selectedDate);

    try {
      // const uploadLink = "http://localhost:5000/upload";
      const uploadLink = "https://precipitation-prediction.azurewebsites.net/upload";
      const response = await axios.post(uploadLink, formData);

      console.log(response.data.message);
      setMessage(response.data.message);
      alert(message);

    } catch (error){
      console.error(error);
    }
  };

  const handleSubmitDateAndLocation = async (event) => {
    event.preventDefault();
    const params = {
      time: selectedDate,
      location: selectedArea,
    }
    // const formData1 = new FormData();
    // formData1.append("time", selectedDate);
    // formData1.append("location", selectedArea);

    try {
      const predictLink = "http://localhost:5000/predict";

      axios.get(predictLink,{ params })
      .then((response) => {
        console.log(response.data);
        setValue(response.data);
      });
      // alert("Data sent sucessfully");
    } catch(error){
      console.error(error);
    }
    setIsModalOpen(true);
  }

  //works fine - file upload part
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
  }

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
            <h2 className='section-title-3'>Upload Data File</h2>
            {isFileUploadVisible ? (
              <div>
                <form onSubmit={handleSubmitFileAndLocation}>
                  <label for="file-upload-area" class="custom-file-input">
              <div className='upload-area' htmlFor="file-upload-area">
                <input type="file"  id="file-upload-area" name="file"  className="upload-file" onChange={(e) => {setFile(e.target.files[0]); handleFileUpload(e) }}/>
                <p className='upload-instruction'>Click to browse, or drag and drop a file</p>
                <button type='submit'>Upload</button>
              </div>
              </label>
            </form>
            </div>
            ) : (
              <div>
                <h3 className="section-sub-title">If you want predict precipitation of other areas in Sri Lanka other than Puttalam, upload a data file.</h3>
                <button onClick={handleUploadButton}>Upload a file</button>
                </div>

            )}
          </div>
        </div>
      <div className='section'>
        <div className='section-row'>
          {/* <form onSubmit={handleSubmitDateAndLocation}> */}
          {/* <button>hi</button> */}
        <Button text="Predict" handleClickButton={handleSubmitDateAndLocation}/>
        {/* </form> */}
        </div>
      </div>
      <div>
        {isModalOpen && (
          <ResultBox value={value} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}
export default App;

