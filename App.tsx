
import React, { useState, useCallback } from 'react';
import { EditingOptions, GeneratedImage, AppState } from './types';
import { generateIdPhotos } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import EditingOptionsPanel from './components/EditingOptionsPanel';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import { CameraIcon, SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{ file: File; base64: string; mimeType: string } | null>(null);
  const [editingOptions, setEditingOptions] = useState<EditingOptions>({
    clothingStyle: 'Áo vest nam công sở',
    collarStyle: 'Truyền thống',
    customCollar: '',
    clothingColor: '#1E40AF',
    clothingPattern: 'Không có',
    hairstyle: 'Giữ nguyên ảnh gốc',
    customHairstyle: '',
    expression: 'Giữ nguyên nét mặt trung tính',
  });
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [appState, setAppState] = useState<AppState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File, base64: string, mimeType: string) => {
    setSelectedImage({ file, base64, mimeType });
    setGeneratedImages([]);
    setAppState('idle');
  };

  const handleGenerateClick = useCallback(async () => {
    if (!selectedImage) {
      setError('Vui lòng chọn ảnh để bắt đầu.');
      return;
    }

    setAppState('loading');
    setError(null);
    setGeneratedImages([]);

    try {
      const results = await generateIdPhotos(selectedImage.base64, selectedImage.mimeType, editingOptions);
      setGeneratedImages(results);
      setAppState('success');
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi tạo ảnh. Vui lòng thử lại.');
      setAppState('error');
    }
  }, [selectedImage, editingOptions]);
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              AI Tạo Ảnh Thẻ Chân Dung
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Upload and Options */}
          <div className="lg:col-span-4 space-y-8">
            <ImageUploader onImageUpload={handleImageUpload} />
            <EditingOptionsPanel options={editingOptions} setOptions={setEditingOptions} />
          </div>

          {/* Right Column: Generation and Results */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Tạo Ảnh Của Bạn</h2>
              <p className="text-gray-500 mb-6">
                Sau khi tải ảnh lên và tùy chỉnh các lựa chọn, nhấn nút bên dưới để AI bắt đầu quá trình tạo ảnh thẻ chuyên nghiệp.
              </p>
              <button
                onClick={handleGenerateClick}
                disabled={!selectedImage || appState === 'loading'}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {appState === 'loading' ? (
                  <>
                    <Loader />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Tạo Ảnh Thẻ</span>
                  </>
                )}
              </button>
              
              {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
              
              <div className="mt-8">
                {appState === 'idle' && !selectedImage && (
                    <div className="text-center py-10 px-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <CameraIcon className="w-12 h-12 mx-auto text-gray-400"/>
                        <p className="mt-4 text-gray-500">Vui lòng tải ảnh lên để xem kết quả tại đây.</p>
                    </div>
                )}
                {appState === 'idle' && selectedImage && generatedImages.length === 0 && (
                    <div className="text-center py-10 px-6 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                         <SparklesIcon className="w-12 h-12 mx-auto text-blue-400"/>
                        <p className="mt-4 text-blue-600 font-medium">Sẵn sàng để tạo ảnh thẻ của bạn!</p>
                    </div>
                )}
                {appState === 'loading' && (
                    <div className="text-center py-10 px-6">
                        <p className="text-gray-600 font-medium animate-pulse">AI đang làm việc... Quá trình này có thể mất vài phút.</p>
                        <p className="text-sm text-gray-500 mt-2">Vui lòng không đóng tab này.</p>
                    </div>
                )}
                {appState === 'success' && <ResultsDisplay images={generatedImages} />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
