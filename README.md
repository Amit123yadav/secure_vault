# SecureVault

A secure password manager built with React and the Browser Web Crypto API. All data is encrypted before being stored in localStorage. No backend or third-party crypto libraries are used.

## Setup

Prerequisites
Node.js 18 or higher
npm

Check your version:

node -v
npm -v

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

## Features

- Create, view and delete secrets
- Store Name, Username, Password, and Notes
- AES-GCM encryption using Web Crypto API
- Master password protection
- Auto-lock on page refresh
- Password generator
- Search secrets
- Clipboard copy with auto-clear
- Destroy vault and remove all data

## Project Structure

```text
src/
├── components/
├── context/
├── hooks/
└── utils/
```

- `crypto.js` – Encryption and decryption logic
- `storage.js` – localStorage operations
- `VaultContext.jsx` – Vault state management
- `useClipboard.js` – Copy and auto-clear functionality

## Security Decisions

- Secrets are encrypted before storage.
- Only encrypted data is stored in localStorage.
- Master password is never stored.
- Encryption key exists only in memory while the vault is unlocked.
- Vault automatically locks on refresh.
- PBKDF2 is used to derive the encryption key from the master password.
- AES-GCM provides both encryption and integrity protection.

## Stored Data

The following items are stored in localStorage:

- Vault salt
- Verification token
- Encrypted vault data

No plaintext secrets or passwords are stored.

## Assumptions

- Users are responsible for choosing a strong master password.
- Forgotten master passwords cannot be recovered.
- This is a frontend-only application with no backend services.
