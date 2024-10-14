import React, { useCallback, useEffect, useState } from 'react';
import { ControllerDateRange } from '@/modules/core/components/ControllerDateRange';
import SearchInput from '@/modules/core/components/SearchInput';
import fetchAPI from '@/modules/core/services/apiService';
import { debounce } from 'lodash';
import DataListAuditoria from '@/modules/core/components/DataListAuditoria';
import TableListErrorLogs from '../../components/TableListErrorLogs';
import { DatePicker } from '@nextui-org/react';

export const LogErrores = ({session}) => {
  const [dateRange, setDateRange] = useState();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [errorTypeSearch, setErrorTypeSearch] = useState('');

  useEffect(() => {
    fetchErrorLogs(page, dateRange, userSearch, errorTypeSearch);
  }, [page, dateRange]);

  useEffect(() => {
    setPage(1);
  }, [dateRange, userSearch, errorTypeSearch]);

  const fetchErrorLogs = async (pageNum, dateRange, userSearchValue, errorTypeSearchValue) => {
    setLoading(true);
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    const data = await fetchAPI({
      endpoint: `/error-logs/listar-paginacion`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        page: pageNum,
        pageSize: 15,
        fechaDesde: dateRange ? `${dateRange.start.year}-${dateRange.start.month}-${dateRange.start.day}` : undefined,
        fechaHasta: dateRange ? `${dateRange.end.year}-${dateRange.end.month}-${dateRange.end.day}` : undefined,
        searchCriterias: [
          {
            field: 'performedBy',
            value: userSearchValue
          },
          {
            field: 'errorType',
            value: errorTypeSearchValue
          }
        ]
      },
      successMessage: 'Logs de errores cargados correctamente',
      errorMessage: 'Error al cargar logs de errores',
      showToast: false
    });
    
    if (data && data.data && data.data.errorLogs) {
      setData(data.data.errorLogs);
      setTotalPages(data.data.totalPages);
    } else {
      setData([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const handleUserSearch = useCallback(debounce((searchValue) => {
    fetchErrorLogs(1, dateRange, searchValue, errorTypeSearch);
  }, 500), [dateRange, errorTypeSearch]);

  const handleErrorTypeSearch = useCallback(debounce((searchValue) => {
    fetchErrorLogs(1, dateRange, userSearch, searchValue);
  }, 500), [dateRange, userSearch]);

  const handleUserSearchChange = (e) => {
    setUserSearch(e.target.value);
    handleUserSearch(e.target.value);
  };

  const handleErrorTypeSearchChange = (e) => {
    setErrorTypeSearch(e.target.value);
    handleErrorTypeSearch(e.target.value);
  };

  const clearUserSearch = () => {
    setUserSearch('');
    setPage(1);
    fetchErrorLogs(1, dateRange, '', errorTypeSearch);
  };

  const clearErrorTypeSearch = () => {
    setErrorTypeSearch('');
    setPage(1);
    fetchErrorLogs(1, dateRange, userSearch, '');
  };

  return (
    <div className='flex items-end w-full gap-2 flex-row flex-wrap'>
      <div className='flex flex-wrap gap-4 w-full'>
        <div className='flex flex-col gap-1 w-full md:w-1/4'>
          <span className='text-base font-medium'>Nombre o correo de usuario</span>
          <SearchInput
            placeholder={'Buscar por nombre o correo de usuario'}
            value={userSearch}
            onChange={handleUserSearchChange}
            clearSearch={clearUserSearch}
          />
        </div>
        <div className='flex flex-col gap-1 w-full md:w-1/4'>
          <span className='text-base font-medium'>Tipo de Error</span>
          <SearchInput
            placeholder={'Buscar por tipo de error'}
            value={errorTypeSearch}
            onChange={handleErrorTypeSearchChange}
            clearSearch={clearErrorTypeSearch}
          />
        </div>
        <ControllerDateRange setValue={setDateRange} isFullLength={true}/>
      </div>
      <DataListAuditoria
        fetchData={fetchErrorLogs}
        noResultsText="No se encontraron logs de errores."
        data={data}
        ListRenderer={TableListErrorLogs}
        showToolbarHeader={false}
        dateRange={dateRange}
        loading={loading}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
};

export default LogErrores;