import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { CirclePlus } from 'lucide-react';
import ListadoUsuarios from './ListadoUsuarios';
import { useTutoringType } from '../states/TutoringTypeContext';
import { debounce } from 'lodash';
import fetchAPI from '@/modules/core/services/apiService';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

export default function AgregarUsuariosTipoTutoria({update, pageList, updateNow, filtro, session}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const { selectedTutoringType } = useTutoringType();
  const maxTotalPagesRef = useRef(totalPages); // Ref para almacenar el máximo valor de totalPages
  const [search, setSearch] = useState('');
  const [currentRole, setCurrentRole] = useState(new Set(["Tutor"]));
  const decoded = jwtDecode(session.accessToken);

  async function fetchAlumnosTutoresData(page, pageSize, fid_tipoTutoria, valueSearch, role) {
    const arrayRole = Array.from(role);
    try {
      const response = await fetchAPI({
        endpoint: `/usuario/listarUsuariosPorCoordinador`,
        method: 'POST',
        token: session.accessToken,
        payload: {
          "idCoord": decoded.id,
          "searchValue": valueSearch, // ! código, nombre, primeraApellido, correo del usuario
          "currentRole": arrayRole[0], // ! 'Todos', 'Alumno', 'Tutor'
          "page": page,
          "pageSize": pageSize,
          "id_tipoTutoria": fid_tipoTutoria
        },
        successMessage: 'Alumnos de la facultad listados.',
        errorMessage: 'Error al cargar alumnos.',
        showToast: false,
        useCache: true
      });
      console.log("respuesta es: ", response);
      if(response){
        setUsers(response.data.usuarios);
        setTotalPages(response.data.totalPages);
        setTotalUsers(response.data.totalUsuarios);
      } else{
        setUsers([])
        setTotalPages(0);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error('Failed to fetch alumnos', error);
    }
  }

  useEffect(() => {
    if (session && session.accessToken) {
      fetchAlumnosTutoresData(currentPage, pageSize, selectedTutoringType, search, currentRole);
    }
  }, [currentPage, pageSize, currentRole]);

  const handleSearch = useCallback(debounce((searchValue) => {
    fetchAlumnosTutoresData(1, pageSize, selectedTutoringType, searchValue, currentRole);
  }, 500), [users]);

  const handleSearchChange = (searchValue) => {
    setSearch(searchValue)
    handleSearch(searchValue)
  }

  const clearSearch = () => {
    setSearch('')
    setCurrentPage(1)
    fetchAlumnosTutoresData(1, pageSize, selectedTutoringType, '', currentRole);
  };

  useEffect(() => {
    // Actualizar la referencia al valor máximo de totalPages
    if (totalPages > maxTotalPagesRef.current) {
      maxTotalPagesRef.current = totalPages;
    }
  }, [totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const agregarUsuario = async (id_usuario, id_tutoringType, rol=null) => {
    console.log(rol)
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        setFlag(false)
        throw new Error('Error validar Token')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/agregar-usuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          "idUsuario": id_usuario,
          "idTipoTutoria" : id_tutoringType,
          "nameRol" : rol
        })
      });
      update(pageList,filtro)
      setCurrentPage(1)
      fetchAlumnosTutoresData(1, pageSize, selectedTutoringType, search, currentRole);
      if (!response.ok) {
        setFlag(false)
        throw new Error('Error en el fetch')
      }
    } catch (error) {
      setFlag(false)
      throw new Error('Error al Agregar Usuario')
    }
  };

  const agregarUsuarioClick = async (id_usuario, id_tutoringType, rol=null) => {
    toast.promise(
      agregarUsuario(id_usuario, id_tutoringType, rol),
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
    ).catch((error) => {
      console.error('Failed to post render request: ', error);
    });
  };

  // Cuando se le da click al boton 'Guardar'
  // selectedUsers es un arreglo de arreglo de usuarios seleccionados por cada pagina
  const handleUsuariosSeleccionados = (selectedUsersByPage) => {
    const role = currentRole.values().next().value;
    agregarUsuarioClick(selectedUsersByPage.id,selectedTutoringType,role)
  };

  useEffect(() => {
    fetchAlumnosTutoresData(1, pageSize, selectedTutoringType, search, currentRole);
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
        Agregar Usuario
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size='3xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Agregar Usuario</ModalHeader>
              <ModalBody className='flex items-center justify-center'>
                <ListadoUsuarios
                  users={users}
                  totalUsers={totalUsers}
                  pages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  onSelect={handleUsuariosSeleccionados}
                  onClose={onClose}
                  setRowsPerPage={setPageSize}
                  setRoleFilter={setCurrentRole}
                  roleFilter={currentRole}
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
