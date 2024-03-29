"use client";
import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Footer from "./footer.js";
import { auth, db } from "@/firebase-config";
import { collection, doc, addDoc, setDoc, deleteDoc } from "firebase/firestore";
import { editor } from "monaco-editor";
import { milliseconds } from "date-fns";

const Comment = ({
  file,
  startLineNumber,
  startColumn,
  text,
  collaborators,
  commentID,
  handleCloseComment,
}) => {
  // console.log("making new comment", commentID);
  return (
    <div className="comment">
      <p>
        {file} @ Ln: {startLineNumber} Col: {startColumn} <br></br>
        <h3>Comment</h3>
        <p>{text}</p>
        <h3>Collaborators</h3>
        <p>{collaborators}</p>
      </p>
      <span onClick={() => handleCloseComment(commentID)}> ✖ </span> {}
    </div>
  );
};

const EditorPage = ({ language, code, theme, currentFile, onCodeChange }) => {
  const [startLineNumber, setStartLineNumber] = useState(0);
  const [startColumn, setStartColumn] = useState(0);
  const [endLineNumber, setEndLineNumber] = useState(0);
  const [endColumn, setEndColumn] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [collaborators, setCollaborators] = useState("");

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  setTimeout(function () {
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
    onCodeChange(value);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    console.log("mounted");
  };

  const onAddCommentClick = (
    file,
    startLineNumber,
    startColumn,
    endLineNumber,
    endColumn,
    collaborators,
  ) => {
    const docRef = addDoc(collection(db, "comments"), {
      author: auth.currentUser.uid, // must be signed in
      file: file,
      startLineNumber: startLineNumber,
      startColumn: startColumn,
      endLineNumber: endLineNumber,
      endColumn: endColumn,
      collaborators: collaborators,
      text: commentText,
    });

    const newComment = (
      <Comment
        file={file}
        startLineNumber={startLineNumber}
        startColumn={startColumn}
        text={commentText}
        collaborators={collaborators}
        commentID={docRef.id}
        handleCloseComment={handleCloseComment}
      />
    );

    setCommentList([...commentList, newComment]);
  };

  const handleCloseComment = (commentID) => {
    // deleteDoc(doc(firestore, "comments", commentID));
    const newCommentList = commentList.filter((name) => name !== commentID);
    setCommentList(newCommentList);
  };

  useEffect(() => {
    // update's theme on every render
    if (auth.currentUser) {
      console.log(auth.currentUser.uid, theme);
      const docRef = doc(db, "user_settings", auth.currentUser.uid);
      setDoc(docRef, {
        theme: theme,
      });
    }
  }, [theme]);

  return (
    <div className="editor-comments">
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
            theme={theme}
            value={code} // Managed by parent component
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
          />
        </div>
        <div className="footer">
          <Footer curLine={startLineNumber} curCol={startColumn} />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
