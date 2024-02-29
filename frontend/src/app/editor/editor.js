'use client';
import React, { useRef, useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import Footer from './footer.js'
import { editor } from 'monaco-editor';


const EditorPage = ({ language, code, onCodeChange }) => {
    const [line, setLine] = useState(0);
    const [col, setCol] = useState(0);

    const updateLineAndCol = (newLine, newCol) => {
        // Update state variables
        setLine(newLine);
        setCol(newCol);
    };

    const editorRef = useRef(null); // Create a reference to the editor instance

    if (editorRef.current) {
        console.log("here");
        editorRef.current.onDidChangeCursorSelection((e) => {
            console.log(JSON.stringify(e));
            const obj = JSON.parse(JSON.stringify(e));
            const selection = obj.selection;
            setLine(selection.startLineNumber);
            setCol(selection.startColumn);
        });
    }
    
    const handleEditorChange = (value, event) => {
        console.log("updated:", value);
        console.log(editorRef.current.getPosition());
    }

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        console.log({editor});
    };

    return (
        <div className="editor-container">
            <div className="container6">
                <Editor
                    height="90vh"
                    width="100%"
                    options={{
                        automaticLayout: true,
                        fontSize: 13,
                    }}
                    language={language}
                    theme="vs-dark"
                    value={code} // Managed by parent component
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                />
            </div>
            <div className='footer'>
                <Footer
                    curLine={line}
                    curCol={col}
                />
            </div>
        </div>
    );
};

export default EditorPage;