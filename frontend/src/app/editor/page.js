"use client";
import React, { useState, useEffect } from "react";
import Editor from "@/app/editor/editor.js";
import TitleBar from "@/app/title-bar/title-bar.js";

import NewFilePopup from "@/app/editor/new-file-popup.js";
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
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase-config";

const { electronAPI } = window;

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

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const [dropdownVisible, setDropdownVisible] = useState(true);
  const [theme, setTheme] = useState("vs-dark");

  // In your useEffect within the React component
  useEffect(() => {
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

      const newFile = { path, content, language, fileName };

      setOpenFiles([...openFiles, newFile]);
      setActiveFileIndex(openFiles.length);
    };

    // Listen for the "file-opened" event
    electronAPI.receive("file-opened", handleFileOpen);

    // Cleanup
    return () => {};
  });

  useEffect(() => {
    const saveCurrentFile = () => {
      if (activeFileIndex >= 0) {
        const fileToSave = openFiles[activeFileIndex];
        electronAPI
          .saveFile({
            path: fileToSave.path,
            content: fileToSave.content,
          })
          .then(() => console.log("File saved successfully"))
          .catch((err) => console.error("Failed to save file:", err));
      }
    };

    electronAPI.receive("invoke-save", saveCurrentFile);

    return () => {
      // Cleanup if necessary, e.g., remove the event listener
    };
  }, [activeFileIndex, openFiles]);

  /*
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed. Current user:", user);
      if (user) {
        // User is signed in, now fetch files
        const fetchFiles = async () => {
          console.log("Fetching files for user:", user.uid);
          const q = query(
            collection(db, "files"),
            where("uid", "==", user.uid),
          );
          try {
            const querySnapshot = await getDocs(q);
            console.log(`Fetched ${querySnapshot.docs.length} files`);
            const fetchedFiles = querySnapshot.docs.map((doc) => ({
              name: doc.id,
              ...doc.data(),
            }));
            console.log("Fetched files:", fetchedFiles);
            setFiles(fetchedFiles);
          } catch (error) {
            console.error("Error fetching files:", error);
          }
        };
        fetchFiles();
      } else {
        // User is signed out
        console.log("User is signed out.");
        // Handle sign out scenario
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

   */

  /*
  // Function to save file data online
  const saveOnline = async (fileData) => {
    const fileRef = doc(db, "files", currentFileName);
    try {
      await setDoc(fileRef, fileData, { merge: true });
      console.log("File saved successfully online.");
      // Optionally, remove from local storage after successful sync
    } catch (error) {
      console.error("Error saving file to Firestore:", error);
    }
  };


  // Function to save file data offline
  const saveOffline = (fileData) => {
    localStorage.setItem(currentFileName, JSON.stringify(fileData));
    console.log("File saved locally for offline use.");
  };

  const handleOnline = () => {
    console.log("Back online, syncing local changes...");
    // Loop through all locally stored files and sync them
    Object.keys(localStorage).forEach(async (key) => {
      const fileData = JSON.parse(localStorage.getItem(key));
      await saveOnline(fileData);
      localStorage.removeItem(key); // Remove from local storage after sync
    });
  };


  useEffect(() => {
    window.addEventListener("online", handleOnline);

    // Cleanup on component unmount
    return () => window.removeEventListener("online", handleOnline);
  }, [handleOnline]); // Add dependencies as needed

  useEffect(() => {
    const handleAutoSave = () => {
      if (!currentFileName) return;
      handleSaveFile();
    };
    const debounceSave = setTimeout(handleAutoSave, 1000);
    return () => clearTimeout(debounceSave);
  }, [currentFileName]);

   */

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

  const handleFileSelect = (index) => {
    setActiveFileIndex(index);
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
              <FontAwesomeIcon
                icon={faUser}
                onClick={toggleDropdown}
                className="user-icon"
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
                    if (activeFileIndex >= 0) {
                      // Only update the content of the currently active file if there is one selected
                      const updatedFiles = openFiles.map((file, index) =>
                        index === activeFileIndex
                          ? { ...file, content: newContent }
                          : file,
                      );
                      setOpenFiles(updatedFiles);
                    }
                  }}
                />
              </div>
            </div>
            <div className="bottom-bar">
              <button
                className="btn btn-neutral btn-xs"
                onClick={() => {
                  router.push("/chat");
                }}
              >
                Chat
              </button>
              <button
                className="btn btn-neutral btn-xs"
                onClick={() => {
                  router.push("/kanban");
                }}
              >
                Kanban
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
