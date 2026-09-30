#!/bin/bash

set -e

echo "======================================"
echo " Starting RecruitSmart"
echo "======================================"

# ==========================================
# Initialize MySQL if this is a fresh container
# ==========================================
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing MySQL database..."
    mysqld --initialize-insecure --user=mysql
fi

# ==========================================
# Start MySQL
# ==========================================
echo "Starting MySQL..."

mysqld \
    --user=mysql \
    --bind-address=127.0.0.1 \
    --skip-name-resolve &

# ==========================================
# Wait for MySQL
# ==========================================
echo "Waiting for MySQL..."

until mysqladmin ping -h127.0.0.1 --silent; do
    sleep 2
done

echo "MySQL is ready."

# ==========================================
# Create database
# ==========================================
mysql -u root -e \
"CREATE DATABASE IF NOT EXISTS intelligent_recruitment;"

# ==========================================
# Allow Node.js to connect using 127.0.0.1
# ==========================================
mysql -u root -e \
"CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '';"

mysql -u root -e \
"GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;"

mysql -u root -e \
"FLUSH PRIVILEGES;"

# ==========================================
# Check whether tables already exist
# ==========================================
TABLE_COUNT=$(mysql -u root -N -e \
"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='intelligent_recruitment';")

# ==========================================
# Import SQL dump if database is empty
# ==========================================
if [ "$TABLE_COUNT" -eq 0 ]; then

    echo "Importing intelligent_recruitment.sql..."

    mysql -u root < /app/database/intelligent_recruitment.sql

    echo "Database imported successfully."

else

    echo "Database already contains tables."
    echo "Skipping SQL import."

fi

# ==========================================
# Ensure Node.js MySQL user exists AFTER import
# ==========================================
echo "Configuring MySQL access for Node.js..."

mysql -u root -e \
"CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '';"

mysql -u root -e \
"ALTER USER 'root'@'127.0.0.1' IDENTIFIED BY '';"

mysql -u root -e \
"GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;"

mysql -u root -e \
"FLUSH PRIVILEGES;"

echo "MySQL access configured."

# ==========================================
# Backend environment variables
# ==========================================
export DB_HOST=127.0.0.1
export DB_USER=root
export DB_PASSWORD=
export DB_NAME=intelligent_recruitment
export PORT=5000

# ==========================================
# Start Node.js backend
# ==========================================
echo "Starting Node.js backend..."

cd /app/backend

node server.js &

# ==========================================
# Wait for backend
# ==========================================
sleep 3

echo "Node.js backend started."

# ==========================================
# Start Nginx
# ==========================================
echo "Starting Nginx..."

nginx -g "daemon off;"