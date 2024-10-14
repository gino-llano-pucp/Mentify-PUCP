import React, { useEffect } from 'react'
import { listarCitasCanceladasTutor, listarCitasCanceladasAlumno } from '../service/citasService';
import DataList from '@/modules/core/components/DataList';
import TableListCancelado from '@/modules/core/components/TableListCancelado';
import TableListCanceladoAlumno from '@/modules/core/components/TableListCanceladoAlumno';

const CitasCanceladas = ({session, esAlumno}) => {
    const fetchDataCitas = async (pageNum, search = '') => {
        if (esAlumno) {
            const result = await listarCitasCanceladasAlumno(pageNum, session.accessToken);
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
                    fechaHoraFin: cita.fechaHoraFin,
                    motivoRechazo: cita.motivoRechazo
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
            const result = await listarCitasCanceladasTutor(pageNum, session.accessToken);
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
                  fechaHoraFin: cita.fechaHoraFin,
                  motivoRechazo: cita.motivoRechazo
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
            estado="Cancelado"
            fetchData={fetchDataCitas}
            renderItem={(item) => item}  // renderItem es trivial aquí ya que TableList maneja la renderización
            noResultsText="No se encontraron citas canceladas."
            ListRenderer={esAlumno ? TableListCanceladoAlumno : TableListCancelado}  // Pasa TableList como el componente para renderizar la lista
            showToolbarHeader={false}
        />
    );
}

export default CitasCanceladas