#!/bin/bash

echo "🔐 Generating SSL certificates for HTTPS..."

# Create SSL directory
mkdir -p /etc/nginx/ssl

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=IN/ST=Rajasthan/L=Jodhpur/O=DarkInnovative/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

# Set proper permissions
chmod 600 /etc/nginx/ssl/key.pem
chmod 644 /etc/nginx/ssl/cert.pem

echo "✅ SSL certificates generated successfully!"
echo "Certificate: /etc/nginx/ssl/cert.pem"
echo "Private Key: /etc/nginx/ssl/key.pem"
echo ""
echo "🔧 To use with nginx:"
echo "1. Copy certificates to /etc/nginx/ssl/"
echo "2. Restart nginx: sudo systemctl restart nginx"
echo "3. Test: curl -k https://localhost"
