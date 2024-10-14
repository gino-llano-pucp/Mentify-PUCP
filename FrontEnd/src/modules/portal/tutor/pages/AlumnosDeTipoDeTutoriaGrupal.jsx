'use client';
import SearchInput from '@/modules/core/components/SearchInput';
import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { Button, CircularProgress, Pagination } from '@nextui-org/react'
import { Hash, Mail } from 'lucide-react';
import CardAttribute from '../../admin/components/CardAttribute';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { fetchAlumnosPorTipoDeTutoria } from '../service/tiposDeTutoria';
import { useTutoringType } from '../../coordinador/states/TutoringTypeContext';
import { useStudentInfo } from '../states/StudentInfoContext';
import {Checkbox} from "@nextui-org/react";
import { CirclePlus } from 'lucide-react';
import { useMode } from '../states/CalendarModeContext';

const AlumnosDeTipoDeTutoriaGrupal = ({session}) => {
  const [filtro, setFiltro] = useState('');
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { setActiveComponentById } = useActiveComponent();
  const { selectedTutoringType } = useTutoringType();
  const { studentInfos, toggleStudentInfo, addStudentInfo, clearStudentInfos, setStudentInfos } = useStudentInfo();
  const [checks, setChecks] = useState([]);
  const [seleccionarTodos, setSeleccionarTodos] = useState(false);
  const {setMode} = useMode();

  useEffect(() => {
    clearStudentInfos();
  }, [])

  useEffect(() => {
    fetchStudents(page);
  }, [page, selectedTutoringType]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchStudents = async (pageNum, search = '') => {
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }

    setLoading(true);
    const data = await fetchAlumnosPorTipoDeTutoria(session.accessToken, selectedTutoringType.idTipoTutoria, pageNum, search);
    if (data) {
      setStudents(data.alumnos);
      setTotalPages(data.totalPages);
      if (checks.length == 0)
        setChecks(Array(data.totalAlumnos).fill(false));
    } else {
      setStudents([]);
    }
    setLoading(false);
  };

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
    fetchStudents(1);
  };

  const handleToggleSelectAll = (checked) => {
    setChecks(checks.map(() => checked));
    if (checked) {
      /* students.forEach(student => addStudentInfo(student)); */
      setStudentInfos(JSON.parse(JSON.stringify(students)));
    } else {
      clearStudentInfos();
    }
    setSeleccionarTodos(checked);
  };

  const handleToggleStudent = (student, index) => {
    const updatedChecks = [...checks];
    updatedChecks[index] = !updatedChecks[index];
    setChecks(updatedChecks);

    // Verificar si todos los checkboxes están seleccionados
    const allSelected = updatedChecks.every(check => check === true);
    setSeleccionarTodos(allSelected);

    // Llamar a toggleStudentInfo
    toggleStudentInfo(student);

    // Si estaba activado "seleccionar todos" y se deselecciona uno, actualizar "seleccionar todos"
    if (seleccionarTodos && !updatedChecks[index]) {
      setSeleccionarTodos(false);
    }
  };

  useEffect(() => {
    console.log("estud: ", studentInfos);
  }, [studentInfos])

  const registrarFechaYHora = async () => {
    // cargando todos los alumnos
    console.log(page);
    console.log(totalPages);
    const alumnosSeleccionados = [];
    async function cargarAlumnos() {
      for (let i=1; i<=totalPages; i++) {
        const data = await fetchAlumnosPorTipoDeTutoria(session.accessToken, selectedTutoringType.idTipoTutoria, i, "");
        if (data) {
          /* console.log("ALUMNOS: ", data.alumnos); */
          const alumnos = data.alumnos;
          for (let j=0; j<alumnos.length; j++) {
            if (checks[(i - 1) * 10 + j]) {
              console.log("ALUMNO AGREGADO: ", alumnos[j])
              alumnosSeleccionados.push(alumnos[j]);
            }
          }
        }
      } 
    }
    cargarAlumnos().then((response) => {
      console.log("ALUMNOS TOTAL: ", alumnosSeleccionados);
      setStudentInfos(JSON.parse(JSON.stringify(alumnosSeleccionados)));
      setActiveComponentById('calendarioTutor', `Selección de fecha y hora`);
      setMode('registrarCita');
    })
  };

  return (
    <div className='flex flex-col w-full h-full gap-6 '>
      <div className='flex flex-row items-end justify-between w-full'>
        <div className='flex flex-row items-center justify-between w-full gap-2'>
          <div className='flex flex-col w-3/5 gap-1'>
            <span className='text-lg font-semibold'>Nombre o apellido del alumno</span>
            <SearchInput
              placeholder='Ingresa el nombre o apellido del alumno'
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clearSearch}
            />
          </div>
          <Checkbox 
            isSelected={seleccionarTodos}
            color="primary"
            onChange={(e) => handleToggleSelectAll(e.target.checked)}
          >
            Seleccionar todos
          </Checkbox>
          <Button
            color='primary'
            variant='shadow'
            isDisabled={studentInfos.length === 0}
            className='flex items-center justify-center'
            startContent={<CirclePlus size={20} />}
            onPress={registrarFechaYHora}
          >
            Asignar alumnos a la cita
          </Button>
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
          students.map((student, index) => (
            <div
              key={student.codigo}
              className='w-[360px] flex flex-col gap-4 p-4 border rounded-xl'
            >
              <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
                <h3 className='w-[255px] text-lg font-semibold break-words'>
                  {student.nombres + ' ' + student.primerApellido}
                </h3>
                <Checkbox
                    isSelected={checks[(page - 1) * 10 + index]}
                    onChange={() => handleToggleStudent(student, (page - 1) * 10 + index)}
                    color="primary"
                  />
              </div>
              <div className='flex flex-col w-full gap-2'>
                <CardAttribute icon={<Hash size={20} />} text={student.codigo} />
                <CardAttribute icon={<Mail size={20} />} text={student.email} />
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

export default AlumnosDeTipoDeTutoriaGrupal;
