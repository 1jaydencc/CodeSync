'use client';
import React, { useState, useEffect } from 'react';
import Editor from '@/app/editor/editor.js';
import Taskbar from '@/app/editor/taskbar.js';
import NewFilePopup from '@/app/editor/new-file-popup.js';
import Dropdown from './themeDropDown.js';
import themelist from "monaco-themes/themes/themelist.json";
import '@/app/editor/editor.css';
import languages from '@/app/editor/languages.json';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { doc, setDoc, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { auth,db } from '@/firebase-config';

const App = () => {
    const [language, setLanguage] = useState('javascript');
    const [editorCode, setEditorCode] = useState('');
    const [files, setFiles] = useState([]);
    const [currentFileName, setCurrentFileName] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [openTabs, setOpenTabs] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const [dropdownVisible, setDropdownVisible] = useState(true);
    const [theme, setTheme] = useState('vs-dark');

    const handleOpenFile = () => {
        // Placeholder for open file logic
    };

    const handleRun = () => {
        
    };

    const handleDebug = () => {
        // Placeholder for run with debugging logic
    };

    const handleTerminal = () => {
        // Placeholder for terminal logic
    };

    const toggleVisibility = () => {
        setDropdownVisible(!dropdownVisible);
        console.log(dropdownVisible)
    };

    const handleTheme = () => {
        toggleVisibility();
    }
    const handleHelp = () => {
        // Placeholder for help/documentation logic
    };

    const handleChat = () => {
        router.push('/chat');
    };

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Auth state changed. Current user:", user);
            if (user) {
                // User is signed in, now fetch files
                const fetchFiles = async () => {
                    console.log("Fetching files for user:", user.uid);
                    const q = query(collection(db, "files"), where("uid", "==", user.uid));
                    try {
                        const querySnapshot = await getDocs(q);
                        console.log(`Fetched ${querySnapshot.docs.length} files`);
                        const fetchedFiles = querySnapshot.docs.map(doc => ({
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

    useEffect(() => {
        const closeDropdown = (e) => {
            if (!e.target.closest('.user-profile')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);

            router.push('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };



    const handleDownloadAllFiles = () => {
        const zip = new JSZip();
        files.forEach(file => {
            zip.file(file.name, file.content);
        });
        zip.generateAsync({ type: 'blob' }).then(content => {
            saveAs(content, 'project.zip');
        });
    };

    const getLanguageFromFileName = (fileName) => {
        const extension = fileName.split('.').pop();
        const languageObj = languages.find(lang => lang.extension === `.${extension}`);
        return languageObj ? languageObj.language : 'plaintext';
    };


    const handleFileSelect = (fileName) => {
        const file = files.find(f => f.name === fileName);
        if (file) {
            setEditorCode(file.content);
            setCurrentFileName(fileName);
            setLanguage(getLanguageFromFileName(fileName));
            if (!openTabs.includes(fileName)) {
                setOpenTabs([...openTabs, fileName]);
            }
            setActiveTab(fileName);
        }
    };

    const handleCloseTab = (fileName) => {
        const newOpenTabs = openTabs.filter(name => name !== fileName);
        setOpenTabs(newOpenTabs);
        if (activeTab === fileName && newOpenTabs.length > 0) {
            setActiveTab(newOpenTabs[0]);
        } else if (newOpenTabs.length === 0) {
            setEditorCode('');
            setCurrentFileName('');
        }
    };

    const handleNewFile = () => {
        setEditorCode('');
        setIsPopupOpen(true);
    };

    const handleFileCreate = (fileName) => {
        const extension = fileName.split('.').pop();
        const languageObj = languages.find(lang => lang.extension === `.${extension}`);
        const language = languageObj ? languageObj.language : 'plaintext';

        const newFile = { name: fileName, content: '', language };
        setFiles([...files, newFile]);
        setCurrentFileName(fileName);
        setLanguage(language);
        setIsPopupOpen(false);
    };

    // Modify the handleSaveFile function
    const handleSaveFile = async () => {
        if (!currentFileName) {
            console.log("No file name or content to save");
            return;
        }

        const fileData = {
            language: language,
            content: editorCode,
            uid: auth.currentUser?.uid, // Ensure you have a fallback or check for currentUser being null
        };

        setIsSaving(true); // Indicate saving process has started

        if (navigator.onLine) {
            // Save online if the navigator is online
            await saveOnline(fileData);
        } else {
            // Save offline if the navigator is offline
            saveOffline(fileData);
        }

        setIsSaving(false); // Reset saving indicator
    };

    const handleLanguageChange = (language) => {
        setLanguage(language);
        // Logic to change the language in the editor
    };

    setTimeout(
        function() {
            const unsub = onSnapshot(doc(db, "user_settings", auth.currentUser.uid), (doc) => {
                // console.log("Current data: ", doc.data().theme);
                if (doc.data().theme === 'vs-light') {
                    setTheme('vs-light');
                } else if (doc.data().theme === 'vs-dark') {
                    setTheme('vs-dark');
                } else if (doc.data().theme === 'hc-black') {
                    setTheme('hc-black');
                } else if (doc.data().theme === 'hc-light') {
                    setTheme('hc-light');
                }
            });
    }, 2000);


    const handleThemeChange = (e) => {
        const selectedOption = e.target.value;
        if (selectedOption === 'vs-light') {
            setTheme('vs-light');
        } else if (selectedOption === 'vs-dark') {
            setTheme('vs-dark');
        } else if (selectedOption === 'hc-black') {
            setTheme('hc-black');
        } else if (selectedOption === 'hc-light') {
            setTheme('hc-light');
        }
    };

    return (
        <div className="app">
            <div className="container0">
                <div className="container1">
                    <div className="logo">
                        CodeSync
                    </div>
                    <div className="taskBar">
                        <Taskbar
                            onNewFile={handleNewFile}
                            onSaveFile={handleSaveFile}
                            onOpenFile={handleOpenFile}
                            onRun={handleRun}
                            onDebug={handleDebug}
                            onTerminal={handleTerminal}
                            onTheme={handleTheme}
                            onHelp={handleHelp}
                            onDownloadAllFiles={handleDownloadAllFiles}
                            onChat={handleChat}
                        />
                        <div hidden={dropdownVisible} onChange={handleThemeChange} >
                            <select className='options'>
                                <option value="vs-light">vs-light</option>
                                <option value="vs-dark">vs-dark</option>
                                <option value="hc-black">hc-black</option>
                                <option value="hc-light">hc-light</option>
                            </select>
                        </div>
                    </div>
                </div>
                <NewFilePopup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    onCreate={handleFileCreate}
                />
                <div className="container2">
                    <div className="container3">
                        <div className="container7">
                            EXPLORER
                        </div>
                        <div className="container8">
                            {files.map(file => (
                                <div key={file.name} className="file-item" onClick={() => handleFileSelect(file.name)}>
                                    {file.name}
                                </div>
                            ))}
                        </div>
                        <div className="user-profile">
                            <FontAwesomeIcon icon={faUser} onClick={toggleDropdown} className="user-icon" />
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-item" onClick={handleSignOut}>Sign Out</div>
                                    <div className='dropdown-item'>Settings</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="container4">
                        <div className="container5">
                            {openTabs.map(tabName => (
                                <div key={tabName} className={`tab-item ${tabName === activeTab ? 'active' : ''}`} onClick={() => handleFileSelect(tabName)}>
                                    {tabName}
                                    <span onClick={() => handleCloseTab(tabName)}> ✖ </span> { }
                                </div>
                            ))}
                        </div>
                        <div>
                            <Editor
                                language={language}
                                code={editorCode}
                                theme={theme}
                                currentFile={activeTab}
                                onCodeChange={setEditorCode}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default App;