const KEYS = {
  SALT: 'secure_vault_salt',
  DATA: 'secure_vault_data',
  VERIFY: 'secure_vault_verify',
};

export function getSalt() {
  return localStorage.getItem(KEYS.SALT);
}

export function setSalt(b64Salt) {
  localStorage.setItem(KEYS.SALT, b64Salt);
}

export function getEncryptedVault() {
  return localStorage.getItem(KEYS.DATA);
}

export function setEncryptedVault(ciphertext) {
  localStorage.setItem(KEYS.DATA, ciphertext);
}

export function getVerifyToken() {
  return localStorage.getItem(KEYS.VERIFY);
}

export function setVerifyToken(ciphertext) {
  localStorage.setItem(KEYS.VERIFY, ciphertext);
}

export function clearVault() {
  localStorage.removeItem(KEYS.DATA);
  localStorage.removeItem(KEYS.SALT);
  localStorage.removeItem(KEYS.VERIFY);
}

export function vaultExists() {
  return !!localStorage.getItem(KEYS.SALT);
}
