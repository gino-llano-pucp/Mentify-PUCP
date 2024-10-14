-- MySQL dump 10.13  Distrib 8.4.0, for macos14 (arm64)
--
-- Host: mentoring.cqaz4i5mrupx.us-east-1.rds.amazonaws.com    Database: Mentify
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AsignacionTipoTutoria`
--

DROP TABLE IF EXISTS `AsignacionTipoTutoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AsignacionTipoTutoria` (
  `id_asignacionTipoTutoria` int NOT NULL AUTO_INCREMENT,
  `fid_usuario` int NOT NULL,
  `fid_tipoTutoria` int NOT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_asignacionTipoTutoria`),
  KEY `fid_tutor` (`fid_usuario`),
  KEY `fid_tipoTutoria` (`fid_tipoTutoria`),
  CONSTRAINT `AsignacionTipoTutoria_ibfk_1` FOREIGN KEY (`fid_usuario`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AsignacionTipoTutoria_ibfk_2` FOREIGN KEY (`fid_tipoTutoria`) REFERENCES `TipoTutoria` (`id_tipoTutoria`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AsignacionTipoTutoria`
--

LOCK TABLES `AsignacionTipoTutoria` WRITE;
/*!40000 ALTER TABLE `AsignacionTipoTutoria` DISABLE KEYS */;
INSERT INTO `AsignacionTipoTutoria` VALUES (17,327,12,1,'2024-05-26 17:48:08','2024-05-26 17:48:08'),(18,327,13,1,'2024-05-26 17:48:31','2024-05-26 22:30:50'),(19,327,14,1,'2024-05-26 17:48:31','2024-05-26 22:30:50'),(20,327,10,1,'2024-05-26 17:48:31','2024-05-26 23:45:13'),(22,327,11,1,'2024-05-26 17:48:31','2024-05-26 23:45:13'),(23,327,15,1,'2024-05-26 17:48:31','2024-05-30 18:01:54'),(24,327,39,1,'2024-05-26 17:48:31','2024-05-26 23:45:52'),(28,327,23,1,'2024-05-26 18:56:20','2024-05-26 23:54:27'),(29,191,12,1,'2024-05-26 18:56:20','2024-05-26 18:56:20'),(30,190,12,1,'2024-05-26 18:56:20','2024-05-26 18:56:20'),(31,189,12,1,'2024-05-26 18:56:20','2024-05-26 18:56:20'),(32,188,12,1,'2024-05-26 18:56:20','2024-05-26 18:56:20'),(33,187,12,1,'2024-05-26 18:56:20','2024-05-26 18:56:20'),(34,305,12,1,'2024-05-26 19:38:07','2024-05-26 19:38:07'),(37,316,12,1,'2024-05-26 20:42:25','2024-05-26 20:42:25'),(38,325,12,1,'2024-05-26 21:02:06','2024-05-26 21:02:06'),(39,317,12,1,'2024-05-26 21:07:58','2024-05-26 21:07:58'),(40,308,12,1,'2024-05-26 21:09:24','2024-05-26 21:09:24'),(41,307,12,1,'2024-05-26 21:10:22','2024-05-26 21:10:22'),(42,217,12,1,'2024-05-26 21:10:22','2024-05-26 21:10:22'),(43,164,12,1,'2024-05-26 21:10:22','2024-05-26 21:10:22'),(44,331,12,1,'2024-05-26 21:43:09','2024-05-26 21:43:09'),(45,327,21,1,'2024-05-26 22:38:31','2024-05-26 23:42:25'),(46,327,22,1,'2024-05-26 22:38:31','2024-05-26 23:42:25'),(47,327,31,1,'2024-05-26 22:38:31','2024-05-26 23:42:25'),(48,316,14,1,'2024-05-27 03:52:25','2024-05-27 03:52:25'),(49,325,13,1,'2024-05-27 04:21:22','2024-05-27 04:21:22'),(50,19,13,1,'2024-05-27 04:21:22','2024-05-28 18:12:11'),(51,316,13,1,'2024-05-27 04:21:22','2024-05-27 04:21:22'),(52,308,13,1,'2024-05-27 04:21:22','2024-05-27 04:21:22'),(53,307,13,1,'2024-05-27 04:21:22','2024-05-27 04:21:22'),(54,214,13,1,'2024-05-27 04:21:22','2024-05-27 04:21:22'),(55,213,13,1,'2024-05-27 04:21:22','2024-05-27 04:21:22'),(56,212,13,1,'2024-05-27 04:21:22','2024-05-27 04:21:22'),(57,210,13,1,'2024-05-27 04:21:22','2024-05-27 04:21:22'),(58,339,12,1,'2024-05-27 05:44:15','2024-05-27 05:44:15'),(59,339,15,1,'2024-05-27 16:12:01','2024-05-30 18:01:54'),(60,3,12,1,'2024-05-27 17:36:31','2024-05-27 17:36:31'),(61,339,1,1,'2024-05-28 02:52:48','2024-05-30 19:08:13'),(62,336,1,1,'2024-05-28 02:53:36','2024-05-30 18:01:54'),(63,316,1,1,'2024-05-28 03:01:10','2024-05-30 18:01:54'),(64,325,1,1,'2024-05-28 03:01:19','2024-05-30 18:01:54'),(65,339,16,0,'2024-05-28 03:03:57','2024-05-31 00:44:46'),(66,142,19,0,'2024-05-28 03:06:00','2024-05-31 00:44:46'),(67,217,19,0,'2024-05-28 03:06:11','2024-05-31 00:44:46'),(68,339,19,0,'2024-05-28 03:06:20','2024-05-31 00:44:46'),(69,317,1,1,'2024-05-28 04:10:28','2024-05-30 18:01:54'),(70,338,40,1,'2024-05-28 04:24:24','2024-05-28 04:24:24'),(71,339,40,1,'2024-05-28 04:24:32','2024-05-28 04:24:32'),(72,308,1,1,'2024-05-28 05:22:02','2024-05-30 18:01:54'),(73,203,1,1,'2024-05-29 03:22:02','2024-05-30 18:01:54'),(74,169,1,1,'2024-05-29 03:22:06','2024-05-30 18:01:54'),(75,210,1,1,'2024-05-29 03:22:09','2024-05-30 18:01:54'),(76,132,1,1,'2024-05-29 03:22:14','2024-05-30 18:01:54'),(77,256,1,0,'2024-05-29 04:29:53','2024-05-30 18:43:48'),(78,12,1,1,'2024-05-29 04:30:07','2024-05-30 18:01:54'),(79,10,1,1,'2024-05-29 04:32:58','2024-05-30 18:01:54'),(80,86,12,1,'2024-05-29 06:10:33','2024-05-29 06:10:33'),(81,3,11,1,'2024-05-30 04:27:38','2024-05-30 04:27:38'),(82,3,5,1,'2024-05-30 04:28:37','2024-05-30 04:28:37'),(83,86,11,1,'2024-05-30 04:29:24','2024-05-30 04:29:24'),(84,3,44,0,'2024-05-30 07:16:38','2024-05-31 00:44:46'),(85,62,44,0,'2024-05-30 07:17:29','2024-05-31 00:44:46'),(86,12,44,0,'2024-05-30 07:50:52','2024-05-31 00:44:46'),(87,13,44,0,'2024-05-30 07:53:47','2024-05-31 00:44:46'),(88,10,11,1,'2024-05-30 09:39:56','2024-05-30 09:39:56'),(89,13,43,1,'2024-05-30 17:56:47','2024-05-30 17:56:47'),(90,13,15,0,'2024-05-30 18:38:32','2024-05-30 18:42:17'),(91,13,1,1,'2024-05-30 18:43:55','2024-05-30 18:43:55'),(92,340,1,1,'2024-05-30 20:20:41','2024-05-30 20:20:41'),(93,12,52,1,'2024-05-30 21:15:08','2024-05-30 21:15:08'),(94,10,44,0,'2024-05-30 21:19:30','2024-05-31 00:44:46'),(95,286,44,0,'2024-05-30 21:21:58','2024-05-31 00:44:46'),(96,12,54,1,'2024-05-31 00:37:33','2024-05-31 00:37:33'),(97,10,56,0,'2024-05-31 00:38:53','2024-05-31 01:19:28'),(98,60,56,0,'2024-05-31 00:38:57','2024-05-31 00:44:46'),(99,13,56,0,'2024-05-31 00:39:04','2024-05-31 00:44:46'),(100,293,56,0,'2024-05-31 00:39:07','2024-05-31 00:44:46'),(101,341,54,1,'2024-05-31 01:16:42','2024-05-31 01:16:42');
/*!40000 ALTER TABLE `AsignacionTipoTutoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AsignacionTutorAlumno`
--

DROP TABLE IF EXISTS `AsignacionTutorAlumno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AsignacionTutorAlumno` (
  `id_asignacionTutorAlumno` int NOT NULL AUTO_INCREMENT,
  `fid_alumno` int NOT NULL,
  `fid_tutor` int NOT NULL,
  `fid_tipoTutoria` int NOT NULL,
  `fid_solicitud` int DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_asignacionTutorAlumno`),
  KEY `fid_alumno` (`fid_alumno`),
  KEY `fid_tutor` (`fid_tutor`),
  KEY `fid_tipoTutoria` (`fid_tipoTutoria`),
  KEY `fk_asignacionTutorAlumno_solicitud` (`fid_solicitud`),
  CONSTRAINT `AsignacionTutorAlumno_ibfk_1` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AsignacionTutorAlumno_ibfk_2` FOREIGN KEY (`fid_tutor`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AsignacionTutorAlumno_ibfk_3` FOREIGN KEY (`fid_tipoTutoria`) REFERENCES `TipoTutoria` (`id_tipoTutoria`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AsignacionTutorAlumno_ibfk_4` FOREIGN KEY (`fid_solicitud`) REFERENCES `SolicitudTutorFijo` (`id_solicitud`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_asignacionTutorAlumno_solicitud` FOREIGN KEY (`fid_solicitud`) REFERENCES `SolicitudTutorFijo` (`id_solicitud`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AsignacionTutorAlumno`
--

LOCK TABLES `AsignacionTutorAlumno` WRITE;
/*!40000 ALTER TABLE `AsignacionTutorAlumno` DISABLE KEYS */;
INSERT INTO `AsignacionTutorAlumno` VALUES (1,19,59,13,4,1,'2024-05-23 23:46:14','2024-05-27 20:41:31'),(2,256,59,13,4,1,'2024-05-24 10:24:56','2024-05-24 10:24:56'),(3,256,12,13,5,1,'2024-05-24 10:29:46','2024-05-24 10:29:46'),(11,249,327,12,NULL,1,'2024-05-26 22:41:42','2024-05-27 23:57:54'),(12,253,327,12,NULL,1,'2024-05-26 22:41:42','2024-05-27 23:57:54'),(13,256,10,1,3,0,'2024-05-29 04:43:08','2024-05-30 01:12:06'),(14,13,339,1,NULL,1,'2024-05-30 19:13:48','2024-05-30 20:50:55'),(17,340,339,1,NULL,1,'2024-05-30 20:50:48','2024-05-31 01:19:38'),(18,3,327,12,9,1,'2024-05-30 22:07:48','2024-05-30 22:07:48'),(19,305,327,12,NULL,1,'2024-05-30 23:11:14','2024-05-30 23:11:14'),(20,293,10,56,NULL,1,'2024-05-31 00:43:20','2024-05-31 00:43:20'),(21,13,10,56,NULL,1,'2024-05-31 00:43:22','2024-05-31 00:43:22');
/*!40000 ALTER TABLE `AsignacionTutorAlumno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AuditLog`
--

DROP TABLE IF EXISTS `AuditLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AuditLog` (
  `id_auditLog` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `accion` varchar(255) NOT NULL,
  `nombreTabla` varchar(255) NOT NULL,
  `id_fila` int NOT NULL,
  `fechaAccion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_auditLog`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AuditLog`
--

LOCK TABLES `AuditLog` WRITE;
/*!40000 ALTER TABLE `AuditLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `AuditLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CompromisoCita`
--

DROP TABLE IF EXISTS `CompromisoCita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CompromisoCita` (
  `id_compromiso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `es_activo` tinyint(1) NOT NULL DEFAULT '1',
  `fid_estado_compromiso` int NOT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_compromiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CompromisoCita`
--

LOCK TABLES `CompromisoCita` WRITE;
/*!40000 ALTER TABLE `CompromisoCita` DISABLE KEYS */;
/*!40000 ALTER TABLE `CompromisoCita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Derivacion`
--

DROP TABLE IF EXISTS `Derivacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Derivacion` (
  `id_derivacion` int NOT NULL AUTO_INCREMENT,
  `fid_tutor` int NOT NULL,
  `fid_alumno` int NOT NULL,
  `documento` blob,
  `observaciones` varchar(255) DEFAULT NULL,
  `fid_unidad_academica` int NOT NULL,
  `fecha_derivacion` datetime NOT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `es_activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_derivacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Derivacion`
--

LOCK TABLES `Derivacion` WRITE;
/*!40000 ALTER TABLE `Derivacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `Derivacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Disponibilidad`
--

DROP TABLE IF EXISTS `Disponibilidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Disponibilidad` (
  `id_disponibilidad` int NOT NULL AUTO_INCREMENT,
  `fid_tutor` int NOT NULL,
  `fechaHoraInicio` datetime NOT NULL,
  `fechaHoraFin` datetime NOT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_disponibilidad`),
  KEY `fid_tutor` (`fid_tutor`),
  CONSTRAINT `Disponibilidad_ibfk_1` FOREIGN KEY (`fid_tutor`) REFERENCES `Usuario` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Disponibilidad`
--

LOCK TABLES `Disponibilidad` WRITE;
/*!40000 ALTER TABLE `Disponibilidad` DISABLE KEYS */;
INSERT INTO `Disponibilidad` VALUES (10,3,'2024-05-20 12:00:00','2024-05-20 14:00:00',1,'2024-05-19 16:00:33','2024-05-29 03:53:49'),(11,3,'2024-05-25 13:30:00','2024-05-25 20:30:00',1,'2024-05-19 16:00:33','2024-05-29 03:53:49'),(12,3,'2024-05-23 12:30:00','2024-05-23 14:30:00',1,'2024-05-19 16:00:33','2024-05-29 03:53:49'),(25,3,'2024-05-19 13:30:00','2024-05-19 16:30:00',1,'2024-05-19 22:26:12','2024-05-29 03:53:49'),(26,3,'2024-05-21 11:00:00','2024-05-22 01:00:00',1,'2024-05-20 17:08:29','2024-05-29 03:53:49'),(30,19,'2024-06-02 12:30:00','2024-06-02 16:00:00',1,'2024-05-21 01:27:01','2024-05-30 19:19:46'),(32,19,'2024-05-24 12:30:00','2024-05-24 17:00:00',1,'2024-05-21 01:27:01','2024-05-30 19:19:46'),(34,19,'2024-05-27 12:00:00','2024-05-27 15:00:00',1,'2024-05-21 01:27:01','2024-05-30 19:19:46'),(35,19,'2024-05-29 13:00:00','2024-05-29 15:00:00',1,'2024-05-21 01:27:01','2024-05-30 19:19:46'),(44,12,'2024-06-04 15:30:00','2024-06-04 20:00:00',1,'2024-05-22 23:13:44','2024-05-30 23:28:04'),(50,324,'2024-05-23 13:30:00','2024-05-23 17:00:00',1,'2024-05-23 02:43:35','2024-05-24 07:47:26'),(52,12,'2024-05-22 12:30:00','2024-05-23 00:30:00',1,'2024-05-23 02:50:11','2024-05-30 23:28:04'),(57,12,'2024-05-31 14:00:00','2024-05-31 16:00:00',1,'2024-05-23 07:07:09','2024-05-30 23:28:04'),(58,12,'2024-06-07 14:00:00','2024-06-07 16:00:00',1,'2024-05-23 07:07:09','2024-05-30 23:28:04'),(60,12,'2024-06-24 19:30:00','2024-06-24 21:00:00',1,'2024-05-23 07:13:25','2024-05-30 23:28:04'),(61,19,'2024-05-21 13:30:00','2024-05-21 21:30:00',1,'2024-05-23 23:00:24','2024-05-30 19:19:46'),(65,12,'2024-05-27 17:30:00','2024-05-28 00:30:00',1,'2024-05-24 19:40:32','2024-05-30 23:28:04'),(66,12,'2024-05-25 15:30:00','2024-05-26 00:30:00',1,'2024-05-24 19:40:32','2024-05-30 23:28:04'),(67,12,'2024-05-26 16:00:00','2024-05-27 00:30:00',1,'2024-05-24 19:40:32','2024-05-30 23:28:04'),(68,19,'2024-05-25 14:00:00','2024-05-25 17:30:00',1,'2024-05-24 20:03:34','2024-05-30 19:19:46'),(69,12,'2024-05-23 18:00:00','2024-05-23 20:00:00',1,'2024-05-25 00:09:56','2024-05-30 23:28:04'),(70,12,'2024-05-31 20:00:00','2024-05-31 22:00:00',1,'2024-05-25 00:09:56','2024-05-30 23:28:04'),(71,12,'2024-05-28 18:00:00','2024-05-28 20:00:00',1,'2024-05-25 00:09:56','2024-05-30 23:28:04'),(72,12,'2024-05-21 21:00:00','2024-05-22 00:30:00',1,'2024-05-25 00:17:30','2024-05-30 23:28:04'),(73,12,'2024-05-23 21:00:00','2024-05-24 00:30:00',1,'2024-05-25 00:17:30','2024-05-30 23:28:04'),(74,12,'2024-05-24 21:00:00','2024-05-25 00:30:00',1,'2024-05-25 00:17:30','2024-05-30 23:28:04'),(75,12,'2024-05-28 21:00:00','2024-05-29 00:30:00',1,'2024-05-25 00:17:30','2024-05-30 23:28:04'),(76,12,'2024-05-29 21:00:00','2024-05-30 00:30:00',1,'2024-05-25 00:17:30','2024-05-30 23:28:04'),(77,3,'2024-05-28 13:00:00','2024-05-28 16:00:00',1,'2024-05-27 16:37:11','2024-05-29 03:53:49'),(78,3,'2024-05-30 13:00:00','2024-05-30 19:00:00',1,'2024-05-27 16:37:11','2024-05-29 03:53:49'),(79,3,'2024-06-01 12:30:00','2024-06-01 19:30:00',1,'2024-05-27 16:37:11','2024-05-29 03:53:49'),(80,3,'2024-05-29 13:00:00','2024-05-29 16:00:00',1,'2024-05-27 16:37:11','2024-05-29 03:53:49'),(81,3,'2024-06-02 12:30:00','2024-06-02 19:30:00',1,'2024-05-27 16:39:46','2024-05-29 03:53:49'),(82,3,'2024-05-28 19:30:00','2024-05-28 22:00:00',1,'2024-05-29 03:53:49','2024-05-29 03:53:49'),(83,3,'2024-05-27 19:30:00','2024-05-27 22:00:00',1,'2024-05-29 03:53:49','2024-05-29 03:53:49'),(84,3,'2024-05-29 19:30:00','2024-05-29 22:00:00',1,'2024-05-29 03:53:49','2024-05-29 03:53:49'),(85,12,'2024-06-01 17:30:00','2024-06-01 20:00:00',1,'2024-05-30 20:42:29','2024-05-30 23:28:04'),(86,12,'2024-06-02 21:00:00','2024-06-02 23:30:00',0,'2024-05-30 20:42:29','2024-05-31 00:08:38'),(87,12,'2024-06-03 21:00:00','2024-06-03 23:30:00',0,'2024-05-30 20:42:30','2024-05-30 23:51:29'),(88,12,'2024-06-03 21:00:00','2024-06-03 22:30:00',1,'2024-05-30 23:51:29','2024-05-30 23:51:29'),(89,12,'2024-06-03 23:00:00','2024-06-03 23:30:00',1,'2024-05-30 23:51:29','2024-05-30 23:51:29'),(90,12,'2024-06-02 21:00:00','2024-06-02 22:30:00',1,'2024-05-31 00:08:38','2024-05-31 00:08:38'),(91,12,'2024-06-02 23:00:00','2024-06-02 23:30:00',1,'2024-05-31 00:08:38','2024-05-31 00:08:38');
/*!40000 ALTER TABLE `Disponibilidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EstadoCita`
--

DROP TABLE IF EXISTS `EstadoCita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EstadoCita` (
  `id_estado_cita` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `es_activo` tinyint(1) DEFAULT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_estado_cita`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EstadoCita`
--

LOCK TABLES `EstadoCita` WRITE;
/*!40000 ALTER TABLE `EstadoCita` DISABLE KEYS */;
INSERT INTO `EstadoCita` VALUES (1,'Programado','La cita ha sido programada y está pendiente de realización',1,'2024-05-22 02:12:01','2024-05-22 02:12:02'),(2,'Completado','La cita se ha completado satisfactoriamente',1,'2024-05-22 02:12:01','2024-05-22 02:12:02'),(3,'Cancelado','La cita ha sido cancelada antes de su fecha de realización',1,'2024-05-22 02:12:01','2024-05-22 02:12:02');
/*!40000 ALTER TABLE `EstadoCita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EstadoCompromisoCita`
--

DROP TABLE IF EXISTS `EstadoCompromisoCita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EstadoCompromisoCita` (
  `id_estado_compromiso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `es_activo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_estado_compromiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EstadoCompromisoCita`
--

LOCK TABLES `EstadoCompromisoCita` WRITE;
/*!40000 ALTER TABLE `EstadoCompromisoCita` DISABLE KEYS */;
/*!40000 ALTER TABLE `EstadoCompromisoCita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EstadoSolicitudTutorFijo`
--

DROP TABLE IF EXISTS `EstadoSolicitudTutorFijo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EstadoSolicitudTutorFijo` (
  `id_estadoSolicitud` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_estadoSolicitud`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EstadoSolicitudTutorFijo`
--

LOCK TABLES `EstadoSolicitudTutorFijo` WRITE;
/*!40000 ALTER TABLE `EstadoSolicitudTutorFijo` DISABLE KEYS */;
INSERT INTO `EstadoSolicitudTutorFijo` VALUES (1,'En Espera',NULL,1,'2024-05-22 19:06:45','2024-05-22 19:25:02'),(2,'Aceptado',NULL,1,'2024-05-22 19:08:56','2024-05-22 19:08:56'),(3,'Rechazado',NULL,1,'2024-05-22 19:08:58','2024-05-22 19:08:58');
/*!40000 ALTER TABLE `EstadoSolicitudTutorFijo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Facultad`
--

DROP TABLE IF EXISTS `Facultad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Facultad` (
  `id_facultad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `fid_usuario` int DEFAULT NULL,
  `esActivo` tinyint NOT NULL DEFAULT '1',
  `fechaCreacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `siglas` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_facultad`),
  KEY `fid_usuario` (`fid_usuario`),
  CONSTRAINT `Facultad_ibfk_1` FOREIGN KEY (`fid_usuario`) REFERENCES `Usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Facultad`
--

LOCK TABLES `Facultad` WRITE;
/*!40000 ALTER TABLE `Facultad` DISABLE KEYS */;
INSERT INTO `Facultad` VALUES (1,'Ciencias e Ingeniería',3,1,'2024-05-03 05:31:43','2024-05-26 17:33:33',NULL),(2,'Arte y Diseño Gráfico',324,0,'2024-05-03 05:35:13','2024-05-24 21:47:56',NULL),(7,'Facultad de Gestión y Alta Dirección',19,1,'2024-05-05 21:53:44','2024-05-27 23:37:14',NULL),(12,'Facultad de Ciencias y Artes de la Comunicación',113,1,'2024-05-05 23:23:21','2024-05-30 20:07:37',NULL),(13,'Facultad de Educación',60,0,'2024-05-05 23:23:57','2024-05-25 22:06:46',NULL),(14,'Facultad de Psicología',62,1,'2024-05-05 23:35:02','2024-05-05 23:35:02',NULL),(15,'Facultad de Gastronomía, Hotelería y Turismo',74,1,'2024-05-05 23:38:10','2024-05-05 23:38:10',NULL),(16,'Estudios Generales Letras',327,0,'2024-05-05 23:40:26','2024-05-25 21:59:13',NULL),(17,'Letras y Ciencias Humanas',1,1,'2024-05-06 03:08:25','2024-05-06 03:08:25',NULL),(25,'Facultad de Ciencias Contables',83,1,'2024-05-06 04:11:35','2024-05-08 05:55:55',NULL),(27,'Facultad de Artes Escénicas',84,0,'2024-05-06 04:29:26','2024-05-07 02:28:51',NULL),(32,'Facultad de Arquitectura',102,0,'2024-05-07 19:03:26','2024-05-08 05:57:43',NULL),(38,'EEGGCCCC',111,1,'2024-05-09 02:21:15','2024-05-26 18:41:44',NULL),(39,'Facultad de Filosofía',104,1,'2024-05-09 03:47:15','2024-05-10 20:01:07',NULL),(50,'Facultad de Administración y Negocios',105,1,'2024-05-10 13:16:37','2024-05-10 20:01:08',NULL),(55,'Facultad de Artes Escénicas',112,0,'2024-05-10 13:33:03','2024-05-24 04:42:33',NULL),(56,'Facultad de Humanidades',113,1,'2024-05-10 13:34:18','2024-05-10 20:01:09',NULL),(57,'Facultad de Ciencias Naturales',110,0,'2024-05-10 13:36:00','2024-05-24 03:59:45',NULL),(58,'Facultad de Ciencias Agrícolas',282,1,'2024-05-10 13:40:40','2024-05-25 00:31:51',NULL),(59,'Arquitectura y Urbanismo',114,0,'2024-05-10 14:40:31','2024-05-23 22:06:01',NULL),(60,'Facultad de Ciencias Políticas',211,1,'2024-05-10 20:53:48','2024-05-10 20:53:50',NULL),(61,'Facultad de Química',84,1,'2024-05-10 23:02:24','2024-05-10 23:02:24',NULL),(62,'Facultad de Matematicas',86,1,'2024-05-11 00:11:11','2024-05-11 00:11:12',NULL),(63,'Facultad de Ciencias Sociales',284,1,'2024-05-11 00:12:45','2024-05-11 00:12:49',NULL),(64,'Facultad de Medicina',285,1,'2024-05-11 00:14:33','2024-05-11 00:14:36',NULL),(65,'klucho flores',116,0,'2024-05-11 01:31:09','2024-05-30 06:51:19',NULL),(66,'FACULTAD DE CIENCIAS DE LA COMUNICACIÓN',140,0,'2024-05-13 21:22:38','2024-05-24 04:52:07',NULL),(78,'Facultad Link ',323,1,'2024-05-20 09:54:46','2024-05-20 09:54:50',NULL),(79,'EEGGCC',119,0,'2024-05-20 21:09:14','2024-05-23 22:11:25',NULL),(80,'EEGGLL',120,0,'2024-05-20 21:22:06','2024-05-24 03:51:37',NULL),(81,'Facultad de Gastronomia',121,1,'2024-05-20 21:30:30','2024-05-20 21:30:31',NULL),(83,'EEGGC',130,0,'2024-05-26 18:19:16','2024-05-26 18:24:49',NULL),(84,'EEGGLL',118,0,'2024-05-26 18:30:10','2024-05-26 18:33:13',NULL),(89,'Facultad de Ceramica',337,1,'2024-05-27 04:59:48','2024-05-27 04:59:52',NULL);
/*!40000 ALTER TABLE `Facultad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HistoricoEstudiante`
--

DROP TABLE IF EXISTS `HistoricoEstudiante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HistoricoEstudiante` (
  `id_registro` int NOT NULL AUTO_INCREMENT,
  `fid_alumno` int NOT NULL,
  `nota` blob,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `creadoPor` int DEFAULT NULL,
  `actualizadoPor` int DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_registro`),
  KEY `fid_alumno` (`fid_alumno`),
  CONSTRAINT `HistoricoEstudiante_ibfk_1` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HistoricoEstudiante`
--

LOCK TABLES `HistoricoEstudiante` WRITE;
/*!40000 ALTER TABLE `HistoricoEstudiante` DISABLE KEYS */;
/*!40000 ALTER TABLE `HistoricoEstudiante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OpcionSidebar`
--

DROP TABLE IF EXISTS `OpcionSidebar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OpcionSidebar` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `componentId` varchar(255) DEFAULT NULL,
  `parentId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `OpcionSidebar_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `OpcionSidebar` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OpcionSidebar`
--

LOCK TABLES `OpcionSidebar` WRITE;
/*!40000 ALTER TABLE `OpcionSidebar` DISABLE KEYS */;
INSERT INTO `OpcionSidebar` VALUES (1,'Dashboard','dashboard_icon','dashboardComponent',NULL,'2024-05-01 22:25:29','2024-05-01 22:25:29'),(2,'Facultades y Programas','Building2','facultad',NULL,'2024-05-01 22:41:17','2024-05-08 19:47:09'),(5,'Gestión de Usuarios','Users','',NULL,'2024-05-02 20:06:38','2024-05-28 04:59:52'),(6,'Gestión de Alumnos','','alumnos',5,'2024-05-02 20:06:38','2024-05-28 05:00:10'),(7,'Gestión de Tutores','','tutores',5,'2024-05-02 20:06:38','2024-05-28 05:00:24'),(8,'Unidades Académicas','Building','unidadesAcademicas',NULL,'2024-05-03 18:03:46','2024-05-03 18:08:45'),(9,'Citas','Calendar','citasTutor',NULL,'2024-05-03 19:09:55','2024-05-03 19:11:57'),(10,'Alumnos Asignados','UserCheck','alumnosAsignadosTutor',NULL,'2024-05-03 19:10:59','2024-05-03 19:11:57'),(11,'Tipos de Tutorías','BookOpen','tiposTutorias',NULL,'2024-05-03 19:14:40','2024-05-03 19:21:35'),(12,'Solicitudes de Asignación','Inbox','solicitudesAsignacion',NULL,'2024-05-03 19:17:03','2024-05-03 19:17:03'),(13,'Manejo Académico','Book','',NULL,'2024-05-03 19:19:32','2024-05-28 05:00:41'),(14,'Gestión de Programas','','manejoProgramas',13,'2024-05-03 19:19:33','2024-05-28 05:02:09'),(15,'Gestión de Tutores','','tutores',13,'2024-05-03 19:19:33','2024-05-28 05:00:57'),(17,'Reporte Indicadores','BarChart3','reporteIndicadores',NULL,'2024-05-03 19:20:00','2024-05-28 04:40:19'),(18,'Mis Tutores','UserCheck','misTutores',NULL,'2024-05-03 19:20:24','2024-05-28 05:01:17'),(19,'Encuestas de Satisfacción','Clipboard','encuestasAlumno',NULL,'2024-05-03 19:20:53','2024-05-28 05:01:32'),(20,'Citas','Calendar','citasAlumno',NULL,'2024-05-03 19:24:01','2024-05-03 19:24:01'),(22,'Asignación de Tutor','FilePen','asignacionTutor',NULL,'2024-05-22 21:30:51','2024-05-22 21:30:51');
/*!40000 ALTER TABLE `OpcionSidebar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Programa`
--

DROP TABLE IF EXISTS `Programa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Programa` (
  `id_programa` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `fid_usuario` int DEFAULT NULL,
  `esActivo` tinyint NOT NULL DEFAULT '1',
  `fechaCreacion` datetime DEFAULT NULL,
  `fechaActualizacion` datetime DEFAULT NULL,
  `fid_facultad` int DEFAULT NULL,
  PRIMARY KEY (`id_programa`),
  KEY `fid_usuario` (`fid_usuario`),
  KEY `fid_facultad` (`fid_facultad`),
  CONSTRAINT `Programa_ibfk_1` FOREIGN KEY (`fid_usuario`) REFERENCES `Usuario` (`id_usuario`),
  CONSTRAINT `Programa_ibfk_2` FOREIGN KEY (`fid_facultad`) REFERENCES `Facultad` (`id_facultad`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Programa`
--

LOCK TABLES `Programa` WRITE;
/*!40000 ALTER TABLE `Programa` DISABLE KEYS */;
INSERT INTO `Programa` VALUES (3,'Ingeniería Industrial',3,0,'2024-05-05 00:37:41','2024-05-05 00:40:33',1),(9,'Ingenieráa Electrónica',92,0,'2024-05-06 21:47:40','2024-05-24 04:41:39',1),(14,'Ingeniería de Minas',9,0,'2024-05-06 22:55:05','2024-05-07 19:36:21',1),(16,'Ingeniería Mecanica',93,0,'2024-05-06 23:16:46','2024-05-07 19:30:33',1),(29,'Ingeniería Agronomica',182,1,'2024-05-09 15:26:59','2024-05-09 15:27:00',1),(30,'Ingeniería Naval',183,1,'2024-05-09 15:35:24','2024-05-09 15:35:25',1),(32,'Ingeniería Aeronautica',185,0,'2024-05-09 15:43:47','2024-05-23 21:34:39',1),(37,'Física',186,0,'2024-05-09 15:51:09','2024-05-24 05:08:57',1),(41,'Química',50,0,'2024-05-09 16:03:14','2024-05-25 00:16:26',1),(42,'Ingeniería Geológica',219,1,'2024-05-09 16:06:59','2024-05-09 16:07:00',2),(44,'Ingeniería Mecatrónica',220,0,'2024-05-09 16:44:42','2024-05-23 21:48:48',2),(48,'Ingeniería Aeroespacial',221,0,'2024-05-09 16:53:31','2024-05-24 05:13:44',1),(51,'Matemática Aplicada',122,0,'2024-05-09 17:13:56','2024-05-29 01:22:41',1),(52,'Ciencias de la computación',218,0,'2024-05-09 19:05:41','2024-05-24 04:11:27',1),(53,'Pintura',109,1,'2024-05-09 19:33:42','2024-05-09 19:33:43',2),(54,'Escultura',107,1,'2024-05-09 20:24:19','2024-05-09 20:24:20',2),(56,'Artes Escénicas',232,1,'2024-05-09 20:27:10','2024-05-09 20:27:12',2),(57,'Diseno Gráfico',108,0,'2024-05-09 20:31:19','2024-05-23 21:46:41',2),(59,'Diseño Industrial',233,0,'2024-05-09 20:43:51','2024-05-23 21:56:39',2),(78,'Ingeniería Forestal',7,1,'2024-05-10 22:50:34','2024-05-10 22:50:34',1),(79,'Ingenieria Civil',115,0,'2024-05-10 23:28:37','2024-05-25 00:16:06',1),(80,'Ingeniería Informática',NULL,0,'2024-05-11 01:53:30','2024-05-24 04:42:51',1),(81,'Ingeniería Electrónica',NULL,0,'2024-05-11 01:53:31','2024-05-24 05:13:50',1),(82,'Ingeniería Geológica',NULL,0,'2024-05-11 01:53:34','2024-05-24 04:46:59',1),(83,'Ingeniería Mecatrónica',NULL,0,'2024-05-11 01:53:35','2024-05-24 04:44:40',1),(84,'Diseo Contemporanero',325,0,'2024-05-20 09:48:10','2024-05-26 00:39:16',2),(85,'Ingenieria Textil',117,0,'2024-05-20 20:44:37','2024-05-25 00:18:31',1),(86,'Matematica Fisica',123,0,'2024-05-20 21:23:11','2024-05-24 04:50:07',1),(87,'Ingeniería Biomédica',324,0,'2024-05-23 04:57:22','2024-05-23 22:11:37',1),(88,'Contabilidad y Finanzas',83,1,'2024-05-25 21:22:23','2024-05-25 21:22:24',25),(89,'Estadistica',332,1,'2024-05-26 17:36:42','2024-05-26 17:36:46',1),(91,'Fisica',131,0,'2024-05-26 18:20:02','2024-05-26 18:24:37',1),(92,'Ingenieria de Minas',112,1,'2024-05-26 18:34:00','2024-05-27 23:36:50',1),(93,'Programa Prueba',12,1,'2024-05-29 04:17:41','2024-05-29 04:17:42',7),(94,'Fisicaaa',131,1,'2024-05-29 20:35:13','2024-05-29 20:35:14',1);
/*!40000 ALTER TABLE `Programa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ResultadoCita`
--

DROP TABLE IF EXISTS `ResultadoCita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ResultadoCita` (
  `id_resultado` int NOT NULL AUTO_INCREMENT,
  `Asistencia` tinyint(1) NOT NULL,
  `es_derivado` tinyint(1) NOT NULL,
  `es_activo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_resultado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ResultadoCita`
--

LOCK TABLES `ResultadoCita` WRITE;
/*!40000 ALTER TABLE `ResultadoCita` DISABLE KEYS */;
/*!40000 ALTER TABLE `ResultadoCita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rol`
--

DROP TABLE IF EXISTS `Rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `es_activo` tinyint DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rol`
--

LOCK TABLES `Rol` WRITE;
/*!40000 ALTER TABLE `Rol` DISABLE KEYS */;
INSERT INTO `Rol` VALUES (1,'Coordinador de Facultad',1,'2024-05-01 19:37:14','2024-05-01 19:37:14'),(2,'Coordinador de Programa',1,'2024-05-01 19:37:14','2024-05-01 19:37:14'),(3,'Tutor',1,'2024-05-01 19:37:14','2024-05-01 19:37:14'),(4,'Alumno',1,'2024-05-01 19:37:14','2024-05-01 19:37:14'),(5,'Asistente',1,'2024-05-01 19:37:14','2024-05-01 19:37:14'),(6,'Administrador',1,'2024-05-01 19:37:14','2024-05-01 19:37:14');
/*!40000 ALTER TABLE `Rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RolOpciones`
--

DROP TABLE IF EXISTS `RolOpciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RolOpciones` (
  `id_rol_opcion` int NOT NULL AUTO_INCREMENT,
  `id_opcion` int NOT NULL,
  `id_rol` int NOT NULL,
  `es_activo` tinyint(1) DEFAULT '1',
  `fechaCreacion` datetime DEFAULT NULL,
  `fechaActualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_rol_opcion`),
  KEY `id_opcion` (`id_opcion`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `RolOpciones_ibfk_1` FOREIGN KEY (`id_opcion`) REFERENCES `OpcionSidebar` (`id`),
  CONSTRAINT `RolOpciones_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `Rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RolOpciones`
--

LOCK TABLES `RolOpciones` WRITE;
/*!40000 ALTER TABLE `RolOpciones` DISABLE KEYS */;
INSERT INTO `RolOpciones` VALUES (7,2,6,1,'2024-05-02 20:09:31','2024-05-02 20:09:31'),(10,5,6,1,'2024-05-02 20:12:13','2024-05-02 20:12:13'),(11,6,6,1,'2024-05-02 20:12:13','2024-05-02 20:12:13'),(12,7,6,1,'2024-05-02 20:12:13','2024-05-02 20:12:13'),(13,8,6,1,'2024-05-03 18:06:15','2024-05-03 18:06:15'),(14,9,3,1,'2024-05-03 19:12:27','2024-05-03 19:12:27'),(15,10,3,1,'2024-05-03 19:12:27','2024-05-03 19:12:27'),(16,11,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(17,12,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(18,13,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(19,14,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(20,15,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(22,17,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(23,11,2,1,'2024-05-03 19:23:15','2024-05-03 19:23:15'),(24,12,2,1,'2024-05-03 19:23:15','2024-05-03 19:23:15'),(25,13,2,1,'2024-05-03 19:23:15','2024-05-03 19:23:15'),(26,14,2,1,'2024-05-03 19:23:15','2024-05-03 19:23:15'),(27,15,2,1,'2024-05-03 19:23:15','2024-05-03 19:23:15'),(29,17,2,1,'2024-05-03 19:23:15','2024-05-03 19:23:15'),(30,11,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(31,12,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(32,13,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(33,14,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(34,15,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(36,17,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(37,18,4,1,'2024-05-03 19:24:36','2024-05-03 19:24:36'),(38,19,4,1,'2024-05-03 19:24:36','2024-05-03 19:24:36'),(39,20,4,1,'2024-05-03 19:24:36','2024-05-03 19:24:36'),(40,22,1,1,'2024-05-22 21:34:46','2024-05-22 21:34:46'),(41,22,2,1,'2024-05-22 21:34:52','2024-05-22 21:34:52');
/*!40000 ALTER TABLE `RolOpciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles_Usuario`
--

DROP TABLE IF EXISTS `Roles_Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles_Usuario` (
  `id_roles_usuario` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_rol` int DEFAULT NULL,
  `es_activo` tinyint(1) DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_roles_usuario`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `Roles_Usuario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id_usuario`),
  CONSTRAINT `Roles_Usuario_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `Rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=522 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles_Usuario`
--

LOCK TABLES `Roles_Usuario` WRITE;
/*!40000 ALTER TABLE `Roles_Usuario` DISABLE KEYS */;
INSERT INTO `Roles_Usuario` VALUES (1,1,6,1,'2024-05-01 20:23:32','2024-05-01 20:23:32'),(2,1,1,1,'2024-05-01 20:24:14','2024-05-01 20:24:14'),(4,3,6,1,'2024-05-02 02:34:06','2024-05-02 02:34:06'),(7,8,6,1,'2024-05-02 15:37:37','2024-05-02 15:37:37'),(8,10,2,1,'2024-05-03 12:43:04','2024-05-03 12:43:04'),(10,12,3,1,'2024-05-03 13:11:03','2024-05-03 13:11:03'),(11,13,4,1,'2024-05-03 13:15:22','2024-05-03 13:15:22'),(12,14,5,1,'2024-05-03 13:20:15','2024-05-03 13:20:15'),(13,15,6,1,'2024-05-03 13:21:49','2024-05-03 13:21:49'),(14,3,3,0,'2024-05-03 13:21:49','2024-05-03 13:21:49'),(16,3,3,1,'2024-05-03 18:28:33','2024-05-03 18:28:33'),(17,3,1,0,'2024-05-03 19:35:09','2024-05-26 17:16:31'),(18,3,4,1,'2024-05-03 19:35:54','2024-05-03 19:35:54'),(19,3,2,1,'2024-05-03 19:35:59','2024-05-03 19:35:59'),(20,3,5,1,'2024-05-03 19:36:11','2024-05-03 19:36:11'),(32,19,6,1,'2024-05-04 21:31:32','2024-05-04 21:31:32'),(41,59,3,1,'2024-05-05 14:49:40','2024-05-05 14:49:40'),(42,60,3,1,'2024-05-05 14:49:41','2024-05-05 14:49:41'),(43,61,3,1,'2024-05-05 14:49:42','2024-05-05 14:49:42'),(44,62,3,1,'2024-05-05 14:49:42','2024-05-05 14:49:42'),(46,12,1,0,'2024-05-05 21:41:07','2024-05-27 23:37:14'),(47,61,1,1,'2024-05-05 21:53:43','2024-05-05 21:53:43'),(52,59,1,0,'2024-05-05 23:23:21','2024-05-30 20:07:36'),(53,60,1,1,'2024-05-05 23:23:56','2024-05-05 23:23:56'),(54,62,1,1,'2024-05-05 23:35:02','2024-05-05 23:35:02'),(63,83,1,1,'2024-05-06 04:11:36','2024-05-08 05:55:56'),(64,84,1,0,'2024-05-06 04:29:27','2024-05-07 02:27:08'),(66,86,3,1,'2024-05-06 19:40:40','2024-05-06 19:40:40'),(72,92,2,0,'2024-05-06 21:47:41','2024-05-24 04:41:39'),(74,9,2,0,'2024-05-06 22:55:06','2024-05-07 19:36:21'),(75,93,2,0,'2024-05-06 23:16:46','2024-05-07 19:27:55'),(86,101,1,0,'2024-05-08 05:05:11','2024-05-08 05:55:05'),(87,102,1,1,'2024-05-08 05:57:43','2024-05-08 06:01:58'),(88,103,1,0,'2024-05-08 06:03:08','2024-05-26 17:21:40'),(89,104,3,1,'2024-05-08 21:52:55','2024-05-08 21:52:55'),(90,105,3,1,'2024-05-08 21:52:58','2024-05-08 21:52:58'),(92,107,3,1,'2024-05-08 21:53:04','2024-05-08 21:53:04'),(93,108,3,1,'2024-05-08 21:53:07','2024-05-08 21:53:07'),(94,109,3,1,'2024-05-08 21:53:10','2024-05-08 21:53:10'),(95,110,3,1,'2024-05-08 21:53:13','2024-05-08 21:53:13'),(96,111,3,1,'2024-05-08 21:53:16','2024-05-08 21:53:16'),(97,112,3,1,'2024-05-08 21:53:19','2024-05-08 21:53:19'),(98,113,3,1,'2024-05-08 21:53:22','2024-05-08 21:53:22'),(99,114,3,1,'2024-05-08 21:53:24','2024-05-08 21:53:24'),(100,115,3,1,'2024-05-08 21:53:27','2024-05-08 21:53:27'),(101,116,3,1,'2024-05-08 21:53:29','2024-05-08 21:53:29'),(102,117,3,1,'2024-05-08 21:53:32','2024-05-08 21:53:32'),(103,118,3,1,'2024-05-08 21:53:34','2024-05-08 21:53:34'),(104,119,3,1,'2024-05-08 21:53:37','2024-05-08 21:53:37'),(105,120,3,1,'2024-05-08 21:53:39','2024-05-08 21:53:39'),(106,121,3,1,'2024-05-08 21:53:42','2024-05-08 21:53:42'),(107,122,3,1,'2024-05-08 21:53:45','2024-05-08 21:53:45'),(108,123,3,1,'2024-05-08 21:53:48','2024-05-08 21:53:48'),(109,124,3,1,'2024-05-08 22:13:18','2024-05-08 22:13:18'),(110,125,3,1,'2024-05-08 22:13:21','2024-05-08 22:13:21'),(111,126,3,1,'2024-05-08 22:13:23','2024-05-08 22:13:23'),(112,127,3,1,'2024-05-08 22:13:26','2024-05-08 22:13:26'),(113,128,3,1,'2024-05-08 22:13:28','2024-05-08 22:13:28'),(114,129,3,1,'2024-05-08 22:13:31','2024-05-08 22:13:31'),(115,130,3,1,'2024-05-08 22:13:33','2024-05-08 22:13:33'),(116,131,3,1,'2024-05-08 22:13:36','2024-05-08 22:13:36'),(117,132,3,1,'2024-05-08 22:13:38','2024-05-08 22:13:38'),(118,133,3,1,'2024-05-08 22:13:42','2024-05-08 22:13:42'),(119,134,3,1,'2024-05-08 22:13:44','2024-05-08 22:13:44'),(120,135,3,1,'2024-05-08 22:13:46','2024-05-08 22:13:46'),(121,136,3,1,'2024-05-08 22:13:49','2024-05-08 22:13:49'),(122,137,3,1,'2024-05-08 22:13:52','2024-05-08 22:13:52'),(123,138,3,1,'2024-05-08 22:13:54','2024-05-08 22:13:54'),(124,139,3,1,'2024-05-08 22:13:58','2024-05-08 22:13:58'),(125,140,3,1,'2024-05-08 22:14:00','2024-05-08 22:14:00'),(126,141,3,1,'2024-05-08 22:14:03','2024-05-08 22:14:03'),(127,142,3,1,'2024-05-08 22:14:06','2024-05-08 22:14:06'),(128,143,3,1,'2024-05-08 22:14:08','2024-05-08 22:14:08'),(129,144,3,1,'2024-05-08 22:14:11','2024-05-08 22:14:11'),(130,145,3,1,'2024-05-08 22:14:13','2024-05-08 22:14:13'),(131,146,3,1,'2024-05-08 22:14:16','2024-05-08 22:14:16'),(132,147,3,1,'2024-05-08 22:14:19','2024-05-08 22:14:19'),(133,148,3,1,'2024-05-08 22:14:22','2024-05-08 22:14:22'),(134,149,3,1,'2024-05-08 22:14:25','2024-05-08 22:14:25'),(135,150,3,1,'2024-05-08 22:14:27','2024-05-08 22:14:27'),(136,151,3,1,'2024-05-08 22:14:30','2024-05-08 22:14:30'),(137,152,3,1,'2024-05-08 22:14:35','2024-05-08 22:14:35'),(138,153,3,1,'2024-05-08 22:14:37','2024-05-08 22:14:37'),(139,154,3,1,'2024-05-08 22:14:40','2024-05-08 22:14:40'),(140,155,3,1,'2024-05-08 22:14:43','2024-05-08 22:14:43'),(141,156,3,1,'2024-05-08 22:14:46','2024-05-08 22:14:46'),(142,157,3,1,'2024-05-08 22:14:49','2024-05-08 22:14:49'),(143,158,3,1,'2024-05-08 22:14:52','2024-05-08 22:14:52'),(144,159,3,1,'2024-05-08 22:14:56','2024-05-08 22:14:56'),(145,160,3,1,'2024-05-08 22:14:58','2024-05-08 22:14:58'),(146,161,3,1,'2024-05-08 22:15:01','2024-05-08 22:15:01'),(147,162,3,1,'2024-05-08 22:15:04','2024-05-08 22:15:04'),(148,163,3,1,'2024-05-08 22:15:07','2024-05-08 22:15:07'),(149,164,3,1,'2024-05-08 22:15:10','2024-05-08 22:15:10'),(150,165,3,1,'2024-05-08 22:15:12','2024-05-08 22:15:12'),(151,166,3,1,'2024-05-08 22:15:14','2024-05-08 22:15:14'),(152,167,3,1,'2024-05-08 22:15:18','2024-05-08 22:15:18'),(153,168,3,1,'2024-05-08 22:15:21','2024-05-08 22:15:21'),(154,169,3,1,'2024-05-08 22:15:24','2024-05-08 22:15:24'),(155,170,3,1,'2024-05-08 22:15:26','2024-05-08 22:15:26'),(156,171,3,1,'2024-05-08 22:15:29','2024-05-08 22:15:29'),(157,172,3,1,'2024-05-08 22:15:32','2024-05-08 22:15:32'),(158,173,3,1,'2024-05-08 22:15:34','2024-05-08 22:15:34'),(159,174,3,1,'2024-05-08 22:27:06','2024-05-08 22:27:06'),(160,175,1,0,'2024-05-09 02:21:16','2024-05-24 05:14:45'),(161,176,2,1,'2024-05-09 02:26:23','2024-05-09 02:26:23'),(162,104,1,1,'2024-05-09 03:47:15','2024-05-09 03:47:15'),(164,97,2,1,'2024-05-09 05:03:46','2024-05-09 05:03:46'),(166,178,1,0,'2024-05-09 05:20:36','2024-05-23 21:37:26'),(167,98,2,1,'2024-05-09 05:38:26','2024-05-09 05:38:26'),(169,180,1,1,'2024-05-09 10:46:51','2024-05-09 10:46:51'),(170,181,3,1,'2024-05-09 15:12:20','2024-05-09 15:12:20'),(171,182,2,1,'2024-05-09 15:27:00','2024-05-09 15:27:00'),(172,183,2,1,'2024-05-09 15:35:24','2024-05-09 15:35:24'),(174,185,2,0,'2024-05-09 15:43:48','2024-05-23 21:34:38'),(175,186,2,0,'2024-05-09 15:51:10','2024-05-24 05:08:57'),(176,187,3,1,'2024-05-09 16:01:12','2024-05-09 16:01:12'),(177,188,3,1,'2024-05-09 16:01:15','2024-05-09 16:01:15'),(178,189,3,1,'2024-05-09 16:01:19','2024-05-09 16:01:19'),(179,190,3,1,'2024-05-09 16:01:24','2024-05-09 16:01:24'),(180,191,3,1,'2024-05-09 16:01:29','2024-05-09 16:01:29'),(181,192,3,1,'2024-05-09 16:01:33','2024-05-09 16:01:33'),(182,193,3,1,'2024-05-09 16:01:39','2024-05-09 16:01:39'),(183,194,3,1,'2024-05-09 16:01:47','2024-05-09 16:01:47'),(184,195,3,1,'2024-05-09 16:01:50','2024-05-09 16:01:50'),(185,196,3,1,'2024-05-09 16:01:55','2024-05-09 16:01:55'),(186,197,3,1,'2024-05-09 16:02:00','2024-05-09 16:02:00'),(187,198,3,1,'2024-05-09 16:02:04','2024-05-09 16:02:04'),(188,199,3,1,'2024-05-09 16:02:07','2024-05-09 16:02:07'),(189,200,3,1,'2024-05-09 16:02:11','2024-05-09 16:02:11'),(190,201,3,1,'2024-05-09 16:02:16','2024-05-09 16:02:16'),(191,202,3,1,'2024-05-09 16:02:19','2024-05-09 16:02:19'),(192,203,3,1,'2024-05-09 16:02:22','2024-05-09 16:02:22'),(193,204,3,1,'2024-05-09 16:02:30','2024-05-09 16:02:30'),(194,205,3,1,'2024-05-09 16:02:34','2024-05-09 16:02:34'),(195,206,3,1,'2024-05-09 16:02:39','2024-05-09 16:02:39'),(196,207,3,1,'2024-05-09 16:02:42','2024-05-09 16:02:42'),(197,208,3,1,'2024-05-09 16:02:45','2024-05-09 16:02:45'),(198,209,3,1,'2024-05-09 16:02:48','2024-05-09 16:02:48'),(199,210,3,1,'2024-05-09 16:02:52','2024-05-09 16:02:52'),(200,211,3,1,'2024-05-09 16:02:55','2024-05-09 16:02:55'),(201,212,3,1,'2024-05-09 16:03:00','2024-05-09 16:03:00'),(202,213,3,1,'2024-05-09 16:03:04','2024-05-09 16:03:04'),(203,214,3,1,'2024-05-09 16:03:07','2024-05-09 16:03:07'),(204,215,3,1,'2024-05-09 16:03:10','2024-05-09 16:03:10'),(205,216,3,1,'2024-05-09 16:03:13','2024-05-09 16:03:13'),(206,217,3,1,'2024-05-09 16:03:16','2024-05-09 16:03:16'),(207,50,2,0,'2024-05-09 16:03:15','2024-05-25 00:16:26'),(208,218,3,1,'2024-05-09 16:03:19','2024-05-09 16:03:19'),(209,219,2,1,'2024-05-09 16:07:00','2024-05-09 16:07:00'),(210,220,2,0,'2024-05-09 16:44:42','2024-05-23 21:48:47'),(211,221,2,0,'2024-05-09 16:53:32','2024-05-24 05:13:44'),(214,122,2,0,'2024-05-09 17:13:56','2024-05-29 01:22:41'),(215,218,2,0,'2024-05-09 19:05:41','2024-05-24 04:11:27'),(216,109,2,1,'2024-05-09 19:33:43','2024-05-09 19:33:43'),(217,230,4,1,'2024-05-09 20:09:33','2024-05-09 20:09:33'),(218,231,4,1,'2024-05-09 20:10:45','2024-05-09 20:10:45'),(219,107,2,1,'2024-05-09 20:24:19','2024-05-09 20:24:19'),(220,232,2,1,'2024-05-09 20:27:12','2024-05-09 20:27:12'),(221,108,2,0,'2024-05-09 20:31:19','2024-05-23 21:46:40'),(222,233,2,0,'2024-05-09 20:43:52','2024-05-23 21:56:38'),(223,234,NULL,1,'2024-05-09 22:15:57','2024-05-09 22:15:57'),(227,237,1,1,'2024-05-09 23:52:10','2024-05-09 23:52:10'),(228,237,6,1,'2024-05-10 00:09:10','2024-05-10 00:09:10'),(229,239,NULL,1,'2024-05-10 00:35:42','2024-05-10 00:35:42'),(233,243,4,1,'2024-05-10 01:49:31','2024-05-10 01:49:31'),(234,244,4,1,'2024-05-10 02:23:06','2024-05-10 02:23:06'),(235,245,3,1,'2024-05-10 02:24:39','2024-05-10 02:24:39'),(236,246,4,1,'2024-05-10 02:38:18','2024-05-10 02:38:18'),(237,247,4,1,'2024-05-10 02:48:26','2024-05-10 02:48:26'),(238,248,3,1,'2024-05-10 03:00:06','2024-05-10 03:00:06'),(239,249,4,1,'2024-05-10 03:01:15','2024-05-10 03:01:15'),(241,251,3,1,'2024-05-10 03:10:05','2024-05-10 03:10:05'),(243,253,4,1,'2024-05-10 04:47:19','2024-05-10 04:47:19'),(244,254,3,1,'2024-05-10 04:53:01','2024-05-10 04:53:01'),(245,255,4,1,'2024-05-10 05:13:06','2024-05-10 05:13:06'),(246,256,4,1,'2024-05-10 05:16:15','2024-05-10 05:16:15'),(247,127,4,1,'2024-05-10 05:19:22','2024-05-10 05:19:22'),(249,127,4,1,'2024-05-10 05:20:06','2024-05-10 05:20:06'),(252,127,4,1,'2024-05-10 05:20:27','2024-05-10 05:20:27'),(255,262,4,1,'2024-05-10 05:30:04','2024-05-10 05:30:04'),(256,104,3,1,'2024-05-10 05:31:10','2024-05-10 05:31:10'),(257,105,3,1,'2024-05-10 05:31:10','2024-05-10 05:31:10'),(259,107,3,1,'2024-05-10 05:31:11','2024-05-10 05:31:11'),(260,108,3,1,'2024-05-10 05:31:11','2024-05-10 05:31:11'),(261,109,3,1,'2024-05-10 05:31:11','2024-05-10 05:31:11'),(262,110,3,1,'2024-05-10 05:31:11','2024-05-10 05:31:11'),(263,111,3,1,'2024-05-10 05:31:11','2024-05-10 05:31:11'),(264,112,3,1,'2024-05-10 05:31:12','2024-05-10 05:31:12'),(265,113,3,1,'2024-05-10 05:31:12','2024-05-10 05:31:12'),(266,114,3,1,'2024-05-10 05:31:12','2024-05-10 05:31:12'),(267,115,3,1,'2024-05-10 05:31:12','2024-05-10 05:31:12'),(268,116,3,1,'2024-05-10 05:31:12','2024-05-10 05:31:12'),(269,117,3,1,'2024-05-10 05:31:13','2024-05-10 05:31:13'),(270,118,3,1,'2024-05-10 05:31:13','2024-05-10 05:31:13'),(271,119,3,1,'2024-05-10 05:31:13','2024-05-10 05:31:13'),(272,120,3,1,'2024-05-10 05:31:13','2024-05-10 05:31:13'),(273,121,3,1,'2024-05-10 05:31:13','2024-05-10 05:31:13'),(274,122,3,1,'2024-05-10 05:31:13','2024-05-10 05:31:13'),(275,123,3,1,'2024-05-10 05:31:14','2024-05-10 05:31:14'),(276,127,4,0,'2024-05-10 05:31:32','2024-05-10 05:31:32'),(277,127,4,0,'2024-05-10 05:34:14','2024-05-10 05:34:14'),(278,127,4,1,'2024-05-10 05:35:22','2024-05-10 05:35:22'),(280,20,6,1,'2024-05-10 05:39:42','2024-05-10 05:39:42'),(281,104,3,1,'2024-05-10 05:46:13','2024-05-10 05:46:13'),(282,105,3,1,'2024-05-10 05:46:14','2024-05-10 05:46:14'),(284,107,3,1,'2024-05-10 05:46:14','2024-05-10 05:46:14'),(285,108,3,1,'2024-05-10 05:46:14','2024-05-10 05:46:14'),(286,109,3,1,'2024-05-10 05:46:15','2024-05-10 05:46:15'),(287,110,3,1,'2024-05-10 05:46:15','2024-05-10 05:46:15'),(288,111,3,1,'2024-05-10 05:46:15','2024-05-10 05:46:15'),(289,112,3,1,'2024-05-10 05:46:15','2024-05-10 05:46:15'),(290,113,3,1,'2024-05-10 05:46:15','2024-05-10 05:46:15'),(291,114,3,1,'2024-05-10 05:46:16','2024-05-10 05:46:16'),(292,115,3,1,'2024-05-10 05:46:16','2024-05-10 05:46:16'),(293,116,3,1,'2024-05-10 05:46:16','2024-05-10 05:46:16'),(294,117,3,1,'2024-05-10 05:46:16','2024-05-10 05:46:16'),(295,118,3,1,'2024-05-10 05:46:16','2024-05-10 05:46:16'),(296,119,3,1,'2024-05-10 05:46:17','2024-05-10 05:46:17'),(297,120,3,1,'2024-05-10 05:46:17','2024-05-10 05:46:17'),(298,121,3,1,'2024-05-10 05:46:17','2024-05-10 05:46:17'),(299,122,3,1,'2024-05-10 05:46:17','2024-05-10 05:46:17'),(300,123,3,1,'2024-05-10 05:46:17','2024-05-10 05:46:17'),(301,127,4,1,'2024-05-10 05:46:34','2024-05-10 05:46:34'),(305,127,4,1,'2024-05-10 05:53:48','2024-05-10 05:53:48'),(307,127,4,1,'2024-05-10 05:53:59','2024-05-10 05:53:59'),(309,127,4,1,'2024-05-10 05:56:26','2024-05-10 05:56:26'),(310,267,4,1,'2024-05-10 05:56:29','2024-05-10 05:56:29'),(311,268,4,1,'2024-05-10 05:56:32','2024-05-10 05:56:32'),(312,154,4,1,'2024-05-10 05:56:32','2024-05-10 05:56:32'),(313,218,4,1,'2024-05-10 05:56:33','2024-05-10 05:56:33'),(314,127,4,1,'2024-05-10 05:58:02','2024-05-10 05:58:02'),(315,267,4,1,'2024-05-10 05:58:02','2024-05-10 05:58:02'),(316,268,4,1,'2024-05-10 05:58:02','2024-05-10 05:58:02'),(317,154,4,1,'2024-05-10 05:58:03','2024-05-10 05:58:03'),(318,218,4,1,'2024-05-10 05:58:03','2024-05-10 05:58:03'),(319,127,4,1,'2024-05-10 05:59:37','2024-05-10 05:59:37'),(320,267,4,1,'2024-05-10 05:59:38','2024-05-10 05:59:38'),(321,268,4,1,'2024-05-10 05:59:38','2024-05-10 05:59:38'),(322,154,4,1,'2024-05-10 05:59:39','2024-05-10 05:59:39'),(323,218,4,1,'2024-05-10 05:59:39','2024-05-10 05:59:39'),(324,127,4,1,'2024-05-10 06:00:17','2024-05-10 06:00:17'),(325,267,4,1,'2024-05-10 06:00:18','2024-05-10 06:00:18'),(326,268,4,1,'2024-05-10 06:00:18','2024-05-10 06:00:18'),(327,154,4,1,'2024-05-10 06:00:19','2024-05-10 06:00:19'),(328,218,4,1,'2024-05-10 06:00:19','2024-05-10 06:00:19'),(329,269,4,1,'2024-05-10 06:02:24','2024-05-10 06:02:24'),(330,125,4,1,'2024-05-10 06:02:25','2024-05-10 06:02:25'),(335,133,3,1,'2024-05-10 06:08:03','2024-05-10 06:08:03'),(336,134,3,1,'2024-05-10 06:08:03','2024-05-10 06:08:03'),(337,135,3,1,'2024-05-10 06:08:03','2024-05-10 06:08:03'),(338,136,3,1,'2024-05-10 06:08:04','2024-05-10 06:08:04'),(339,137,3,1,'2024-05-10 06:08:04','2024-05-10 06:08:04'),(340,138,3,1,'2024-05-10 06:08:04','2024-05-10 06:08:04'),(341,139,3,1,'2024-05-10 06:08:04','2024-05-10 06:08:04'),(342,140,3,1,'2024-05-10 06:08:05','2024-05-10 06:08:05'),(343,141,3,1,'2024-05-10 06:08:05','2024-05-10 06:08:05'),(344,142,3,1,'2024-05-10 06:08:05','2024-05-10 06:08:05'),(345,143,3,1,'2024-05-10 06:08:05','2024-05-10 06:08:05'),(346,144,3,1,'2024-05-10 06:08:05','2024-05-10 06:08:05'),(347,145,3,1,'2024-05-10 06:08:06','2024-05-10 06:08:06'),(348,146,3,1,'2024-05-10 06:08:06','2024-05-10 06:08:06'),(349,147,3,1,'2024-05-10 06:08:06','2024-05-10 06:08:06'),(350,148,3,1,'2024-05-10 06:08:06','2024-05-10 06:08:06'),(351,149,3,1,'2024-05-10 06:08:07','2024-05-10 06:08:07'),(352,150,3,1,'2024-05-10 06:08:07','2024-05-10 06:08:07'),(353,151,3,1,'2024-05-10 06:08:07','2024-05-10 06:08:07'),(354,152,3,1,'2024-05-10 06:08:07','2024-05-10 06:08:07'),(355,153,3,1,'2024-05-10 06:08:07','2024-05-10 06:08:07'),(356,154,3,1,'2024-05-10 06:08:08','2024-05-10 06:08:08'),(357,155,3,1,'2024-05-10 06:08:08','2024-05-10 06:08:08'),(358,156,3,1,'2024-05-10 06:08:08','2024-05-10 06:08:08'),(359,157,3,1,'2024-05-10 06:08:08','2024-05-10 06:08:08'),(360,158,3,1,'2024-05-10 06:08:09','2024-05-10 06:08:09'),(361,159,3,1,'2024-05-10 06:08:09','2024-05-10 06:08:09'),(362,160,3,1,'2024-05-10 06:08:09','2024-05-10 06:08:09'),(363,161,3,1,'2024-05-10 06:08:09','2024-05-10 06:08:09'),(364,162,3,1,'2024-05-10 06:08:09','2024-05-10 06:08:09'),(365,163,3,1,'2024-05-10 06:08:10','2024-05-10 06:08:10'),(366,164,3,1,'2024-05-10 06:08:10','2024-05-10 06:08:10'),(367,165,3,1,'2024-05-10 06:08:10','2024-05-10 06:08:10'),(368,166,3,1,'2024-05-10 06:08:10','2024-05-10 06:08:10'),(369,167,3,1,'2024-05-10 06:08:10','2024-05-10 06:08:10'),(370,168,3,1,'2024-05-10 06:08:11','2024-05-10 06:08:11'),(371,169,3,1,'2024-05-10 06:08:11','2024-05-10 06:08:11'),(372,170,3,1,'2024-05-10 06:08:11','2024-05-10 06:08:11'),(373,171,3,1,'2024-05-10 06:08:11','2024-05-10 06:08:11'),(374,172,3,1,'2024-05-10 06:08:12','2024-05-10 06:08:12'),(375,173,3,1,'2024-05-10 06:08:12','2024-05-10 06:08:12'),(376,267,3,1,'2024-05-10 06:09:03','2024-05-10 06:09:03'),(377,268,3,1,'2024-05-10 06:09:04','2024-05-10 06:09:04'),(378,154,3,1,'2024-05-10 06:09:04','2024-05-10 06:09:04'),(379,218,3,1,'2024-05-10 06:09:04','2024-05-10 06:09:04'),(383,129,3,1,'2024-05-10 06:09:05','2024-05-10 06:09:05'),(392,154,3,1,'2024-05-10 06:09:08','2024-05-10 06:09:08'),(394,187,3,1,'2024-05-10 06:09:08','2024-05-10 06:09:08'),(395,105,1,1,'2024-05-10 13:16:38','2024-05-10 13:16:38'),(396,112,1,0,'2024-05-10 13:33:03','2024-05-24 04:42:32'),(397,113,1,1,'2024-05-10 13:34:18','2024-05-30 20:07:38'),(398,110,1,0,'2024-05-10 13:36:00','2024-05-24 03:59:44'),(400,114,1,0,'2024-05-10 14:40:32','2024-05-23 22:06:00'),(401,211,1,1,'2024-05-10 20:53:49','2024-05-10 20:53:49'),(402,283,NULL,1,'2024-05-10 22:13:38','2024-05-10 22:13:38'),(403,7,2,1,'2024-05-10 22:50:34','2024-05-10 22:50:34'),(404,115,2,0,'2024-05-10 23:28:37','2024-05-25 00:16:05'),(405,86,1,1,'2024-05-11 00:11:11','2024-05-11 00:11:11'),(406,284,1,1,'2024-05-11 00:12:49','2024-05-11 00:12:49'),(407,285,1,1,'2024-05-11 00:14:36','2024-05-11 00:14:36'),(408,285,3,1,'2024-05-11 00:14:36','2024-05-11 00:14:36'),(409,116,1,0,'2024-05-11 01:31:09','2024-05-30 06:51:19'),(410,286,4,1,'2024-05-11 01:43:29','2024-05-11 01:43:29'),(411,287,4,1,'2024-05-11 01:53:27','2024-05-11 01:53:27'),(412,288,4,1,'2024-05-11 01:53:28','2024-05-11 01:53:28'),(413,289,4,1,'2024-05-11 01:53:28','2024-05-11 01:53:28'),(414,290,4,1,'2024-05-11 01:53:29','2024-05-11 01:53:29'),(415,291,4,1,'2024-05-11 01:53:29','2024-05-11 01:53:29'),(416,292,4,1,'2024-05-11 01:53:30','2024-05-11 01:53:30'),(417,293,4,1,'2024-05-11 01:53:30','2024-05-11 01:53:30'),(418,294,4,1,'2024-05-11 01:53:31','2024-05-11 01:53:31'),(419,295,4,1,'2024-05-11 01:53:32','2024-05-11 01:53:32'),(420,296,4,1,'2024-05-11 01:53:32','2024-05-11 01:53:32'),(421,297,4,1,'2024-05-11 01:53:33','2024-05-11 01:53:33'),(422,298,4,1,'2024-05-11 01:53:33','2024-05-11 01:53:33'),(423,299,4,1,'2024-05-11 01:53:34','2024-05-11 01:53:34'),(424,300,4,1,'2024-05-11 01:53:34','2024-05-11 01:53:34'),(425,301,4,1,'2024-05-11 01:53:35','2024-05-11 01:53:35'),(426,302,4,1,'2024-05-11 01:53:35','2024-05-11 01:53:35'),(427,303,4,1,'2024-05-11 01:53:36','2024-05-11 01:53:36'),(428,304,4,1,'2024-05-11 01:53:36','2024-05-11 01:53:36'),(429,305,4,1,'2024-05-11 01:54:49','2024-05-11 01:54:49'),(430,306,4,1,'2024-05-11 01:54:50','2024-05-11 01:54:50'),(431,287,4,1,'2024-05-11 01:54:50','2024-05-11 01:54:50'),(432,288,4,1,'2024-05-11 01:54:51','2024-05-11 01:54:51'),(433,289,4,1,'2024-05-11 01:54:51','2024-05-11 01:54:51'),(434,290,4,1,'2024-05-11 01:54:51','2024-05-11 01:54:51'),(435,291,4,1,'2024-05-11 01:54:52','2024-05-11 01:54:52'),(436,292,4,1,'2024-05-11 01:54:52','2024-05-11 01:54:52'),(437,293,4,1,'2024-05-11 01:54:53','2024-05-11 01:54:53'),(438,294,4,1,'2024-05-11 01:54:53','2024-05-11 01:54:53'),(439,295,4,1,'2024-05-11 01:54:53','2024-05-11 01:54:53'),(440,296,4,1,'2024-05-11 01:54:54','2024-05-11 01:54:54'),(441,297,4,1,'2024-05-11 01:54:54','2024-05-11 01:54:54'),(442,298,4,1,'2024-05-11 01:54:55','2024-05-11 01:54:55'),(443,299,4,1,'2024-05-11 01:54:55','2024-05-11 01:54:55'),(444,300,4,1,'2024-05-11 01:54:55','2024-05-11 01:54:55'),(445,301,4,1,'2024-05-11 01:54:56','2024-05-11 01:54:56'),(446,302,4,1,'2024-05-11 01:54:56','2024-05-11 01:54:56'),(447,303,4,1,'2024-05-11 01:54:57','2024-05-11 01:54:57'),(448,304,4,1,'2024-05-11 01:54:57','2024-05-11 01:54:57'),(449,307,3,1,'2024-05-11 01:58:45','2024-05-11 01:58:45'),(450,308,3,1,'2024-05-11 01:58:45','2024-05-11 01:58:45'),(451,19,3,1,'2024-05-11 20:46:36','2024-05-11 20:46:36'),(452,19,1,1,'2024-05-11 23:02:30','2024-05-27 23:37:14'),(453,19,4,1,'2024-05-11 23:02:36','2024-05-11 23:02:36'),(455,19,5,1,'2024-05-11 23:03:00','2024-05-11 23:03:00'),(456,309,4,1,'2024-05-12 03:15:02','2024-05-12 03:15:02'),(457,310,4,1,'2024-05-12 03:20:41','2024-05-12 03:20:41'),(458,140,1,0,'2024-05-13 21:22:39','2024-05-24 04:52:06'),(459,311,3,1,'2024-05-19 02:47:02','2024-05-19 02:47:02'),(460,312,4,1,'2024-05-19 07:19:11','2024-05-19 07:19:11'),(461,313,4,1,'2024-05-19 07:20:15','2024-05-19 07:20:15'),(462,314,4,1,'2024-05-19 07:24:26','2024-05-19 07:24:26'),(463,315,4,1,'2024-05-19 07:26:53','2024-05-19 07:26:53'),(464,316,3,1,'2024-05-19 07:28:46','2024-05-19 07:28:46'),(465,317,3,1,'2024-05-19 07:34:04','2024-05-19 07:34:04'),(466,318,4,1,'2024-05-19 07:34:58','2024-05-19 07:34:58'),(467,319,4,1,'2024-05-19 07:36:52','2024-05-19 07:36:52'),(468,322,4,1,'2024-05-20 04:00:02','2024-05-20 04:00:02'),(469,191,2,0,'2024-05-20 09:48:10','2024-05-25 22:56:17'),(470,323,1,1,'2024-05-20 09:54:50','2024-05-20 09:54:50'),(471,323,3,1,'2024-05-20 09:54:50','2024-05-20 09:54:50'),(472,117,2,0,'2024-05-20 20:44:38','2024-05-25 00:18:31'),(473,119,1,0,'2024-05-20 21:09:15','2024-05-23 22:11:24'),(474,120,1,0,'2024-05-20 21:22:06','2024-05-24 03:51:37'),(475,123,2,0,'2024-05-20 21:23:11','2024-05-24 04:50:07'),(476,121,1,1,'2024-05-20 21:30:30','2024-05-20 21:30:30'),(477,324,3,1,'2024-05-23 01:37:08','2024-05-23 01:37:08'),(481,324,2,0,'2024-05-23 04:57:22','2024-05-23 22:11:37'),(482,324,1,0,'2024-05-23 05:15:42','2024-05-24 21:47:46'),(483,324,6,1,'2024-05-24 01:52:52','2024-05-24 01:52:52'),(484,126,1,0,'2024-05-24 03:55:39','2024-05-24 21:32:49'),(485,129,1,0,'2024-05-24 05:14:46','2024-05-25 22:03:18'),(486,325,3,1,'2024-05-24 21:04:31','2024-05-24 21:04:31'),(487,290,3,1,'2024-05-25 06:02:49','2024-05-25 06:02:49'),(488,290,3,1,'2024-05-25 06:02:50','2024-05-25 06:02:50'),(489,290,3,1,'2024-05-25 06:02:52','2024-05-25 06:02:52'),(490,83,2,1,'2024-05-25 21:22:23','2024-05-25 21:22:23'),(491,326,4,1,'2024-05-25 21:43:39','2024-05-25 21:43:39'),(492,327,1,1,'2024-05-25 21:59:12','2024-05-25 21:59:12'),(493,327,3,1,'2024-05-25 21:59:12','2024-05-25 21:59:12'),(494,111,1,0,'2024-05-25 22:03:19','2024-05-26 18:41:44'),(496,329,2,0,'2024-05-25 23:51:59','2024-05-26 00:00:39'),(497,330,2,0,'2024-05-26 00:12:13','2024-05-26 00:39:15'),(498,331,4,1,'2024-05-26 03:29:46','2024-05-26 03:29:46'),(499,182,1,1,'2024-05-26 17:21:41','2024-05-26 17:21:41'),(500,332,2,1,'2024-05-26 17:36:46','2024-05-26 17:36:46'),(501,332,3,1,'2024-05-26 17:36:46','2024-05-26 17:36:46'),(502,130,1,0,'2024-05-26 18:19:16','2024-05-26 18:24:49'),(503,131,2,0,'2024-05-26 18:20:03','2024-05-26 18:24:24'),(504,118,1,0,'2024-05-26 18:30:10','2024-05-26 18:33:05'),(505,128,2,0,'2024-05-26 18:34:00','2024-05-27 23:25:49'),(506,331,3,1,'2024-05-26 19:09:55','2024-05-26 19:09:55'),(507,331,3,1,'2024-05-26 19:09:57','2024-05-26 19:09:57'),(509,333,4,1,'2024-05-27 01:18:48','2024-05-27 01:18:48'),(510,334,4,1,'2024-05-27 01:32:53','2024-05-27 01:32:53'),(511,335,4,1,'2024-05-27 04:47:16','2024-05-27 04:47:16'),(512,336,3,1,'2024-05-27 04:48:16','2024-05-27 04:48:16'),(513,337,1,1,'2024-05-27 04:59:52','2024-05-27 04:59:52'),(514,337,3,1,'2024-05-27 04:59:52','2024-05-27 04:59:52'),(515,338,4,1,'2024-05-27 05:09:08','2024-05-27 05:09:08'),(516,339,3,1,'2024-05-27 05:09:55','2024-05-27 05:09:55'),(517,124,1,0,'2024-05-27 23:02:36','2024-05-27 23:17:07'),(518,12,2,1,'2024-05-29 04:17:41','2024-05-29 04:17:41'),(519,10,3,1,'2024-05-29 04:42:56','2024-05-29 04:42:56'),(520,340,4,1,'2024-05-29 21:55:41','2024-05-29 21:55:41'),(521,341,4,1,'2024-05-30 02:59:34','2024-05-30 02:59:34');
/*!40000 ALTER TABLE `Roles_Usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES (''),('20240429180727-create-usuario.js'),('20240501155904-create-opcionsidebar.js'),('20240501171917-create-rol.js'),('20240501174055-create-rolesUsuario.js'),('20240501221054-create-rol-opciones.js.js'),('20240503022434-create-facultad.js'),('20240503023220-update-usuario.js.js'),('20240504235520-create-programa.js'),('20240504235616-add_fid_programa_to_usuario.js'),('20240505033731-create-disponibilidad.js.js'),('20240505053433-create-historicoestudiante.js'),('20240505055459-create-sesioncita.js'),('20240507124638-create-unidadacademica.js'),('20240508154942-add-siglas-to-facultad.js'),('20240519225714-add-fechaHoraInicio-fechaHoraFin-to-SesionCita.js'),('20240521003535-create-TipoFormato.js'),('20240521003625-create-TipoObligatoriedad.js'),('20240521004018-create-TipoPermanencia.js'),('20240521004412-create-TipoTutor.js'),('20240521004548-create-TipoTutoria.js'),('20240521004621-create-AsignacionTipoTutoria.js'),('20240521005544-create-EstadoSolicitudTutorFijo.js'),('20240521005736-create-SolicitudTutorFijo.js'),('20240521010001-create-AsignacionTutorAlumno.js'),('20240521024559-rename-colummSesioCita.js'),('20240521051014-add-es_corta-to-sesion-cita.js'),('20240522010838-create-estado-cita.js'),('20240522015814-modify-fid-estado-cita.js'),('20240522021128-add-creation-update-dates-to-estado-cita.js'),('20240522021652-create-derivacion-table.js'),('20240522021855-create-resultado-cita-table.js'),('20240522022127-create-compromiso-cita-table.js'),('20240522022257-create-estado-compromiso-cita-table.js'),('20240522213721-create-TipoModalidad.js'),('20240522222607-agregar-facultad-tipo-tutoria.js'),('20240522223533-add-TipoModalidadToSesionCita.js'),('20240523223726-add-fid-tutor-to-solicitudtutorfijo.js'),('20240524204810-add-relations-solicitud-tutor-fijo.js'),('20240526162030-add-fid_tipoTutoria-to-SolicitudTutorFijo.js'),('20240526163320-add-foreign-key-to-fid_tipoTutoria.js'),('20240526195620-add-fid_usuario-to-asignaciontipo_tutoria.js'),('20240527204629-addcolumm-in-TipoTutoria-fid-programa.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SesionCita`
--

DROP TABLE IF EXISTS `SesionCita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SesionCita` (
  `id_cita` int NOT NULL AUTO_INCREMENT,
  `fid_tutor` int NOT NULL,
  `fid_alumno` int NOT NULL,
  `fid_tipoTutoria` int DEFAULT NULL,
  `fid_resultado` int DEFAULT NULL,
  `fid_derivacion` int DEFAULT NULL,
  `lugar_link` varchar(255) DEFAULT NULL,
  `fid_estado_cita` int DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fechaHoraInicio` datetime NOT NULL,
  `fechaHoraFin` datetime NOT NULL,
  `es_corta` tinyint(1) NOT NULL DEFAULT '0',
  `fid_tipoModalidad` int DEFAULT NULL,
  PRIMARY KEY (`id_cita`),
  KEY `fid_tutor` (`fid_tutor`),
  KEY `fid_alumno` (`fid_alumno`),
  KEY `fid_estado_cita` (`fid_estado_cita`),
  KEY `SesionCita_fid_tipoModalidad_foreign_idx` (`fid_tipoModalidad`),
  CONSTRAINT `SesionCita_fid_tipoModalidad_foreign_idx` FOREIGN KEY (`fid_tipoModalidad`) REFERENCES `TipoModalidad` (`id_tipoModalidad`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `SesionCita_ibfk_1` FOREIGN KEY (`fid_tutor`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SesionCita_ibfk_2` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SesionCita_ibfk_3` FOREIGN KEY (`fid_estado_cita`) REFERENCES `EstadoCita` (`id_estado_cita`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SesionCita`
--

LOCK TABLES `SesionCita` WRITE;
/*!40000 ALTER TABLE `SesionCita` DISABLE KEYS */;
INSERT INTO `SesionCita` VALUES (159,3,3,12,NULL,NULL,'123',1,1,'2024-05-30 17:55:42','2024-05-30 17:55:42','2024-05-29 13:30:00','2024-05-29 15:00:00',0,1),(160,3,13,44,NULL,NULL,'123',1,1,'2024-05-30 18:06:11','2024-05-30 18:06:11','2024-05-30 14:00:00','2024-05-30 15:30:00',0,1),(161,3,13,44,NULL,NULL,'123',1,1,'2024-05-30 18:07:02','2024-05-30 18:07:02','2024-05-29 13:30:00','2024-05-29 15:00:00',0,1),(162,3,3,12,NULL,NULL,'123',1,1,'2024-05-30 18:07:54','2024-05-30 18:07:54','2024-05-29 14:00:00','2024-05-29 15:30:00',0,1),(163,3,3,12,NULL,NULL,'123',1,1,'2024-05-30 18:09:16','2024-05-30 18:09:18','2024-05-29 13:00:00','2024-05-29 15:00:00',0,1),(164,1,3,12,NULL,NULL,'123',1,1,'2024-05-30 18:13:43','2024-05-30 20:58:00','2024-06-01 14:00:00','2024-06-01 16:00:00',0,1),(165,1,3,12,NULL,NULL,'zoom',1,1,'2024-05-30 18:14:36','2024-05-30 20:58:00','0000-00-00 00:00:00','0000-00-00 00:00:00',0,2),(166,3,3,12,NULL,NULL,'https://',3,1,'2024-05-30 18:16:38','2024-05-30 18:16:44','2024-05-28 14:00:00','2024-05-28 15:30:00',0,2),(167,3,3,12,NULL,NULL,'zoom',1,1,'2024-05-30 18:18:17','2024-05-30 18:18:17','2024-05-28 13:00:00','2024-05-28 04:00:00',0,2),(168,3,3,12,NULL,NULL,'123',3,1,'2024-05-30 18:25:35','2024-05-30 18:25:37','2024-05-28 13:00:00','2024-05-28 15:00:00',0,1),(169,3,305,12,NULL,NULL,'ga',1,1,'2024-05-30 18:57:15','2024-05-30 18:57:15','2024-06-01 13:30:00','2024-06-01 05:00:00',0,1),(170,59,19,13,NULL,NULL,'N302',1,1,'2024-05-30 21:01:56','2024-05-30 21:01:56','2024-05-31 22:00:00','2024-05-31 23:00:00',0,1),(171,59,256,13,NULL,NULL,'N302',1,1,'2024-05-30 21:01:56','2024-05-30 21:01:56','2024-05-31 22:00:00','2024-05-31 23:00:00',0,1),(172,1,340,12,NULL,NULL,'A605',1,1,'2024-05-30 21:07:36','2024-05-30 21:07:36','2024-05-31 22:00:00','2024-05-31 23:00:00',0,1),(173,1,340,1,NULL,NULL,'A605',1,1,'2024-05-30 21:10:00','2024-05-30 21:10:00','2024-05-31 22:00:00','2024-05-31 23:00:00',0,1),(174,12,340,52,NULL,NULL,'A605',1,1,'2024-05-30 21:16:52','2024-05-30 21:16:52','2024-05-31 22:00:00','2024-05-31 23:00:00',0,1),(175,12,340,1,NULL,NULL,'N302',1,1,'2024-05-30 21:17:50','2024-05-30 21:17:50','2024-02-06 09:00:00','2024-02-06 10:30:00',0,1),(176,12,13,1,NULL,NULL,'N302',1,1,'2024-05-30 21:29:23','2024-05-30 21:29:23','2024-02-06 09:30:00','2024-02-06 11:00:00',0,1),(177,12,13,1,NULL,NULL,'N302',1,1,'2024-05-30 21:33:00','2024-05-30 21:33:00','2024-02-06 09:00:00','2024-02-06 10:30:00',0,1),(178,12,13,1,NULL,NULL,'N302',1,1,'2024-05-30 22:01:30','2024-05-30 22:01:30','2024-07-06 14:00:00','2024-07-06 15:30:00',0,1),(179,12,13,1,NULL,NULL,'N302',1,1,'2024-05-30 22:34:36','2024-05-30 22:34:36','2024-02-06 21:30:00','2024-02-06 23:00:00',0,1),(180,12,13,1,NULL,NULL,'N302',1,1,'2024-05-30 22:38:59','2024-05-30 22:38:59','2024-04-06 20:30:00','2024-04-06 23:00:00',0,1),(181,12,13,1,NULL,NULL,'N302',1,1,'2024-05-30 23:30:10','2024-05-30 23:30:10','2024-01-06 17:30:00','2024-01-06 19:00:00',0,1);
/*!40000 ALTER TABLE `SesionCita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SolicitudTutorFijo`
--

DROP TABLE IF EXISTS `SolicitudTutorFijo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SolicitudTutorFijo` (
  `id_solicitud` int NOT NULL AUTO_INCREMENT,
  `fid_alumno` int NOT NULL,
  `esRechazado` tinyint(1) NOT NULL DEFAULT '0',
  `motivoRechazo` varchar(255) DEFAULT NULL,
  `fid_estadoSolicitud` int NOT NULL,
  `fechaRegistro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaCierre` datetime DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fid_tutor` int NOT NULL,
  `fid_tipoTutoria` int DEFAULT NULL,
  PRIMARY KEY (`id_solicitud`),
  KEY `fid_alumno` (`fid_alumno`),
  KEY `fid_estadoSolicitud` (`fid_estadoSolicitud`),
  KEY `SolicitudTutorFijo_fid_tutor_foreign_idx` (`fid_tutor`),
  KEY `fid_tipoTutoria` (`fid_tipoTutoria`),
  CONSTRAINT `SolicitudTutorFijo_fid_tutor_foreign_idx` FOREIGN KEY (`fid_tutor`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SolicitudTutorFijo_ibfk_1` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SolicitudTutorFijo_ibfk_2` FOREIGN KEY (`fid_estadoSolicitud`) REFERENCES `EstadoSolicitudTutorFijo` (`id_estadoSolicitud`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SolicitudTutorFijo_ibfk_3` FOREIGN KEY (`fid_tipoTutoria`) REFERENCES `TipoTutoria` (`id_tipoTutoria`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SolicitudTutorFijo`
--

LOCK TABLES `SolicitudTutorFijo` WRITE;
/*!40000 ALTER TABLE `SolicitudTutorFijo` DISABLE KEYS */;
INSERT INTO `SolicitudTutorFijo` VALUES (2,13,0,NULL,1,'2024-05-23 22:52:18',NULL,1,'2024-05-23 22:52:18','2024-05-26 16:32:55',10,1),(3,256,0,NULL,2,'2024-05-23 23:05:54',NULL,1,'2024-05-23 23:05:54','2024-05-29 04:43:08',10,1),(4,256,0,NULL,2,'2024-05-23 23:19:13',NULL,1,'2024-05-23 23:19:12','2024-05-26 16:32:55',59,1),(5,256,1,'El tutor tiene demasiados alumnos asignados',3,'2024-05-24 10:29:08',NULL,1,'2024-05-24 10:29:08','2024-05-26 16:32:56',12,1),(6,3,0,NULL,1,'2024-05-30 02:51:12',NULL,1,'2024-05-30 02:51:11','2024-05-30 02:51:11',10,1),(7,3,0,NULL,1,'2024-05-30 02:58:09',NULL,1,'2024-05-30 02:58:08','2024-05-30 02:58:08',10,1),(8,3,0,NULL,1,'2024-05-30 03:01:19',NULL,1,'2024-05-30 03:01:18','2024-05-30 03:01:18',12,13),(9,3,0,NULL,2,'2024-05-30 03:12:12',NULL,1,'2024-05-30 03:12:11','2024-05-30 22:07:48',327,12),(10,3,0,NULL,1,'2024-05-30 03:14:37',NULL,1,'2024-05-30 03:14:37','2024-05-30 03:14:37',12,13),(11,3,0,NULL,1,'2024-05-30 03:29:16',NULL,1,'2024-05-30 03:29:15','2024-05-30 03:29:15',10,1),(12,3,0,NULL,1,'2024-05-30 03:31:43',NULL,1,'2024-05-30 03:31:42','2024-05-30 03:31:42',10,1),(13,3,0,NULL,1,'2024-05-30 03:33:17',NULL,1,'2024-05-30 03:33:16','2024-05-30 03:33:16',10,1),(14,3,0,NULL,1,'2024-05-30 03:34:33',NULL,1,'2024-05-30 03:34:33','2024-05-30 03:34:33',327,12),(15,3,0,NULL,1,'2024-05-30 03:37:25',NULL,1,'2024-05-30 03:37:24','2024-05-30 03:37:24',10,1),(16,3,0,NULL,1,'2024-05-30 03:38:31',NULL,1,'2024-05-30 03:38:30','2024-05-30 03:38:30',10,1),(17,3,0,NULL,1,'2024-05-30 04:02:57',NULL,1,'2024-05-30 04:02:56','2024-05-30 04:02:56',327,12),(18,3,0,NULL,1,'2024-05-30 04:14:53',NULL,1,'2024-05-30 04:14:52','2024-05-30 04:14:52',59,13),(19,3,0,NULL,1,'2024-05-30 09:12:26',NULL,1,'2024-05-30 09:12:25','2024-05-30 09:12:25',59,13),(20,3,0,NULL,1,'2024-05-30 10:14:47',NULL,1,'2024-05-30 10:14:47','2024-05-30 10:14:47',10,1),(21,3,0,NULL,1,'2024-05-30 10:14:53',NULL,1,'2024-05-30 10:14:53','2024-05-30 10:14:53',327,12),(22,3,0,NULL,1,'2024-05-30 18:23:17',NULL,1,'2024-05-30 18:23:17','2024-05-30 18:23:17',327,12),(23,3,0,NULL,1,'2024-05-30 18:23:24',NULL,1,'2024-05-30 18:23:23','2024-05-30 18:23:23',59,13),(24,3,0,NULL,1,'2024-05-30 18:49:10',NULL,1,'2024-05-30 18:49:10','2024-05-30 18:49:10',327,12),(25,3,0,NULL,1,'2024-05-30 19:05:21',NULL,1,'2024-05-30 19:05:21','2024-05-30 19:05:21',12,13),(26,3,0,NULL,1,'2024-05-30 19:15:02',NULL,1,'2024-05-30 19:15:02','2024-05-30 19:15:02',12,13),(27,3,0,NULL,1,'2024-05-30 20:57:50',NULL,1,'2024-05-30 20:57:50','2024-05-30 20:57:50',10,1),(28,3,0,NULL,1,'2024-05-30 20:57:57',NULL,1,'2024-05-30 20:57:56','2024-05-30 20:57:56',327,12),(29,3,0,NULL,1,'2024-05-30 20:58:05',NULL,1,'2024-05-30 20:58:05','2024-05-30 20:58:05',59,13),(30,3,0,NULL,1,'2024-05-30 21:13:59',NULL,1,'2024-05-30 21:13:59','2024-05-30 21:13:59',10,1),(31,3,0,NULL,1,'2024-05-30 21:14:19',NULL,1,'2024-05-30 21:14:19','2024-05-30 21:14:19',10,1),(32,3,0,NULL,1,'2024-05-30 21:15:20',NULL,1,'2024-05-30 21:15:20','2024-05-30 21:15:20',10,1),(33,3,0,NULL,1,'2024-05-30 21:16:29',NULL,1,'2024-05-30 21:16:28','2024-05-30 21:16:28',10,1),(34,3,0,NULL,1,'2024-05-30 21:38:58',NULL,1,'2024-05-30 21:38:58','2024-05-30 21:38:58',10,1),(35,3,0,NULL,1,'2024-05-30 21:41:17',NULL,1,'2024-05-30 21:41:17','2024-05-30 21:41:17',339,1),(36,3,0,NULL,1,'2024-05-30 21:41:28',NULL,1,'2024-05-30 21:41:28','2024-05-30 21:41:28',327,12),(37,3,0,NULL,1,'2024-05-30 21:43:33',NULL,1,'2024-05-30 21:43:32','2024-05-30 21:43:32',10,1),(38,3,0,NULL,1,'2024-05-30 21:45:12',NULL,1,'2024-05-30 21:45:11','2024-05-30 21:45:11',10,1),(39,3,0,NULL,1,'2024-05-30 21:47:00',NULL,1,'2024-05-30 21:47:00','2024-05-30 21:47:00',10,1),(40,3,0,NULL,1,'2024-05-30 21:55:18',NULL,1,'2024-05-30 21:55:18','2024-05-30 21:55:18',59,13),(41,3,0,NULL,1,'2024-05-30 21:55:56',NULL,1,'2024-05-30 21:55:56','2024-05-30 21:55:56',10,1);
/*!40000 ALTER TABLE `SolicitudTutorFijo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TipoFormato`
--

DROP TABLE IF EXISTS `TipoFormato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TipoFormato` (
  `id_tipoFormato` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_tipoFormato`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TipoFormato`
--

LOCK TABLES `TipoFormato` WRITE;
/*!40000 ALTER TABLE `TipoFormato` DISABLE KEYS */;
INSERT INTO `TipoFormato` VALUES (1,'Individual',NULL,1,'2024-05-22 18:39:33','2024-05-22 18:39:33'),(2,'Grupal',NULL,1,'2024-05-22 18:39:38','2024-05-22 18:39:38');
/*!40000 ALTER TABLE `TipoFormato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TipoModalidad`
--

DROP TABLE IF EXISTS `TipoModalidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TipoModalidad` (
  `id_tipoModalidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `esActivo` tinyint NOT NULL DEFAULT '1',
  `fechaCreacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_tipoModalidad`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TipoModalidad`
--

LOCK TABLES `TipoModalidad` WRITE;
/*!40000 ALTER TABLE `TipoModalidad` DISABLE KEYS */;
INSERT INTO `TipoModalidad` VALUES (1,'Presencial','Sesiones que se llevan a cabo en un entorno físico, en presencia del tutor y el alumno.',1,'2024-05-22 22:18:10','2024-05-22 22:18:10'),(2,'Virtual','Sesiones que se llevan a cabo de manera virtual.',1,'2024-05-22 22:18:40','2024-05-22 22:18:40');
/*!40000 ALTER TABLE `TipoModalidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TipoObligatoriedad`
--

DROP TABLE IF EXISTS `TipoObligatoriedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TipoObligatoriedad` (
  `id_tipoObligatoriedad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_tipoObligatoriedad`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TipoObligatoriedad`
--

LOCK TABLES `TipoObligatoriedad` WRITE;
/*!40000 ALTER TABLE `TipoObligatoriedad` DISABLE KEYS */;
INSERT INTO `TipoObligatoriedad` VALUES (1,'Obligatorio',NULL,1,'2024-05-22 18:37:10','2024-05-22 18:37:10'),(2,'Opcional',NULL,1,'2024-05-22 18:37:15','2024-05-22 18:37:15');
/*!40000 ALTER TABLE `TipoObligatoriedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TipoPermanencia`
--

DROP TABLE IF EXISTS `TipoPermanencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TipoPermanencia` (
  `id_tipoPermanencia` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_tipoPermanencia`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TipoPermanencia`
--

LOCK TABLES `TipoPermanencia` WRITE;
/*!40000 ALTER TABLE `TipoPermanencia` DISABLE KEYS */;
INSERT INTO `TipoPermanencia` VALUES (1,'Permanente',NULL,1,'2024-05-22 18:40:14','2024-05-22 18:40:14'),(2,'Temporal',NULL,1,'2024-05-22 18:40:15','2024-05-22 18:40:15');
/*!40000 ALTER TABLE `TipoPermanencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TipoTutor`
--

DROP TABLE IF EXISTS `TipoTutor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TipoTutor` (
  `id_tipoTutor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_tipoTutor`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TipoTutor`
--

LOCK TABLES `TipoTutor` WRITE;
/*!40000 ALTER TABLE `TipoTutor` DISABLE KEYS */;
INSERT INTO `TipoTutor` VALUES (1,'Variable',NULL,1,'2024-05-22 18:40:00','2024-05-22 18:40:00'),(2,'Fijo',NULL,1,'2024-05-22 18:40:03','2024-05-22 18:40:03');
/*!40000 ALTER TABLE `TipoTutor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TipoTutoria`
--

DROP TABLE IF EXISTS `TipoTutoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TipoTutoria` (
  `id_tipoTutoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `lugar` varchar(255) DEFAULT NULL,
  `fid_tipoObligatoriedad` int DEFAULT NULL,
  `fid_tipoPermanencia` int DEFAULT NULL,
  `fid_tipoTutor` int DEFAULT NULL,
  `fid_tipoFormato` int DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fid_facultad` int DEFAULT NULL,
  `fid_programa` int DEFAULT NULL,
  PRIMARY KEY (`id_tipoTutoria`),
  KEY `fid_tipoObligatoriedad` (`fid_tipoObligatoriedad`),
  KEY `fid_tipoPermanencia` (`fid_tipoPermanencia`),
  KEY `fid_tipoTutor` (`fid_tipoTutor`),
  KEY `fid_tipoFormato` (`fid_tipoFormato`),
  KEY `TipoTutoria_fid_facultad_foreign_idx` (`fid_facultad`),
  KEY `TipoTutoria_fid_programa_foreign_idx` (`fid_programa`),
  CONSTRAINT `TipoTutoria_fid_facultad_foreign_idx` FOREIGN KEY (`fid_facultad`) REFERENCES `Facultad` (`id_facultad`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `TipoTutoria_fid_programa_foreign_idx` FOREIGN KEY (`fid_programa`) REFERENCES `Programa` (`id_programa`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `TipoTutoria_ibfk_1` FOREIGN KEY (`fid_tipoObligatoriedad`) REFERENCES `TipoObligatoriedad` (`id_tipoObligatoriedad`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `TipoTutoria_ibfk_2` FOREIGN KEY (`fid_tipoPermanencia`) REFERENCES `TipoPermanencia` (`id_tipoPermanencia`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `TipoTutoria_ibfk_3` FOREIGN KEY (`fid_tipoTutor`) REFERENCES `TipoTutor` (`id_tipoTutor`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `TipoTutoria_ibfk_4` FOREIGN KEY (`fid_tipoFormato`) REFERENCES `TipoFormato` (`id_tipoFormato`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TipoTutoria`
--

LOCK TABLES `TipoTutoria` WRITE;
/*!40000 ALTER TABLE `TipoTutoria` DISABLE KEYS */;
INSERT INTO `TipoTutoria` VALUES (1,'Tutoria Académica',NULL,2,1,1,1,1,'2024-05-21 02:47:42','2024-05-27 23:59:59',7,NULL),(2,'Tutoria Académica',NULL,NULL,NULL,NULL,NULL,1,'2024-05-21 02:55:00','2024-05-21 02:55:00',NULL,NULL),(3,'Laboral',NULL,NULL,NULL,NULL,NULL,1,'2024-05-22 18:33:18','2024-05-22 18:33:18',NULL,NULL),(4,'Obligatorio',NULL,NULL,NULL,NULL,NULL,1,'2024-05-22 18:40:57','2024-05-22 18:40:57',NULL,NULL),(5,'Probando',NULL,NULL,NULL,NULL,NULL,1,'2024-05-22 18:41:55','2024-05-22 18:41:55',NULL,NULL),(6,'Probandoa',NULL,NULL,NULL,NULL,NULL,1,'2024-05-22 18:47:02','2024-05-22 18:47:02',NULL,NULL),(7,'A',NULL,NULL,NULL,NULL,NULL,1,'2024-05-22 18:47:25','2024-05-22 18:47:25',NULL,NULL),(8,'Prueba Unitaria',NULL,NULL,NULL,NULL,NULL,1,'2024-05-22 23:05:21','2024-05-22 23:05:21',NULL,NULL),(9,'Tipo De Prueba',NULL,NULL,NULL,NULL,NULL,1,'2024-05-22 23:17:24','2024-05-22 23:17:24',NULL,NULL),(10,'Propaganda',NULL,2,2,1,1,1,'2024-05-22 23:19:17','2024-05-22 23:33:59',NULL,NULL),(11,'Uno',NULL,2,2,2,2,1,'2024-05-22 23:34:20','2024-05-22 23:34:20',NULL,NULL),(12,'Tipo',NULL,1,1,2,1,1,'2024-05-23 00:28:11','2024-05-28 05:08:08',1,NULL),(13,'Cachimbos',NULL,1,2,2,2,1,'2024-05-23 04:16:20','2024-05-26 22:52:31',2,NULL),(14,'Cuarta Matrícula',NULL,1,2,2,2,1,'2024-05-23 04:17:18','2024-05-26 22:52:31',2,NULL),(15,'Probando',NULL,2,1,1,1,1,'2024-05-23 05:12:28','2024-05-30 05:18:57',7,NULL),(16,'Cuarta Matricula',NULL,1,2,NULL,2,1,'2024-05-23 22:34:00','2024-05-24 19:50:16',7,NULL),(17,'Cachimbos',NULL,1,2,NULL,2,1,'2024-05-23 22:34:14','2024-05-24 19:50:20',7,NULL),(18,'Tipo De Tutoría Uno',NULL,2,1,2,1,1,'2024-05-23 22:36:20','2024-05-23 22:36:20',7,NULL),(19,'Apoyo',NULL,2,2,2,1,1,'2024-05-23 22:41:21','2024-05-24 19:50:35',7,NULL),(20,'Tipo Tutoría Dos',NULL,2,1,1,1,1,'2024-05-23 22:42:03','2024-05-30 04:40:51',7,NULL),(21,'Ingreso Laboral',NULL,2,1,1,1,1,'2024-05-24 07:19:24','2024-05-24 07:19:24',2,NULL),(22,'Tercera Matricula',NULL,1,1,1,1,1,'2024-05-24 08:50:31','2024-05-24 08:50:31',17,NULL),(23,'Segunda Matricula',NULL,1,1,NULL,2,1,'2024-05-24 08:54:38','2024-05-24 08:54:38',17,NULL),(24,'Alumnos en Riesgo',NULL,1,1,NULL,2,1,'2024-05-24 08:56:48','2024-05-24 08:56:48',17,NULL),(25,'Alumnos en Riesgo',NULL,1,1,NULL,2,1,'2024-05-24 09:08:41','2024-05-24 09:08:41',17,NULL),(26,'Alumnos en Riesgo',NULL,1,1,NULL,2,1,'2024-05-24 09:13:44','2024-05-24 09:13:44',17,NULL),(27,'Tercera Matrícula',NULL,1,2,NULL,2,1,'2024-05-24 18:07:34','2024-05-24 18:07:34',2,NULL),(28,'Ventas',NULL,2,1,1,1,1,'2024-05-24 18:11:51','2024-05-24 18:35:25',2,NULL),(29,'Psicopedagogica',NULL,2,1,NULL,2,0,'2024-05-25 00:20:05','2024-05-28 05:08:41',1,NULL),(30,'Refuerzo En Temas De Ux',NULL,2,1,NULL,2,1,'2024-05-25 00:20:40','2024-05-25 00:20:40',1,NULL),(31,'Asesoramiento Profesional',NULL,2,2,2,1,0,'2024-05-25 00:21:21','2024-05-28 05:09:13',1,NULL),(32,'Orientacion Profesional',NULL,2,1,2,1,0,'2024-05-25 00:21:42','2024-05-28 05:09:10',1,NULL),(33,'Cuarta Matricula',NULL,1,1,NULL,2,0,'2024-05-25 00:21:58','2024-05-28 05:09:06',1,NULL),(34,'Asesoramiento En Temas Académicos',NULL,2,1,1,1,0,'2024-05-25 00:22:44','2024-05-28 05:09:08',1,NULL),(35,'Asesoramiento A Cachimbos',NULL,1,1,NULL,2,0,'2024-05-25 00:23:12','2024-05-28 05:09:04',1,NULL),(36,'Refuerzo En Temas De Ingeniería De Software',NULL,2,1,NULL,2,0,'2024-05-25 00:23:57','2024-05-28 05:08:56',1,NULL),(37,'Asesoramiento Profesional',NULL,2,1,1,1,0,'2024-05-25 00:24:55','2024-05-28 05:08:48',1,NULL),(38,'Cachimbos Post Grado ',NULL,1,1,2,1,0,'2024-05-25 01:40:20','2024-05-25 01:53:29',1,NULL),(39,'Refuerzo En Tema De Deep Learning',NULL,2,1,2,1,0,'2024-05-26 03:25:20','2024-05-26 18:09:40',1,NULL),(40,'Laboral',NULL,2,1,1,1,1,'2024-05-27 05:13:14','2024-05-27 05:13:14',89,NULL),(41,'Tipo Tres',NULL,2,1,NULL,2,1,'2024-05-28 05:42:07','2024-05-30 04:02:26',7,NULL),(42,'Tipo Cuatro',NULL,2,1,2,1,1,'2024-05-28 05:42:18','2024-05-30 04:40:48',7,NULL),(43,'Tipo Cinco',NULL,1,1,NULL,2,1,'2024-05-28 05:42:28','2024-05-30 04:23:01',7,NULL),(44,'Tipo Seis',NULL,1,2,2,1,1,'2024-05-28 05:42:46','2024-05-30 06:02:56',7,NULL),(45,'Bicas',NULL,1,2,NULL,2,1,'2024-05-28 05:57:16','2024-05-28 05:57:16',2,NULL),(46,'Quinta Matrícula',NULL,1,2,NULL,2,1,'2024-05-28 05:57:40','2024-05-28 05:57:40',2,NULL),(47,'Primera Matrícula',NULL,1,2,NULL,2,1,'2024-05-28 05:58:00','2024-05-28 05:58:00',2,NULL),(48,'Revoltosos',NULL,2,1,1,1,1,'2024-05-28 05:58:21','2024-05-28 05:58:21',2,NULL),(49,'Estudiar Mejor',NULL,2,1,1,1,1,'2024-05-28 05:58:46','2024-05-28 05:58:46',2,NULL),(50,'Estudiar Super Mejor Personalizado',NULL,2,1,2,1,1,'2024-05-28 05:59:24','2024-05-28 05:59:24',2,NULL),(51,'Tutoria Ejemplo',NULL,2,1,2,1,1,'2024-05-30 09:37:14','2024-05-30 09:37:14',1,NULL),(52,'Tutoria Ejemplo',NULL,2,1,2,1,1,'2024-05-30 09:37:49','2024-05-30 09:37:49',1,NULL),(53,'Tutoria Ejemplo',NULL,2,1,2,1,1,'2024-05-30 09:39:18','2024-05-30 09:39:18',1,NULL),(54,'Tutoria Ejemplo Diez',NULL,1,2,NULL,2,1,'2024-05-30 21:57:37','2024-05-30 21:57:37',1,NULL),(55,'Prepara Pizzas',NULL,2,2,1,1,1,'2024-05-31 00:35:46','2024-05-31 00:35:46',2,NULL),(56,'Prepara Pizza',NULL,2,2,2,1,1,'2024-05-31 00:38:23','2024-05-31 00:43:06',7,NULL);
/*!40000 ALTER TABLE `TipoTutoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UnidadAcademica`
--

DROP TABLE IF EXISTS `UnidadAcademica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UnidadAcademica` (
  `id_unidad_academica` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `siglas` varchar(20) NOT NULL,
  `correoDeContacto` varchar(100) NOT NULL,
  `esActivo` tinyint NOT NULL DEFAULT '1',
  `fechaCreacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_unidad_academica`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UnidadAcademica`
--

LOCK TABLES `UnidadAcademica` WRITE;
/*!40000 ALTER TABLE `UnidadAcademica` DISABLE KEYS */;
INSERT INTO `UnidadAcademica` VALUES (1,'Dirección De Asuntos Estudiantiles','DAES','daes@pucp.edu.pe',1,'2024-05-20 07:15:30','2024-05-20 07:15:30'),(3,'Dirección De Asuntos Académicos','DAES','daes@pucp.edu.pe',1,'2024-05-20 09:26:03','2024-05-20 09:26:03'),(4,'Asociación De Alumnos De Ingeniería Informática','AAII','aaii@pucp.edu.pe',1,'2024-05-20 09:29:17','2024-05-20 09:29:17');
/*!40000 ALTER TABLE `UnidadAcademica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `primerApellido` varchar(255) NOT NULL,
  `segundoApellido` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `contrasenha` varchar(255) NOT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `codigo` varchar(8) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fid_facultad` int DEFAULT NULL,
  `fid_programa` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `Usuario_fid_facultad_foreign_idx` (`fid_facultad`),
  KEY `Usuario_fid_programa_foreign_idx` (`fid_programa`),
  CONSTRAINT `Usuario_fid_facultad_foreign_idx` FOREIGN KEY (`fid_facultad`) REFERENCES `Facultad` (`id_facultad`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Usuario_fid_programa_foreign_idx` FOREIGN KEY (`fid_programa`) REFERENCES `Programa` (`id_programa`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=342 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
INSERT INTO `Usuario` VALUES (1,'Edgardo Javier','Solis','Cornelio','a20202467@pucp.edu.pe','$2a$10$MXRKUGPYNZCHvfc3PvJv..ajU5SbiJpi3VxEpTM3rbh1clBscwOdy',1,'20202467','https://ui-avatars.com/api/?name=E&color=fff&background=0930D2&size=100','2024-05-01 19:10:34','2024-05-01 19:10:34',NULL,NULL),(3,'Ricardo Abed','Melendez','Olivo','ricardomelendezao@gmail.com','$2a$10$.q.quzqqSIwqatV75ClJBOLpTHZX6UWthUde5CK9FOWr5MW6YBg5O',1,'20200485','https://ui-avatars.com/api/?name=R&color=fff&background=721E4F&size=100','2024-05-02 00:42:52','2024-05-26 17:16:32',NULL,NULL),(7,'Gino','Llano','Llano','a20171707@pucp.edu.pe','$2a$10$PEMZdaW1WrEs4JD21iZQU.0VerF1f.d0.9eNq78h6nY4NeI5O7GX.',1,'20204985','https://ui-avatars.com/api/?name=G&color=fff&background=095DF6&size=100','2024-05-02 03:25:41','2024-05-24 21:32:49',NULL,78),(8,'Brando Leonardo','Rojas','Romero','a20191088@pucp.edu.pe','$2a$10$jvUFaq59W.mF2EFqlHexEuu9oFN6jOed6npQdX4wcCFdFeDCmOAtK',1,'20191088','https://ui-avatars.com/api/?name=B&color=fff&background=292696&size=100','2024-05-02 03:26:43','2024-05-02 03:26:43',NULL,NULL),(9,'Jeanpierr Francisco','Suarez','Facundo','jfsuarez@pucp.edu.pe','$2a$10$YlDsnn3rKy5tOxtW.mNG6eVx2WudYqHeCLNwfPc39dhYBlUZB8QFy',1,'20196346','https://ui-avatars.com/api/?name=J&color=fff&background=344C00&size=100','2024-05-02 04:52:26','2024-05-24 21:32:49',NULL,NULL),(10,'Luis Alberto','Flores','Garcia','luis.flores@pucp.edu.pe','$2a$10$oYfvwAL5Ly8z/.7OalfOjuLyzK0lnT2X1Jv1rLlsG.g4KCzwJMHYy',1,'19960275','https://ui-avatars.com/api/?name=L&color=fff&background=235AEB&size=100','2024-05-03 12:40:42','2024-05-03 12:40:42',NULL,NULL),(12,'Freddy Alberto','Paz','Espinoza','fpaz@pucp.edu.pe','$2a$10$tnvxKQ2BMJrejhLrOhmryO6YciOJa8JbBm5oSV87iwAyfPj6R/G1u',1,'20112728','https://ui-avatars.com/api/?name=F&color=fff&background=2B3786&size=100','2024-05-03 13:10:28','2024-05-29 04:17:42',7,93),(13,'Jesus Adrian','Carrion','Moscoso','12152020@pucp.edu.pe','$2a$10$G3MbypJ7mUsTvwM5roPCEeCRQy.PnK41VCTrdUU0n5gSeZs3Mf2re',1,'12152020','https://ui-avatars.com/api/?name=J&color=fff&background=79CCA2&size=100','2024-05-03 13:14:16','2024-05-30 01:46:20',7,93),(14,'Pablo Ramiro','Ruiz','Fernandez','pruiz@pucp.edu.pe','$2a$10$a6ybSoZAKtd3bg3rQm3Ts.FP.a3MT9D.G6m19rAQcxkBkDdFyzjK6',1,'19902541','https://ui-avatars.com/api/?name=P&color=fff&background=1D52E8&size=100','2024-05-03 13:19:49','2024-05-03 13:19:49',NULL,NULL),(15,'Hernando Humberto','Garcia','Reyes','hgarcia@pucp.edu.pe','$2a$10$ow1lC7T0QxdHnYjfp8yejOyioOBlj1KPcLbXtE11hqyp3xrXGaCNS',1,'20002563','https://ui-avatars.com/api/?name=H&color=fff&background=4DD333&size=100','2024-05-03 13:21:18','2024-05-03 13:21:18',NULL,NULL),(19,'Julio Guillermo','Delgado','Cercado','julio.delgado@pucp.edu.pe','$2a$10$O6CG2zxR/o5ZZ1G.OQwO5OFoyb/.KINIGWE9CAaM27iPlWHnAsuN6',1,'20201651','https://ui-avatars.com/api/?name=J&color=fff&background=FBB700&size=100','2024-05-03 18:07:33','2024-05-27 23:37:14',7,NULL),(20,'Tadeo','Uriol','Perez','a20001254@pucp.edu.pe','$2a$10$/pabHfev/vxa0opiRAzOQ.KsX9bPkFa.As9BOrtt/1XA5hX9y3ZCK',1,'20001254','https://ui-avatars.com/api/?name=T&color=fff&background=9F3FE6&size=100','2024-05-03 19:38:07','2024-05-03 19:38:07',NULL,NULL),(23,'karla','delgado','cercado','jdelgado0501@gmail.com','$2a$10$rnbiBO4q0wI3D9PWpjpdKO4Mk68/2c7k/kt83dzoklExAIndLUJbW',0,'12345678','https://ui-avatars.com/api/?name=K&color=fff&background=0F3903&size=100','2024-05-03 21:21:29','2024-05-09 15:11:08',NULL,NULL),(24,'Fernando','Gonzales','Cueva','a20172342@pucp.edu.pe','$2a$10$t5YezQPEhSdWlzZ4S5Tq8.VNSM0xj7ge.nW7Jtwh930yXxgUBlMha',1,'20172342','https://ui-avatars.com/api/?name=F&color=fff&background=1F9901&size=100','2024-05-03 21:47:08','2024-05-03 21:47:08',NULL,NULL),(48,'Manuel','Delgado','Carrillo','mdelgadoc@pucp.edu.pe','$2a$10$lF8WGopVKtj21OIxuzweke3BRt98sNCfBlAgPSI2tMyTG38qlWFna',1,'20191973','https://ui-avatars.com/api/?name=M&color=fff&background=6BBF47&size=100','2024-05-03 23:17:35','2024-05-03 23:17:35',NULL,NULL),(49,'Miguel','Guanira','Lopez','miguelguanira@pucp.edu.pe','$2a$10$eaeuBN19LM1Ub06BzzX25.ISOWD5r/cm20OBBu752jazFMPrjg9UO',1,'20014567','https://ui-avatars.com/api/?name=M&color=fff&background=4DA65F&size=100','2024-05-03 23:20:08','2024-05-03 23:20:08',NULL,NULL),(50,'Jose Mario','Galvez','Patiño','jgalvezp@pucp.edu.pe','$2a$10$tHZ58TYTQmIk5adRzfYEg.Ybm3Q2B1oadPqLyX3/R8SI7AvlKBu.S',1,'20196758','https://ui-avatars.com/api/?name=J&color=fff&background=510DC3&size=100','2024-05-05 02:53:49','2024-05-25 00:16:26',NULL,NULL),(59,'Renatto Tobias','Garcia','Arce','a20191668@pucp.edu.pe','$2a$10$qpfuorUk178aNWzqWr4oseJ5x9D/lvlNaKIh2TlZKyXo5g9eAEy2m',1,'20191668','https://ui-avatars.com/api/?name=R&color=fff&background=4802B4&size=100','2024-05-05 14:49:40','2024-05-30 20:07:36',NULL,NULL),(60,'Diego Eduardo','Chupurgox','Gutarra','a20193481@pucp.edu.pe','$2a$10$aovY3R0uFvwm2Yt0rykjAuWmTlZuJpunD4Mg6QJRc/ZLe.yyZijQq',1,'20193481','https://ui-avatars.com/api/?name=D&color=fff&background=173B06&size=100','2024-05-05 14:49:41','2024-05-18 23:20:49',NULL,NULL),(61,'Julian Rodrigo','Canez','Rodriguez','rodrigo.canez@pucp.edu.pe','$2a$10$k/f424UKBODULMXDIj2gP.JZkuwFJy6qPq2o3cEb9Wi/nPhgnwTeO',0,'20200554','https://ui-avatars.com/api/?name=O&color=fff&background=6A71B7&size=100','2024-05-05 14:49:41','2024-05-19 07:39:40',NULL,NULL),(62,'Mario Paulo','Ruiz','Vega','a20194590@pucp.edu.pe','$2a$10$j6.nbYmAc3vvPNN91UPEkuRb76Di2oH0iW3MzbE7x5JN0h6cJoyXe',1,'20194590','https://ui-avatars.com/api/?name=M&color=fff&background=455E3E&size=100','2024-05-05 14:49:42','2024-05-18 23:04:45',NULL,NULL),(72,'Pedro','Perez','Perez','pedro.perez@gmail.com','$2a$10$ut41d1GCzokpVsC4q76tNeDCE.pHg20mDPr09hqEGKaKkYWUmhmPa',1,'55555555','https://ui-avatars.com/api/?name=P&color=fff&background=384ADD&size=100','2024-05-05 22:21:14','2024-05-05 22:21:14',NULL,NULL),(74,'Paul','Sanchez','Espinoza','psancheze@pucp.edu.pe','$2a$10$.438W50tJZtXcpnTjZ0qCOkHK.UjU/F2BaYtUwVPfZpsdXmmGY2U2',1,'20187465','https://ui-avatars.com/api/?name=P&color=fff&background=0EB5D4&size=100','2024-05-05 23:38:10','2024-05-05 23:38:10',NULL,NULL),(75,'Rosa Maria','Garcia','Lopez','rgarcial@pucp.edu.pe','$2a$10$5W01K7oPPuKWjylenM/qH.FlS7y6ts1L8saSPcJ5tlALJiwHVoNkm',1,'20183948','https://ui-avatars.com/api/?name=R&color=fff&background=34CF3C&size=100','2024-05-05 23:40:25','2024-05-08 06:03:07',NULL,NULL),(83,'Americo Erick','Mercado','Dionicio','erick.mercado@pucp.edu.pe','$2a$10$WYCPGifQ3ELh.2lf77Tb0OssIW3EvKynSHLXTdrz.ExgBgyXxQ6Na',1,'20191372','https://ui-avatars.com/api/?name=A&color=fff&background=ED2B17&size=100','2024-05-06 04:11:36','2024-05-25 21:22:24',25,88),(84,'Alberto Renato','Castillo','Alarcón','alberto.castillo@pucp.edu.pe','$2a$10$R5DqpsaxrcJ1ezalciHiyu2tuJRHLlAnVkr3cX.TDAD1Bc5vnyAIu',1,'20201280','https://ui-avatars.com/api/?name=A&color=fff&background=F5C7B5&size=100','2024-05-06 04:29:27','2024-05-07 02:27:08',NULL,NULL),(86,'Anderson','Contreras','Ruiz','yahyrperez@gmail.com','$2a$10$dt.Bj23bKOOrLyUDfLXOye/T2PMjBFZ.wRv5ssc3K7SjChqhVK.qW',1,'66157412','https://ui-avatars.com/api/?name=A&color=fff&background=2045EF&size=100','2024-05-06 19:40:40','2024-05-11 00:11:12',62,NULL),(92,'Juan Alberto','Castillo','Paz','juan.paz@pucp.edu.pe','$2a$10$hu9klsLnd8vz330pmijMcOu4iCcF9oD0V864XLy.NdWL9C8vkMNP2',1,'20181234','https://ui-avatars.com/api/?name=J&color=fff&background=D7249E&size=100','2024-05-06 21:47:41','2024-05-24 21:32:49',NULL,NULL),(93,'Joseph Diego','Garcia','Egoavil','a20191373@pucp.edu.pe','$2a$10$b0S4g1/CNEFJ6L8LBFQMoumdB.LKOVLzsor0NNU4cxUX/uSVCciZK',1,'20191374','https://ui-avatars.com/api/?name=J&color=fff&background=FB35F8&size=100','2024-05-06 23:16:46','2024-05-24 21:32:49',NULL,NULL),(94,'Angel','Rosario','','angel.rosario@gmail.com','$2a$10$NNU2zzcwf0FETHreMYfEjuK/rHcXtn6R.4RkqgxTKyTu51u0ISPvK',1,'77777777','https://ui-avatars.com/api/?name=A&color=fff&background=3E32F3&size=100','2024-05-07 01:21:21','2024-05-07 18:50:35',NULL,NULL),(97,'Willy Rogerio','Palomino','Cercado','abc@gmail.com','$2a$10$z4r.ErjDU/rMi0OBcRywkuFH.GyXmk9wBmqkCZfBQDT7u3Cmbiy9u',1,'09876543','https://ui-avatars.com/api/?name=W&color=fff&background=5A99C1&size=100','2024-05-08 04:24:53','2024-05-09 05:03:46',NULL,NULL),(98,'Ricardo Alejandro','Moreno','Cercado','ricardo.moreno@pucp.edu.pe','$2a$10$XKukIBIKJAKBm8BTdgiQnOha0dza5.Iw73IY2Sy0Sdot8ZXtDmGBG',1,'20233797','https://ui-avatars.com/api/?name=R&color=fff&background=90878E&size=100','2024-05-08 04:29:47','2024-05-09 05:38:26',NULL,NULL),(101,'Daniel Enrique','Mercado','Dionicio','daniel.mercado@pucp.edu.pe','$2a$10$bg6zclpO.Kqk0tuoY0unoelgyDrx5w0kgtGeTKZILB3iuH4v3E0aW',1,'20221345','https://ui-avatars.com/api/?name=D&color=fff&background=048E73&size=100','2024-05-08 05:05:11','2024-05-08 05:55:05',NULL,NULL),(102,'Peter Gonzalo','Mendez','Miranda','peter.mendez@pucp.edu.pe','$2a$10$wmnLl7uSDAGAnEwS7rkhbOfuuict4sU3/GKPEMSBCXkW1Aww23362',1,'20201112','https://ui-avatars.com/api/?name=P&color=fff&background=363280&size=100','2024-05-08 05:57:42','2024-05-08 06:01:58',32,NULL),(103,'Marco Elmer','Miranda','Tevez','marco.miranda@pucp.edu.pe','$2a$10$CrXs4i6U2btJQvk6ai0HTuPJfHhJOrN9TcU0WYF/.Q6uu8j5BzFvm',1,'20215678','https://ui-avatars.com/api/?name=M&color=fff&background=E8E71D&size=100','2024-05-08 06:03:08','2024-05-26 17:21:40',NULL,NULL),(104,'Sofia','Martinez','Garcia','sofia.garcia@example.com','$2a$10$uYO.WmBmLw169Vr8reggZuXal.pkNJ1peqtpd1/Zgy.JbnZYzZev6',1,'30548712','https://ui-avatars.com/api/?name=S&color=fff&background=996B2B&size=100','2024-05-08 21:52:55','2024-05-18 22:51:01',39,NULL),(105,'Alejandra','Lopez','Hernandez','alejandra.lopez@example.com','$2a$10$PDOkixGWl1f8Cql.30Md6u2kYPRaeGVbLcn9PGKJpERmPVqYtP/My',1,'40892153','https://ui-avatars.com/api/?name=A&color=fff&background=80C26F&size=100','2024-05-08 21:52:58','2024-05-19 07:44:19',50,NULL),(107,'Diego','Ramirez','Sanchez','diego.ramirez@example.com','$2a$10$U7KOxY0w3cpFkEyhy7vEw.dtWQwoS7FvqApYY8EfUVTWLgz9rXNcm',1,'60924575','https://ui-avatars.com/api/?name=D&color=fff&background=663DB5&size=100','2024-05-08 21:53:04','2024-05-23 22:03:20',NULL,54),(108,'Maria','Fernandez','Rodriguez','maria.fernandez@example.com','$2a$10$iGdul5NDiWzgWhKvOUIP5uCKmqw6NaV9r6gAZBa.HWRc769KutcCy',1,'71258736','https://ui-avatars.com/api/?name=M&color=fff&background=19B1E8&size=100','2024-05-08 21:53:07','2024-05-23 22:03:20',NULL,NULL),(109,'Lucas','Silva','Santos','lucas.silva@example.com','$2a$10$6SMHSQ2eyCTipDFH45nO8.qFsrfRglXb7FAvrsKaqFlbzOTQuIfvG',1,'81536749','https://ui-avatars.com/api/?name=L&color=fff&background=4F2B35&size=100','2024-05-08 21:53:10','2024-05-23 22:03:20',NULL,53),(110,'Chloe','Diaz','Martin','chloe.dupont@example.com','$2a$10$CAHvVYJRxClvDlesY16.ueHL2ZXKjjEjjjcrve4TV6Y.I4v2CrmWO',1,'92341850','https://ui-avatars.com/api/?name=C&color=fff&background=A8E0CA&size=100','2024-05-08 21:53:13','2024-05-24 03:59:44',NULL,NULL),(111,'Hans','Sanchez','Miller','hans.schmidt@example.com','$2a$10$1vyHuCa4USI4iK2cRE/ejeAhL1ClcEMe4d0idzIgTTvotxnJ5RPu6',1,'10537462','https://ui-avatars.com/api/?name=H&color=fff&background=7BA2DB&size=100','2024-05-08 21:53:16','2024-05-26 18:41:44',NULL,NULL),(112,'Alessia','Rossi','Moretti','alessia.rossi@example.com','$2a$10$4WDSebp1YbULGYQ0grSNYeKjcqgonBceGKmcNIjDYEfek4fsi.OiO',1,'11268394','https://ui-avatars.com/api/?name=A&color=fff&background=AC5CA8&size=100','2024-05-08 21:53:18','2024-05-27 23:36:50',1,92),(113,'Ling','Wei','Chen','ling.wei@example.com','$2a$10$TFElttrUqCpC/szpzFtVB.Ur11tz9Svh8/TM5W9dtbICqw4Nt.lTq',1,'12165938','https://ui-avatars.com/api/?name=L&color=fff&background=71FD98&size=100','2024-05-08 21:53:21','2024-05-30 20:07:38',NULL,NULL),(114,'Priya','Patel','Shah','priya.patel@example.com','$2a$10$DkYJ69bUTjcaGLxGsGVKcuNb5xqa/tFlq6iSK5fUNMNz/Hyodf6/6',1,'13104752','https://ui-avatars.com/api/?name=P&color=fff&background=FD3F8F&size=100','2024-05-08 21:53:24','2024-05-23 22:06:01',NULL,NULL),(115,'Juan','Garcia','Pablo','juan.pablo@example.com','$2a$10$waT82ADUeaECZeupzn3SduJ1JdN165aRWjygVGX/lFWDCNNb94/jy',1,'14102987','https://ui-avatars.com/api/?name=J&color=fff&background=44B0A6&size=100','2024-05-08 21:53:27','2024-05-25 00:16:06',NULL,NULL),(116,'Mateo','Fernandez','Perez','mateo.fernandez@example.com','$2a$10$l.3BdjfPxSvHC3ZrXdLIDeyqwx9Raqyf9SU128oTaHht1GHiBgqeu',1,'15239647','https://ui-avatars.com/api/?name=M&color=fff&background=6B86BA&size=100','2024-05-08 21:53:29','2024-05-30 06:51:19',NULL,NULL),(117,'Hannah','Miller','Sanchez','hannah.mueller@example.com','$2a$10$7ZEGw3QJS9f6BMsVK7hMM.gOgkJ7pYJKh8PYJgU4pXP/.qRE6W8XK',1,'16378529','https://ui-avatars.com/api/?name=H&color=fff&background=55E743&size=100','2024-05-08 21:53:32','2024-05-25 00:18:31',NULL,NULL),(118,'Isabella','Rossi','Rios','isabella.rossi@example.com','$2a$10$e7pwwXjYZVGuYzzF8vwvme3vFvb34NcjwsS8D8Ru85bLbvsi3PhLm',1,'17384265','https://ui-avatars.com/api/?name=I&color=fff&background=728671&size=100','2024-05-08 21:53:34','2024-05-26 18:33:06',NULL,NULL),(119,'Liam','Wilson','Brown','liam.wilson@example.com','$2a$10$/WuAlhfF9.vXrmWJixvWduiacLoLktzSaSPfk3DoiNLnp/2vJT/tS',1,'18472395','https://ui-avatars.com/api/?name=L&color=fff&background=59B6D0&size=100','2024-05-08 21:53:37','2024-05-23 22:11:24',NULL,NULL),(120,'Emily','Taylor','Johnson','emily.taylor@example.com','$2a$10$M4Lej6x4e31naNu1RW.7s.vjyP8F2inrrlPbLaiyVjcxOMh.5MU7e',1,'19354762','https://ui-avatars.com/api/?name=E&color=fff&background=A47B13&size=100','2024-05-08 21:53:39','2024-05-24 03:51:37',NULL,NULL),(121,'Thiago','Oliveira','Silva','thiago.oliveira@example.com','$2a$10$z6oK7DM0OEfvKyuRbCtR3OcMBjJ17FXHzxghgAlm51jj/Ak/FUS2e',1,'20193574','https://ui-avatars.com/api/?name=T&color=fff&background=435B81&size=100','2024-05-08 21:53:42','2024-05-20 21:30:30',81,NULL),(122,'Mei','Chen','Wang','mei.chen@example.com','$2a$10$9kaf.OtgjTtwjafTQ/JDPukDwYtdFe8VLLyRlyan7o4cgoMPJkg1q',1,'21359846','https://ui-avatars.com/api/?name=M&color=fff&background=B4EC99&size=100','2024-05-08 21:53:45','2024-05-29 01:22:41',NULL,NULL),(123,'Lea','Dubois','Martin','lea.dubois@example.com','$2a$10$Hxxdssdd53MyqvWnJ9Plmuz1dqFOqiE9cNNiq8xUP10ODY/afC24G',1,'22471039','https://ui-avatars.com/api/?name=L&color=fff&background=FF8BDE&size=100','2024-05-08 21:53:48','2024-05-24 21:32:49',NULL,NULL),(124,'Juan Carlos','Rodriguez','Garcia','juan.rodriguez@example.com','$2a$10$HjyiCnurMrGCeYyBbZzXpOIzyGFmWPcrtu2xKcPbpmvC5J5hI4nYS',1,'10293847','https://ui-avatars.com/api/?name=J&color=fff&background=2AACE9&size=100','2024-05-08 22:13:18','2024-05-27 23:17:07',NULL,NULL),(125,'Maria Fernanda','Lopez','Martinez','maria.lopez@example.com','$2a$10$x0hUUlEqRYKrjpGz2GMUiuMq66yAQsfLGBgE0BtUrc1lkwnWv7LYm',0,'21547893','https://ui-avatars.com/api/?name=M&color=fff&background=F96D51&size=100','2024-05-08 22:13:21','2024-05-23 22:03:20',NULL,53),(126,'Carlos Eduardo','Fernandez','Perez','carlos.fernandez@example.com','$2a$10$TqL0qO61aw1Q6NrISH15uOna9F9.NhukHdI4JVjdb7UU0AXplZ.YC',1,'30756142','https://ui-avatars.com/api/?name=C&color=fff&background=35EA58&size=100','2024-05-08 22:13:23','2024-05-24 21:32:49',NULL,NULL),(127,'Sofia Alejandra','Gonzalez','Ramirez','sofia.gonzalez@example.com','$2a$10$FG4bGQKrruSjXu8wK3SMdeVME/tY6SkjKEq6SGsIKaHYoaod/fkYW',1,'49835671','https://ui-avatars.com/api/?name=S&color=fff&background=F33749&size=100','2024-05-08 22:13:25','2024-05-10 06:05:08',38,NULL),(128,'Andres Felipe','Gomez','Hernandez','andres.gomez@example.com','$2a$10$uSou3bj4TTXlFmgO47Wrq.xmB/sDnVdA90hp1IEepQrTPgtZrwj.y',1,'57689234','https://ui-avatars.com/api/?name=A&color=fff&background=4CFEC2&size=100','2024-05-08 22:13:28','2024-05-27 23:25:49',1,NULL),(129,'Camila Alejandra','Diaz','Alvarez','camila.diaz@example.com','$2a$10$i9JAVFnC/XsQ8m8K8cMnyO00/YugOiyBBdkIpQvtL0kvrXtR2fesS',1,'68921457','https://ui-avatars.com/api/?name=C&color=fff&background=25A8CB&size=100','2024-05-08 22:13:30','2024-05-25 22:03:18',NULL,NULL),(130,'Diego Alejandro','Torres','Sanchez','diego.torres@example.com','$2a$10$9tcxb1zyMfu7c8VN0ovHKuq2498xari9ExnHUaEj0w.Cu/Ne31XdC',1,'74189632','https://ui-avatars.com/api/?name=D&color=fff&background=46D06A&size=100','2024-05-08 22:13:33','2024-05-26 18:24:49',NULL,NULL),(131,'Ana Maria','Castro','Flores','ana.castro@example.com','$2a$10$SnQZM0Dh0rInGytZDmJgX.6eVDsrBf1yvVVddOhoIMY9RdJI4p2PK',1,'82354968','https://ui-avatars.com/api/?name=A&color=fff&background=91EA4F&size=100','2024-05-08 22:13:36','2024-05-26 18:24:24',1,NULL),(132,'Alejandro Jose','Rios','Romero','alejandro.rios@example.com','$2a$10$VWQJx48WDzzNysmxxllaC.Uf8QfjxchjAYF2AM/4KPfRDxblJ96b.',1,'93487125','https://ui-avatars.com/api/?name=A&color=fff&background=F28952&size=100','2024-05-08 22:13:38','2024-05-08 22:13:38',NULL,NULL),(133,'Lucia Gabriela','Moreno','Herrera','lucia.moreno@example.com','$2a$10$X03WHcUn2vcNrWQiCAMQQe93QiS7iMjA4sXyIzN1edYGZKvNRUUPu',1,'10543729','https://ui-avatars.com/api/?name=L&color=fff&background=5EAC5A&size=100','2024-05-08 22:13:42','2024-05-08 22:13:42',NULL,NULL),(134,'Mateo Andres','Jimenez','Munoz','mateo.jimenez@example.com','$2a$10$IXK3/gtmQ0PlwXY/H7lyp.lSDYROad1/62erGmoUIoI2uhNf1YRR.',1,'11679235','https://ui-avatars.com/api/?name=M&color=fff&background=B0AE6A&size=100','2024-05-08 22:13:44','2024-05-08 22:13:44',NULL,NULL),(135,'Valentina Sofia','Morales','Vargas','valentina.morales@example.com','$2a$10$b9sNnvgp9tdnASCmvQIqM.EYwoZLce.SZgA.4YFa4Rl5TR1U6lhZ6',1,'12235467','https://ui-avatars.com/api/?name=V&color=fff&background=08F426&size=100','2024-05-08 22:13:46','2024-05-08 22:13:46',NULL,NULL),(136,'Juan Pablo','Perez','Diaz','juan.perez@example.com','$2a$10$v4zUSTF/yKfxmM768BAoP.1rLIse.iQHT5peVyHxjH3f8zGrZl0M.',1,'13159084','https://ui-avatars.com/api/?name=J&color=fff&background=21D9C3&size=100','2024-05-08 22:13:49','2024-05-08 22:13:49',NULL,NULL),(137,'Sofia Maria','Fernandez','Suarez','sofia.fernandez@example.com','$2a$10$UV5UCYlqNbiVSsV78OVx.uNTpCGXbdp6uLe4PDwzy/uNKBJs5ViYK',1,'14325698','https://ui-avatars.com/api/?name=S&color=fff&background=561D83&size=100','2024-05-08 22:13:52','2024-05-08 22:13:52',NULL,NULL),(138,'Daniel Alejandro','Castro','Ruiz','daniel.castro@example.com','$2a$10$S2XBaRlCc7.VqAmLEqndl.itlR40Chprtrz9KkFd9bumZjBHv.Oda',1,'15789234','https://ui-avatars.com/api/?name=D&color=fff&background=B5033A&size=100','2024-05-08 22:13:54','2024-05-08 22:13:54',NULL,NULL),(139,'Carolina Andrea','Gonzalez','Aguilar','carolina.gonzalez@example.com','$2a$10$NnwwOveTXgUhJ3GgdvHzC.v.w5tD786hX.ZKQwpr/ALIt1PK0aQgG',1,'16834529','https://ui-avatars.com/api/?name=C&color=fff&background=23C8F2&size=100','2024-05-08 22:13:58','2024-05-08 22:13:58',NULL,NULL),(140,'Sebastian Andres','Gomez','Torres','sebastian.gomez@example.com','$2a$10$fAXZDT6aqZ5Uw61ldyd7LeJIDrrTEI13KRNT.5jbB05bWB9dZGQgW',1,'17298345','https://ui-avatars.com/api/?name=S&color=fff&background=CAEE62&size=100','2024-05-08 22:14:00','2024-05-24 04:52:07',NULL,NULL),(141,'Natalia Maria','Mendez','Castro','natalia.mendez@example.com','$2a$10$7SpymwSKm8PU1gEH.oU2nOsTYN/84g71rcJlDol5vr6y.ryKmlNau',1,'18462735','https://ui-avatars.com/api/?name=N&color=fff&background=F78155&size=100','2024-05-08 22:14:03','2024-05-08 22:14:03',NULL,NULL),(142,'Santiago Andres','Rivera','Silva','santiago.rivera@example.com','$2a$10$a/IuHuat1HQXZ4gRq0RI2O7T9F52HYgAzYPS/pDKDnRlpeowE4kRm',1,'19782456','https://ui-avatars.com/api/?name=S&color=fff&background=790682&size=100','2024-05-08 22:14:06','2024-05-08 22:14:06',NULL,NULL),(143,'Mariana Alejandra','Salazar','Gonzalez','mariana.salazar@example.com','$2a$10$tUO1PHcaniPCFyTjwdiiHu9pwC6UtKaxIlyxl3fTwOREl4iZ7yjjm',1,'20195483','https://ui-avatars.com/api/?name=M&color=fff&background=18C4BC&size=100','2024-05-08 22:14:08','2024-05-08 22:14:08',NULL,NULL),(144,'Martin Alejandro','Vazquez','Lopez','martin.vazquez@example.com','$2a$10$jkQZs828yHXXeqczzlCbcOksvmA1/ZqHu1Xr8wi4tPiATOCr2bhWG',1,'21937854','https://ui-avatars.com/api/?name=M&color=fff&background=2ED363&size=100','2024-05-08 22:14:11','2024-05-08 22:14:11',NULL,NULL),(145,'Valeria Sofia','Castro','Perez','valeria.castro@example.com','$2a$10$nF8NeQE/X69fNW8Nb3H6.OMpG0rjMvfMwRiK3ztslaXqVB3iuEvGG',1,'22148736','https://ui-avatars.com/api/?name=V&color=fff&background=FE5058&size=100','2024-05-08 22:14:13','2024-05-08 22:14:13',NULL,NULL),(146,'Andres Felipe','Alvarez','Martinez','andres.alvarez@example.com','$2a$10$IRFuJpopHkzZtFDpO.YbleirJmZKug4P.wIZx6iUCNanwFECDfS1S',1,'23367189','https://ui-avatars.com/api/?name=A&color=fff&background=D5E441&size=100','2024-05-08 22:14:16','2024-05-08 22:14:16',NULL,NULL),(147,'Daniela Maria','Chavez','Gonzalez','daniela.chavez@example.com','$2a$10$GGWGdJBlVB0MlPCI78eto.FllQDuMVRHXDG4ivuo7J13M9I6RdkWG',1,'24678931','https://ui-avatars.com/api/?name=D&color=fff&background=504526&size=100','2024-05-08 22:14:19','2024-05-08 22:14:19',NULL,NULL),(148,'Nicolas Alejandro','Romero','Diaz','nicolas.romero@example.com','$2a$10$fp9ypjqbYmb9Km9qyD64H.M/O.IR/S2VyMMZadSQFmxWZCMPk.Vau',1,'25146897','https://ui-avatars.com/api/?name=N&color=fff&background=5F5415&size=100','2024-05-08 22:14:22','2024-05-08 22:14:22',NULL,NULL),(149,'Sofia Andrea','Herrera','Ramirez','sofia.herrera@example.com','$2a$10$U/fhDr5rUce6M7iVudJVu.HZgcykFzl5KxXqAqJ8Il12M6QfRQZsS',1,'26789412','https://ui-avatars.com/api/?name=S&color=fff&background=D692BD&size=100','2024-05-08 22:14:25','2024-05-08 22:14:25',NULL,NULL),(150,'Alejandro Daniel','Mendoza','Alvarez','alejandro.mendoza@example.com','$2a$10$nGEGXgNvau8P8HkB/2uAUeszfxRZlHivRg3VbikTjduz//Rn6r60m',1,'27256398','https://ui-avatars.com/api/?name=A&color=fff&background=0F7A17&size=100','2024-05-08 22:14:27','2024-05-08 22:14:27',NULL,NULL),(151,'Maria Camila','Torres','Martinez','maria.torres@example.com','$2a$10$0PavMpqG95Cl.9kxB5F/veK3Sl5pv4sNHDUg2ugFK0mO7sKEAgTsO',1,'28963571','https://ui-avatars.com/api/?name=M&color=fff&background=BAFFE9&size=100','2024-05-08 22:14:30','2024-05-08 22:14:30',NULL,NULL),(152,'Javier Andres','Fernandez','Gonzalez','javier.fernandez@example.com','$2a$10$C1QW/klgnaNJLjw.d9M.2.1kfhGKZBe1R0vcU/CYdcEadGoV3wxNe',1,'29631584','https://ui-avatars.com/api/?name=J&color=fff&background=2173E2&size=100','2024-05-08 22:14:35','2024-05-08 22:14:35',NULL,NULL),(153,'Laura Sofia','Gomez','Morales','laura.gomez@example.com','$2a$10$JoRUAZdTgATniplEvfM2MuzQIXS8eKa6fzd2OFNyEf3ap09FRxWIe',1,'30345876','https://ui-avatars.com/api/?name=L&color=fff&background=D0ADE2&size=100','2024-05-08 22:14:37','2024-05-08 22:14:37',NULL,NULL),(154,'Diego Esteban','Perez','Lopez','diego.perez@example.com','$2a$10$R42jNJw.ecM7GBZWwbuF2./rvDVjlQUc9kmGh/.chJZkDI1.0SLr6',0,'31758246','https://ui-avatars.com/api/?name=D&color=fff&background=F1FC30&size=100','2024-05-08 22:14:40','2024-05-24 21:32:49',NULL,16),(155,'Sara Valentina','Castro','Ruiz','sara.castro@example.com','$2a$10$htsz07lk5cSImSn8U92X4uJLwTiiPZFHnLkeh/7xYGgBOyVxeUvQS',1,'32246781','https://ui-avatars.com/api/?name=S&color=fff&background=FF49BC&size=100','2024-05-08 22:14:43','2024-05-08 22:14:43',NULL,NULL),(156,'Juan David','Ramirez','Gonzalez','juan.ramirez@example.com','$2a$10$zZ05Hpu4JyhVO8ZWxMC/A.1ZyubaT/Yq3I2I8kidYbiw.Ugcr4bUK',1,'33567892','https://ui-avatars.com/api/?name=J&color=fff&background=2E3D6C&size=100','2024-05-08 22:14:46','2024-05-08 22:14:46',NULL,NULL),(157,'Maria Jose','Suarez','Castro','maria.suarez@example.com','$2a$10$ABh0aIE1i/rdqvs5boI5Uu4gOqS7MllYa/HsJy6TRPvBITxYf3uR2',1,'34129786','https://ui-avatars.com/api/?name=M&color=fff&background=F39B77&size=100','2024-05-08 22:14:49','2024-05-08 22:14:49',NULL,NULL),(158,'Tomas Alejandro','Guerrero','Mendez','tomas.guerrero@example.com','$2a$10$fGJ8eNsKfcuQCTZRYeBnwO.pJtwtpULqDfTq2E2duqRvck.tJzjFy',1,'35984621','https://ui-avatars.com/api/?name=T&color=fff&background=A66D8F&size=100','2024-05-08 22:14:52','2024-05-08 22:14:52',NULL,NULL),(159,'Ana Sofia','Hernandez','Lopez','ana.hernandez@example.com','$2a$10$7JOUzfK0D2Z9W1pdFXua4O4OlaBTtuvObG./2Kq9ydZ0WVHBUK0Pe',1,'36412897','https://ui-avatars.com/api/?name=A&color=fff&background=C3AE42&size=100','2024-05-08 22:14:56','2024-05-08 22:14:56',NULL,NULL),(160,'Samuel Andres','Castro','Torres','samuel.castro@example.com','$2a$10$LO8dewttU96TXmqWImR27uSdd7wvXmcOt13Q/N0hASiL94nqIorsq',1,'37894126','https://ui-avatars.com/api/?name=S&color=fff&background=37E291&size=100','2024-05-08 22:14:58','2024-05-08 22:14:58',NULL,NULL),(161,'Valentina Maria','Molina','Silva','valentina.molina@example.com','$2a$10$xkrK6DEtVchWgqxvhwMKxOrMcvg0tMs.curBWSU23EtTip8L8Ur7q',1,'38569124','https://ui-avatars.com/api/?name=V&color=fff&background=F95485&size=100','2024-05-08 22:15:01','2024-05-08 22:15:01',NULL,NULL),(162,'Julian Alejandro','Soto','Perez','julian.soto@example.com','$2a$10$vGxUD0J3UqUVqMa2md/pve4KtxejzN71TzJophaDsmsrV7HGuM5NG',1,'39875416','https://ui-avatars.com/api/?name=J&color=fff&background=DB2018&size=100','2024-05-08 22:15:04','2024-05-08 22:15:04',NULL,NULL),(163,'Andrea Sofia','Ramos','Gonzalez','andrea.ramos@example.com','$2a$10$jR7tSVrXK04sed7zLafuyORmxTLvO3JgwcUlVVCOR2XWmoX0axQpq',1,'40671583','https://ui-avatars.com/api/?name=A&color=fff&background=44241A&size=100','2024-05-08 22:15:06','2024-05-08 22:15:06',NULL,NULL),(164,'Carlos Alberto','Reyes','Alvarez','carlos.reyes@example.com','$2a$10$Emmr4AxHaP01HxZMAXwpN.1eTNy823UOuRg6FkzKbuKDzZbOiTkOa',1,'41385627','https://ui-avatars.com/api/?name=C&color=fff&background=457340&size=100','2024-05-08 22:15:10','2024-05-08 22:15:10',NULL,NULL),(165,'Maria Paula','Castro','Diaz','maria.castro@example.com','$2a$10$WWUaMajdK6jry15nkCbAKO94R3Bo0FoBmBnbujZ/gM0p7yZGw4VAe',1,'42738951','https://ui-avatars.com/api/?name=M&color=fff&background=9A392E&size=100','2024-05-08 22:15:12','2024-05-08 22:15:12',NULL,NULL),(166,'Lucas Alejandro','Torres','Ruiz','lucas.torres@example.com','$2a$10$P0SdmR9PWC5S8gQ/8Mjz/OoCrtkRM1wyKpTO.webCUFUelsiMQdNO',1,'43157892','https://ui-avatars.com/api/?name=L&color=fff&background=1149DE&size=100','2024-05-08 22:15:14','2024-05-08 22:15:14',NULL,NULL),(167,'Isabella Sofia','Chavez','Hernandez','isabella.chavez@example.com','$2a$10$dIMbJyMUsRBq62sr0/YRc.TiQ95IM2Y3noaqgDcFZtwgpsvT..s5S',1,'44567123','https://ui-avatars.com/api/?name=I&color=fff&background=5AC3B2&size=100','2024-05-08 22:15:18','2024-05-08 22:15:18',NULL,NULL),(168,'Santiago Andres','Fernandez','Ramirez','santiago.fernandez@example.com','$2a$10$1qTPeWJGDysHXIes8T5/UONFg7zmEpgH.1EnCEm62xAklAFUMiIyO',1,'45213987','https://ui-avatars.com/api/?name=S&color=fff&background=69C7A0&size=100','2024-05-08 22:15:21','2024-05-08 22:15:21',NULL,NULL),(169,'Sofia Gabriela','Castro','Gonzalez','sofia.castro@example.com','$2a$10$H/YQw34cPJ4TbbuAbTJWguJW0t/0sTSjAFMPLLxURe.Q4AtwAtwCi',1,'46489132','https://ui-avatars.com/api/?name=S&color=fff&background=386881&size=100','2024-05-08 22:15:24','2024-05-08 22:15:24',NULL,NULL),(170,'Alejandro David','Moreno','Perez','alejandro.moreno@example.com','$2a$10$Zm8abtHP5DTkl8cncOrmBO1UftKsC9MQ4BK10dZCMs6BGY1x5AwNq',1,'47921365','https://ui-avatars.com/api/?name=A&color=fff&background=5D0276&size=100','2024-05-08 22:15:26','2024-05-08 22:15:26',NULL,NULL),(171,'Maria Alejandra','Ortiz','Silva','maria.ortiz@example.com','$2a$10$r6M5FKTGZTRk44BEixH7qew.zfBdXANVA7XLv6SsXCvpoaI2F13I2',1,'48736129','https://ui-avatars.com/api/?name=M&color=fff&background=79037F&size=100','2024-05-08 22:15:29','2024-05-08 22:15:29',NULL,NULL),(172,'Nicolas Santiago','Garcia','Torres','nicolas.garcia@example.com','$2a$10$L2VYr78MfMeseoQ62MZP1.6ihP.KbgbPwpt/AEt1y8ZnPnYB81aIi',1,'49562873','https://ui-avatars.com/api/?name=N&color=fff&background=04F365&size=100','2024-05-08 22:15:32','2024-05-08 22:15:32',NULL,NULL),(173,'Laura Valentina','Castro','Lopez','laura.castro@example.com','$2a$10$OYBbBYbsFJHl7vVZ5MLDKOfK56/wA3fA5WAMgyD5mSCJi1aw.es5i',1,'50389627','https://ui-avatars.com/api/?name=L&color=fff&background=5D6443&size=100','2024-05-08 22:15:34','2024-05-08 22:15:34',NULL,NULL),(174,'Roberto','Rodas','Contreras','rober.rodas@puke.com','$2a$10$2yGvniWBoy235sWTMTcRfOmYSXjyJSutvyR7vsqsnXDQB2OO7udW.',1,'20170101','https://ui-avatars.com/api/?name=R&color=fff&background=D5BD7A&size=100','2024-05-08 22:27:06','2024-05-08 22:27:06',NULL,NULL),(175,'Luis','Beltran','Bonifacio','luisbeltran@gmail.com','$2a$10$a/a2TTEUl5sISZr/pG7OC..yxy03ZGxjU2BDXGOMe9UZcbElO1CBS',1,'20024674','https://ui-avatars.com/api/?name=L&color=fff&background=99A06E&size=100','2024-05-09 02:21:15','2024-05-24 05:14:45',NULL,NULL),(176,'Maria','Suarez','Olazabal','maria@gmail.com','$2a$10$GPBzDvA/vKs0j5VeGc13z.Q0TA2sG40s5NawjBHuVZb0bRNUWfB7i',1,'19997894','https://ui-avatars.com/api/?name=M&color=fff&background=4D9B82&size=100','2024-05-09 02:26:22','2024-05-09 02:26:22',NULL,NULL),(178,'Aurelio Roger','Chavez','Panduro','aurelio.chavez@pucp.edu.pe','$2a$10$cn8e0WTuwKxzW6vDuQ81C.615VUvumwWQfeMycONc15D9MCu40ND2',1,'20151382','https://ui-avatars.com/api/?name=A&color=fff&background=86D744&size=100','2024-05-09 05:20:36','2024-05-23 21:37:26',NULL,NULL),(180,'Albertos Renato','Castillo','Alarcon','albertod.castillo@pucp.edu.pe','$2a$10$Tz0QNkHPr4rWw6ELkj4y8eaVJPfE727XtTx6FoJNesqUTYIS21VcW',1,'20501280','https://ui-avatars.com/api/?name=A&color=fff&background=0A6F85&size=100','2024-05-09 10:46:51','2024-05-09 10:46:51',NULL,NULL),(181,'Ricardo Alejandro','Moreno','Cercado','43598726@pucp.edu.pe','$2a$10$we5INDi1YAimO7v6iu056OJYdCmcK4a96GqZTJ6wxpZgao1HLzgM2',1,'43598726','https://ui-avatars.com/api/?name=R&color=fff&background=01C3C7&size=100','2024-05-09 15:12:20','2024-05-09 15:12:20',NULL,NULL),(182,'Juan Alberto','Castillo','Paz','juan.paz123@pucp.edu.pe','$2a$10$vVJdBQvGn6SxRUENknKJrumao2/wSwrwjYVCjeE/BkXHA1U2/Q00m',1,'20181230','https://ui-avatars.com/api/?name=J&color=fff&background=7A0F24&size=100','2024-05-09 15:27:00','2024-05-26 17:21:41',1,29),(183,'Renato Daniel','Delgado','Paz','renato.delgado@pucp.edu.pe','$2a$10$PNBXTdCnxX/fgymC1tjVHeBnG5MMEuhmaE0iN2J636p07F4toqXra',1,'20231517','https://ui-avatars.com/api/?name=R&color=fff&background=0F7361&size=100','2024-05-09 15:35:24','2024-05-24 21:32:49',NULL,30),(185,'Claudia Daniela','Aquino','Taipe','claudia.aquino@pucp.edu.pe','$2a$10$0zVsQiEPJ2pwoY3/THnaIOivYG3CPm7V/LWm1benrII3s8hn3O5u.',1,'20241590','https://ui-avatars.com/api/?name=C&color=fff&background=271814&size=100','2024-05-09 15:43:47','2024-05-24 21:32:49',NULL,NULL),(186,'Ana Maria ','Ruiz','Vega','ana.maria@pucp.edu.pe','$2a$10$BrRdYq6uy1Oc98eqouzYBOnekSEGp6bvOE906229k7j0mlEAfy4By',1,'20201515','https://ui-avatars.com/api/?name=A&color=fff&background=114869&size=100','2024-05-09 15:51:10','2024-05-24 21:32:49',NULL,NULL),(187,'Juan Manuel','Fernandez','Garcia','juan.fernandez@example.com','$2a$10$LoVppWDhk.V7eIsMoR7gw.yWoa2bY9omCdEXou8dPxnfZQ2zCdrrW',1,'51238796','https://ui-avatars.com/api/?name=J&color=fff&background=5C8FF3&size=100','2024-05-09 16:01:12','2024-05-09 16:01:12',NULL,NULL),(188,'Maria Alejandra','Gutierrez','Martinez','maria.gutierrez@example.com','$2a$10$1t.gsY5WjWVogSHP2z6IwuEFy9pscVLPOyKBeh/lFjRdof0OotY2S',1,'52986473','https://ui-avatars.com/api/?name=M&color=fff&background=297ABC&size=100','2024-05-09 16:01:15','2024-05-09 16:01:15',NULL,NULL),(189,'Diego Alejandro','Diaz','Fernandez','diego.diaz@example.com','$2a$10$FC9/lyxgrojE193Y1fJnZOVIXo/YhR5Et5oQYN/grZUShBVuTxAcq',1,'53467291','https://ui-avatars.com/api/?name=D&color=fff&background=62E75A&size=100','2024-05-09 16:01:19','2024-05-09 16:01:19',NULL,NULL),(190,'Camila Andrea','Sanchez','Lopez','camila.sanchez@example.com','$2a$10$uG0jALukg4ItMwRI1VtJ5OwMrqzGEsHJWtbjYXCJ/Q76pXJlLcxEe',1,'54891726','https://ui-avatars.com/api/?name=C&color=fff&background=C08D22&size=100','2024-05-09 16:01:24','2024-05-09 16:01:24',NULL,NULL),(191,'Andres Felipe','Castillo','Perez','andres.castillo@example.com','$2a$10$7PHik2aAJV3AYSi6DhYzeOZEarMz9ubj4ENLUc26Y9z/66ioRmhM.',1,'55189234','https://ui-avatars.com/api/?name=A&color=fff&background=F89286&size=100','2024-05-09 16:01:29','2024-05-25 22:56:17',NULL,NULL),(192,'Valentina Sofia','Ramirez','Gonzalez','valentina.ramirez@example.com','$2a$10$bGxKw64PNY76dCkqz9uGxugLR8GoOImsSKSpvY4YKOJujx.we2tFu',1,'56329817','https://ui-avatars.com/api/?name=V&color=fff&background=7D8E9F&size=100','2024-05-09 16:01:33','2024-05-09 16:01:33',NULL,NULL),(193,'Carlos Eduardo','Mendez','Hernandez','carlos.mendez@example.com','$2a$10$qBIbxJ4LMrfUFwYVNay5r.FQkNwHQxYZugkD16O4u64pkVcqPaQei',1,'57743129','https://ui-avatars.com/api/?name=C&color=fff&background=A0E10A&size=100','2024-05-09 16:01:39','2024-05-09 16:01:39',NULL,NULL),(194,'Sofia Gabriela','Jimenez','Silva','sofia.jimenez@example.com','$2a$10$3OROgYD4TCB5nY69JcDBPeHSSjjRtSAAWlLeXK6vdUKPMfAFCWVp6',1,'58673192','https://ui-avatars.com/api/?name=S&color=fff&background=0738D0&size=100','2024-05-09 16:01:46','2024-05-09 16:01:46',NULL,NULL),(195,'Alejandro Jose','Perez','Alvarez','alejandro.perez@example.com','$2a$10$ugkPhi0nskPfdPTtpqBo4eM9wtvsHfvNCLR1jqxgYRQlRIbVS5dZa',1,'59137642','https://ui-avatars.com/api/?name=A&color=fff&background=BD5CEA&size=100','2024-05-09 16:01:50','2024-05-09 16:01:50',NULL,NULL),(196,'Lucia Maria','Torres','Garcia','lucia.torres@example.com','$2a$10$K9/UJszWspuO6i5ZM16TLOCisifTEnnp7Z4umbgcDgj7MU.RzFfz2',1,'60238974','https://ui-avatars.com/api/?name=L&color=fff&background=4740B5&size=100','2024-05-09 16:01:55','2024-05-09 16:01:55',NULL,NULL),(197,'Mateo Andres','Ruiz','Martinez','mateo.ruiz@example.com','$2a$10$9w2fnydeSynakGGi5GJgrOqN8XgJxJUpHcEW.kq/o1f6tBNx.daV2',1,'61384729','https://ui-avatars.com/api/?name=M&color=fff&background=502A09&size=100','2024-05-09 16:02:00','2024-05-09 16:02:00',NULL,NULL),(198,'Maria Fernanda','Morales','Rodriguez','maria.morales@example.com','$2a$10$aKoUOA4/2Y8p/lELS.JcK.IN4xqiWR1dIFj7TgjQpSkzhgx772AM.',1,'62795413','https://ui-avatars.com/api/?name=M&color=fff&background=210294&size=100','2024-05-09 16:02:04','2024-05-09 16:02:04',NULL,NULL),(199,'Daniel Alejandro','Gomez','Sanchez','daniel.gomez@example.com','$2a$10$Xupr.N6sJ4GvrNOxd6R7te8S1kmYG4Oe.7/.PHTjEUMCGHYE8hHRu',1,'63129854','https://ui-avatars.com/api/?name=D&color=fff&background=1FEB81&size=100','2024-05-09 16:02:07','2024-05-09 16:02:07',NULL,NULL),(200,'Carolina Andrea','Castro','Lopez','carolina.castro@example.com','$2a$10$ju2H2aNJxV18toFHeOGg2efOmY.bdEEnKNqgM8XsBky1/h9.8WlTi',1,'64528139','https://ui-avatars.com/api/?name=C&color=fff&background=8348AE&size=100','2024-05-09 16:02:11','2024-05-09 16:02:11',NULL,NULL),(201,'Sebastian Andres','Perez','Gonzalez','sebastian.perez@example.com','$2a$10$GREINEOz0OEQ/Wo8FgKncuQrPHiAfmoFFLUYaNcIZkutA6tAxRWZi',1,'65273981','https://ui-avatars.com/api/?name=S&color=fff&background=35EA23&size=100','2024-05-09 16:02:16','2024-05-09 16:02:16',NULL,NULL),(202,'Natalia Maria','Hernandez','Diaz','natalia.hernandez@example.com','$2a$10$ZOz.JMaE0Q7yXULR0etDxOqFBPhNm8nnnl4fvTI7H6vhDhOu1dAUS',1,'66749238','https://ui-avatars.com/api/?name=N&color=fff&background=C4863E&size=100','2024-05-09 16:02:19','2024-05-09 16:02:19',NULL,NULL),(203,'Santiago Andres','Vargas','Silva','santiago.vargas@example.com','$2a$10$RVT9bVqcFVTFnPR6Z4iFYOrOTg2JGjZ700Y1L3xHUGm0DPbkW/..6',1,'67895432','https://ui-avatars.com/api/?name=S&color=fff&background=09FAB4&size=100','2024-05-09 16:02:22','2024-05-09 16:02:22',NULL,NULL),(204,'Mariana Alejandra','Castro','Alvarez','mariana.castro@example.com','$2a$10$H1MkGF2N/3qDSf.xAet/dO7E5PaLvlaTzdWZLikmf1F..XO5QjESy',1,'68927345','https://ui-avatars.com/api/?name=M&color=fff&background=390FB6&size=100','2024-05-09 16:02:30','2024-05-09 16:02:30',NULL,NULL),(205,'Martin Alejandro','Ruiz','Perez','martin.ruiz@example.com','$2a$10$K3DXd.nyZVAY1Wc5RMDoJOfaxu3aDh.a0jj8Akt.GGUt.e6fWxJRa',1,'69123457','https://ui-avatars.com/api/?name=M&color=fff&background=A115BD&size=100','2024-05-09 16:02:34','2024-05-09 16:02:34',NULL,NULL),(206,'Valeria Sofia','Morales','Martinez','valeria.morales@example.com','$2a$10$RpUVsfCTjSnHYaBRECHhHelF8zaALFGTZGd9AYxvFcFnkyfxnIuvK',1,'70784692','https://ui-avatars.com/api/?name=V&color=fff&background=F65686&size=100','2024-05-09 16:02:39','2024-05-09 16:02:39',NULL,NULL),(207,'Andres Felipe','Garcia','Fernandez','andres.garcia@example.com','$2a$10$zIVxEZITqvgoxkidYsy.0uCc2fkSXY/nYWm2IyGzuKwLYAXHXNkU.',1,'71439825','https://ui-avatars.com/api/?name=A&color=fff&background=8AAD14&size=100','2024-05-09 16:02:42','2024-05-09 16:02:42',NULL,NULL),(208,'Daniela Maria','Perez','Gutierrez','daniela.perez@example.com','$2a$10$F5V7OYTjnsRsiPMLanj/MONL/V5mhczIxzBtEtWAdr6IcpWlu./em',1,'72346589','https://ui-avatars.com/api/?name=D&color=fff&background=8956F9&size=100','2024-05-09 16:02:45','2024-05-09 16:02:45',NULL,NULL),(209,'Nicolas Alejandro','Diaz','Lopez','nicolas.diaz@example.com','$2a$10$FUCpRAp5LoYcCT.7/1Lbj.JZ7IQZEBMz/d9sIKT0.ZaseUTRZ9eXe',1,'73619824','https://ui-avatars.com/api/?name=N&color=fff&background=6A806D&size=100','2024-05-09 16:02:48','2024-05-09 16:02:48',NULL,NULL),(210,'Sofia Andrea','Rodriguez','Silva','sofia.rodriguez@example.com','$2a$10$9Zvr6HA6/vN8ZI1ivFB0Y.ITOO8B67eOZtOzLvenFW79oAFKaAMf6',1,'74963281','https://ui-avatars.com/api/?name=S&color=fff&background=099654&size=100','2024-05-09 16:02:52','2024-05-09 16:02:52',NULL,NULL),(211,'Alejandro Daniel','Sanchez','Perez','alejandro.sanchez@example.com','$2a$10$L8VsmuXfU52CR23P76YQXeyAIh8rpy2daW4WQ/HES/V8UKNg8uOfq',1,'75219824','https://ui-avatars.com/api/?name=A&color=fff&background=529524&size=100','2024-05-09 16:02:55','2024-05-25 21:03:37',60,NULL),(212,'Maria Camila','Hernandez','Gonzalez','maria.hernandez@example.com','$2a$10$MBjF3bEaz4ZLOAXRUg95JeGA0YAqg2901eLG0I265LuhZdCDfvWRe',1,'76198523','https://ui-avatars.com/api/?name=M&color=fff&background=F2632B&size=100','2024-05-09 16:02:59','2024-05-09 16:02:59',NULL,NULL),(213,'Javier Andres','Ramirez','Martinez','javier.ramirez@example.com','$2a$10$LxwW6r6ii/wKtqkm0UWqe.r9rdvjKS.LUHUJFH9fbADSlv/rAofUe',1,'77423986','https://ui-avatars.com/api/?name=J&color=fff&background=7CF4C7&size=100','2024-05-09 16:03:04','2024-05-09 16:03:04',NULL,NULL),(214,'Laura Sofia','Fernandez','Castro','laura.fernandez@example.com','$2a$10$gExTiLv8bnoSBqhSYykJtOKKyv8nPnxKU2mNkbab/cUOp9bfqf.wG',1,'78134962','https://ui-avatars.com/api/?name=L&color=fff&background=12545B&size=100','2024-05-09 16:03:07','2024-05-09 16:03:07',NULL,NULL),(215,'Diego Esteban','Lopez','Fernandez','diego.lopez@example.com','$2a$10$qKhP/hp4R.ZZzZHqWXqmE.Dn/yp8jif2RkevnQUCK6hxTXG9Li6Ne',1,'79846521','https://ui-avatars.com/api/?name=D&color=fff&background=A8B029&size=100','2024-05-09 16:03:10','2024-05-10 01:56:18',NULL,NULL),(216,'Sara Valentina','Alvarez','Silva','sara.alvarez@example.com','$2a$10$/QJWYu3pQ8P0w5irtHvFQOKHIcJog2JZmMnIsB6vreUFvQANunS/u',1,'80456132','https://ui-avatars.com/api/?name=S&color=fff&background=57E86B&size=100','2024-05-09 16:03:13','2024-05-09 16:03:13',NULL,NULL),(217,'Juan David','Ruiz','Diaz','juan.ruiz@example.com','$2a$10$r1bcJEdBxanSJCSYwkCVJ.T/.B0Xnef3Maodo/zsoLAwSXOzEXVHq',1,'81642793','https://ui-avatars.com/api/?name=J&color=fff&background=2C4976&size=100','2024-05-09 16:03:16','2024-05-10 23:46:12',NULL,NULL),(218,'Maria','Gomez','Perez','maria.gomez@example.com','$2a$10$/08C.hAnTWAn74BJkrttzOWrEOpIf9uMjhfwiaLe8A0/5UkLEdO26',0,'82361549','https://ui-avatars.com/api/?name=M&color=fff&background=9B6D3A&size=100','2024-05-09 16:03:19','2024-05-24 21:32:49',NULL,NULL),(219,'Alan Roberto ','Paucar','Delgado','alan@pucp.edu.pe','$2a$10$c3cMcU3bARFO7o59Q9SVGOSdBUbONaWQro9rfuhqpW4gY5Dv5YUoy',1,'20151919','https://ui-avatars.com/api/?name=A&color=fff&background=8AF311&size=100','2024-05-09 16:07:00','2024-05-23 22:03:20',NULL,42),(220,'Oscar Rodrigo ','Perez','Canez','alberto.perez@pucp.edu.pe','$2a$10$/Iw6gVLOOkNd/GYS6LU1XuoCGmL88tIOXkpp282EYdNJDyO9ebZuu',1,'19992541','https://ui-avatars.com/api/?name=O&color=fff&background=7F672C&size=100','2024-05-09 16:44:42','2024-05-23 22:03:20',NULL,NULL),(221,'Juan Alberto','Castillo','Paz','sdsdsdfsdf@pucp.edu.pe','$2a$10$HDsVEhYXNAbJkZbO4E7wCeg/vXUuGWa7a3cOAc3N2y/JGcBAHWyf6',1,'25465198','https://ui-avatars.com/api/?name=J&color=fff&background=782851&size=100','2024-05-09 16:53:31','2024-05-24 21:32:49',NULL,NULL),(230,'José','Castañeda','Erasmo','78459851@pucp.edu.pe','$2a$10$V.hSMgAYVtxS6ive9wbxe.5M7I6bhBE68K4Fo6rqbtSowEOSw26F6',0,'78459851','https://ui-avatars.com/api/?name=J&color=fff&background=6284C7&size=100','2024-05-09 20:09:33','2024-05-25 00:16:26',NULL,NULL),(231,'Antonio Luis','Delgado','Cercado','43287637@pucp.edu.pe','$2a$10$C3O5WKYm67./7RgU6pUOVu0Vk9WOlGYQm.eNqndc32iExq21TKcLK',1,'43287637','https://ui-avatars.com/api/?name=J&color=fff&background=1DA7CF&size=100','2024-05-09 20:10:45','2024-05-19 19:40:07',60,NULL),(232,'Maria Camila ','Baldeon','Cruz','camila.baldeon@pucp.edu.pe','$2a$10$Fotq4cGavJN6oHQNoQZxFeMqNf7kAHxPtirJjYW9ied9SDCSXWoJ.',1,'20141378','https://ui-avatars.com/api/?name=M&color=fff&background=34E522&size=100','2024-05-09 20:27:11','2024-05-23 22:03:20',NULL,56),(233,'Ana Camila ','Gamarra','Soto','ana.soto@pucp.edu.pe','$2a$10$p3A6V0Xn3M8q3OxcBDMdIuW.zVxMnndxajpBrHNskc15XzugdCwai',1,'20121289','https://ui-avatars.com/api/?name=A&color=fff&background=40FE23&size=100','2024-05-09 20:43:52','2024-05-23 22:03:20',NULL,NULL),(234,'Alejandra Sofia','Soto','Egoavil','ale.soto@pucp.edu.pe','$2a$10$QUt2SV.bCId8urH/GlmoHe7Af9qyIAsdPNux168QJ7qZJlxmowjTy',1,'20212121','https://ui-avatars.com/api/?name=A&color=fff&background=739125&size=100','2024-05-09 22:15:57','2024-05-09 22:15:57',NULL,NULL),(237,'Branny','Pena','Alejandro','a20200750@pucp.edu.pe','$2a$10$OknEPWiGnksyR7j.3UJATOt.DdYWYCOlWSqe87mcl3X9zFFc162W.',1,'20200750','https://ui-avatars.com/api/?name=B&color=fff&background=0FA21D&size=100','2024-05-09 23:48:07','2024-05-09 23:48:07',NULL,NULL),(239,'Humberto Abhram','Gamarra','Maldonado','hgamarra@pucp.edu.pe','$2a$10$7Nz2BYHB./hvg6y5fJKAlOqxGoK8WGiKnizDyNdh3ehWfJNeZrS9u',1,'20191369','https://ui-avatars.com/api/?name=H&color=fff&background=0AC0B0&size=100','2024-05-10 00:35:39','2024-05-10 00:35:39',NULL,NULL),(243,'Victor','Meza','Sarmiento','32165498@pucp.edu.pe','$2a$10$Ynk3V498MjHnLqrtkLAW1e.79VRS8MbSDKHHQysD85tiI8z8y.u9O',1,'32165498','https://ui-avatars.com/api/?name=V&color=fff&background=76B52E&size=100','2024-05-10 01:49:31','2024-05-19 07:43:53',39,14),(244,'Alexandra','Quintero','Fernandez','54648451@pucp.edu.pe','$2a$10$Gtyzl/jn1CHbTgFfUbDKN.oLC/V/x.U2wYg5wcdFKKJ2qGaxvMAhK',1,'54648451','https://ui-avatars.com/api/?name=S&color=fff&background=D2C278&size=100','2024-05-10 02:23:04','2024-05-30 04:40:25',NULL,NULL),(245,'Marcos','Jara','Melgarejo','65487457@pucp.edu.pe','$2a$10$kErVJn6thZbc6R9IykvzWe75eN1d56LwsZQ3bpIhsBclGVjxq2zti',1,'65487457','https://ui-avatars.com/api/?name=M&color=fff&background=6EC043&size=100','2024-05-10 02:24:37','2024-05-10 02:24:51',NULL,NULL),(246,'Miguel Angel','Palermo','Perez','481153@pucp.edu.pe','$2a$10$de5yEOJkWBrwqN8m.e4JBew.mWBiJbY67fyjhUA5ZDpKQJ499nbsO',1,'48115325','https://ui-avatars.com/api/?name=M&color=fff&background=288DEA&size=100','2024-05-10 02:38:15','2024-05-29 01:22:41',NULL,NULL),(247,'Jose','Salas','Quintero','31649746@pucp.edu.pe','$2a$10$gN3gWwrWYPuY5OFWQpL6N.oTNbkcb1mBr/CawKGA3Y1hZkUD1P0oy',1,'31649744','https://ui-avatars.com/api/?name=J&color=fff&background=280946&size=100','2024-05-10 02:48:23','2024-05-23 22:03:20',NULL,NULL),(248,'Julio Guillermo','Delgado','Cercado','23532354@pucp.edu.pe','$2a$10$BWu02AhGs/dBuAsLWOGls.HYidc6XPlym.mGTgh1wSBdzSHPcSkPu',1,'23532354','https://ui-avatars.com/api/?name=J&color=fff&background=8A75C7&size=100','2024-05-10 03:00:03','2024-05-19 23:49:28',NULL,NULL),(249,'Cristiana','Salas','Paz','09812356@pucp.edu.pe','$2a$10$QrUjmOaUuoFmlBjyrlQop.Kesbm0cALX3mMqZgJsN3jLSyIyTxj4O',0,'09812356','https://ui-avatars.com/api/?name=J&color=fff&background=5CAD0E&size=100','2024-05-10 03:01:12','2024-05-24 21:32:49',NULL,NULL),(251,'Alex','Pan','Li','alexpanli5@gmail.com','$2a$10$HGfQ/ZLSTXtYv.c5BTpha.BcBujCOSSB9FVNW1gbbTLac1uTrx1ze',0,'19992018','https://ui-avatars.com/api/?name=A&color=fff&background=DE2DE8&size=100','2024-05-10 03:10:03','2024-05-10 23:46:52',NULL,NULL),(253,'Carlos','Villena','Carrion','64978445@pucp.edu.pe','$2a$10$pyor4V.Swyux6jbYCjBH.Oq4dU5Y1.y.e7U3BJo9UddX8nvmacR4m',1,'64978445','https://ui-avatars.com/api/?name=C&color=fff&background=A153BE&size=100','2024-05-10 04:47:16','2024-05-29 01:22:41',NULL,NULL),(254,'Julio Guillermo','Delgado','Cercado','12345678@gmail.com','$2a$10$IomAeXMC0PFImeRfW1TQgONRDW29DQ/PPw.9giq4uh09DSdWPh/2q',0,'12345678','https://ui-avatars.com/api/?name=J&color=fff&background=CF24AE&size=100','2024-05-10 04:52:59','2024-05-10 23:46:50',NULL,NULL),(255,'Juan Carlos','Perez','Garcia','a20201658@pucp.edu.pe','$2a$10$GoUlCr5HkSpets0Wasfia.W9VunjsBekRvZwgY30gVZwD8nWlHcoa',1,'20201658','https://ui-avatars.com/api/?name=J&color=fff&background=4CDDE2&size=100','2024-05-10 05:13:03','2024-05-24 21:32:49',NULL,NULL),(256,'Carmen Rosa','Jaramillo','Cercado','leguialft0501@gmail.com','$2a$10$GpSTFo4yjZ1OpviePvXM4uSuIKIFC8EqN8q7SYdNBvx/MsTgdFk9K',1,'12309856','https://ui-avatars.com/api/?name=C&color=fff&background=EB8140&size=100','2024-05-10 05:16:12','2024-05-29 04:17:54',7,93),(262,'Marcela','Contreras','Retamozo','64978421@pucp.edu.pe','$2a$10$5qHqtnwjBY8GI6isZHKvw.SIlMA7jO/atASzxEhR0tGvyNLFE3GYu',1,'64978421','https://ui-avatars.com/api/?name=M&color=fff&background=E52B0C&size=100','2024-05-10 05:30:01','2024-05-30 01:48:48',7,93),(267,'Andres Felipe','Lopez','Hernandez','andres.lopez@example.com','$2a$10$eQVrnz0CtmPadSBv/yU9MedxkmsLnwdS6pqql5TrliydNpYRtcPee',0,'21547893','https://ui-avatars.com/api/?name=A&color=fff&background=FB392F&size=100','2024-05-10 05:56:26','2024-05-24 21:32:49',NULL,NULL),(268,'Valentina Sofia','Rodriguez','Perez','valentina.rodriguez@example.com','$2a$10$5Rg0QpvU3iutpAM/d.IOI.nXHNBulHDygU2O5Wybe63/Pb89iNJGO',0,'30756142','https://ui-avatars.com/api/?name=V&color=fff&background=9AF003&size=100','2024-05-10 05:56:29','2024-05-24 21:32:49',NULL,NULL),(269,'Sofia Gabriela','Ramirez','Lopez','63215487@example.com','$2a$10$ur8GTjq4fbY/IXB6Az.Yee9.w3FSjixjdN1g/tV/cyzwKwacu2jZC',1,'63215487','https://ui-avatars.com/api/?name=S&color=fff&background=5A6841&size=100','2024-05-10 06:02:22','2024-05-24 21:32:49',NULL,NULL),(282,'Rew','Wao','Li','rewaoli@gmail.com','$2a$10$YFO9EqLm3FI.VvECj/erLuTLTZRfmioeLXntgmbIaXgZn7k6SPdk.',1,'20208475','https://ui-avatars.com/api/?name=R&color=fff&background=A73953&size=100','2024-05-10 13:40:41','2024-05-25 00:31:51',NULL,NULL),(283,'Emilio Eduardo','Panduro','Salas','emilio.salas@pucp.edu.pe','$2a$10$1aZk5Bp0T1i1e0FLoppXPedqmJvnAId244rbdbOIjDhNManvpWR1.',0,'20152355','https://ui-avatars.com/api/?name=E&color=fff&background=1CD337&size=100','2024-05-10 22:13:35','2024-05-10 22:16:26',NULL,NULL),(284,'Yahyr Javier','Solis','Pan','78945323@gmail.com','$2a$10$pVuxXGyGqnaZtWLO49RFo.fwZHwJF1rW5AAqbkIhjeLumI/sW6HUS',1,'78945323','https://ui-avatars.com/api/?name=Y&color=fff&background=DE5C27&size=100','2024-05-11 00:12:45','2024-05-11 00:12:45',63,NULL),(285,'Alex','Pan','Solis','09889009@gmail.com','$2a$10$Cu9Ew5gF1EQdWACBL4Hr1.3ci3KEBafpWgNLlcke9M59fyBv/30lq',1,'09889009','https://ui-avatars.com/api/?name=A&color=fff&background=A58532&size=100','2024-05-11 00:14:33','2024-05-11 00:14:33',64,NULL),(286,'Gerardo','Chung','Lu','gchung@pucp.edu.pe','$2a$10$MGL.fxt7R1mjl4qz8b3hQeZBphKiOLCRqUejOtyAtqTrBmV1O3wni',1,'45357531','https://ui-avatars.com/api/?name=G&color=fff&background=2800B3&size=100','2024-05-11 01:43:26','2024-05-30 06:15:48',7,93),(287,'Martin','Alvarez','Rodriguez','martin.alvarez@dominio.com','',1,'34567890',NULL,'2024-05-11 01:53:27','2024-05-23 22:03:20',NULL,53),(288,'Valentina','Soto','Fernandez','valentina.soto@dominio.com','',1,'45678901',NULL,'2024-05-11 01:53:28','2024-05-24 21:32:49',NULL,3),(289,'Daniel','Fuentes','Jimenez','daniel.fuentes@dominio.com','',1,'56789012',NULL,'2024-05-11 01:53:28','2024-05-24 21:32:49',NULL,NULL),(290,'Carolina','Navarro','Salazar','carolina.navarro@dominio.com','',1,'67890123',NULL,'2024-05-11 01:53:29','2024-05-24 21:32:49',1,3),(291,'Lucas','Rojas','Sanchez','lucas.rojas@dominio.com','',1,'78901234',NULL,'2024-05-11 01:53:29','2024-05-30 01:45:56',7,93),(292,'Maria Jose','Gutierrez','Ruiz','maria.gutierrez@dominio.com','',1,'89012345',NULL,'2024-05-11 01:53:30','2024-05-30 01:45:37',7,93),(293,'Pablo','Ortega','Lopez','pablo.ortega@dominio.com','',1,'90123456',NULL,'2024-05-11 01:53:30','2024-05-30 01:45:44',7,93),(294,'Julia','Flores','Perez','julia.flores@dominio.com','',1,'98765432',NULL,'2024-05-11 01:53:31','2024-05-30 01:45:28',7,93),(295,'Juan Carlos','Pérez','Gonzales','jcpgonzales@gmail.com','',1,'20175432',NULL,'2024-05-11 01:53:32','2024-05-30 01:45:10',7,93),(296,'Maria Elena','Lopez','Ruiz','melr@gmail.com','',1,'83726591',NULL,'2024-05-11 01:53:32','2024-05-30 01:45:19',7,93),(297,'Carlos Andrés','Ramirez','Torres','cartorres@pucp.edu.pe','',1,'49287615',NULL,'2024-05-11 01:53:33','2024-05-30 01:44:52',7,93),(298,'Ana Sofía','Morales','Valencia','asovalencia@gmail.com','',1,'95827364',NULL,'2024-05-11 01:53:33','2024-05-30 01:45:00',7,93),(299,'Rodrigo Alejandro','Fernandez','Quispe','rafernandez@pucp.edu.pe','',1,'56473829',NULL,'2024-05-11 01:53:34','2024-05-30 01:44:29',7,93),(300,'Lucia Maribel','Contreras','Bernal','lmbernal@gmail.com','',1,'21793645',NULL,'2024-05-11 01:53:34','2024-05-30 01:44:43',7,93),(301,'Eduardo José','Vega','Martinez','ejvegam@gmail.com','',1,'32815974',NULL,'2024-05-11 01:53:35','2024-05-30 01:44:14',7,93),(302,'Sofia Isabel','Castillo','Lopez','sicastillolopez@pucp.edu.pe','',1,'87621349',NULL,'2024-05-11 01:53:35','2024-05-30 01:44:22',7,93),(303,'Diego Martín','Alvarez','Paredes','dmparedes@gmail.com','',1,'68297431',NULL,'2024-05-11 01:53:36','2024-05-30 01:43:53',7,93),(304,'Carla Daniela','Moreno','Duarte','cdmorenod@pucp.edu.pe','',1,'90318467',NULL,'2024-05-11 01:53:36','2024-05-30 01:44:07',7,93),(305,'Alejandro','Jackson','Garcia','alejandro.jackson@dominio.com','',1,'12346678',NULL,'2024-05-11 01:54:49','2024-05-26 19:37:29',1,NULL),(306,'Ana Sofia','Hernandez','Martinez','ana.hernandez@dominio.com','',1,'23456789',NULL,'2024-05-11 01:54:50','2024-05-26 19:37:24',27,3),(307,'Luis','Marquez','Hernandez','luis.marquez@ejemplo.com','',1,'13579246',NULL,'2024-05-11 01:58:45','2024-05-19 07:30:41',NULL,NULL),(308,'Sofia','Mendoza','Rodriguez','sofia.mendoza@ejemplo.com','',1,'24681357',NULL,'2024-05-11 01:58:45','2024-05-11 01:58:45',NULL,NULL),(309,'Julca','Llanos','Senior','23498756@gmail.com','$2a$10$Z.7ka/lIPYEJl1XyNLv9TOZsLIBSkyiTf73f7RgVYGKHfQUlBuo7y',1,'23498756','https://ui-avatars.com/api/?name=J&color=fff&background=4EAC71&size=100','2024-05-12 03:14:58','2024-05-26 19:37:17',50,30),(310,'Juan','Seballos','Moreno','12332112@dominio.com','$2a$10$BjE/D2CWa9RlprMGsW9p2.FwFVFWejdJ8NSID6JJqalsXzRnPXeFi',0,'12332112','https://ui-avatars.com/api/?name=J&color=fff&background=B1EA9D&size=100','2024-05-12 03:20:38','2024-05-24 21:32:49',NULL,NULL),(311,'Marilin','Sanchez','Quintero','65487871@pucp.edu.pe','$2a$10$fmPC4YvsSY7Hya6Wfs8OoOA9O5vIk6TarDCEnAYTKTv5X9tuouUKO',0,'65487871','https://ui-avatars.com/api/?name=M&color=fff&background=87D056&size=100','2024-05-19 02:47:00','2024-05-20 01:50:59',NULL,NULL),(312,'Mariana','Saveedra','Salinas','54879787@pucp.edu.pe','$2a$10$ki48SaFM89Bhq20X7.FiPeTYIEj0Vj6oSe0jQR63F8/MH9sZGGpIe',0,'54879787','https://ui-avatars.com/api/?name=M&color=fff&background=2A298B&size=100','2024-05-19 07:19:08','2024-05-24 21:32:49',NULL,NULL),(313,'Juan','Mercedez','Salas','45874587@pucp.edu.pe','$2a$10$27ZWM/95uIFtPpBlKvdNjeU.w/7a4SOr/NBTrOdriOzmS1D3V8foe',0,'45874587','https://ui-avatars.com/api/?name=J&color=fff&background=5DA274&size=100','2024-05-19 07:20:13','2024-05-24 21:32:49',NULL,NULL),(314,'Adrian','Retamozo','Nuñez','45876598@pucp.edu.pe','$2a$10$gyzCfpZ4UcCg8atVEb1PRO0zOov2EZSWusP2uGIPeI2TeQTJ9uUZS',0,'45876598','https://ui-avatars.com/api/?name=A&color=fff&background=BEFE5E&size=100','2024-05-19 07:24:23','2024-05-20 01:46:39',15,NULL),(315,'Mariana','Fernandez','Jara','45879854@pucp.edu.pe','$2a$10$HJdIpb.PnmJyYebobQjCcOt/ERB/RklQXVQVnx4xpkn8CwdKvJUAW',0,'45879854','https://ui-avatars.com/api/?name=M&color=fff&background=1CA6DE&size=100','2024-05-19 07:26:50','2024-05-19 20:17:03',61,NULL),(316,'Jose','Morales','Rivera','45875212@pucp.edu.pe','$2a$10$fTtm6zZbsqCXQx1jTnv5Mu.fxJBCYw2ug2gMC93vWQdKpDzMa0OCW',1,'45875212','https://ui-avatars.com/api/?name=J&color=fff&background=651263&size=100','2024-05-19 07:28:43','2024-05-19 07:30:22',NULL,NULL),(317,'Jazmin','Alvarez','Pinedo','45875401@pucp.edu.pe','$2a$10$sZtgdxNgPrg8syA3wOBUUukcSatgdzUd8nxIrRDfgjBZhDbc7Gdua',1,'45875401','https://ui-avatars.com/api/?name=J&color=fff&background=41F302&size=100','2024-05-19 07:34:01','2024-05-19 07:34:01',NULL,NULL),(318,'Kevin','Chavez','Huaman','54872115@pucp.edu.pe','$2a$10$tmcim5W50I3ukUyY8UFbJu0txsqKZsyaqfbd1QrSL1vah7U3ec79K',0,'54872115','https://ui-avatars.com/api/?name=K&color=fff&background=ED2893&size=100','2024-05-19 07:34:56','2024-05-24 21:32:49',NULL,NULL),(319,'Edgard','Mendoza','Contreras','54812545@pucp.edu.pe','$2a$10$uKEDOW0DyMy3m3KFBhs8LukgJUjqh1OVIUO5BtUngCbsdeJUtEGAq',0,'54812545','https://ui-avatars.com/api/?name=E&color=fff&background=979DB8&size=100','2024-05-19 07:36:50','2024-05-24 21:32:49',NULL,NULL),(320,'Alex Francisco','Calizaya','Mamani','amamani@pucp.edu.pe','$2a$10$C12yDJvoUBqNBnOxmz8zf.EB5ROvW8D4QdAq9dc36E4NReEbMYoki',1,'20195236','https://ui-avatars.com/api/?name=A&color=fff&background=F26BA2&size=100','2024-05-19 23:40:23','2024-05-19 23:40:23',NULL,NULL),(321,'Alex Francisco','Armando','Mamani','45645456@pucp.edu.pe','$2a$10$emDmVYJRzrr6TBNAIYJKoeZUbub4iChfa/k8cYgv48B6jL0IhfnKO',1,'20165214','https://ui-avatars.com/api/?name=A&color=fff&background=34DFF5&size=100','2024-05-19 23:43:44','2024-05-19 23:43:44',NULL,NULL),(322,'Alex','Calizaya','Mamani','20162454@pucp.edu.pe','$2a$10$QqlbvnfSjWaUfqA0MXmjl.9O2Ah8GCNCsmMnWwtjYLG5eVOURgpS.',0,'20162454','https://ui-avatars.com/api/?name=A&color=fff&background=8B3114&size=100','2024-05-20 03:59:59','2024-05-24 21:32:49',NULL,NULL),(323,'Juanito','Salas','Cloruro','jsalas@pucp.edu.pe','$2a$10$rCOonYEMaajDDl0Ncu9lfeCgRaNiuETfQpo38z4jETr0V58qVP5wG',1,'20147896','https://ui-avatars.com/api/?name=J&color=fff&background=2E92EC&size=100','2024-05-20 09:54:47','2024-05-24 21:03:21',78,NULL),(324,'Alex','Pan','Li','alex.pan@pucp.edu.pe','$2a$10$fdOKwEy1cinOWTeueV73gOP1UrldHEytFrMr8LyOo1gjjLactxHhm',1,'20180115','https://ui-avatars.com/api/?name=A&color=fff&background=BA63B7&size=100','2024-05-23 01:37:04','2024-05-24 21:47:46',NULL,NULL),(325,'Palermo','Aguilar','Palacios','joseph.aguilar@pucp.edu.pe','$2a$10$9ahiK7m1oZAHI94Ebs8o0uEc.3evNxSeuKHhaaorw7ywYDv52OOUe',1,'20171350','https://ui-avatars.com/api/?name=J&color=fff&background=CC7885&size=100','2024-05-24 21:04:29','2024-05-26 00:39:16',2,84),(326,'Arturo Jair','Baldeon','Cordova','20191129@pucp.edu.pe','$2a$10$4/BUDW34l.JMsLJCEGg.jOtjd/g0Lv3yU7LhUoTSL9fFu9w3rb6Qq',1,'20191129','https://ui-avatars.com/api/?name=A&color=fff&background=374D98&size=100','2024-05-25 21:43:36','2024-05-25 21:43:36',1,NULL),(327,'Antonio Elmer','Lopez','Diaz','antonio.lopez@pucp.edu.pe','$2a$10$nNgTAdl9SkJm9dSrxAVnCuKX9dA88KT59pin0hDswgkmUnGGVNwR6',1,'20151212','https://ui-avatars.com/api/?name=A&color=fff&background=1AD570&size=100','2024-05-25 21:59:08','2024-05-25 21:59:12',16,NULL),(329,'Emilio Antonio','Nieves','Calderon','emilio.calderon@pucp.edu.pe','$2a$10$eKKMP3VaNcFH1dq/Rmsseen8DkWmoz88kXX/Wg35VhubkkeiUSlbu',1,'20201818','https://ui-avatars.com/api/?name=E&color=fff&background=F08DB6&size=100','2024-05-25 23:51:54','2024-05-26 00:00:39',2,NULL),(330,'Angelo','Remuzgo','Poma','angelo.poma@pucp.edu.pe','$2a$10$na5OdJ0gxguKn26i6lADKu96rGmgiik0z2cOnr04CB3qVUO2tJC3C',1,'20148912','https://ui-avatars.com/api/?name=A&color=fff&background=9153F2&size=100','2024-05-26 00:12:09','2024-05-26 00:39:15',2,NULL),(331,'Yahyr','Perez','Gavilan','a20176800@pucp.edu.pe','$2a$10$0vPXrtPZ2cjNqyP3VAKNFeAgo7KKwCc.Iu.mq1mlbyg4DM7Yi1K0G',1,'45978451','https://ui-avatars.com/api/?name=Y&color=fff&background=E160EF&size=100','2024-05-26 03:29:43','2024-05-30 01:47:49',7,93),(332,'Carlos','Salgar','Fumisa','lucas.sifghflva@example.com','$2a$10$0N9Pq8UBLfDzrvHSg8pTuufh/9HQ90XMIuLwU8fqn//SNu9RT.NEq',1,'61651655','https://ui-avatars.com/api/?name=F&color=fff&background=836F9D&size=100','2024-05-26 17:36:42','2024-05-30 18:34:08',1,89),(333,'Marcos','Oropeza','Fontaner','alexpanli4@hotmail.com','$2a$10$/Cb1oOE02sMYdcpIPpGLweBgh4VNBXLz/KlQlEKWmEsP0TnpGAcw2',0,'20180110','https://ui-avatars.com/api/?name=M&color=fff&background=9ED5F7&size=100','2024-05-27 01:18:44','2024-05-27 04:53:52',1,NULL),(334,'Sebastian','Villacorta','Gonzales','almendrasDom@hotmail.com','$2a$10$l5D7peQMXe6PWmyNzWnLUeJjAyNj8GR4VJKD/B/fysm3E5wccChoa',1,'20180113','https://ui-avatars.com/api/?name=S&color=fff&background=FB5A27&size=100','2024-05-27 01:32:50','2024-05-27 01:32:50',1,NULL),(335,'Sebastian','Lezama','Patroclo','sebas.lez@hotmail.com','$2a$10$LD/4ftzx49HcLx8QB11ukOM8szt3WUSQF5n.Z8Qbvb5LqngJNlWJO',1,'20150100','https://ui-avatars.com/api/?name=S&color=fff&background=D3D666&size=100','2024-05-27 04:47:12','2024-05-27 04:47:12',64,NULL),(336,'Marcelo','Quispe','Montaner','marcelo.montq@gmail.com','$2a$10$CkqSHHLMGK..LRSyAPx/quypQl2cLTLdm7S0EErrr6tOFE1Dt/hiS',1,'20001259','https://ui-avatars.com/api/?name=M&color=fff&background=FB2ED8&size=100','2024-05-27 04:48:13','2024-05-27 04:48:13',NULL,NULL),(337,'Lucas','Tigre','Cardozo','l.tigre@pucp.edu.pe','$2a$10$AnYhx7UtqjoKGFrZmDKINOPg9vBjw.jffrMk7KX0rkiRJrjVXcoQO',1,'20150656','https://ui-avatars.com/api/?name=L&color=fff&background=4D1F9E&size=100','2024-05-27 04:59:48','2024-05-27 04:59:48',89,NULL),(338,'Connor','Mcgregor','De La Cruz','connor.dlcruz@hotmail.com','$2a$10$pYQhycSXXhYxcQq6PmqY1uJw1IT/6N3CBENZCQS8cbnl4XgldUdT.',1,'20178823','https://ui-avatars.com/api/?name=C&color=fff&background=5BF857&size=100','2024-05-27 05:09:04','2024-05-27 05:09:04',89,NULL),(339,'Mateo','Garofalo','Dolores','mateo.grafito@gmail.com','$2a$10$Bt33jfcKGqD75dW4Wmq4hubFT1K.yzWzDwbVma3MUmIWUGgPnRFLC',1,'19882031','https://ui-avatars.com/api/?name=M&color=fff&background=92541D&size=100','2024-05-27 05:09:53','2024-05-27 05:09:53',NULL,NULL),(340,'Giovanny','Montecruz','Ormachea','98747464@pucp.edu.pe','$2a$10$ovWfObHpvvA59j8kOgfBPuJQfv1z6tOG..AkB77BoMn5377qBy8Gm',1,'98747464','https://ui-avatars.com/api/?name=G&color=fff&background=30048D&size=100','2024-05-29 21:55:38','2024-05-30 01:51:19',7,93),(341,'Trini','Paitan','Salcedo','64874878@pucp.edu.pe','$2a$10$2S5eKDB0soEbHRWcn8Yl.uqeKvcT/4Ao3I3yHnl7LGewhRjCYamoW',1,'64874878','https://ui-avatars.com/api/?name=T&color=fff&background=BE006F&size=100','2024-05-30 02:59:30','2024-05-30 02:59:30',2,NULL);
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'Mentify'
--

--
-- Dumping routines for database 'Mentify'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-30 20:47:10
