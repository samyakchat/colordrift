export default function PaletteGrid({ palettes }) {
  if (!palettes || palettes.length === 0) {
    return <p className="text-gray-500">No palettes found</p>;
  }
  return (
    <div className="space-y-3">
      {palettes.map((color, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded border border-gray-300"
            style={{ backgroundColor: color.hex?.value || `#${color}` }}
          ></div>
          <p className="text-sm font-mono">{color.hex?.value || color}</p>
        </div>
      ))}
    </div>
  );
}