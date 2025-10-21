import * as serviceWorker from './serviceWorker';
import React, { useState, createContext, useContext, useEffect, useRef } from 'react';import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  Link, 
  useLocation, 
  useParams,
  useNavigate 
} from 'react-router-dom';
import { AppProvider, useApp } from './AppContext';
import './App.css';

// Context para el tema
const ThemeContext = createContext();

// Hook personalizado para usar el tema
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
};

// Proveedor del tema
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('padel-theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('padel-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};



// Sistema de Toast Context (agregar esto después de los imports de React)
const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast-item ${toast.type}`}
            style={{
              background: toast.type === 'success' ? 'var(--secondary)' : 
                         toast.type === 'error' ? '#ef4444' : 
                         toast.type === 'warning' ? 'var(--accent)' : 'var(--primary)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '250px',
              maxWidth: '400px',
              animation: 'fadeInUp 0.3s ease-out'
            }}
          >
            <span style={{ fontSize: '18px' }}>
              {toast.type === 'success' ? '✅' : 
               toast.type === 'error' ? '❌' : 
               toast.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span style={{ flex: 1, fontSize: '14px' }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                opacity: 0.7,
                padding: '0',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de ToastProvider');
  }
  return context;
};

// Estilos con variables CSS para ambos temas + Animaciones Globales
const themeStyles = `
  :root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --secondary: #10b981;
    --accent: #f59e0b;
    --border-radius: 12px;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --transition: all 0.3s ease;
  }

  [data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --text-primary: #1f2937;
    --text-secondary: #2c293aff;
    --text-muted: #9ca3af;
    --border-color: #e5e7eb;
    --card-bg: rgba(255, 255, 255, 0.95);
    --nav-bg: rgba(255, 255, 255, 0.95);
    --glass-bg: rgba(255, 255, 255, 0.85);
    --team1-bg: linear-gradient(135deg, #fee2e2, #fecaca);
    --team1-border: #ef4444;
    --team1-text: #dc2626;
    --team2-bg: linear-gradient(135deg, #dbeafe, #e0f2fe);
    --team2-border: #3b82f6;
    --team2-text: #1d4ed8;
    --waiting-bg: rgba(245, 158, 11, 0.1);
    --waiting-border: #f59e0b;
    --waiting-text: #b45309;
  }

  [data-theme="dark"] {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-gradient: linear-gradient(135deg, #0f172a 0%, #334155 100%);
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --border-color: #334155;
    --card-bg: rgba(30, 41, 59, 0.95);
    --nav-bg: rgba(15, 23, 42, 0.95);
    --glass-bg: rgba(30, 41, 59, 0.85);
    --team1-bg: linear-gradient(135deg, #7f1d1d, #991b1b);
    --team1-border: #db6e6eff;
    --team1-text: #e98787ff;
    --team2-bg: linear-gradient(135deg, #1e3a8a, #1e40af);
    --team2-border: #3b82f6;
    --team2-text: #93c5fd;
    --waiting-bg: rgba(245, 158, 11, 0.15);
    --waiting-border: #d97706;
    --waiting-text: #fcd34d;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-gradient);
    min-height: 100vh;
    color: var(--text-primary);
  }

  .app-container {
    min-height: 100vh;
    background: var(--bg-gradient);
  }

  .glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -8px var(--primary);
  }

  .stat-card {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 20px;
    box-shadow: var(--shadow);
    border-left: 4px solid var(--primary);
    color: var(--text-primary);
  }

  .tournament-card {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 24px;
    box-shadow: var(--shadow);
    transition: var(--transition);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
  }

  .tournament-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .progress-bar {
    background: var(--border-color);
    border-radius: 10px;
    overflow: hidden;
    height: 8px;
  }

  .progress-fill {
    background: linear-gradient(90deg, var(--secondary), var(--accent));
    height: 100%;
    border-radius: 10px;
    transition: width 0.5s ease;
  }

  /* ===== ANIMACIONES GLOBALES ===== */
  
  /* Transiciones suaves para elementos interactivos */
  button, input, select, textarea, .glass-card, .tournament-card {
    transition: all 0.2s ease-in-out;
  }

  /* Animaciones de entrada */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Clases de animación reutilizables */
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out;
  }

  .animate-slideInLeft {
    animation: slideInLeft 0.5s ease-out;
  }

  .animate-scaleIn {
    animation: scaleIn 0.4s ease-out;
  }

  .animate-bounceIn {
    animation: bounceIn 0.8s ease-out;
  }

  /* Efectos hover mejorados */
  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }

  .hover-glow:hover {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  }

  /* Loading states */
  .skeleton-loading {
    background: linear-gradient(90deg, var(--border-color) 25%, var(--bg-secondary) 50%, var(--border-color) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: var(--border-radius);
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* Pulse animation para elementos importantes */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animate-pulse {
    animation: pulse 2s infinite;
  }

  /* Shake animation para errores */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }

  /* Fade in para contenido escalonado */
  .animate-stagger > * {
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
  .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
  .animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }
  .animate-stagger > *:nth-child(4) { animation-delay: 0.4s; }
  .animate-stagger > *:nth-child(5) { animation-delay: 0.5s; }

  /* Smooth page transitions */
  .page-enter {
    opacity: 0;
    transform: translateY(20px);
  }

  .page-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.4s, transform 0.4s;
  }

  /* Toast animations */
  .toast-item {
    animation: fadeInUp 0.3s ease-out;
  }

  .toast-item.exiting {
    animation: fadeInUp 0.3s ease-out reverse;
  }
`;

// Componente para transiciones entre páginas
const PageTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Pequeño delay para que la animación funcione correctamente
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={isVisible ? 'page-enter-active' : 'page-enter'}
      style={{
        minHeight: '100vh',
        width: '100%'
      }}
    >
      {children}
    </div>
  );
};

// Hook personalizado para navegación con transiciones
const useNavigation = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const navigateWithTransition = (to, options = {}) => {
    const { message, type = 'info', ...navOptions } = options;
    
    // Si hay mensaje, mostrar toast
    if (message) {
      addToast(message, type);
    }
    
    // Navegar después de un pequeño delay para la transición
    setTimeout(() => {
      navigate(to, navOptions);
    }, 150);
  };

  return { navigateWithTransition };
};

// Componente de Login
// Componente de Login - VERSIÓN MEJORADA
// Componente de Login - VERSIÓN SIMPLIFICADA (SOLO LOGIN Y REGISTRO)
// Componente de Login - VERSIÓN MEJORADA CON ANIMACIONES


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { actions, state } = useApp();
  const { addToast } = useToast();

  // Efecto para limpiar errores cuando cambia el formulario
  useEffect(() => {
    setFormErrors({});
  }, [isLogin, email, password, registerData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({});

    // Pequeña delay para mostrar la animación de loading
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = state.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Animación de éxito
      addToast('¡Bienvenido de nuevo! 👋', 'success');
      actions.login(user);
    } else {
      // Animación de error
      const loginForm = e.target;
      loginForm.classList.add('animate-shake');
      setTimeout(() => loginForm.classList.remove('animate-shake'), 500);
      
      setFormErrors({ general: 'Email o contraseña incorrectos' });
      addToast('Email o contraseña incorrectos', 'error');
    }
    
    setIsLoading(false);
  };

  const validateRegisterForm = () => {
    const errors = {};

    if (!registerData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }

    if (!registerData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = 'Email no válido';
    }

    if (!registerData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (registerData.password.length < 6) {
      errors.password = 'Mínimo 6 caracteres';
    }

    if (!registerData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = validateRegisterForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      addToast('Por favor corrige los errores del formulario', 'warning');
      setIsLoading(false);
      return;
    }

    // Verificar si el email ya existe
    const existingUser = state.users.find(u => u.email === registerData.email);
    if (existingUser) {
      setFormErrors({ email: 'Este email ya está registrado' });
      addToast('Este email ya está registrado', 'error');
      setIsLoading(false);
      return;
    }

    // Simular proceso de registro
    await new Promise(resolve => setTimeout(resolve, 1000));

    // En esta demo, mostramos mensaje y cambiamos a login
    addToast('¡Registro exitoso! Usa las credenciales de demo', 'success');
    setIsLogin(true);
    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
    setFormErrors({});
    setIsLoading(false);
  };

  if (state.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'var(--bg-gradient)'
    }}>
      <div className="glass-card animate-scaleIn hover-lift" style={{ 
        width: '100%', 
        maxWidth: '440px',
        padding: '40px',
        animation: 'scaleIn 0.6s ease-out',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Efecto de fondo animado */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, transparent 30%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)',
          animation: 'shimmer 3s infinite linear',
          pointerEvents: 'none'
        }}></div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          }
        `}</style>

        <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="animate-bounceIn" style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            borderRadius: '20px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
            boxShadow: 'var(--shadow-lg)',
            animation: 'bounceIn 0.8s ease-out'
          }}>
            🎾
          </div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Padel Pro
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '16px' 
          }}>
            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta gratuita'}
          </p>
        </div>

        {/* Pestañas Login/Registro */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div style={{ 
            display: 'flex', 
            marginBottom: '30px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius)',
            padding: '4px',
            position: 'relative'
          }} className="hover-lift">
            <button
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: isLogin ? 'var(--primary)' : 'transparent',
                color: isLogin ? 'white' : 'var(--text-secondary)',
                borderRadius: 'var(--border-radius)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition)',
                position: 'relative',
                zIndex: 2
              }}
              disabled={isLoading}
            >
              {isLoading && isLogin ? '⏳' : '🔐'} Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: !isLogin ? 'var(--primary)' : 'transparent',
                color: !isLogin ? 'white' : 'var(--text-secondary)',
                borderRadius: 'var(--border-radius)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition)',
                position: 'relative',
                zIndex: 2
              }}
              disabled={isLoading}
            >
              {isLoading && !isLogin ? '⏳' : '📝'} Registrarse
            </button>
          </div>
        </div>

        {/* Mensaje de error general */}
        {formErrors.general && (
          <div className="animate-shake" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '12px',
            borderRadius: 'var(--border-radius)',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            ❌ {formErrors.general}
          </div>
        )}

        {isLogin ? (
          // FORMULARIO DE LOGIN MEJORADO
          <form onSubmit={handleLogin} className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@email.com"
                required
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  border: `2px solid ${formErrors.general ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--border-radius)',
                  fontSize: '16px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = formErrors.general ? '#ef4444' : 'var(--border-color)'}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Contraseña
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  border: `2px solid ${formErrors.general ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--border-radius)',
                  fontSize: '16px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = formErrors.general ? '#ef4444' : 'var(--border-color)'}
              />
              
              {/* Demo credentials con mejor diseño */}
              <div className="animate-pulse" style={{ 
                marginTop: '12px', 
                padding: '12px',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--primary)'
              }}>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '0', fontWeight: '600' }}>
                  💡 Credenciales de demo:
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  juan@email.com / 123456
                </p>
              </div>
            </div>

            <button 
              type="submit"
              className="btn-primary hover-glow"
              style={{ 
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span style={{ opacity: 0 }}>🚀 Iniciar Sesión</span>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Procesando...
                  </div>
                </>
              ) : (
                '🚀 Iniciar Sesión'
              )}
            </button>
          </form>
        ) : (
          // FORMULARIO DE REGISTRO MEJORADO
          <form onSubmit={handleRegister} className="animate-stagger">
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Nombre Completo
              </label>
              <input 
                type="text" 
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                placeholder="Juan Pérez"
                required
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  border: `2px solid ${formErrors.name ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--border-radius)',
                  fontSize: '16px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)'
                }}
              />
              {formErrors.name && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  ❌ {formErrors.name}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Email
              </label>
              <input 
                type="email" 
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                placeholder="juan@email.com"
                required
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  border: `2px solid ${formErrors.email ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--border-radius)',
                  fontSize: '16px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)'
                }}
              />
              {formErrors.email && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  ❌ {formErrors.email}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Contraseña
              </label>
              <input 
                type="password" 
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                placeholder="••••••••"
                required
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  border: `2px solid ${formErrors.password ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--border-radius)',
                  fontSize: '16px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)'
                }}
              />
              {formErrors.password ? (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  ❌ {formErrors.password}
                </p>
              ) : (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Confirmar Contraseña
              </label>
              <input 
                type="password" 
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                placeholder="••••••••"
                required
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  border: `2px solid ${formErrors.confirmPassword ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--border-radius)',
                  fontSize: '16px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)'
                }}
              />
              {formErrors.confirmPassword && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  ❌ {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <button 
              type="submit"
              className="btn-primary hover-glow"
              style={{ 
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span style={{ opacity: 0 }}>📝 Crear Cuenta</span>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Creando cuenta...
                  </div>
                </>
              ) : (
                '📝 Crear Cuenta'
              )}
            </button>

            {/* Nota sobre el registro en demo */}
            <div style={{ 
              marginTop: '16px', 
              padding: '12px',
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--accent)'
            }}>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '0', fontWeight: '600' }}>
                💡 Nota importante:
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                En esta versión demo, el registro es simulado. Usa las credenciales de prueba para explorar todas las funciones.
              </p>
            </div>
          </form>
        )}

        {/* Información adicional */}
        <div className="animate-fadeInUp" style={{ 
          textAlign: 'center', 
          marginTop: '30px', 
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          animationDelay: '0.3s'
        }}>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {isLogin 
              ? '¿No tienes cuenta? ' 
              : '¿Ya tienes cuenta? '
            }
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
                transition: 'var(--transition)'
              }}
              onMouseOver={(e) => e.target.style.color = 'var(--primary-dark)'}
              onMouseOut={(e) => e.target.style.color = 'var(--primary)'}
              disabled={isLoading}
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>

        {/* Animación de spinner */}
        <style>{`
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}


// Componente de Navegación
// Componente de Navegación - VERSIÓN MEJORADA
// Componente de Navegación - VERSIÓN CORREGIDA
// Componente de Navegación - VERSIÓN ALINEADA A LA DERECHA
// Componente de Navegación - VERSIÓN SIMPLIFICADA Y FUNCIONAL
// Componente de Navegación - VERSIÓN CON MENÚ MÓVIL FUNCIONAL
// Componente de Navegación - VERSIÓN MEJORADA CON TRANSICIONES
// Componente de Navegación - BARRA INFERIOR FIJAmport { useLocation, useNavigate } from 'react-router-dom';
// Componente de Navegación - VERSIÓN CORREGIDA
// Componente de Navegación - VERSIÓN CORREGIDA SIN ESPACIOS EXTRA
// Componente de Navegación - VERSIÓN FINAL CON BOTÓN DE TEXTO Y BARRA MÁS GRANDE


function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const { addToast } = useToast();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠', desktopIcon: '🏠 Home' },
    { path: '/tournaments', label: 'Torneos', icon: '🏆', desktopIcon: '🏆 Torneos' },
    { path: '/clubs', label: 'Clubes', icon: '🏢', desktopIcon: '🏢 Clubes' },
    { path: '/profile', label: 'Perfil', icon: '👤', desktopIcon: '👤 Perfil' }
  ];

  const handleNavigation = (path, label) => {
    navigate(path);
  };

  const handleCreateTournament = () => {
    navigate('/tournaments');
    setTimeout(() => {
      addToast('¡Crea un nuevo torneo! 🏆', 'info');
    }, 300);
  };

  return (
    <>
      <style>{`
        /* BARRA DE NAVEGACIÓN INFERIOR - MÁS GRANDE EN MÓVIL */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--nav-bg);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 12px 0; /* Aumentado padding vertical */
          z-index: 1000;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
          height: 80px; /* Aumentada altura */
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px 12px; /* Aumentado padding */
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 12px;
          min-width: 70px; /* Aumentado ancho mínimo */
          position: relative;
          flex: 1;
          margin: 0 4px;
        }

        .nav-item.active {
          background: rgba(99, 102, 241, 0.15);
          transform: translateY(-2px);
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          top: -10px; /* Ajustado para nueva altura */
          width: 24px;
          height: 3px;
          background: var(--primary);
          border-radius: 2px;
        }

        .nav-icon {
          font-size: 22px; /* Iconos más grandes */
          margin-bottom: 6px; /* Más espacio entre icono y texto */
          transition: all 0.3s ease;
        }

        .nav-item.active .nav-icon {
          transform: scale(1.1);
        }

        .nav-label {
          font-size: 12px; /* Texto más grande */
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }

        .nav-item.active .nav-label {
          color: var(--primary);
          font-weight: 700;
        }

        .nav-item:hover {
          background: rgba(99, 102, 241, 0.1);
          transform: translateY(-1px);
        }

        /* HEADER SUPERIOR */
        .top-header {
          background: var(--nav-bg);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          padding: 12px 16px;
          position: sticky;
          top: 0;
          z-index: 999;
          height: 60px;
          display: flex;
          align-items: center;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 18px;
          cursor: pointer;
        }

        .logo-icon {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          padding: 8px;
          border-radius: 10px;
          font-size: 16px;
          width: 36px;
          height: 36px;
          display: flex;
          alignItems: center;
          justifyContent: center;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
        }

        /* BOTÓN CREAR TORNEO - SIEMPRE CON TEXTO VISIBLE */
        .create-tournament-btn {
          background: linear-gradient(135deg, var(--secondary), #0da371);
          color: white;
          border: none;
          padding: 10px 18px; /* Un poco más grande */
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          box-shadow: var(--shadow);
          white-space: nowrap; /* Evita que el texto se rompa */
        }

        .create-tournament-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -8px var(--secondary);
        }

        .create-tournament-btn:active {
          transform: translateY(0);
        }

        /* RESPONSIVE MEJORADO */
        @media (max-width: 768px) {
          .top-header {
            padding: 10px 12px;
            height: 56px;
          }
          
          .logo-text {
            display: none;
          }
          
          .logo-icon {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }
          
          /* EN MÓVIL EL BOTÓN MANTIENE EL TEXTO PERO MÁS COMPACTO */
          .create-tournament-btn {
            padding: 8px 12px;
            font-size: 13px;
            gap: 6px;
          }
          
          /* BARRA INFERIOR AÚN MÁS GRANDE EN MÓVIL */
          .bottom-nav {
            height: 85px; /* Más alta en móvil */
            padding: 14px 0; /* Más padding */
          }
          
          .nav-item {
            padding: 12px 10px; /* Más espacio táctil */
            min-width: 65px;
          }
          
          .nav-icon {
            font-size: 24px; /* Iconos más grandes en móvil */
            margin-bottom: 8px;
          }
          
          .nav-label {
            font-size: 13px; /* Texto más legible */
          }
        }

        @media (max-width: 480px) {
          .nav-item {
            min-width: 60px;
            padding: 10px 8px;
          }
          
          .nav-icon {
            font-size: 22px;
          }
          
          .nav-label {
            font-size: 12px;
          }
          
          /* BOTÓN MÁS COMPACTO EN PANTALLAS MUY PEQUEÑAS */
          .create-tournament-btn {
            padding: 7px 10px;
            font-size: 12px;
          }
          
          .create-tournament-btn span:first-child {
            margin-right: 4px;
          }
        }

        @media (max-width: 360px) {
          /* PARA PANTALLAS MUY PEQUEÑAS, TEXTO MÁS COMPACTO PERO VISIBLE */
          .create-tournament-btn {
            padding: 6px 8px;
            font-size: 11px;
          }
          
          .create-tournament-btn span:last-child {
            display: inline; /* SIEMPRE visible */
          }
        }
      `}</style>

      {/* Header Superior */}
      <div className="top-header">
        <div className="header-content">
          <div 
            onClick={() => handleNavigation('/dashboard', 'Dashboard')}
            className="logo-container"
          >
            <div className="logo-icon">🎾</div>
            <span className="logo-text">Padel Pro</span>
          </div>
          
          {/* Botón Crear Torneo - SIEMPRE con texto visible */}
          <button 
            onClick={handleCreateTournament}
            className="create-tournament-btn"
          >
            <span>🏆</span>
            <span>Crear Torneo</span>
          </button>
        </div>
      </div>

      {/* Barra de Navegación Inferior - MÁS GRANDE */}
      <nav className="bottom-nav">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/dashboard' && location.pathname === '/');
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path, item.label)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
// Componente de Dashboard
// Componente de Dashboard - VERSIÓN CORREGIDA Y MEJORADA


function Dashboard() {
  const { state, getters } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const { addToast } = useToast();
  const toastShownRef = useRef(false); // Para controlar el toast de bienvenida
  const { navigateWithTransition } = useNavigation();
  const userStats = getters.getUserStats();
  const activeTournaments = getters.getActiveTournaments();
  const recentMatches = getRecentMatches();
  const activeClub = getters.getActiveClub();

  // Simular carga de datos con mejor UX
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simular tiempo de carga variable (más realista)
        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
        
        setIsLoading(false);
        
        // Pequeño delay para mostrar las animaciones de contenido
        setTimeout(() => {
          setContentLoaded(true);
          
          // Mostrar toast de bienvenida solo una vez
          if (activeClub && !toastShownRef.current) {
            
            toastShownRef.current = true;
          }
        }, 100);
      } catch (error) {
        setIsLoading(false);
        addToast('Error cargando el dashboard', 'error');
      }
    };

    loadData();
  }, [activeClub, addToast]);

  // Obtener partidos recientes del usuario
  function getRecentMatches() {
    const matches = [];
    const userTournaments = getters.getTournamentsByClub();
    
    userTournaments.forEach(tournament => {
      tournament.matches.forEach(match => {
        if (match.status === 'completed' && 
            (match.team1.includes(state.currentUser?.id) || match.team2.includes(state.currentUser?.id))) {
          matches.push({
            ...match,
            tournamentName: tournament.name,
            date: match.createdAt
          });
        }
      });
    });

    return matches
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }

  // Obtener torneos activos donde participa el usuario
  const userActiveTournaments = activeTournaments.filter(tournament => 
    tournament.players.includes(state.currentUser?.id) || 
    tournament.guestPlayers.some(guest => guest.includes(state.currentUser?.name))
  );

  // Calcular estadísticas globales mejoradas
  const calculateEnhancedStats = () => {
    if (!userStats) return null;

    const userTournaments = getters.getTournamentsByClub();
    let totalMatches = 0;
    let totalWins = 0;
    let totalPoints = 0;

    userTournaments.forEach(tournament => {
      tournament.matches.forEach(match => {
        if (match.status === 'completed' && 
            (match.team1.includes(state.currentUser?.id) || match.team2.includes(state.currentUser?.id))) {
          totalMatches++;
          
          const userTeam = match.team1.includes(state.currentUser?.id) ? 'team1' : 'team2';
          const userScore = userTeam === 'team1' ? match.scoreTeam1 : match.scoreTeam2;
          const opponentScore = userTeam === 'team1' ? match.scoreTeam2 : match.scoreTeam1;
          
          totalPoints += userScore;
          if (userScore > opponentScore) {
            totalWins++;
          }
        }
      });
    });

    const winRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;
    const avgPointsPerMatch = totalMatches > 0 ? (totalPoints / totalMatches).toFixed(1) : 0;

    return {
      totalMatches,
      totalWins,
      totalLosses: totalMatches - totalWins,
      totalPoints,
      winRate: Math.round(winRate),
      avgPointsPerMatch,
      clubsCount: getters.getUserClubs().length,
      tournamentsCount: userTournaments.length,
      activeTournamentsCount: userActiveTournaments.length
    };
  };

  // Calcular ranking de miembros del club
  const calculateClubRanking = () => {
    if (!activeClub) return [];
    
    const memberStats = [];
    
    activeClub.members.forEach(memberId => {
      const member = state.users.find(user => user.id === memberId);
      if (!member) return;
      
      let totalMatches = 0;
      let totalPoints = 0;
      let totalWins = 0;
      
      activeTournaments.forEach(tournament => {
        tournament.matches.forEach(match => {
          if (match.status === 'completed' && 
              (match.team1.includes(memberId) || match.team2.includes(memberId))) {
            totalMatches++;
            
            const userTeam = match.team1.includes(memberId) ? 'team1' : 'team2';
            const userScore = userTeam === 'team1' ? match.scoreTeam1 : match.scoreTeam2;
            const opponentScore = userTeam === 'team1' ? match.scoreTeam2 : match.scoreTeam1;
            
            totalPoints += userScore;
            if (userScore > opponentScore) {
              totalWins++;
            }
          }
        });
      });
      
      const avgPointsPerMatch = totalMatches > 0 ? (totalPoints / totalMatches).toFixed(1) : 0;
      const winRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;
      
      memberStats.push({
        id: memberId,
        name: member.name,
        avatar: member.avatar,
        profilePicture: member.profilePicture,
        totalMatches,
        totalPoints,
        totalWins,
        avgPointsPerMatch: parseFloat(avgPointsPerMatch),
        winRate: Math.round(winRate),
        isCurrentUser: memberId === state.currentUser?.id
      });
    });
    
    return memberStats
      .sort((a, b) => {
        if (b.avgPointsPerMatch !== a.avgPointsPerMatch) {
          return b.avgPointsPerMatch - a.avgPointsPerMatch;
        }
        return b.winRate - a.winRate;
      })
      .slice(0, 3);
  };

  const enhancedStats = calculateEnhancedStats();
  const topRanking = calculateClubRanking();

  // Estado para controlar el formulario de torneo
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [newTournament, setNewTournament] = useState({ 
    name: '', 
    players: [],
    guestPlayers: [] 
  });

  // Componente de Skeleton Loading Mejorado
  const DashboardSkeleton = () => (
    <div style={{ 
      minHeight: 'calc(100vh - 140px)', // Altura ajustada
      background: 'var(--bg-gradient)',
      padding: '20px',
      paddingTop: '10px', // REDUCIDO padding superior
      overflowX: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .skeleton-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="dashboard-container">
        {/* Skeleton Header */}
        <div style={{ marginBottom: '30px', width: '100%' }}>
          <div className="skeleton-loading skeleton-pulse" style={{
            height: '40px',
            width: '300px',
            marginBottom: '12px',
            borderRadius: 'var(--border-radius)'
          }}></div>
          <div className="skeleton-loading skeleton-pulse" style={{
            height: '20px',
            width: '70%',
            borderRadius: 'var(--border-radius)'
          }}></div>
        </div>

        {/* Skeleton Grid - RESTAURADO */}
        <div className="dashboard-grid" style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card" style={{ padding: '20px' }}>
              <div className="skeleton-loading skeleton-pulse" style={{
                height: '20px',
                width: '140px',
                marginBottom: '20px',
                borderRadius: 'var(--border-radius)'
              }}></div>
              <div className="skeleton-loading skeleton-pulse" style={{
                height: '60px',
                marginBottom: '15px',
                borderRadius: 'var(--border-radius)'
              }}></div>
              <div className="skeleton-loading skeleton-pulse" style={{
                height: '15px',
                width: '80%',
                borderRadius: 'var(--border-radius)'
              }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      padding: '20px',
      overflowX: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <style>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          width: 100%;
        }
        
        .dashboard-card {
          width: 100%;
          margin-bottom: 0;
        }
        
        .club-card {
          grid-column: span 2;
        }
        
        .ranking-card {
          grid-column: span 1;
        }
        
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .club-card {
            grid-column: span 1;
          }
        }
      `}</style>
      
      <div className="dashboard-container">
        {/* Header del Dashboard con Animación */}
        <div className={`animate-fadeInUp ${contentLoaded ? 'animate-fadeInUp' : ''}`} style={{ 
          marginBottom: '30px',
          width: '100%'
        }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: '8px',
            wordWrap: 'break-word'
          }}>
            🏠 Mi Dashboard
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '16px',
            lineHeight: '1.4',
            wordWrap: 'break-word'
          }}>
            {activeClub 
              ? `Club activo: ${activeClub.name} • ${activeClub.members.length} miembros • ${activeTournaments.length} torneos activos`
              : 'Selecciona un club activo para empezar'
            }
          </p>
        </div>

        {/* Grid Principal con NUEVO ORDEN */}
        <div className={`dashboard-grid animate-stagger ${contentLoaded ? 'animate-stagger' : ''}`}>
          

          {/* 2. MIS ESTADÍSTICAS */}
          {enhancedStats && (
            <div className="glass-card dashboard-card hover-lift" style={{ 
              padding: '20px',
              width: '100%',
              boxSizing: 'border-box',
              animationDelay: '0.2s'
            }}>
              <h2 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '16px',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📊 Mis Estadísticas
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="animate-scaleIn" style={{ 
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '12px',
                  borderRadius: 'var(--border-radius)',
                  textAlign: 'center',
                  animation: 'scaleIn 0.5s ease-out',
                  animationDelay: '0.3s',
                  borderLeft: '3px solid var(--primary)'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: 'var(--primary)',
                    marginBottom: '4px'
                  }}>
                    {enhancedStats.totalMatches}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--text-secondary)',
                    fontWeight: '600'
                  }}>
                    Partidos
                  </div>
                </div>
                
                <div className="animate-scaleIn" style={{ 
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '12px',
                  borderRadius: 'var(--border-radius)',
                  textAlign: 'center',
                  animation: 'scaleIn 0.5s ease-out',
                  animationDelay: '0.4s',
                  borderLeft: '3px solid var(--secondary)'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: 'var(--secondary)',
                    marginBottom: '4px'
                  }}>
                    {enhancedStats.winRate}%
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--text-secondary)',
                    fontWeight: '600'
                  }}>
                    Victorias
                  </div>
                </div>
                
                <div className="animate-scaleIn" style={{ 
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '12px',
                  borderRadius: 'var(--border-radius)',
                  textAlign: 'center',
                  animation: 'scaleIn 0.5s ease-out',
                  animationDelay: '0.5s',
                  borderLeft: '3px solid var(--accent)'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: 'var(--accent)',
                    marginBottom: '4px'
                  }}>
                    {enhancedStats.avgPointsPerMatch}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--text-secondary)',
                    fontWeight: '600'
                  }}>
                    Puntos/Partido
                  </div>
                </div>
                
                <div className="animate-scaleIn" style={{ 
                  background: 'rgba(139, 92, 246, 0.1)',
                  padding: '12px',
                  borderRadius: 'var(--border-radius)',
                  textAlign: 'center',
                  animation: 'scaleIn 0.5s ease-out',
                  animationDelay: '0.6s',
                  borderLeft: '3px solid #8b5cf6'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#8b5cf6',
                    marginBottom: '4px'
                  }}>
                    {enhancedStats.activeTournamentsCount}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--text-secondary)',
                    fontWeight: '600'
                  }}>
                    Torneos Activos
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. TOP RANKING DEL CLUB */}
          {activeClub && topRanking.length > 0 && (
            <div className="glass-card dashboard-card ranking-card hover-lift" style={{ 
              padding: '20px',
              width: '100%',
              boxSizing: 'border-box',
              animationDelay: '0.3s'
            }}>
              <h2 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '16px',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🏆 Top Ranking
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topRanking.map((player, index) => {
                  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                  const isCurrentUser = player.isCurrentUser;
                  
                  return (
                    <div key={player.id} className="animate-fadeInUp" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: isCurrentUser ? 'rgba(99, 102, 241, 0.1)' : 'var(--card-bg)',
                      borderRadius: 'var(--border-radius)',
                      border: isCurrentUser ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      position: 'relative',
                      animationDelay: `${0.4 + index * 0.1}s`
                    }}>
                      {/* Medalla/Número */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: index === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 
                                    index === 1 ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 
                                    'linear-gradient(135deg, #b45309, #92400e)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '14px',
                        flexShrink: 0
                      }}>
                        {medal}
                      </div>

                      {/* Avatar */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: player.profilePicture ? 
                          `url(${player.profilePicture}) center/cover` :
                          'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: player.profilePicture ? '0' : '14px',
                        fontWeight: '600',
                        border: '2px solid var(--card-bg)',
                        flexShrink: 0
                      }}>
                        {!player.profilePicture && player.avatar}
                      </div>

                      {/* Información del Jugador */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          marginBottom: '4px'
                        }}>
                          <span style={{ 
                            color: 'var(--text-primary)', 
                            fontWeight: '600',
                            fontSize: '14px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {player.name}
                          </span>
                          {isCurrentUser && (
                            <span style={{ 
                              background: 'var(--primary)', 
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '8px',
                              fontSize: '10px',
                              fontWeight: '600'
                            }}>
                              Tú
                            </span>
                          )}
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          gap: '8px',
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          flexWrap: 'wrap'
                        }}>
                          <span>🎯 {player.avgPointsPerMatch} pts/partido</span>
                          <span>📊 {player.winRate}% victorias</span>
                        </div>
                      </div>

                      {/* Puntuación destacada */}
                      <div style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        flexShrink: 0
                      }}>
                        #{index + 1}
                      </div>
                    </div>
                  );
                })}
                
                {/* Link para ver ranking completo */}
                <div style={{ 
                  textAlign: 'center',
                  marginTop: '8px'
                }}>
                  <Link 
                    to="/tournaments" 
                    className="hover-glow"
                    style={{
                      color: 'var(--primary)',
                      fontSize: '12px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 12px',
                      borderRadius: 'var(--border-radius)',
                      transition: 'var(--transition)'
                    }}
                  >
                    Ver ranking completo →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 4. CLUB ACTIVO */}
          {activeClub && (
            <div className="glass-card dashboard-card club-card hover-lift" style={{ 
              padding: '20px',
              width: '100%',
              boxSizing: 'border-box',
              animationDelay: '0.4s'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <h2 style={{ 
                  color: 'var(--text-primary)', 
                  margin: '0',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🏢 Club Activo
                </h2>
                <span style={{ 
                  background: 'var(--primary)', 
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}>
                  ✅ Activo
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div className="animate-bounceIn" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  alignSelf: 'center',
                  animation: 'bounceIn 0.6s ease-out'
                }}>
                  🎾
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ 
                    color: 'var(--text-primary)', 
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: '700'
                  }}>
                    {activeClub.name}
                  </h3>
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    margin: '0 0 12px 0',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {activeClub.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    alignItems: 'center'
                  }}>
                    <span>👥 {activeClub.members.length} miembros</span>
                    <span>🏆 {activeTournaments.length} torneos activos</span>
                    <span>📅 Creado {new Date(activeClub.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Link 
                  to="/clubs" 
                  className="btn-primary hover-glow"
                  style={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    fontSize: '14px'
                  }}
                >
                  ⚙️ Gestionar Club
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Estado sin club activo */}
        {!activeClub && (
          <div className="glass-card animate-fadeInUp" style={{ 
            padding: '30px 20px',
            textAlign: 'center',
            marginTop: '20px',
            width: '100%',
            boxSizing: 'border-box',
            animationDelay: '0.3s'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
            <h2 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '12px',
              fontSize: '20px'
            }}>
              No tienes un club activo
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '20px',
              fontSize: '14px',
              lineHeight: '1.4'
            }}>
              Selecciona un club activo o únete a uno para empezar a jugar torneos y guardar tus estadísticas
            </p>
            <Link 
              to="/clubs" 
              className="btn-primary hover-glow"
              style={{ 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                fontSize: '14px'
              }}
            >
              🏢 Gestionar Clubes
            </Link>
          </div>
        )}

        {/* Sección de Soporte - Versión Compacta */}
        <div className="glass-card animate-fadeInUp" style={{ 
          padding: '20px',
          marginTop: '25px',
          width: '100%',
          boxSizing: 'border-box',
          animationDelay: '0.5s',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: 'white'
              }}>
                ❤️
              </div>
              <div>
                <h4 style={{ 
                  color: 'var(--text-primary)', 
                  margin: '0 0 4px 0',
                  fontSize: '15px',
                  fontWeight: '600'
                }}>
                  Apoya Padel Pro
                </h4>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  margin: '0',
                  fontSize: '12px'
                }}>
                  Ayuda a mejorar la aplicación
                </p>
              </div>
            </div>
            
            <button
              onClick={() => window.open('https://www.paypal.com/paypalme/alcalius?locale.x=en_US&country.x=MX', '_blank')}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                background: 'linear-gradient(135deg, #0070ba, #1546a0)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
              className="hover-glow"
            >
              <span>💙</span>
              Donar
            </button>
          </div>
        </div>



      </div>

      {/* Modal para crear torneo desde el dashboard */}
      {showCreateTournament && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="glass-card animate-scaleIn" style={{ 
            padding: '30px', 
            maxWidth: '500px', 
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
              🏆 Crear Nuevo Torneo
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Serás redirigido a la página de torneos para configurar tu nuevo torneo.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Link 
                to="/tournaments" 
                className="btn-primary"
                onClick={() => setShowCreateTournament(false)}
                style={{ textDecoration: 'none' }}
              >
                Continuar
              </Link>
              <button 
                onClick={() => setShowCreateTournament(false)}
                style={{
                  padding: '12px 24px',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de Gestión de Clubes
// Componente de Gestión de Clubes - VERSIÓN MEJORADA
function ClubManagement() {
  const { state, actions, getters } = useApp();
  const { currentUser } = state;
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'manage', 'edit', 'changePassword'
  const [selectedClub, setSelectedClub] = useState(null);
  const [newClub, setNewClub] = useState({ name: '', description: '', password: '' });
  const [joinClub, setJoinClub] = useState({ clubId: '', password: '' });
  const [editClub, setEditClub] = useState({ name: '', description: '' });
  const [newPassword, setNewPassword] = useState('');

  const userClubs = getters.getUserClubs();

  // Función para crear club
  const handleCreateClub = (e) => {
    e.preventDefault();
    actions.createClub(newClub);
    setShowCreateForm(false);
    setNewClub({ name: '', description: '', password: '' });
  };

  // Función para unirse a club
  const handleJoinClub = (e) => {
    e.preventDefault();
    
    const club = state.clubs.find(c => c.id === parseInt(joinClub.clubId));
    
    if (!club) {
      alert('Club no encontrado');
      return;
    }
    
    if (club.password !== joinClub.password) {
      alert('Contraseña incorrecta');
      return;
    }
    
    if (club.members.some(member => member.id === currentUser.id)) {
      alert('Ya eres miembro de este club');
      return;
    }
    
    actions.joinClub(currentUser.id, club.id);
    setShowJoinForm(false);
    setJoinClub({ clubId: '', password: '' });
    alert('¡Te has unido al club exitosamente!');
  };

  // Función para salir del club
  const handleLeaveClub = (clubId) => {
    const club = state.clubs.find(c => c.id === clubId);
    const isAdmin = getters.isClubAdmin(clubId);
    
    if (isAdmin && club.members.length > 1) {
      alert('No puedes salir del club siendo administrador y con otros miembros. Primero transfiere la administración.');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres salir de este club? Esta acción no se puede deshacer.')) {
      actions.leaveClub(currentUser.id, clubId);
      alert('Has salido del club exitosamente');
    }
  };

  // Función para activar club
  const handleSetActiveClub = (clubId) => {
    actions.setActiveClub(currentUser.id, clubId);
  };

  // Función para abrir modal de gestión
  const openManageModal = (club) => {
    setSelectedClub(club);
    setActiveModal('manage');
    setEditClub({ name: club.name, description: club.description });
  };

  // Función para guardar cambios del club
  const handleSaveClubChanges = (e) => {
    e.preventDefault();
    actions.updateClub(selectedClub.id, editClub);
    setActiveModal(null);
    setSelectedClub(null);
    alert('Club actualizado correctamente');
  };

  // Función para cambiar contraseña del club
  const handleChangePassword = (e) => {
    e.preventDefault();
    actions.updateClub(selectedClub.id, { password: newPassword });
    setActiveModal(null);
    setSelectedClub(null);
    setNewPassword('');
    alert('Contraseña actualizada correctamente');
  };

  // Función para eliminar miembro
  const handleRemoveMember = (memberId) => {
    if (memberId === currentUser.id) {
      alert('No puedes eliminarte a ti mismo. Usa la opción "Salir del Club".');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar a este miembro del club?')) {
      actions.removeMemberFromClub(selectedClub.id, memberId);
      alert('Miembro eliminado correctamente');
    }
  };

  // Obtener clubes disponibles para unirse (donde no es miembro)
  const availableClubs = state.clubs.filter(club => 
    !club.members.some(member => member.id === currentUser.id)
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      padding: '20px'
    }}>
      <style>{themeStyles}</style>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: 'var(--text-primary)',
          marginBottom: '30px'
        }}>
          🏢 Gestión de Clubes
        </h1>

        {/* Botones de Acción Principal */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            🆕 Crear Nuevo Club
          </button>
          
          <button 
            onClick={() => setShowJoinForm(true)}
            style={{
              padding: '12px 24px',
              border: '2px solid var(--secondary)',
              borderRadius: 'var(--border-radius)',
              background: 'var(--secondary)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'var(--transition)'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            ➕ Unirse a Club
          </button>
        </div>

        {/* Formulario de Crear Club */}
        {showCreateForm && (
          <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
              Crear Nuevo Club
            </h3>
            <form onSubmit={handleCreateClub}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Nombre del Club *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Club Pádel Madrid"
                  value={newClub.name}
                  onChange={(e) => setNewClub({...newClub, name: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Descripción
                </label>
                <textarea
                  placeholder="Describe tu club..."
                  value={newClub.description}
                  onChange={(e) => setNewClub({...newClub, description: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Contraseña para Unirse *
                </label>
                <input
                  type="text"
                  placeholder="Crea una contraseña para el club"
                  value={newClub.password}
                  onChange={(e) => setNewClub({...newClub, password: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Los miembros necesitarán esta contraseña para unirse al club
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary">
                  🏆 Crear Club
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    padding: '12px 24px',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulario para Unirse a Club */}
        {showJoinForm && (
          <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
              Unirse a un Club Existente
            </h3>
            <form onSubmit={handleJoinClub}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Seleccionar Club
                </label>
                <select
                  value={joinClub.clubId}
                  onChange={(e) => setJoinClub({...joinClub, clubId: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                >
                  <option value="">Selecciona un club...</option>
                  {availableClubs.map(club => (
                    <option key={club.id} value={club.id}>
                      {club.name} ({club.members.length} miembros)
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Contraseña del Club
                </label>
                <input
                  type="password"
                  placeholder="Ingresa la contraseña del club"
                  value={joinClub.password}
                  onChange={(e) => setJoinClub({...joinClub, password: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary">
                  ✅ Unirse al Club
                </button>
                <button 
                  type="button"
                  onClick={() => setShowJoinForm(false)}
                  style={{
                    padding: '12px 24px',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}


        {/* Lista de Clubes del Usuario - VERSIÓN MEJORADA */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              margin: '0',
              fontSize: '24px'
            }}>
              🏢 Mis Clubes ({userClubs.length})
            </h3>
            
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              alignItems: 'center',
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)' 
                }}></div>
                <span>Club Activo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: 'var(--accent)' 
                }}></div>
                <span>Administrador</span>
              </div>
            </div>
          </div>
          
          {userClubs.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏢</div>
              <h4 style={{ marginBottom: '12px', fontSize: '20px' }}>No perteneces a ningún club</h4>
              <p style={{ marginBottom: '24px' }}>Crea un nuevo club o únete a uno existente para empezar</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  🆕 Crear Club
                </button>
                <button 
                  onClick={() => setShowJoinForm(true)}
                  style={{
                    padding: '12px 24px',
                    border: '2px solid var(--secondary)',
                    borderRadius: 'var(--border-radius)',
                    background: 'var(--secondary)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  ➕ Unirse a Club
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {userClubs.map(club => {
                const isAdmin = getters.isClubAdmin(club.id);
                const isActive = club.id === currentUser.activeClub;
                const memberCount = club.members.length;
                
                return (
                  <div key={club.id} style={{
                    padding: '24px',
                    border: `2px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--border-radius)',
                    background: isActive ? 'rgba(99, 102, 241, 0.05)' : 'var(--card-bg)',
                    position: 'relative',
                    transition: 'var(--transition)',
                    boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.1)' : 'var(--shadow)'
                  }}>
                    {/* Header del Club */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                      gap: '16px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          marginBottom: '8px',
                          flexWrap: 'wrap'
                        }}>
                          <h4 style={{ 
                            color: 'var(--text-primary)', 
                            margin: '0',
                            fontSize: '18px',
                            fontWeight: '700'
                          }}>
                            {club.name}
                          </h4>
                          
                          {/* Badges de Estado */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {isActive && (
                              <span style={{ 
                                background: 'var(--primary)', 
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span></span> Activo
                              </span>
                            )}
                            {isAdmin && (
                              <span style={{ 
                                background: 'var(--accent)', 
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span>👑</span> Administrador
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p style={{ 
                          color: 'var(--text-secondary)', 
                          fontSize: '14px', 
                          margin: '0 0 12px 0',
                          lineHeight: '1.5'
                        }}>
                          {club.description || 'Sin descripción'}
                        </p>
                        
                        {/* Información del Club */}
                        <div style={{ 
                          display: 'flex', 
                          gap: '16px',
                          alignItems: 'center',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            color: 'var(--text-muted)',
                            fontSize: '13px'
                          }}>
                            <span>👥</span>
                            <span>{memberCount} miembro{memberCount !== 1 ? 's' : ''}</span>
                          </div>
                          
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            color: 'var(--text-muted)',
                            fontSize: '13px'
                          }}>
                            <span>📅</span>
                            <span>Creado {new Date(club.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Línea separadora */}
                    <div style={{ 
                      height: '1px', 
                      background: 'var(--border-color)', 
                      margin: '16px 0'
                    }}></div>

                    {/* Botones de Acción */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}>
                      {/* Botón Activar/Desactivar */}
                      {!isActive ? (
                        <button
                          onClick={() => handleSetActiveClub(club.id)}
                          style={{
                            padding: '10px 18px',
                            border: '1px solid var(--primary)',
                            borderRadius: 'var(--border-radius)',
                            background: 'transparent',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'var(--transition)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = 'var(--primary)';
                            e.target.style.color = 'white';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--primary)';
                          }}
                        >
                          <span></span>
                          Activar Club
                        </button>
                      ) : (
                        <span style={{ 
                          background: 'rgba(99, 102, 241, 0.1)', 
                          color: 'var(--primary)',
                          padding: '10px 18px',
                          borderRadius: 'var(--border-radius)',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: '1px solid var(--primary)'
                        }}>
                          <span></span>
                          Club Activo
                        </span>
                      )}
                      
                      {/* Botón Gestionar (Solo Admin) */}
                      {isAdmin && (
                        <button
                          onClick={() => openManageModal(club)}
                          style={{
                            padding: '10px 18px',
                            border: '1px solid var(--accent)',
                            borderRadius: 'var(--border-radius)',
                            background: 'transparent',
                            color: 'var(--accent)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'var(--transition)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = 'var(--accent)';
                            e.target.style.color = 'white';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--accent)';
                          }}
                        >
                          <span></span>
                          Gestionar
                        </button>
                      )}
                      
                      {/* Botón Salir */}
                      <button
                        onClick={() => handleLeaveClub(club.id)}
                        style={{
                          padding: '10px 18px',
                          border: '1px solid #ef4444',
                          borderRadius: 'var(--border-radius)',
                          background: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'var(--transition)',
                          marginLeft: 'auto'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#ef4444';
                          e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#ef4444';
                        }}
                      >
                        <span></span>
                        Salir del Club
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>        
      </div>


{/* Modal de Gestión de Club (Solo para Admins) */}
{activeModal && selectedClub && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px'
  }}>
    <div className="glass-card" style={{ 
      padding: '30px', 
      maxWidth: '500px', 
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      {activeModal === 'manage' && (
        <>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
            ⚙️ Gestionar Club: {selectedClub.name}
          </h3>
          
          {/* Información del Club */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
              Información del Club
            </h4>
            <form onSubmit={handleSaveClubChanges}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Nombre del Club
                </label>
                <input
                  type="text"
                  value={editClub.name}
                  onChange={(e) => setEditClub({...editClub, name: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Descripción
                </label>
                <textarea
                  value={editClub.description}
                  onChange={(e) => setEditClub({...editClub, description: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ marginBottom: '20px' }}>
                💾 Guardar Cambios
              </button>
            </form>
            
            <button
              onClick={() => setActiveModal('changePassword')}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid var(--accent)',
                borderRadius: 'var(--border-radius)',
                background: 'transparent',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontWeight: '600',
                marginBottom: '20px'
              }}
            >
              🔑 Cambiar Contraseña
            </button>
          </div>

          {/* Gestión de Miembros - VERSIÓN CORREGIDA */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
              Miembros del Club ({selectedClub.members.length})
            </h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              {selectedClub.members.map(memberId => {
                // CORRECCIÓN: Buscar el usuario por ID en el array de users del estado global
                const memberUser = state.users.find(user => user.id === memberId);
                const isCurrentUser = memberId === currentUser.id;
                const isAdmin = selectedClub.createdBy === memberId;
                
                // Si no encontramos el usuario, mostrar información básica
                if (!memberUser) {
                  return (
                    <div key={memberId} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: 'var(--card-bg)',
                      borderRadius: 'var(--border-radius)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px'
                        }}>
                          👤
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                            Usuario no encontrado
                            {isCurrentUser && ' (Tú)'}
                            {isAdmin && ' 👑'}
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                            ID: {memberId}
                          </div>
                        </div>
                      </div>
                      
                      {!isCurrentUser && (
                        <button
                          onClick={() => handleRemoveMember(memberId)}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #ef4444',
                            borderRadius: 'var(--border-radius)',
                            background: 'transparent',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={memberId} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'var(--card-bg)',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: memberUser.profilePicture ? 
                          `url(${memberUser.profilePicture}) center/cover` :
                          'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: memberUser.profilePicture ? '0' : '14px',
                        fontWeight: '600',
                        overflow: 'hidden'
                      }}>
                        {!memberUser.profilePicture && memberUser.avatar}
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                          {memberUser.name}
                          {isCurrentUser && ' (Tú)'}
                          {isAdmin && ' 👑'}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                          {memberUser.email}
                        </div>
                      </div>
                    </div>
                    
                    {!isCurrentUser && (
                      <button
                        onClick={() => handleRemoveMember(memberId)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #ef4444',
                          borderRadius: 'var(--border-radius)',
                          background: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {activeModal === 'changePassword' && (
        <>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
            🔑 Cambiar Contraseña del Club
          </h3>
          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Nueva Contraseña
              </label>
              <input
                type="text"
                placeholder="Nueva contraseña para el club"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
                required
              />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Los miembros actuales permanecerán en el club, pero nuevos miembros necesitarán esta contraseña
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary">
                🔑 Cambiar Contraseña
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('manage')}
                style={{
                  padding: '12px 24px',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                ← Volver
              </button>
            </div>
          </form>
        </>
      )}

      {/* Botón para cerrar modal */}
      <button
        onClick={() => {
          setActiveModal(null);
          setSelectedClub(null);
          setNewPassword('');
        }}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: 'var(--text-secondary)'
        }}
      >
        ✕
      </button>
    </div>
  </div>
)}

    </div>
  );
}


// Componente de Torneos
// Componente de Torneos - VERSIÓN CORREGIDA
// Componente de Torneos - VERSIÓN MEJORADA CON FEEDBACK VISUAL
// Componente de Torneos - VERSIÓN RESPONSIVE Y SIMPLIFICADA
// Componente de Torneos - VERSIÓN CON BOTONES DE COMPLETAR Y ELIMINAR
// Componente de Torneos - VERSIÓN CORREGIDA CON BOTONES RESPONSIVE
function Tournaments() {
  const { state, actions, getters } = useApp();
  const { currentUser } = state;
  const { addToast } = useToast();
  const { navigateWithTransition } = useNavigation();
  // Función helper para obtener nombre del jugador (para logs)
// Función helper para obtener nombre del jugador (para logs)
const getPlayerName = (playerId) => {
  if (typeof playerId === 'string' && playerId.startsWith('guest-')) {
    const guestIndex = parseInt(playerId.split('-')[1]);
    // Usar newTournament.guestPlayers si está disponible, sino guestPlayers del estado
    const guestList = newTournament?.guestPlayers || [];
    return guestList[guestIndex] || `Invitado ${guestIndex + 1}`;
  }
  const player = state.users.find(u => u.id === playerId);
  return player ? player.name : `Jugador ${playerId}`;
};  const activeTournaments = getters.getActiveTournaments();
  const completedTournaments = getters.getCompletedTournaments();
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTournament, setNewTournament] = useState({ 
    name: '', 
    players: [],
    guestPlayers: [] 
  });
  const [newGuestPlayer, setNewGuestPlayer] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const clubMembers = getters.getClubMembers(currentUser.activeClub);
  const availablePlayers = clubMembers.filter(member => 
    !newTournament.players.includes(member.id)
  );

const handleCreateTournament = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  if (newTournament.players.length + newTournament.guestPlayers.length < 4) {
    addToast('Se necesitan al menos 4 jugadores para crear un torneo', 'warning');
    setIsSubmitting(false);
    return;
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const tournament = {
      id: Date.now(),
      name: newTournament.name,
      clubId: currentUser.activeClub,
      createdBy: currentUser.id,
      players: newTournament.players,
      guestPlayers: newTournament.guestPlayers,
      status: "active",
      matches: generateInitialMatches([...newTournament.players, ...newTournament.guestPlayers.map((_, index) => `guest-${index}`)]),
      createdAt: new Date().toISOString()
    };

    actions.createTournament(tournament);
    
    addToast(`¡Torneo "${tournament.name}" creado exitosamente! 🎉`, 'success');
    
    setShowCreateForm(false);
    setNewTournament({ name: '', players: [], guestPlayers: [] });
    
    // REDIRIGIR AL TORNEO RECIÉN CREADO
    setTimeout(() => {
      navigateWithTransition(`/tournament/${tournament.id}`, {
        message: `Redirigiendo al torneo "${tournament.name}"...`
      });
    }, 1000);
    
  } catch (error) {
    addToast('Error al crear el torneo', 'error');
  } finally {
    setIsSubmitting(false);
  }
};

const generateInitialMatches = (playerIds) => {
  const matches = [];
  const totalPlayers = playerIds.length;
  
  if (totalPlayers < 4) {
    console.log('❌ No hay suficientes jugadores para crear partidos');
    return matches;
  }
  
  // Calcular cuántos partidos crear (mínimo 4, máximo 7)
  const matchesToCreate = Math.min(7, Math.max(4, Math.floor(totalPlayers * 1.5)));
  
  console.log(`🎯 Creando ${matchesToCreate} partidos iniciales para ${totalPlayers} jugadores`);
  
  // 1. IDENTIFICAR TIPOS DE JUGADORES (solo para logs, no para la lógica)
  const clubMembers = playerIds.filter(id => typeof id === 'number');
  const guestPlayers = playerIds.filter(id => typeof id === 'string' && id.startsWith('guest-'));
  
  console.log(`👥 Miembros del club: ${clubMembers.length}, Invitados: ${guestPlayers.length}`);
  
  // 2. INICIALIZAR CONTADORES INDEPENDIENTES PARA ESTE TORNEO
  const matchesPlayed = {};
  playerIds.forEach(player => {
    matchesPlayed[player] = 0; // Cada torneo empieza desde cero
  });
  
  // 3. ALGORITMO DE DISTRIBUCIÓN EQUITATIVA
  for (let matchIndex = 0; matchIndex < matchesToCreate; matchIndex++) {
    console.log(`\n🔄 Generando partido ${matchIndex + 1}/${matchesToCreate}`);
    
    // Ordenar jugadores por partidos jugados (menos partidos primero)
    const playersByUsage = [...playerIds].sort((a, b) => {
      return matchesPlayed[a] - matchesPlayed[b];
    });
    
    console.log('📊 Jugadores ordenados por partidos:');
    playersByUsage.forEach(player => {
      const playerType = typeof player === 'string' ? 'Invitado' : 'Miembro';
      console.log(`   ${getPlayerName(player)} (${playerType}): ${matchesPlayed[player]} partidos`);
    });
    
    // Tomar los 4 jugadores con menos partidos como base
    const basePlayers = playersByUsage.slice(0, 4);
    
    // Si hay exactamente 4 jugadores con la misma cantidad mínima, usarlos directamente
    const minMatches = matchesPlayed[basePlayers[0]];
    const playersWithMinMatches = playersByUsage.filter(p => matchesPlayed[p] === minMatches);
    
    let selectedPlayers;
    
    if (playersWithMinMatches.length >= 4) {
      // Mezclar aleatoriamente entre los que tienen la misma cantidad mínima
      const shuffled = [...playersWithMinMatches].sort(() => Math.random() - 0.5);
      selectedPlayers = shuffled.slice(0, 4);
      console.log(`✅ Usando 4 jugadores con ${minMatches} partidos (misma cantidad mínima)`);
    } else {
      // Tomar los 4 con menos partidos y mezclar para evitar patrones
      selectedPlayers = [...basePlayers].sort(() => Math.random() - 0.5);
      console.log(`✅ Usando 4 jugadores con menos partidos (rango: ${minMatches}-${matchesPlayed[basePlayers[3]]})`);
    }
    
    // Mezclar aleatoriamente para los equipos (mezcla homogénea)
    const shuffledTeams = [...selectedPlayers].sort(() => Math.random() - 0.5);
    const team1 = shuffledTeams.slice(0, 2);
    const team2 = shuffledTeams.slice(2, 4);
    
    // Verificar composición del partido
    const team1Types = {
      club: team1.filter(p => typeof p === 'number').length,
      guest: team1.filter(p => typeof p === 'string').length
    };
    
    const team2Types = {
      club: team2.filter(p => typeof p === 'number').length,
      guest: team2.filter(p => typeof p === 'string').length
    };
    
    console.log(`🏸 Partido ${matchIndex + 1}:`);
    console.log(`   Equipo 1: ${team1.map(p => `${getPlayerName(p)} (${typeof p === 'string' ? 'Invitado' : 'Miembro'})`).join(', ')}`);
    console.log(`   Equipo 2: ${team2.map(p => `${getPlayerName(p)} (${typeof p === 'string' ? 'Invitado' : 'Miembro'})`).join(', ')}`);
    console.log(`   Composición: Club[${team1Types.club + team2Types.club}] - Invitados[${team1Types.guest + team2Types.guest}]`);
    
    // Crear el partido
    matches.push({
      id: Date.now() + matchIndex,
      team1,
      team2,
      scoreTeam1: null,
      scoreTeam2: null,
      status: "pending",
      createdAt: new Date().toISOString()
    });
    
    // Actualizar contadores SOLO para este torneo
    [...team1, ...team2].forEach(player => {
      matchesPlayed[player]++;
    });
  }
  
  // 4. VERIFICACIÓN FINAL DEL BALANCE
  console.log('\n📈 VERIFICACIÓN FINAL DEL BALANCE:');
  
  // Agrupar por tipo para análisis
  const clubStats = clubMembers.map(player => ({
    name: getPlayerName(player),
    type: 'Miembro',
    matches: matchesPlayed[player]
  }));
  
  const guestStats = guestPlayers.map(player => ({
    name: getPlayerName(player),
    type: 'Invitado',
    matches: matchesPlayed[player]
  }));
  
  const allStats = [...clubStats, ...guestStats];
  
  allStats.forEach(stat => {
    console.log(`   ${stat.name} (${stat.type}): ${stat.matches} partidos`);
  });
  
  const matchCounts = allStats.map(s => s.matches);
  const minMatches = Math.min(...matchCounts);
  const maxMatches = Math.max(...matchCounts);
  const difference = maxMatches - minMatches;
  
  console.log(`\n🎯 RESULTADO: Diferencia de ${difference} partidos entre jugadores`);
  console.log(`   Mínimo: ${minMatches} partidos, Máximo: ${maxMatches} partidos`);
  
  if (difference <= 2) {
    console.log('✅ BALANCE EXCELENTE: Diferencia aceptable (≤ 2 partidos)');
  } else if (difference <= 3) {
    console.log('⚠️ BALANCE ACEPTABLE: Diferencia moderada (3 partidos)');
  } else {
    console.log('❌ BALANCE DEFICIENTE: Diferencia muy grande (> 3 partidos)');
  }
  
  // Estadísticas de mezcla
  const totalClubMatches = clubStats.reduce((sum, stat) => sum + stat.matches, 0);
  const totalGuestMatches = guestStats.reduce((sum, stat) => sum + stat.matches, 0);
  
  console.log(`\n🔀 ESTADÍSTICAS DE MEZCLA:`);
  console.log(`   Total partidos de miembros: ${totalClubMatches}`);
  console.log(`   Total partidos de invitados: ${totalGuestMatches}`);
  console.log(`   Proporción: ${((totalClubMatches / (totalClubMatches + totalGuestMatches)) * 100).toFixed(1)}% miembros vs ${((totalGuestMatches / (totalClubMatches + totalGuestMatches)) * 100).toFixed(1)}% invitados`);
  
  return matches;
};


  const addGuestPlayer = () => {
    if (newGuestPlayer.trim() && !newTournament.guestPlayers.includes(newGuestPlayer.trim())) {
      setNewTournament({
        ...newTournament,
        guestPlayers: [...newTournament.guestPlayers, newGuestPlayer.trim()]
      });
      setNewGuestPlayer('');
      addToast('Jugador invitado agregado', 'success');
    } else if (newTournament.guestPlayers.includes(newGuestPlayer.trim())) {
      addToast('Este jugador ya está en la lista', 'warning');
    }
  };

  const removeGuestPlayer = (guestName) => {
    setNewTournament({
      ...newTournament,
      guestPlayers: newTournament.guestPlayers.filter(name => name !== guestName)
    });
    addToast('Jugador invitado removido', 'info');
  };

  const togglePlayer = (playerId) => {
    const isSelected = newTournament.players.includes(playerId);
    setNewTournament({
      ...newTournament,
      players: isSelected
        ? newTournament.players.filter(id => id !== playerId)
        : [...newTournament.players, playerId]
    });
    
    const player = clubMembers.find(m => m.id === playerId);
    if (player) {
      addToast(
        isSelected ? `${player.name} removido` : `${player.name} agregado`,
        isSelected ? 'info' : 'success'
      );
    }
  };

  // Función para completar torneo
  const handleCompleteTournament = async (tournament) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres completar el torneo "${tournament.name}"?\n\nEsta acción no se puede deshacer y moverá el torneo a la sección de completados.`
    );
    
    if (!confirmed) return;

    setActionLoading(tournament.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      actions.completeTournament(tournament.id);
      addToast(`¡Torneo "${tournament.name}" completado exitosamente! 🏆`, 'success');
      
    } catch (error) {
      addToast('Error al completar el torneo', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Función para eliminar torneo
  const handleDeleteTournament = async (tournament) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres ELIMINAR el torneo "${tournament.name}"?\n\n⚠️ Esta acción NO se puede deshacer y se perderán todos los datos del torneo.`
    );
    
    if (!confirmed) return;

    setActionLoading(tournament.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar y eliminar el torneo del estado
      const updatedTournaments = state.tournaments.filter(t => t.id !== tournament.id);
      actions.updateTournaments(updatedTournaments);
      
      addToast(`¡Torneo "${tournament.name}" eliminado exitosamente! 🗑️`, 'success');
      
    } catch (error) {
      addToast('Error al eliminar el torneo', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Verificar si el usuario es el creador del torneo
  const isTournamentCreator = (tournament) => {
    return tournament.createdBy === currentUser.id;
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      padding: '20px'
    }}>
      <style>{themeStyles}</style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header responsive */}
        <div className="animate-fadeInUp" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '30px',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ width: '100%' }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              🏆 Torneos
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Gestiona y participa en torneos de pádel
            </p>
          </div>
          
          <button 
            onClick={() => setShowCreateForm(true)}
            className="btn-primary hover-glow"
            disabled={isSubmitting}
            style={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '200px',
              alignSelf: 'flex-end'
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{ opacity: 0 }}>🆕 Crear Torneo</span>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Creando...
                </div>
              </>
            ) : (
              '🆕 Crear Torneo'
            )}
          </button>
        </div>

        {/* Formulario de Creación de Torneo */}
        {showCreateForm && (
          <div className="glass-card animate-scaleIn" style={{ 
            padding: '20px', 
            marginBottom: '30px',
            border: '2px solid var(--primary)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '20px' }}>
                Crear Nuevo Torneo
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                disabled={isSubmitting}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '5px',
                  borderRadius: '50%',
                  transition: 'var(--transition)'
                }}
                className="hover-glow"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateTournament}>
              {/* ... (el resto del formulario se mantiene igual) ... */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Nombre del Torneo *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Torneo Primavera 2024"
                  value={newTournament.name}
                  onChange={(e) => setNewTournament({...newTournament, name: e.target.value})}
                  disabled={isSubmitting}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    transition: 'var(--transition)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Jugadores del Club ({newTournament.players.length} seleccionados)
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '8px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '10px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)'
                }}>
                  {clubMembers.map(member => (
                    <div
                      key={member.id}
                      onClick={() => !isSubmitting && togglePlayer(member.id)}
                      className={`hover-lift ${isSubmitting ? 'opacity-50' : ''}`}
                      style={{
                        padding: '10px',
                        border: `2px solid ${newTournament.players.includes(member.id) ? 'var(--primary)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--border-radius)',
                        backgroundColor: newTournament.players.includes(member.id) ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'var(--transition)',
                        opacity: isSubmitting ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px'
                        }}>
                          {member.avatar}
                        </div>
                        <span style={{ 
                          color: 'var(--text-primary)',
                          fontWeight: newTournament.players.includes(member.id) ? '600' : '400',
                          fontSize: '13px'
                        }}>
                          {member.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Jugadores Invitados ({newTournament.guestPlayers.length})
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Nombre del jugador invitado"
                      value={newGuestPlayer}
                      onChange={(e) => setNewGuestPlayer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGuestPlayer())}
                      disabled={isSubmitting}
                      style={{ 
                        flex: 1, 
                        padding: '12px', 
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--border-radius)',
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={addGuestPlayer}
                      disabled={isSubmitting || !newGuestPlayer.trim()}
                      style={{
                        padding: '12px 16px',
                        border: '2px solid var(--primary)',
                        borderRadius: 'var(--border-radius)',
                        background: 'transparent',
                        color: 'var(--primary)',
                        cursor: isSubmitting || !newGuestPlayer.trim() ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        opacity: isSubmitting || !newGuestPlayer.trim() ? 0.6 : 1,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      ➕ Añadir
                    </button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {newTournament.guestPlayers.map((guest, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '6px 10px',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '16px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>👤</span>
                      <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {guest}
                      </span>
                      <button
                        type="button"
                        onClick={() => !isSubmitting && removeGuestPlayer(guest)}
                        disabled={isSubmitting}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          padding: '0',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ 
                padding: '14px',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: 'var(--border-radius)',
                marginBottom: '20px',
                border: '1px solid var(--primary)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
                    Total de Jugadores:
                  </span>
                  <span style={{ 
                    color: (newTournament.players.length + newTournament.guestPlayers.length) >= 4 ? 'var(--secondary)' : 'var(--accent)',
                    fontWeight: '700',
                    fontSize: '16px'
                  }}>
                    {newTournament.players.length + newTournament.guestPlayers.length} / 4 mínimo
                  </span>
                </div>
                {(newTournament.players.length + newTournament.guestPlayers.length) < 4 && (
                  <p style={{ color: 'var(--accent)', fontSize: '13px', marginTop: '8px', fontWeight: '600' }}>
                    ⚠️ Se necesitan al menos 4 jugadores
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                <button 
                  type="submit" 
                  className="btn-primary hover-glow"
                  disabled={isSubmitting || (newTournament.players.length + newTournament.guestPlayers.length) < 4}
                  style={{
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{ opacity: 0 }}>🏆 Crear Torneo</span>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Creando...
                      </div>
                    </>
                  ) : (
                    '🏆 Crear Torneo'
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pestañas de Torneos */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setActiveTab('active')}
              className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
              style={{
                flex: 1,
                padding: '16px 12px',
                border: 'none',
                background: activeTab === 'active' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'active' ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'var(--transition)',
                fontSize: '14px'
              }}
            >
              🟢 Activos ({activeTournaments.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
              style={{
                flex: 1,
                padding: '16px 12px',
                border: 'none',
                background: activeTab === 'completed' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'completed' ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'var(--transition)',
                fontSize: '14px'
              }}
            >
              ✅ Completados ({completedTournaments.length})
            </button>
          </div>

          {/* Lista de Torneos CON BOTONES RESPONSIVE */}
          <div style={{ padding: '16px' }}>
            {(activeTab === 'active' ? activeTournaments : completedTournaments).map((tournament, index) => (
              <div 
                key={tournament.id} 
                className="tournament-card animate-fadeInUp hover-lift"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  marginBottom: '16px',
                  padding: '16px'
                }}
              >
                {/* Header simplificado */}
                <div className="tournament-header" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                  gap: '12px'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '700', 
                      color: 'var(--text-primary)',
                      marginBottom: '6px',
                      wordWrap: 'break-word'
                    }}>
                      {tournament.name}
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ 
                        background: tournament.status === 'active' ? 'var(--secondary)' : 'var(--accent)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {tournament.status === 'active' ? '🟢 Activo' : '✅ Completado'}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {tournament.players.length + tournament.guestPlayers.length} jugadores
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {tournament.matches.filter(m => m.status === 'completed').length}/{tournament.matches.length} partidos
                      </span>
                    </div>
                  </div>
                  
                  {/* BOTONES - DISEÑO RESPONSIVE MEJORADO */}
                  <div className="tournament-actions" style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    alignItems: 'center',
                    flexShrink: 0,
                    flexWrap: 'wrap'
                  }}>
                    {/* Botón Abrir - SIEMPRE visible */}
                    <button
                      onClick={() => navigateWithTransition(`/tournament/${tournament.id}`, {
                        message: `Abriendo ${tournament.name}...`
                      })}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid var(--primary)',
                        borderRadius: 'var(--border-radius)',
                        background: 'var(--primary)',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                      className="hover-glow"
                    >
                      📊 Abrir
                    </button>

                    {/* Botón Completar - solo para torneos ACTIVOS y creador */}
                    {tournament.status === 'active' && isTournamentCreator(tournament) && (
                      <button
                        onClick={() => handleCompleteTournament(tournament)}
                        disabled={actionLoading === tournament.id}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid var(--accent)',
                          borderRadius: 'var(--border-radius)',
                          background: 'var(--accent)',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: actionLoading === tournament.id ? 'not-allowed' : 'pointer',
                          transition: 'var(--transition)',
                          whiteSpace: 'nowrap',
                          opacity: actionLoading === tournament.id ? 0.6 : 1,
                          position: 'relative',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                        className="hover-glow"
                      >
                        {actionLoading === tournament.id ? (
                          <>
                            <span style={{ opacity: 0 }}>✅ Completar</span>
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}>
                              <div style={{
                                width: '14px',
                                height: '14px',
                                border: '2px solid transparent',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }}></div>
                            </div>
                          </>
                        ) : (
                          '✅ Completar'
                        )}
                      </button>
                    )}

                    {/* Botón Eliminar - solo para torneos ACTIVOS y creador */}
                    {tournament.status === 'active' && isTournamentCreator(tournament) && (
                      <button
                        onClick={() => handleDeleteTournament(tournament)}
                        disabled={actionLoading === tournament.id}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #ef4444',
                          borderRadius: 'var(--border-radius)',
                          background: '#ef4444',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: actionLoading === tournament.id ? 'not-allowed' : 'pointer',
                          transition: 'var(--transition)',
                          whiteSpace: 'nowrap',
                          opacity: actionLoading === tournament.id ? 0.6 : 1,
                          position: 'relative',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                        className="hover-glow"
                      >
                        {actionLoading === tournament.id ? (
                          <>
                            <span style={{ opacity: 0 }}>🗑️ Eliminar</span>
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}>
                              <div style={{
                                width: '14px',
                                height: '14px',
                                border: '2px solid transparent',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }}></div>
                            </div>
                          </>
                        ) : (
                          '🗑️ Eliminar'
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Información mínima */}
                <div style={{ 
                  marginTop: '12px',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: '13px',
                    color: 'var(--text-secondary)'
                  }}>
                    <span>📅 {new Date(tournament.createdAt).toLocaleDateString()}</span>
                    <span>👤 Creado por {state.users.find(u => u.id === tournament.createdBy)?.name || 'Usuario'}</span>
                  </div>
                </div>
              </div>
            ))}

            {(activeTab === 'active' ? activeTournaments : completedTournaments).length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                color: 'var(--text-secondary)',
                animation: 'fadeInUp 0.6s ease-out'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
                <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>
                  {activeTab === 'active' ? 'No hay torneos activos' : 'No hay torneos completados'}
                </h3>
                <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                  {activeTab === 'active' 
                    ? 'Crea el primer torneo para empezar a competir' 
                    : 'Los torneos completados aparecerán aquí'
                  }
                </p>
                {activeTab === 'active' && (
                  <button 
                    onClick={() => setShowCreateForm(true)}
                    className="btn-primary hover-glow"
                    style={{ padding: '12px 24px', fontSize: '14px' }}
                  >
                    🆕 Crear Primer Torneo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .opacity-50 {
          opacity: 0.5;
        }
        
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        /* MEJORAS RESPONSIVE PARA BOTONES */
        @media (min-width: 769px) {
          .tournament-actions {
            flex-direction: row !important;
            flex-wrap: nowrap !important;
          }
        }
        
        @media (max-width: 768px) {
          .tournament-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          
          .tournament-actions {
            width: 100% !important;
            justify-content: flex-start !important;
            gap: 6px !important;
          }
          
          .tournament-actions button {
            flex: 0 1 auto !important;
            min-width: 80px !important;
          }
        }
        
        @media (max-width: 480px) {
          .tournament-actions {
            justify-content: space-between !important;
          }
          
          .tournament-actions button {
            flex: 1 !important;
            min-width: 70px !important;
            font-size: 11px !important;
            padding: 6px 8px !important;
          }
        }
        
        @media (max-width: 360px) {
          .tournament-actions {
            flex-direction: column !important;
            gap: 4px !important;
          }
          
          .tournament-actions button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

// ✅ ESTA LLAVE CIERRA EL COMPONENTE Tournaments CORRECTAMENTE

function TournamentDetail() {
  const { id } = useParams();
  const { getters, state, actions } = useApp();
  const tournament = getters.getTournamentById(parseInt(id));
  const [activeTab, setActiveTab] = useState('play');
  const [editingScores, setEditingScores] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [localTournament, setLocalTournament] = useState(null);
  const navigate = useNavigate();

  // Sincronizar el torneo local con el global
  useEffect(() => {
    if (tournament) {
      setLocalTournament(tournament);
    }
  }, [tournament]);

  if (!tournament || !localTournament) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        padding: '40px 20px',
        textAlign: 'center',
        color: 'var(--text-primary)'
      }}>
        <h1>Torneo no encontrado</h1>
        <Link to="/tournaments" className="btn-primary">
          Volver a Torneos
        </Link>
      </div>
    );
  }

  // Función para completar el torneo
  const handleCompleteTournament = () => {
    const pendingMatches = localTournament.matches.filter(match => match.status === 'pending');
    
    if (pendingMatches.length > 0) {
      const confirmComplete = window.confirm(
        `Hay ${pendingMatches.length} partido(s) pendiente(s). ¿Estás seguro de que quieres completar el torneo? Los partidos pendientes se mantendrán sin resultados.`
      );
      
      if (!confirmComplete) {
        return;
      }
    }

    actions.completeTournament(localTournament.id);
    
    alert('🎉 ¡Torneo completado correctamente! Será movido a la sección de torneos completados.');
    
    // Redirigir a la lista de torneos después de un breve delay
    setTimeout(() => {
      navigate('/tournaments');
    }, 2000);
  };

  // Función para reabrir el torneo
  const handleReopenTournament = () => {
    actions.updateTournament(localTournament.id, { status: 'active' });
    alert('🔄 Torneo reabierto correctamente. Ahora aparece en torneos activos.');
  };

  // Función para obtener nombre del jugador
  const getPlayerName = (playerId) => {
    if (typeof playerId === 'string' && playerId.startsWith('guest-')) {
      const guestIndex = parseInt(playerId.split('-')[1]);
      return localTournament.guestPlayers[guestIndex] + ' (Invitado)';
    }
    const player = state.users.find(u => u.id === playerId);
    return player ? player.name : 'Jugador no encontrado';
  };

// Función para obtener avatar/foto del jugador
const getPlayerAvatar = (playerId) => {
  if (typeof playerId === 'string' && playerId.startsWith('guest-')) {
    return '👤';
  }
  const player = state.users.find(u => u.id === playerId);
  
  // Si el jugador tiene foto de perfil, usar la foto
  if (player && player.profilePicture) {
    return (
      <div 
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: `url(${player.profilePicture}) center/cover`,
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      />
    );
  }
  
  // Si no tiene foto, usar el emoji
  return player ? player.avatar : '👤';
};

  // Función específica para clasificación que maneja mejor los jugadores
  const getPlayerInfoForRanking = (playerId) => {
    if (typeof playerId === 'string' && playerId.startsWith('guest-')) {
      const guestIndex = parseInt(playerId.split('-')[1]);
      const guestName = localTournament.guestPlayers[guestIndex];
      return {
        name: guestName + ' (Invitado)',
        avatar: '👤',
        isGuest: true
      };
    }
    
    const player = state.users.find(u => u.id === playerId);
    if (player) {
      return {
        name: player.name,
        avatar: player.avatar,
        profilePicture: player.profilePicture,
        isGuest: false
      };
    }
    
    return {
      name: 'Jugador no encontrado',
      avatar: '👤',
      isGuest: false
    };
  };

  // Función para obtener jugadores que no están en el partido actual
  const getWaitingPlayers = (match) => {
    const allPlayers = [...localTournament.players, ...localTournament.guestPlayers.map((_, idx) => `guest-${idx}`)];
    const playingPlayers = [...(match.team1 || []), ...(match.team2 || [])];
    return allPlayers.filter(player => !playingPlayers.includes(player));
  };  
  // Calcular estadísticas para la clasificación - VERSIÓN CORREGIDA
  const calculateRanking = () => {
    const playerStats = {};
    
    // Procesar jugadores regulares
    localTournament.players.forEach(playerId => {
      playerStats[playerId] = { 
        points: 0, 
        matches: 0, 
        wins: 0,
        playerId: playerId,
        isGuest: false
      };
    });
    
    // Procesar jugadores invitados - CORREGIDO
    localTournament.guestPlayers.forEach((guestName, index) => {
      const guestId = `guest-${index}`;
      playerStats[guestId] = { 
        points: 0, 
        matches: 0, 
        wins: 0,
        playerId: guestId,
        isGuest: true,
        guestName: guestName
      };
    });

    // Calcular estadísticas de partidos
    localTournament.matches.forEach(match => {
      if (match.status === 'completed' && match.scoreTeam1 !== null && match.scoreTeam2 !== null) {
        // Equipo 1
        match.team1.forEach(playerId => {
          if (playerStats[playerId]) {
            playerStats[playerId].points += match.scoreTeam1;
            playerStats[playerId].matches += 1;
            if (match.scoreTeam1 > match.scoreTeam2) playerStats[playerId].wins += 1;
          }
        });
        
        // Equipo 2
        match.team2.forEach(playerId => {
          if (playerStats[playerId]) {
            playerStats[playerId].points += match.scoreTeam2;
            playerStats[playerId].matches += 1;
            if (match.scoreTeam2 > match.scoreTeam1) playerStats[playerId].wins += 1;
          }
        });
      }
    });

    // Convertir a array y ordenar por puntos
    return Object.values(playerStats)
      .map(stats => ({
        ...stats,
        globalScore: stats.matches > 0 ? (stats.points / stats.matches).toFixed(2) : '0.00'
      }))
      .sort((a, b) => b.points - a.points);
  };


// ALGORITMO MEJORADO - DISTRIBUCIÓN EQUITATIVA DE PARTIDOS
const generateBalancedMatch = (allPlayers, existingMatches) => {
  if (allPlayers.length < 4) {
    const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
    return {
      team1: shuffled.slice(0, 2),
      team2: shuffled.slice(2, 4),
      scoreTeam1: null,
      scoreTeam2: null
    };
  }

  // 1. CALCULAR ESTADÍSTICAS DETALLADAS DE CADA JUGADOR
  const playerStats = {};
  allPlayers.forEach(player => {
    playerStats[player] = {
      gamesPlayed: 0,
      gamesAsPartner: {}, // Con quién ha sido compañero
      gamesAsOpponent: {}, // Contra quién ha jugado
      lastPlayedMatch: -1,
      consecutiveWaits: 0,
      totalWaitTime: 0
    };
  });

  // Procesar partidos existentes para calcular estadísticas
  existingMatches.forEach((match, matchIndex) => {
    const playingPlayers = [...match.team1, ...match.team2];
    const waitingPlayers = allPlayers.filter(p => !playingPlayers.includes(p));
    
    // Actualizar jugadores que jugaron
    playingPlayers.forEach(playerId => {
      playerStats[playerId].gamesPlayed++;
      playerStats[playerId].lastPlayedMatch = matchIndex;
      playerStats[playerId].consecutiveWaits = 0;
      
      // Registrar compañeros y oponentes
      if (match.team1.includes(playerId)) {
        match.team1.forEach(partner => {
          if (partner !== playerId) {
            playerStats[playerId].gamesAsPartner[partner] = (playerStats[playerId].gamesAsPartner[partner] || 0) + 1;
          }
        });
        match.team2.forEach(opponent => {
          playerStats[playerId].gamesAsOpponent[opponent] = (playerStats[playerId].gamesAsOpponent[opponent] || 0) + 1;
        });
      } else {
        match.team2.forEach(partner => {
          if (partner !== playerId) {
            playerStats[playerId].gamesAsPartner[partner] = (playerStats[playerId].gamesAsPartner[partner] || 0) + 1;
          }
        });
        match.team1.forEach(opponent => {
          playerStats[playerId].gamesAsOpponent[opponent] = (playerStats[playerId].gamesAsOpponent[opponent] || 0) + 1;
        });
      }
    });
    
    // Actualizar jugadores que esperaron
    waitingPlayers.forEach(playerId => {
      playerStats[playerId].consecutiveWaits++;
      playerStats[playerId].totalWaitTime++;
    });
  });

  // 2. CALCULAR MÉTRICAS DE BALANCE
  const totalMatches = existingMatches.length;
  const gamesPlayedArray = allPlayers.map(p => playerStats[p].gamesPlayed);
  const minGames = Math.min(...gamesPlayedArray);
  const maxGames = Math.max(...gamesPlayedArray);
  const avgGames = gamesPlayedArray.reduce((a, b) => a + b, 0) / allPlayers.length;

  // 3. FUNCIÓN DE PUNTUACIÓN MEJORADA
  const calculateTeamScore = (team) => {
    let score = 0;
    
    // Puntuación basada en partidos jugados (prioridad máxima)
    team.forEach(playerId => {
      const gamesDiff = avgGames - playerStats[playerId].gamesPlayed;
      
      // Jugadores con menos partidos tienen MUCHA prioridad
      if (gamesDiff > 0) {
        score += gamesDiff * 50; // Peso muy alto para equilibrar
      } else {
        score += gamesDiff * 10; // Penalización menor por exceso
      }
      
      // Bonus por jugadores con muchas esperas consecutivas
      score += playerStats[playerId].consecutiveWaits * 30;
    });
    
    return score;
  };

  const calculateCombinationScore = (team1, team2) => {
    let score = 0;
    const allPlayingPlayers = [...team1, ...team2];
    const waitingPlayers = allPlayers.filter(p => !allPlayingPlayers.includes(p));

    // 🔥 PRIORIDAD 1: EQUILIBRIO DE PARTIDOS JUGADOS (60%)
    const team1Score = calculateTeamScore(team1);
    const team2Score = calculateTeamScore(team2);
    score += team1Score + team2Score;

    // 🔥 PRIORIDAD 2: EVITAR ESPERAS CONSECUTIVAS (25%)
    waitingPlayers.forEach(playerId => {
      // Penalización fuerte por hacer esperar a jugadores con pocos partidos
      if (playerStats[playerId].gamesPlayed < avgGames) {
        score -= 40;
      }
      // Penalización por esperas consecutivas
      score -= playerStats[playerId].consecutiveWaits * 25;
    });

    // 🔥 PRIORIDAD 3: DIVERSIFICACIÓN DE COMPAÑEROS (10%)
    team1.forEach(player1 => {
      team1.forEach(player2 => {
        if (player1 !== player2) {
          const timesTogether = playerStats[player1].gamesAsPartner[player2] || 0;
          // Penalización progresiva por repetir compañeros
          score -= timesTogether * 15;
          // Bonus por compañeros nuevos
          if (timesTogether === 0) score += 8;
        }
      });
    });

    team2.forEach(player1 => {
      team2.forEach(player2 => {
        if (player1 !== player2) {
          const timesTogether = playerStats[player1].gamesAsPartner[player2] || 0;
          score -= timesTogether * 15;
          if (timesTogether === 0) score += 8;
        }
      });
    });

    // 🔥 PRIORIDAD 4: EQUILIBRIO DE EXPERIENCIA ENTRE EQUIPOS (5%)
    const team1Experience = team1.reduce((sum, p) => sum + playerStats[p].gamesPlayed, 0);
    const team2Experience = team2.reduce((sum, p) => sum + playerStats[p].gamesPlayed, 0);
    const experienceDiff = Math.abs(team1Experience - team2Experience);
    score -= experienceDiff * 5;

    // 4. EVITAR COMBINACIONES DUPLICADAS
    const team1Key = team1.sort().join('-');
    const team2Key = team2.sort().join('-');
    
    const hasDuplicate = existingMatches.some(match => {
      const matchTeam1 = match.team1?.sort().join('-');
      const matchTeam2 = match.team2?.sort().join('-');
      return (team1Key === matchTeam1 && team2Key === matchTeam2) ||
             (team1Key === matchTeam2 && team2Key === matchTeam1);
    });
    
    if (hasDuplicate) {
      score -= 100; // Penalización muy fuerte por duplicados
    }

    return score;
  };

  // 5. ESTRATEGIA DE BÚSQUEDA INTELIGENTE
  let bestCombination = null;
  let bestScore = -Infinity;
  
  // Ordenar jugadores por prioridad (menos partidos primero)
  const prioritizedPlayers = [...allPlayers].sort((a, b) => {
    const priorityA = (avgGames - playerStats[a].gamesPlayed) * 20 + 
                     playerStats[a].consecutiveWaits * 10;
    const priorityB = (avgGames - playerStats[b].gamesPlayed) * 20 + 
                     playerStats[b].consecutiveWaits * 10;
    return priorityB - priorityA;
  });

  // Intentar múltiples combinaciones inteligentes
  const attempts = 500;
  
  for (let attempt = 0; attempt < attempts; attempt++) {
    let team1, team2;
    
    if (attempt < 100) {
      // Estrategia 1: Tomar los 4 jugadores con mayor prioridad
      const topPlayers = prioritizedPlayers.slice(0, 4);
      const shuffled = [...topPlayers].sort(() => Math.random() - 0.5);
      team1 = shuffled.slice(0, 2);
      team2 = shuffled.slice(2, 4);
    } else if (attempt < 300) {
      // Estrategia 2: Mezcla balanceada
      const shuffled = [...prioritizedPlayers].sort(() => Math.random() - 0.5);
      team1 = shuffled.slice(0, 2);
      team2 = shuffled.slice(2, 4);
    } else {
      // Estrategia 3: Búsqueda aleatoria con sesgo hacia jugadores con menos partidos
      const weightedPlayers = [];
      prioritizedPlayers.forEach(player => {
        const weight = Math.max(1, (avgGames - playerStats[player].gamesPlayed + 1) * 3);
        for (let i = 0; i < weight; i++) {
          weightedPlayers.push(player);
        }
      });
      
      const shuffled = [...weightedPlayers].sort(() => Math.random() - 0.5);
      const uniquePlayers = [...new Set(shuffled)].slice(0, 4);
      team1 = uniquePlayers.slice(0, 2);
      team2 = uniquePlayers.slice(2, 4);
    }

    // Si no tenemos 4 jugadores únicos, completar
    if (team1.length < 2 || team2.length < 2) {
      const usedPlayers = new Set([...team1, ...team2]);
      const availablePlayers = allPlayers.filter(p => !usedPlayers.has(p));
      const needed = 4 - team1.length - team2.length;
      
      if (team1.length < 2) {
        team1.push(...availablePlayers.slice(0, 2 - team1.length));
      }
      if (team2.length < 2) {
        team2.push(...availablePlayers.slice(2 - team1.length, 2 - team1.length + 2 - team2.length));
      }
    }

    const score = calculateCombinationScore(team1, team2);
    
    if (score > bestScore) {
      bestScore = score;
      bestCombination = { team1, team2 };
      
      // Si encontramos una combinación excelente, terminar antes
      if (score > 200) break;
    }
  }

  // 6. FALLBACK: Si no encontramos buena combinación
  if (!bestCombination) {
    // Ordenar por menos partidos jugados y tomar los primeros 4
    const sortedByGames = [...allPlayers].sort((a, b) => 
      playerStats[a].gamesPlayed - playerStats[b].gamesPlayed
    );
    bestCombination = {
      team1: sortedByGames.slice(0, 2),
      team2: sortedByGames.slice(2, 4)
    };
  }

  // 7. LOG PARA DEBUG (opcional)
  console.log('=== NUEVO PARTIDO BALANCEADO ===');
  console.log('Equipo 1:', bestCombination.team1.map(p => `${getPlayerName(p)} (${playerStats[p].gamesPlayed} partidos)`));
  console.log('Equipo 2:', bestCombination.team2.map(p => `${getPlayerName(p)} (${playerStats[p].gamesPlayed} partidos)`));
  console.log('Estadísticas:', {
    minGames,
    maxGames,
    avgGames: avgGames.toFixed(2),
    diferencia: maxGames - minGames
  });

  return {
    team1: bestCombination.team1,
    team2: bestCombination.team2,
    scoreTeam1: null,
    scoreTeam2: null
  };
};
  // Función para añadir partido adicional
  const addAdditionalMatch = () => {
    if (localTournament.status === 'completed') {
      alert('No puedes añadir partidos a un torneo completado. Reabre el torneo primero.');
      return;
    }

    const allPlayers = [...localTournament.players, ...localTournament.guestPlayers.map((_, idx) => `guest-${idx}`)];
    
    if (allPlayers.length < 4) {
      alert('Se necesitan al menos 4 jugadores para crear un partido');
      return;
    }

    const newMatch = generateBalancedMatch(allPlayers, localTournament.matches);
    
    actions.addTournamentMatch(localTournament.id, {
      ...newMatch,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    
    alert('¡Partido adicional añadido!');
  };

  // Función para manejar cambios en puntuaciones
  const handleScoreChange = (matchId, team, value) => {
    if (localTournament.status === 'completed') {
      alert('No puedes editar partidos en un torneo completado. Reabre el torneo primero.');
      return;
    }

    const newEditingScores = {
      ...editingScores,
      [matchId]: {
        ...editingScores[matchId],
        [team]: value,
        // Auto-calcular el otro equipo si es necesario
        [team === 'team1' ? 'team2' : 'team1']: value === '' ? '' : (4 - parseInt(value)).toString()
      }
    };
    
    setEditingScores(newEditingScores);
    setHasUnsavedChanges(true);
  };

  // Función para guardar TODOS los cambios
  const saveAllScores = () => {
    if (localTournament.status === 'completed') {
      alert('No puedes guardar cambios en un torneo completado. Reabre el torneo primero.');
      return;
    }

    let hasErrors = false;
    const errors = [];

    // Validar todos los scores editados
    Object.entries(editingScores).forEach(([matchId, scores]) => {
      if (!scores.team1 || !scores.team2) {
        errors.push(`Partido ${matchId}: Faltan puntuaciones`);
        hasErrors = true;
        return;
      }

      const score1 = parseInt(scores.team1);
      const score2 = parseInt(scores.team2);

      if (score1 + score2 !== 4) {
        errors.push(`Partido ${matchId}: La suma debe ser 4 (${score1 + score2})`);
        hasErrors = true;
      }
    });

    if (hasErrors) {
      alert('Errores encontrados:\n' + errors.join('\n'));
      return;
    }

    // Actualizar CADA partido individualmente
    Object.entries(editingScores).forEach(([matchId, scores]) => {
      const match = localTournament.matches.find(m => m.id === parseInt(matchId));
      if (match && scores.team1 && scores.team2) {
        actions.updateMatchScore(localTournament.id, parseInt(matchId), {
          scoreTeam1: parseInt(scores.team1),
          scoreTeam2: parseInt(scores.team2),
          status: 'completed'
        });
      }
    });

    // Limpiar estado de edición
    setEditingScores({});
    setHasUnsavedChanges(false);
    
    // Mensaje de éxito y cambiar a clasificación
    const updatedCount = Object.keys(editingScores).length;
    alert(`¡${updatedCount} partido${updatedCount > 1 ? 's' : ''} guardado${updatedCount > 1 ? 's' : ''} correctamente! Cambiando a clasificación...`);
    
    // Cambiar a la pestaña de clasificación después de un breve delay
    setTimeout(() => {
      setActiveTab('ranking');
    }, 1500);
  };

  // Función para cancelar ediciones
  const cancelEditing = () => {
    setEditingScores({});
    setHasUnsavedChanges(false);
  };

  // Función para eliminar partido
  const handleDeleteMatch = (matchId) => {
    if (localTournament.status === 'completed') {
      alert('No puedes eliminar partidos en un torneo completado. Reabre el torneo primero.');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar este partido?')) {
      const updatedMatches = localTournament.matches.filter(match => match.id !== matchId);
      actions.updateTournament(localTournament.id, { matches: updatedMatches });
    }
  };

  // Usar los datos del torneo local para renderizar
  const pendingMatches = localTournament.matches.filter(match => match.status === 'pending');
  const completedMatches = localTournament.matches.filter(match => match.status === 'completed');
  const ranking = calculateRanking();

  // Verificar si el usuario es el creador del torneo
  const isTournamentCreator = localTournament.createdBy === state.currentUser?.id;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      padding: '20px'
    }}>
      <style>{themeStyles}</style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
{/* Header del Torneo - VERSIÓN MEJORADA */}
<div style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'flex-start',
  marginBottom: '24px',
  flexWrap: 'wrap',
  gap: '16px',
  width: '100%'
}}>
  <div style={{ flex: 1, minWidth: '200px' }}>
    <Link to="/tournaments" style={{ 
      color: 'var(--primary)', 
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '8px',
      fontSize: '14px'
    }}>
      ← Volver a Torneos
    </Link>
    <h1 style={{ 
      fontSize: '24px', 
      fontWeight: '700', 
      color: 'var(--text-primary)',
      marginBottom: '6px',
      wordWrap: 'break-word'
    }}>
      {localTournament.name}
    </h1>
    <p style={{ 
      color: 'var(--text-secondary)',
      fontSize: '14px',
      lineHeight: '1.4'
    }}>
      📅 {new Date(localTournament.createdAt).toLocaleDateString()} • 
      👥 {localTournament.players.length + localTournament.guestPlayers.length} jugadores • 
      🎯 {completedMatches.length}/{localTournament.matches.length} partidos
      {isTournamentCreator && ' • 👑 Eres el organizador'}
    </p>
  </div>
  
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px', 
    alignItems: 'flex-end',
    flexShrink: 0
  }}>
    {/* Estado y Botón en la misma línea */}
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      flexWrap: 'wrap'
    }}>
      {/* Estado del Torneo */}
      <div style={{ 
        background: localTournament.status === 'active' ? 'var(--secondary)' : 'var(--accent)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: 'var(--border-radius)',
        fontWeight: '600',
        fontSize: '14px',
        whiteSpace: 'nowrap'
      }}>
        {localTournament.status === 'active' ? '🟢 Activo' : '✅ Completado'}
      </div>

      {/* Botones de Completar/Reabrir Torneo */}
      {isTournamentCreator && (
        localTournament.status === 'active' ? (
          <button
            onClick={handleCompleteTournament}
            style={{
              padding: '8px 16px',
              border: '2px solid var(--accent)',
              borderRadius: 'var(--border-radius)',
              background: 'var(--accent)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            🏁 Completar
          </button>
        ) : (
          <button
            onClick={handleReopenTournament}
            style={{
              padding: '8px 16px',
              border: '2px solid var(--secondary)',
              borderRadius: 'var(--border-radius)',
              background: 'var(--secondary)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            🔄 Reabrir
          </button>
        )
      )}
    </div>
  </div>
</div>

        {/* Banner de Torneo Completado */}
        {localTournament.status === 'completed' && (
          <div style={{ 
            background: 'linear-gradient(135deg, var(--accent), #d97706)',
            color: 'white',
            padding: '20px',
            borderRadius: 'var(--border-radius)',
            marginBottom: '24px',
            textAlign: 'center',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '24px' }}>🏆</span>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Torneo Completado</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                  Este torneo ha sido finalizado. {isTournamentCreator ? 'Puedes reabrirlo si necesitas hacer cambios.' : 'Consulta los resultados finales.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pestañas de Navegación */}
        <div className="glass-card" style={{ padding: '0', marginBottom: '30px' }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid var(--border-color)'
          }}>
            {[
              { id: 'play', label: 'Partidos', icon: '🎮' },
              { id: 'ranking', label: 'Ranking', icon: '🏆' },
              { id: 'matches', label: 'Historial', icon: '📋' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '20px 24px',
                  border: 'none',
                  background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Contenido de las Pestañas */}
          <div style={{ padding: '30px' }}>
            


            {/* Pestaña: JUGAR PARTIDO - VERSIÓN SIMPLIFICADA */}
            {activeTab === 'play' && (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: 'var(--text-primary)'
              }}>
                <div style={{ 
                  fontSize: '80px', 
                  marginBottom: '24px',
                  animation: 'bounce 2s infinite'
                }}>
                  🎮
                </div>
                
                <h2 style={{ 
                  marginBottom: '16px',
                  fontSize: '28px',
                  fontWeight: '700'
                }}>
                  Gestión de Partidos
                </h2>
                
                <p style={{ 
                  marginBottom: '32px', 
                  color: 'var(--text-secondary)',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  maxWidth: '500px',
                  margin: '0 auto 32px auto'
                }}>
                
                </p>

                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px',
                  alignItems: 'center',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}>
                  <Link 
                    to={`/tournament/${id}/play`}
                    className="btn-primary"
                    style={{ 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '16px 24px',
                      fontSize: '16px',
                      fontWeight: '600',
                      width: '100%'
                    }}
                  >
                    <span>🎯</span>
                    Ir a Partidos Pendientes
                    {pendingMatches.length > 0 && (
                      <span style={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {pendingMatches.length}
                      </span>
                    )}
                  </Link>

                  {/* Información rápida */}
                  <div style={{
                    background: 'var(--card-bg)',
                    padding: '16px',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-color)',
                    width: '100%',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      fontSize: '14px',
                      color: 'var(--text-secondary)'
                    }}>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>
                          {pendingMatches.length}
                        </div>
                        <div>Pendientes</div>
                      </div>
                      <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--secondary)' }}>
                          {completedMatches.length}
                        </div>
                        <div>Completados</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pequeña animación CSS */}
                <style>
                  {`
                    @keyframes bounce {
                      0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                      }
                      40% {
                        transform: translateY(-10px);
                      }
                      60% {
                        transform: translateY(-5px);
                      }
                    }
                  `}
                </style>
              </div>
            )}
            

{/* Pestaña: CLASIFICACIÓN - VERSIÓN RESPONSIVE */}
{activeTab === 'ranking' && (
  <div style={{ width: '100%', overflowX: 'hidden' }}>
    <h2 style={{ 
      color: 'var(--text-primary)', 
      marginBottom: '20px',
      fontSize: '22px'
    }}>
      Clasificación {localTournament.status === 'completed' ? 'Final ' : ''}del Torneo
    </h2>

    {ranking.length === 0 ? (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>No hay datos de clasificación</h3>
        <p style={{ fontSize: '14px' }}>Juega algunos partidos para generar la clasificación.</p>
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {ranking.map((player, index) => {
          const playerInfo = getPlayerInfoForRanking(player.playerId);
          
          return (
            <div key={player.playerId} className="glass-card" style={{ 
              padding: '16px',
              borderLeft: `4px solid ${
                index === 0 ? '#f59e0b' : 
                index === 1 ? '#9ca3af' : 
                index === 2 ? '#b45309' : 'var(--primary)'
              }`,
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '12px',
                width: '100%'
              }}>
                {/* Medalla/Número */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: index === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 
                              index === 1 ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 
                              index === 2 ? 'linear-gradient(135deg, #b45309, #92400e)' : 
                              'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>

                {/* Avatar y Nombre */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  flex: 1,
                  minWidth: 0
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: playerInfo.profilePicture ? 
                      `url(${playerInfo.profilePicture}) center/cover` :
                      'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: playerInfo.profilePicture ? '0' : '16px',
                    fontWeight: '600',
                    border: '2px solid var(--card-bg)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    flexShrink: 0
                  }}>
                    {!playerInfo.profilePicture && playerInfo.avatar}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 style={{ 
                      color: 'var(--text-primary)',
                      marginBottom: '2px',
                      fontSize: '15px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {playerInfo.name}
                    </h4>
                    <p style={{ 
                      color: 'var(--text-muted)', 
                      fontSize: '11px',
                      margin: 0
                    }}>
                      {playerInfo.isGuest && (
                        <span style={{ 
                          background: 'var(--accent)', 
                          color: 'white',
                          padding: '1px 5px',
                          borderRadius: '6px',
                          fontSize: '9px'
                        }}>
                          Invitado
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Estadísticas - Versión Compacta para Móvil */}
                <div style={{ 
                  display: 'flex', 
                  gap: '12px',
                  flexShrink: 0
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      color: 'var(--primary)', 
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>
                      {player.points}
                    </div>
                    <div style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '10px'
                    }}>
                      Pts
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      color: 'var(--secondary)', 
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>
                      {player.matches}
                    </div>
                    <div style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '10px'
                    }}>
                      Part
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      color: 'var(--accent)', 
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>
                      {player.globalScore}
                    </div>
                    <div style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '10px'
                    }}>
                      Avg
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
)}

{/* Pestaña: HISTORIAL - VERSIÓN COMPRIMIDA Y MEJORADA */}
{activeTab === 'matches' && (
  <div style={{ width: '100%', overflowX: 'hidden' }}>
    <h2 style={{ 
      color: 'var(--text-primary)', 
      marginBottom: '20px',
      fontSize: '22px'
    }}>
      Historial de Partidos ({completedMatches.length})
    </h2>

    {completedMatches.length === 0 ? (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
        <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>No hay partidos completados</h3>
        <p style={{ fontSize: '14px' }}>Los partidos completados aparecerán aquí.</p>
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {completedMatches.map(match => (
          <div key={match.id} className="glass-card" style={{ 
            padding: '16px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Header del partido comprimido */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {new Date(match.createdAt).toLocaleDateString()} • {new Date(match.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <div style={{ 
                background: 'var(--primary)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                Completado
              </div>
            </div>

            {/* EQUIPOS EN LÍNEA - UNO AL LADO DEL OTRO */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              
              {/* EQUIPO 1 - IZQUIERDA */}
              <div style={{ 
                flex: 1, 
                minWidth: '120px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '11px',
                  fontWeight: '600',
                  marginBottom: '4px',
                  textAlign: 'center'
                }}>
                  Equipo 1
                </div>
                {match.team1.map(playerId => (
                  <div key={playerId} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    justifyContent: 'flex-start'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '600',
                      flexShrink: 0
                    }}>
                      {getPlayerAvatar(playerId)}
                    </div>
                    <span style={{ 
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1
                    }}>
                      {getPlayerName(playerId)}
                    </span>
                  </div>
                ))}
              </div>

              {/* RESULTADO CENTRAL */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
                minWidth: '80px'
              }}>
                <div style={{ 
                  background: match.scoreTeam1 > match.scoreTeam2 ? 
                    'linear-gradient(135deg, #ef4444, #dc2626)' : 
                    'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: 'var(--border-radius)',
                  fontWeight: '700',
                  fontSize: '16px',
                  textAlign: 'center',
                  minWidth: '70px'
                }}>
                  {match.scoreTeam1} - {match.scoreTeam2}
                </div>
                <div style={{ 
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {match.scoreTeam1 > match.scoreTeam2 ? '🏆 Ganó Eq. 1' : '🏆 Ganó Eq. 2'}
                </div>
              </div>

              {/* EQUIPO 2 - DERECHA */}
              <div style={{ 
                flex: 1, 
                minWidth: '120px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '11px',
                  fontWeight: '600',
                  marginBottom: '4px',
                  textAlign: 'center'
                }}>
                  Equipo 2
                </div>
                {match.team2.map(playerId => (
                  <div key={playerId} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    justifyContent: 'flex-end'
                  }}>
                    <span style={{ 
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1,
                      textAlign: 'right'
                    }}>
                      {getPlayerName(playerId)}
                    </span>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '600',
                      flexShrink: 0
                    }}>
                      {getPlayerAvatar(playerId)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Línea separadora */}
            <div style={{ 
              height: '1px', 
              background: 'var(--border-color)', 
              margin: '12px 0 8px 0'
            }}></div>

            {/* Información adicional compacta */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '10px',
              color: 'var(--text-muted)'
            }}>
              <span>Partido #{match.id.toString().slice(-4)}</span>
              <span>Duración: ~12 min</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)} 

  </div>
        </div>
      </div>
    </div>
  );
}
// nada aqui pa ver hasta donde ahora TOURNAMENT PLAY aquí mero 

// Componente TournamentPlay - VISTA DEDICADA PARA PARTIDOS PENDIENTES
function TournamentPlay() {
  const { id } = useParams();
  const { getters, state, actions } = useApp();
  const tournament = getters.getTournamentById(parseInt(id));
  const navigate = useNavigate();

  const [editingScores, setEditingScores] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [localTournament, setLocalTournament] = useState(null);

  // Sincronizar el torneo local
  useEffect(() => {
    if (tournament) {
      setLocalTournament(tournament);
    }
  }, [tournament]);

  if (!tournament || !localTournament) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        padding: '40px 20px',
        textAlign: 'center',
        color: 'var(--text-primary)'
      }}>
        <h1>Torneo no encontrado</h1>
        <Link to="/tournaments" className="btn-primary">
          Volver a Torneos
        </Link>
      </div>
    );
  }

  // Funciones existentes (las mismas que en TournamentDetail)
  const getPlayerName = (playerId) => {
    if (typeof playerId === 'string' && playerId.startsWith('guest-')) {
      const guestIndex = parseInt(playerId.split('-')[1]);
      return localTournament.guestPlayers[guestIndex] + ' (Invitado)';
    }
    const player = state.users.find(u => u.id === playerId);
    return player ? player.name : 'Jugador no encontrado';
  };

  const getPlayerAvatar = (playerId) => {
    if (typeof playerId === 'string' && playerId.startsWith('guest-')) {
      return '👤';
    }
    const player = state.users.find(u => u.id === playerId);
    return player ? player.avatar : '👤';
  };

  const getWaitingPlayers = (match) => {
    const allPlayers = [...localTournament.players, ...localTournament.guestPlayers.map((_, idx) => `guest-${idx}`)];
    const playingPlayers = [...(match.team1 || []), ...(match.team2 || [])];
    return allPlayers.filter(player => !playingPlayers.includes(player));
  };

// Agrega esta función en TournamentPlay, después de getWaitingPlayers y antes del return:

// Función para generar partidos balanceados - COPIADA DE TournamentDetail
const generateBalancedMatch = (allPlayers, existingMatches) => {
  if (allPlayers.length < 4) {
    const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
    return {
      team1: shuffled.slice(0, 2),
      team2: shuffled.slice(2, 4),
      scoreTeam1: null,
      scoreTeam2: null
    };
  }

  // 1. CALCULAR ESTADÍSTICAS PRECISAS DE PARTIDOS
  const playerStats = {};
  allPlayers.forEach(player => {
    playerStats[player] = {
      gamesPlayed: 0,
      gamesWaiting: 0,
      consecutiveWaits: 0,
      lastStatus: 'waiting',
      partners: new Set(),
      opponents: new Set(),
      lastPlayedMatchIndex: -1
    };
  });

  // Procesar todos los partidos existentes en orden
  existingMatches.forEach((match, matchIndex) => {
    const playingPlayers = [...(match.team1 || []), ...(match.team2 || [])];
    const waitingPlayers = allPlayers.filter(p => !playingPlayers.includes(p));
    
    // Actualizar jugadores que JUGARON
    playingPlayers.forEach(playerId => {
      playerStats[playerId].gamesPlayed++;
      
      // Resetear esperas consecutivas si estaba esperando
      if (playerStats[playerId].lastStatus === 'waiting') {
        playerStats[playerId].consecutiveWaits = 0;
      }
      playerStats[playerId].lastStatus = 'playing';
      playerStats[playerId].lastPlayedMatchIndex = matchIndex;
      
      // Registrar compañeros
      if (match.team1.includes(playerId)) {
        match.team1.forEach(partner => {
          if (partner !== playerId) playerStats[playerId].partners.add(partner);
        });
        match.team2.forEach(opponent => {
          playerStats[playerId].opponents.add(opponent);
        });
      } else {
        match.team2.forEach(partner => {
          if (partner !== playerId) playerStats[playerId].partners.add(partner);
        });
        match.team1.forEach(opponent => {
          playerStats[playerId].opponents.add(opponent);
        });
      }
    });
    
    // Actualizar jugadores que ESPERARON
    waitingPlayers.forEach(playerId => {
      playerStats[playerId].gamesWaiting++;
      
      // Incrementar esperas consecutivas
      if (playerStats[playerId].lastStatus === 'waiting') {
        playerStats[playerId].consecutiveWaits++;
      } else {
        playerStats[playerId].consecutiveWaits = 1;
      }
      playerStats[playerId].lastStatus = 'waiting';
    });
  });

  // 2. CALCULAR MÉTRICAS DE BALANCE
  const totalMatches = existingMatches.length;
  const idealGamesPerPlayer = totalMatches > 0 ? (totalMatches * 4) / allPlayers.length : 0;
  
  // Encontrar jugadores con más y menos partidos
  const gamesPlayedCounts = allPlayers.map(p => playerStats[p].gamesPlayed);
  const minGames = Math.min(...gamesPlayedCounts);
  const maxGames = Math.max(...gamesPlayedCounts);
  const gamesDifference = maxGames - minGames;

  // 3. FUNCIÓN DE SCORE CON PRIORIDAD EN BALANCE
  const calculateCombinationScore = (team1, team2) => {
    let score = 0;
    const allPlayingPlayers = [...team1, ...team2];
    const waitingPlayers = allPlayers.filter(p => !allPlayingPlayers.includes(p));

    // PRIORIDAD 1: BALANCE DE PARTIDOS JUGADOS (60% del score)
    const playingPlayersGames = allPlayingPlayers.map(p => playerStats[p].gamesPlayed);
    const avgPlayingGames = playingPlayersGames.reduce((a, b) => a + b, 0) / 4;
    
    // Premiar MUCHO incluir jugadores con menos partidos
    allPlayingPlayers.forEach(playerId => {
      const gamesDiffFromIdeal = idealGamesPerPlayer - playerStats[playerId].gamesPlayed;
      
      if (gamesDiffFromIdeal > 0) {
        // Jugador está por DEBAJO del ideal - PRIORIDAD MÁXIMA
        score += gamesDiffFromIdeal * 25;
      } else {
        // Jugador está por ENCIMA del ideal - leve penalización
        score += gamesDiffFromIdeal * 5;
      }
    });

    // PRIORIDAD 2: EVITAR ESPERAS CONSECUTIVAS (25% del score)
    waitingPlayers.forEach(playerId => {
      const waitPenalty = playerStats[playerId].consecutiveWaits * 30;
      score -= waitPenalty;
      
      // Penalización EXTRA si el jugador tiene pocos partidos y espera otra vez
      if (playerStats[playerId].gamesPlayed < idealGamesPerPlayer) {
        score -= 15;
      }
    });

    // Premiar especialmente sacar de espera a jugadores con muchas esperas consecutivas
    allPlayingPlayers.forEach(playerId => {
      if (playerStats[playerId].consecutiveWaits > 0) {
        score += playerStats[playerId].consecutiveWaits * 20;
      }
    });

    // PRIORIDAD 3: DIVERSIFICACIÓN DE EQUIPOS (15% del score)
    team1.forEach(player1 => {
      team1.forEach(player2 => {
        if (player1 !== player2) {
          // Penalizar si ya han sido compañeros (pero menos que antes)
          if (playerStats[player1].partners.has(player2)) {
            score -= 8;
          }
          // Premiar ligeramente compañeros nuevos
          else {
            score += 3;
          }
        }
      });
    });

    team2.forEach(player1 => {
      team2.forEach(player2 => {
        if (player1 !== player2) {
          if (playerStats[player1].partners.has(player2)) {
            score -= 8;
          } else {
            score += 3;
          }
        }
      });
    });

    // 4. EVITAR DUPLICADOS EXACTOS DE EQUIPOS
    const team1Key = team1.sort().join('-');
    const team2Key = team2.sort().join('-');
    
    const hasDuplicateTeams = existingMatches.some(match => {
      const matchTeam1 = match.team1?.sort().join('-');
      const matchTeam2 = match.team2?.sort().join('-');
      return (team1Key === matchTeam1 && team2Key === matchTeam2) ||
             (team1Key === matchTeam2 && team2Key === matchTeam1);
    });
    
    if (hasDuplicateTeams) {
      score -= 40;
    }

    // 5. BONO por equilibrio de experiencia dentro del partido
    const team1Exp = team1.reduce((sum, p) => sum + playerStats[p].gamesPlayed, 0);
    const team2Exp = team2.reduce((sum, p) => sum + playerStats[p].gamesPlayed, 0);
    const expDiff = Math.abs(team1Exp - team2Exp);
    if (expDiff <= 1) {
      score += 10; // Bono por equipos balanceados
    }

    return score;
  };

  // 4. ESTRATEGIA DE BÚSQUEDA INTELIGENTE
  let bestCombination = null;
  let bestScore = -Infinity;
  
  // PRIMERO: Intentar combinaciones que maximicen el balance
  for (let attempt = 0; attempt < 300; attempt++) {
    // Ordenar jugadores por prioridad (menos partidos primero)
    const prioritizedPlayers = [...allPlayers].sort((a, b) => {
      const priorityA = (idealGamesPerPlayer - playerStats[a].gamesPlayed) * 10 + 
                       (playerStats[a].consecutiveWaits * 5);
      const priorityB = (idealGamesPerPlayer - playerStats[b].gamesPlayed) * 10 + 
                       (playerStats[b].consecutiveWaits * 5);
      return priorityB - priorityA; // Mayor prioridad primero
    });

    // Tomar los 4 jugadores con mayor prioridad y mezclarlos
    const topPriorityPlayers = prioritizedPlayers.slice(0, Math.min(6, allPlayers.length));
    const shuffled = [...topPriorityPlayers].sort(() => Math.random() - 0.5);
    const team1 = shuffled.slice(0, 2);
    const team2 = shuffled.slice(2, 4);

    // Si no tenemos 4 jugadores, completar con el resto
    if (team1.length < 2 || team2.length < 2) {
      const remainingPlayers = allPlayers.filter(p => !team1.includes(p) && !team2.includes(p));
      const additionalPlayers = remainingPlayers.slice(0, 4 - team1.length - team2.length);
      if (team1.length < 2) {
        team1.push(...additionalPlayers.slice(0, 2 - team1.length));
      }
      if (team2.length < 2) {
        team2.push(...additionalPlayers.slice(2 - team1.length));
      }
    }

    const score = calculateCombinationScore(team1, team2);
    
    if (score > bestScore) {
      bestScore = score;
      bestCombination = { team1, team2 };
    }

    // Si encontramos una combinación excelente, terminar antes
    if (score > 200) break;
  }

  // 5. FALLBACK: Si no encontramos buena combinación
  if (!bestCombination) {
    // Ordenar por menos partidos jugados y tomar los primeros 4
    const sortedByGames = [...allPlayers].sort((a, b) => 
      playerStats[a].gamesPlayed - playerStats[b].gamesPlayed
    );
    bestCombination = {
      team1: sortedByGames.slice(0, 2),
      team2: sortedByGames.slice(2, 4)
    };
  }

  return {
    team1: bestCombination.team1,
    team2: bestCombination.team2,
    scoreTeam1: null,
    scoreTeam2: null
  };
};


  const handleScoreChange = (matchId, team, value) => {
    if (localTournament.status === 'completed') {
      alert('No puedes editar partidos en un torneo completado.');
      return;
    }

    const newEditingScores = {
      ...editingScores,
      [matchId]: {
        ...editingScores[matchId],
        [team]: value,
        [team === 'team1' ? 'team2' : 'team1']: value === '' ? '' : (4 - parseInt(value)).toString()
      }
    };
    
    setEditingScores(newEditingScores);
    setHasUnsavedChanges(true);
  };

  const saveAllScores = () => {
    if (localTournament.status === 'completed') {
      alert('No puedes guardar cambios en un torneo completado.');
      return;
    }

    let hasErrors = false;
    const errors = [];

    Object.entries(editingScores).forEach(([matchId, scores]) => {
      if (!scores.team1 || !scores.team2) {
        errors.push(`Partido ${matchId}: Faltan puntuaciones`);
        hasErrors = true;
        return;
      }

      const score1 = parseInt(scores.team1);
      const score2 = parseInt(scores.team2);

      if (score1 + score2 !== 4) {
        errors.push(`Partido ${matchId}: La suma debe ser 4 (${score1 + score2})`);
        hasErrors = true;
      }
    });

    if (hasErrors) {
      alert('Errores encontrados:\n' + errors.join('\n'));
      return;
    }

    Object.entries(editingScores).forEach(([matchId, scores]) => {
      const match = localTournament.matches.find(m => m.id === parseInt(matchId));
      if (match && scores.team1 && scores.team2) {
        actions.updateMatchScore(localTournament.id, parseInt(matchId), {
          scoreTeam1: parseInt(scores.team1),
          scoreTeam2: parseInt(scores.team2),
          status: 'completed'
        });
      }
    });

    setEditingScores({});
    setHasUnsavedChanges(false);
    alert('¡Partidos guardados correctamente!');
  };

  const cancelEditing = () => {
    setEditingScores({});
    setHasUnsavedChanges(false);
  };

  const addAdditionalMatch = () => {
    if (localTournament.status === 'completed') {
      alert('No puedes añadir partidos a un torneo completado.');
      return;
    }

    const allPlayers = [...localTournament.players, ...localTournament.guestPlayers.map((_, idx) => `guest-${idx}`)];
    
    if (allPlayers.length < 4) {
      alert('Se necesitan al menos 4 jugadores para crear un partido');
      return;
    }

    const newMatch = generateBalancedMatch(allPlayers, localTournament.matches);
    
    actions.addTournamentMatch(localTournament.id, {
      ...newMatch,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    
    alert('¡Partido adicional añadido!');
  };

  const handleDeleteMatch = (matchId) => {
    if (localTournament.status === 'completed') {
      alert('No puedes eliminar partidos en un torneo completado.');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar este partido?')) {
      const updatedMatches = localTournament.matches.filter(match => match.id !== matchId);
      actions.updateTournament(localTournament.id, { matches: updatedMatches });
    }
  };

  const pendingMatches = localTournament.matches.filter(match => match.status === 'pending');

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      padding: '0', // Sin padding para usar todo el espacio
      overflowX: 'hidden'
    }}>
      <style>{themeStyles}</style>
      
      {/* Header Fijo */}
      <div style={{
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(10px)',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate(`/tournament/${id}`)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                padding: '8px'
              }}
            >
              ←
            </button>
            <div>
              <h1 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: 'var(--text-primary)',
                margin: 0
              }}>
                {localTournament.name}
              </h1>
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '12px',
                margin: 0
              }}>
                Partidos Pendientes: {pendingMatches.length}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ 
              background: localTournament.status === 'active' ? 'var(--secondary)' : 'var(--accent)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {localTournament.status === 'active' ? '🟢 Activo' : '✅ Completado'}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido Principal - SIN BORDES EXTRA */}
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Botón Añadir Partido */}
        {localTournament.status === 'active' && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <button
              onClick={addAdditionalMatch}
              style={{
                padding: '12px 20px',
                border: '2px solid var(--secondary)',
                borderRadius: 'var(--border-radius)',
                background: 'var(--secondary)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ➕ Añadir Partido
            </button>

            {hasUnsavedChanges && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={saveAllScores}
                  className="btn-primary"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '10px 16px',
                    fontSize: '14px'
                  }}
                >
                  💾 Guardar Todo
                </button>
                <button
                  onClick={cancelEditing}
                  style={{
                    padding: '10px 16px',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ❌ Cancelar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Lista de Partidos Pendientes - DISEÑO LIMPIO */}
        {pendingMatches.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
            <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>
              ¡No hay partidos pendientes!
            </h3>
            <p style={{ marginBottom: '24px', fontSize: '16px' }}>
              Todos los partidos han sido completados.
            </p>
            {localTournament.status === 'active' && (
              <button
                onClick={addAdditionalMatch}
                className="btn-primary"
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ➕ Crear Nuevo Partido
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {pendingMatches.map(match => {
              const currentScores = editingScores[match.id] || {};
              const score1 = currentScores.team1 || '';
              const score2 = currentScores.team2 || '';
              const isValidScore = score1 && score2 && (parseInt(score1) + parseInt(score2) === 4);

              return (
                <div key={match.id} style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '0', // Sin padding interno
                  border: '1px solid var(--border-color)',
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  {/* CANCHA DE PÁDEL - VERSIÓN COMPACTA Y ANCHA */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, #1564beff, #1564beff)',
                    padding: '20px 15px',
                    position: 'relative',
                    minHeight: '180px',
                    width: '100%'
                  }}>
                    {/* Línea central */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '0',
                      bottom: '0',
                      width: '2px',
                      background: 'rgba(255,255,255,0.4)',
                      transform: 'translateX(-50%)'
                    }}></div>
                    
                    {/* Red */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '100%',
                      height: '2px',
                      background: 'rgba(255,255,255,0.4)'
                    }}></div>

                    {/* Equipo 1 - Más espacio */}
                    <div style={{
                      position: 'absolute',
                      left: '2%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '46%'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {match.team1.map(playerId => (
                          <div key={playerId} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px'
                          }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: '#dc2626',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '600',
                              border: '2px solid white'
                            }}>
                              {getPlayerAvatar(playerId)}
                            </div>
                            <span style={{ 
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '14px',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                            }}>
                              {getPlayerName(playerId)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* VS */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: '#1564beff',
                      color: 'rgba(255, 255, 255, 0.9)',
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '700',
                      border: '2px solid rgba(255,255,255,0.6)'
                    }}>
                      VS
                    </div>

                    {/* Equipo 2 - Más espacio */}
                    <div style={{
                      position: 'absolute',
                      right: '2%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '46%'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {match.team2.map(playerId => (
                          <div key={playerId} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            justifyContent: 'flex-end'
                          }}>
                            <span style={{ 
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '14px',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                              textAlign: 'right'
                            }}>
                              {getPlayerName(playerId)}
                            </span>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: '#1d4ed8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '600',
                              border: '2px solid white'
                            }}>
                              {getPlayerAvatar(playerId)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Marcador */}
                    <div style={{
                      position: 'absolute',
                      top: '0px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(118, 121, 148, 0.95)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '140px',
                      justifyContent: 'center'
                    }}>
                      <select
                        value={score1}
                        onChange={(e) => handleScoreChange(match.id, 'team1', e.target.value)}
                        style={{
                          padding: '6px 8px',
                          border: '2px solid #860d0dff',
                          borderRadius: '6px',
                          background: '#cf7e7e96',
                          color: '#741414ff',
                          fontWeight: '700',
                          fontSize: '14px',
                          minWidth: '50px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">-</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>

                      <div style={{ color: 'white', fontWeight: '600' }}>-</div>

                      <select
                        value={score2}
                        onChange={(e) => handleScoreChange(match.id, 'team2', e.target.value)}
                        style={{
                          padding: '6px 8px',
                          border: '2px solid #0d1f86ff',
                          borderRadius: '6px',
                          background: '#7f7ecf96',
                          color: '#152f77ff',
                          fontWeight: '700',
                          fontSize: '14px',
                          minWidth: '50px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">-</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>

                    {/* Validación */}
                    {score1 && score2 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: isValidScore ? 'rgba(18, 99, 72, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {isValidScore ? '✅ Listo' : '❌ Suma 4'}
                      </div>
                    )}
                  </div>

                  {/* Jugadores en Espera */}
                  <div style={{ 
                    padding: '12px 15px',
                    background: 'var(--card-bg)',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '16px' }}>🛋️</span>
                      <span style={{ 
                        color: 'var(--text-primary)', 
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        Jugadores en espera: {getWaitingPlayers(match).length}
                      </span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '6px'
                    }}>
                      {getWaitingPlayers(match).map(playerId => (
                        <span
                          key={playerId}
                          style={{
                            padding: '4px 8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'var(--text-secondary)',
                            borderRadius: '12px',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {getPlayerAvatar(playerId)} {getPlayerName(playerId)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botón Eliminar */}
                  {localTournament.status === 'active' && (
                    <div style={{ 
                      padding: '12px 15px',
                      background: 'var(--card-bg)',
                      borderTop: '1px solid var(--border-color)',
                      textAlign: 'center'
                    }}>
                      <button
                        onClick={() => handleDeleteMatch(match.id)}
                        style={{
                          padding: '8px 16px',
                          border: '1px solid #ef4444',
                          borderRadius: 'var(--border-radius)',
                          background: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        🗑️ Eliminar Partido
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
// Componentes Placeholder


// Componente Profile - VERSIÓN COMPLETA ACTUALIZADA
// Componente Profile - VERSIÓN COMPLETAMENTE REDISEÑADA PARA MÓVIL
// Componente Profile - VERSIÓN ACTUALIZADA CON TODAS LAS MEJORAS
// Componente Profile - VERSIÓN CORREGIDA Y COMPLETA
function Profile() {
  const { state, getters, actions } = useApp();
  const { currentUser } = state;
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    profilePicture: null
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const fileInputRef = useRef(null);

  // Cargar datos del formulario cuando entra en modo edición
  useEffect(() => {
    if (currentUser && isEditing) {
      setEditForm({
        name: currentUser.name,
        email: currentUser.email,
        profilePicture: currentUser.profilePicture || null
      });
      setPreviewUrl(currentUser.profilePicture || '');
    }
  }, [currentUser, isEditing]);

  // Manejar selección de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida (JPEG, PNG, etc.)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      setEditForm({
        ...editForm,
        profilePicture: file
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!editForm.name.trim()) {
      alert('El nombre es requerido');
      return;
    }

    if (!editForm.email.trim()) {
      alert('El email es requerido');
      return;
    }

    actions.updateUserProfile(currentUser.id, {
      name: editForm.name,
      email: editForm.email,
      profilePicture: previewUrl,
      avatar: '👤'
    });
    
    setIsEditing(false);
    alert('Perfil actualizado correctamente!');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreviewUrl(currentUser.profilePicture || '');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    alert('Contraseña cambiada exitosamente (demo)');
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      actions.logout();
    }
  };

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Calcular estadísticas globales del usuario
  const calculateGlobalStats = () => {
    const userStats = getters.getUserStats();
    const userTournaments = getters.getTournamentsByClub().filter(t => 
      t.players.includes(currentUser.id) || 
      t.guestPlayers.some(guest => guest.includes(currentUser.name))
    );

    let totalMatches = 0;
    let totalWins = 0;
    let totalPoints = 0;
    let recentMatches = [];

    userTournaments.forEach(tournament => {
      tournament.matches.forEach(match => {
        if (match.status === 'completed' && 
            (match.team1.includes(currentUser.id) || match.team2.includes(currentUser.id))) {
          totalMatches++;
          
          const userTeam = match.team1.includes(currentUser.id) ? 'team1' : 'team2';
          const userScore = userTeam === 'team1' ? match.scoreTeam1 : match.scoreTeam2;
          const opponentScore = userTeam === 'team1' ? match.scoreTeam2 : match.scoreTeam1;
          
          totalPoints += userScore;
          if (userScore > opponentScore) {
            totalWins++;
          }

          // Para estadísticas detalladas
          recentMatches.push({
            userScore,
            opponentScore,
            won: userScore > opponentScore,
            tournamentName: tournament.name,
            date: match.createdAt
          });
        }
      });
    });

    const winRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;
    const avgPointsPerMatch = totalMatches > 0 ? (totalPoints / totalMatches).toFixed(1) : 0;

    // Estadísticas detalladas
    const bestScore = recentMatches.length > 0 ? Math.max(...recentMatches.map(m => m.userScore)) : 0;
    const worstScore = recentMatches.length > 0 ? Math.min(...recentMatches.map(m => m.userScore)) : 0;
    const avgScoreDifference = recentMatches.length > 0 
      ? (recentMatches.reduce((acc, m) => acc + (m.userScore - m.opponentScore), 0) / recentMatches.length).toFixed(1)
      : 0;

    return {
      totalMatches,
      totalWins,
      totalLosses: totalMatches - totalWins,
      totalPoints,
      winRate: Math.round(winRate),
      avgPointsPerMatch,
      tournamentsCount: userTournaments.length,
      bestScore,
      worstScore,
      avgScoreDifference,
      recentMatches: recentMatches.slice(0, 10)
    };
  };

  const globalStats = calculateGlobalStats();

  // Obtener partidos recientes para la pestaña de Partidos
  const getRecentMatches = () => {
    const recentMatches = [];
    const userTournaments = getters.getTournamentsByClub().filter(t => 
      t.players.includes(currentUser.id) || 
      t.guestPlayers.some(guest => guest.includes(currentUser.name))
    );

    userTournaments.forEach(tournament => {
      tournament.matches.forEach(match => {
        if (match.status === 'completed' && 
            (match.team1.includes(currentUser.id) || match.team2.includes(currentUser.id))) {
          recentMatches.push({
            ...match,
            tournamentName: tournament.name,
            date: match.createdAt
          });
        }
      });
    });

    return recentMatches
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const recentMatches = getRecentMatches();

  // SISTEMA DE LOGROS MEJORADO - CON PROGRESIÓN
  const achievements = [
    {
      id: 1,
      name: "Primer Partido",
      description: "Completa tu primer partido",
      icon: "🎯",
      unlocked: globalStats.totalMatches >= 1,
      progress: Math.min((globalStats.totalMatches / 1) * 100, 100),
      requirement: "1 partido"
    },
    {
      id: 2,
      name: "Competidor Activo",
      description: "Juega 5 partidos",
      icon: "🎾",
      unlocked: globalStats.totalMatches >= 5,
      progress: Math.min((globalStats.totalMatches / 5) * 100, 100),
      requirement: "5 partidos"
    },
    {
      id: 3,
      name: "Jugador Experimentado",
      description: "Juega 10 partidos",
      icon: "⚡",
      unlocked: globalStats.totalMatches >= 10,
      progress: Math.min((globalStats.totalMatches / 10) * 100, 100),
      requirement: "10 partidos"
    },
    {
      id: 4,
      name: "Primera Victoria",
      description: "Gana tu primer partido",
      icon: "🥇",
      unlocked: globalStats.totalWins >= 1,
      progress: Math.min((globalStats.totalWins / 1) * 100, 100),
      requirement: "1 victoria"
    },
    {
      id: 5,
      name: "Victorioso",
      description: "Gana 3 partidos",
      icon: "💪",
      unlocked: globalStats.totalWins >= 3,
      progress: Math.min((globalStats.totalWins / 3) * 100, 100),
      requirement: "3 victorias"
    },
    {
      id: 6,
      name: "Puntaje Alto",
      description: "Anota 4 puntos en un partido",
      icon: "💎",
      unlocked: globalStats.bestScore >= 4,
      progress: globalStats.bestScore >= 4 ? 100 : Math.min((globalStats.bestScore / 4) * 100, 100),
      requirement: "4 puntos en un partido"
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      padding: '16px',
      paddingBottom: '100px',
      overflowX: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <style>{`
        .profile-tabs-container {
          width: 100%;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .profile-tabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          padding: 8px 0;
          width: 100%;
        }

        .tab-button-mobile {
          padding: 10px 4px;
          border: none;
          border-radius: 10px;
          background: var(--card-bg);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          border: 1px solid var(--border-color);
          min-height: 55px;
          justify-content: center;
        }

        .tab-button-mobile.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .tab-button-mobile .tab-icon {
          font-size: 14px;
        }

        .tab-button-mobile .tab-label {
          font-size: 10px;
          text-align: center;
          line-height: 1.2;
        }

        .stats-grid-mobile {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat-card-mobile {
          background: var(--card-bg);
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid var(--border-color);
        }

        .match-card-mobile {
          background: var(--card-bg);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 12px;
          border: 1px solid var(--border-color);
        }

        .achievement-card {
          background: var(--card-bg);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 12px;
          border: 1px solid var(--border-color);
          opacity: 1;
          transition: all 0.3s ease;
        }

        .achievement-card.locked {
          opacity: 0.6;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: var(--border-color);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--secondary), var(--accent));
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .detailed-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .detailed-stat {
          background: var(--card-bg);
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid var(--border-color);
        }

        .settings-section {
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
          border: 1px solid var(--border-color);
        }

        .settings-button {
          width: 100%;
          padding: 16px;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          background: transparent;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .settings-button:hover {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
        }

        .settings-button.danger {
          border-color: #ef4444;
          color: #ef4444;
        }

        .settings-button.danger:hover {
          background: rgba(239, 68, 68, 0.05);
        }
      `}</style>
      
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Header del Perfil */}
        <div className="glass-card" style={{ 
          padding: '20px',
          marginBottom: '20px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {!isEditing ? (
            // Vista normal del perfil
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{
                  width: '80px',
                  height: '80px',
                  background: currentUser.profilePicture ? 
                    `url(${currentUser.profilePicture}) center/cover` :
                    'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  border: '3px solid var(--card-bg)',
                  boxShadow: 'var(--shadow-lg)',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {!currentUser.profilePicture && currentUser.avatar}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                  wordWrap: 'break-word'
                }}>
                  {currentUser.name}
                </h1>
                
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  marginBottom: '12px',
                  fontSize: '14px',
                  wordWrap: 'break-word'
                }}>
                  {currentUser.email}
                </p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      fontSize: '13px',
                      flex: 1,
                      minWidth: '140px'
                    }}
                  >
                    ✏️ Editar Perfil
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                      padding: '10px 16px',
                      border: '2px solid var(--accent)',
                      borderRadius: 'var(--border-radius)',
                      background: 'transparent',
                      color: 'var(--accent)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flex: 1,
                      minWidth: '140px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'var(--accent)';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--accent)';
                    }}
                  >
                    ⚙️ Ajustes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // FORMULARIO DE EDICIÓN COMPLETO
            <form onSubmit={handleSaveProfile}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>
                  Editar Perfil
                </h3>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '5px'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Avatar y Foto de Perfil */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div 
                  onClick={handleAvatarClick}
                  style={{
                    width: '100px',
                    height: '100px',
                    background: previewUrl ? 
                      `url(${previewUrl}) center/cover` :
                      'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    color: 'white',
                    border: '3px solid var(--card-bg)',
                    boxShadow: 'var(--shadow-lg)',
                    cursor: 'pointer',
                    marginBottom: '10px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {!previewUrl && '👤'}
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Cambiar
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '5px 0 0 0' }}>
                  Haz clic en la imagen para cambiar tu foto
                </p>
              </div>

              {/* Campos del Formulario */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  💾 Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    padding: '12px 20px',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Pestañas de Navegación */}
        <div className="profile-tabs-container">
          <div className="profile-tabs">
            {[
              { id: 'overview', label: 'Resumen', icon: '📊' },
              { id: 'stats', label: 'Estadísticas', icon: '📈' },
              { id: 'matches', label: 'Partidos', icon: '🎾' },
              { id: 'achievements', label: 'Logros', icon: '🏅' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button-mobile ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de las Pestañas */}
        <div>
          {/* Pestaña: RESUMEN */}
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '16px',
                fontSize: '18px'
              }}>
                Resumen de Actividad
              </h3>

              <div className="stats-grid-mobile">
                <div className="stat-card-mobile">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    {globalStats.totalMatches}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Partidos Totales
                  </div>
                </div>
                
                <div className="stat-card-mobile">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--secondary)', marginBottom: '4px' }}>
                    {globalStats.winRate}%
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Tasa de Victorias
                  </div>
                </div>
                
                <div className="stat-card-mobile">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent)', marginBottom: '4px' }}>
                    {globalStats.avgPointsPerMatch}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Puntos/Partido
                  </div>
                </div>
                
                <div className="stat-card-mobile">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6', marginBottom: '4px' }}>
                    {globalStats.tournamentsCount}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Torneos
                  </div>
                </div>
              </div>

              {/* Logros Destacados */}
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '16px' }}>
                  Logros Destacados
                </h4>
                {unlockedAchievements.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {unlockedAchievements.slice(0, 3).map(achievement => (
                      <div key={achievement.id} className="achievement-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '24px' }}>{achievement.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
                              {achievement.name}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                              {achievement.description}
                            </div>
                          </div>
                          <div style={{ 
                            background: 'var(--secondary)', 
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            ¡Desbloqueado!
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '30px 20px',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      Juega partidos para desbloquear logros
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pestaña: ESTADÍSTICAS */}
          {activeTab === 'stats' && (
            <div>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '16px',
                fontSize: '18px'
              }}>
                Estadísticas Detalladas
              </h3>

              <div className="detailed-stats-grid">
                <div className="detailed-stat">
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    {globalStats.totalWins}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                    Victorias
                  </div>
                </div>
                
                <div className="detailed-stat">
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>
                    {globalStats.totalLosses}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                    Derrotas
                  </div>
                </div>
                
                <div className="detailed-stat">
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)', marginBottom: '4px' }}>
                    {globalStats.bestScore}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                    Mejor Puntuación
                  </div>
                </div>
                
                <div className="detailed-stat">
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#8b5cf6', marginBottom: '4px' }}>
                    {globalStats.worstScore}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                    Peor Puntuación
                  </div>
                </div>
              </div>

              {/* Progreso de Logros */}
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '16px' }}>
                  Progreso de Logros
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {achievements.slice(0, 4).map(achievement => (
                    <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? '' : 'locked'}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ fontSize: '20px' }}>{achievement.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '13px' }}>
                            {achievement.name}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                            {achievement.description}
                          </div>
                        </div>
                        <div style={{ 
                          background: achievement.unlocked ? 'var(--secondary)' : 'var(--border-color)',
                          color: achievement.unlocked ? 'white' : 'var(--text-muted)',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '600'
                        }}>
                          {achievement.unlocked ? '✅' : `${achievement.progress}%`}
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '4px' }}>
                        {achievement.requirement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pestaña: PARTIDOS */}
          {activeTab === 'matches' && (
            <div>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '16px',
                fontSize: '18px'
              }}>
                Partidos Recientes
              </h3>

              {recentMatches.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentMatches.map((match, index) => {
                    const userTeam = match.team1.includes(currentUser.id) ? 'team1' : 'team2';
                    const userScore = userTeam === 'team1' ? match.scoreTeam1 : match.scoreTeam2;
                    const opponentScore = userTeam === 'team1' ? match.scoreTeam2 : match.scoreTeam1;
                    const won = userScore > opponentScore;

                    return (
                      <div key={match.id} className="match-card-mobile">
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
                            {match.tournamentName}
                          </div>
                          <div style={{ 
                            background: won ? 'var(--secondary)' : '#ef4444',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {won ? '🏆 Ganado' : '💔 Perdido'}
                          </div>
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                            Tú: {userScore} - {opponentScore} :Oponente
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                            {new Date(match.date).toLocaleDateString()}
                          </div>
                        </div>

                        <div style={{ 
                          display: 'flex', 
                          gap: '8px',
                          fontSize: '11px',
                          color: 'var(--text-muted)'
                        }}>
                          <span>Partido #{match.id.toString().slice(-4)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎾</div>
                  <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>No hay partidos recientes</h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    Participa en torneos para ver tus partidos aquí
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pestaña: LOGROS */}
          {activeTab === 'achievements' && (
            <div>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '16px',
                fontSize: '18px'
              }}>
                Todos los Logros
              </h3>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px',
                padding: '12px',
                background: 'var(--card-bg)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
                    Progreso General
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {unlockedAchievements.length} de {achievements.length} logros desbloqueados
                  </div>
                </div>
                <div style={{ 
                  background: 'var(--primary)', 
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {achievements.map(achievement => (
                  <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? '' : 'locked'}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '24px' }}>{achievement.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
                          {achievement.name}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                          {achievement.description}
                        </div>
                      </div>
                      <div style={{ 
                        background: achievement.unlocked ? 'var(--secondary)' : 'var(--border-color)',
                        color: achievement.unlocked ? 'white' : 'var(--text-muted)',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        minWidth: '60px',
                        textAlign: 'center'
                      }}>
                        {achievement.unlocked ? '✅' : `${achievement.progress}%`}
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      color: 'var(--text-muted)', 
                      fontSize: '10px', 
                      marginTop: '4px' 
                    }}>
                      <span>{achievement.requirement}</span>
                      <span>{achievement.unlocked ? 'Completado' : 'En progreso'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pestaña: AJUSTES */}
          {activeTab === 'settings' && (
            <div>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '20px',
                fontSize: '18px'
              }}>
                Configuración
              </h3>

              <div className="settings-section">
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '16px' }}>
                  Apariencia
                </h4>
                <button
                  onClick={toggleTheme}
                  className="settings-button"
                >
                  <span>🌙 Tema Actual: {theme === 'light' ? 'Claro' : 'Oscuro'}</span>
                  <span>🔄 Cambiar</span>
                </button>
              </div>

              <div className="settings-section">
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '16px' }}>
                  Seguridad
                </h4>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="settings-button"
                >
                  <span>🔒 Cambiar Contraseña</span>
                  <span>→</span>
                </button>
              </div>

              <div className="settings-section">
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '16px' }}>
                  Cuenta
                </h4>
                <button
                  onClick={handleLogout}
                  className="settings-button danger"
                >
                  <span>🚪 Cerrar Sesión</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para cambiar contraseña */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ 
            padding: '24px', 
            maxWidth: '400px', 
            width: '100%'
          }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
              🔒 Cambiar Contraseña
            </h3>
            
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  🔑 Cambiar Contraseña
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    padding: '12px 20px',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// Componente para proteger rutas
// Componente para proteger rutas CON NUEVA NAVEGACIÓN
// Componente para proteger rutas ACTUALIZADO

// Componente para proteger rutas - VERSIÓN SIN ESPACIOS EXTRA
function ProtectedRoute({ children }) {
  const { state } = useApp();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navigation />
      <div style={{ 
        flex: 1,
        paddingTop: '0px', // ELIMINADO padding extra
        paddingBottom: '100px', // Solo espacio para barra inferior
        overflow: 'auto'
      }}>
        {children}
      </div>
    </div>
  );
}


// Componente principal App - 
function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <ToastProvider> 
          <Router>
            <div className="app-container">
              <style>{themeStyles}</style>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/clubs" element={<ProtectedRoute><ClubManagement /></ProtectedRoute>} />
                <Route path="/tournaments" element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
                <Route path="/tournament/:id" element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/tournament/:id/play" element={<ProtectedRoute><TournamentPlay /></ProtectedRoute>} />
              </Routes>
            </div>
          </Router>
        </ToastProvider> 
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;

// Registrar Service Worker para PWA
serviceWorker.register({
  onSuccess: () => console.log('✅ PWA: App disponible offline'),
  onUpdate: (registration) => {
    console.log('🔄 PWA: Nueva versión disponible');
    if (window.confirm('Hay una nueva versión disponible. ¿Quieres actualizar?')) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
});