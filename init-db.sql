-- Create databases for all services
CREATE DATABASE IF NOT EXISTS lms_main;
CREATE DATABASE IF NOT EXISTS lms_user_db;
CREATE DATABASE IF NOT EXISTS lms_course_db;
CREATE DATABASE IF NOT EXISTS lms_assessment_db;
CREATE DATABASE IF NOT EXISTS lms_notification_db;
CREATE DATABASE IF NOT EXISTS lms_attendance_db;
CREATE DATABASE IF NOT EXISTS lms_leave_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON lms_main.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON lms_user_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON lms_course_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON lms_assessment_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON lms_notification_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON lms_attendance_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON lms_leave_db.* TO 'root'@'%';
FLUSH PRIVILEGES;
