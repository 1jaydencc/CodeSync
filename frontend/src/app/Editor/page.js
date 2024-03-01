'use client';
import React, { useState, useEffect, useCallback} from 'react';
import Editor from './Editor.js';
import Taskbar from './Taskbar.js';
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

    let serverOnline = true;

    const checkServerAvailability = () => {
        fetch('http://localhost:3001/api/heartbeat')
            .then(response => {
                if (response.ok) {
                    serverOnline = true;
                } else {
                    throw new Error('Server not responding properly');
                }
            })
            .catch(error => {
                console.error('Server is offline:', error);
                serverOnline = false;
            });
    };

    setInterval(checkServerAvailability, 30000);
    
    
    

    const handleDownloadAllFiles = () => {
        const projectName = "TestProject";
        fetch(`http://localhost:3001/api/download?projectName=${encodeURIComponent(projectName)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP status ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${projectName}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a); 
                window.URL.revokeObjectURL(url);
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
        const savePayload = { projectName: projectName, files: [{ name: fileName, content: code }] };
        
        if (serverOnline) {
        fetch('http://localhost:3001/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectName: projectName, files: [{ name: fileName, content: code }] }),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => {
            console.error('Error saving file:', error);
            // Save to localStorage
            localStorage.setItem(`pendingSave_${projectName}_${fileName}`, JSON.stringify(savePayload));
        });
    } else {
        console.log('Server offline, saving locally');
        localStorage.setItem(`pendingSave_${projectName}_${fileName}`, JSON.stringify(savePayload));
    }
    }, 1000), [serverOnline]);

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
                        />
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
