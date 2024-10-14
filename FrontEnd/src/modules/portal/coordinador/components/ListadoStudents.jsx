import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Pagination
} from '@nextui-org/react';
import { SearchIcon, ChevronDownIcon } from 'lucide-react';
import { capitalize } from 'lodash';
import { set } from 'lodash';

const columns = [
  { name: 'NOMBRE', uid: 'name', sortable: true },
  { name: 'CODIGO', uid: 'code', sortable: true },
  { name: 'PROGRAMA', uid: 'programa', sortable: true }
];

const INITIAL_VISIBLE_COLUMNS = ['name', 'code', 'programa'];

export default function ListadoStudents({ users, totalUsers, onSelect, onClose, currentPage, pages, onPageChange, setRowsPerPage, onSearchChange, filtro, onClear }) {
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'code',
    direction: 'ascending'
  });
  const [selectedUser, setSelectedUser] = useState(null);
  let flag = false;

  useEffect(() => {
    flag = false;
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const handleSelectionChange = (keys) => {
    setSelectedKeys(keys);
    const selectedId = Array.from(keys).map(Number)[0]; // id del usuario seleccionado
    const user = users.find((user) => user.id === selectedId); // obtener el usuario objeto en base a la id
    setSelectedUser(user); // Actualizar el usuario seleccionado
  };

  useEffect(() => {
    console.log("Usuario seleccionado: ", selectedUser);
  }, [selectedUser]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => {
        const fullName = `${user.nombres} ${user.primerApellido} ${user.segundoApellido}`;
        return (
          fullName.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.codigo.toString().includes(filterValue.toLowerCase())
        );
      });
    }

    return filteredUsers;

  }, [users, filterValue]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case 'name':
        const fullName = `${user.nombres} ${user.primerApellido} ${user.segundoApellido}`;
        return (
          <User avatarProps={{ radius: 'lg', src: user.avatar }} description={user.email} name={fullName}>
            {user.email}
          </User>
        );
      case 'programa':
        return <span className='flex justify-center'>{user.programa === null ? '-' : user.programa}</span>;
      case 'code':
        return <span>{user.codigo}</span>;
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (currentPage < pages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, pages, onPageChange]);

  const onPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    onPageChange(1);
  }, [onPageChange]);

  const handleSeleccionUsuarios = () => {
    onSelect(selectedUser); // Aquí ya no es necesario pasar selectedUsersByPage
    onPageChange(1);
    onClose();
  }

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-end justify-between gap-3'>
          <Input
            isClearable
            className='w-full sm:max-w-lg'
            placeholder='Ingresa el código, nombre o correo del alumno'
            startContent={<SearchIcon />}
            value={filtro}
            onClear={onClear}
            onChange={(e) => {onSearchChange(e.target.value)}}
          />
          <Button color='primary' isDisabled={!selectedUser} 
          onPress={()=>{
            if(!flag) flag = true;
            else return;
            handleSeleccionUsuarios();
            }}>Agregar</Button>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-default-400 text-small'>Total {totalUsers} alumnos.</span>
          <label className='flex items-center text-default-400 text-small'>
            Filas por página:
            <select
              className='bg-transparent outline-none text-default-400 text-small'
              onChange={onRowsPerPageChange}
            >
              <option value='10'>10</option>
              <option value='20'>20</option>
              <option value='30'>30</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    onClear,
    totalUsers,
    selectedUser // Asegúrate de incluir selectedUser aquí
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className='flex items-center justify-center px-2 py-2'>
        <Pagination
          isCompact
          showControls
          showShadow
          size='md'
          color='primary'
          page={currentPage}
          total={pages}
          onChange={onPageChange}
        />
        <div className='hidden sm:flex w-[30%] justify-end gap-2'>
          <Button isDisabled={pages === 1} size='sm' variant='flat' onPress={onPreviousPage}>
            Anterior
          </Button>
          <Button isDisabled={pages === 1} size='sm' variant='flat' onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [currentPage, pages, onPageChange, onNextPage, onPreviousPage]);

  return (
    <Table
      aria-label='Lista de alumnos'
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      classNames={{
        wrapper: 'max-h-[382px]'
      }}
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
      <TableBody emptyContent={'No hay alumnos por listar.'} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => 
              <TableCell className={columnKey === 'name' ? 'w-3/4' : 'w-1/4'}>
                {renderCell(item, columnKey)}
              </TableCell>
            }
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
