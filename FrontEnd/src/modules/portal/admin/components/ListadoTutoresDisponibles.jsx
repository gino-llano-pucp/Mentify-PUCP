import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination } from '@nextui-org/react';
import { PlusIcon, SearchIcon, ChevronDownIcon } from 'lucide-react';

const columns = [
  { name: 'NOMBRE', uid: 'name', sortable: true },
  { name: 'CODIGO', uid: 'code', sortable: true }
];

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning'
};

const INITIAL_VISIBLE_COLUMNS = ['name', 'code'];

export default function ListadoTutoresDisponibles({ onSelect }) {
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState('all');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'name',
    direction: 'ascending'
  });
  const [page, setPage] = useState(1);
  const [tutores, setTutores] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const handleSelectionChange = (keys) => {
    setSelectedKeys(keys);
    if (keys.size > 0) {
      const selectedId = keys.currentKey;
      const selectedTutor = tutores.find((tutor) => tutor.id === parseInt(selectedId));
      if (selectedTutor) {
        onSelect(selectedTutor);
      }
    }
  };

  useEffect(() => {
    async function fetchTutors() {
      try {
        console.log('Fetching tutors...');
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/usuario/tutores-exclusivos-activos/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              page,
              pageSize: rowsPerPage,
              sortBy: sortDescriptor.column === 'name' ? 'nombres' : sortDescriptor.column === 'code' ? 'codigo' : sortDescriptor.column,
              sortOrder: sortDescriptor.direction === 'ascending' ? 'ASC' : 'DESC',
              searchCriterias: [
                { field: 'nombres', value: filterValue },
                { field: 'primerApellido', value: filterValue },
                { field: 'segundoApellido', value: filterValue },
                { field: 'email', value: filterValue },
                { field: 'codigo', value: filterValue },
                { field: 'fullName', value: filterValue }
              ]
            })
          }
        );
        const data = await response.json();
        console.log(data);
        setTutores(data.tutores || []); // Ensure tutores is an array
        setTotalPages(data.totalPages || 1); // Ensure totalPages is a number
      } catch (error) {
        console.error('Failed to fetch tutors', error);
      }
    }

    fetchTutors();

  }, [page, rowsPerPage, sortDescriptor, filterValue]);

  const headerColumns = visibleColumns === 'all' ? columns : columns.filter((column) => visibleColumns.has(column.uid));

  const sortedItems = tutores.sort((a, b) => {
    const first = a[sortDescriptor.column];
    const second = b[sortDescriptor.column];
    const cmp = first < second ? -1 : first > second ? 1 : 0;
    return sortDescriptor.direction === 'descending' ? -cmp : cmp;
  });

  const renderCell = (tutor, columnKey) => {
    const cellValue = tutor[columnKey];
    switch (columnKey) {
      case 'name':
        const fullName = `${tutor.name} ${tutor.primerApellido} ${tutor.segundoApellido}`;
        return (
          <User avatarProps={{ radius: 'lg', src: tutor.avatar }} description={tutor.email} name={fullName}>
            {tutor.email}
          </User>
        );
      case 'status':
        return (
          <Chip className='capitalize' color={statusColorMap[tutor.status]} size='sm' variant='flat'>
            {cellValue}
          </Chip>
        );
      default:
        return cellValue;
    }
  };

  const onNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const onPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const onRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const onSearchChange = (value) => {
    setFilterValue(value);
    setPage(1);
  };

  const onClear = () => {
    setFilterValue('');
    setPage(1);
  };

  const topContent = (
    <div className='flex flex-col gap-4'>
      <div className='flex items-end justify-between gap-3'>
        <Input
          isClearable
          className='w-full sm:max-w-96'
          placeholder='Ingresa el código, nombre o correo del tutor'
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />
      </div>
      <div className='flex items-center justify-between'>
        <span className='text-default-400 text-small'>Total {tutores.length} tutores</span>
        <label className='flex items-center text-default-400 text-small'>
          Filas por página:
          <select
            className='bg-transparent outline-none text-default-400 text-small'
            onChange={onRowsPerPageChange}
          >
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='15'>15</option>
          </select>
        </label>
      </div>
    </div>
  );

  const bottomContent = (
    <div className='flex items-center justify-center px-2 py-2'>
      <Pagination
        isCompact
        showControls
        showShadow
        size='md'
        color='primary'
        page={page}
        total={totalPages}
        onChange={setPage}
      />
      <div className='hidden sm:flex w-[30%] justify-end gap-2'>
        <Button isDisabled={totalPages === 1} size='sm' variant='flat' onPress={onPreviousPage}>
          Anterior
        </Button>
        <Button isDisabled={totalPages === 1} size='sm' variant='flat' onPress={onNextPage}>
          Siguiente
        </Button>
      </div>
    </div>
  );

  return (
    <Table
      aria-label='Example table with custom cells, pagination and sorting'
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      classNames={{ wrapper: 'max-h-[382px]' }}
      selectedKeys={selectedKeys}
      selectionMode='single'
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement='outside'
      onSelectionChange={handleSelectionChange}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'Tutor no encontrado'} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => 
              <TableCell className={columnKey == 'name' ? 'w-3/4' : 'w-1/4'}>
                {renderCell(item, columnKey)}
              </TableCell>
            }
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
