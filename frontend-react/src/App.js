import { useState, useEffect } from 'react';
import axios from "axios";
import { Button, 
  SuccessBox, 
  ResultBox, 
  NumberCircle,
  Header, 
  DropDown, 
  AlertBox } from "./components";
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

function App() {
  const [ value, setValue ] = useState("Upload data file if needed");
  const [ fileName, setFileName ] = useState("No file uploaded");
  const [ file, setFile ] = useState(null);

  const [ successMessage, setSuccessMessage ] = useState("");
  const [ selectedDate, setSelectedDate ] = useState("");
  const [ selectedArea, setSelectedArea ] = useState("Puttalam");
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ isFileUploadVisible, setIsFileUploadVisible ] = useState(false);
  const [ errorMessageU, setErrorMessageU ] = useState("An error occured while uploading");
  const [ errorMessageP, setErrorMessageP ] = useState("An error occured while predicting");
  const [ isErrorModalOpen, setIsErrorModalOpen ] = useState("");
  const [ isSuccessModalOpen, setIsSuccessModalOpen ] = useState(false);

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

  const handleUploadButton = () => {
    setIsFileUploadVisible(!isFileUploadVisible);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  }

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
  }

  //to handle Upload Button
  const handleSubmitFileAndLocation = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("location", selectedArea);
    // formData.append("date", selectedDate);

    try {

      const uploadLink = "https://climateforcast.azurewebsites.net/upload";
      const response = await axios.post(uploadLink, formData);
      
      if (response.status === 200){
        setSuccessMessage(response.data);
        setIsSuccessModalOpen(true);
      } else {
        throw new Error(`Failed to upload: ${response.statusText}`);
      }
    } catch (error){
      setErrorMessageP("");
      setErrorMessageU(error.response ? error.message : "An error occured while uploading.");
      setIsErrorModalOpen(true);
    }
  };

  //to handle predict Button
  const handleSubmitDateAndLocation = async (event) => {
    event.preventDefault();

    const dateString = selectedDate;
    const dateObject = new Date(dateString);

    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); 
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;

    const params = {
      time: formattedDate,
      location: selectedArea,
    }

    try {
      const predictLink = "https://climateforcast.azurewebsites.net/predict";
      const response2 = await axios.get(predictLink, {params: params});

      if (response2.status === 200){
        setValue(response2.data);
        setIsModalOpen(true);
      } else {
        throw new Error(`Failed to predict: ${response2.statusText}`);
      }
    } catch(error){
      setErrorMessageU("");
      console.error(error);
      setErrorMessageP(error.response2 ? error.response2.data : "An error occured while predicting");
      setIsErrorModalOpen(true);
    }
  }

 return (
    <div>
      <Header />
      <div className='section'>
        <h2 className='greeting'>
          Predict the precipitation of any day!
        </h2>
      </div>
      <div className='section-para'>
        <p className='section-para-text'>Select date, location and upload a file. Click on upload button and please wait until a confimation appears. Then click on Predict!</p>
      </div>
      
      <div className='card-section'>
          <div className='card'>
            <NumberCircle number="1"/>
            <h2 className='section-title'>Select a Date</h2>
            <div className='data-section'>
            <ReactDatePicker
              format="MM-dd-y"
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
                  <label htmlFor="file-upload-area" className="custom-file-input">
              <div className='upload-area' htmlFor="file-upload-area">
                <input type="file"  id="file-upload-area" name="file"  className="upload-file" onChange={(e) => {setFile(e.target.files[0]); handleFileUpload(e) }}/>
                <p className='upload-instruction'>Click to browse, or drag and drop a file</p>
                <button type='submit' className='upload-button'>Upload</button>
              </div>
              </label>
            </form>
            </div>
            ) : (
              <div>
                <h3 className="section-sub-title">If you want predict precipitation of other areas in Sri Lanka other than Puttalam, upload a data file.</h3>
                <button onClick={handleUploadButton} className='uploadafile-button'>Upload a file</button>

                </div>

            )}
          </div>
        </div>
      <div className='section'>
        <div className='section-row'>
          <form onSubmit={handleSubmitDateAndLocation}> 
          <button type="submit" className='predict-button'>Predict</button>
        {/* <Button text="Predict" handleClickButton={handleSubmitDateAndLocation}/> */}
        </form>
        </div>
      </div>
      <div>
        {isModalOpen && (
          <ResultBox value={value} onClose={handleCloseModal} />
        )}
      </div>
      <div>
        {isErrorModalOpen && (errorMessageP !== "" ) && (
          <AlertBox errorMessage={errorMessageP} onClose={closeErrorModal} />
        )}
        {isErrorModalOpen && (errorMessageU !== "" ) && (
          <AlertBox errorMessage={errorMessageU} onClose={closeErrorModal} />
        )}
      </div>
      <div>
        {isSuccessModalOpen && (
          <SuccessBox successMessage={successMessage} onClose={closeSuccessModal} />
        )}
      </div>
    </div>
  );
}
export default App;

