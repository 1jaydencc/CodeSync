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
                // Other Taskbar props and handlers
            />
            <NewFilePopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onCreate={handleFileCreate}
            />
            <div className="file-explorer">
                {files.map(file => (
                    <div key={file.name} onClick={() => handleFileSelect(file.name)}>
                        {file.name}
                    </div>
                ))}
            </div>
            <Editor
                language={language}
                code={editorCode}
                onCodeChange={setEditorCode}
            />
        </div>
    );
};

export default App;
