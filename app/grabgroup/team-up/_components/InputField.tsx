import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
export default function InputField() {
  return (
    <>
      <div className="border-2 border-[#D9D9D9] bg-white rounded-full w-[1048px] h-[64px] customize_shadow flex items-center justify-between px-[26px] py-[20px] ">
        <div className="flex items-center w-[200px] justify-between">
          <input type="text" placeholder="目的地" />
        </div>
        <div className="flex items-center w-[200px] gap-[10px]">
          <div className="customize_gray h-[20px] w-[2px]"></div>
          <input type="text" placeholder="開始時間" className="w-[72px]" />
        </div>
        <div className="flex items-center w-[200px] gap-[10px]">
          <div className="customize_gray h-[20px] w-[2px]"></div>
          <input type="text" placeholder="人數" className="w-[72px]" />
        </div>

        <button className="bg-amber-400 text-white px-[30px] py-[10px] flex justify-center items-center gap-[10px] rounded-full">
          <FontAwesomeIcon icon={faPlus} />
          新增行程
        </button>
      </div>
    </>
  );
}
