'use client';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator
} from '@/modules/core/components/desing-system/breadcrumb';
import UseLink from '@/modules/core/components/Uselink';

export default function UseBreadcrumb({ ...props }) {
  const pathname = usePathname();
  const lasPartofPathname = pathname.split('/').pop();
  return (
    <div className='px-8 mt-2 mb-1'>
      <Breadcrumb>
        <BreadcrumbList>
          {props.modules.map(({ url, text }, index) => {
            let isInclude = pathname.includes(url);
            return (
              <div className='flex flex-row items-center'>
                {pathname.includes(url)}
                {index !== 0 && isInclude && <BreadcrumbSeparator className='mr-4' />}
                <BreadcrumbItem>
                  <UseLink
                    href={isInclude ? pathname.replace(new RegExp(`${url}\/.*`), url) : pathname + url}
                    variant={'/' + lasPartofPathname === url ? 'bcActive' : 'bc'}
                    className={isInclude ? '' : 'hidden'}
                    text={text}
                  />
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
