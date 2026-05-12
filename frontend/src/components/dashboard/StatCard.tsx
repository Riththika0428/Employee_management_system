interface Props {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}



const StatCard = ({
  title,
  value,
  icon,
}: Props) => {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-sm
      p-6
      flex
      items-center
      justify-between
    "
    >
      <div>
        <p className="text-gray-500">
          {title}
        </p>

        <h2
          className="
          text-3xl
          font-bold
          mt-2
        "
        >
          {value}
        </h2>
      </div>

      <div
        className="
        w-14
        h-14
        rounded-xl
        bg-blue-100
        flex
        items-center
        justify-center
      "
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;