interface AreaButtonProps {
  image: string;
  area_name: string;
  active: boolean;
  onClick?: () => void;
}

export default function AreaButton({
  image,
  area_name,
  active,
  onClick,
}: AreaButtonProps) {
  return (
    <>
      <div className="space-y-[10px]">
        <img
          src={image}
          alt=""
          className={`w-[89px] h-[89px] rounded-full ${
            active ? "border-2" : ""
          }  border-amber-300`}
          onClick={onClick}
        />
        <p className="text-lg text-center">{area_name}</p>
      </div>
    </>
  );
}
