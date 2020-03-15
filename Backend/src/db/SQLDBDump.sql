
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



DROP TABLE IF EXISTS `student_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `student_users` (
  `studentID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(60) NOT NULL,
  `collegeName` char(100) NOT NULL,
  PRIMARY KEY(`studentID`),
  UNIQUE(`email`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_users`
--

LOCK TABLES `student_users` WRITE;
/*!40000 ALTER TABLE `student_users` DISABLE KEYS */;
INSERT INTO `student_users` VALUES (1, 'prat','prat@gmail.com','$2a$10$t5D0WvN0pZ7d/xEQ99vmJODBjrRrT5eNeuGuUrl4GlM31ST1KFs5W','SJSU');
/*!40000 ALTER TABLE `student_users` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `company_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
SET character_set_client = utf8mb4 ;
CREATE TABLE `company_users` (
  `companyID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(60) NOT NULL,
  `location` char(100) NOT NULL,
  PRIMARY KEY(`companyID`),
  UNIQUE (`email`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_users`
--

LOCK TABLES `company_users` WRITE;
/*!40000 ALTER TABLE `company_users` DISABLE KEYS */;
INSERT INTO `company_users` VALUES (1, 'nokia','nokia@gmail.com','$2a$10$t5D0WvN0pZ7d/xEQ99vmJODBjrRrT5eNeuGuUrl4GlM31ST1KFs5W','USA');
/*!40000 ALTER TABLE `company_users` ENABLE KEYS */;
UNLOCK TABLES;



--
-- Table structure for table `student_profiles`
--

DROP TABLE IF EXISTS `student_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `student_profiles` (
  `studentID` int(11) NOT NULL,
  `careerObj` varchar(255) DEFAULT NULL,
  `dob` date NOT NULL,
  `city` char(50) DEFAULT NULL,
  `state` char(20) DEFAULT NULL,
  `country` char(50) DEFAULT NULL,
  `profilePic` varchar(45) DEFAULT NULL,
  FOREIGN KEY(`studentID`) REFERENCES student_users(`studentID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_profiles`
--

LOCK TABLES `student_profiles` WRITE;
/*!40000 ALTER TABLE `student_profiles` DISABLE KEYS */;
INSERT INTO `student_profiles` VALUES (1, 'Hi all. ','08-09-1992','Sunnyvale','California','USA','');
/*!40000 ALTER TABLE `student_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_profile`
--

DROP TABLE IF EXISTS `student_education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `student_education` (
  `studentID` int(11) NOT NULL,
  `college` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `degree` char(255) DEFAULT NULL,
  `major` char(20) DEFAULT NULL,
  `yop` int(5) DEFAULT NULL,
  `cgpa` float(4) DEFAULT NULL,
  FOREIGN KEY(`studentID`) REFERENCES student_users(`studentID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_education`
--

LOCK TABLES `student_education` WRITE;
/*!40000 ALTER TABLE `student_education` DISABLE KEYS */;
INSERT INTO `student_education` VALUES (1, 'SJSU','Sunnyvale','MS', 'SE', 2020, 3);
/*!40000 ALTER TABLE `student_education` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `student_experience`
--

DROP TABLE IF EXISTS `student_experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `student_experience` (
  `studentID` int(11) NOT NULL,
  `company` varchar(25) NOT NULL,
  `title` varchar(25) NOT NULL,
  `location` varchar(100) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  FOREIGN KEY(`studentID`) REFERENCES student_users(`studentID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_experience`
--

LOCK TABLES `student_experience` WRITE;
/*!40000 ALTER TABLE `student_experience` DISABLE KEYS */;
INSERT INTO `student_experience` VALUES (1, 'Nokia','R & D Engineer','Sunnyvale','08-08-2014','07-06-2017','');
/*!40000 ALTER TABLE `student_experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_skills`
--

DROP TABLE IF EXISTS `student_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `student_skills` (
  `studentID` int(11) NOT NULL,
  `skillName` varchar(255) DEFAULT NULL,
  FOREIGN KEY(`studentID`) REFERENCES student_users(`studentID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_skills`
--

LOCK TABLES `student_skills` WRITE;
/*!40000 ALTER TABLE `student_skills` DISABLE KEYS */;
INSERT INTO `student_skills` VALUES (1, 'C');
INSERT INTO `student_skills` VALUES (1, 'C++');
/*!40000 ALTER TABLE `student_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_profile`
--

DROP TABLE IF EXISTS `company_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `company_profile` (
  `companyID` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `location` varchar(45) NOT NULL,
  `contactInfo` varchar(100) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `profilePic` varchar(45) DEFAULT NULL,
  FOREIGN KEY(`companyID`) REFERENCES company_users(`companyID`)
);
-- /*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_profile`
--

LOCK TABLES `company_profile` WRITE;
/*!40000 ALTER TABLE `company_profile` DISABLE KEYS */;
INSERT INTO `company_profile` VALUES (1, 'Nokia','Sunnyvale','','We are a company.','');
/*!40000 ALTER TABLE `company_profile` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `events` (
  `companyID` int(11) NOT NULL,
  `eventID` int(11) NOT NULL AUTO_INCREMENT,
  `eventName` varchar(45) NOT NULL,
  `time` TIME NOT NULL,
  `date` DATE NOT NULL,
  `description` varchar(300) NOT NULL,
  `location` VARCHAR(45) NOT NULL,
  `eligibility` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`eventID`),
  FOREIGN KEY(`companyID`) REFERENCES company_users(`companyID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1, 1, 'Nokia Hiring','19:30:10','2020-06-15','Nokia Hiring event for WIFI team','Sunnyvale','');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;



DROP TABLE IF EXISTS `events_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `events_registrations` (
  `studentID` int(11) NOT NULL,
  `eventID` int(11) NOT NULL,
  FOREIGN KEY(`studentID`) REFERENCES student_users(`studentID`),
  FOREIGN KEY(`eventID`) REFERENCES events(`eventID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events_registrations`
--

LOCK TABLES `events_registrations` WRITE;
/*!40000 ALTER TABLE `events_registrations` DISABLE KEYS */;
INSERT INTO `events_registrations` VALUES ('1','1');
/*!40000 ALTER TABLE `events_registrations` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `jobs` (
  `companyID` int(11) NOT NULL,
  `jobID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `category` varchar(45) DEFAULT NULL,
  `description` varchar(300) NOT NULL,
  `location` VARCHAR(45) NOT NULL,
  `contactInfo` varchar(100) DEFAULT NULL,
  PRIMARY KEY(`jobID`),
  FOREIGN KEY(`companyID`) REFERENCES company_users(`companyID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_profile`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1, 1, 'Nokia AP Developer','BS/MS','WE are looking for engineers','Sunnyvale','email:nokia@gmail.com');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;



DROP TABLE IF EXISTS `jobs_applicants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `jobs_applicants` (
  `studentID` int(11) NOT NULL,
  `jobID` int(11) NOT NULL,
  `resumePath` varchar(200) NOT NULL,
  `applicationDate` date NOT NULL,
  `applicationStatus` date NOT NULL,
  `contactInfo` varchar(100) DEFAULT NULL,
  FOREIGN KEY(`studentID`) REFERENCES student_users(`studentID`),
  FOREIGN KEY(`jobID`) REFERENCES jobs(`jobID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_profile`
--

LOCK TABLES `jobs_applicants` WRITE;
/*!40000 ALTER TABLE `jobs_applicants` DISABLE KEYS */;
INSERT INTO `jobs_applicants` VALUES ('1','1','/s/d','2020-06-15','accepted','prat@gmail.com');
/*!40000 ALTER TABLE `jobs_applicants` ENABLE KEYS */;
UNLOCK TABLES;

