"use client";
import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Footer from "./footer.js";
import { auth, db } from "@/firebase-config";
import { collection, doc, addDoc, setDoc, deleteDoc } from "firebase/firestore";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

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
      <span onClick={() => handleCloseComment(commentID)}> ✖ </span> { }
    </div>
  );
};

const EditorPage = ({ language, code, theme, onCodeChange, canonicalLanguage }) => {
  const [startLineNumber, setStartLineNumber] = useState(0);
  const [startColumn, setStartColumn] = useState(0);
  const [endLineNumber, setEndLineNumber] = useState(0);
  const [endColumn, setEndColumn] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [roomName, setRoomName] = useState("default-room");
  const [isConnected, setIsConnected] = useState(false);
  const [isSuggestionsEnabled, setIsSuggestionsEnabled] = useState(true);
  const [currentSnippet, setCurrentSnippet] = useState('');

  const snippets = {
    javascript: [
      "console.log(${1:variable});",
      "function ${1:name}(${2:params}) {\n  ${0}\n}",
      "if (${1:condition}) {\n  ${0}\n}",
      "const ${1:name} = ${2:value};",
      "let ${1:name} = ${2:value};",
      "for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n  ${0}\n}",
      "array.forEach(element => {\n  ${0}\n});",
      "setTimeout(() => {\n  ${0}\n}, ${1:1000});",
      "if (${1:condition}) {\n  ${0}\n} else {\n  ${0}\n}",
      "try {\n  ${0}\n} catch (${1:error}) {\n  ${0}\n}",
      "class ${1:ClassName} {\n  constructor(${2:params}) {\n    ${0}\n  }\n}",
      "const ${1:name} = new ${2:Class}(${3:params});",
      "document.getElementById('${1:id}').addEventListener('${2:event}', event => {\n  ${0}\n});",
      "fetch('${1:url}')\n  .then(response => response.json())\n  .then(data => {\n    ${0}\n  });",
      "import ${1:module} from '${2:path}';",
      "export const ${1:name} = ${2:value};",
      "export default ${1:class};",
      "module.exports = ${1:name};",
      "require('${1:module}');",
      "switch (${1:expr}) {\n  case ${2:value}:\n    ${0}\n    break;\n  default:\n    ${0}\n}"
    ],
    python: [
      "print(${1:variable})",
      "def ${1:function_name}(${2:params}):\n    ${0}",
      "if ${1:condition}:\n    ${0}",
      "class ${1:ClassName}:\n    def __init__(self, ${2:params}):\n        ${0}",
      "import ${1:module}",
      "from ${1:module} import ${2:class}",
      "for ${1:var} in ${2:iterable}:\n    ${0}",
      "with open('${1:file}', 'r') as f:\n    ${0}",
      "try:\n    ${0}\nexcept ${1:Exception} as e:\n    ${0}",
      "if ${1:condition}:\n    ${0}\nelse:\n    ${0}",
      "@decorator\ndef ${1:function}(${2:params}):\n    ${0}",
      "lambda ${1:args}: ${0}",
      "list comprehension: [${1:expr} for ${2:var} in ${3:iterable}]",
      "dictionary comprehension: {${1:key}: ${2:value} for ${3:var} in ${4:iterable}}",
      "set comprehension: {${1:expr} for ${2:var} in ${3:iterable}}",
      "generator expression: (${1:expr} for ${2:var} in ${3:iterable})",
      "async def ${1:function}(${2:params}):\n    ${0}",
      "await ${1:function}(${2:params})",
      "yield ${1:expr}",
      "yield from ${1:iterable}"
    ],
    java: [
      "System.out.println(${1:variable});",
      "public static void ${1:methodName}(${2:params}) {\n    ${0}\n}",
      "if (${1:condition}) {\n    ${0}\n} else {\n    ${0}\n}",
      "for (int ${1:i} = 0; ${1:i} < ${2:condition}; ${1:i}++) {\n    ${0}\n}",
      "while (${1:condition}) {\n    ${0}\n}",
      "do {\n    ${0}\n} while (${1:condition});",
      "switch (${1:variable}) {\n    case ${2:case}:\n        ${0}\n        break;\n    default:\n        ${0}\n}",
      "try {\n    ${0}\n} catch (${1:Exception} e) {\n    ${0}\n}",
      "int[] ${1:array} = new int[]{${2:elements}};",
      "ArrayList<${1:Type}> ${2:listName} = new ArrayList<>();",
      "HashMap<${1:Key}, ${2:Value}> ${3:mapName} = new HashMap<>();",
      "String ${1:name} = \"${2:value}\";",
      "public class ${1:ClassName} {\n    ${0}\n}",
      "public enum ${1:EnumName} {\n    ${2:constants}\n}",
      "public interface ${1:InterfaceName} {\n    ${0}\n}",
      "import ${1:package};",
      "package ${1:name};",
      "return ${1:value};",
      "@Override\npublic ${1:methodType} ${2:methodName}(${3:params}) {\n    ${0}\n}",
      "public ${1:type} get${2:PropertyName}() {\n    return ${3:field};\n}",
      "public void set${1:PropertyName}(${2:type} ${3:param}) {\n    this.${4:field} = ${3:param};\n}"
    ]
  };

  function findRelevantSnippet(snippets, language, currentLine) {
    const languageSnippets = snippets[language] || snippets['python'];
    return languageSnippets.find(snippet => snippet.includes(currentLine)) || languageSnippets[0];
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape' && isSuggestionsEnabled && currentSnippet) {
        if (editorRef.current && window.monaco) {
          const editor = editorRef.current;
          const monaco = window.monaco;

          if (editor.hasTextFocus()) {  // Ensure the editor is focused and can get selection
            const selection = editor.getSelection();
            if (selection) {
              const range = new monaco.Range(
                selection.startLineNumber, 1,
                selection.startLineNumber, Number.MAX_VALUE
              );
              const id = { major: 1, minor: 1 };
              const text = currentSnippet;
              const op = { identifier: id, range: range, text: text, forceMoveMarkers: true };
              editor.executeEdits("my-source", [op]);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSnippet, isSuggestionsEnabled]);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const ydoc = useRef(new Y.Doc());
  const provider = useRef(null);
  const type = useRef(null);
  const binding = useRef(null);
  const sharedLanguage = useRef(new Y.Text("plaintext"));

  useEffect(() => {
    console.log(canonicalLanguage);
    // Initialize Yjs type
    type.current = ydoc.current.getText("monaco");
    sharedLanguage.current = ydoc.current.getText("language");

    sharedLanguage.current.observe(() => {
      const newLanguage = sharedLanguage.current.toString();
      if (window.monaco && editorRef.current) {
        window.monaco.editor.setModelLanguage(editorRef.current.getModel(), newLanguage);
      }
    });

    return () => {
      // Cleanup Yjs document and provider on component unmount
      binding.current?.destroy();
      provider.current?.disconnect();
      ydoc.current.destroy();
    };
  }, []);

  useEffect(() => {
    // Only update sharedLanguage if canonicalLanguage changes and it's not null
    if (canonicalLanguage) {
      sharedLanguage.current.delete(0, sharedLanguage.current.length);
      sharedLanguage.current.insert(0, canonicalLanguage);
    }
  }, [canonicalLanguage]);

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
    if (isSuggestionsEnabled) {
      const editor = editorRef.current;
      const model = editor.getModel();
      const position = editor.getPosition();
      const currentLine = model.getLineContent(position.lineNumber);
      const snippet = findRelevantSnippet(snippets, language, currentLine);
      setCurrentSnippet(snippet);
    }
  };

  const handleDownload = () => {
    const editor = editorRef.current;
    if (editor) {
      const editorContent = editor.getValue(); // Get the current content of the editor
      const blob = new Blob([editorContent], { type: "text/plain;charset=utf-8" });
      saveAs(blob, ""); // Trigger the download
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    window.monaco = monaco;
    if (!provider.current) {
      console.log("Provider is not initialized.");
      return;
    }
    if (!binding.current) {
      binding.current = new MonacoBinding(
        type.current,
        editor.getModel(),
        new Set([editor]),
        provider.current.awareness,
      );
    }
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: 'AI Suggestion',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: currentSnippet,
            detail: 'Insert AI-generated code snippet',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          }
        ];
        return { suggestions: suggestions };
      }
    });
  };

  const handleConnect = () => {
    if (provider.current) {
      provider.current.disconnect(); // Disconnect if connected
    }
    // Reinitialize the provider to the specified room
    provider.current = new WebsocketProvider(
      "ws://localhost:4000",
      roomName,
      ydoc.current,
    );
    provider.current.on("status", (event) => {
      if (event.status === "connected") {
        setIsConnected(true);
        if (canonicalLanguage) {
          // Ensure the language is updated on each connect
          sharedLanguage.current.delete(0, sharedLanguage.current.length);
          sharedLanguage.current.insert(0, canonicalLanguage);
        }

        // Initialize or reinitialize the binding
        if (editorRef.current) {
          binding.current?.destroy(); // Destroy previous binding if exists
          binding.current = new MonacoBinding(
            type.current,
            editorRef.current.getModel(),
            new Set([editorRef.current]),
            provider.current.awareness,
          );
        }
      } else if (event.status === "disconnected") {
        setIsConnected(false);
      }
    });

    // Attempt to connect
    provider.current.connect();
  };

  const handleDisconnect = () => {
    provider.current?.disconnect();
    setIsConnected(false);
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

  useEffect(() => { // update's theme on every render
    if (auth.currentUser) {
      const docRef = doc(db, "user_settings", auth.currentUser.uid);
      setDoc(docRef, {
        theme: theme,
      });
    }
  }, [theme]);

  return (
    <div className="editor-comments">
      <div className="editor-container">
        <div
          className="session-controls"
          style={{ padding: "10px", textAlign: "center" }}
        >
        <button onClick={handleDownload}
        style={{
          padding: "8px 15px",
          marginRight: "70px",
          cursor: "pointer",
          backgroundColor: "grey",
          color: "white",
          border: "none",
        }}
        >Download</button>
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            disabled={isConnected}
            style={{ marginRight: "10px", padding: "8px" }}
          />
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              style={{
                padding: "8px 15px",
                marginRight: "70px",
                cursor: "pointer",
                backgroundColor: "red",
                color: "white",
                border: "none",
              }}
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              style={{
                padding: "8px 15px",
                marginRight: "70px",
                cursor: "pointer",
                backgroundColor: "green",
                color: "white",
                border: "none",
              }}
            >
              Connect
            </button>
          )}
          <label>
            <input
              type="checkbox"
              checked={isSuggestionsEnabled}
              onChange={() => setIsSuggestionsEnabled(!isSuggestionsEnabled)}
            /> Enable Suggestions
          </label>
        </div>

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
