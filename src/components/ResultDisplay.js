import React from "react";

const ResultDisplay = ({ result }) => {
  return (
    <div className="result">
      <h2>Classification Results</h2>
      <div className="result-item">
        <span className="label">Animal:</span>
        <span className="value">{result.prediction}</span>
      </div>
      <div className="result-item">
        <span className="label">Confidence:</span>
        <span className="value">{(result.confidence * 100).toFixed(2)}%</span>
      </div>
    </div>
  );
};

export default ResultDisplay;
