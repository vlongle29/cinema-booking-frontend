import React, { useState } from "react";
import { Camera, Upload } from "lucide-react";

interface AvatarUploadProps {
   value?: string;
   onChange: (url: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange }) => {
   const [preview, setPreview] = useState(value || "");

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         // Trong thực tế bạn sẽ upload lên Cloudinary/S3 ở đây
         // Ở đây ta giả lập bằng FileReader
         const reader = new FileReader();
         reader.onloadend = () => {
            const base64String = reader.result as string;
            setPreview(base64String);
            onChange(base64String);
         };
         reader.readAsDataURL(file);
      }
   };

   return (
      <div className="flex flex-col items-center gap-4 py-4">
         <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
               {preview ? (
                  <img
                     src={preview}
                     alt="Avatar"
                     className="w-full h-full object-cover"
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                     <Camera size={32} />
                  </div>
               )}
            </div>
            <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
               <Upload size={14} />
               <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
               />
            </label>
         </div>
         <div className="w-full">
            <input
               type="text"
               placeholder="Hoặc nhập URL ảnh..."
               className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-blue-500"
               value={preview}
               onChange={(e) => {
                  setPreview(e.target.value);
                  onChange(e.target.value);
               }}
            />
         </div>
      </div>
   );
};

export default AvatarUpload;
