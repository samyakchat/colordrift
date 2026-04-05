export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 py-6 bg-white">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        
        <p className="text-sm text-gray-500">
          ©2026 Colordrift. 
        </p>

        <div className="flex gap-4 mt-3 md:mt-0 text-sm text-gray-500">
          <a href="/about" className="hover:text-gray-900">About</a>
          <a href="/palettes" className="hover:text-gray-900">Palettes</a>
          <a href="#" className="hover:text-gray-900">Feedback</a>
        </div>

      </div>
    </footer>
  );
}