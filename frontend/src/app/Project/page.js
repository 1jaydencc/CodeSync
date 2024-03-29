"use client";
import React, { useRef, useState } from "react";
import LanguageSelector from "./language";
import { CODE_SNIPPETS } from "./constants";
import Output from "./output";
import { Editor } from "@monaco-editor/react";
import "@/app/globals.css";
import "@/app/Project/Project.css"

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [fileName, setFileName] = useState("");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onFileNameChange = (e) => {
    const newFileName = e.target.value;
    setFileName(newFileName);
    // Determine language based on file extension
    const extension = newFileName.split('.').pop();
    switch (extension) {
      case 'py':
        setLanguage('python');
        setValue(CODE_SNIPPETS['python']);
        break;
      case 'js':
        setLanguage('javascript');
        setValue(CODE_SNIPPETS['javascript']);
        break;
      // Add cases for other file extensions as needed
      default:
        setLanguage('');
        setValue('');
        break;
    }
  };

  const handleInvite = () => {

  };


  return (
    <div>
        <label htmlFor="file-name">File Name:</label>
        <input
          type="text"
          id="file-name"
          value={fileName}
          onChange={onFileNameChange}
          placeholder="Enter file name with extension"
        />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
      
        <div style={{ width: "50%", height: "100%" }}>
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="75vh"
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </div>
        <Output editorRef={editorRef} language={language} />
      </div>
      <button onClick={handleInvite}>Invite</button>
    </div>
  );
};

export default CodeEditor;
