import React, { useState } from 'react';

function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // You can handle the file upload logic here, e.g., sending the files to a server using an API.

    // Reset the selected files after upload
    setSelectedFiles([]);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div
          className={`drop-zone ${isDragging ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>Drag & Drop files here</p>
          <input
            type="file"
            id="fileInput"
            multiple
            onChange={handleFileInputChange}
          />
          <label htmlFor="fileInput">Or click to select files</label>
        </div>
        <div>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default FileUpload;
