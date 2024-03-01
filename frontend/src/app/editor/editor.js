'use client';
import React, { useRef, useState, useEffect } from 'react';
import React, { useRef, useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import Footer from './footer.js'
import { editor } from 'monaco-editor';

const Comment = (file, startLineNumber, startColumn, text) => {
    // TODO: backend logic to save comment

    return <div className="comment"> <h2>{file}</h2> </div>;
}

const Input = () => {
    return <input placeholder="Your input here" />;
  };

const EditorPage = ({ language, code, selection, onCodeChange}) => {
    const [startLineNumber, setStartLineNumber] = useState(0);
    const [startColumn, setStartColumn] = useState(0);
    const [endLineNumber, setEndLineNumber] = useState(0);
    const [endColumn, setEndColumn] = useState(0);
    const [commentList, setCommentList] = useState([]);

    const editorRef = useRef(null); // Create a reference to the editor instance

    setTimeout(
        function() {
            if (editorRef.current) {
                editorRef.current.onDidChangeCursorSelection((e) => {
                    const obj = JSON.parse(JSON.stringify(e));
                    const json = obj.selection;
                    setStartLineNumber(json.startLineNumber);
                    setStartColumn(json.startColumn);
                    setEndLineNumber(json.endLineNumber);
                    setEndColumn(json.endColumn);
                });
            }
        }, 2000);

    const handleEditorChange = (value, event) => {
        /* whenever text in the editor is updated */
    }

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        console.log("mounted");
    };

    const onAddCommentClick = (file, startLineNumber, startColumn, text) => {
        // setCommentList(commentList.concat(<Comment></Comment>));
        console.log("comment added");
    }
    return (
        <div className='editor-comments'>
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
                        curLine={startLineNumber}
                        curCol={startColumn}
                    />
                </div>
            </div>
            <div className="comment-container">
                <h2>Comments</h2>
                {((startColumn != endColumn) || (startLineNumber != endLineNumber)) && 
                    <button onClick={() => onAddCommentClick(
                                            // "temp.js",
                                            // startLineNumber,
                                            // startColumn,
                                            // "test comment"
                                        )}>Add Comment</button>
                }
                {commentList}
            </div>
        </div>
    );
};

export default EditorPage;