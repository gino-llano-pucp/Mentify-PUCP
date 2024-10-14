import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { CirclePlus } from 'lucide-react';
import { useTutoringType } from '../states/TutoringTypeContext';
import { debounce } from 'lodash';
import fetchAPI from '@/modules/core/services/apiService';
import toast from 'react-hot-toast';
import ListadoStudents from './ListadoStudents';
import { useTutor } from '../states/TutorContext';

export default function SearchStudent({update, pageList, updateNow, filtro, session}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const { selectedTutoringType } = useTutoringType();
  const maxTotalPagesRef = useRef(totalPages); // Ref para almacenar el máximo valor de totalPages
  const [search, setSearch] = useState('');
  const {tutor, addTutor} = useTutor()

  async function fetchAlumnosTutoresData(page, pageSize, fid_tipoTutoria, valueSearch = '') {
    const response = await fetchAPI({
      endpoint: `/usuario/listar-alumnos-tutoria-sin-tutor`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "searchValue": valueSearch,
        "id_Tutor": tutor.Tutor.id_usuario,
        "id_tipoTutoria": fid_tipoTutoria,
        "page": page,
        "pageSize": pageSize,
        "sortBy": 'fechaCreacion',
        "sortOrder": 'DESC'
      },
      successMessage: 'Alumnos de la facultad listados.',
      errorMessage: 'Error al cargar alumnos.',
      showToast: false,
      useCache: true
    });
    console.log("respuesta es: ", response);
    if (response && response.data.alumnos.length > 0) {
      console.log("usuarios: ", response.data.alumnos)
      setUsers(response.data.alumnos);
      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.totalAlumnos);
    } else {
      setUsers([]);
      setTotalPages(0);
      setTotalUsers(0);
    }
  }

  useEffect(() => {
    if (session && session.accessToken) {
      fetchAlumnosTutoresData(currentPage, pageSize, selectedTutoringType, search);
    }
  }, [currentPage, pageSize]);

  const handleSearch = useCallback(debounce((searchValue) => {
    fetchAlumnosTutoresData(1, pageSize, selectedTutoringType, searchValue);
  }, 500), [users]);

  const handleSearchChange = (searchValue) => {
    setSearch(searchValue)
    handleSearch(searchValue)
  }

  const clearSearch = () => {
    setSearch('')
    setCurrentPage(1)
    fetchAlumnosTutoresData(1, pageSize, selectedTutoringType, '');
  };

  useEffect(() => {
    // Actualizar la referencia al valor máximo de totalPages
    if (totalPages > maxTotalPagesRef.current) {
      maxTotalPagesRef.current = totalPages;
    }
  }, [totalPages]);
  
  useEffect(() => {
    console.log("usuarios para modal: ", users);
  }, [users])

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const agregarUsuario = async (id_usuario, id_tutoringType) => {
    console.log(id_usuario)
    console.log(id_tutoringType)
    console.log(tutor)
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        throw new Error('Error validar Token')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/AsignacionTutorAlumno/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          "fid_alumno": id_usuario,
          "fid_tipoTutoria" : id_tutoringType,
          "fid_tutor": tutor.Tutor.id_usuario
        })
      });
      update(pageList,filtro)
      tutor.Tutor.cantAlumnos++
      addTutor(tutor)
      setCurrentPage(1)
      fetchAlumnosTutoresData(1, pageSize, selectedTutoringType, search);
      if (!response.ok) {
        throw new Error('Error en el fetch')
      }
    } catch (error) {
      return error
    }
  };

  const agregarUsuarioClick = async (id_usuario, id_tutoringType) => {
    toast.promise(
      agregarUsuario(id_usuario, id_tutoringType),
      {
        loading: 'Agregando Usuario...',
        success: 'Usuario agregado con éxito',
        error: 'Error al agregar usuario'
      },
      {
        style: {
          minWidth: '250px'
        }
      }
    ).then(async (response) => {
      console.log(response);
    }).catch((error) => {
      console.error('Failed to post render request: ', error);
    });
  };

  // Cuando se le da click al boton 'Guardar'
  // selectedUsers es un arreglo de arreglo de usuarios seleccionados por cada pagina
  const handleUsuariosSeleccionados = (selectedUsersByPage) => {
    console.log(selectedUsersByPage);
    console.log(selectedTutoringType)
    agregarUsuarioClick(selectedUsersByPage.id,selectedTutoringType)
  };

  useEffect(() => {
    fetchAlumnosTutoresData(1, pageSize, selectedTutoringType, search);
  }, [updateNow]);

  return (
    <div>
      <Button
        color='primary'
        variant='shadow'
        className='flex items-center justify-center w-44'
        startContent={<CirclePlus size={20} />}
        onPress={onOpen}
      >
        Agregar
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size='3xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Agregar Alumno</ModalHeader>
              <ModalBody className='flex items-center justify-center'>
                <ListadoStudents
                  users={users}
                  totalUsers={totalUsers}
                  pages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  onSelect={handleUsuariosSeleccionados}
                  onClose={onClose}
                  setRowsPerPage={setPageSize}
                  onSearchChange={handleSearchChange}
                  filtro={search}
                  onClear={clearSearch}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
