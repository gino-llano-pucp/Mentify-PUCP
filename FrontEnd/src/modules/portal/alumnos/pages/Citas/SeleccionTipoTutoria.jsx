import React from 'react';
import DataList from '@/modules/core/components/DataList';
import { fetchTutoringTypesAlumno } from '../../services/tiposDeTutoria';
import TipoDeTutoriaCard from '../../../tutor/components/TipoDeTutoriaCard';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { useTutoringType } from '../../../coordinador/states/TutoringTypeContext';

const TiposDeTutoriaAlumno = ({session}) => {
  const { setActiveComponentById } = useActiveComponent();
  const { addTutoringType } = useTutoringType(); 
  
  /* Obtiene las tutorias individuales en las que pertenece el alumno */
  const fetchData = async (pageNum, search) => {
    const data = await fetchTutoringTypesAlumno(session.accessToken, pageNum, search);
    return {
      items: data.tiposTutoria,
      totalPages: data.totalPages,
    };
  };

  const handleClick = (tipoDeTutoria) => {
    addTutoringType(tipoDeTutoria);
    setActiveComponentById("seleccionTutorTipoTutoria", "Selección de tutor");
  };

  return (
    <DataList
      fetchData={fetchData}
      renderItem={(item) => <TipoDeTutoriaCard tipoDeTutoria={item} handleClick={handleClick} />}
      noResultsText="No se encontraron tipos de tutoría que coincidan con la búsqueda."
    />
  );
};

export default TiposDeTutoriaAlumno;
