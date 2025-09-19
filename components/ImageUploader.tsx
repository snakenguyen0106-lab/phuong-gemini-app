
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File, base64: string, mimeType: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn một tệp hình ảnh.');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        onImageUpload(file, base64String, file.type);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">1. Tải Ảnh Lên</h2>
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
        {preview ? (
          <img src={preview} alt="Xem trước" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-500 p-4">
            <p>Xem trước ảnh của bạn tại đây</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <button
        onClick={handleButtonClick}
        className="mt-4 w-full bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2"
      >
        <UploadIcon className="w-5 h-5" />
        <span>{fileName || 'Chọn ảnh từ thiết bị'}</span>
      </button>
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>✓ <span className="font-semibold">Chất lượng tốt:</span> Ảnh rõ nét, không bị mờ.</p>
        <p>✓ <span className="font-semibold">Góc mặt thẳng:</span> Nhìn thẳng vào camera.</p>
        <p>✓ <span className="font-semibold">Ánh sáng đều:</span> Tránh bóng tối trên khuôn mặt.</p>
      </div>
    </div>
  );
};

export default ImageUploader;
