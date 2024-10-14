import fetchAPI from '@/modules/core/services/apiService';
import React, { useState } from 'react'
import AddResponsable from './AddResponable';
import FilterStatusDropdown from '@/modules/core/components/FilterStatusDropdown';
import SearchInput from '@/modules/core/components/SearchInput';
import { ListadoResponsables } from '../../components/ListadoResponsables';

export const GestionResponsable = ({session}) => {

  const [filtro, setFiltro] = useState('');
  const [statusFilter, setStatusFilter] = useState(new Set(["Activo"]));
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [endIndex, setEndIndex] = useState(startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handleSearchChange = (e) => {
    if(e.target.value.length === 0){
      setEndIndex(9);
    }
    setCurrentPage(1);
    setFiltro(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const newStartIndex = (page - 1) * itemsPerPage;
    const newEndIndex = Math.min(newStartIndex + itemsPerPage, filteredResponsables.length);
    setEndIndex(newEndIndex);
};

  const filteredResponsables = responsables.filter((responsable) => {
    console.log(responsables);
    const filtroLower = filtro.toLowerCase();
    const nombresLower = responsable.nombre.toLowerCase();
    const apLower = responsable.primerApellido.toLowerCase();
    const codigoLower = responsable.codigo.toLowerCase();
    const emailLower = responsable.correo.toLowerCase();
    const nombreAndAp = `${nombresLower} ${apLower}`;
    const currentStatusFilter = [...statusFilter];
    return (
      (nombresLower.includes(filtroLower) ||
        nombreAndAp.includes(filtroLower) ||
        codigoLower.includes(filtroLower) ||
        apLower.includes(filtroLower) ||
        emailLower.includes(filtroLower)) &&
      (currentStatusFilter.length === 3 ||
        currentStatusFilter.includes(responsable.esActivo ? 'Activo' : 'Inactivo'))
    );
  });

  const usersToShow = filteredResponsables.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredResponsables.length / itemsPerPage);

  const fetchResponsables = async () => {
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }

    const data = await fetchAPI({
      endpoint: `/usuario/listar-responsable-tutoria`,
      method: 'GET',
      token: session.accessToken,
      payload: {
        role: 'ResponsableTutoria'
      },
      successMessage: 'Responsables cargados correctamente',
      errorMessage: 'Error al cargar Responsables',
      showToast: false
    });

    console.log(data);

    if (data && data.data && Object.keys(data.data).length > 0) {
      setResponsables(data.data);
      console.log(filteredResponsables);
    } else {
      console.log('No hay responsables')
      setResponsables([]);
    }
    setLoading(false);
  }

  const clearSearch = () => {
      setEndIndex(9)
      setFiltro('');
  };

  return (
    <div className='flex flex-col w-full h-full gap-6 '>
      <div className='flex flex-row items-end justify-between w-full'>
        <div className='flex flex-wrap items-end w-full gap-2'>
          <div className='flex flex-col w-full md:w-3/5 gap-1'>
            <span className='text-lg font-semibold'>Código, nombre o correo del responsable de tutoría</span>
            <SearchInput
              placeholder='Ingresa el código, nombre o correo del responsable de tutoría'
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clearSearch}
            />
          </div>
          <FilterStatusDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} fetch={fetchResponsables} filtro={filtro} setPage={setPage}/>
          <AddResponsable update={fetchResponsables} session={session}/>
        </div>
      </div>

      <ListadoResponsables filteredUsers={usersToShow} loading={loading} userName='Responsable' update={fetchResponsables} session={session} totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange}/>

    </div>
  )
}