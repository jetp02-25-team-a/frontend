import { CgOptions } from 'react-icons/cg';

export default function Filters() {
  return (
    <div className="w-[120px] h-[60px] inline-flex justify-center items-center gap-2 px-4 py-3  bg-brand rounded-[72px] border border-solid border-gray-200 font-semibold customize_shadow">
      <CgOptions className=" w-5 h-5" />
      <div className="">Filters</div>
    </div>
  );
}
