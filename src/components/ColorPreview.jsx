export default function ColorPreview({ colorData, colorHex }) {
  if (!colorData) return <div>Loading...</div>;

  const color = `#${colorHex}`;

  // Convert hex → RGB to determine brightness
  const r = parseInt(colorHex.substring(0, 2), 16);
  const g = parseInt(colorHex.substring(2, 4), 16);
  const b = parseInt(colorHex.substring(4, 6), 16);

  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  const textColor = brightness > 140 ? "text-black" : "text-white";
  const subTextColor = brightness > 140 ? "text-black/70" : "text-white/70";

  return (
    <div className="p-6">

      {/* Color Block */}
      <div
        className={`w-full h-44 rounded-sm border border-gray-200 p-4 flex flex-col justify-between ${subTextColor}`}
        style={{ backgroundColor: color }}
      >
        {/* Top: Color name */}
        <h2 className={`text-lg font-semibold !${subTextColor}`}>
          {colorData.name?.value}
        </h2>

        {/* Bottom: Conversions */}
        <div className={`text-sm space-y-1 ${subTextColor}`}>
          <p>
            <span className="font-medium">HEX:</span> {colorData.hex?.value}
          </p>
          <p>
            <span className="font-medium">RGB:</span> {colorData.rgb?.value}
          </p>
          <p>
            <span className="font-medium">HSL:</span> {colorData.hsl?.value}
          </p>
        </div>
      </div>

    </div>
  );
}