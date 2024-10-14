import DataList from '@/modules/core/components/DataList';
import React, { useEffect } from 'react'
import { fetchTutoresPorTipoTutoria } from '../../services/tiposDeTutoria';
import { useTutoringType } from '../../../coordinador/states/TutoringTypeContext';
import TutorCard from '../../components/TutorCard';
import { useTutor } from '@/modules/portal/coordinador/states/TutorContext';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { useMode } from '@/modules/portal/tutor/states/CalendarModeContext';
import fetchAPI from '@/modules/core/services/apiService';

const SeleccionTutor = ({session}) => {
  const { selectedTutoringType } = useTutoringType(); 
  const { addTutor } = useTutor();
  const { setActiveComponentById } = useActiveComponent();
  const { setMode } = useMode();
  const fetchData = async (pageNum, search) => {

/*     const data = await fetchAPI({
      endpoint: `/usuario/listar-tutores-y-solicitudes`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "idAlumno": jwtDecode(session.accessToken).id,
        "pageSize": 9,
        "sortTutorBy": ["nombres","primerApellido"],
        "sortTutorOrder": "ASC",
        "sortSolicitud": "fechaRegistro",
        "sortSolicitudOrder": "DESC",
        "searchCriterias": {
        "nombreTutor" : search,
        "page" : pageNum,
        "tipo" : 1
        }
      },
      successMessage: 'Tutores y Solicitudes cargadas correctamente',
      errorMessage: 'Error al cargar Tutores y Solicitudes',
      showToast: false
    });
    console.log(data)
    return {
      items: data.usuarios,
      totalPages: data.totalPages,
    }; */
    const data = await fetchTutoresPorTipoTutoria(session.accessToken, selectedTutoringType.idTipoTutoria, pageNum, search);
    return {
      items: data.tutores,
      totalPages: data.totalPages,
    };
  };

  useEffect(() => {
    console.log("tutores data: ", fetchData)
  }, [fetchData])

  const handleClick = (tutor) => {
    addTutor(tutor);
    setActiveComponentById('registrarCitaAlumno', `Registrar Cita con ${tutor.nombres} ${tutor.primerApellido}`);
    setMode("registrarCita");
  };

  return (
    <DataList
      fetchData={fetchData}
      renderItem={(item) => <TutorCard tutor={item} onClick={handleClick} />}
      noResultsText="No se encontraron tutores disponibles."
    />
  );
}

export default SeleccionTutor