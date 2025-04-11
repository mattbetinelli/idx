import crypto from 'crypto';

// Error response class
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Generate secure random token
const generateToken = (bytes = 20) => {
  return crypto.randomBytes(bytes).toString('hex');
};

// Hash string with SHA-256
const hashString = (string) => {
  return crypto
    .createHash('sha256')
    .update(string)
    .digest('hex');
};

// Encrypt data
const encryptData = (data, secret) => {
  const algorithm = 'aes-256-ctr';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secret, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data)),
    cipher.final()
  ]);
  
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

// Decrypt data
const decryptData = (hash, secret) => {
  const algorithm = 'aes-256-ctr';
  const decipher = crypto.createDecipheriv(
    algorithm,
    secret,
    Buffer.from(hash.iv, 'hex')
  );
  
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final()
  ]);
  
  return JSON.parse(decrypted.toString());
};

// Sanitize object (remove sensitive fields)
const sanitizeObject = (obj, fieldsToRemove = ['password', 'resetPasswordToken', 'resetPasswordExpire']) => {
  const sanitized = { ...obj };
  
  fieldsToRemove.forEach(field => {
    if (sanitized[field]) {
      delete sanitized[field];
    }
  });
  
  return sanitized;
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
};

// Escape HTML to prevent XSS
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export {
  ErrorResponse,
  generateToken,
  hashString,
  encryptData,
  decryptData,
  sanitizeObject,
  isValidEmail,
  escapeHtml
};
