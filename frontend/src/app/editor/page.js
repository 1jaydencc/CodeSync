// @/app/editor/editor.js
"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import TitleBar from "@/app/title-bar/title-bar.js";

import NewFilePopup from "@/app/editor/new-file-popup.js";
import Dropdown from "./themeDropDown.js";
import themelist from "monaco-themes/themes/themelist.json";
import "@/app/editor/editor.css";
import languages from "@/app/editor/languages.json";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase-config";
import Image from "next/image";
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { add, set } from "date-fns";

const Editor = dynamic(() => import("@/app/editor/editor.js"), {
  ssr: false,
});

const App = () => {
  const [language, setLanguage] = useState("javascript");
  const [editorCode, setEditorCode] = useState("");
  const [files, setFiles] = useState([]);
  const [currentFileName, setCurrentFileName] = useState("");
  const [currentFilePath, setCurrentFilePath] = useState("");
  //const [isPopupOpen, setIsPopupOpen] = useState(false);
  //const [isSaving, setIsSaving] = useState(false);
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const [openFiles, setOpenFiles] = useState([]); // Each item: { path, content, language, fileName }
  const [activeFileIndex, setActiveFileIndex] = useState(-1); // Index of the currently active file in openFiles
  const activeFile = openFiles[activeFileIndex];

  const [activeFileIndexB, setActiveFileIndexB] = useState(-1); // Index of the currently active file in openFiles
  const activeFileB = openFiles[activeFileIndexB];

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const [dropdownVisible, setDropdownVisible] = useState(true);
  const [theme, setTheme] = useState("vs-dark");
  const [electronAPI, setElectronAPI] = useState(null);
  const [canonicalLanguage, setCanonicalLanguage] = useState(null);

  const [splitScreen, setSplitScreen] = useState(false);
  const [activeEditor, setActiveEditor] = useState(0);  // 0 for first, 1 for second

  useEffect(() => {
    // Assign window.electronAPI to the state variable after the component mounts
    if (typeof window !== "undefined") {
      setElectronAPI(window.electronAPI);
    }
  }, []);

  const handleDownloadCurrentFile = (index) => {
    if (index >= 0 && index < openFiles.length) {
      const file = openFiles[index];
      const zip = new JSZip();
      zip.file(file.fileName, file.content);
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, file.fileName);
      });
    }
  };

  const handleDownloadButtonClick = () => {
    // Assuming you have a state variable to track the index of the active file
    handleDownloadCurrentFile(activeFileIndex);
  };

  // In your useEffect within the React component
  useEffect(() => {
    if (!electronAPI) return;
    const handleFileOpen = (event, { path, content }) => {
      console.log("File opened in renderer:", path);

      if (openFiles.some((file) => file.path === path)) {
        return;
      }

      const fileName = path.split("/").pop();
      const extension = fileName.split(".").pop();
      const languageObj = languages.find(
        (lang) => lang.extension === `.${extension}`,
      );

      const language = languageObj ? languageObj.language : "plaintext";
      console.log("Setting canonical language to:", language);
      setCanonicalLanguage(language);

      const newFile = { path, content, language, fileName };

      setOpenFiles([...openFiles, newFile]);
      setActiveFileIndex(openFiles.length);
    };

    // Listen for the "file-opened" event
    electronAPI.receive("file-opened", handleFileOpen);

    // Cleanup
    return () => { };
  });

  useEffect(() => {
    if (!electronAPI) return;
    const saveCurrentFile = () => {
      if (activeFileIndex >= 0) {
        const fileToSave = openFiles[activeFileIndex];
        console.log("Saving content to file:", fileToSave.content);
        electronAPI
          .saveFile({
            path: fileToSave.path,
            content: fileToSave.content,
          })
          .then(() => console.log("File saved successfully"))
          .catch((err) => console.error("Failed to save file:", err));
      }
      if (activeFileIndexB >= 0) {
        const fileToSave = openFiles[activeFileIndexB];
        console.log("Saving content to file B:", fileToSave.content);
        electronAPI
          .saveFile({
            path: fileToSave.path,
            content: fileToSave.content,
          })
          .then(() => console.log("File B saved successfully"))
          .catch((err) => console.error("Failed B to save file:", err));
      }
    };

    const cleanup = electronAPI.receive("invoke-save", saveCurrentFile);

    return () => cleanup(); // Explicitly remove the listener on component unmount
  }, [activeFileIndex, activeFileIndexB, openFiles]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".user-profile")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const handleSignOut = async () => {
    try {
      router.push("/");
      signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  /*const handleDownloadAllFiles = () => {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.name, file.content);
    });
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "project.zip");
    });
  };
  */

  const getLanguageFromFileName = (fileName) => {
    const extension = fileName.split(".").pop();
    const languageObj = languages.find(
      (lang) => lang.extension === `.${extension}`,
    );
    return languageObj ? languageObj.language : "plaintext";
  };

  const handleFileSelect = (index) => { // left explorer bar
    if (activeEditor === 0) {
      setActiveFileIndex(index);
    } else {
      setActiveFileIndexB(index);
    }
    console.log(activeEditor, activeFileIndex, activeFileIndexB);
  };

  const handleCloseTab = (index) => {
    const newOpenFiles = openFiles.filter((_, i) => i !== index);
    setOpenFiles(newOpenFiles);
    // Adjust the active file index as needed
    if (activeFileIndex === index) {
      setActiveFileIndex(
        newOpenFiles.length ? Math.min(index, newOpenFiles.length - 1) : -1,
      );
    }
    if (activeFileIndexB === index) {
      setActiveFileIndexB(
        newOpenFiles.length ? Math.min(index, newOpenFiles.length - 1) : -1,
      );
    }
  };

  useEffect(() => {
    let timeoutId = null;
    let unsubscribe = null;

    const authUnsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set a timeout only if the user is signed in
        timeoutId = setTimeout(() => {
          unsubscribe = onSnapshot(
            doc(db, "user_settings", user.uid),
            (doc) => {
              const userTheme = doc.data()?.theme;
              switch (userTheme) {
                case "vs-light":
                  setTheme("vs-light");
                  break;
                case "vs-dark":
                  setTheme("vs-dark");
                  break;
                case "hc-black":
                  setTheme("hc-black");
                  break;
                case "hc-light":
                  setTheme("hc-light");
                  break;
                default:
                  setTheme("vs-dark");
              }
            },
          );
        }, 2000);
      }
    });

    // Cleanup function
    return () => {
      authUnsub(); // Unsubscribe from auth state changes
      if (unsubscribe) unsubscribe(); // Unsubscribe from Firestore listener
      clearTimeout(timeoutId); // Clear the timeout
    };
  }, []);

  const handleThemeChange = (e) => {
    const selectedOption = e.target.value;
    if (selectedOption === "vs-light") {
      setTheme("vs-light");
    } else if (selectedOption === "vs-dark") {
      setTheme("vs-dark");
    } else if (selectedOption === "hc-black") {
      setTheme("hc-black");
    } else if (selectedOption === "hc-light") {
      setTheme("hc-light");
    }
  };

  // ADDING
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCodeSnippets, setShowCodeSnippets] = useState(false);
  const [showSelectedCodeSnippet, setShowSelectedCodeSnippet] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [friends, setFriends] = useState();
  const [user, setUser] = useState({});

  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedCodeSnippet, setSelectedCodeSnippet] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAddCodeSnippet, setShowAddCodeSnippet] = useState(false);

  const [hoveredNotification, setHoveredNotification] = useState(null);
  const [hoverTimeoutId, setHoverTimeoutId] = useState(null);

  const handleClearCurrentNotification = () => {
    setNotifications(
      notifications.filter((n) => n.id !== selectedNotification.id),
    );
    setSelectedNotification(null);
  };

  const handleNotificationMouseEnter = (notificationId) => {
    const timeoutId = setTimeout(() => {
      const notification = notifications.find((n) => n.id === notificationId);
      setHoveredNotification(notification);
    }, 1000);
    setHoverTimeoutId(timeoutId);
  };

  const handleCodeSnippetMouseEnter = (csId) => {
    setSelectedCodeSnippet(codeSnippets.find((n) => n.id === csId));
  };

  const handleNotificationMouseLeave = () => {
    clearTimeout(hoverTimeoutId);
    setHoverTimeoutId(null);
    setHoveredNotification(null);
  };

  const handleNotificationClick = (notificationId) => {
    setSelectedNotification(notifications.find((n) => n.id === notificationId));
    setNotifications(
      notifications.map((n) => {
        if (n.id === notificationId) {
          return { ...n, isRead: true };
        }
        return n;
      }),
    );
  };

  const toggleNotifications = () => {
    console.log("toggled");
    setShowNotifications(!showNotifications);
  };

  /* CODE SNIPPETS */

  const [codeSnippetName, setCodeSnippetName] = useState("");
  const [codeSnippetText, setCodeSnippetText] = useState("");

  const toggleCodeSnippets = () => {
    console.log("toggled");
    setShowCodeSnippets(!showCodeSnippets);
  };

  const handleCodeSnippetClick = (codeSnippetId) => {
    setShowSelectedCodeSnippet(codeSnippets.find((n) => n.id === codeSnippetId));
  };

  const toggleAddCodeSnippet = () => {
    setShowAddCodeSnippet(true);
  }
  const toggleShowSelectedCodeSnippet = () => {
    setShowSelectedCodeSnippet(true);
  }
  const handleUpdateCodeSnippet = (e) => {
    setSelectedCodeSnippet({ ...selectedCodeSnippet, text: e.target.value });
  }

  const onAddCodeSnippetClick = async (
    name,
    text
  ) => {
    await setDoc(doc(db, "codesnippets", name), {
      author: auth.currentUser.email, // must be signed in
      name: name,
      text: text,
    });
  };

  const onDeleteCodeSnippetClick = async (
    name
  ) => {
    const docRef = await doc(db, "codesnippets", name);
    await deleteDoc(docRef);
  };

  const onUpdateCodeSnippetClick = async (
    name,
    text
  ) => {
    const docRef = doc(db, "codesnippets", name);
    await setDoc(docRef, {
      author: auth.currentUser.email, // must be signed in
      name: name,
      text: text,
    });
  };

  const toggleFriends = () => {
    console.log("toggled friends", friends);
    setShowFriends(!showFriends);
  };

  const toggleSplitScreen = () => {
    console.log("toggled splitscreen");
    setSplitScreen(!splitScreen);
  };

  const handleClosePopup = () => {
    setShowAddCodeSnippet(null);
    setSelectedNotification(null);
    setShowSelectedCodeSnippet(null);
  };

  const handleNewProject = () => {
    router.push("/Project");
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  useEffect(() => { // get notifications
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        // Now that we're sure we have a user, set the email in state

        setCurrentUserEmail(user.email);

        const q = query(
          collection(db, "notifications"),
          where("recipients", "array-contains", user.email),
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const notifications = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifications(notifications);
        });

        return unsubscribe;
      } else {
        // Handle case when user is logged out if necessary
        console.log("No user logged in");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => { // get code snippest
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Now that we're sure we have a user, set the email in state

        setCurrentUserEmail(user.email);

        const q = query(
          collection(db, "codesnippets")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const cs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCodeSnippets(cs);
        });

        return unsubscribe;
      } else {
        // Handle case when user is logged out if necessary
        console.log("No user logged in");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Now that we're sure we have a user, set the email in state

        setCurrentUserEmail(user.email);

        const q = query(
          collection(db, "emails"),
          where("email", "==", user.email),
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const userA = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUser(userA);
          //setFriends(userA[0].friends);
        });

        return unsubscribe;
      } else {
        // Handle case when user is logged out if necessary
        console.log("No user logged in");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="app">
      <TitleBar />
      <div className="container0">
        <div className="container1"></div>
        <div className="container2">
          <div className="container3">
            <div className="container7">EXPLORER</div>
            <div className="container8">
              {openFiles.map((file, index) => (
                <div
                  key={file.path}
                  className="file-item"
                  onClick={() => handleFileSelect(index)}
                >
                  {file.fileName}
                </div>
              ))}
            </div>
            <div className="user-profile">
              <Image
                src={auth.currentUser?.photoURL || faUser}
                alt="Profile"
                onClick={() => setShowDropdown(!showDropdown)}
                width={30}
                height={30}
                style={{
                  cursor: "pointer",
                  borderRadius: "50%",
                  marginRight: "0px",
                }}
                draggable="false"
              />
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={handleSignOut}>
                    Sign Out
                  </div>
                  <div className="dropdown-item">Settings</div>
                </div>
              )}
            </div>
          </div>
          {/* File Tabs Bar */}
          <div className="container4">
            <div className="container5">
              {openFiles.map((file, index) => (
                <div
                  key={file.path}
                  className={`tab-item ${index === activeFileIndex ? "active" : ""}`}
                  onClick={() => handleFileSelect(index)}
                >
                  {file.fileName}
                  <span
                    className="close-tab"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTab(index);
                    }}
                  >
                    {" "}
                    ✖{" "}
                  </span>
                </div>
              ))}
            </div>
            {/* File Path Display */}
            <div className="file-path-display">
              {activeFileIndex >= 0
                ? openFiles[activeFileIndex].path
                : "No file selected"}
            </div>
            <div className="editor-container-wrap">
              <div className="editor-container">
                <Editor
                  language={
                    activeFileIndex >= 0
                      ? openFiles[activeFileIndex].language
                      : "plaintext"
                  }
                  code={
                    activeFileIndex >= 0
                      ? openFiles[activeFileIndex].content
                      : ""
                  }
                  theme={theme}
                  onCodeChange={(newContent) => {
                    setActiveEditor(0);
                    console.log(newContent);
                    if (activeFileIndex >= 0) {
                      openFiles[activeFileIndex].content = newContent;
                      console.log(openFiles[activeFileIndex].content);
                    }
                  }}
                  onClick={(e) => { console.log("clicked first") }}
                  canonicalLanguage={canonicalLanguage}
                />
              </div>
              {splitScreen && (
                <div className="editor-container">
                  <Editor
                    language={
                      activeFileIndexB >= 0
                        ? openFiles[activeFileIndexB].language
                        : "plaintext"
                    }
                    code={
                      activeFileIndexB >= 0
                        ? openFiles[activeFileIndexB].content
                        : ""
                    }
                    theme={theme}
                    onCodeChange={(newContent) => {
                      setActiveEditor(1);
                      console.log(newContent);
                      if (activeFileIndexB >= 0) {
                        openFiles[activeFileIndexB].content = newContent;
                        console.log(openFiles[activeFileIndexB].content);
                      }
                    }}
                    canonicalLanguage={canonicalLanguage}
                  />
                </div>
              )}
            </div>
            <div className="bottom-bar">
              <button /* ----------------------- CHAT ----------------------- */
                className="btn btn-neutral btn-xs"
                onClick={() => {
                  router.push("/chat");
                }}
              >
                Chat
              </button>

              <button /* ----------------------- NEW PROJECT ----------------------- */
                className="btn btn-neutral btn-xs"
                onClick={() => {
                  router.push("/calendar");
                }}
              >
                Calendar
              </button>

              <button /* ----------------------- FRIENDS ----------------------- */
                className="btn btn-neutral btn-xs"
                onClick={handleDownloadButtonClick}
              >
                Download
              </button>

              <button /* ----------------------- FRIENDS ----------------------- */
                className="btn btn-neutral btn-xs"
                onClick={toggleFriends}
              >
                Friends
              </button> 

              <button /* ----------------------- KANBAN ----------------------- */
                className="btn btn-neutral btn-xs"
                onClick={() => {
                  router.push("/kanban");
                }}
              >
                Kanban Board
              </button>

              <button /* ----------------------- KANBAN ----------------------- */
                className="btn btn-neutral btn-xs"
                onClick={() => {
                  router.push("/Whiteboard");
                }}
              >
                Whiteboard
              </button>

              <button /* ----------------------- CODE SNIPPETS ----------------------- */
                className="btn btn-neutral btn-xs"
                onClick={toggleCodeSnippets}
              >
                Code Snippets
              </button>
              {showCodeSnippets && (
                <div className="notifications-area">
                  Code Snippets
                  <span                                       /* TODO: ADD A CODE SNIPPET */
                    className="close-tab"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAddCodeSnippet();
                      /* handleCloseTab(index); */
                    }}
                  >
                    {" "}
                    ➕Add{" "}
                  </span>
                  {codeSnippets.map((cs) => (
                    <div
                      key={cs.id}
                      // className={`notification-item ${notification.isRead ? "read" : "unread"}`}
                      onClick={() => handleCodeSnippetClick(cs.id)}
                      onMouseEnter={() => {
                        handleCodeSnippetMouseEnter(cs.id);
                      }}
                    >
                      <span className="notification-description">
                        <strong>{cs.name.slice(0, 15)}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {showAddCodeSnippet && ( /*  ADD A CODESNIPPET  */
                <div className="popup-overlay" onClick={handleClosePopup}>
                  <div className="popup" onClick={(e) => e.stopPropagation()}>
                    {" "}
                    {/* Prevent popup from closing when clicking inside */}
                    <input
                      type="text"
                      placeholder="name"
                      onChange={(e) => setCodeSnippetName(e.target.value)}
                    />
                    <textarea
                      className="code-snippet-text-input"
                      type="text"
                      placeholder="text"
                      onChange={(e) => setCodeSnippetText(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        onAddCodeSnippetClick(codeSnippetName, codeSnippetText);
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {showSelectedCodeSnippet && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                  <div className="popup" onClick={(e) => e.stopPropagation()}>
                    {" "}
                    {/* Prevent popup from closing when clicking inside */}
                    <p>
                      <strong>{selectedCodeSnippet.name}</strong>{" "}
                    </p>
                    <textarea
                      className="code-snippet-text-input"
                      type="text"
                      placeholder="text"
                      onChange={(e) => handleUpdateCodeSnippet(e)}
                    >
                      {selectedCodeSnippet.text}
                    </textarea>
                    <div className="button-wrapper">
                      <button
                        onClick={() => {
                          onDeleteCodeSnippetClick(selectedCodeSnippet.name);
                        }}>
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          onUpdateCodeSnippetClick(selectedCodeSnippet.name, selectedCodeSnippet.text);
                        }}>
                        Update
                      </button>
                      <button
                        onClick={() => { navigator.clipboard.writeText(selectedCodeSnippet.text) }}>
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button /* ----------------------- NOTIFICATIONS ----------------------- */
                className="btn btn-neutral btn-xs"
                onClick={toggleNotifications}
              >
                Notifications
              </button>
              {showNotifications && (
                <div className="notifications-area">
                  Notifications
                  <button
                    className="clear-notifications"
                    onClick={handleClearNotifications}
                  >
                    Clear
                  </button>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.isRead ? "read" : "unread"}`}
                      onClick={() => handleNotificationClick(notification.id)}
                      onMouseEnter={() =>
                        handleNotificationMouseEnter(notification.id)
                      }
                      onMouseLeave={handleNotificationMouseLeave}
                    >
                      <span className="notification-description">
                        {notification.description.slice(0, 15)}...
                      </span>
                      <span className="notification-timestamp">
                        {new Date(notification.timestamp).toLocaleString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          },
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {selectedNotification && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                  <div className="popup" onClick={(e) => e.stopPropagation()}>
                    {" "}
                    {/* Prevent popup from closing when clicking inside */}
                    <p>
                      <strong>Time:</strong>{" "}
                      {new Date(selectedNotification.timestamp).toLocaleString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        },
                      )}
                    </p>
                    <p>
                      <strong>Message:</strong>{" "}
                      {selectedNotification.description}
                    </p>
                    <button
                      onClick={handleClearCurrentNotification}
                      className="clear-current-notification"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
              {showConfirmation && (
                <div className="confirmation-message">
                  Notifications cleared
                </div>
              )}
              {hoveredNotification && (
                <div
                  className="hover-popup"
                  style={{ position: "absolute", top: "40px", left: "1430px" }}
                >
                  <p>{hoveredNotification.description}</p>
                  <p className="notification-timestamp">
                    {hoveredNotification.timestamp}
                  </p>
                </div>
              )}

              <button
                className="btn btn-neutral btn-xs"
                onClick={() => {
                  toggleSplitScreen();
                  console.log(splitScreen)
                }}
              >
                Toggle Split Screen
              </button>

              <div className="flex items-center">
                <label htmlFor="theme-selection" className="mr-2">
                  Theme:
                </label>
                <select
                  id="theme-selection"
                  className="select select-bordered select-xs"
                  value={theme}
                  onChange={handleThemeChange}
                >
                  <option value="vs-light">vs-light</option>
                  <option value="vs-dark">vs-dark</option>
                  <option value="hc-black">hc-black</option>
                  <option value="hc-light">hc-light</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
