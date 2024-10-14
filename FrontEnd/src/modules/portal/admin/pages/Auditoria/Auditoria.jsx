import { ControllerDateRange } from '@/modules/core/components/ControllerDateRange';
import DataListAuditoria from '@/modules/core/components/DataListAuditoria';
import SearchInput from '@/modules/core/components/SearchInput';
import TableListAuditoria from '@/modules/portal/admin/components/TableListAuditoria';
import fetchAPI from '@/modules/core/services/apiService';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react'

export const Auditoria = ({session}) => {
  const [dateRange, setDateRange] = useState();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');

  useEffect(() => {
    fetchDataAuditoria(page, dateRange, userSearch, tableSearch);
  }, [page, dateRange]);

  useEffect(() => {
    setPage(1);
  }, [dateRange, userSearch, tableSearch]);

  const fetchDataAuditoria  = async (pageNum, dateRange, userSearchValue, tableSearchValue) => {
    setLoading(true)
    if (!session || !session.accessToken) {
        console.log('No session or token available');
        return;
      }
      const data = await fetchAPI({
      endpoint: `/audit/listar`,
      method: 'POST',
      token: session.accessToken,
      payload: {
          page: pageNum,
          pageSize: 15,
          "fechaDesde": dateRange ? `${dateRange.start.year}-${dateRange.start.month}-${dateRange.start.day}` : undefined,
          "fechaHasta": dateRange ? `${dateRange.end.year}-${dateRange.end.month}-${dateRange.end.day}` : undefined,
          searchCriterias: [
            {
              field: 'performedBy',
              value: userSearchValue
            },
            {
              field: 'tableName',
              value: tableSearchValue
            }
          ]
      },
      successMessage: 'Datos de auditoria cargados correctamente',
      errorMessage: 'Error al cargar Datos de Auditoria',
      showToast: false
    });
    console.log(data)
    if(data&&data.registers&&data.totalPages){
      setData(data.registers)
      setTotalPages(data.totalPages)
    }
    else{
      setData([])
      setTotalPages(0)
    }
    setLoading(false)
  };

  const handleUserSearch = useCallback(debounce((searchValue) => {
    fetchDataAuditoria(1, dateRange, searchValue, tableSearch);
  }, 500), [dateRange, tableSearch]);

  const handleTableSearch = useCallback(debounce((searchValue) => {
    fetchDataAuditoria(1, dateRange, userSearch, searchValue);
  }, 500), [dateRange, userSearch]);

  const handleUserSearchChange = (e) => {
    setUserSearch(e.target.value);
    handleUserSearch(e.target.value);
  };

  const handleTableSearchChange = (e) => {
    setTableSearch(e.target.value);
    handleTableSearch(e.target.value);
  };

  const clearUserSearch = () => {
    setUserSearch('');
    setPage(1);
    fetchDataAuditoria(1, dateRange, '', tableSearch);
  };

  const clearTableSearch = () => {
    setTableSearch('');
    setPage(1);
    fetchDataAuditoria(1, dateRange, userSearch, '');
  };
  

  return (
    <div className='flex items-end w-full gap-2 flex-row flex-wrap'>
        <div className='flex flex-wrap gap-4 w-full'>
          <div className='flex flex-col gap-1 w-full md:w-1/4'>
              <span className='text-base font-medium'>Nombre de usuario</span>
              <SearchInput
                placeholder={'Buscar por nombre de usuario'}
                value={userSearch}
                onChange={handleUserSearchChange}
                clearSearch={clearUserSearch}
              />
          </div>
          <div className='flex flex-col gap-1 w-full md:w-1/4'>
            <span className='text-base font-medium'>Nombre de tabla</span>
            <SearchInput
              placeholder={'Buscar por nombre de tabla'}
              value={tableSearch}
              onChange={handleTableSearchChange}
              clearSearch={clearTableSearch}
            />
          </div>
          <ControllerDateRange setValue={setDateRange} isFullLength={true}/>
        </div>
        <DataListAuditoria
            fetchData={fetchDataAuditoria}
            noResultsText="No se encontraron registros de auditoría."
            data={data}
            ListRenderer={TableListAuditoria}  // Pasa TableList como el componente para renderizar la lista
            showToolbarHeader={false}
            dateRange={dateRange}
            loading={loading}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
        />
    </div>
  )
}
