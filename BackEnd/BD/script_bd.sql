SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS SesionCita;
DROP TABLE IF EXISTS Derivacion;
DROP TABLE IF EXISTS ResultadoCita;
DROP TABLE IF EXISTS EstadoCita;
DROP TABLE IF EXISTS EstadoCompromiso;
DROP TABLE IF EXISTS TipoTutoria;
DROP TABLE IF EXISTS TipoFormato;
DROP TABLE IF EXISTS TipoPermanencia;
DROP TABLE IF EXISTS TipoModalidad;
DROP TABLE IF EXISTS TipoTutor;
DROP TABLE IF EXISTS TipoObligatoriedad;
DROP TABLE IF EXISTS AsignacionTutorAlumno;
DROP TABLE IF EXISTS Solicitud;
DROP TABLE IF EXISTS AsignacionTipoTutoria;
DROP TABLE IF EXISTS EstadoSolicitud;
DROP TABLE IF EXISTS TipoSolicitud;
DROP TABLE IF EXISTS Programa;
DROP TABLE IF EXISTS Facultad;
DROP TABLE IF EXISTS UnidadesAcademicas;
DROP TABLE IF EXISTS Disponiblidad;
DROP TABLE IF EXISTS Calendario;
DROP TABLE IF EXISTS HistoricoAcademico;
DROP TABLE IF EXISTS AsistentePrograma;
DROP TABLE IF EXISTS CoordinadorPrograma;
DROP TABLE IF EXISTS Tutor;
DROP TABLE IF EXISTS Alumno;
DROP TABLE IF EXISTS AsistenteFacultad;
DROP TABLE IF EXISTS CoordinadorFacultad;
DROP TABLE IF EXISTS AdminGeneral;
DROP TABLE IF EXISTS Login;
DROP TABLE IF EXISTS Usuario;



-- ------------------------------------------------------------
-- TODO LO QUE SEA NOMBRES VARCHAR 50
-- TODO LO QUE SEA DESCRIPCIONES VARCHAR 255

-- ------------------------------------------------------
-- Paquete Rojo


-- -----------------------------------------------------
-- Table Usuario
-- -----------------------------------------------------
CREATE TABLE Usuario (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NULL,
  `codigo` VARCHAR(10) NULL,
  `nombres` VARCHAR(150) NULL,
  `apellidos` VARCHAR(150) NULL,
  `esActivo` TINYINT NULL,
  `fechaCreacion` TIMESTAMP(1) NULL,
  `fechaUltimaActualizacion` TIMESTAMP(1) NULL,
  PRIMARY KEY (`idUsuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Login`
-- -----------------------------------------------------
CREATE TABLE Login (
  `idLogin` INT NOT NULL AUTO_INCREMENT,
  `idGoogle` VARCHAR(200) NULL,
  `contrasena` VARCHAR(100) NULL,
  `esActivo` TINYINT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idLogin`, `idUsuario`)
    )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AdminGeneral`
-- -----------------------------------------------------
CREATE TABLE AdminGeneral (
  `idAdminGeneral` INT NOT NULL AUTO_INCREMENT,
  `esActivo` TINYINT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idAdminGeneral`, `idUsuario`)
  )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AsistenteFacultad`
-- -----------------------------------------------------
CREATE TABLE AsistenteFacultad (
  `idAsistenteFacultad` INT NOT NULL AUTO_INCREMENT,
  `esActivo` TINYINT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idAsistenteFacultad`, `idUsuario`)
  )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CoordinadorFacultad`
-- -----------------------------------------------------
CREATE TABLE CoordinadorFacultad (
  `idCoordinadorFacultad` INT NOT NULL AUTO_INCREMENT,
  `esActivo` TINYINT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idCoordinadorFacultad`, `idUsuario`)
  )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AsistentePrograma`
-- -----------------------------------------------------
CREATE TABLE AsistentePrograma (
  `idAsistentePrograma` INT NOT NULL AUTO_INCREMENT,
  `esActivo` TINYINT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idAsistentePrograma`, `idUsuario`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CoordinadorPrograma`
-- -----------------------------------------------------
CREATE TABLE CoordinadorPrograma (
  `idCoordinadorPrograma` INT NOT NULL AUTO_INCREMENT,
  `esActivo` TINYINT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idCoordinadorPrograma`, `idUsuario`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tutor`
-- -----------------------------------------------------
CREATE TABLE Tutor (
  `idTutor` INT NOT NULL AUTO_INCREMENT,
  `esActivo` TINYINT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idTutor`, `idUsuario`)
  )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Alumno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Alumno` (
  `idAlumno` INT NOT NULL AUTO_INCREMENT,
  `esActivo` TINYINT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idAlumno`, `idUsuario`)
  )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Disponiblidad`
-- -----------------------------------------------------
CREATE TABLE Disponiblidad (
  `idDisponiblidad` INT NOT NULL AUTO_INCREMENT,
  `fechahoraInicio` TIMESTAMP(1) NULL,
  `fechahoraFin` TIMESTAMP(1) NULL,
  `esActivo` TINYINT NULL,
  `idTutor` INT NULL,
  PRIMARY KEY (`idDisponiblidad`)
  )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Calendario`
-- -----------------------------------------------------
CREATE TABLE Calendario (
  `idCalendario` INT NOT NULL AUTO_INCREMENT,
  `esActivo` TINYINT NULL,
  PRIMARY KEY (`idCalendario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `HistoricoAcademico`
-- -----------------------------------------------------
CREATE TABLE HistoricoAcademico (
  `idHistoricoAcademico` INT NOT NULL AUTO_INCREMENT,
  `archivoNotas` LONGBLOB NULL,
  `fechaCreacion` TIMESTAMP(1) NULL,
  `fechaUltActualizacion` TIMESTAMP(1) NULL,
  `creadoPor` INT NULL,
  `ultActualizacionPor` INT NULL,
  PRIMARY KEY (`idHistoricoAcademico`))
ENGINE = InnoDB;

-- -------------------------------------------------
-- Paquete Verde 

CREATE TABLE EstadoCita (
    id_estado_cita INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    descripcion VARCHAR(255),
    es_Activo TINYINT
)ENGINE=InnoDB;

CREATE TABLE ResultadoCita (
   id_resultado INT PRIMARY KEY AUTO_INCREMENT,
   compromisos INT, -- este es un fid a EstadoCompromiso
   asistencia TINYINT,
   es_derivado TINYINT,
   es_activo TINYINT
)ENGINE=InnoDB;

CREATE TABLE Derivacion (
    id_derivacion INT PRIMARY KEY AUTO_INCREMENT,
    fid_tutor INT,
    fid_alumno INT,
    documento BLOB,
    observaciones VARCHAR(255),
    fid_unidad_academica INT,
    fecha_derivacion TIMESTAMP,
    fecha_actualizado TIMESTAMP,
    es_activo TINYINT
)ENGINE=InnoDB;

CREATE TABLE EstadoCompromiso (
   id_estado_compromiso INT PRIMARY KEY AUTO_INCREMENT,
   nombre VARCHAR(50),
   descripcion VARCHAR(255),
   es_activo TINYINT
)ENGINE=InnoDB;

CREATE TABLE SesionCita(
   id_estado_compromiso INT PRIMARY KEY AUTO_INCREMENT,
   fid_tutor INT,
   fid_alumno INT,
   fid_tipoTutoria INT,
   fid_resultado INT,
   fid_derivacion INT,
   modalidad INT, -- este es un fid a TIPOMODALIDAD
   lugar_link VARCHAR(255),
   tiempo_inicio TIMESTAMP,
   tiempo_fin TIMESTAMP,
   estado INT, -- este es un fid a Estado
   es_activo TINYINT,
   fecha_creacion TIMESTAMP,
   fecha_actualización TIMESTAMP,
   creado_por INT,
   actualizado_por INT
)ENGINE=InnoDB;


-- -----------------------------------------------------------

-- PAQUETE MORADO

CREATE TABLE TipoTutoria(
    id_tipoTutoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    tipo_obligatoriedad INT, -- este es un fid A TipoObligatoriedad
    permanencia INT, -- este es otro fid a tipopermanencia
    tipo_tutor INT, -- otro fid a tipo tutor
    formato INT, -- fid a tipo formato
    es_activo TINYINT
)ENGINE=InnoDB;


CREATE TABLE TipoFormato(
    id_tipoFormato INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    descripcion VARCHAR(255),
    es_activo TINYINT
)ENGINE=InnoDB;


CREATE TABLE TipoPermanencia(
    id_tipoPermanencia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    descripcion VARCHAR(255),
    es_activo TINYINT
)ENGINE=InnoDB;


CREATE TABLE TipoModalidad(
    id_tipo_modalidad INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    descripcion VARCHAR(255),
    es_activo TINYINT  
)ENGINE=InnoDB;


CREATE TABLE TipoTutor(
    id_tipoTutor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    descripcion VARCHAR(255),
    es_activo TINYINT
)ENGINE=InnoDB;


CREATE TABLE TipoObligatoriedad(
    id_tipoObligatoriedad INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    descripcion VARCHAR(255),
    es_activo TINYINT
)ENGINE=InnoDB;


CREATE TABLE AsignacionTutorAlumno(-- -PURO FID A OTRAS TABLAS
    fid_asignacionTutorAlumno INT,
    fid_alumno INT,
    fid_tutor INT,
    fid_tipoTutoria INT,
    fid_solicitud INT,
    es_activo TINYINT
)ENGINE=InnoDB;


CREATE TABLE Solicitud(
    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    fid_alumno INT, -- fid a tabla alumno
    tipo INT, -- -fid a tiposolicitud
    es_rechazado TINYINT,
    motivo_rechazo VARCHAR(255),
    estado INT, -- -FID ESTADOSOLICITUD
    fecha_registro TIMESTAMP,
    fecha_cierre TIMESTAMP,
    es_activo TINYINT
)ENGINE=InnoDB;

CREATE TABLE AsignacionTipoTutoria(
    id_asignacionTipoTutoria INT PRIMARY KEY AUTO_INCREMENT,
    fid_coordinador_programa INT, -- fid a coordinador programa
    fid_usuario INT, -- fid usuario
    fid_tipoTutoria INT, -- fid tipo tutoria --
    es_activo TINYINT
)ENGINE=InnoDB;

CREATE TABLE EstadoSolicitud(
    id_estadoSolicitud INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    descripcion VARCHAR(255),
    es_activo TINYINT
)ENGINE=InnoDB;

CREATE TABLE TipoSolicitud(
    id_tipo_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    descripcion VARCHAR(255),
    es_activo TINYINT
)ENGINE=InnoDB;


-- --------------------------------------------------------

-- PAQUETE AMARILLO

CREATE TABLE Programa(
    id_programa INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    fid_coordinador_programa INT, -- fid coordinador
    es_activo TINYINT
)ENGINE=InnoDB;


CREATE TABLE  Facultad(
    id_facultad INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    fid_coordinador_facultad INT, -- fid coord
    es_activo TINYINT
)ENGINE=InnoDB;


CREATE TABLE UnidadesAcademicas(
    id_unidad_academica INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(50),
    descripcion VARCHAR(255),
    es_activo TINYINT
)ENGINE=InnoDB;


ALTER TABLE Login ADD FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario);
ALTER TABLE AdminGeneral ADD FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario);
ALTER TABLE AsistenteFacultad ADD FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario);
ALTER TABLE CoordinadorFacultad ADD FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario);
ALTER TABLE AsistentePrograma ADD FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario);
ALTER TABLE CoordinadorPrograma ADD FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario);
ALTER TABLE Tutor ADD FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario);
ALTER TABLE Alumno ADD FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario);
ALTER TABLE Disponiblidad ADD FOREIGN KEY (idTutor) REFERENCES Tutor(idTutor);

ALTER TABLE SesionCita ADD FOREIGN KEY (fid_tutor) REFERENCES Tutor(idTutor);
ALTER TABLE SesionCita ADD FOREIGN KEY (fid_alumno) REFERENCES Alumno(idAlumno);
ALTER TABLE SesionCita ADD FOREIGN KEY (fid_tipoTutoria) REFERENCES TipoTutoria(id_tipoTutoria);
ALTER TABLE SesionCita ADD FOREIGN KEY (fid_resultado) REFERENCES ResultadoCita(id_resultado);
ALTER TABLE SesionCita ADD FOREIGN KEY (fid_derivacion) REFERENCES Derivacion(id_derivacion);
ALTER TABLE SesionCita ADD FOREIGN KEY (modalidad) REFERENCES TipoModalidad(id_tipo_modalidad);
ALTER TABLE SesionCita ADD FOREIGN KEY (estado) REFERENCES EstadoCita(id_estado_cita);

ALTER TABLE ResultadoCita ADD FOREIGN KEY (compromisos) REFERENCES EstadoCompromiso(id_estado_compromiso);

ALTER TABLE Derivacion ADD FOREIGN KEY (fid_tutor) REFERENCES Tutor(idTutor);
ALTER TABLE Derivacion ADD FOREIGN KEY (fid_alumno) REFERENCES Alumno(idAlumno);
ALTER TABLE Derivacion ADD FOREIGN KEY (fid_unidad_academica) REFERENCES UnidadesAcademicas(id_unidad_academica);



ALTER TABLE TipoTutoria ADD FOREIGN KEY (tipo_obligatoriedad) REFERENCES TipoObligatoriedad(id_tipoObligatoriedad);
ALTER TABLE AsignacionTutorAlumno ADD FOREIGN KEY (fid_asignacionTutorAlumno) REFERENCES CoordinadorPrograma(idCoordinadorPrograma);
ALTER TABLE AsignacionTutorAlumno ADD FOREIGN KEY (fid_alumno) REFERENCES Alumno(idAlumno);
ALTER TABLE AsignacionTutorAlumno ADD FOREIGN KEY (fid_tutor) REFERENCES Tutor(idTutor);
ALTER TABLE AsignacionTutorAlumno ADD FOREIGN KEY (fid_tipoTutoria) REFERENCES TipoTutoria(id_tipoTutoria);
ALTER TABLE AsignacionTutorAlumno ADD FOREIGN KEY (fid_solicitud) REFERENCES Solicitud(id_solicitud);
ALTER TABLE Solicitud ADD FOREIGN KEY (fid_alumno) REFERENCES Alumno(idAlumno);
ALTER TABLE Solicitud ADD FOREIGN KEY (tipo) REFERENCES TipoSolicitud(id_tipo_solicitud);
ALTER TABLE Solicitud ADD FOREIGN KEY (estado) REFERENCES EstadoSolicitud(id_estadoSolicitud);
ALTER TABLE AsignacionTipoTutoria ADD FOREIGN KEY (fid_coordinador_programa) REFERENCES CoordinadorPrograma(idCoordinadorPrograma);
ALTER TABLE AsignacionTipoTutoria ADD FOREIGN KEY (fid_usuario) REFERENCES Usuario(idUsuario);
ALTER TABLE AsignacionTipoTutoria ADD FOREIGN KEY (fid_tipoTutoria) REFERENCES TipoTutoria(id_tipoTutoria);
ALTER TABLE Programa ADD FOREIGN KEY (fid_coordinador_programa) REFERENCES CoordinadorPrograma(idCoordinadorPrograma);
ALTER TABLE Facultad ADD FOREIGN KEY (fid_coordinador_facultad) REFERENCES CoordinadorFacultad(idCoordinadorFacultad); 
