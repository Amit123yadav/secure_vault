import { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, KeyRound } from 'lucide-react';
import { useVault } from '../context/VaultContext';

export default function LockScreen() {
  const { isNewVault, createVault, unlockVault, error, loading, clearError } =
    useVault();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!password.trim()) {
      setLocalError('Enter a master password.');
      return;
    }

    if (isNewVault) {
      if (password.length < 8) {
        setLocalError('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirm) {
        setLocalError('Passwords do not match.');
        return;
      }
      await createVault(password);
    } else {
      await unlockVault(password);
    }
  };

  const displayError = localError || error;

  return (
    <div className="lock-screen">
      <div className="lock-card">
        <div className="lock-logo">
          <div className="logo-icon">
            <Shield size={28} strokeWidth={1.5} />
          </div>
          <h1 className="logo-text">SecureVault</h1>
        </div>

        <p className="lock-subtitle">
          {isNewVault
            ? 'Create a master password to initialise your vault.'
            : 'Enter your master password to access your vault.'}
        </p>

        <form onSubmit={handleSubmit} className="lock-form">
          <div className="field-group">
            <label className="field-label">Master Password</label>
            <div className="password-input-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                className="field-input"
                placeholder={isNewVault ? 'Choose a strong password' : 'Enter your master password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                autoComplete={isNewVault ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {isNewVault && (
            <div className="field-group">
              <label className="field-label">Confirm Password</label>
              <div className="password-input-wrap">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="field-input"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {displayError && (
            <div className="error-banner" role="alert">
              {displayError}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="btn-spinner" />
            ) : isNewVault ? (
              <>
                <KeyRound size={16} />
                Create Vault
              </>
            ) : (
              <>
                <Lock size={16} />
                Unlock Vault
              </>
            )}
          </button>
        </form>

        <p className="lock-hint">
          {isNewVault
            ? 'Your password is never stored — lose it and the vault cannot be recovered.'
            : 'The vault auto-locks on every page refresh.'}
        </p>
      </div>
    </div>
  );
}
