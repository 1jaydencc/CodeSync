'use client';
import React from 'react';

const Footer = ({ curLine, curCol }) => {
    return (
        <div className="footer">
            <p>Ln {curLine}, Col {curCol}</p>
        </div>
    );
};

export default Footer;