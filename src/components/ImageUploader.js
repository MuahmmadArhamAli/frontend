import React from "react";

const ImageUploader = ({ onUpload, disabled }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="uploader">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        id="image-upload"
        style={{ display: "none" }}
      />
      <label htmlFor="image-upload" className="upload-button">
        {disabled ? "Processing..." : "Upload Image"}
      </label>
    </div>
  );
};

export default ImageUploader;
