import React, { useState } from "react";
import { executeCode } from "./api";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      alert("An error occurred. Unable to run code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '50%' }}>
      <p style={{ marginBottom: '8px', fontSize: '16px' }}>Output</p>
      <button
        style={{
          marginBottom: '16px',
          padding: '8px 12px',
          fontSize: '14px',
          backgroundColor: isLoading ? '#38a169' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        disabled={isLoading}
        onClick={runCode}
      >
        {isLoading ? 'Running...' : 'Run Code'}
      </button>
      <div
        style={{
          height: '75vh',
          padding: '8px',
          color: isError ? '#e53e3e' : '',
          border: '1px solid',
          borderRadius: '4px',
          borderColor: isError ? '#ef4444' : '#333',
          overflowY: 'auto',
        }}
      >
        {output
          ? output.map((line, i) => <p key={i}>{line}</p>)
          : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Output;