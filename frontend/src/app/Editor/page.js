'use client';
import React, { useState, useEffect, useCallback} from 'react';
import Editor from './editor.js';
import Taskbar from './taskbar.js';
import NewFilePopup from './NewFilePopup.js';
import './App.css';
import languages from './languages.json';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import _ from 'lodash';

const App = () => {
    const [language, setLanguage] = useState('javascript');
    const [editorCode, setEditorCode] = useState('');
    const [files, setFiles] = useState([]);
    const [currentFileName, setCurrentFileName] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [openTabs, setOpenTabs] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, description: "Your first notification goes here, it's pretty long to test the ellipsis...", isRead: false, timestamp: "2024-03-28T20:19:52.279787+00:00" },
        { id: 2, description: "Second notification, also lengthy enough...", isRead: true, timestamp: "2024-03-28T20:09:52.279787+00:00" },
        { id: 3, description: "Third notification example...", isRead: false, timestamp: "2024-03-28T19:59:52.279787+00:00" },
        { id: 4, description: "Fourth notification here...", isRead: true, timestamp: "2024-03-28T19:49:52.279787+00:00" },
        { id: 5, description: "Fifth notification content...", isRead: false, timestamp: "2024-03-28T19:39:52.279787+00:00" },
    ]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [hoveredNotification, setHoveredNotification] = useState(null);
    const [hoverTimeoutId, setHoverTimeoutId] = useState(null);    

    useEffect(() => {
        const interval = setInterval(() => {
            setNotifications(currentNotifications => {
                return [...currentNotifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            });
        }, 1000);
    
        return () => clearInterval(interval);
    }, []);

    const handleClearCurrentNotification = () => {
        setNotifications(notifications.filter(n => n.id !== selectedNotification.id));
        setSelectedNotification(null);
    };
    

    const handleNotificationMouseEnter = (notificationId) => {
        const timeoutId = setTimeout(() => {
          const notification = notifications.find(n => n.id === notificationId);
          setHoveredNotification(notification);
        }, 1000);
        setHoverTimeoutId(timeoutId);
    };

    const handleNotificationMouseLeave = () => {
        clearTimeout(hoverTimeoutId);
        setHoverTimeoutId(null);
        setHoveredNotification(null);
    };
      

    const handleNotificationClick = (notificationId) => {
        setSelectedNotification(notifications.find(n => n.id === notificationId));
        setNotifications(notifications.map(n => {
          if (n.id === notificationId) {
            return { ...n, isRead: true };
          }
          return n;
        }));
      };
      

    const toggleNotifications = () => {
      setShowNotifications(!showNotifications);
    };

    const handleClosePopup = () => {
        setSelectedNotification(null);
    };

    const handleClearNotifications = () => {
        setNotifications([]);
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
        }, 3000);
    };

    const handleOpenFile = () => {
        // Placeholder for open file logic
    };

    const handleRun = () => {
        // Placeholder for run without debugging logic
    };

    const handleDebug = () => {
        // Placeholder for run with debugging logic
    };

    const handleTerminal = () => {
        // Placeholder for terminal logic
    };

    const handleHelp = () => {
        // Placeholder for help/documentation logic
    };

    useEffect(() => {
        /*
        const handleAutoSave = () => {
            if (!currentFileName) return;
            const updatedFiles = files.map(file => {
                if (file.name === currentFileName) {
                    return { ...file, content: editorCode };
                }
                return file;
            });
    
            setFiles(updatedFiles);
        };
        const debounceSave = setTimeout(handleAutoSave, 1000);
        return () => clearTimeout(debounceSave);
        */
    }, [editorCode, currentFileName, files]);
    
    

    const handleDownloadAllFiles = () => {
        const projectName = "TestProject";
        fetch(`http://localhost:3001/api/download?projectName=${encodeURIComponent(projectName)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP status ${response.status}`);
                }
                return response.blob(); // Assuming the server responds with a blob for the ZIP file
            })
            .then(blob => {
                // Create a URL for the blob
                const url = window.URL.createObjectURL(blob);
                // Create an anchor (<a>) element and click it to download the file
                const a = document.createElement("a");
                a.href = url;
                a.download = `${projectName}.zip`; // The filename you want to save the file as
                document.body.appendChild(a); // Append the anchor to the body
                a.click(); // Simulate a click on the anchor to trigger the download
                document.body.removeChild(a); // Clean up
                window.URL.revokeObjectURL(url); // Release the object URL
            })
            .catch(error => console.error('Error downloading project files:', error));
    };
    

    const getLanguageFromFileName = (fileName) => {
        const extension = fileName.split('.').pop();
        const languageObj = languages.find(lang => lang.extension === `.${extension}`);
        return languageObj ? languageObj.language : 'plaintext';
    };
    

    const handleFileSelect = useCallback((fileName) => {
        const projectName = "TestProject"; // Static projectName for now
        fetch(`http://localhost:3001/api/files?projectName=${encodeURIComponent(projectName)}&fileName=${encodeURIComponent(fileName)}`)
            .then(response => {
                if (!response.ok) {
                    // Handle non-2xx HTTP status
                    throw new Error(`${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                setEditorCode(data.content);
                setCurrentFileName(fileName);
                setLanguage(getLanguageFromFileName(fileName));
                if (!openTabs.includes(fileName)) {
                    setOpenTabs([...openTabs, fileName]);
                }
                setActiveTab(fileName);
            })
            .catch(error => console.error('Error fetching file:', error));
    }, [openTabs]);
    

    const debouncedSave = useCallback(_.debounce((code, fileName) => {
        const projectName = "TestProject";
        
        fetch('http://localhost:3001/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectName: projectName, files: [{ name: fileName, content: code }] }),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error saving file:', error));
    }, 1000), []);

    useEffect(() => {
        if (currentFileName) {
            debouncedSave(editorCode, currentFileName);
        }
    }, [editorCode, currentFileName, debouncedSave]);

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

    const handleSaveFile = () => {
        const newFiles = files.map(file => {
            if (file.name === currentFileName) {
                return { ...file, content: editorCode };
            }
            return file;
        });
        setFiles(newFiles);

        const apiEndpoint = 'https://your-backend-api.com/files/save';

        const fileData = {
            language: language,
            code: editorCode,
            fileName: currentFileName,
        };

        setIsSaving(true);
    };

    const handleLanguageChange = (language) => {
        setLanguage(language);
        // Logic to change the language in the editor
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
                            onHelp={handleHelp}
                            onDownloadAllFiles={handleDownloadAllFiles}
                            onToggleNotifications={toggleNotifications}
                        />
                    </div>
                    {showNotifications && (
                    <div className="notifications-area">
                        Notifications
                        <button className="clear-notifications" onClick={handleClearNotifications}>Clear</button>
                        {notifications.map((notification) => (
                        <div key={notification.id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}onClick={() => handleNotificationClick(notification.id)}
                        onMouseEnter={() => handleNotificationMouseEnter(notification.id)}
                        onMouseLeave={handleNotificationMouseLeave}>
                            <span className="notification-description">{notification.description.slice(0, 15)}...</span>
                            <span className="notification-timestamp">
                                {new Date(notification.timestamp).toLocaleString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true
                                })}
                            </span>
                        </div>
                        ))}
                    </div>
                    )}
                    {selectedNotification && (
                    <div className="popup-overlay" onClick={handleClosePopup}>
                        <div className="popup" onClick={(e) => e.stopPropagation()}> {/* Prevent popup from closing when clicking inside */}
                        <p><strong>Time:</strong> {new Date(selectedNotification.timestamp).toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })}</p>
                        <p><strong>Message:</strong> {selectedNotification.description}</p>
                        <button onClick={handleClearCurrentNotification} className="clear-current-notification">Clear</button>
                        </div>
                    </div>
                    )}
                    {showConfirmation && (
                    <div className="confirmation-message">
                        Notifications cleared
                    </div>
                    )}
                    {hoveredNotification && (
                    <div className="hover-popup" style={{ position: 'absolute', top: '40px', left: '1430px' }}>
                        <p>{hoveredNotification.description}</p>
                        <p className="notification-timestamp">{hoveredNotification.timestamp}</p>
                    </div>
                    )}
                </div>
                <NewFilePopup
                        isOpen={isPopupOpen}
                        onClose={() => setIsPopupOpen(false)}
                        onCreate={handleFileCreate}
                />
                <div className="container2">
                    <div className="container3">
                        <div className="container7">
                            Project Information
                        </div>
                        <div className="container8">
                            {files.map(file => (
                                <div key={file.name} className="file-item" onClick={() => handleFileSelect(file.name)}>
                                    📄{file.name} {}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="container4">
                        <div className="container5">
                            {openTabs.map(tabName => (
                                <div key={tabName} className={`tab-item ${tabName === activeTab ? 'active' : ''}`} onClick={() => handleFileSelect(tabName)}>
                                    {tabName}
                                    <span onClick={() => handleCloseTab(tabName)}> ✖ </span> {}
                                </div>
                            ))}
                        </div>
                        <div className="container6">
                            <Editor
                                language={language}
                                code={editorCode}
                                onCodeChange={setEditorCode}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
