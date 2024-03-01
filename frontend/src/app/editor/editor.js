'use client';
import React, { useRef, useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import Footer from './footer.js'
import { getDatabase, ref, set } from "firebase/database";

function writeUserData(userId, name, email, imageUrl) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}


const EditorPage = ({ language, code, selection, onCodeChange}) => {
    const [startLineNumber, setStartLineNumber] = useState(0);
    const [startColumn, setStartColumn] = useState(0);
    const [endLineNumber, setEndLineNumber] = useState(0);
    const [endColumn, setEndColumn] = useState(0);
    const [commentList, setCommentList] = useState([]);

    const editorRef = useRef(null); // Create a reference to the editor instance

    const Comment = (file, startLineNumber, startColumn, text, commentID) => {
        // TODO: backend logic to save comment
        return  (
            <div className="comment">
                <p>{file} @ Ln: {startLineNumber} Col: {startColumn} <br></br>
                <input type="comment"/>
                </p>
                <span onClick={() => handleCloseComment(commentID)}> ✖ </span> {}
            </div>
        );
    }
    
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

    const onAddCommentClick = (file, startLineNumber, startColumn, text, commentID) => {
        setCommentList([...commentList, Comment(file, startLineNumber, startColumn, text, commentID)]);
    }

    const handleCloseComment = (commentID) => {
        const newCommentList = commentList.filter(name => name !== commentID);
        setCommentList(newCommentList);
    };
    
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
                                            "temp.js",
                                            startLineNumber,
                                            startColumn,
                                            "test comment",
                                            commentList.length
                                        )}>Add Comment</button>
                }
                {commentList.map(commentID => (
                                <div key={commentID} className='comment-item'>
                                    {commentID}
                                </div>
                            ))}
            </div>
        </div>
    );
};

export default EditorPage;