'use client';
import SearchInput from '@/modules/core/components/SearchInput';
import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import {  CircularProgress, Pagination } from '@nextui-org/react'
import { Hash, Mail } from 'lucide-react';
import CardAttribute from '../../admin/components/CardAttribute';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { fetchAlumnosAsignados } from '../service/tiposDeTutoria';
import { useTutoringType } from '../../coordinador/states/TutoringTypeContext';
import { useStudentInfo } from '../states/StudentInfoContext';
import { useMode } from '../states/CalendarModeContext';

const AlumnosDeTipoDeTutoria = ({session}) => {
  const [filtro, setFiltro] = useState('');
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { setActiveComponentById } = useActiveComponent();
  const { selectedTutoringType } = useTutoringType();
  const { studentInfos, addStudentInfo, clearStudentInfos } = useStudentInfo();
  const { setMode } = useMode();

  useEffect(() => {
    clearStudentInfos();
  }, []);

  useEffect(() => {
    console.log("tipo tutoria id: ", selectedTutoringType);
  }, [selectedTutoringType])
  
  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchStudents = async (pageNum, search = '') => {
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }

    setLoading(true);
/*     const data = await fetchAlumnosPorTipoDeTutoria(session.accessToken, selectedTutoringType.idTipoTutoria, pageNum, search); */
    const data = await fetchAlumnosAsignados(session.accessToken, selectedTutoringType.idTipoTutoria, pageNum, search);
    console.log(data)
    if (data) {
/*       setStudents(data.alumnos); */
      setStudents(data.usuarios);
      setTotalPages(data.totalPages);
    } else {
      setStudents([]);
    }
    setLoading(false);
  };

  const filteredStudents = students.filter((student) => {
    const filtroLower = filtro.toLowerCase();
/*     const nombresLower = student.nombres.toLowerCase(); */
    const nombresLower = student.nombreAlumno.toLowerCase();
    const apLower = student.primerApellido.toLowerCase();
/*     const codigoLower = student.codigo.toLowerCase(); */
    const codigoLower = student.codigoAlumno.toLowerCase(); 
/*     const emailLower = student.email.toLowerCase(); */
    const emailLower = student.correo.toLowerCase();
/*     return (
      ((nombresLower + " " + apLower).includes(filtroLower) ||
        codigoLower.includes(filtroLower) ||
        emailLower.includes(filtroLower))
    ); */
    return true;
  });

  const handleSearch = useCallback(debounce((searchValue) => {
    fetchStudents(1, searchValue);
  }, 500), [students]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setFiltro('');
    setPage(1);
    fetchStudents(page);
  };

  useEffect(() => {
    console.log("student information: ", studentInfos);
  }, [studentInfos])

  const registrarFechaYHora = (student) => {
    addStudentInfo({
      idAlumno: student.idAlumno,
      nombres: student.nombreAlumno,
      primerApellido: student.primerApellido,
      email: student.correo,
      codigo: student.codigoAlumno,
    });
    setActiveComponentById('calendarioTutor', `Selección de fecha y hora`);
    setMode('registrarCita');
  }

  return (
    <div className='flex flex-col w-full h-full gap-6 '>
      <div className='flex flex-row items-end justify-between w-full'>
        <div className='flex flex-row items-end w-full gap-2'>
          <div className='flex flex-col w-3/5 gap-1'>
            <span className='text-lg font-semibold'>Nombre o apellido del alumno</span>
            <SearchInput
              placeholder='Ingresa el nombre o apellido del alumno'
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clearSearch}
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col h-[85%]'>
      <div className='flex flex-wrap w-full gap-4'>
        {loading ? (
          <div className='flex flex-row items-center gap-3'>
            <CircularProgress aria-label='Loading...' />
            <div>Cargando Usuarios...</div>
          </div>
        ) : students.length > 0 ? (
          students.map((student, key) => (
            <div
              key={key}
              className='w-[360px] flex flex-col gap-4 p-4 border rounded-xl hover:cursor-pointer transition-shadow hover:shadow-lg'
              onClick={() => registrarFechaYHora(student)}
            >
              <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
                <h3 className='w-[255px] text-lg font-semibold break-words'>
                  {student.nombreAlumno + ' ' + student.primerApellido}
                </h3>
              </div>
              <div className='flex flex-col w-full gap-2'>
                <CardAttribute icon={<Hash size={20} />} text={student.codigoAlumno} />
                <CardAttribute icon={<Mail size={20} />} text={student.correo} />
              </div>
            </div>
            
          ))
        ) : (
          <div>No se encontraron alumnos que coincidan con la búsqueda.</div>
        )}
        </div>
        {totalPages > 1 && (
        <div className='flex items-center justify-center w-full px-2 py-2 mt-auto'>
          <Pagination
            isCompact
            loop
            showControls
            showShadow
            size='md'
            color='primary'
            initialPage={1}
            page={page}
            total={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
      </div>

    </div>
  );
};

export default AlumnosDeTipoDeTutoria;