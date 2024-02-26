import React from 'react';
import Editor from "@monaco-editor/react";

const EditorPage = ({ language, code, onCodeChange }) => {

    const handleEditorDidMount = (editor, monaco) => {
        editor.focus();
    };

    return (
        <Editor
            height="1000px"
            width="1000px"
            language={language}
            theme="vs-dark"
            value={code} // Managed by parent component
            onChange={(newValue, event) => {
              onCodeChange(newValue);
            }}
            onMount={handleEditorDidMount}
        />
    );
};

export default EditorPage;

