import React, { useState } from 'react';
import Editor from './Editor';
import Taskbar from './Taskbar';
import { saveAs } from 'file-saver';
import NewFilePopup from './NewFilePopup';

const App = () => {
    const [language, setLanguage] = useState('javascript');
    const [editorCode, setEditorCode] = useState('');
    const [files, setFiles] = useState([]);
    const [currentFileName, setCurrentFileName] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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

    const getLanguageFromFileName = (fileName) => {
        const extension = fileName.split('.').pop();
        switch (extension) {
            case 'py': return 'python';
            case 'cpp': return 'cpp';
            case 'js': return 'javascript';
            // Add other cases as necessary
            default: return 'plaintext';
        }
    };

    const handleFileSelect = (fileName) => {
        const file = files.find(f => f.name === fileName);
        if (file) {
            setEditorCode(file.content);
            setCurrentFileName(fileName);
            setLanguage(getLanguageFromFileName(fileName));
        }
    };

    const handleNewFile = () => {
        setEditorCode('');
        setIsPopupOpen(true);
    };

    const handleFileCreate = (fileName) => {
        const newFile = { name: fileName, content: '' };
        setFiles([...files, newFile]);
        setCurrentFileName(fileName);
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

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fileData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const responseData = await response.json();
            console.log('File saved:', responseData);
        } catch (error) {
            console.error('Failed to save the file:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLanguageChange = (language) => {
        setLanguage(language);
        // Logic to change the language in the editor
    };

    return (
        <div className="app">
        <Taskbar
            onNewFile={handleNewFile}
            onSaveFile={handleSaveFile}
            onOpenFile={handleOpenFile}
            onRun={handleRun}
            onDebug={handleDebug}
            onTerminal={handleTerminal}
            onHelp={handleHelp}
        />
        <NewFilePopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onCreate={handleFileCreate}
        />
        <div className="content">
            <div className="file-explorer">
                {files.map(file => (
                    <div key={file.name} onClick={() => handleFileSelect(file.name)}>
                        {file.name}
                    </div>
                ))}
            </div>
            <div className="editor-container">
                <Editor
                    language={language}
                    code={editorCode}
                    onCodeChange={setEditorCode}
                />
            </div>
        </div>
    </div>
    );
};

export default App;
