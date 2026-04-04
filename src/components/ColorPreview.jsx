export default function ColorPreview({ colorData, colorHex }) {
  if (!colorData) return <div>Loading...</div>;
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div 
        className="w-full h-48 rounded-lg mb-4 shadow-md border-4 border-gray-200"
        style={{ backgroundColor: `#${colorHex}` }}
      ></div>
      <h2 className="text-2xl font-bold">{colorData.name?.value}</h2>
      <p className="text-gray-600">#{colorHex}</p>
    </div>
  );
}