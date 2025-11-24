CREATE DATABASE IF NOT EXISTS user_service;
CREATE DATABASE IF NOT EXISTS talikuat_service;
CREATE DATABASE IF NOT EXISTS pemeliharan_service;
CREATE DATABASE IF NOT EXISTS laporan_service;
CREATE DATABASE IF NOT EXISTS dashboard_service;
-- kalau gateway nggak pakai DB, tidak perlu DB sendiri

-- optional: buat user selain root
-- CREATE USER 'andank'@'%' IDENTIFIED BY 'andankpass';
-- GRANT ALL PRIVILEGES ON user_service.* TO 'andank'@'%';
-- GRANT ALL PRIVILEGES ON paket_service.* TO 'andank'@'%';
-- GRANT ALL PRIVILEGES ON pemeliharan_service.* TO 'andank'@'%';
-- GRANT ALL PRIVILEGES ON laporan_service.* TO 'andank'@'%';
-- FLUSH PRIVILEGES;
