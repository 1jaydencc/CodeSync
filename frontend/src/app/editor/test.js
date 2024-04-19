import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Footer from "./footer.js";
import { auth, db } from "@/firebase-config";
import { collection, addDoc, setDoc } from "firebase/firestore";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

const EditorPage = ({ language, code, theme, currentFile, onCodeChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [roomName, setRoomName] = useState("default-room");
  const editorRef = useRef(null);
  const provider = useRef(null);
  const ydoc = useRef(new Y.Doc());

  useEffect(() => {
    provider.current = new WebsocketProvider(
      "wss://demos.yjs.dev", roomName, ydoc.current
    );

    const awareness = provider.current.awareness;

    awareness.setLocalStateField('user', {
      name: auth.currentUser?.displayName || 'Anonymous',
      color: 'blue',  // Color can be dynamic or user-specific
      language,  // Share the language setting across users
    });

    const type = ydoc.current.getText("monaco");
    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.current.awareness
    );

    return () => {
      binding.destroy();
      provider.current.disconnect();
      ydoc.current.destroy();
    };
  }, [roomName, language]);  // Reacting on language change

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    window.monaco = monaco;
    if (provider.current) {
      provider.current.awareness.on('change', (changes, origin) => {
        // When a user's language setting changes, apply it immediately
        const states = provider.current.awareness.getStates();
        states.forEach((state, clientId) => {
          if (state.user && state.user.language) {
            monaco.editor.setModelLanguage(editor.getModel(), state.user.language);
          }
        });
      });
    }
  };

  return (
    <div className="editor-comments">
      <div className="editor-container">
        <Editor
          height="90vh"
          width="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorDidMount}
          options={{
            automaticLayout: true,
            fontSize: 13,
          }}
        />
        <Footer />
      </div>
    </div>
  );
};

export default EditorPage;
