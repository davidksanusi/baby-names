import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'antd';

const BabyCard = ({ baby,loading }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/overview/${baby.name}`)}
      className="cursor-pointer col-span-1 flex h-[200px] w-[200px] bg-gradient-to-r from-[#383838] to-[#928F8F] rounded-xl p-4 justify-between items-center gap-3 flex-col"
    >
      {!loading ? (
        <>
          <p className="underline text-xs font-medium leading-normal text-white">{baby?.number}</p>
          <p className="underline text-4xl font-bold leading-normal text-white">{baby?.name}</p>
          <div className="flex flex-col gap-1 justify-start items-start">
            <div className="flex gap-2 justify-center items-center">
              <Image alt='' src="/icons/baby-icon.svg" width={10} height={10} />
              <p className="text-xs font-medium leading-normal text-white">{baby?.total_birth_count} newborns</p>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <Image alt='' src="/icons/male-icon.svg" width={12} height={12} />
              <p className="text-xs font-medium leading-normal text-white">{baby?.m_ratio} Male</p>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <Image alt='' src="/icons/female-icon.svg" width={13} height={13} className="ml-[-1px]" />
              <p className="text-xs font-medium leading-normal text-white">{baby?.f_ratio} Female</p>
            </div>
          </div>
        </>
      ) : (
        <Skeleton active paragraph={{ rows: 4 }} />
      )}
    </div>
  );
};

export default BabyCard;
