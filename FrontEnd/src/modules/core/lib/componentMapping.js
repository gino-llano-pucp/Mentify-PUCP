import Facultades from '@/modules/portal/admin/pages/GestionFacultades/GestionFacultades';
import ProfileCard from '../components/Sidebar/ProfileCard';
import Programas from '@/modules/portal/admin/pages/GestionProgramas/GestionProgramas';
import GestionAlumnos from '@/modules/portal/admin/pages/GestionAlumnos/GestionAlumnos';
import GestionTutores from '../../portal/admin/pages/GestionTutores/GestionTutores';
import UnidadesAcademicas from '@/modules/portal/admin/pages/GestionUnidadesAcademicas/GestionUnidadesAcademicas';
import ListadoProgramasDeFacultad from '@/modules/portal/admin/components/ListadoProgramasDeFacultad';
import AgregarPrograma from '@/modules/portal/admin/pages/GestionProgramas/AgregarPrograma';
import ManejoProgramas from '@/modules/portal/coordinador/pages/ManejoProgramas';
import SolicitudesAsignacion from '@/modules/portal/coordinador/pages/GestionSolicitudes/SolicitudesAsignacion';
import TiposTutorias from '@/modules/portal/coordinador/pages/GestionTipoTutoria/TiposTutorias';
import ManejoAlumnos from '@/modules/portal/coordinador/pages/ManejoAlumnos';
import ReporteIndicadores from '@/modules/portal/coordinador/pages/Indicadores/ReporteIndicadores';
import CitasTutor from '@/modules/portal/tutor/pages/CitasTutor';
import AlumnosAsignados from '@/modules/portal/tutor/pages/AlumnosAsignados';
import CitasAlumno from '@/modules/portal/alumnos/pages/Citas/CitasAlumno';
import MisTutores from '@/modules/portal/alumnos/pages/MisTutores/MisTutores';
import EncuestasAlumno from '@/modules/portal/alumnos/pages/Encuestas/EncuestasAlumno';
import AgregarFacultad from '@/modules/portal/admin/pages/GestionFacultades/AgregarFacultad';
import EditarFacultad from '@/modules/portal/admin/pages/GestionFacultades/EditarFacultad';
import ListadoCarga from '../components/ListadoCarga';
import AgregarUnidadAcademica from '@/modules/portal/admin/pages/GestionUnidadesAcademicas/AgregarUnidadAcademica';
import AddTutoringType from '@/modules/portal/coordinador/components/AddTutoringType';
import { SolicitarTutor } from '@/modules/portal/alumnos/pages/MisTutores/SolicitarTutor';
import { UserTutoringType } from '@/modules/portal/coordinador/pages/GestionTipoTutoria/UserTutoringType';
import { ListadoGrupoAlumnos } from '@/modules/portal/coordinador/pages/GestionTipoTutoria/ListadoGrupoAlumnos';
import AsignacionTutor from '@/modules/portal/coordinador/pages/AsignacionTutor/AsignacionTutor';
import TiposDeTutoria from '@/modules/portal/tutor/pages/TiposDeTutoria';
import AlumnosDeTipoDeTutoria from '@/modules/portal/tutor/pages/AlumnosDeTipoDeTutoria';
import AlumnosDeTipoDeTutoriaGrupal from '@/modules/portal/tutor/pages/AlumnosDeTipoDeTutoriaGrupal';
import GestionarCitas from '@/modules/portal/tutor/pages/GestionarCitas';
import EditStudent from '@/modules/portal/admin/pages/GestionAlumnos/EditStudent';
import AddStudent from '@/modules/portal/admin/pages/GestionAlumnos/AddStudent';
import EditarDisponibilidadTutor from '@/modules/portal/coordinador/pages/EditarDisponibilidadTutor/EditardisponibilidadTutor';
import EditarTutor from '@/modules/portal/admin/pages/GestionTutores/EditarTutor';
import AlumnosAsignadosTutor from '@/modules/portal/coordinador/pages/AsignacionTutor/AlumnosAsignadosTutor';
import DerivacionAlumnos from '@/modules/portal/tutor/pages/DerivacionAlumno';
import DetalleAlumnoAsignado from '@/modules/portal/tutor/pages/DetalleAlumnoAsignado';
import ResultadosDeCita from '@/modules/portal/tutor/pages/ResultadosYCompromisos';
import CompromisosDeCita from '@/modules/portal/alumnos/pages/Citas/ResultadosYCompromisos';
import { GestionResponsable } from '@/modules/portal/admin/pages/GestionResponsable/GestionResponsable';
import { GestionAsistente } from '@/modules/portal/coordinador/pages/GestionAsistente/GestionAsistente';
import TiposDeTutoriaAlumno from '@/modules/portal/alumnos/pages/Citas/SeleccionTipoTutoria';
import SeleccionTutor from '@/modules/portal/alumnos/pages/Citas/SeleccionTutor';
import RegistrarCitaCalendario from '@/modules/portal/alumnos/pages/Citas/RegistrarCitaCalendario';
import AsistenciaCitaGrupal from '@/modules/portal/tutor/pages/AsistenciaCitaGrupal';
import CargarCalificaciones from '@/modules/portal/coordinador/pages/HistoricoNotas/CargarCalificaciones';
import { SolicitudesEncuestas } from '@/modules/portal/coordinador/pages/SolicitudesEncuestas/SolicitudesEncuestas';
import { VerHistoricoNotas } from '@/modules/portal/coordinador/pages/HistoricoNotas/VerHistoricoNotas';
import CalendarioTutor from '@/modules/portal/tutor/components/CalendarioTutor';

import { SolicitudesDerivacion } from '@/modules/portal/responsableTutoria/pages/SolicitudesDerivacion';
import RespuestaEncuestaAlumno from '@/modules/portal/alumnos/pages/Encuestas/RespuestaEncuestaAlumno';

import EnviarSolicitudDerivacion from '@/modules/portal/responsableTutoria/pages/EnviarSolicitudDerivacion';
import ListadoCargaUnidadesAcademicas from '@/modules/portal/admin/components/ListadoCargaUnidadesAcademicas';
import DatosInstitucion from '@/modules/portal/admin/pages/DatosInstitucion/DatosInstitucion';
import { Auditoria } from '@/modules/portal/admin/pages/Auditoria/Auditoria';
import ReporteAlumnoAsignado from '@/modules/portal/tutor/pages/ReportelumnoAsignado';
import LogErrores from '@/modules/portal/admin/pages/LogErrores/LogErrores';
//import { PasswordRecovery } from '@/modules/auth/components/PasswordRecovery';

export const componentMapping = {
  solicitudDerivacion: EnviarSolicitudDerivacion,
  responsableTutoria: SolicitudesDerivacion,
  editarDisponibilidadTutor: EditarDisponibilidadTutor,
  asignacionTutor: AsignacionTutor,
  listadoCargaGrupoAlumnos : ListadoGrupoAlumnos,
  usuarioTipoTutoria: UserTutoringType,
  solicitarTutor: SolicitarTutor,
  facultad: Facultades,
  programa: Programas,
  alumnos: GestionAlumnos,
  editStudent: EditStudent,
  addStudent: AddStudent,
  tutores: GestionTutores,
  editTutor: EditarTutor,
  listadoCarga: ListadoCarga,
  dashboardComponent: ProfileCard,
  unidadesAcademicas: UnidadesAcademicas,
  agregarUnidadAcademica: AgregarUnidadAcademica,
  listadoCargaUnidadesAcademicas: ListadoCargaUnidadesAcademicas,
  listadoProgramasDeFacultad: ListadoProgramasDeFacultad,
  agregarPrograma: AgregarPrograma,
  tiposTutorias: TiposTutorias,
  addTutoringType: AddTutoringType,
  solicitudesAsignacion: SolicitudesAsignacion,
  manejoProgramas: ManejoProgramas,
  manejoAlumnos: ManejoAlumnos,
  reporteIndicadores: ReporteIndicadores,
  citasTutor: CitasTutor,
  alumnosAsignadosTutor: AlumnosAsignados,
  citasAlumno: CitasAlumno,
  misTutores: MisTutores,
  encuestasAlumno: EncuestasAlumno,
  agregarFacultad: AgregarFacultad,
  editarFacultad: EditarFacultad,
  tiposDeTutoria: TiposDeTutoria,
  alumnosDeTipoDeTutoria: AlumnosDeTipoDeTutoria,
  alumnosDeTipoDeTutoriaGrupal: AlumnosDeTipoDeTutoriaGrupal,
  gestionarCitas: GestionarCitas,
  alumnosAsignadosTutorCoordinador: AlumnosAsignadosTutor,
  derivacionAlumno: DerivacionAlumnos,
  detalleAlumnoAsignado: DetalleAlumnoAsignado,
  resultadosDeCita: ResultadosDeCita,
  responsable: GestionResponsable,
  asistente: GestionAsistente,
  tiposTutoriaAlumno: TiposDeTutoriaAlumno,
  seleccionTutorTipoTutoria: SeleccionTutor,
  registrarCitaAlumno: RegistrarCitaCalendario,
  asistenciaCitaGrupal: AsistenciaCitaGrupal,
  procesadoNotas: CargarCalificaciones,
  solicitudesEncuestas: SolicitudesEncuestas,
  verHistoricoNotas: VerHistoricoNotas,
  compromisosDeCita: CompromisosDeCita,
  calendarioTutor: CalendarioTutor,
  respuestaEncuestaAlumno: RespuestaEncuestaAlumno,
  datosInstitucion: DatosInstitucion,
  auditoria: Auditoria,
  reporteAlumnoAsignado: ReporteAlumnoAsignado,
  logErrores: LogErrores,
};
