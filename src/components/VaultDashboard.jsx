import { useState, useMemo } from 'react';
import { Plus, Search, Lock, Shield, KeyRound, Trash2, AlertTriangle } from 'lucide-react';import { useVault } from '../context/VaultContext';
import SecretCard from './SecretCard';
import SecretForm from './SecretForm';

export default function VaultDashboard() {
  const { secrets, lockVault, destroyVault, addSecret, deleteSecret } = useVault();

  const [query, setQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDestroyConfirm, setShowDestroyConfirm] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return secrets;
    return secrets.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.username.toLowerCase().includes(q) ||
        (s.notes && s.notes.toLowerCase().includes(q))
    );
  }, [secrets, query]);

  const handleAdd = async (data) => {
    await addSecret(data);
    setShowAddForm(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-brand">
          <Shield size={22} strokeWidth={1.5} className="brand-icon" />
          <span className="brand-name">SecureVault</span>
        </div>
        <div className="header-right">
          <span className="secret-count">
            <KeyRound size={14} />
            {secrets.length} {secrets.length === 1 ? 'secret' : 'secrets'}
          </span>
          <button
            className="btn-ghost btn-sm"
            onClick={() => setShowDestroyConfirm(true)}
            title="Permanently delete this vault"
          >
            <Trash2 size={14} />
            Destroy
          </button>
          <button className="btn-ghost btn-sm" onClick={lockVault} title="Lock the vault">
            <Lock size={14} />
            Lock
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="toolbar">
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="search"
              className="search-input"
              placeholder="Search secrets…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search secrets"
            />
          </div>
          <button className="btn-primary btn-sm" onClick={() => setShowAddForm(true)}>
            <Plus size={16} />
            Add Secret
          </button>
        </div>

        {secrets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Shield size={40} strokeWidth={1} />
            </div>
            <h3 className="empty-title">Your vault is empty</h3>
            <p className="empty-desc">
              Add your first secret to get started. Everything is encrypted with your master
              password before being saved.
            </p>
            <button className="btn-primary" onClick={() => setShowAddForm(true)}>
              <Plus size={16} />
              Add Your First Secret
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-desc">No secrets match "{query}"</p>
          </div>
        ) : (
          <div className="secrets-list">
            {filtered.map((s) => (
              <SecretCard
                key={s.id}
                secret={s}
                onDelete={deleteSecret}
              />
            ))}
          </div>
        )}
      </main>

      {showAddForm && (
        <SecretForm
          title="Add Secret"
          onSave={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {showDestroyConfirm && (
        <div className="modal-overlay">
          <div className="modal-card modal-card-sm">
            <div className="modal-header">
              <div className="destroy-header">
                <AlertTriangle size={20} className="destroy-icon" />
                <h2 className="modal-title">Destroy Vault?</h2>
              </div>
            </div>
            <div className="destroy-body">
              <p className="destroy-desc">
                This will permanently delete all secrets and vault data from this device.
                <strong> This cannot be undone.</strong>
              </p>
              <div className="form-actions">
                <button
                  className="btn-ghost"
                  onClick={() => setShowDestroyConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-danger"
                  onClick={() => {
                    destroyVault();
                    setShowDestroyConfirm(false);
                  }}
                >
                  <Trash2 size={15} />
                  Yes, Destroy Everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
