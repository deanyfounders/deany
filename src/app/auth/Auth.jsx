// DEMO AUTH - accepts any credentials by design.
// Replace with real auth (e.g. Supabase/Firebase/Clerk) before public launch.
//
// Phase 6 restyle: the auth LOGIC is unchanged (any username + password, min
// 1 char, cap 100, nothing sent anywhere). Only the presentation moved to the
// onboarding kit, framed as "save your progress" with the plan summary on top.
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import OnboardingShell from '../../onboarding/kit/OnboardingShell.jsx';
import { PrimaryButton } from '../../onboarding/kit/buttons.jsx';
import { T, SUBJECT, SERIF } from '../../onboarding/kit/tokens.js';

const MAX = 100;

export default function Auth({ appState }) {
  const { state, signIn, resetAll } = appState;
  const [mode, setMode] = useState('signup');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const next = {};
    if (username.trim().length < 1) next.username = 'Enter a username';
    if (password.length < 1) next.password = 'Enter a password';
    setErrors(next);
    if (Object.keys(next).length) return;
    signIn(username.trim().slice(0, MAX)); // store username only; nothing sent anywhere
  };

  const field = (invalid) => ({
    width: '100%', boxSizing: 'border-box', padding: '13px 14px', fontSize: 16,
    border: `1px solid ${invalid ? '#C53030' : T.border}`, borderRadius: 12,
    background: T.card, color: T.ink, outline: 'none',
  });

  const cal = state.calibration || {};
  const topics = (state.topics || []).filter(tp => cal[tp]);

  return (
    <OnboardingShell cta={<PrimaryButton onClick={submit}>{mode === 'signup' ? 'Create account' : 'Sign in'}</PrimaryButton>}>
      {/* Plan summary - saving your progress */}
      {topics.length > 0 && (
        <div style={{ background: T.navy, borderRadius: 15, padding: '14px 16px', marginBottom: 20, color: '#fff' }}>
          <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: T.gold, fontWeight: 500, marginBottom: 8 }}>Your plan is ready</div>
          {topics.map(tp => {
            const s = SUBJECT[tp] || {};
            return (
              <div key={tp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                  <span style={{ fontSize: 14 }}>{s.emoji}</span>{s.short || tp}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: s.accent || T.gold }}>{cal[tp].level}</span>
              </div>
            );
          })}
        </div>
      )}

      <h1 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: T.ink, margin: '4px 0 4px' }}>Save your progress</h1>
      <p style={{ fontSize: 13, color: T.inkSecondary, margin: '0 0 20px' }}>Create an account so your plan and streak are always here.</p>

      {/* Sign up / Sign in toggle */}
      <div style={{ display: 'flex', background: 'rgba(15,42,52,0.05)', borderRadius: 12, padding: 4, marginBottom: 18 }}>
        {[['signup', 'Sign up'], ['signin', 'Sign in']].map(([m, label]) => (
          <button key={m} type="button" onClick={() => setMode(m)} style={{
            flex: 1, minHeight: 40, border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 14, fontWeight: 500,
            background: mode === m ? T.card : 'transparent', color: mode === m ? T.ink : T.inkSecondary,
            boxShadow: mode === m ? '0 1px 3px rgba(20,43,54,0.12)' : 'none', WebkitTapHighlightColor: 'transparent',
          }}>{label}</button>
        ))}
      </div>

      <form onSubmit={submit}>
        <label style={labelStyle}>Username</label>
        <input value={username} onChange={e => { setUsername(e.target.value.slice(0, MAX)); if (errors.username) setErrors(p => ({ ...p, username: undefined })); }}
          maxLength={MAX} autoCapitalize="none" autoCorrect="off" autoComplete="username" placeholder="Your name" style={field(errors.username)} />
        {errors.username && <div style={errStyle}>{errors.username}</div>}

        <label style={{ ...labelStyle, marginTop: 14 }}>Password</label>
        <div style={{ position: 'relative' }}>
          <input type={showPassword ? 'text' : 'password'} value={password}
            onChange={e => { setPassword(e.target.value.slice(0, MAX)); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
            maxLength={MAX} autoComplete="current-password" placeholder="Your password" style={{ ...field(errors.password), paddingRight: 46 }} />
          <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: T.inkSecondary }}>
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
        {errors.password && <div style={errStyle}>{errors.password}</div>}
      </form>

      <p style={{ fontSize: 11, color: T.inkHint, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
        Demo sign in. Any username and password works, and nothing is sent anywhere.
      </p>
      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <button type="button" onClick={resetAll} style={{ background: 'none', border: 'none', color: T.inkHint, fontSize: 12.5, textDecoration: 'underline', cursor: 'pointer' }}>
          Start over from the intro
        </button>
      </div>
    </OnboardingShell>
  );
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 500, color: T.inkSecondary, marginBottom: 6 };
const errStyle = { fontSize: 12.5, color: '#C53030', marginTop: 6 };
