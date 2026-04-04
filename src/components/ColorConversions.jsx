export default function ColorConversions({ colorData }) {
  if (!colorData) return <div>Loading...</div>;
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">Color Formats</h3>
      <div className="space-y-2 text-sm">
        <p><strong>HEX:</strong> {colorData.hex?.value}</p>
        <p><strong>RGB:</strong> {colorData.rgb?.value}</p>
        <p><strong>HSL:</strong> {colorData.hsl?.value}</p>
      </div>
    </div>
  );
}