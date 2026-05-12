interface Props {
  title: string;
  children: React.ReactNode;
}



const ChartCard = ({
  title,
  children,
}: Props) => {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-sm
      p-6
    "
    >
      <h2
        className="
        text-xl
        font-semibold
        mb-6
      "
      >
        {title}
      </h2>

      {children}
    </div>
  );
};

export default ChartCard;