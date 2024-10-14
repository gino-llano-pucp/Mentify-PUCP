-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: mentoring.cqaz4i5mrupx.us-east-1.rds.amazonaws.com    Database: MentifyNuevo
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
-- Table structure for table `AlumnoSesionCita`
--

DROP TABLE IF EXISTS `AlumnoSesionCita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AlumnoSesionCita` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fid_alumno` int NOT NULL,
  `fid_sesionCita` int NOT NULL,
  `fechaCreacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fid_sesionCita` (`fid_sesionCita`),
  KEY `AlumnoSesionCita_ibfk_1` (`fid_alumno`),
  CONSTRAINT `AlumnoSesionCita_ibfk_1` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=459 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AlumnoSesionCita`
--

LOCK TABLES `AlumnoSesionCita` WRITE;
/*!40000 ALTER TABLE `AlumnoSesionCita` DISABLE KEYS */;

/*!40000 ALTER TABLE `AlumnoSesionCita` ENABLE KEYS */;
UNLOCK TABLES;

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
  `esTutor` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_asignacionTipoTutoria`),
  KEY `fid_tutor` (`fid_usuario`),
  KEY `fid_tipoTutoria` (`fid_tipoTutoria`),
  CONSTRAINT `AsignacionTipoTutoria_ibfk_1` FOREIGN KEY (`fid_usuario`) REFERENCES `Usuario` (`id_usuario`),
  CONSTRAINT `AsignacionTipoTutoria_ibfk_2` FOREIGN KEY (`fid_tipoTutoria`) REFERENCES `TipoTutoria` (`id_tipoTutoria`)
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AsignacionTipoTutoria`
--

LOCK TABLES `AsignacionTipoTutoria` WRITE;
/*!40000 ALTER TABLE `AsignacionTipoTutoria` DISABLE KEYS */;

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
  CONSTRAINT `AsignacionTutorAlumno_ibfk_1` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`),
  CONSTRAINT `AsignacionTutorAlumno_ibfk_2` FOREIGN KEY (`fid_tutor`) REFERENCES `Usuario` (`id_usuario`),
  CONSTRAINT `AsignacionTutorAlumno_ibfk_3` FOREIGN KEY (`fid_tipoTutoria`) REFERENCES `TipoTutoria` (`id_tipoTutoria`),
  CONSTRAINT `AsignacionTutorAlumno_ibfk_4` FOREIGN KEY (`fid_solicitud`) REFERENCES `SolicitudTutorFijo` (`id_solicitud`),
  CONSTRAINT `fk_asignacionTutorAlumno_solicitud` FOREIGN KEY (`fid_solicitud`) REFERENCES `SolicitudTutorFijo` (`id_solicitud`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AsignacionTutorAlumno`
--

LOCK TABLES `AsignacionTutorAlumno` WRITE;
/*!40000 ALTER TABLE `AsignacionTutorAlumno` DISABLE KEYS */;

/*!40000 ALTER TABLE `AsignacionTutorAlumno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AsistenciaCita`
--

DROP TABLE IF EXISTS `AsistenciaCita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AsistenciaCita` (
  `id_asistencia` int NOT NULL AUTO_INCREMENT,
  `fid_sesionCita` int NOT NULL,
  `fid_alumno` int DEFAULT NULL,
  `asistio` tinyint(1) NOT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_asistencia`),
  KEY `AsistenciaCita_ibfk_1` (`fid_sesionCita`),
  KEY `AsistenciaCita_ibfk_2` (`fid_alumno`),
  CONSTRAINT `AsistenciaCita_ibfk_1` FOREIGN KEY (`fid_sesionCita`) REFERENCES `SesionCita` (`id_cita`),
  CONSTRAINT `AsistenciaCita_ibfk_2` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=221 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AsistenciaCita`
--

LOCK TABLES `AsistenciaCita` WRITE;
/*!40000 ALTER TABLE `AsistenciaCita` DISABLE KEYS */;

/*!40000 ALTER TABLE `AsistenciaCita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Audit`
--

DROP TABLE IF EXISTS `Audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Audit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tableName` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `oldValues` json DEFAULT NULL,
  `newValues` json DEFAULT NULL,
  `performedBy` int DEFAULT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7459 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Audit`
--

LOCK TABLES `Audit` WRITE;
/*!40000 ALTER TABLE `Audit` DISABLE KEYS */;

/*!40000 ALTER TABLE `Audit` ENABLE KEYS */;
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
  `fid_estado_compromiso` int DEFAULT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fid_sesionCita` int DEFAULT NULL,
  PRIMARY KEY (`id_compromiso`),
  KEY `CompromisoCita_fid_sesionCita_foreign_idx` (`fid_sesionCita`),
  KEY `fk_compromiso_cita_estado_compromiso` (`fid_estado_compromiso`),
  CONSTRAINT `CompromisoCita_fid_sesionCita_foreign_idx` FOREIGN KEY (`fid_sesionCita`) REFERENCES `SesionCita` (`id_cita`),
  CONSTRAINT `fk_compromiso_cita_estado_compromiso` FOREIGN KEY (`fid_estado_compromiso`) REFERENCES `EstadoCompromisoCita` (`id_estado_compromiso`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `fid_unidad_academica` int NOT NULL,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fid_tipoTutoria` int NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `antecedentes` varchar(255) DEFAULT NULL,
  `comentarios` varchar(255) DEFAULT NULL,
  `fid_cita` int DEFAULT NULL,
  `fechaCreacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(255) DEFAULT NULL,
  `fid_facultad` int DEFAULT NULL,
  PRIMARY KEY (`id_derivacion`),
  KEY `Derivacion_fid_alumno_Usuario_fk` (`fid_alumno`),
  KEY `Derivacion_fid_cita_SesionCita_fk` (`fid_cita`),
  KEY `Derivacion_fid_tutor_Usuario_fk` (`fid_tutor`),
  KEY `Derivacion_fid_unidad_academica_UnidadAcademica_fk` (`fid_unidad_academica`),
  KEY `Derivacion_fid_tipoTutoria_foreign_idx` (`fid_tipoTutoria`),
  KEY `Derivacion_fid_facultad_foreign_idx` (`fid_facultad`),
  CONSTRAINT `Derivacion_fid_alumno_Usuario_fk` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Derivacion_fid_cita_SesionCita_fk` FOREIGN KEY (`fid_cita`) REFERENCES `SesionCita` (`id_cita`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Derivacion_fid_facultad_foreign_idx` FOREIGN KEY (`fid_facultad`) REFERENCES `Facultad` (`id_facultad`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Derivacion_fid_tipoTutoria_foreign_idx` FOREIGN KEY (`fid_tipoTutoria`) REFERENCES `TipoTutoria` (`id_tipoTutoria`),
  CONSTRAINT `Derivacion_fid_tipoTutoria_TipoTutoria_fk` FOREIGN KEY (`fid_tipoTutoria`) REFERENCES `TipoTutoria` (`id_tipoTutoria`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Derivacion_fid_tutor_Usuario_fk` FOREIGN KEY (`fid_tutor`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Derivacion_fid_unidad_academica_UnidadAcademica_fk` FOREIGN KEY (`fid_unidad_academica`) REFERENCES `UnidadAcademica` (`id_unidad_academica`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  CONSTRAINT `Disponibilidad_ibfk_1` FOREIGN KEY (`fid_tutor`) REFERENCES `Usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=664 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Disponibilidad`
--

LOCK TABLES `Disponibilidad` WRITE;
/*!40000 ALTER TABLE `Disponibilidad` DISABLE KEYS */;

/*!40000 ALTER TABLE `Disponibilidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Encuesta`
--

DROP TABLE IF EXISTS `Encuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Encuesta` (
  `id_encuesta` int NOT NULL AUTO_INCREMENT,
  `fid_alumno` int NOT NULL,
  `fid_estado_Encuesta` int NOT NULL,
  `fid_encuesta_Maestra` int NOT NULL,
  `fechaActualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Respuesta del Alumno',
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_encuesta`),
  KEY `fid_alumno` (`fid_alumno`),
  KEY `fid_encuesta_Maestra` (`fid_encuesta_Maestra`),
  KEY `Encuesta_fid_estado_encuesta_foreign_idx` (`fid_estado_Encuesta`),
  CONSTRAINT `Encuesta_fid_estado_encuesta_foreign_idx` FOREIGN KEY (`fid_estado_Encuesta`) REFERENCES `EstadoEncuesta` (`id_estado_encuesta`),
  CONSTRAINT `Encuesta_ibfk_1` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Encuesta_ibfk_2` FOREIGN KEY (`fid_estado_Encuesta`) REFERENCES `EstadoEncuesta` (`id_estado_encuesta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Encuesta_ibfk_3` FOREIGN KEY (`fid_encuesta_Maestra`) REFERENCES `EncuestaMaestra` (`id_encuesta_maestra`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Encuesta`
--

LOCK TABLES `Encuesta` WRITE;
/*!40000 ALTER TABLE `Encuesta` DISABLE KEYS */;

/*!40000 ALTER TABLE `Encuesta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EncuestaMaestra`
--

DROP TABLE IF EXISTS `EncuestaMaestra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EncuestaMaestra` (
  `id_encuesta_maestra` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fid_estado_encuesta_maestra` int NOT NULL,
  `fid_facultad` int NOT NULL,
  PRIMARY KEY (`id_encuesta_maestra`),
  KEY `fid_estado_encuesta_maestra` (`fid_estado_encuesta_maestra`),
  KEY `EncuestaMaestra_fid_facultad_foreign_idx` (`fid_facultad`),
  CONSTRAINT `EncuestaMaestra_fid_facultad_foreign_idx` FOREIGN KEY (`fid_facultad`) REFERENCES `Facultad` (`id_facultad`),
  CONSTRAINT `EncuestaMaestra_ibfk_2` FOREIGN KEY (`fid_estado_encuesta_maestra`) REFERENCES `EstadoEncuestaMaestra` (`id_estado_encuesta_maestra`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EncuestaMaestra`
--

LOCK TABLES `EncuestaMaestra` WRITE;
/*!40000 ALTER TABLE `EncuestaMaestra` DISABLE KEYS */;

/*!40000 ALTER TABLE `EncuestaMaestra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ErrorLogs`
--

DROP TABLE IF EXISTS `ErrorLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ErrorLogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fid_usuario` int DEFAULT NULL,
  `errorType` varchar(255) NOT NULL,
  `errorMessage` text NOT NULL,
  `stackTrace` text,
  `endpoint` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `params` json DEFAULT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fid_usuario` (`fid_usuario`),
  CONSTRAINT `ErrorLogs_ibfk_1` FOREIGN KEY (`fid_usuario`) REFERENCES `Usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=317 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ErrorLogs`
--

LOCK TABLES `ErrorLogs` WRITE;
/*!40000 ALTER TABLE `ErrorLogs` DISABLE KEYS */;

/*!40000 ALTER TABLE `ErrorLogs` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EstadoCompromisoCita`
--

LOCK TABLES `EstadoCompromisoCita` WRITE;
/*!40000 ALTER TABLE `EstadoCompromisoCita` DISABLE KEYS */;
INSERT INTO `EstadoCompromisoCita` VALUES (1,'Comprometido','Estado inicial donde el compromiso está formalizado pero aún no ha comenzado su ejecución. ',1,'2024-05-31 16:07:22','2024-05-31 16:07:22'),(2,'Ejecucion','El compromiso está activo y las actividades para cumplirlo están en curso.',1,'2024-05-31 16:09:03','2024-05-31 16:09:03'),(3,'Finalizado','Todas las actividades del compromiso se han completado y los objetivos alcanzados',1,'2024-05-31 16:09:24','2024-05-31 16:09:24');
/*!40000 ALTER TABLE `EstadoCompromisoCita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EstadoEncuesta`
--

DROP TABLE IF EXISTS `EstadoEncuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EstadoEncuesta` (
  `id_estado_encuesta` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime DEFAULT NULL,
  `fechaActualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_estado_encuesta`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EstadoEncuesta`
--

LOCK TABLES `EstadoEncuesta` WRITE;
/*!40000 ALTER TABLE `EstadoEncuesta` DISABLE KEYS */;
INSERT INTO `EstadoEncuesta` VALUES (1,'Pendiente','Encuesta pendiente de respuesta',1,'2024-06-13 21:05:02','2024-06-13 21:05:02'),(2,'Respondido','Encuesta respondida',1,'2024-06-13 21:05:02','2024-06-13 21:05:02');
/*!40000 ALTER TABLE `EstadoEncuesta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EstadoEncuestaMaestra`
--

DROP TABLE IF EXISTS `EstadoEncuestaMaestra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EstadoEncuestaMaestra` (
  `id_estado_encuesta_maestra` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_estado_encuesta_maestra`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EstadoEncuestaMaestra`
--

LOCK TABLES `EstadoEncuestaMaestra` WRITE;
/*!40000 ALTER TABLE `EstadoEncuestaMaestra` DISABLE KEYS */;
INSERT INTO `EstadoEncuestaMaestra` VALUES (1,'Vigente','Encuesta vigente',1,'2024-06-20 01:07:46','2024-06-20 01:07:46'),(2,'Finalizado','Encuesta finalizada',1,'2024-06-20 01:07:46','2024-06-20 01:07:46');
/*!40000 ALTER TABLE `EstadoEncuestaMaestra` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Facultad`
--

LOCK TABLES `Facultad` WRITE;
/*!40000 ALTER TABLE `Facultad` DISABLE KEYS */;

/*!40000 ALTER TABLE `Facultad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HistorialCitas`
--

DROP TABLE IF EXISTS `HistorialCitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HistorialCitas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `citaId` int NOT NULL,
  `fechaHoraInicio` datetime DEFAULT NULL,
  `fechaHoraFin` datetime DEFAULT NULL,
  `tipoModalidad` varchar(255) DEFAULT NULL,
  `lugar` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `usuarioModifico` int NOT NULL,
  `fechaModificacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `citaId` (`citaId`),
  KEY `usuarioModifico` (`usuarioModifico`),
  CONSTRAINT `HistorialCitas_ibfk_1` FOREIGN KEY (`citaId`) REFERENCES `SesionCita` (`id_cita`),
  CONSTRAINT `HistorialCitas_ibfk_2` FOREIGN KEY (`usuarioModifico`) REFERENCES `Usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HistorialCitas`
--

LOCK TABLES `HistorialCitas` WRITE;
/*!40000 ALTER TABLE `HistorialCitas` DISABLE KEYS */;
/*!40000 ALTER TABLE `HistorialCitas` ENABLE KEYS */;
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
  `nota` longblob,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `creadoPor` int DEFAULT NULL,
  `actualizadoPor` int DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_registro`),
  KEY `fid_alumno` (`fid_alumno`),
  CONSTRAINT `HistoricoEstudiante_ibfk_1` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HistoricoEstudiante`
--

LOCK TABLES `HistoricoEstudiante` WRITE;
/*!40000 ALTER TABLE `HistoricoEstudiante` DISABLE KEYS */;

/*!40000 ALTER TABLE `HistoricoEstudiante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Institucion`
--

DROP TABLE IF EXISTS `Institucion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Institucion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `siglas` varchar(255) DEFAULT NULL,
  `logo` longblob,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Institucion`
--

LOCK TABLES `Institucion` WRITE;
/*!40000 ALTER TABLE `Institucion` DISABLE KEYS */;

/*!40000 ALTER TABLE `Institucion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notificaciones`
--

DROP TABLE IF EXISTS `Notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notificaciones` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `fid_usuario` int NOT NULL,
  `fid_sesionCita` int NOT NULL,
  `tipo` enum('recordatorio','cambio','cancelación','confirmación') NOT NULL,
  `leido` tinyint(1) NOT NULL DEFAULT '0',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fechaHoraInicio` datetime DEFAULT NULL,
  `fechaHoraFin` datetime DEFAULT NULL,
  `modalidad` varchar(255) DEFAULT NULL,
  `lugar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `fid_usuario` (`fid_usuario`),
  KEY `fid_sesionCita` (`fid_sesionCita`),
  CONSTRAINT `Notificaciones_ibfk_1` FOREIGN KEY (`fid_usuario`) REFERENCES `Usuario` (`id_usuario`),
  CONSTRAINT `Notificaciones_ibfk_2` FOREIGN KEY (`fid_sesionCita`) REFERENCES `SesionCita` (`id_cita`)
) ENGINE=InnoDB AUTO_INCREMENT=519 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notificaciones`
--

LOCK TABLES `Notificaciones` WRITE;
/*!40000 ALTER TABLE `Notificaciones` DISABLE KEYS */;

/*!40000 ALTER TABLE `Notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Opcion`
--

DROP TABLE IF EXISTS `Opcion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Opcion` (
  `id_opcion` int NOT NULL AUTO_INCREMENT,
  `fid_pregunta` int DEFAULT NULL,
  `enunciado` varchar(255) NOT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime DEFAULT NULL,
  `fechaActualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_opcion`),
  KEY `fid_pregunta` (`fid_pregunta`),
  CONSTRAINT `Opcion_ibfk_1` FOREIGN KEY (`fid_pregunta`) REFERENCES `Pregunta` (`id_pregunta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Opcion`
--

LOCK TABLES `Opcion` WRITE;
/*!40000 ALTER TABLE `Opcion` DISABLE KEYS */;
INSERT INTO `Opcion` VALUES (1,1,'Nada útil',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(2,1,'Poco útil',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(3,1,'Útil',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(4,1,'Muy útil',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(5,1,'Demasiado útil',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(6,2,'1',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(7,2,'2',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(8,2,'3',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(9,2,'4',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(10,2,'5',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(11,3,'Sí',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(12,3,'Parcialmente',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(13,3,'No',1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(14,4,'Sí',1,'2024-06-29 07:13:36','2024-06-29 07:13:36'),(15,4,'Parcialmente',1,'2024-06-29 07:13:36','2024-06-29 07:13:36'),(16,4,'No',1,'2024-06-29 07:13:36','2024-06-29 07:13:36');
/*!40000 ALTER TABLE `Opcion` ENABLE KEYS */;
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
  CONSTRAINT `OpcionSidebar_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `OpcionSidebar` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OpcionSidebar`
--

LOCK TABLES `OpcionSidebar` WRITE;
/*!40000 ALTER TABLE `OpcionSidebar` DISABLE KEYS */;
INSERT INTO `OpcionSidebar` VALUES (1,'Dashboard','dashboard_icon','dashboardComponent',NULL,'2024-05-01 22:25:29','2024-05-01 22:25:29'),(2,'Facultades y Programas','Building2','facultad',NULL,'2024-05-01 22:41:17','2024-05-08 19:47:09'),(5,'Gestión de Usuarios','Users','',NULL,'2024-05-02 20:06:38','2024-05-28 04:59:52'),(6,'Gestión de Alumnos','','alumnos',5,'2024-05-02 20:06:38','2024-05-28 05:00:10'),(7,'Gestión de Tutores','','tutores',5,'2024-05-02 20:06:38','2024-05-28 05:00:24'),(8,'Unidades Académicas','Building','unidadesAcademicas',NULL,'2024-05-03 18:03:46','2024-05-03 18:08:45'),(9,'Citas','Calendar','citasTutor',NULL,'2024-05-03 19:09:55','2024-05-03 19:11:57'),(10,'Alumnos Asignados','UserCheck','alumnosAsignadosTutor',NULL,'2024-05-03 19:10:59','2024-05-03 19:11:57'),(11,'Tipos de Tutorías','BookOpen','tiposTutorias',NULL,'2024-05-03 19:14:40','2024-05-03 19:21:35'),(12,'Solicitudes de Asignación','Inbox','solicitudesAsignacion',NULL,'2024-05-03 19:17:03','2024-05-03 19:17:03'),(13,'Manejo Académico','Book','',NULL,'2024-05-03 19:19:32','2024-05-28 05:00:41'),(14,'Gestión de Programas','','listadoProgramasDeFacultad',13,'2024-05-03 19:19:33','2024-06-10 10:02:04'),(15,'Gestión de Tutores','','tutores',13,'2024-05-03 19:19:33','2024-05-28 05:00:57'),(17,'Reporte Indicadores','BarChart3','reporteIndicadores',NULL,'2024-05-03 19:20:00','2024-05-28 04:40:19'),(18,'Mis Tutores y Solicitudes','UserCheck','misTutores',NULL,'2024-05-03 19:20:24','2024-07-04 02:19:43'),(19,'Encuestas de Satisfacción','Clipboard','encuestasAlumno',NULL,'2024-05-03 19:20:53','2024-05-28 05:01:32'),(20,'Citas','Calendar','citasAlumno',NULL,'2024-05-03 19:24:01','2024-05-03 19:24:01'),(22,'Asignación de Tutor','FilePen','asignacionTutor',NULL,'2024-05-22 21:30:51','2024-05-22 21:30:51'),(23,'Gestión de Responsable de Bienestar','','responsable',5,'2024-06-02 21:59:45','2024-07-05 01:39:42'),(24,'Asistente','','asistente',13,'2024-06-02 22:16:48','2024-06-02 22:16:48'),(25,'Gestión de Alumnos','','alumnos',13,'2024-06-10 08:45:29','2024-06-10 08:45:29'),(26,'Encuestas de Satisfacción','Clipboard','solicitudesEncuestas',NULL,'2024-06-10 10:23:20','2024-06-10 10:23:20'),(27,'Derivaciones de Tutoría','FilePen','responsableTutoria',NULL,'2024-06-17 02:00:20','2024-06-17 02:00:20'),(29,'Log de Auditoría','ScrollText','auditoria',NULL,'2024-07-05 06:30:03','2024-07-05 06:30:03'),(31,'Datos de institución','University','datosInstitucion',NULL,'2024-07-06 06:07:14','2024-07-06 06:07:14'),(32,'Log de Errores','CircleSlash','logErrores',NULL,'2024-07-10 22:35:34','2024-07-10 22:41:51');
/*!40000 ALTER TABLE `OpcionSidebar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PasswordResetToken`
--

DROP TABLE IF EXISTS `PasswordResetToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PasswordResetToken` (
  `id_token` int NOT NULL AUTO_INCREMENT,
  `fid_usuario` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` datetime NOT NULL,
  PRIMARY KEY (`id_token`),
  KEY `PasswordResetToken_ibfk_1` (`fid_usuario`),
  CONSTRAINT `PasswordResetToken_ibfk_1` FOREIGN KEY (`fid_usuario`) REFERENCES `Usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PasswordResetToken`
--

LOCK TABLES `PasswordResetToken` WRITE;
/*!40000 ALTER TABLE `PasswordResetToken` DISABLE KEYS */;
/*!40000 ALTER TABLE `PasswordResetToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pregunta`
--

DROP TABLE IF EXISTS `Pregunta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pregunta` (
  `id_pregunta` int NOT NULL AUTO_INCREMENT,
  `enunciado` varchar(255) NOT NULL,
  `es_rspta_unica` tinyint(1) NOT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime DEFAULT NULL,
  `fechaActualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_pregunta`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pregunta`
--

LOCK TABLES `Pregunta` WRITE;
/*!40000 ALTER TABLE `Pregunta` DISABLE KEYS */;
INSERT INTO `Pregunta` VALUES (1,'¿Qué tan útil encontraste las sesiones de tutoría?',1,1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(2,'¿Cómo calificarías la claridad de las explicaciones proporcionadas durante las sesiones de tutoría?',1,1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(3,'¿La sesiones de tutoría cumplieron con tus expectativas?',1,1,'2024-06-29 07:13:35','2024-06-29 07:13:35'),(4,'¿Los tutores mostraron interés en tus necesidades y preocupaciones durante las sesiones?',1,1,'2024-06-29 07:13:35','2024-06-29 07:13:35');
/*!40000 ALTER TABLE `Pregunta` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Programa`
--

LOCK TABLES `Programa` WRITE;
/*!40000 ALTER TABLE `Programa` DISABLE KEYS */;

/*!40000 ALTER TABLE `Programa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Respuesta`
--

DROP TABLE IF EXISTS `Respuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Respuesta` (
  `id_respuesta` int NOT NULL AUTO_INCREMENT,
  `fid_encuesta` int DEFAULT NULL,
  `fid_opcion` int DEFAULT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime DEFAULT NULL,
  `fechaActualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_respuesta`),
  KEY `fid_encuesta` (`fid_encuesta`),
  KEY `fid_opcion` (`fid_opcion`),
  CONSTRAINT `Respuesta_ibfk_1` FOREIGN KEY (`fid_encuesta`) REFERENCES `Encuesta` (`id_encuesta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Respuesta_ibfk_2` FOREIGN KEY (`fid_opcion`) REFERENCES `Opcion` (`id_opcion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Respuesta`
--

LOCK TABLES `Respuesta` WRITE;
/*!40000 ALTER TABLE `Respuesta` DISABLE KEYS */;

/*!40000 ALTER TABLE `Respuesta` ENABLE KEYS */;
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
  `detalleResultado` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_resultado`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rol`
--

LOCK TABLES `Rol` WRITE;
/*!40000 ALTER TABLE `Rol` DISABLE KEYS */;
INSERT INTO `Rol` VALUES (1,'Coordinador de Facultad',1,'2024-05-01 19:37:14','2024-05-01 19:37:14'),(2,'Coordinador de Programa',1,'2024-05-01 19:37:14','2024-05-01 19:37:14'),(3,'Tutor',1,'2024-05-01 19:37:14','2024-05-01 19:37:14'),(4,'Alumno',1,'2024-05-01 19:37:14','2024-05-01 19:37:14'),(5,'Asistente',1,'2024-05-01 19:37:14','2024-05-01 19:37:14'),(6,'Administrador',1,'2024-05-01 19:37:14','2024-05-01 19:37:14'),(7,'Responsable de Bienestar',1,'2024-06-03 19:50:26','2024-06-03 19:50:26');
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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RolOpciones`
--

LOCK TABLES `RolOpciones` WRITE;
/*!40000 ALTER TABLE `RolOpciones` DISABLE KEYS */;
INSERT INTO `RolOpciones` VALUES (7,2,6,1,'2024-05-02 20:09:31','2024-05-02 20:09:31'),(10,5,6,1,'2024-05-02 20:12:13','2024-05-02 20:12:13'),(11,6,6,1,'2024-05-02 20:12:13','2024-05-02 20:12:13'),(12,7,6,1,'2024-05-02 20:12:13','2024-05-02 20:12:13'),(13,8,6,1,'2024-05-03 18:06:15','2024-05-03 18:06:15'),(14,9,3,1,'2024-05-03 19:12:27','2024-05-03 19:12:27'),(15,10,3,1,'2024-05-03 19:12:27','2024-05-03 19:12:27'),(16,11,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(17,12,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(18,13,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(19,14,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(20,15,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(22,17,1,1,'2024-05-03 19:23:03','2024-05-03 19:23:03'),(23,11,2,1,'2024-05-03 19:23:15','2024-05-03 19:23:15'),(24,12,2,1,'2024-05-03 19:23:15','2024-05-03 19:23:15'),(25,13,2,1,'2024-05-03 19:23:15','2024-05-03 19:23:15'),(27,15,2,1,'2024-05-03 19:23:15','2024-05-03 19:23:15'),(29,17,2,1,'2024-05-03 19:23:15','2024-05-03 19:23:15'),(30,11,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(31,12,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(32,13,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(33,14,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(34,15,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(36,17,5,1,'2024-05-03 19:23:20','2024-05-03 19:23:20'),(37,18,4,1,'2024-05-03 19:24:36','2024-05-03 19:24:36'),(38,19,4,1,'2024-05-03 19:24:36','2024-05-03 19:24:36'),(39,20,4,1,'2024-05-03 19:24:36','2024-05-03 19:24:36'),(40,22,1,1,'2024-05-22 21:34:46','2024-05-22 21:34:46'),(41,22,2,1,'2024-05-22 21:34:52','2024-05-22 21:34:52'),(42,23,6,1,NULL,NULL),(45,25,1,1,NULL,NULL),(46,25,2,1,NULL,NULL),(47,26,1,1,NULL,NULL),(48,27,7,1,NULL,NULL),(50,29,6,1,NULL,NULL),(52,31,6,1,NULL,NULL),(53,32,6,1,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=458 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles_Usuario`
--

LOCK TABLES `Roles_Usuario` WRITE;
/*!40000 ALTER TABLE `Roles_Usuario` DISABLE KEYS */;

/*!40000 ALTER TABLE `Roles_Usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES (''),('20240429180727-create-usuario.js'),('20240501155904-create-opcionsidebar.js'),('20240501171917-create-rol.js'),('20240501174055-create-rolesUsuario.js'),('20240501221054-create-rol-opciones.js.js'),('20240503022434-create-facultad.js'),('20240503023220-update-usuario.js.js'),('20240504235520-create-programa.js'),('20240504235616-add_fid_programa_to_usuario.js'),('20240505033731-create-disponibilidad.js.js'),('20240505053433-create-historicoestudiante.js'),('20240505055459-create-sesioncita.js'),('20240507124638-create-unidadacademica.js'),('20240508154942-add-siglas-to-facultad.js'),('20240519225714-add-fechaHoraInicio-fechaHoraFin-to-SesionCita.js'),('20240521003535-create-TipoFormato.js'),('20240521003625-create-TipoObligatoriedad.js'),('20240521004018-create-TipoPermanencia.js'),('20240521004412-create-TipoTutor.js'),('20240521004548-create-TipoTutoria.js'),('20240521004621-create-AsignacionTipoTutoria.js'),('20240521005544-create-EstadoSolicitudTutorFijo.js'),('20240521005736-create-SolicitudTutorFijo.js'),('20240521010001-create-AsignacionTutorAlumno.js'),('20240521024559-rename-colummSesioCita.js'),('20240521051014-add-es_corta-to-sesion-cita.js'),('20240522010838-create-estado-cita.js'),('20240522015814-modify-fid-estado-cita.js'),('20240522021128-add-creation-update-dates-to-estado-cita.js'),('20240522021652-create-derivacion-table.js'),('20240522021855-create-resultado-cita-table.js'),('20240522022127-create-compromiso-cita-table.js'),('20240522022257-create-estado-compromiso-cita-table.js'),('20240522213721-create-TipoModalidad.js'),('20240522222607-agregar-facultad-tipo-tutoria.js'),('20240522223533-add-TipoModalidadToSesionCita.js'),('20240523223726-add-fid-tutor-to-solicitudtutorfijo.js'),('20240524204810-add-relations-solicitud-tutor-fijo.js'),('20240526162030-add-fid_tipoTutoria-to-SolicitudTutorFijo.js'),('20240526163320-add-foreign-key-to-fid_tipoTutoria.js'),('20240526195620-add-fid_usuario-to-asignaciontipo_tutoria.js'),('20240527204629-addcolumm-in-TipoTutoria-fid-programa.js'),('20240531145927-create-alumno-sesion-cita.js'),('20240531153642-make-fid_alumno-optional-in-sesionCita.js'),('20240531163249-add_fid_sesionCita_to_compromisoCita.js'),('20240531164650-add_detalleResultado_to_resultadoCita.js'),('20240604233121-add-column-motivoRechazo.js'),('20240605130126-add-esTutor-to-asignacionTipoTutoria.js'),('20240609050321-update-derivacion-table.js'),('20240612172114-add-password-reset-token.js'),('20240613044253-create-encuesta.js'),('20240613193841-add-fk-estado-compromiso-to-compromiso-cita.js'),('20240613195746-add-relationship-resultado-cita-sesion-cita.js'),('20240613210417-add-estado-encuesta.js'),('20240613210536-add-fid-estado-encuesta-to-encuesta.js'),('20240617031435-create-asistencia-cita-table.js'),('20240619055356-add-relationships-to-derivacion.js'),('20240619061411-add-timestamps-to-asistencia-cita.js'),('20240619173700-create-notificaciones.js'),('20240619182541-rename-columns-notificaciones.js'),('20240619194449-remove-unnecessary-columns-from-notificaciones.js'),('20240620002033-create-EstadoEncuestaMaestra.js'),('20240620002121-create-EncuestaMaestra.js'),('20240620002547-create-historial-citas.js'),('20240620002704-modify-Encuestas.js'),('20240620003918-create-EncuestaV2.js'),('20240620044825-add-cita-details-to-notificaciones.js'),('20240621191037-add-fid_facultad-to-derivacion.js'),('20240626064341-change-blob-notas.js'),('20240626224547-create-pregunta.js'),('20240627005230-create-opcion.js'),('20240627005304-create-respuesta.js'),('20240627032814-rename-fid-coord-to-fid-facultad.js'),('20240627210911-add-esActivo-to-Respuesta.js'),('20240629060907-add-nuevas-tablas.js'),('20240629070803-seed-opcion-pregunta.js'),('20240630035027-add-field-create-date-encuesta.js'),('20240701192326-add-audit-table.js'),('20240701213253-allow-performedBy-null.js'),('20240701213619-add-timestamps-to-alumno-sesion-cita.js'),('20240705132804-add-performedBy-foreign-key-to-audit.js'),('20240705142806-create-institucion.js'),('20240706063632-modify-logo-field.js'),('20240708010036-create-error-log.js');
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
  `fid_alumno` int DEFAULT NULL,
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
  `motivoRechazo` varchar(255) DEFAULT NULL,
  `temp_uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id_cita`),
  KEY `fid_tutor` (`fid_tutor`),
  KEY `fid_alumno` (`fid_alumno`),
  KEY `fid_estado_cita` (`fid_estado_cita`),
  KEY `SesionCita_fid_tipoModalidad_foreign_idx` (`fid_tipoModalidad`),
  KEY `fk_sesion_cita_resultado` (`fid_resultado`),
  CONSTRAINT `fk_sesion_cita_resultado` FOREIGN KEY (`fid_resultado`) REFERENCES `ResultadoCita` (`id_resultado`),
  CONSTRAINT `SesionCita_fid_tipoModalidad_foreign_idx` FOREIGN KEY (`fid_tipoModalidad`) REFERENCES `TipoModalidad` (`id_tipoModalidad`),
  CONSTRAINT `SesionCita_ibfk_1` FOREIGN KEY (`fid_tutor`) REFERENCES `Usuario` (`id_usuario`),
  CONSTRAINT `SesionCita_ibfk_2` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`),
  CONSTRAINT `SesionCita_ibfk_3` FOREIGN KEY (`fid_estado_cita`) REFERENCES `EstadoCita` (`id_estado_cita`)
) ENGINE=InnoDB AUTO_INCREMENT=332 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SesionCita`
--

LOCK TABLES `SesionCita` WRITE;
/*!40000 ALTER TABLE `SesionCita` DISABLE KEYS */;

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
  CONSTRAINT `SolicitudTutorFijo_fid_tutor_foreign_idx` FOREIGN KEY (`fid_tutor`) REFERENCES `Usuario` (`id_usuario`),
  CONSTRAINT `SolicitudTutorFijo_ibfk_1` FOREIGN KEY (`fid_alumno`) REFERENCES `Usuario` (`id_usuario`),
  CONSTRAINT `SolicitudTutorFijo_ibfk_2` FOREIGN KEY (`fid_estadoSolicitud`) REFERENCES `EstadoSolicitudTutorFijo` (`id_estadoSolicitud`),
  CONSTRAINT `SolicitudTutorFijo_ibfk_3` FOREIGN KEY (`fid_tipoTutoria`) REFERENCES `TipoTutoria` (`id_tipoTutoria`)
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SolicitudTutorFijo`
--

LOCK TABLES `SolicitudTutorFijo` WRITE;
/*!40000 ALTER TABLE `SolicitudTutorFijo` DISABLE KEYS */;

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
  CONSTRAINT `TipoTutoria_fid_facultad_foreign_idx` FOREIGN KEY (`fid_facultad`) REFERENCES `Facultad` (`id_facultad`),
  CONSTRAINT `TipoTutoria_fid_programa_foreign_idx` FOREIGN KEY (`fid_programa`) REFERENCES `Programa` (`id_programa`),
  CONSTRAINT `TipoTutoria_ibfk_1` FOREIGN KEY (`fid_tipoObligatoriedad`) REFERENCES `TipoObligatoriedad` (`id_tipoObligatoriedad`),
  CONSTRAINT `TipoTutoria_ibfk_2` FOREIGN KEY (`fid_tipoPermanencia`) REFERENCES `TipoPermanencia` (`id_tipoPermanencia`),
  CONSTRAINT `TipoTutoria_ibfk_3` FOREIGN KEY (`fid_tipoTutor`) REFERENCES `TipoTutor` (`id_tipoTutor`),
  CONSTRAINT `TipoTutoria_ibfk_4` FOREIGN KEY (`fid_tipoFormato`) REFERENCES `TipoFormato` (`id_tipoFormato`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TipoTutoria`
--

LOCK TABLES `TipoTutoria` WRITE;
/*!40000 ALTER TABLE `TipoTutoria` DISABLE KEYS */;

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
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UnidadAcademica`
--

LOCK TABLES `UnidadAcademica` WRITE;
/*!40000 ALTER TABLE `UnidadAcademica` DISABLE KEYS */;

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
  CONSTRAINT `Usuario_fid_facultad_foreign_idx` FOREIGN KEY (`fid_facultad`) REFERENCES `Facultad` (`id_facultad`),
  CONSTRAINT `Usuario_fid_programa_foreign_idx` FOREIGN KEY (`fid_programa`) REFERENCES `Programa` (`id_programa`)
) ENGINE=InnoDB AUTO_INCREMENT=290 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
INSERT INTO `Usuario` VALUES (1,'Brando','Rojas','Romero','a20191088@pucp.edu.pe','$2a$10$0EXmdEHmmVjNweWb760eE.PohP3dYhecWoL1MU9yGsCf9jJwfp0fy',1,'20191088','https://ui-avatars.com/api/?name=B&color=fff&background=452C07&size=100','2024-07-08 03:34:10','2024-07-08 03:34:10',NULL,NULL);
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'MentifyNuevo'
--

--
-- Dumping routines for database 'MentifyNuevo'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-10 21:34:12
INSERT INTO `Roles_Usuario` (`id_usuario`, `id_rol`, `es_activo`) VALUES ('1', '6', '1');