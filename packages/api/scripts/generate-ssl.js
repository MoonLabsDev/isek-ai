const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create ssl directory if it doesn't exist
const sslDir = path.join(__dirname, '../ssl');
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
}

// Generate private key
console.log('Generating private key...');
execSync(
  'openssl genrsa -out ssl/private.key 2048',
  { stdio: 'inherit' }
);

// Generate CSR
console.log('Generating CSR...');
execSync(
  'openssl req -new -key ssl/private.key -out ssl/certificate.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"',
  { stdio: 'inherit' }
);

// Generate self-signed certificate
console.log('Generating self-signed certificate...');
execSync(
  'openssl x509 -req -days 365 -in ssl/certificate.csr -signkey ssl/private.key -out ssl/certificate.crt',
  { stdio: 'inherit' }
);

// Clean up CSR
fs.unlinkSync(path.join(sslDir, 'certificate.csr'));

console.log('SSL certificates generated successfully!');
console.log('Private key: ssl/private.key');
console.log('Certificate: ssl/certificate.crt'); 