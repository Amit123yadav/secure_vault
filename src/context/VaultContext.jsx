import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import {
  deriveKey,
  encryptData,
  decryptData,
  generateSalt,
  encode,
  decode,
} from '../utils/crypto';
import {
  getSalt,
  setSalt,
  getEncryptedVault,
  setEncryptedVault,
  getVerifyToken,
  setVerifyToken,
  clearVault,
  vaultExists,
} from '../utils/storage';

const VaultContext = createContext(null);

export function VaultProvider({ children }) {
  const cryptoKeyRef = useRef(null);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [secrets, setSecrets] = useState([]);
  const [isNewVault, setIsNewVault] = useState(!vaultExists());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const persistSecrets = useCallback(async (updatedSecrets) => {
    if (!cryptoKeyRef.current) throw new Error('Vault is locked');
    const ciphertext = await encryptData(cryptoKeyRef.current, updatedSecrets);
    setEncryptedVault(ciphertext);
  }, []);

  const createVault = useCallback(async (masterPassword) => {
    setLoading(true);
    setError(null);
    try {
      const salt = generateSalt();
      setSalt(encode(salt));
      const key = await deriveKey(masterPassword, salt);
      cryptoKeyRef.current = key;

      const verifyToken = await encryptData(key, { verified: true });
      setVerifyToken(verifyToken);

      const initialSecrets = [];
      const ciphertext = await encryptData(key, initialSecrets);
      setEncryptedVault(ciphertext);

      setSecrets(initialSecrets);
      setIsUnlocked(true);
      setIsNewVault(false);
    } catch (e) {
      setError('Failed to create vault. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const unlockVault = useCallback(async (masterPassword) => {
    setLoading(true);
    setError(null);
    try {
      const b64Salt = getSalt();
      if (!b64Salt) throw new Error('No vault found');

      const salt = decode(b64Salt);
      const key = await deriveKey(masterPassword, salt);

      const verifyToken = getVerifyToken();
      if (verifyToken) {
        await decryptData(key, verifyToken); // throws on wrong password
      }

      const encryptedData = getEncryptedVault();
      let decrypted = [];
      if (encryptedData) {
        decrypted = await decryptData(key, encryptedData);
      }

      cryptoKeyRef.current = key;
      setSecrets(decrypted);
      setIsUnlocked(true);
    } catch (e) {
      setError('Wrong master password. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const lockVault = useCallback(() => {
    cryptoKeyRef.current = null;
    setSecrets([]);
    setIsUnlocked(false);
    setError(null);
  }, []);

  const destroyVault = useCallback(() => {
    clearVault();
    cryptoKeyRef.current = null;
    setSecrets([]);
    setIsUnlocked(false);
    setIsNewVault(true);
    setError(null);
  }, []);

  const addSecret = useCallback(
    async (secretData) => {
      const newSecret = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        ...secretData,
      };
      const updated = [...secrets, newSecret];
      await persistSecrets(updated);
      setSecrets(updated);
      return newSecret;
    },
    [secrets, persistSecrets]
  );

  const deleteSecret = useCallback(
    async (id) => {
      const updated = secrets.filter((s) => s.id !== id);
      await persistSecrets(updated);
      setSecrets(updated);
    },
    [secrets, persistSecrets]
  );

  const updateSecret = useCallback(
    async (id, updates) => {
      const updated = secrets.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
      );
      await persistSecrets(updated);
      setSecrets(updated);
    },
    [secrets, persistSecrets]
  );

  useEffect(() => {
    const lockOnMount = () => {
      cryptoKeyRef.current = null;
      setSecrets([]);
      setIsUnlocked(false);
    };

    const handleUnload = () => {
      lockOnMount();
    };

    const handlePageShow = (event) => {
      if (event.persisted) {
        lockOnMount();
      }
    };

    lockOnMount();
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return (
    <VaultContext.Provider
      value={{
        isUnlocked,
        isNewVault,
        secrets,
        error,
        loading,
        createVault,
        unlockVault,
        lockVault,
        destroyVault,
        addSecret,
        deleteSecret,
        updateSecret,
        clearError: () => setError(null),
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used within VaultProvider');
  return ctx;
}
