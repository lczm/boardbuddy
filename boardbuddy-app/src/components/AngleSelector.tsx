interface AngleSelectorProps {
  angle: number;
  onAngleChange: (angle: number) => void;
  className?: string;
}

const ANGLE_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

export default function AngleSelector({
  angle,
  onAngleChange,
  className = "",
}: AngleSelectorProps) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onAngleChange(Number(e.target.value));
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label
        htmlFor="angle-select"
        className="text-sm font-medium text-gray-700"
      >
        Angle:
      </label>
      <select
        id="angle-select"
        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        onChange={handleSelectChange}
        value={angle}
      >
        {ANGLE_OPTIONS.map((angleOption) => (
          <option key={angleOption} value={angleOption}>
            {angleOption}°
          </option>
        ))}
      </select>
    </div>
  );
}
