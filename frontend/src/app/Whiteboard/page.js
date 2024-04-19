/*
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import './App.css';
import { db, auth } from "@/firebase-config";
import {
  query,
  orderBy,
  where,
  onSnapshot,
  deleteDoc,
  setDoc,
  doc,  
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const WhiteboardPage = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawMode, setDrawMode] = useState(true); // true for draw, false for erase
    const [lines, setLines] = useState([]);
    const [renderedLines, setRenderedLines] = useState(new Set());
    const [user, setUser] = useState(null);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        const newRenderedLines = new Set(renderedLines);
        const newLines = [];
    
        const linesRef = collection(db, "whiteboards", "defaultWhiteboard", "lines");
        const q = query(linesRef, orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (change.type === "added" && !renderedLines.has(change.doc.id)) {
                    const newLine = {
                        id: change.doc.id,
                        color: change.doc.data().color,
                        createdAt: change.doc.data().createdAt,
                        createdBy: change.doc.data().createdBy,
                        width: change.doc.data().width,
                        points: change.doc.data().points.map(p => ({ x: p.x, y: p.y }))
                    };
                    console.log("New line added:", newLine);
                    drawLine(newLine);
                    //setLines(lines => [...lines, newLine]);
                    //setRenderedLines(new Set([...renderedLines, change.doc.id]));
                    newLines.push(newLine);
                    newRenderedLines.add(change.doc.id);
                }
            });

            setLines(lines => [...lines, ...newLines]);
            setRenderedLines(newRenderedLines);
        });

        return () => unsubscribe();
    }, [user, renderedLines]);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 800 * 2; // Adjust canvas size as needed
        canvas.height = 600 * 2;
        canvas.style.width = `800px`;
        canvas.style.height = `600px`;

        const context = canvas.getContext('2d');
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 5;
        contextRef.current = context;
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);


    const startDrawing = ({ nativeEvent }) => {
        if (!user) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        setLines([...lines, { points: [{ x: offsetX, y: offsetY }], color: drawMode ? 'black' : '#252525', width: 5 }]);
        contextRef.current.globalCompositeOperation = drawMode ? 'source-over' : 'destination-out';
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const lastLine = lines[lines.length - 1];
        lastLine.points.push({ x: offsetX, y: offsetY });
        setLines([...lines.slice(0, -1), lastLine]);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const stopDrawing = async () => {
        if (!user) return;
        contextRef.current.closePath();
        setIsDrawing(false);
        const lastLine = lines[lines.length - 1];
        await addDoc(collection(db, "whiteboards", "defaultWhiteboard", "lines"), {
            points: lastLine.points,
            color: lastLine.color,
            width: lastLine.width,
            createdBy: user.uid,
            createdAt: serverTimestamp(),
        });
    };

    const toggleDrawErase = () => {
        setDrawMode(!drawMode);
    };

    const goToEditor = () => {
        router.push("/editor"); // Navigate to Editor page
    };

    const drawLine = (line) => {
        const context = contextRef.current;
        context.beginPath();
        line.points.forEach((point, index) => {
            if (index === 0) {
                context.moveTo(point.x, point.y);
            } else {
                context.lineTo(point.x, point.y);
            }
        });
        context.strokeStyle = line.color;
        context.lineWidth = line.width;
        context.stroke();
        context.closePath();
        console.log("Rendering line:", line);
    };

    return (
        <div className="app">
            <div className="container0">
                <div className="logo">CodeSync</div>
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    style={{ border: '2px solid black' }}
                />
                <div className="bottom-bar">
                    <button onClick={toggleDrawErase}>
                        {drawMode ? 'Switch to Erase' : 'Switch to Draw'}
                    </button>
                    <button onClick={goToEditor} className="go-to-editor">Go to Editor</button>
                </div>
                {!user && <div>Please log in to use the whiteboard.</div>}
            </div>
        </div>
    );
};

export default WhiteboardPage;
*/
'use client';