import React, { useState, useRef } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// KOMPONEN DRAGGABLEAREA
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
  
  // State untuk edit
  const [tempText, setTempText] = useState('');
  const [tempColor, setTempColor] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [tempFifo, setTempFifo] = useState('');
  const [tempJumlahDatang, setTempJumlahDatang] = useState(0);
  const [tempStatus, setTempStatus] = useState('stop');
  
  // State untuk tambah baru
  const [newText, setNewText] = useState('');
  const [newColor, setNewColor] = useState('#646cff');
  const [newUrl, setNewUrl] = useState('https://kuliah.unsia.ac.id/panel/classes/1553226/');
  const [newFifo, setNewFifo] = useState(new Date().toISOString().split('T')[0]);
  const [newJumlahDatang, setNewJumlahDatang] = useState(0);
  const [newStatus, setNewStatus] = useState('stop');
  
  const containerRef = useRef(null);
  
  const handleMouseDown = (e, buttonId) => {
    // Jangan drag jika klik pada control buttons atau info box
    if (e.target.closest('.button-controls') || e.target.closest('.info-box')) {
      return;
    }
    
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
      
      if (Math.abs(newX - button.x) > 5 || Math.abs(newY - button.y) > 5) {
        hasMoved = true;
      }
      
      setButtons(prev => prev.map(b => 
        b.id === buttonId ? { ...b, x: newX, y: newY } : b
      ));
    };
    
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      
      // Jika tidak digeser, buka link
      if (!hasMoved) {
        window.location.href = button.url;
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const handleDuplicate = (buttonId) => {
    const button = buttons.find(b => b.id === buttonId);
    const newButton = {
      ...button,
      id: Math.max(...buttons.map(b => b.id)) + 1,
      x: button.x + 30,
      y: button.y + 30
    };
    setButtons([...buttons, newButton]);
  };

  const handleDelete = (buttonId) => {
    setButtons(buttons.filter(b => b.id !== buttonId));
  };

  const startEdit = (buttonId) => {
    const button = buttons.find(b => b.id === buttonId);
    setEditingId(buttonId);
    setTempText(button.text);
    setTempColor(button.color);
    setTempUrl(button.url);
    setTempFifo(button.fifo);
    setTempJumlahDatang(button.jumlahDatang);
    setTempStatus(button.status);
  };

  const saveEdit = (buttonId) => {
    setButtons(prev => prev.map(b => 
      b.id === buttonId 
        ? { 
            ...b, 
            text: tempText, 
            color: tempColor, 
            url: tempUrl,
            fifo: tempFifo,
            jumlahDatang: tempJumlahDatang,
            status: tempStatus
          } 
        : b
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const openAddModal = () => {
    setNewText('');
    setNewColor('#646cff');
    setNewUrl('https://kuliah.unsia.ac.id/panel/classes/1553226/');
    setNewFifo(new Date().toISOString().split('T')[0]);
    setNewJumlahDatang(0);
    setNewStatus('stop');
    setShowAddModal(true);
  };

  const addNewButton = () => {
    if (!newText.trim()) {
      alert('Nama tombol harus diisi!');
      return;
    }
    
    const newButton = {
      id: buttons.length > 0 ? Math.max(...buttons.map(b => b.id)) + 1 : 1,
      x: 50,
      y: 50,
      text: newText,
      color: newColor,
      url: newUrl,
      fifo: newFifo,
      jumlahDatang: newJumlahDatang,
      status: newStatus
    };
    setButtons([...buttons, newButton]);
    setShowAddModal(false);
  };

  const toggleInfo = (buttonId) => {
    // Clear timeout sebelumnya jika ada
    if (infoTimeoutRef.current) {
      clearTimeout(infoTimeoutRef.current);
    }

    if (showInfo === buttonId) {
      setShowInfo(null);
    } else {
      setShowInfo(buttonId);
      // Set timeout untuk auto close setelah 5 detik
      infoTimeoutRef.current = setTimeout(() => {
        setShowInfo(null);
      }, 5000);
    }
  };

  const closeInfo = () => {
    if (infoTimeoutRef.current) {
      clearTimeout(infoTimeoutRef.current);
    }
    setShowInfo(null);
  };
  
  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={openAddModal} className="add-button">
          ➕ Tambah Tombol Baru
        </button>
        <span style={{ marginLeft: '15px', color: '#666' }}>
          Total tombol: {buttons.length}
        </span>
      </div>

      <div className="ruang-kontainer" ref={containerRef} onClick={(e) => {
        // Close info hanya jika klik langsung di container, bukan di tombol
        if (e.target === containerRef.current) {
          closeInfo();
        }
      }}>
        {buttons.map(button => (
          <div 
            key={button.id}
            className="tombol-draggable"
            onMouseDown={(e) => handleMouseDown(e, button.id)}
            style={{ 
              left: button.x, 
              top: button.y,
              cursor: 'grab'
            }}
          >
            <a 
              href={button.url} 
              className="btn-kuliah"
              style={{ backgroundColor: button.color }}
            >
              {button.text}
            </a>
            
            <div className="button-controls button-controls-hover">
              <button 
                className="control-btn info-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleInfo(button.id);
                }}
                title="Informasi"
              >
                ℹ️
              </button>
              <button 
                className="control-btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(button.id);
                }}
                title="Edit"
              >
                ✏️
              </button>
              <button 
                className="control-btn duplicate-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicate(button.id);
                }}
                title="Duplikat"
              >
                📋
              </button>
              <button 
                className="control-btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(button.id);
                }}
                title="Hapus"
              >
                🗑️
              </button>
            </div>

            {/* Info Box */}
            {showInfo === button.id && (
              <div className="info-box" onClick={(e) => {
                e.stopPropagation();
              }}>
                <button 
                  className="info-close-btn"
                  onClick={closeInfo}
                  title="Tutup"
                >
                  ✕
                </button>
                <div className="info-item">
                  <strong>Nama:</strong> {button.text}
                </div>
                <div className="info-item">
                  <strong>FIFO:</strong> {button.fifo}
                </div>
                <div className="info-item">
                  <strong>Jumlah Datang:</strong> {button.jumlahDatang}
                </div>
                <div className="info-item">
                  <strong>Status:</strong> 
                  <span className={`status-badge status-${button.status}`}>
                    {button.status.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {buttons.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            paddingTop: '100px', 
            color: '#999',
            fontSize: '18px'
          }}>
            Tidak ada tombol. Klik "Tambah Tombol Baru" untuk membuat tombol.
          </div>
        )}
      </div>

      {/* Modal Tambah Baru */}
      {showAddModal && (
        <div className="edit-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Tambah Tombol Baru</h3>
            
            <label>
              Nama Tombol: <span style={{color: 'red'}}>*</span>
              <input 
                type="text" 
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Masukkan nama tombol"
              />
            </label>

            <label>
              Warna Tombol:
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                />
                <input 
                  type="text" 
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="#646cff"
                  style={{ width: '100px' }}
                />
              </div>
            </label>

            <label>
              URL Link:
              <input 
                type="text" 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </label>

            <label>
              FIFO (Tanggal):
              <input 
                type="date" 
                value={newFifo}
                onChange={(e) => setNewFifo(e.target.value)}
              />
            </label>

            <label>
              Jumlah Datang:
              <input 
                type="number" 
                value={newJumlahDatang}
                onChange={(e) => setNewJumlahDatang(parseInt(e.target.value) || 0)}
                min="0"
              />
            </label>

            <label>
              Status:
              <select 
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="stop">STOP</option>
                <option value="out">OUT</option>
              </select>
            </label>

            <div className="modal-buttons">
              <button onClick={addNewButton} className="save-btn">
                💾 Simpan
              </button>
              <button onClick={() => setShowAddModal(false)} className="cancel-btn">
                ❌ Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {editingId && (
        <div className="edit-modal-overlay" onClick={cancelEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Tombol</h3>
            
            <label>
              Nama Tombol:
              <input 
                type="text" 
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                placeholder="Masukkan nama tombol"
              />
            </label>

            <label>
              Warna Tombol:
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={tempColor}
                  onChange={(e) => setTempColor(e.target.value)}
                />
                <input 
                  type="text" 
                  value={tempColor}
                  onChange={(e) => setTempColor(e.target.value)}
                  placeholder="#646cff"
                  style={{ width: '100px' }}
                />
              </div>
            </label>

            <label>
              URL Link:
              <input 
                type="text" 
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </label>

            <label>
              FIFO (Tanggal):
              <input 
                type="date" 
                value={tempFifo}
                onChange={(e) => setTempFifo(e.target.value)}
              />
            </label>

            <label>
              Jumlah Datang:
              <input 
                type="number" 
                value={tempJumlahDatang}
                onChange={(e) => setTempJumlahDatang(parseInt(e.target.value) || 0)}
                min="0"
              />
            </label>

            <label>
              Status:
              <select 
                value={tempStatus}
                onChange={(e) => setTempStatus(e.target.value)}
              >
                <option value="stop">STOP</option>
                <option value="out">OUT</option>
              </select>
            </label>

            <div className="modal-buttons">
              <button onClick={() => saveEdit(editingId)} className="save-btn">
                💾 Simpan
              </button>
              <button onClick={cancelEdit} className="cancel-btn">
                ❌ Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// KOMPONEN UTAMA APP
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* KOMPONEN DRAGGABLEAREA */}
      <DraggableArea />

      <div>
        <header>
          <ul>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">satu</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">dua</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">tiga</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">empat</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">lima</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">enam</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">tujuh</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">delapan</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">sembilan</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">sepuluh</a>
          </ul>
        </header>
      </div>
      <div>
        <header>
          <ul>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">sebelas</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">dua belas</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">tiga belas</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">empat belas</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">lima belas</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">enam belas</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">tujuh belas</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">delapan belas</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">sembilan belas</a>
            <a href="https://kuliah.unsia.ac.id/panel/classes/1553226/" 
              className="btn-kuliah">dua puluh</a>
          </ul>
        </header>
      </div>
    </>
  )
}

export default App