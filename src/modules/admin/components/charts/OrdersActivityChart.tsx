import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OrdersByDay {
  date: string;
  revenue: number;
}

interface Props {
  ordersByDay: OrdersByDay[];
}

export default function OrdersActivityChart({ ordersByDay }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Actividad de Pedidos por Día
        </h3>
      </div>

      <div className="p-6 h-72">
        {ordersByDay.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ordersByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                  })
                }
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `S/ ${value.toFixed(2)}`}
                labelFormatter={(date) =>
                  new Date(date).toLocaleDateString("es-ES")
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FF5733"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">
            No hay datos suficientes para gráficos
          </p>
        )}
      </div>
    </div>
  );
}
