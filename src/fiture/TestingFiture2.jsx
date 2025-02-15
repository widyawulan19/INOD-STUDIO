import React, { useState } from 'react'

const TestingFiture2=()=> {
    // const [isHovered, setIsHovered] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);

    // Contoh teks dengan link di dalamnya
  const text =
  "Kunjungi website ini untuk informasi lebih lanjut: https://example.com dan https://reactjs.org.";

// Fungsi untuk mendeteksi URL dalam teks dan mengubahnya menjadi elemen <a>
const renderTextWithLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) =>
    part.match(urlRegex) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
        onMouseEnter={() => setHoveredLink(part)}
        onMouseLeave={() => setHoveredLink(null)}
      >
        {part}
      </a>
    ) : (
        <span key={index}>{part}</span>
    )
  );
};

return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative">
      <p className="text-lg text-gray-800">{renderTextWithLinks(text)}</p>

      {hoveredLink && (
        <div className="absolute mt-2 p-4 w-64 bg-white shadow-lg border rounded-md">
          <img
            src="https://via.placeholder.com/150"
            alt="Preview"
            className="w-full h-32 object-cover rounded-md"
          />
          <h3 className="text-sm font-semibold mt-2">{hoveredLink}</h3>
          <p className="text-xs text-gray-500">
            Ini adalah deskripsi singkat tentang link yang dihover.
          </p>
        </div>
      )}
    </div>
  );
}

export default TestingFiture2