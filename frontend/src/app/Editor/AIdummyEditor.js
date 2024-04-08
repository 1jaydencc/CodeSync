import React, { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { fetchSuggestions } from "./aiCodeCompletionAPI";

const CodeEditor = () => {
  const editorRef = useRef();
  const [code, setCode] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleFetchSuggestions = async () => {
    const currentCode = editorRef.current.getValue();
    const fetchedSuggestions = await fetchSuggestions(currentCode);
    setSuggestions(fetchedSuggestions);
    setShowSuggestions(true);
  };

  return (
    <div>
      <Editor
        height="75vh"
        theme="vs-dark"
        language="javascript"
        defaultValue=""
        onMount={onMount}
        onChange={(newValue) => setCode(newValue)}
      />
      <button onClick={handleFetchSuggestions}>Get Suggestions</button>
      {showSuggestions && (
        <div style={{ position: "absolute", top: "100px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h4>Suggestions</h4>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
          <button onClick={() => setShowSuggestions(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default AIdummyEditor;
