import React from 'react';
import Editor from "@monaco-editor/react";

const EditorPage = ({ language, code, onCodeChange }) => {

    const handleEditorDidMount = (editor, monaco) => {
        editor.focus();
    };

    return (
        <Editor
            height="100vh"
            width="100%"
            options={{
                automaticLayout: true,
                fontSize: 13,
            }}
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

