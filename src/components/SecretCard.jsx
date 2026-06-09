import { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

export default function SecretCard({ secret, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { copiedId, copy } = useClipboard(15_000);

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete(secret.id);
    setConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  const initials = secret.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <div className={`secret-card ${expanded ? 'expanded' : ''}`}>
      <div
        className="secret-card-header"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded((v) => !v)}
      >
        <div className="secret-avatar">{initials || '?'}</div>
        <div className="secret-meta">
          <span className="secret-name">{secret.name}</span>
          <span className="secret-user">{secret.username}</span>
        </div>
        <div className="secret-card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="icon-btn"
            title="Copy username"
            aria-label="Copy username"
            onClick={() => copy(secret.username, `${secret.id}-user`)}
          >
            {copiedId === `${secret.id}-user` ? (
              <Check size={15} className="icon-copied" />
            ) : (
              <Copy size={15} />
            )}
          </button>
          <button
            className="icon-btn icon-btn-danger"
            title="Delete secret"
            aria-label="Delete secret"
            onClick={handleDelete}
          >
            <Trash2 size={15} />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label={expanded ? 'Collapse secret' : 'Expand secret'}
            title={expanded ? 'Collapse' : 'Expand'}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="secret-card-body">
          <div className="secret-field">
            <span className="secret-field-label">Username</span>
            <div className="secret-field-value-row">
              <span className="secret-field-value">{secret.username}</span>
              <button
                className="copy-btn"
                onClick={() => copy(secret.username, `${secret.id}-user-exp`)}
              >
                {copiedId === `${secret.id}-user-exp` ? (
                  <><Check size={13} /> Copied</>
                ) : (
                  <><Copy size={13} /> Copy</>
                )}
              </button>
            </div>
          </div>

          <div className="secret-field">
            <span className="secret-field-label">Password</span>
            <div className="secret-field-value-row">
              <span className={`secret-field-value mono ${showPw ? '' : 'pw-masked'}`}>
                {showPw ? secret.password : '••••••••••••'}
              </span>
              <div className="field-btn-group">
                <button
                  className="icon-btn"
                  onClick={() => setShowPw((v) => !v)}
                  title={showPw ? 'Hide' : 'Reveal'}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  className="copy-btn"
                  onClick={() => copy(secret.password, `${secret.id}-pw`)}
                >
                  {copiedId === `${secret.id}-pw` ? (
                    <><Check size={13} /> Copied</>
                  ) : (
                    <><Copy size={13} /> Copy</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {secret.notes && (
            <div className="secret-field">
              <span className="secret-field-label">Notes</span>
              <p className="secret-notes">{secret.notes}</p>
            </div>
          )}

          <span className="secret-timestamp">
            Added {new Date(secret.createdAt).toLocaleDateString()}
            {secret.updatedAt && ` · Edited ${new Date(secret.updatedAt).toLocaleDateString()}`}
          </span>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-card modal-card-sm">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Delete</h3>
            </div>
            <div className="destroy-body">
              <p className="destroy-desc">
                Are you sure you want to delete <strong>{secret.name}</strong>? This action cannot be undone.
              </p>
              <div className="form-actions">
                <button className="btn-ghost" onClick={handleCancelDelete}>
                  Cancel
                </button>
                <button className="btn-danger" onClick={handleConfirmDelete}>
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
