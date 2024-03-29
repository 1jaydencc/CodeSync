"use client";
import React from "react";
import '@/app/Project/Project.css'
import "@/app/globals.css";
import { LANGUAGE_VERSIONS } from "./constants";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "#3182ce"; // Adjust this color as needed

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <div style={{ marginLeft: '8px', marginBottom: '16px' }}>
      <p style={{ marginBottom: '8px', fontSize: '16px' }}>Language:</p>
      <div className="menu">
        <button className="menu-button">{language}</button>
        <ul className="menu-list">
          {languages.map(([lang, version]) => (
            <li
              key={lang}
              className="menu-item"
              style={{
                color: lang === language ? ACTIVE_COLOR : "",
                backgroundColor: lang === language ? "#2d3748" : "transparent",
              }}
              onClick={() => onSelect(lang)}
            >
              {lang}&nbsp;
              <span style={{ color: "#4a5568", fontSize: '12px' }}>
                ({version})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelector;
