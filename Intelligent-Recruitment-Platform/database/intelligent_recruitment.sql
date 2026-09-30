CREATE DATABASE  IF NOT EXISTS `intelligent_recruitment` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `intelligent_recruitment`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: intelligent_recruitment
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application_status_history`
--

DROP TABLE IF EXISTS `application_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_status_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `old_status` enum('applied','under_review','shortlisted','interview','selected','rejected','withdrawn') DEFAULT NULL,
  `new_status` enum('applied','under_review','shortlisted','interview','selected','rejected','withdrawn') NOT NULL,
  `changed_by` int NOT NULL,
  `note` text,
  `changed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `fk_status_history_user` (`changed_by`),
  KEY `idx_status_history_application` (`application_id`),
  KEY `idx_status_history_changed_at` (`changed_at`),
  CONSTRAINT `fk_status_history_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_status_history_user` FOREIGN KEY (`changed_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_status_history`
--

LOCK TABLES `application_status_history` WRITE;
/*!40000 ALTER TABLE `application_status_history` DISABLE KEYS */;
INSERT INTO `application_status_history` VALUES (1,1,'applied','under_review',2,'Application is under review.','2026-09-18 16:01:31'),(2,1,'under_review','interview',2,'Interview scheduled','2026-09-18 16:03:03'),(3,1,'interview','interview',2,'Interview scheduled','2026-09-18 16:21:22'),(4,1,'interview','selected',2,'Candidate selected after interview.','2026-09-18 17:08:25'),(5,2,'applied','under_review',2,NULL,'2026-09-19 05:27:48'),(6,3,'applied','under_review',2,NULL,'2026-09-19 06:05:33'),(7,3,'under_review','interview',2,'Interview scheduled','2026-09-19 06:26:41');
/*!40000 ALTER TABLE `application_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `candidate_id` int NOT NULL,
  `cover_letter` text,
  `status` enum('applied','under_review','shortlisted','interview','selected','rejected','withdrawn') DEFAULT 'applied',
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_id`),
  UNIQUE KEY `unique_job_candidate` (`job_id`,`candidate_id`),
  KEY `idx_applications_job` (`job_id`),
  KEY `idx_applications_candidate` (`candidate_id`),
  KEY `idx_applications_status` (`status`),
  KEY `idx_applications_applied_at` (`applied_at`),
  CONSTRAINT `fk_applications_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`candidate_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_applications_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,2,1,'I am interested in this Frontend Developer Intern position and would like to apply.','selected','2026-09-18 15:59:55','2026-09-18 17:08:25'),(2,2,2,NULL,'under_review','2026-09-19 03:35:39','2026-09-19 05:27:48'),(3,4,1,NULL,'interview','2026-09-19 06:02:09','2026-09-19 06:26:41');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_profiles`
--

DROP TABLE IF EXISTS `candidate_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_profiles` (
  `candidate_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `headline` varchar(200) DEFAULT NULL,
  `bio` text,
  `location` varchar(150) DEFAULT NULL,
  `education` varchar(255) DEFAULT NULL,
  `experience_years` decimal(4,1) DEFAULT '0.0',
  `resume_url` varchar(500) DEFAULT NULL,
  `linkedin_url` varchar(500) DEFAULT NULL,
  `github_url` varchar(500) DEFAULT NULL,
  `portfolio_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`candidate_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_candidate_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_profiles`
--

LOCK TABLES `candidate_profiles` WRITE;
/*!40000 ALTER TABLE `candidate_profiles` DISABLE KEYS */;
INSERT INTO `candidate_profiles` VALUES (1,1,'Aspiring Software Engineer','Computer Science student interested in software development and technology.','Hyderabad','B.Tech Computer Science',0.0,NULL,NULL,NULL,NULL,'2026-09-18 15:46:44','2026-09-18 15:50:16'),(2,3,NULL,NULL,NULL,NULL,0.0,NULL,NULL,NULL,NULL,'2026-09-19 03:12:12','2026-09-19 03:12:12');
/*!40000 ALTER TABLE `candidate_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_skills`
--

DROP TABLE IF EXISTS `candidate_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_skills` (
  `candidate_id` int NOT NULL,
  `skill_id` int NOT NULL,
  `proficiency` enum('beginner','intermediate','advanced','expert') DEFAULT 'beginner',
  PRIMARY KEY (`candidate_id`,`skill_id`),
  KEY `fk_candidate_skills_skill` (`skill_id`),
  CONSTRAINT `fk_candidate_skills_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`candidate_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_candidate_skills_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_skills`
--

LOCK TABLES `candidate_skills` WRITE;
/*!40000 ALTER TABLE `candidate_skills` DISABLE KEYS */;
INSERT INTO `candidate_skills` VALUES (1,1,'intermediate'),(1,2,'intermediate'),(1,4,'intermediate');
/*!40000 ALTER TABLE `candidate_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interviews`
--

DROP TABLE IF EXISTS `interviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interviews` (
  `interview_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `interview_type` enum('online','phone','in_person') NOT NULL,
  `scheduled_at` datetime NOT NULL,
  `duration_minutes` int DEFAULT '30',
  `meeting_link` varchar(500) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `interviewer_name` varchar(150) DEFAULT NULL,
  `status` enum('scheduled','completed','cancelled','rescheduled') DEFAULT 'scheduled',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`interview_id`),
  KEY `idx_interviews_application` (`application_id`),
  KEY `idx_interviews_scheduled_at` (`scheduled_at`),
  KEY `idx_interviews_status` (`status`),
  CONSTRAINT `fk_interviews_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interviews`
--

LOCK TABLES `interviews` WRITE;
/*!40000 ALTER TABLE `interviews` DISABLE KEYS */;
INSERT INTO `interviews` VALUES (1,1,'online','2026-09-25 15:00:00',30,'https://meet.example.com/interview1',NULL,'Test Recruiter','completed','Interview completed successfully.','2026-09-18 16:03:03','2026-09-18 16:05:07'),(2,1,'online','2026-10-05 15:00:00',30,'https://meet.example.com/interview2',NULL,'Test Recruiter','scheduled','Second interview scheduled for notification testing.','2026-09-18 16:21:22','2026-09-18 16:21:22'),(3,3,'online','2026-09-24 11:56:00',30,NULL,NULL,NULL,'cancelled',NULL,'2026-09-19 06:26:41','2026-09-29 07:23:17');
/*!40000 ALTER TABLE `interviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_skills`
--

DROP TABLE IF EXISTS `job_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_skills` (
  `job_id` int NOT NULL,
  `skill_id` int NOT NULL,
  `is_required` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`job_id`,`skill_id`),
  KEY `fk_job_skills_skill` (`skill_id`),
  CONSTRAINT `fk_job_skills_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_job_skills_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_skills`
--

LOCK TABLES `job_skills` WRITE;
/*!40000 ALTER TABLE `job_skills` DISABLE KEYS */;
INSERT INTO `job_skills` VALUES (1,1,1),(1,2,1),(1,4,0),(2,1,0),(2,2,1);
/*!40000 ALTER TABLE `job_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `recruiter_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `employment_type` enum('full_time','part_time','internship','contract') NOT NULL,
  `work_mode` enum('onsite','remote','hybrid') NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `salary_min` decimal(12,2) DEFAULT NULL,
  `salary_max` decimal(12,2) DEFAULT NULL,
  `salary_currency` varchar(10) DEFAULT 'INR',
  `experience_min` decimal(4,1) DEFAULT '0.0',
  `experience_max` decimal(4,1) DEFAULT NULL,
  `openings` int DEFAULT '1',
  `status` enum('draft','published','closed') DEFAULT 'draft',
  `application_deadline` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`job_id`),
  KEY `idx_jobs_recruiter` (`recruiter_id`),
  KEY `idx_jobs_status` (`status`),
  KEY `idx_jobs_location` (`location`),
  KEY `idx_jobs_employment_type` (`employment_type`),
  KEY `idx_jobs_work_mode` (`work_mode`),
  KEY `idx_jobs_deadline` (`application_deadline`),
  KEY `idx_jobs_created_at` (`created_at`),
  CONSTRAINT `fk_jobs_recruiter` FOREIGN KEY (`recruiter_id`) REFERENCES `recruiter_profiles` (`recruiter_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,1,'Software Engineer Intern','Work on software development and backend systems.','internship','hybrid','Hyderabad',12000.00,22000.00,'INR',0.0,1.0,2,'published','2026-12-30 00:00:00','2026-09-18 15:54:07','2026-09-18 15:54:07'),(2,1,'Frontend Developer Intern - Final','Work on React and modern web applications.','internship','remote','Hyderabad',12000.00,22000.00,'INR',0.0,1.0,2,'published','2026-12-30 23:59:59','2026-09-18 15:55:50','2026-09-18 17:07:37'),(3,1,'Backend Developer Intern','Work on backend development, REST APIs and database integration.','internship','hybrid','Hyderabad',15000.00,24989.00,'INR',0.0,1.0,2,'published','2026-10-13 14:00:00','2026-09-19 05:36:09','2026-09-19 05:36:09'),(4,1,'Full Stack Developer Intern','Work on frontend, backend and database integration','internship','hybrid','Hyderabad',15000.00,24982.00,'INR',1.0,3.0,1,'published','2026-10-02 12:00:00','2026-09-19 05:58:53','2026-09-19 05:58:53');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `type` enum('application','interview','job','system') NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `idx_notifications_user` (`user_id`),
  KEY `idx_notifications_read` (`is_read`),
  KEY `idx_notifications_created_at` (`created_at`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,2,'New Job Application','A candidate has applied for your job: Frontend Developer Intern','application',1,'2026-09-18 15:59:55'),(2,1,'Application Status Updated','Your application for Frontend Developer Intern is now under review.','application',1,'2026-09-18 16:01:31'),(3,1,'Interview Scheduled','Your interview for Frontend Developer Intern - Updated has been scheduled successfully.','interview',1,'2026-09-18 16:21:22'),(4,1,'Application Status Updated','Your application for Frontend Developer Intern - Final is now selected.','application',1,'2026-09-18 17:08:25'),(5,2,'New Job Application','A candidate has applied for your job: Frontend Developer Intern - Final','application',1,'2026-09-19 03:35:39'),(6,3,'Application Status Updated','Your application for Frontend Developer Intern - Final is now under review.','application',0,'2026-09-19 05:27:48'),(7,2,'New Job Application','A candidate has applied for your job: Full Stack Developer Intern','application',1,'2026-09-19 06:02:09'),(8,1,'Application Status Updated','Your application for Full Stack Developer Intern is now under review.','application',1,'2026-09-19 06:05:33'),(9,1,'Interview Scheduled','Your interview for Full Stack Developer Intern has been scheduled successfully.','interview',1,'2026-09-19 06:26:41');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruiter_profiles`
--

DROP TABLE IF EXISTS `recruiter_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruiter_profiles` (
  `recruiter_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `company_name` varchar(200) NOT NULL,
  `company_description` text,
  `company_website` varchar(500) DEFAULT NULL,
  `company_location` varchar(150) DEFAULT NULL,
  `company_logo` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`recruiter_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_recruiter_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruiter_profiles`
--

LOCK TABLES `recruiter_profiles` WRITE;
/*!40000 ALTER TABLE `recruiter_profiles` DISABLE KEYS */;
INSERT INTO `recruiter_profiles` VALUES (1,2,'Tech Nova','Technology company providing software development solutions.','https://techsolutions.example.com','Hyderabad',NULL,'2026-09-18 15:47:45','2026-09-19 08:22:46');
/*!40000 ALTER TABLE `recruiter_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_jobs`
--

DROP TABLE IF EXISTS `saved_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_jobs` (
  `candidate_id` int NOT NULL,
  `job_id` int NOT NULL,
  `saved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`candidate_id`,`job_id`),
  KEY `fk_saved_jobs_job` (`job_id`),
  CONSTRAINT `fk_saved_jobs_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`candidate_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_jobs_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_jobs`
--

LOCK TABLES `saved_jobs` WRITE;
/*!40000 ALTER TABLE `saved_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `saved_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `skill_id` int NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`skill_id`),
  UNIQUE KEY `skill_name` (`skill_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,'Java','2026-09-18 15:51:07'),(2,'React','2026-09-18 15:51:13'),(3,'Python','2026-09-18 15:51:20'),(4,'SQL','2026-09-18 15:51:32');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('candidate','recruiter') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test Candidate','candidate@test.com','$2b$10$DjD9Ud8fS2GFH3oX2ClhYOOC0cL.P.VlxIjlHwxP75anOJVYGxRh.','candidate','9876543210',NULL,1,'2026-09-18 15:46:44','2026-09-19 04:38:29'),(2,'Test Recruiter','recruiter@test.com','$2b$10$16ASnlQGvR6dMLhB8tfM7uZMLatY.wAmvaP1jR9M7fRhGxPvurcDK','recruiter','9876543211',NULL,1,'2026-09-18 15:47:45','2026-09-18 15:47:45'),(3,'Demo Candidate','demo_candidate@test.com','$2b$10$5vR.K.vNjM1XaolWfd6VYucZPOUMy28lFLNRZE7/ryqtzT9TYvDPG','candidate','9876543212',NULL,1,'2026-09-19 03:12:12','2026-09-19 03:12:12');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-30 22:08:41
