import React, { useEffect } from 'react'
import { listarCitasProgramadasTutor, listarCitasProgramadasAlumno } from '../service/citasService';
import DataList from '@/modules/core/components/DataList';
import TableList from '@/modules/core/components/TableList';
import TableListAlumno from '@/modules/core/components/TableListAlumno';

const ProximasCitas = ({session, esAlumno}) => {
    const fetchDataCitas = async (pageNum, search = '') => {
        if (esAlumno) {
            const result = await listarCitasProgramadasAlumno(pageNum, session.accessToken);
            console.log("res: ", result);
            if (result.data) {
                // Mapeo simple de los datos para su uso en TableList, sin JSX aquí
                const formattedCitas = result.data.citas.map(cita => ({
                  idCita: cita.idCita,
                  estadoCita: cita.estadoCita,
                  tipoTutoria: cita.TipoTutoria,
                  tutor: cita.Tutor,
                  modalidad: cita.modalidad,
                  ubicacion: cita.ubicacion,
                  fechaHoraInicio: cita.fechaHoraInicio,
                  fechaHoraFin: cita.fechaHoraFin
              }));
              
              return {
                  items: formattedCitas,
                  totalPages: result.data.totalPages
              };
            } else {
                return { items: [], totalPages: 0 };
            }
        }
        else {
            const result = await listarCitasProgramadasTutor(pageNum, session.accessToken);
            console.log("res: ", result);
            if (result.data) {
                // Mapeo simple de los datos para su uso en TableList, sin JSX aquí
                const formattedCitas = result.data.citas.map(cita => ({
                  idCita: cita.idCita,
                  estadoCita: cita.estadoCita,
                  tipoTutoria: cita.TipoTutoria,
                  alumnos: cita.Alumnos,
                  modalidad: cita.modalidad,
                  ubicacion: cita.ubicacion,
                  fechaHoraInicio: cita.fechaHoraInicio,
                  fechaHoraFin: cita.fechaHoraFin
              }));
              
              return {
                  items: formattedCitas,
                  totalPages: result.data.totalPages
              };
            } else {
                return { items: [], totalPages: 0 };
            }
        }
    };

    return (
        <DataList
            estado="Programado"
            fetchData={fetchDataCitas}
            renderItem={(item) => item}  // renderItem es trivial aquí ya que TableList maneja la renderización
            noResultsText="No se encontraron citas próximas."
            ListRenderer={esAlumno ? TableListAlumno : TableList}  // Pasa TableList como el componente para renderizar la lista
            showToolbarHeader={false}
        />
    );
}

export default ProximasCitas