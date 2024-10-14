import { Input } from '@nextui-org/react';

const InputField = ({ name, label, type, endContent }) => (
  <label className='input-field'>
    <span className='text-lg font-medium text-[#39487F]'>{label}</span>
    <Input
      name={name}
      variant='bordered'
      isRequired
      placeholder={`Ingresa tu ${label.toLowerCase()}`}
      endContent={endContent}
      type={type}
    />
  </label>
);

export default InputField;
