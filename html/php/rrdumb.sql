-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: rrdb
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `caller_events`
--

DROP TABLE IF EXISTS `caller_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `caller_events` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `caller_id` bigint(16) unsigned zerofill NOT NULL,
  `event_id` bigint(16) unsigned zerofill NOT NULL,
  PRIMARY KEY (`caller_id`,`event_id`),
  KEY `fk_caller_events_event_tickets1_idx` (`event_id`),
  CONSTRAINT `fk_caller_events_callers1` FOREIGN KEY (`caller_id`) REFERENCES `callers` (`caller_id`),
  CONSTRAINT `fk_caller_events_event_tickets1` FOREIGN KEY (`event_id`) REFERENCES `event_tickets` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caller_events`
--

LOCK TABLES `caller_events` WRITE;
/*!40000 ALTER TABLE `caller_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `caller_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `callers`
--

DROP TABLE IF EXISTS `callers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `callers` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `caller_id` bigint(16) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `address` text,
  `phone` bigint(10) NOT NULL,
  PRIMARY KEY (`caller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `callers`
--

LOCK TABLES `callers` WRITE;
/*!40000 ALTER TABLE `callers` DISABLE KEYS */;
/*!40000 ALTER TABLE `callers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `categories` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `category_id` int(3) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `category_label` varchar(45) DEFAULT NULL,
  `details` text,
  `scale_max` int(3) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_tickets`
--

DROP TABLE IF EXISTS `event_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `event_tickets` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `event_id` bigint(16) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `title` text,
  `caller_id` bigint(16) DEFAULT NULL,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_tickets`
--

LOCK TABLES `event_tickets` WRITE;
/*!40000 ALTER TABLE `event_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keyword_ticket`
--

DROP TABLE IF EXISTS `keyword_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `keyword_ticket` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `keyword_id` int(5) unsigned zerofill NOT NULL,
  `update_id` bigint(5) unsigned zerofill NOT NULL,
  PRIMARY KEY (`keyword_id`,`update_id`),
  KEY `fk_keyword_ticket_ticket_updates1_idx` (`update_id`),
  CONSTRAINT `fk_keyword_ticket_keywords1` FOREIGN KEY (`keyword_id`) REFERENCES `keywords` (`keyword_id`),
  CONSTRAINT `fk_keyword_ticket_ticket_updates1` FOREIGN KEY (`update_id`) REFERENCES `ticket_updates` (`update_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keyword_ticket`
--

LOCK TABLES `keyword_ticket` WRITE;
/*!40000 ALTER TABLE `keyword_ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `keyword_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keywords`
--

DROP TABLE IF EXISTS `keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `keywords` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `keyword_id` int(5) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `keyword_label` varchar(45) DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`keyword_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keywords`
--

LOCK TABLES `keywords` WRITE;
/*!40000 ALTER TABLE `keywords` DISABLE KEYS */;
/*!40000 ALTER TABLE `keywords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mission_event_list`
--

DROP TABLE IF EXISTS `mission_event_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `mission_event_list` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `event_id` bigint(16) unsigned zerofill NOT NULL,
  `mission_id` bigint(8) unsigned zerofill NOT NULL,
  PRIMARY KEY (`event_id`,`mission_id`),
  KEY `fk_mission_event_list_missions1_idx` (`mission_id`),
  CONSTRAINT `fk_mission_event_list_event_tickets1` FOREIGN KEY (`event_id`) REFERENCES `event_tickets` (`event_id`),
  CONSTRAINT `fk_mission_event_list_missions1` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`mission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mission_event_list`
--

LOCK TABLES `mission_event_list` WRITE;
/*!40000 ALTER TABLE `mission_event_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `mission_event_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mission_status`
--

DROP TABLE IF EXISTS `mission_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `mission_status` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `status_id` bigint(3) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `status_label` varchar(45) DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mission_status`
--

LOCK TABLES `mission_status` WRITE;
/*!40000 ALTER TABLE `mission_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `mission_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `missions`
--

DROP TABLE IF EXISTS `missions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `missions` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `mission_id` bigint(8) unsigned zerofill NOT NULL,
  `comment` varchar(45) DEFAULT NULL,
  `status_id` bigint(3) NOT NULL,
  `om_user` bigint(8) unsigned zerofill NOT NULL,
  `oc_user` bigint(8) unsigned zerofill NOT NULL,
  PRIMARY KEY (`mission_id`),
  KEY `fk_missions_users1_idx` (`om_user`),
  KEY `fk_missions_users2_idx` (`oc_user`),
  CONSTRAINT `fk_missions_users1` FOREIGN KEY (`om_user`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_missions_users2` FOREIGN KEY (`oc_user`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `missions`
--

LOCK TABLES `missions` WRITE;
/*!40000 ALTER TABLE `missions` DISABLE KEYS */;
/*!40000 ALTER TABLE `missions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `priorities`
--

DROP TABLE IF EXISTS `priorities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `priorities` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `priority_id` int(3) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `priority_label` varchar(45) DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`priority_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `priorities`
--

LOCK TABLES `priorities` WRITE;
/*!40000 ALTER TABLE `priorities` DISABLE KEYS */;
/*!40000 ALTER TABLE `priorities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `priveleges`
--

DROP TABLE IF EXISTS `priveleges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `priveleges` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `priveleges_id` int(3) unsigned zerofill NOT NULL,
  `priveleges_label` varchar(45) DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`priveleges_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `priveleges`
--

LOCK TABLES `priveleges` WRITE;
/*!40000 ALTER TABLE `priveleges` DISABLE KEYS */;
/*!40000 ALTER TABLE `priveleges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responder_skills`
--

DROP TABLE IF EXISTS `responder_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `responder_skills` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `staff_id` bigint(8) unsigned zerofill NOT NULL,
  `skill_id` bigint(5) unsigned zerofill NOT NULL,
  PRIMARY KEY (`skill_id`,`staff_id`),
  KEY `fk_staff_skills_staff1_idx` (`staff_id`),
  CONSTRAINT `fk_staff_skills_skills1` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`),
  CONSTRAINT `fk_staff_skills_staff1` FOREIGN KEY (`staff_id`) REFERENCES `responders` (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responder_skills`
--

LOCK TABLES `responder_skills` WRITE;
/*!40000 ALTER TABLE `responder_skills` DISABLE KEYS */;
/*!40000 ALTER TABLE `responder_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responders`
--

DROP TABLE IF EXISTS `responders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `responders` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `staff_id` bigint(8) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `mission_id` bigint(8) unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`staff_id`),
  KEY `fk_responders_missions1_idx` (`mission_id`),
  CONSTRAINT `fk_responders_missions1` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`mission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responders`
--

LOCK TABLES `responders` WRITE;
/*!40000 ALTER TABLE `responders` DISABLE KEYS */;
/*!40000 ALTER TABLE `responders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `roles` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `role_id` int(1) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `role_label` varchar(45) DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `skills` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `skill_id` bigint(5) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `name` text,
  PRIMARY KEY (`skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `status` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `status_id` int(3) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `status_label` varchar(45) DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_updates`
--

DROP TABLE IF EXISTS `ticket_updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ticket_updates` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `event_id` bigint(16) unsigned zerofill NOT NULL,
  `update_id` bigint(5) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `title` text,
  `body` text,
  `status_id` int(3) unsigned zerofill NOT NULL,
  `priority` int(3) unsigned zerofill NOT NULL,
  `category_id` int(3) unsigned zerofill NOT NULL,
  `address` text,
  `location` text,
  `tickets_id` bigint(16) unsigned zerofill NOT NULL,
  `user_id` bigint(8) unsigned zerofill NOT NULL,
  `longitude` decimal(10,0) DEFAULT NULL,
  `lattitude` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`update_id`),
  KEY `fk_ticket_updates_users1_idx` (`user_id`),
  KEY `fk_ticket_updates_event_tickets1_idx` (`event_id`),
  KEY `fk_ticket_updates_priorities1_idx` (`priority`),
  KEY `fk_ticket_updates_status1_idx` (`status_id`),
  KEY `fk_ticket_updates_categories2` (`category_id`),
  CONSTRAINT `fk_ticket_updates_categories2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `fk_ticket_updates_event_tickets1` FOREIGN KEY (`event_id`) REFERENCES `event_tickets` (`event_id`),
  CONSTRAINT `fk_ticket_updates_priorities1` FOREIGN KEY (`priority`) REFERENCES `priorities` (`priority_id`),
  CONSTRAINT `fk_ticket_updates_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`),
  CONSTRAINT `fk_ticket_updates_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_updates`
--

LOCK TABLES `ticket_updates` WRITE;
/*!40000 ALTER TABLE `ticket_updates` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `user_id` bigint(8) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `first_name` text,
  `last_name` text,
  `role_id` int(1) unsigned zerofill NOT NULL,
  `priveleges_id` int(3) unsigned zerofill NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `fk_users_priveleges1_idx` (`priveleges_id`),
  KEY `fk_users_roles1_idx` (`role_id`),
  CONSTRAINT `fk_users_priveleges1` FOREIGN KEY (`priveleges_id`) REFERENCES `priveleges` (`priveleges_id`),
  CONSTRAINT `fk_users_roles1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
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

-- Dump completed on 2018-10-20 13:00:41
