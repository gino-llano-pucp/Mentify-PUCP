import { jwtDecode } from "jwt-decode";
import fetchAPI from "@/modules/core/services/apiService";

export const fetchSolicitudAlumno = async (token, tutor) => {
    const decoded = jwtDecode(token);
    console.log(decoded.id)
    console.log(tutor)
    if (!token) {
      throw new Error('Error validar Token')
    }
    try{
      //const response = await fetchAPI({
      const data = await fetchAPI({
        endpoint: `/solicitudTutorFijo`,
        method: 'POST',
        token: token,
        payload:{
          "fid_alumno": decoded.id,
          "fid_tutor": tutor.Tutor.id_usuario,
          "fid_tipoTutoria": tutor.TipoTutoria.id,
          "es_rechazado": false,
          "motivo_rechazo": null,
          "fid_estadoSolicitud": 1,
          "fecha_cierre": null
        },
        successMessage: 'Solicitud registrada correctamente',
        errorMessage: 'Error al registrar solcitud',
        showToast: false
        });
    } catch(error){
      throw new Error('Error en el fetch')
    }
  };