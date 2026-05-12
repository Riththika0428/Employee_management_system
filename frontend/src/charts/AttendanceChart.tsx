import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";



const AttendanceChart = ({
  data,
}: any) => {
  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <BarChart data={data}>
        <XAxis dataKey="day" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="attendance"
          fill="#16a34a"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;