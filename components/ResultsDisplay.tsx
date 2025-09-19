
import React from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon } from './icons';

interface ResultsDisplayProps {
  images: GeneratedImage[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ images }) => {
    if (images.length === 0) return null;

    const handleDownload = (src: string, filename: string) => {
        const link = document.createElement('a');
        link.href = src;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
  return (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-gray-800">Kết Quả (4 Biến Thể)</h3>
            <p className="text-sm text-gray-500">Mỗi ảnh có một tinh chỉnh khuôn mặt và sắc độ áo khác nhau.</p>
        </div>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.id} className="group relative rounded-lg overflow-hidden border border-gray-200">
            <img src={image.src} alt={image.title} className="w-full h-auto object-cover aspect-[3/4]" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-3 text-white transition-all opacity-0 group-hover:opacity-100">
              <p className="font-bold text-sm truncate">{image.title}</p>
              <p className="text-xs text-gray-300">Màu áo: {image.colorName}</p>
            </div>
             <button
                onClick={() => handleDownload(image.src, `anh-the-${image.id}.png`)}
                className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-gray-700 hover:bg-white hover:text-blue-600 transition-all scale-0 group-hover:scale-100"
                aria-label="Tải ảnh này"
                title="Tải ảnh này"
              >
                  <DownloadIcon className="w-5 h-5"/>
              </button>
          </div>
        ))}
      </div>
       <button
            onClick={() => alert("Chức năng tải file ZIP đang được phát triển!")}
            className="w-full bg-green-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2"
        >
            <DownloadIcon className="w-5 h-5"/>
            <span>Tải Tất Cả (ZIP)</span>
        </button>
    </div>
  );
};

export default ResultsDisplay;
