
import React from 'react';
import { EditingOptions } from '../types';
import { ShirtIcon, ScissorsIcon, SmileIcon } from './icons';

interface EditingOptionsPanelProps {
  options: EditingOptions;
  setOptions: React.Dispatch<React.SetStateAction<EditingOptions>>;
}

const OptionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="font-semibold text-gray-700 ml-2">{title}</h3>
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

const RadioGroup: React.FC<{ label: string; name: string; value: string; options: string[]; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, options, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <div className="space-y-2">
            {options.map(option => (
                <label key={option} className="flex items-center text-sm text-gray-800 cursor-pointer">
                    <input type="radio" name={name} value={option} checked={value === option} onChange={onChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                    <span className="ml-3">{option}</span>
                </label>
            ))}
        </div>
    </div>
);


const EditingOptionsPanel: React.FC<EditingOptionsPanelProps> = ({ options, setOptions }) => {
  const handleChange = <T extends keyof EditingOptions,>(field: T, value: EditingOptions[T]) => {
    setOptions(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">2. Tùy Chọn Chỉnh Sửa</h2>

      {/* Trang phục */}
      <OptionCard title="Trang phục" icon={<ShirtIcon className="w-5 h-5 text-gray-500"/>}>
        <RadioGroup label="Kiểu áo" name="clothingStyle" value={options.clothingStyle} onChange={e => handleChange('clothingStyle', e.target.value)}
          options={['Áo dài nam', 'Áo dài nữ', 'Áo dài + khăn đóng nam', 'Áo dài + khăn đóng nữ', 'Áo vest nam công sở', 'Áo vest nữ công sở']} />
        
        <RadioGroup label="Cổ áo" name="collarStyle" value={options.collarStyle} onChange={e => handleChange('collarStyle', e.target.value)}
          options={['Truyền thống', 'Tự chọn']} />
        {options.collarStyle === 'Tự chọn' && (
          <input type="text" placeholder="VD: Cổ sen, cổ tàu cách điệu..." value={options.customCollar} onChange={e => handleChange('customCollar', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" />
        )}

        <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Màu áo</label>
            <div className="flex items-center space-x-2">
                 <input type="color" value={options.clothingColor} onChange={e => handleChange('clothingColor', e.target.value)}
                    className="w-10 h-10 p-1 border border-gray-300 rounded-md cursor-pointer"/>
                 <input type="text" value={options.clothingColor} onChange={e => handleChange('clothingColor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
        </div>

         <RadioGroup label="Hoa văn áo" name="clothingPattern" value={options.clothingPattern} onChange={e => handleChange('clothingPattern', e.target.value)}
          options={['Không có', 'Ngẫu nhiên kiểu hoa văn phù hợp phần ngực áo']} />

      </OptionCard>

      {/* Kiểu tóc */}
       <OptionCard title="Kiểu tóc" icon={<ScissorsIcon className="w-5 h-5 text-gray-500"/>}>
            <RadioGroup label="Tùy chọn tóc" name="hairstyle" value={options.hairstyle} onChange={e => handleChange('hairstyle', e.target.value)}
              options={['Giữ nguyên ảnh gốc', 'Thêm vài sợi tóc li ti, rìa tóc mềm mại', 'Tự chọn']} />
            {options.hairstyle === 'Tự chọn' && (
              <input type="text" placeholder="VD: Tóc búi cao gọn gàng" value={options.customHairstyle} onChange={e => handleChange('customHairstyle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" />
            )}
       </OptionCard>

      {/* Biểu cảm */}
        <OptionCard title="Biểu cảm khuôn mặt" icon={<SmileIcon className="w-5 h-5 text-gray-500"/>}>
            <RadioGroup label="Tùy chọn biểu cảm" name="expression" value={options.expression} onChange={e => handleChange('expression', e.target.value)}
              options={['Giữ nguyên nét mặt trung tính', 'Thêm nụ cười mỉm nhẹ tự nhiên, không làm thay đổi cấu trúc khuôn mặt']} />
       </OptionCard>
    </div>
  );
};

export default EditingOptionsPanel;
