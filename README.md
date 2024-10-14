
# API Endpoints

## Usuarios

### Crear Usuario

- **URL:** `POST http://localhost:5000/api/v1/usuario/register`
- **Body:**
  ```json
  {
    "nombres": "Hernando Humberto",
    "primerApellido": "Garcia",
    "segundoApellido": "Reyes",
    "email": "hgarcia@pucp.edu.pe",
    "contrasenha": "abcd1234",
    "es_Activo": true,
    "codigo": "20002563"
  }
  ```

### Asignar Rol a Usuario
- **URL:** `POST http://localhost:5000/api/v1/rolesUsuario/rol`
- **Body:**
  ```json
  {
    "id_usuario": 15,
    "id_rol": 6
  }
  ```

### Listar Todos los Usuarios
- **URL:** `GET http://localhost:5000/api/v1/usuario/listar-todos`

### Eliminar Usuario
- **URL:** `DELETE http://localhost:5000/api/v1/usuario/:id`

### Actualizar Datos de Usuario
- **URL:** `PUT http://localhost:5000/api/v1/usuario/:id`
- **Body:**
  ```json
  {
    "email": "datosActualizados.email",
    "codigo": "datosActualizados.codigo",
    "nombres": "datosActualizados.nombres",
    "apellidos": "datosActualizados.apellidos"
  }
  ```

### Listar Usuarios por Tipo de Rol
- **URL:** `GET http://localhost:5000/api/v1/usuario/rol/:nombreRol`

### Obtener Roles por Usuario
- **URL:** `GET http://localhost:5000/api/v1/usuario/:id/roles`

## Facultad

### Agregar Facultad y Asignarle su Coordinador
- **URL:** `POST http://localhost:5000/api/v1/facultad/registrar`
- **Body:**
  ```json
  {
    "id": "1",
    "code": "20201280",
    "name": "Alberto Renato",
    "apellidos": "Castillo Alarcon",
    "email": "alberto.castillo@pucp.edu.pe",
    "isSelectedFromSearch": false,
    "facultadNombre": "Facultad de Ciencias Contables"
  }
  ```

### Listar Facultades
- **URL:** `GET http://localhost:5000/api/v1/facultad/listar-todos`

### Actualizar Facultad por ID
- **URL:** `PUT http://localhost:5000/api/v1/facultad/:id`
- **Body:**
  ```json
  {
    "nombre": "Ciencias e Ingenieria",
    "fid_usuario": 1,
    "esActivo": true
  }
  ```

### Eliminar Facultad
- **URL:** `DELETE http://localhost:5000/api/v1/facultad/eliminar`
- **Body:**
  ```json
  {
    "id": "32",
    "nombre": "Facultad de Arquitectura"
  }
  ```

### Editar Facultad
- **URL:** `POST http://localhost:5000/api/v1/facultad/editar`
- **Body:**
  ```json
  {
    "facultadId": "16",
    "facultadNombre": "",
    "coordinatorData": {
      "id": "",
      "codigo": "20215678",
      "nombres": "Marco Elmer",
      "primerApellido": "Miranda",
      "segundoApellido": "Tevez",
      "email": "marco.miranda@pucp.edu.pe"
    }
  }
  ```

### Obtener Programas de una Facultad
- **URL:** `GET http://localhost:5000/api/v1/facultad/obtenerProgramas/1`
- **Body:**
- **Salida:**
```json
  {[
    {
        "id_programa": 1,
        "nombre": "Ingeniería Informática",
        "esActivo": 1,
        "Facultad": {
            "id_facultad": 1,
            "nombre": "Ciencias e Ingeniería"
        },
        "Encargado": {
            "id_usuario": 2,
            "email": "pena.branny@pucp.edu.pe",
            "nombres": "Branny",
            "primerApellido": "Pena",
            "segundoApellido": "Alejandro",
            "imagen": "https://ui-avatars.com/api/?name=B&color=fff&background=7872D1&size=100"
        }
    },
    {
        "id_programa": 2,
        "nombre": "Ingeniería Civil",
        "esActivo": 1,
        "Facultad": {
            "id_facultad": 1,
            "nombre": "Ciencias e Ingeniería"
        },
        "Encargado": {
            "id_usuario": 9,
            "email": "jfsuarez@pucp.edu.pe",
            "nombres": "Jeanpierr Francisco",
            "primerApellido": "Suarez",
            "segundoApellido": "Facundo",
            "imagen": "https://ui-avatars.com/api/?name=J&color=fff&background=344C00&size=100"
        }
    }]
```

## Programa

### Agregar un Programa con su Coordinador
- **URL:** `POST http://localhost:5000/api/v1/programa/registrar`
- **Body:**
  ```json
  {
        "idFacultad": "2",
        "code": "20200000",
        "name": "Alberto Rodrigo ",
        "apellidos":"Aquino Capcha",
        "email": "alberto.aquino@pucp.edu.pe",
        "isSelectedFromSearch":false,
        "programaNombre":"Ingeniería Geológica"
    }
  ```

### Eliminar un Programa con sus Referencias
- **URL:** `DELETE http://localhost:5000/api/v1/programa/eliminar`
- **Body:**
  ```json
  {
    "id": "32",
    "nombre": "Facultad de Arquitectura"
  }
  ```
## Unidad Académica

### Registrar Unidad Académica
- **URL:** `POST http://localhost:5000/api/v1/unidadAcademica/register`
- **Body:**
  ```json
  {
    "nombre": "Nombre de la Unidad Académica",
    "descripcion": "Descripción breve de la unidad",
    "siglas": "Siglas de la Unidad",
    "correoDeContacto": "correo@ejemplo.com",
    "fid_usuario": 1  // ID del usuario que será el encargado (opcional)
  }
  ```

### Listar Unidades Académicas
- **URL:** `GET http://localhost:5000/api/v1/unidadAcademica/listar-todos`

### Obtener Datos de Unidad Académica con su ID
- **URL:** `GET http://localhost:5000/api/v1/unidadAcademica/{id}`

### Actualizar Unidad Académica y su Coordinador
- **URL:** `PUT http://localhost:5000/api/v1/unidadAcademica/editar/{id}`
- **Body:**
  ```json
  {
    "unidadData": {
      "nombre": "Nuevo Nombre",
      "descripcion": "Nueva Descripción",
      "siglas": "Nuevas Siglas",
      "correoDeContacto": "nuevo_correo@example.com",
      "esActivo": false
    },
    "fid_usuario": 3
  }
  ```

### Eliminar Lógicamente Unidad Académica
- **URL:** `DELETE http://localhost:5000/api/v1/unidadAcademica/{id}`
- **Output esperado:**
  ```json
  {
    "message": "Unidad Académica eliminada con éxito"
  }
  ```

## Paginación de Listados

### Listar Facultades con Paginación
- **URL:** `POST http://localhost:5000/api/v1/facultad/listar-paginacion`
- **Body:**
  ```json
  {
    "page": 1,
    "pageSize": 9,
    "sortBy": "fechaCreacion",
    "sortOrder": "DESC"
  }
 

 ```

### Listar Programas con Paginación
- **URL:** `POST http://localhost:5000/api/v1/programa/listar-paginacion`
- **Body:**
  ```json
  {
    "page": 1,
    "pageSize": 9,
    "sortBy": "fechaCreacion",
    "sortOrder": "DESC"
  }
  ```

### Listar Usuarios por Rol con Paginación
- **URL:** `POST http://localhost:5000/api/v1/usuario/listar-usuarios-por-rol-paginado`
- **Body:**
  ```json
  {
    "role": "Alumno",
    "page": 1,
    "pageSize": 9,
    "sortBy": "codigo",
    "sortOrder": "DESC",
    "searchCriterias": [
        {
            "field": "codigo",
            "value": "2020"
        }
    ]
  }
  ```

### Listar Unidades Académicas con Paginación
- **URL:** `POST http://localhost:5000/api/v1/unidadAcademica/listar-paginacion`
- **Body:**
  ```json
  {
    "page": 1,
    "pageSize": 10,
    "sortBy": "fechaCreacion",
    "sortOrder": "DESC"
  }
  ```


### Editar una cita
**URL:** `POST http://localhost:5000/api/v1/sesionCita/editar/:id`
 **Body:**
  ```json
 {
    "fechaHoraInicio": "2024-05-31T17:00:00-05:00",
    "fechaHoraFin": "2024-05-31T17:00:00-06:00",
    "modalidad": "Presencial",
    "lugar_link": "705"
}



### Cancelar una cita
**URL:** `POST http://localhost:5000/api/v1/sesionCita/eliminar/:id`

  **Output esperado:**
  ```json
 {
    "message": "Sesion Cita Eliminada",
    "resultado": {
        "message": "Cita cancelada correctamente"
    }
}
### Listar las citas de un tutor ( programadas y canceladas en arreglos distintos)
**URL:** `GET http://localhost:5000/api/v1/sesionCita/listarCitasTutor/`

  
  ```json
 {
    "idTutor": "12"
}

## Sidebar

### Registrar Opción en el Sidebar
- **URL:** `POST http://localhost:5000/api/v1/registrar-opcion-sidebar/`
- **Body:**
  ```json
  {
    "label": "Gestion de usuarios",
    "icon": "Users",
    "componentId": "",
    "children": [
      {


        "label": "Alumnos",
        "icon": "",
        "componentId": "alumnos"
      },
      {
        "label": "Coordinadores",
        "icon": "",
        "componentId": "alumnos"
      }
    ]
  }
  ```

### Asociar Opciones Rol
- **URL:** `POST http://localhost:5000/api/v1/asociar-opciones-rol/`
- **Body:**
  ```json
  {
    "idRol": 6,
    "opcionesSidebar": [5]
  }
  ```

### Obtener Sidebar Options
- **URL:** `GET http://localhost:5000/api/v1/sidebar-options/`


1. **Crear un TipoTutor**

  - **URL:** `POST http://localhost:5000/api/v1/tipoTutor/`
  - **Body:**
    ```json
    {
      "nombre": "Tutor Académico",
      "descripcion": "Tutor encargado del área académica"
    }
    ```

2. **Listar todos los TipoTutores**

  - **URL:** `GET http://localhost:5000/api/v1/tipoTutor/`

3. **Obtener un TipoTutor por ID**

  - **URL:** `GET http://localhost:5000/api/v1/tipoTutor/{id}`

4. **Actualizar un TipoTutor**

  - **URL:** `PUT http://localhost:5000/api/v1/tipoTutor/{id}`
  - **Body:**
    ```json
    {
      "nombre": "Tutor Académico Actualizado",
      "descripcion": "Descripción actualizada"
    }
    ```

5. **Eliminar lógicamente un TipoTutor**

  - **URL:** `DELETE http://localhost:5000/api/v1/tipoTutor/{id}`

1. **Crear un TipoFormato**

   - **URL:** `POST http://localhost:5000/api/v1/tipoFormato/`
   - **Body:**
     ```json
     {
       "nombre": "Formato A",
       "descripcion": "Formato de tipo A"
     }
     ```

2. **Listar todos los TipoFormato**

   - **URL:** `GET http://localhost:5000/api/v1/tipoFormato/`

3. **Obtener un TipoFormato por ID**

   - **URL:** `GET http://localhost:5000/api/v1/tipoFormato/{id}`

4. **Actualizar un TipoFormato**

   - **URL:** `PUT http://localhost:5000/api/v1/tipoFormato/{id}`
   - **Body:**
     ```json
     {
       "nombre": "Formato A Actualizado",
       "descripcion": "Descripción actualizada"
     }
     ```

5. **Eliminar lógicamente un TipoFormato**

   - **URL:** `DELETE http://localhost:5000/api/v1/tipoFormato/{id}`

1. **Crear un TipoObligatoriedad**

   - **URL:** `POST http://localhost:5000/api/v1/tipoObligatoriedad/`
   - **Body:**
     ```json
     {
       "nombre": "Obligatorio",
       "descripcion": "Obligatoriedad del tipo de tutoría"
     }
     ```

2. **Listar todos los TipoObligatoriedad**

   - **URL:** `GET http://localhost:5000/api/v1/tipoObligatoriedad/`

3. **Obtener un TipoObligatoriedad por ID**

   - **URL:** `GET http://localhost:5000/api/v1/tipoObligatoriedad/{id}`

4. **Actualizar un TipoObligatoriedad**

   - **URL:** `PUT http://localhost:5000/api/v1/tipoObligatoriedad/{id}`
   - **Body:**
     ```json
     {
       "nombre": "Obligatorio Actualizado",
       "descripcion": "Descripción actualizada"
     }
     ```

5. **Eliminar lógicamente un TipoObligatoriedad**

   - **URL:** `DELETE http://localhost:5000/api/v1/tipoObligatoriedad/{id}`

1. **Crear un TipoPermanencia**

   - **URL:** `POST http://localhost:5000/api/v1/tipoPermanencia/`
   - **Body:**
     ```json
     {
       "nombre": "Permanente",
       "descripcion": "Permanencia del tipo de tutoría"
     }
     ```

2. **Listar todos los TipoPermanencia**

   - **URL:** `GET http://localhost:5000/api/v1/tipoPermanencia/`

3. **Obtener un TipoPermanencia por ID**

   - **URL:** `GET http://localhost:5000/api/v1/tipoPermanencia/{id}`

4. **Actualizar un TipoPermanencia**

   - **URL:** `PUT http://localhost:5000/api/v1/tipoPermanencia/{id}`
   - **Body:**
     ```json
     {
       "nombre": "Permanente Actualizado",
       "descripcion": "Descripción actualizada"
     }
     ```

5. **Eliminar lógicamente un TipoPermanencia**

   - **URL:** `DELETE http://localhost:5000/api/v1/tipoPermanencia/{id}`

1. **Crear un TipoTutoria**

   - **URL:** `POST http://localhost:5000/api/v1/tipoTutoria/` ( Inserta null al fid_tipoTutor si es una tutoría grupal)
   - **Body:**
     ```json
     {
       "nombre":"Segunda Matricula",
       "id_tipoObligatoriedad": 1,
       "id_tipoPermanencia": "1",
       "id_tipoTutor": "",
       "id_tipoFormato": "2"
     }
     ```

2. **Listar todos los TipoTutoria**

   - **URL:** `GET http://localhost:5000/api/v1/tipoTutoria/`

3. **Listar todos los TipoTutoria por Rol (Alumno/Tutor)**

   - **URL:** `POST http://localhost:5000/api/v1/tipoTutoria/listar-tipos-tutoria-asignados`
   - **Body:**
     ```json
      {
        "codigoUsuario": "57689234",
        "rol": "Tutor"
      }
     ```

4. **Obtener un TipoTutoria por ID**

   - **URL:** `GET http://localhost:5000/api/v1/tipoTutoria/{id}`

5. **Actualizar un TipoTutoria**

   - **URL:** `PUT http://localhost:5000/api/v1/tipoTutoria/{id}`
   - **Body:**
     ```json
     {
       "nombre": "Tutoria Académica Actualizada",
       "id_tipoObligatoriedad": 2,
       "id_tipoPermanencia": 2,
       "id_tipoTutor": 2,
       "id_tipoFormato": 2
     }
     ```

6. **Eliminar lógicamente un TipoTutoria**

   - **URL:** `DELETE http://localhost:5000/api/v1/tipoTutoria/{id}`




1. **Crear una AsignacionTipoTutoria (para Tutor)**

   - **URL:** `POST http://localhost:5000/api/v1/asignacionTipoTutoria/asignar-tipo-tutoria-tutor`
   - **Body:**
     ```json
      {
        "codigoUsuario":"64528139",
        "nombreTipoTutoria":"Tipo"
      }
     ```

2. **Listar todas las AsignacionTipoTutoria**

   - **URL:** `GET http://localhost:5000/api/v1/asignacionTipoTutoria/`

3. **Obtener una AsignacionTipoTutoria por ID**

   - **URL:** `GET http://localhost:5000/api/v1/asignacionTipoTutoria/{id}`

4. **Actualizar una AsignacionTipoTutoria**

   - **URL:** `PUT http://localhost:5000/api/v1/asignacionTipoTutoria/{id}`
   - **Body:**
     ```json
     {
       "fid_tutor": 2,
       "fid_tipoTutoria": 2
     }
     ```

5. **Eliminar lógicamente una AsignacionTipoTutoria**

   - **URL:** `DELETE http://localhost:5000/api/v1/asignacionTipoTutoria/{id}`

4. **Listar todos los alumnos de un tipo de tutoría**

   - **URL:** `POST http://localhost:5000/api/v1/asignacionTipoTutoria/listar-alumnos-todos-por-tipoTutoria/{page}`
   - **Body:**
     ```json
     {
    "idTipoDeTutoria":66,
    "pageSize":10,
    "searchCriterias":[
        {
            "field":"",
            "value":""
        }
    ],
    "sortBy":"fechaCreacion",
    "sortOrder":"DESC"
}


1. **Crear una AsignacionTutorAlumno (Es necesario tener la solicitud) (Asigna TipoTutoria al Alumno y asigna el Tutor al Alumno)**



   - **URL:** `POST http://localhost:5000/api/v1/asignacionTutorAlumno/asignar-tipo-tutoria-alumno`
   - **Body:**
     ```json
     {
          "codigoAlumno": "....",
          "codigoTutor": ".....",
          "nombreTipoTutoria": "....",
          "id_solicitud": "..."
      }
     ```

2. **Listar todas las AsignacionTutorAlumno**

   - **URL:** `GET http://localhost:5000/api/v1/asignacionTutorAlumno/`

3. **Obtener una AsignacionTutorAlumno por ID**

   - **URL:** `GET http://localhost:5000/api/v1/asignacionTutorAlumno/{id}`

4. **Actualizar una AsignacionTutorAlumno**

   - **URL:** `PUT http://localhost:5000/api/v1/asignacionTutorAlumno/{id}`
   - **Body:**
     ```json
     {
       "fid_alumno": 2,
       "fid_tutor": 2,
       "fid_tipoTutoria": 2,
       "fid_solicitud": 2
     }
     ```

5. **Eliminar lógicamente una AsignacionTutorAlumno**

   - **URL:** `DELETE http://localhost:5000/api/v1/asignacionTutorAlumno/{id}`






1. **Crear un EstadoSolicitudTutorFijo**

   - **URL:** `POST http://localhost:5000/api/v1/estadoSolicitud/`
   - **Body:**
     ```json
     {
       "nombre": "Aprobada",
       "descripcion": "Solicitud aprobada"
     }
     ```

2. **Listar todos los EstadoSolicitudTutorFijo**

   - **URL:** `GET http://localhost:5000/api/v1/estadoSolicitud/`

3. **Obtener un EstadoSolicitudTutorFijo por ID**

   - **URL:** `GET http://localhost:5000/api/v1/estadoSolicitud/{id}`

4. **Actualizar un EstadoSolicitudTutorFijo**

   - **URL:** `PUT http://localhost:5000/api/v1/estadoSolicitud/{id}`
   - **Body:**
     ```json
     {
       "nombre": "Aprobada Actualizada",
       "descripcion": "Descripción actualizada"
     }
     ```

5. **Eliminar lógicamente un EstadoSolicitudTutorFijo**

   - **URL:** `DELETE http://localhost:5000/api/v1/estadoSolicitud/{id}`

1. **Crear una SolicitudTutorFijo**

   - **URL:** `POST http://localhost:5000/api/v1/solicitudTutorFijo/`
   - **Body:**
     ```json
     ‌{
      "fid_alumno": 13,
      "fid_tutor": 10,
      "fid_tipoTutoria": 4,
      "es_rechazado": false,
      "motivo_rechazo": null,
      "fid_estadoSolicitud": 1,
      "fecha_cierre": null
    }
     ```

2. **Listar todas las SolicitudTutorFijo**

   - **URL:** `GET http://localhost:5000/api/v1/solicitud-tutor-fijo/`

3. **Obtener una SolicitudTutorFijo por ID**

   - **URL:** `GET http://localhost:5000/api/v1/solicitud-tutor-fijo/{id}`

4. **Actualizar una SolicitudTutorFijo**

   - **URL:** `PUT http://localhost:5000/api/v1/solicitud-tutor-fijo/{id}`
   - **Body:**
     ```json
     {
       "fid_alumno": 2,
       "fid_tutor": 2,
       "es_rechazado": true,
       "motivo_rechazo": "No cumple con los requisitos",
       "fid_estadoSolicitud": 2,
       "fecha_cierre": "2024-12-31T23:59:59.999Z"
     }
     ```

5. **Eliminar lógicamente una SolicitudTutorFijo**

   - **URL:** `DELETE http://localhost:5000/api/v1/solicitud-tutor-fijo/{id}`

6. **Responder una SolicitudTutorFijo**

   - **URL:** `PUT http://localhost:5000/api/v1/solicitudTutorFijo/responderSolicitud`
   - **Body:**
     ```json
     {
       "solicitudId":5,
       "nombreTutoria" : "Cachimbos",
       "tutorId": 12,
       "aceptada": false, // indica si se acepta o rechaza la solicitud
       "motivoRechazo":"El tutor tiene demasiados alumnos asignados"//puede ser null
     }
1. **Listar Usuarios por Facultad de Forma Paginada con ID de Facultad**

   - **URL:** `POST http://localhost:5000/api/v1/usuario/listar-usuarios-facultad-paginado/1`
   - **Body:**
     ```json
     {
       "facultadId": 1,
       "roles": ["Tutor", "Alumno"],
       "pageSize": 10,
       "sortBy": "fechaCreacion",
       "sortOrder": "DESC"
     }
     ```

2. **Listar Usuarios por Facultad de Forma Paginada con Nombre de Facultad**

   - **URL:** `POST http://localhost:5000/api/v1/usuario/listar-usuarios-facultad-paginado/1`
   - **Body:**
     ```json
     {
       "nombreFacultad": "Ingeniería",
       "roles": ["Tutor", "Alumno"],
       "pageSize": 10,
       "sortBy": "fechaCreacion",
       "sortOrder": "DESC"
     }
     ```
1. **Cargar alumnos a tipotutoria segun un tutor y un tipo de tutoria**
 **URL:** `POST http://localhost:5000/api/v1/asignacionTutorAlumno/asignar-varios-alumnos`
- **Body:**
  ```json
  {
    "alumnos": [1, 2, 3, 4, 5],
    "fid_tutor": 1,
    "fid_tipoTutoria": 1,
    "fid_solicitud": null
  }
  ```
**Listar usuarios (tutores y alumnos) que pertenezcan a un tipo de tutoria**
  **URL:** `POST http://localhost:5000/api/v1/asignacionTutorAlumno/listar-usuarios-por-tutoria/1`
- **Body:**
  ```json
  {
    "fid_tipoTutoria": 1,
    "pageSize": 10,
    "sortBy": "fechaCreacion",
    "sortOrder": "DESC"
  }
  ```
**Listar Usuarios por ID de Coordinador (de Facultad o de Programa)***

- **URL:** `POST http://localhost:5000/api/v1/usuario/listar-usuarios-por-coordinador-paginado/1`
- **Body:**
  ```json
  {
    "idCoord": 1,
    "roles": ["Tutor", "Alumno"],
    "pageSize": 10,
    "sortBy": "fechaCreacion",
    "sortOrder": "DESC"
  }
  ```

**Listado de solicitudes de tutor fijo**
- **URL:** `POST http://localhost:5000/api/v1/solicitudTutorFijo/paginado-por-coordinador/1`
- **Body:**
  ```json
  {
  "idCoord": 1,
  "nombreAlumno": "Jose Pereda",
  "tipoTutoria": "Laboral",
  "estadoSolicitud": "En espera",
  "fechaDesde": "2024-04-25",
  "fechaHasta": "2024-04-29",
  "pageSize": 10,
  "sortBy": "fechaCreacion",
  "sortOrder": "DESC"
  }
  ```
  #### Listar Tutores del Alumno con Paginación y Búsqueda por Nombre

- **URL:** `POST http://localhost:5000/api/v1/usuario/tutores-alumno`
- **Body:**
  ```json
  {
    "idAlumno": 1,
    "nombreTutor": "John",
    "page": 1,
    "pageSize": 10
  }
  ```

#### Listar Tutores por Tipo de Tutoría con Paginación

- **URL:** `POST http://localhost:5000/api/v1/usuario/tutores-tipo-tutoria`
- **Body:**
  ```json
  {
    "tipoTutoria": "Laboral",
    "nombreTutor": "John",
    "page": 1,
    "pageSize": 10
  }
  ```

#### Listar Alumnos Asignados al Tutor del Tipo de Tutoría Seleccionado con Paginación

- **URL:** `POST http://localhost:5000/api/v1/usuario/alumnos-asignados-tutor`
- **Body:**
  ```json
  {
    "idTutor": 1,
    "tipoTutoria": "Laboral",
    "nombreAlumno": "Juan",
    "primerApellido": "Perez",
    "codigo": "20210001",
    "correo": "juan.perez@example.com",
    "page": 1,
    "pageSize": 10
  }
  ```
#### Listar todos los  Alumnos Asignados al Tutor por Paginación

- **URL:** `GET http://localhost:5000/api/v1/usuario/listar-alumnosAsigandos-tutor/10`
- **Body:**
  ```json
  {
    "page": 1,
    "pageSize": 9,
    "sortBy": "fechaCreacion",
    "sortOrder": "DESC",
    "searchCriterias": [
      {
        "field": "nombres",
        "value": ""
      }
    ]
  }
#### Listar Alumnos del Tipo de Tutoría Seleccionado, Excluyendo los Asignados al Tutor con Paginación

- **URL:** `POST http://localhost:5000/api/v1/usuario/alumnos-tipo-tutoria-excluidos`
- **Body:**
  ```json
  {
    "idTutor": 1,
    "tipoTutoria": "Laboral",
    "nombreAlumno": "Juan",
    "primerApellido": "Perez",
    "codigo": "20210001",
    "correo": "juan.perez@example.com",
    "page": 1,
    "pageSize": 10
  }
  ```

#### Asignar Alumno al Tutor para el Tipo de Tutoría

- **URL:** `POST http://localhost:5000/api/v1/usuario/asignar-alumno-tutor`
- **Body:**
  ```json
  {
    "idAlumno": 1,
    "idTutor": 2,
    "tipoTutoria": "Laboral"
  }
  ```

#### Desasignar Alumno del Tutor para el Tipo de Tutoría

- **URL:** `POST http://localhost:5000/api/v1/usuario/desasignar-alumno-tutor`
- **Body:**
  ```json
  {
    "idAlumno": 1,
    "idTutor": 2,
    "tipoTutoria": "Laboral"
  }
  ```


#### Carga Masiva de Alumnos al Tipo de Tutoría

- **URL:** `POST http://localhost:5000/api/v1/usuario/cargar-masivamente-alumnos-tutoria`
- **Body:**
  ```json
  [
    {
      "idTutor": 1,
      "tipoTutoria": "Laboral",
      "codigoAlumno": "20210001"
    },
    {
      "idTutor": 1,
      "tipoTutoria": "Laboral",
      "codigoAlumno": "20210002"
    },
    {
      "idTutor": 2,
      "tipoTutoria": "Laboral",
      "codigoAlumno": "20210003"
    }
  ]
  ```

  #### Reiniciar Temporales

- **URL:** `POST http://localhost:5000/api/v1/usuario/reiniciar-temporales`
- **Body:**
  ```json
  {
    "tipoTutoria": "Cachimbos"
  }
  ```
  
  ### Listar tipos de tutoria asignados a un tutor
  - **URL:** 'GET http://localhost:5000/api/v1/asignacionTipoTutoria/listar-tipoTutoria-tutor'
  - **Body:**
  ```json
    {
    "idTutor": 327,
    "page": 1,
    "pageSize": 9,
    "sortBy": "fechaCreacion",
    "sortOrder": "DESC",
    "searchCriterias": [
      {
        "field": "nombre",
        "value": "Matricula"
      }
    ]
  }
    ```
  - **Devuelve:**
    ```json
    {
    "message": "Tipos de tutoría listados con éxito",
	  "data": {
		"totalPages": 1,
		"currentPage": 1,
		"totalTiposDeTutoria": 1,
		"tiposDeTutoria": [
			{
				"id": 1,
				"nombre": "Laboral",
       "tipoObligatoriedad": "Opcional",
       "tipoPermanencia": "Permanente",
       "tipoTutor": "Fijo", // Se entiende que el tipo de tutor siempre va a ser fijo
       "tipoFormato": "Individual",
			}
    ]
  }
  }
    ```

    ### Listar alumnos de un tipo de tutoria asignado a un tutor
  - **Body:**
  ```json
    {
      "idTutor": 1,
      "idTipoDeTutoria": 1,
    "page": 1,
    "pageSize": 9,
    "sortBy": "fechaCreacion",
    "sortOrder": "DESC",
    "searchCriterias": [
      {
        "field": "nombre",
        "value": "Felipe Sabogal"
      }
    ]
  }
    ```
  - **Devuelve:**
    ```json
    {
    "message": "Alumnos listados con éxito",
	  "data": {
		"totalPages": 1,
		"currentPage": 1,
		"totalAlumnos": 1,
		"Alumnos": [] // lo mismo que se trae en el listado de alumnos general
  }
  }
    ```
    
    ### Registrar cita de un tutor a un alumno (tutoria individual)
    **URL:** 'POST http://localhost:5000/api/v1/sesionCita/registrarxTutorIndividual'
  - **Body:**
  ```json
   {
      "idTutor": 59,
      "idTipoDeTutoria": 13,
      "idAlumno": 256,
      "fechaHoraInicio": "2024-05-31T17:00:00-05:00",
      "fechaHoraFin": "2024-05-31T18:00:00-05:00",
      "modalidad": {
        "tipo": "Presencial",
        "valor": "N302"
      }
  }
    ```
  - **Devuelve:**
    ```json
    {
    "message": "Cita registrada con éxito",
  }
    ```

  ### Registrar cita de un tutor (tutoria grupal)
 ** URL** 'POST http://localhost:5000/api/v1/sesionCita/registrarxTutorGrupal'
  - **Body:**
  ```json
    {
      "idTutor": 327,
      "idTipoDeTutoria": 12,
      "fechaHoraInicio": "2024-05-31T17:00:00-05:00",
      "fechaHoraFin": "2024-05-31T18:00:00-05:00",
      "modalidad": {
        "tipo": "Presencial",
        "valor": "A605"
      }
  }
    ```
  - **Devuelve:**
    ```json
    {
    "message": "Cita registrada con éxito",
  }
    ```
 ### Listar citas finalizadas del tutor paginado
 ** URL** 'POST http://localhost:5000/api/v1/sesionCita/citas-finalizadas/:page'
  - **Body:**
  ```json
    {
  
  }
    ```
 
### Carga masiva de alumnos al tipo de tutoria
  - **URL:** `POST localhost:5000/api/v1/asignacionTutorAlumno/asignarAlumnosTipoTutoria`
  - **Esto es para la carga masiva de ALUMNOS a un tipo de tutoria, porque la insercion de un tutor**
  **y un alumno son en diferentes tablas**
  - **Body:**
  ```json
    {
    "idTipoTutoria": 1,
    "usuarios": 
    [
        {
            "codigo": 20202467
        },
        {
            "codigo": 20200485
        },
        {
            "codigo": 20204985
        }
    ]
  }
    ```

### Busqueda de usuarios por un listado de codigos (mismo json que la carga masiva a un tipo de tutoria)
  - **El uso seria primero esta ruta y luego la de carga masiva, esta es para verificar los alumnos que se**
  **quieren cargar**
  - **URL:** `POST localhost:5000/api/v1/asignacionTutorAlumno/listarAlumnosPorCodigo`
  - **Esto es para la carga masiva de ALUMNOS a un tipo de tutoria, porque la insercion de un tutor**
  **y un alumno son en diferentes tablas**
  - **Body:**
  ```json
    {
    "idTipoTutoria": 1,
    "usuarios": 
    [
        {
            "codigo": 20202467
        },
        {
            "codigo": 20200485
        },
        {
            "codigo": 20204985
        }
    ]
  }
    ```
 ### Cancelar una cita
 ** URL** 'POST http://localhost:5000/api/v1/sesionCita/eliminar/:id'
  - **Body:**
  ```json
   {
    "motivoRechazo" : "Problemas personales del tutor"
}

### Listar citas de un alumno
 ** URL** ' GET http://localhost:5000/api/v1/sesionCita/listarCitasAlumno'
  - **Body:**
  ```json
   {
    //Se saca el id del alumno del token
}
### Listar tutores asignados de un tipo de tutoría específico del alumno
** URL** ' GET http://localhost:5000/api/v1/asignacionTutorAlumno/listar-tutores-alumno-tipoTutoria
  - **Body:**
  ```json
  
 {
    "fid_tipoTutoria": "63",
    "page": 1,
    "pageSize": 9,
    "sortBy": "fechaCreacion",
    "sortOrder": "DESC",
    "searchCriterias": [ // Acepta múltiples criterios de búsqueda
      {
        "field": "nombres",
        "value": "Guillermo"
      },
      {
        "field": "codigo",
        "value": "20204565"
      }
    ]
  } 

### Obtener las disponibilidades de un tutor por idTutor
** URL** ' POST localhost:5000/api/v1/disponibilidades/disponibilidadTutor
  - **Input:**
  ```json
  {
    "idTutor": 1
  }
  ```
  - **Devuelve:**
  ```json
  {
    "message": "Disponibilidad encontrada con exito",
    "disponibilidad": [
        {
            "id_disponibilidad": 7,
            "fechaHoraInicio": "2024-06-01T13:00:00.000Z",
            "fechaHoraFin": "2024-06-01T22:00:00.000Z"
        },
        {
            "id_disponibilidad": 9,
            "fechaHoraInicio": "2024-06-04T12:00:00.000Z",
            "fechaHoraFin": "2024-06-04T23:00:00.000Z"
        }
    ]
  }
  ```

### Registrar cita de un tutor a un alumno (tutoria individual)
    **URL:** 'POST http://localhost:5000/api/v1/sesionCita/registrarCitaParteAlumno'
  - **Body:**
  ```json
   {
      "idTutor": 59,
      "idTipoDeTutoria": 13,
      "idAlumno": 256,
      "fechaHoraInicio": "2024-05-31T17:00:00-05:00",
      "fechaHoraFin": "2024-05-31T18:00:00-05:00",
      "modalidad": {
        "tipo": "Presencial",
      }
  }
  ```

  - **Devuelve:**
  ```json
    {
    "message": "Cita registrada con éxito",
  }

  ### Registrar asistencia, resultados y compromisos
    **URL:** 'POST http://localhost:5000/api/v1/resultadoCita/registrar'
  - **Body:**
  ```json
   {
    "idSesionCita": "10",
    "resultados": {
        "asistencia": [
            {
                "fid_alumno":4,
                "asistio":true
            },
            {
                "fid_alumno":14,
                "asistio":false
            }
        ],
        "es_derivado": false,
        "detalleResultado": "El alumno se compromete a mejorar sus hábitos de estudio"
    },
    "compromisos": [
        {
            "tipo": "Ejecucion",
            "descripcion": "Estudiar por lo menos 4 horas al día"
        },
        {
            "tipo": "Ejecucion",
            "descripcion": "Dormir por lo menos 8 horas diarias"
        }
        
    ]
  }```

  ### Carga masiva de unidades academicas
    **URL:** 'POST http://localhost:5000/api/v1/unidadAcademica/carga-masiva-unidades-academicas'
  - **Body:**
  ```json
  {
    "unidades": 
    [
        {
            "nombre": "facultad de prueba",
            "siglas": "fpd",
            "correoDeContacto": "a20176800@pucp.edu.pe"
        },
        {
            "nombre": "facultad de prueba2",
            "siglas": "fpd2",
            "correoDeContacto": "a20176800@pucp.edu.pe"
        },
        {
            "nombre": "facultad de prueba3",
            "siglas": "fpd3",
            "correoDeContacto": "a20176800@pucp.edu.pe"
        },
        {
            "nombre": "facultad de prueba4",
            "siglas": "fpd4",
            "correoDeContacto": "a20176800@pucp.edu.pe"
        }
    ]
  }
  ```
  - **Devuelve:**
  ```json
  //Si todas las unidades estan duplicadas
  {
    "resultado": {
        "message": "No se cargaron unidades académicas, todas estaban duplicadas"
    }
  }
  ```
  ```json
  //en caso al menos una no sea duplicada devuelve la unidad registrada
  //y las unidades que no se registraron por duplicidad
  {
    "resultado": {
        "Unidades cargadas": [
            {
                "esActivo": true,
                "id_unidad_academica": 6,
                "nombre": "facultad de prueba5",
                "siglas": "fpd5",
                "correoDeContacto": "a20176800@pucp.edu.pe",
                "fechaCreacion": "2024-06-20T01:01:24.629Z",
                "fechaActualizacion": "2024-06-20T01:01:24.629Z"
            }
        ],
        "Unidades no cargadas porque ya existen": [
            {
                "nombre": "facultad de prueba",
                "siglas": "fpd",
                "correoDeContacto": "a20176800@pucp.edu.pe"
            },
            {
                "nombre": "facultad de prueba3",
                "siglas": "fpd3",
                "correoDeContacto": "a20176800@pucp.edu.pe"
            },
            {
                "nombre": "facultad de prueba4",
                "siglas": "fpd4",
                "correoDeContacto": "a20176800@pucp.edu.pe"
            }
        ]
    }
  }
  ```