"use client";

interface PriorityData {
  high: number;
  medium: number;
  low: number;
}

interface Props {
  data: PriorityData;
}

export default function PriorityChart({ data }: Props) {
  const total = data.high + data.medium + data.low;
  
  const getPercentage = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  const priorityColors = {
    high: '#ef4444', // red
    medium: '#f59e0b', // amber
    low: '#10b981' // emerald
  };

  const priorityLabels = {
    high: 'Высокий',
    medium: 'Средний', 
    low: 'Низкий'
  };

  // Создаем данные для круговой диаграммы
  const chartData = Object.entries(data)
    .filter(([, count]) => count > 0)
    .map(([priority, count]) => ({
      priority,
      count,
      percentage: getPercentage(count),
      color: priorityColors[priority as keyof PriorityData],
      label: priorityLabels[priority as keyof PriorityData]
    }));

  // Рассчитываем углы для сегментов
  let currentAngle = 0;
  const segments = chartData.map(item => {
    const angle = (item.percentage / 100) * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return segment;
  });

  // Функция для преобразования полярных координат в декартовы
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Функция для создания пути сегмента
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", x, y,
      "Z"
    ].join(" ");
  };

  return (
    <div className="flex flex-col items-center">
      {/* Круговой график */}
      <div className="relative w-48 h-48 mb-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {total === 0 ? (
            <circle cx="50" cy="50" r="45" fill="#f3f4f6" />
          ) : (
            segments.map((segment, index) => (
              <path
                key={segment.priority}
                d={describeArc(50, 50, 45, segment.startAngle, segment.endAngle)}
                fill={segment.color}
                stroke="#fff"
                strokeWidth="2"
              />
            ))
          )}
        </svg>
        
        {/* Центральный текст */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{total}</div>
            <div className="text-xs text-gray-600">дефектов</div>
          </div>
        </div>
      </div>

      {/* Легенда */}
      <div className="space-y-2 w-full">
        {chartData.map((item) => (
          <div key={item.priority} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{item.count}</span>
              <span className="text-gray-500 text-xs">
                ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}