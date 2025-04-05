import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card"

const Dashboard = () => {
  const navigate = useNavigate();

  const handleUploadPDFClick = () => {
    navigate('/upload-pdf');
  };

  const handleChatbotClick = () => {
    navigate('/chatbot');
  };

  return (
    <div className="min-h-screen h-full bg-gradient-to-br from-gray-900 to-gray-800 text-white font-['Inter'] flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-gray-800/80 border-gray-700">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center mb-4">Welcome to SupportAI</h2>
          <p className="text-gray-300 text-center">Choose an option to get started:</p>
          <div className="flex justify-center space-x-4 mt-6">
            <Button onClick={handleUploadPDFClick}>
              <FileUp className="mr-2 h-4 w-4" /> Upload PDF
            </Button>
            <Button onClick={handleChatbotClick}>
              <MessageSquare className="mr-2 h-4 w-4" /> Chat with Chatbot
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
