import React, { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import ResultDisplay from "./components/ResultDisplay";
import "./styles/App.css";

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (imageFile) => {
    // Validate image before uploading
    if (!imageFile.type.match(/image\/(jpeg|jpg|png)/)) {
      setError("Please upload a JPEG or PNG image");
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedImage(URL.createObjectURL(imageFile));

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch(
        "http://ai-lab-project-backend-production.up.railway.app/predict", // Ensure this URL is correct
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(`Server error: ${response.status}`);
        }
        throw new Error(errorData.error || "Failed to process image");
      }

      const data = await response.json();

      // Validate response structure
      if (!data.class || !data.confidence) {
        throw new Error("Invalid response from server");
      }

      setResult({
        prediction: data.class,
        confidence: data.confidence,
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Gender Predictor</h1>
      <ImageUploader
        onUpload={handleImageUpload}
        disabled={isLoading}
        accept="image/jpeg, image/png"
      />

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          Processing image...
        </div>
      )}

      {error && (
        <div className="error">
          ⚠️ Error: {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {selectedImage && (
        <div className="image-preview">
          <h3>Selected Image:</h3>
          <img
            src={selectedImage}
            alt="Preview"
            onError={() => setError("Failed to load image preview")}
          />
        </div>
      )}

      {result && <ResultDisplay result={result} />}
    </div>
  );
}

export default App;
