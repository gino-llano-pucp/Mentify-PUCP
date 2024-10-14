import React, { useCallback, useEffect, useState } from "react";
import SearchInput from "@/modules/core/components/SearchInput";
import { ListadoAlumnosXTutor } from "../../components/ListadoAlumnosXTutor";
import { TutorCardHorizontal } from "../../components/TutorCardHorizontal";
import { useTutor } from "../../states/TutorContext";
import { useTutoringType } from "../../states/TutoringTypeContext";
import { debounce } from "lodash";
import SearchStudent from "../../components/SearchStudent";
import fetchAPI from "@/modules/core/services/apiService";

function AlumnosAsignadosTutor({session}) {
  const { tutor } = useTutor()
  const { selectedTutoringType } = useTutoringType()
  const [filtro, setFiltro] = useState('');
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updateNow, setUpdate] = useState(false)
  console.log(tutor)

  useEffect(() => {
    fetchStudent(page,filtro);
  }, [page]);
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchStudent = async (pageNum, search='') => {
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    console.log("busqueda: ", search);
    console.log(tutor.Tutor)
    console.log(selectedTutoringType)
    const data = await fetchAPI({
      endpoint: `/asignacionTutorAlumno/listarAlumnosAsignados`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "id_tipoTutoria": selectedTutoringType,
        "id_tutor": tutor.Tutor.id_usuario,
        "inputSearch": search,
        "page": pageNum,
        "pageSize": 9
      },
      successMessage: 'Alumnos asignados cargados correctamente',
      errorMessage: 'Error al cargar Alumnos Asignados',
      showToast: false
    });
    
    console.log(data)
    if (data && data.alumnos.length > 0) {
      setStudents(data.alumnos);
      setTotalPages(data.totalPages);
    } else {
      setStudents([]);
      setTotalPages(0);
    }

    setLoading(false);
  }

  const handleSearch = useCallback(debounce((searchValue) => {
    setPage(1)
    fetchStudent(1, searchValue);
  }, 500), [students]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setFiltro('');
    setPage(1)
    fetchStudent(1);
  };

  return(
    <div className='flex flex-col w-full h-full gap-6'>
      {
        tutor ?
        (<TutorCardHorizontal tutor={tutor}/>)
        :
        (<></>)
      }
      <div className='flex items-end w-full gap-2 flex-row basis-auto'>
        <div className='flex flex-col gap-1 w-[80%]'>
          <span className='text-lg font-semibold'>Código, Nombre o correo del Alumno</span>
          <SearchInput
              placeholder='Ingresa el código, el nombre o correo del alumno'
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clearSearch}
              className="w-full"
          />
        </div>
        <SearchStudent update={fetchStudent} pageList={page} updateNow={updateNow} filtro={filtro} session={session}/>
      </div>
      <ListadoAlumnosXTutor 
        filteredStudents={students} 
        handlePageChange={handlePageChange} 
        unasign={true} 
        asign={false}
        page={page} 
        totalPages={totalPages} 
        loading={loading} 
        update={fetchStudent} 
        setUpdate={setUpdate} 
        updateNow={updateNow}
        tutor={tutor}
        filtro={filtro}
        session={session}/>
    </div>
    )
}    

export default AlumnosAsignadosTutor;