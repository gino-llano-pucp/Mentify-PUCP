import Image from 'next/image';

const SidebarLogo = () => (
  <div className='flex items-center justify-center md:justify-normal mt-2'>
    <Image src='/tesisux.svg' alt='Mentify' width={30} height={30} />
    <span className="hidden text-[15px] ml-2 font-medium md:block">Mentify</span>
  </div>
);

export default SidebarLogo;
