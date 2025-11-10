"use client";

interface StatusData {
  new: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

interface Props {
  data: StatusData;
}

export default function StatusChart({ data }: Props) {
  const total = data.new + data.inProgress + data.resolved + data.closed;
  
  const getPercentage = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  const statusColors = {
    new: '#3b82f6', // blue
    inProgress: '#f59e0b', // amber
    resolved: '#10b981', // emerald
    closed: '#6b7280' // gray
  };

  const statusLabels = {
    new: 'Новые',
    inProgress: 'В работе',
    resolved: 'Решены',
    closed: 'Закрыты'
  };

  // Создаем данные для круговой диаграммы
  const chartData = Object.entries(data)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      status,
      count,
      percentage: getPercentage(count),
      color: statusColors[status as keyof StatusData],
      label: statusLabels[status as keyof StatusData]
    }));

  let currentAngle = 0;

  return (
    <div className="flex flex-col items-center">
      {/* Круговой график */}
      <div className="relative w-48 h-48 mb-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {total === 0 ? (
            // Если нет данных, показываем серый круг
            <circle cx="50" cy="50" r="45" fill="#f3f4f6" />
          ) : (
            chartData.map((item, index) => {
              const angle = (item.percentage / 100) * 360;
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const x1 = 50 + 45 * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 50 + 45 * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = 50 + 45 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 45 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              const segment = (
                <path
                  key={item.status}
                  d={pathData}
                  fill={item.color}
                  stroke="#fff"
                  strokeWidth="2"
                />
              );
              
              currentAngle += angle;
              return segment;
            })
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
          <div key={item.status} className="flex items-center justify-between text-sm">
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