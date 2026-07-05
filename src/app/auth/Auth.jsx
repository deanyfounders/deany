// DEMO AUTH - accepts any credentials by design.
// Replace with real auth (e.g. Supabase/Firebase/Clerk) before public launch.
//
// No backend, no real security. Credentials are never sent anywhere and the
// password value is never logged. This exists so the flow feels complete for
// testing and the Hub71 demo.
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { DeanyMark, PillButton, TOKENS } from '../shared/AppScreen.jsx';

const serif = 'Georgia, serif';
const MAX = 100;

export default function Auth({ appState }) {
  const { signIn, resetAll } = appState;
  const [mode, setMode] = useState('signup'); // visual toggle only - both do the same thing
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (username.trim().length < 1) next.username = 'Enter a username';
    if (password.length < 1) next.password = 'Enter a password';
    setErrors(next);
    if (Object.keys(next).length) return;
    // Store username only. No network call, no logging of the password value.
    signIn(username.trim().slice(0, MAX));
  };

  const field = (invalid) => ({
    width: '100%', boxSizing: 'border-box', padding: '13px 14px', fontSize: 16,
    border: `1px solid ${invalid ? '#C53030' : TOKENS.border}`, borderRadius: 12,
    background: '#fff', color: TOKENS.navy, outline: 'none',
  });

  return (
    <div style={{
      minHeight: '100vh', background: TOKENS.canvas, color: TOKENS.navy,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Source Sans 3", system-ui, sans-serif',
      padding: 'calc(env(safe-area-inset-top) + 28px) 24px calc(env(safe-area-inset-bottom) + 28px)',
    }}>
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><DeanyMark size={52} /></div>
        <h1 style={{ fontFamily: serif, fontSize: 26, fontWeight: 500, color: TOKENS.tealDeep, margin: '18px 0 6px' }}>
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p style={{ fontSize: 14, color: TOKENS.muted, margin: '0 0 22px' }}>
          Save your progress and keep your streak going.
        </p>

        {/* Sign up / Sign in toggle */}
        <div style={{ display: 'flex', background: 'rgba(15,76,92,0.06)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {[['signup', 'Sign up'], ['signin', 'Sign in']].map(([m, label]) => (
            <button key={m} type="button" onClick={() => setMode(m)} style={{
              flex: 1, minHeight: 40, border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 14, fontWeight: 600,
              background: mode === m ? '#fff' : 'transparent',
              color: mode === m ? TOKENS.tealDeep : TOKENS.muted,
              boxShadow: mode === m ? '0 1px 3px rgba(20,43,54,0.12)' : 'none',
              WebkitTapHighlightColor: 'transparent',
            }}>{label}</button>
          ))}
        </div>

        <form onSubmit={submit} style={{ textAlign: 'left' }}>
          <label style={labelStyle}>Username</label>
          <input
            value={username} onChange={e => { setUsername(e.target.value.slice(0, MAX)); if (errors.username) setErrors(p => ({ ...p, username: undefined })); }}
            maxLength={MAX} autoCapitalize="none" autoCorrect="off" autoComplete="username"
            placeholder="Your name" style={field(errors.username)} />
          {errors.username && <div style={errStyle}>{errors.username}</div>}

          <label style={{ ...labelStyle, marginTop: 14 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password} onChange={e => { setPassword(e.target.value.slice(0, MAX)); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
              maxLength={MAX} autoComplete="current-password"
              placeholder="Your password" style={{ ...field(errors.password), paddingRight: 46 }} />
            <button type="button" onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 38, height: 38,
                display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none',
                cursor: 'pointer', color: TOKENS.muted, WebkitTapHighlightColor: 'transparent' }}>
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          {errors.password && <div style={errStyle}>{errors.password}</div>}

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
            <PillButton onClick={submit}>{mode === 'signup' ? 'Create account' : 'Sign in'}</PillButton>
          </div>
        </form>

        <p style={{ fontSize: 11.5, color: TOKENS.muted, opacity: 0.7, marginTop: 18, lineHeight: 1.5 }}>
          Demo sign in - any username and password works. Nothing is sent anywhere.
        </p>
        <button type="button" onClick={resetAll} style={{
          marginTop: 14, background: 'none', border: 'none', color: TOKENS.muted, fontSize: 12.5,
          textDecoration: 'underline', cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        }}>
          Start over from the intro
        </button>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: TOKENS.muted, marginBottom: 6, letterSpacing: '0.3px' };
const errStyle = { fontSize: 12.5, color: '#C53030', marginTop: 6 };
