'use client';
import {
  SelectItem,
  Select,
  select,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem
} from '@nextui-org/react';
import { ChevronDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const GeneralDropdown = ({ options, selectedKeys, setSelectedKeys }) => {

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("-", " "),
    [selectedKeys]
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="bordered" 
          className="capitalize w-1/2"
          endContent={<ChevronDownIcon size={16} />}
        >
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        {
          options.map((option, index) => <DropdownItem key={option.key}>{option.value}</DropdownItem>)
        }
      </DropdownMenu>
    </Dropdown>
  );
};

export default GeneralDropdown;