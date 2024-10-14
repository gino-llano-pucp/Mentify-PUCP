import React from 'react';
import TipoDeTutoriaCard from '../components/TipoDeTutoriaCard';
import { fetchTutoringTypes } from '../service/tiposDeTutoria';
import DataList from '@/modules/core/components/DataList';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { useTutoringType } from '../../coordinador/states/TutoringTypeContext';

const TiposDeTutoria = ({session}) => {
  const { setActiveComponentById } = useActiveComponent();
  const { addTutoringType } = useTutoringType();

  const fetchData = async (pageNum, search) => {
    const data = await fetchTutoringTypes(session.accessToken, pageNum, search);
    return {
      items: data.tiposTutoria,
      totalPages: data.totalPages,
    };
  };

  const handleClick = (tipoDeTutoria) => {
    console.log("tipo tutoria: ", tipoDeTutoria);
    if (tipoDeTutoria.formato === "Individual") {
      addTutoringType(tipoDeTutoria);
      setActiveComponentById('alumnosDeTipoDeTutoria', `Selección de alumno`);
    } else if (tipoDeTutoria.formato === "Grupal") {
      addTutoringType(tipoDeTutoria);
      setActiveComponentById('alumnosDeTipoDeTutoriaGrupal', `Selección de alumnos`);
    }
  };

  return (
    <DataList
      fetchData={fetchData}
      renderItem={(item) => <TipoDeTutoriaCard tipoDeTutoria={item} handleClick={handleClick} />}
      noResultsText="No se encontraron tipos de tutoría que coincidan con la búsqueda."
    />
  );
};

export default TiposDeTutoria;
