const SkeletonCard = () => {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      p-6
      animate-pulse
      h-32
    "
    >
      <div
        className="
        h-4
        bg-gray-200
        rounded
        w-1/2
        mb-4
      "
      />

      <div
        className="
        h-8
        bg-gray-200
        rounded
        w-1/3
      "
      />
    </div>
  );
};

export default SkeletonCard;