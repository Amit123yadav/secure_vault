import { useState } from 'react';
import { Eye, EyeOff, RefreshCw, X, Save } from 'lucide-react';
import { generatePassword } from '../utils/crypto';

const DEFAULTS = {
  name: '',
  username: '',
  password: '',
  notes: '',
};

export default function SecretForm({ initial = DEFAULTS, onSave, onCancel, title = 'Add Secret' }) {
  const [form, setForm] = useState({ ...DEFAULTS, ...initial });
  const [showPw, setShowPw] = useState(false);
  const [genOpts, setGenOpts] = useState({
    length: 20,
    upper: true,
    lower: true,
    digits: true,
    symbols: true,
  });
  const [showGen, setShowGen] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.username.trim()) e.username = 'Username is required.';
    if (!form.password.trim()) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      name: form.name.trim(),
      username: form.username.trim(),
      password: form.password,
      notes: form.notes.trim(),
    });
  };

  const applyGenerated = () => {
    const pw = generatePassword(genOpts.length, genOpts);
    setForm((f) => ({ ...f, password: pw }));
    setShowGen(false);
    setShowPw(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="icon-btn" onClick={onCancel} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="secret-form">
          <div className="field-group">
            <label className="field-label">Name *</label>
            <input
              className={`field-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. GitHub, Google Account"
              value={form.name}
              onChange={set('name')}
              autoFocus
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field-group">
            <label className="field-label">Username / Email *</label>
            <input
              className={`field-input ${errors.username ? 'input-error' : ''}`}
              placeholder="user@example.com"
              value={form.username}
              onChange={set('username')}
              autoComplete="off"
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="field-group">
            <div className="label-row">
              <label className="field-label">Password *</label>
              <button
                type="button"
                className="gen-toggle-btn"
                onClick={() => setShowGen((v) => !v)}
              >
                <RefreshCw size={13} />
                Generate
              </button>
            </div>

            {showGen && (
              <div className="gen-panel">
                <div className="gen-row">
                  <label className="gen-label">Length: {genOpts.length}</label>
                  <input
                    type="range"
                    min={8}
                    max={64}
                    value={genOpts.length}
                    onChange={(e) =>
                      setGenOpts((o) => ({ ...o, length: +e.target.value }))
                    }
                    className="gen-range"
                  />
                </div>
                <div className="gen-checks">
                  {['upper', 'lower', 'digits', 'symbols'].map((opt) => (
                    <label key={opt} className="gen-check">
                      <input
                        type="checkbox"
                        checked={genOpts[opt]}
                        onChange={(e) =>
                          setGenOpts((o) => ({ ...o, [opt]: e.target.checked }))
                        }
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                <button type="button" className="btn-secondary btn-sm" onClick={applyGenerated}>
                  Use Generated Password
                </button>
              </div>
            )}

            <div className="password-input-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                className={`field-input mono ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter or generate a password"
                value={form.password}
                onChange={set('password')}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label="Toggle visibility"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="field-group">
            <label className="field-label">Notes</label>
            <textarea
              className="field-input field-textarea"
              placeholder="Optional notes (URLs, recovery codes, etc.)"
              value={form.notes}
              onChange={set('notes')}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={15} />
              Save Secret
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
