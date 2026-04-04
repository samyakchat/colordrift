export default function DeveloperTools({ colorData, colorHex }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">Developer Tools</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-bold mb-2">iOS (SwiftUI)</p>
          <code className="bg-gray-100 p-2 rounded text-xs block">
            {`Color(red: ${colorData?.rgb?.r}/255, green: ${colorData?.rgb?.g}/255, blue: ${colorData?.rgb?.b}/255)`}
          </code>
        </div>
        <div>
          <p className="text-sm font-bold mb-2">Android (Kotlin)</p>
          <code className="bg-gray-100 p-2 rounded text-xs block">
            {`#${colorHex}`}
          </code>
        </div>
      </div>
    </div>
  );
}