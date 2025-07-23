import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputs, setInputs] = useState({ S: '', K: '', r: '', t: '', sig: '' });
  const [results, setResults] = useState({ call: null, put: null, greeks: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportMode, setExportMode] = useState(false);
  const [logToasts, setLogToasts] = useState([]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleLogClick = () => {
    const newToast = {
      id: Date.now(),
      message: "Figures Logged",
      timestamp: Date.now()
    };
    setLogToasts(prev => [...prev, newToast]);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      setLogToasts(prev => prev.filter(toast => toast.id !== newToast.id));
    }, 3000);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      setSettingsOpen(prev => !prev);
    }
    if (e.key === 'Escape' && settingsOpen) {
      e.preventDefault();
      setSettingsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [settingsOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults({ call: null, put: null, greeks: null });
    try {
      // Import the WASM module
      const createModelModule = (await import('./model.mjs')).default;
      const module = await createModelModule();
      // Convert inputs to numbers
      const S = parseFloat(inputs.S);
      const K = parseFloat(inputs.K);
      const r = parseFloat(inputs.r);
      const t = parseFloat(inputs.t);
      const sig = parseFloat(inputs.sig);
      // Call both getC and getP functions
      const callPrice = module._getC(S, K, r, t, sig);
      const putPrice = module._getP(S, K, r, t, sig);
      // Greeks: true for call, false for put
      const deltaCall = module._getDelta(1, S, K, r, t, sig);
      const deltaPut = module._getDelta(0, S, K, r, t, sig);
      const gamma = module._getGamma(S, K, r, t, sig);
      const thetaCall = module._getTheta(1, S, K, r, t, sig);
      const thetaPut = module._getTheta(0, S, K, r, t, sig);
      const vega = module._getVega(S, K, r, t, sig);
      const rhoCall = module._getRho(1, S, K, r, t, sig);
      const rhoPut = module._getRho(0, S, K, r, t, sig);
      setResults({
        call: callPrice,
        put: putPrice,
        greeks: {
          deltaCall, deltaPut, gamma, thetaCall, thetaPut, vega, rhoCall, rhoPut
        }
      });
    } catch (err) {
      setError('Failed to load or run model: ' + err.message);
      console.error('Full error:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100px',
    padding: '12px 8px',
    border: '2px solid #e0e6ed',
    borderRadius: '10px',
    fontSize: '1rem',
    textAlign: 'center',
    fontWeight: '500',
    color: '#2c3e50',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    outline: 'none',
    // Remove number input spinners
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
    appearance: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const labelStyle = {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#ecf0f1',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  const calculateButtonStyle = {
    backgroundColor: ' #504a80 ',  // Changed from gradient to solid color
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    marginTop: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const resultBoxStyle = {
    border: '2px solid',
    borderRadius: '12px',
    padding: '20px 30px',
    margin: '10px',
    textAlign: 'center',
    minWidth: '180px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease'
  };

  const callBoxStyle = {
    ...resultBoxStyle,
    borderColor: '#4CAF50',
    color: '#4CAF50'
  };

  const putBoxStyle = {
    ...resultBoxStyle,
    borderColor: '#e74c3c',
    color: '#e74c3c'
  };

  const settingsOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    display: settingsOpen ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  };

  const settingsPanelStyle = {
    backgroundColor: 'rgba(44, 62, 80, 0.95)',
    borderRadius: '15px',
    padding: '30px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
  };

  const settingsHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    color: 'white'
  };

  const closeButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const settingsSectionStyle = {
    marginBottom: '20px',
    color: 'white'
  };

  const toastStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(187, 143, 255, 0.3)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(187, 143, 255, 0.5)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    opacity: 0.8,
    transition: 'opacity 0.3s ease'
  };

  const logButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 24px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
    zIndex: 1000,
    display: exportMode ? 'block' : 'none'
  };

  const logToastStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '500',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(46, 204, 113, 0.3)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    zIndex: 1001,
    transition: 'all 0.3s ease',
    animation: 'fadeInUp 0.3s ease'
  };

  const logToastsContainerStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  return (
    <div className="App">
      {/* Settings Panel */}
      <div style={settingsOverlayStyle} onClick={() => setSettingsOpen(false)}>
        <div style={settingsPanelStyle} onClick={(e) => e.stopPropagation()}>
          <div style={settingsHeaderStyle}>
            <h2 style={{ margin: 0 }}>Control Panel</h2>
            <button 
              onClick={() => setSettingsOpen(false)}
              style={closeButtonStyle}
              title="Close (Ctrl+K)"
            >
              ×
            </button>
          </div>
          
          {/* Empty content area */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '20px',
            color: 'white'
          }}>
            {/* Export Mode Section */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <h3 style={{ margin: 0, color: '#3498db' }}>Export Mode</h3>
                <label style={{ 
                  position: 'relative', 
                  display: 'inline-block', 
                  width: '50px', 
                  height: '24px'
                }}>
                  <input 
                    type="checkbox" 
                    checked={exportMode}
                    onChange={(e) => setExportMode(e.target.checked)}
                    style={{ 
                      opacity: 0, 
                      width: 0, 
                      height: 0 
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: exportMode ? '#3498db' : '#ccc',
                    transition: '.4s',
                    borderRadius: '24px',
                    border: '2px solid #3498db'
                  }}></span>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '16px',
                    width: '16px',
                    left: exportMode ? '26px' : '2px',
                    bottom: '2px',
                    backgroundColor: 'white',
                    transition: '.4s',
                    borderRadius: '50%'
                  }}></span>
                </label>
              </div>
              
              {/* Parameter Toggles */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '10px',
                fontSize: '0.9rem',
                opacity: exportMode ? 1 : 0.5,
                pointerEvents: exportMode ? 'auto' : 'none'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    disabled={!exportMode}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      opacity: exportMode ? 1 : 0.5
                    }} 
                  />
                  <span>Spot Price (S)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    disabled={!exportMode}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      opacity: exportMode ? 1 : 0.5
                    }} 
                  />
                  <span>Strike Price (K)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    disabled={!exportMode}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      opacity: exportMode ? 1 : 0.5
                    }} 
                  />
                  <span>Risk-Free Rate (R)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    disabled={!exportMode}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      opacity: exportMode ? 1 : 0.5
                    }} 
                  />
                  <span>Time to Maturity (T)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    disabled={!exportMode}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      opacity: exportMode ? 1 : 0.5
                    }} 
                  />
                  <span>Volatility (∑)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    disabled={!exportMode}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      opacity: exportMode ? 1 : 0.5
                    }} 
                  />
                  <span>Delta (∆)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    disabled={!exportMode}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      opacity: exportMode ? 1 : 0.5
                    }} 
                  />
                  <span>Gamma (Γ)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    disabled={!exportMode}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      opacity: exportMode ? 1 : 0.5
                    }} 
                  />
                  <span>Theta (ø)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Button */}
      <button 
        style={logButtonStyle}
        onClick={handleLogClick}
        onMouseEnter={(e) => {
          if (exportMode) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (exportMode) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
          }
        }}
      >
        Log
      </button>

      {/* Log Toasts */}
      <div style={logToastsContainerStyle}>
        {logToasts.map((toast, index) => (
          <div 
            key={toast.id}
            style={{
              ...logToastStyle,
              transform: `translateY(-${index * 50}px)`,
              opacity: 1 - (index * 0.1)
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Toast Notification */}
      <div style={toastStyle}>
        [Ctrl + K for Settings]
      </div>

      <header className="App-header">
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          marginBottom: '0px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          color: 'white'
        }}>
          Black-Scholes-Merton Pricing Model
        </h1>
        <h4 style ={{
          fontSize: '0.5rem', 
          fontWeight: '300', 
          marginBottom: '20px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          color: 'white'
        }}>By Sheng Chang Li | schangchang.li@gmail.com</h4>

        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: '30px'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: '20px', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexWrap: 'wrap'
          }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Spot Price (S)</label>
              <input 
                type="number" 
                name="S" 
                value={inputs.S} 
                onChange={handleChange} 
                required 
                step="any" 
                style={inputStyle}
                placeholder="100"
              />
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Strike Price (K)</label>
              <input 
                type="number" 
                name="K" 
                value={inputs.K} 
                onChange={handleChange} 
                required 
                step="any" 
                style={inputStyle}
                placeholder="100"
              />
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Risk-free Rate (r)</label>
              <input 
                type="number" 
                name="r" 
                value={inputs.r} 
                onChange={handleChange} 
                required 
                step="any" 
                style={inputStyle}
                placeholder="0.05"
              />
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Time to Maturity (t)</label>
              <input 
                type="number" 
                name="t" 
                value={inputs.t} 
                onChange={handleChange} 
                required 
                step="any" 
                style={inputStyle}
                placeholder="1"
              />
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Volatility (σ)</label>
              <input 
                type="number" 
                name="sig" 
                value={inputs.sig} 
                onChange={handleChange} 
                required 
                step="any" 
                style={inputStyle}
                placeholder="0.2"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{
              ...calculateButtonStyle,
              padding: '8px 16px',
              fontSize: '0.8rem',
              marginTop: '0px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            {loading ? 'Calculating...' : 'Calculate Prices'}
          </button>
        </form>
        
        {(results.call !== null || results.put !== null) && (
          <>
          <div style={{ 
            marginTop: '0em', 
            display: 'flex', 
            gap: '2em', 
            justifyContent: 'center', 
            flexWrap: 'wrap' 
          }}>
            <div style={callBoxStyle}>
              <div style={{ fontSize: '0.9em', marginBottom: '8px', opacity: 0.8 }}>
                <strong>CALL OPTION</strong>
              </div>
              <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>
                ${results.call?.toFixed(4)}
              </div>
            </div>
            <div style={putBoxStyle}>
              <div style={{ fontSize: '0.9em', marginBottom: '8px', opacity: 0.8 }}>
                <strong>PUT OPTION</strong>
              </div>
              <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>
                ${results.put?.toFixed(4)}
              </div>
            </div>
          </div>
          {results.greeks && (
            <div style={{
              marginTop: '1.5em',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5em',
              color: '#fff',
              fontWeight: 500
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '1em', 
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontSize: '0.9rem'
              }}>
                <span style={{ color: '#f39c12' }}>Δ Call: {results.greeks.deltaCall.toFixed(4)}</span>
                <span style={{ color: '#f39c12' }}>Δ Put: {results.greeks.deltaPut.toFixed(4)}</span>
                <span style={{ color: '#e67e22' }}>Γ: {results.greeks.gamma.toFixed(4)}</span>
                <span style={{ color: '#16a085' }}>Θ Call: {results.greeks.thetaCall.toFixed(4)}</span>
                <span style={{ color: '#16a085' }}>Θ Put: {results.greeks.thetaPut.toFixed(4)}</span>
              </div>
            </div>
          )}
          
          {(results.call !== null || results.put !== null) && (
            <div style={{
              marginTop: '2em',
              display: 'flex',
              gap: '2em',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{
                ...resultBoxStyle,
                borderColor: '#9b59b6',
                color: '#9b59b6',
                minWidth: '400px',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '0.9em', marginBottom: '8px', opacity: 0.8 }}>
                  <strong>HEATMAP 1</strong>
                </div>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                  Placeholder
                </div>
              </div>
              <div style={{
                ...resultBoxStyle,
                borderColor: '#3498db',
                color: '#3498db',
                minWidth: '400px',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '0.9em', marginBottom: '8px', opacity: 0.8 }}>
                  <strong>HEATMAP 2</strong>
                </div>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                  Placeholder
                </div>
              </div>
            </div>
          )}
          </>
        )}
        
        {error && (
          <div style={{ 
            marginTop: '1em', 
            color: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            padding: '15px 25px',
            borderRadius: '10px',
            border: '1px solid rgba(231, 76, 60, 0.3)'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
