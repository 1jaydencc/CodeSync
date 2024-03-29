import axios from "axios";
import languages from "@/app/editor/languages.json";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (language, sourceCode, fileName) => {
  const languageObj = languages.find(lang => lang.language === `.${language}`);
  const response = await API.post("/execute", {
    language: language,
    version: languageObj.version,
    files: [
      {
        name: fileName,
        content: sourceCode,
      },
    ],
  });
  return response.data;
};