import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadPDF = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadClick = () => {
    // Implement PDF upload logic here
    console.log('Uploading PDF:', selectedFile);
    // After successful upload, redirect to chatbot page
    navigate('/chatbot');
  };

  return (
    <div className="min-h-screen h-full bg-gradient-to-br from-gray-900 to-gray-800 text-white font-['Inter'] flex items-center justify-center">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Upload Your SRS PDF</h2>
        <p className="text-gray-300 text-center">Select a PDF file to upload:</p>
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-4"
          />
          {selectedFile && <p>Selected file: {selectedFile.name}</p>}
          <Button onClick={handleUploadClick} disabled={!selectedFile}>
            Upload <FileUp className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPDF;
