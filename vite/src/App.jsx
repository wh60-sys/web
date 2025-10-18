// src/App.jsx
import React, { useState, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

// ----------  DRAGGABLE AREA  ----------
function DraggableArea() {
  const [buttons, setButtons] = useState([
    {
      id: 1,
      x: 50,
      y: 50,
      text: 'Geser Aku!',
      color: '#646cff',
      url: 'https://kuliah.unsia.ac.id/panel/classes/1553226/',
      fifo: new Date().toISOString().split('T')[0],
      jumlahDatang: 0,
      status: 'stop'
    }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [showInfo, setShowInfo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const infoTimeoutRef = useRef(null);

  // temp edit
  const [tempText, setTempText] = useState('');
  const [tempColor, setTempColor] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [tempFifo, setTempFifo] = useState('');
  const [tempJumlahDatang, setTempJumlahDatang] = useState(0);
  const [tempStatus, setTempStatus] = useState('stop');

  // temp add
  const [newText, setNewText] = useState('');
  const [newColor, setNewColor] = useState('#646cff');
  const [newUrl, setNewUrl] = useState('https://kuliah.unsia.ac.id/panel/classes/1553226/');
  const [newFifo, setNewFifo] = useState(new Date().toISOString().split('T')[0]);
  const [newJumlahDatang, setNewJumlahDatang] = useState(0);
  const [newStatus, setNewStatus] = useState('stop');

  const containerRef = useRef(null);

  /* ----------  DRAG  (sama persis kode asli) ---------- */
  const handleMouseDown = (e, buttonId) => {
    if (e.target.closest('.button-controls') || e.target.closest('.info-box')) return;
    e.preventDefault();
    const button = buttons.find(b => b.id === buttonId);
    const dragElement = e.currentTarget;
    const containerRect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - dragElement.getBoundingClientRect().left;
    const offsetY = e.clientY - dragElement.getBoundingClientRect().top;
    let hasMoved = false;

    const handleMove = (event) => {
      const itemWidth = dragElement.clientWidth;
      const itemHeight = dragElement.clientHeight;
      let newX = event.clientX - containerRect.left - offsetX;
      let newY = event.clientY - containerRect.top - offsetY;
      newX = Math.max(0, Math.min(newX, containerRect.width - itemWidth));
      newY = Math.max(0, Math.min(newY, containerRect.height - itemHeight));
      if (Math.abs(newX - button.x) > 5 || Math.abs(newY - button.y) > 5) hasMoved = true;
      setButtons(prev => prev.map(b => (b.id === buttonId ? { ...b, x: newX, y: newY } : b)));
    };
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      if (!hasMoved) window.location.href = button.url;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  /* ----------  CRUD  ---------- */
  const handleDuplicate = id => {
    const b = buttons.find(v => v.id === id);
    setButtons([...buttons, { ...b, id: Math.max(...buttons.map(v => v.id), 0) + 1, x: b.x + 30, y: b.y + 30 }]);
  };
  const handleDelete = id => setButtons(buttons.filter(v => v.id !== id));
  const startEdit = id => {
    const b = buttons.find(v => v.id === id);
    setEditingId(id);
    setTempText(b.text); setTempColor(b.color); setTempUrl(b.url);
    setTempFifo(b.fifo); setTempJumlahDatang(b.jumlahDatang); setTempStatus(b.status);
  };
  const saveEdit = id => {
    setButtons(prev => prev.map(b => b.id === id ? { ...b, text: tempText, color: tempColor, url: tempUrl, fifo: tempFifo, jumlahDatang: tempJumlahDatang, status: tempStatus } : b));
    setEditingId(null);
  };
  const cancelEdit = () => setEditingId(null);

  const openAddModal = () => {
    setNewText(''); setNewColor('#646cff'); setNewUrl('https://kuliah.unsia.ac.id/panel/classes/1553226/');
    setNewFifo(new Date().toISOString().split('T')[0]); setNewJumlahDatang(0); setNewStatus('stop');
    setShowAddModal(true);
  };
  const addNewButton = () => {
    if (!newText.trim()) return alert('Nama tombol harus diisi!');
    setButtons([...buttons, {
      id: buttons.length ? Math.max(...buttons.map(v => v.id)) + 1 : 1,
      x: 50, y: 50, text: newText, color: newColor, url: newUrl,
      fifo: newFifo, jumlahDatang: newJumlahDatang, status: newStatus
    }]);
    setShowAddModal(false);
  };

  const toggleInfo = id => {
    if (infoTimeoutRef.current) clearTimeout(infoTimeoutRef.current);
    if (showInfo === id) { setShowInfo(null); return; }
    setShowInfo(id);
    infoTimeoutRef.current = setTimeout(() => setShowInfo(null), 5000);
  };
  const closeInfo = () => {
    if (infoTimeoutRef.current) clearTimeout(infoTimeoutRef.current);
    setShowInfo(null);
  };

  /* ----------  RENDER  ---------- */
  return (
    <>
      <div style={{ marginBottom: 10 }}>
        <button onClick={openAddModal} className="add-button">➕ Tambah Tombol Baru</button>
        <span style={{ marginLeft: 15, color: '#666' }}>Total tombol: {buttons.length}</span>
      </div>

      <div className="ruang-kontainer" ref={containerRef} onClick={e => { if (e.target === containerRef.current) closeInfo(); }}>
        {buttons.map(button => (
          <div
            key={button.id}
            className="tombol-draggable"
            onMouseDown={(e) => handleMouseDown(e, button.id)}
            style={{ left: button.x, top: button.y }}
          >
            <a href={button.url} className="btn-kuliah" style={{ backgroundColor: button.color }}>{button.text}</a>

            {/* KONTROL VERTIKAL RATA KANAN ATAS */}
            <div className="button-controls">
              <button className="control-btn info-btn" onClick={(e) => { e.stopPropagation(); toggleInfo(button.id); }} title="Informasi">ℹ️</button>
              <button className="control-btn edit-btn" onClick={(e) => { e.stopPropagation(); startEdit(button.id); }} title="Edit">✏️</button>
              <button className="control-btn duplicate-btn" onClick={(e) => { e.stopPropagation(); handleDuplicate(button.id); }} title="Duplikat">📋</button>
              <button className="control-btn delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(button.id); }} title="Hapus">🗑️</button>
            </div>

            {/* INFO BOX (juga rata kanan atas di dalam tombol) */}
            {showInfo === button.id && (
              <div className="info-box" onClick={(e) => e.stopPropagation()}>
                <button className="info-close-btn" onClick={closeInfo}>✕</button>
                <div className="info-item"><strong>Nama:</strong> {button.text}</div>
                <div className="info-item"><strong>FIFO:</strong> {button.f