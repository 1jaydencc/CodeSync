import languages from '@/app/editor/languages.json';
import axios from 'axios';

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})

export const executeCode = async (language, SourceCode, fileName) => {
    const languageObj = languages.find(lang => lang.language === `.${language}`);
    const response = await API.post("/execute", {
        "language": language,
        "version": languageObj.version,
        "files": [
            {
                "content": SourceCode,
                "fileName": fileName
            },
        ],
    });
    return response.data;
};