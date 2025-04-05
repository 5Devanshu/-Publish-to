import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { 
  Send, 
  BarChart3, 
  AlertCircle, 
  CheckCircle, 
  Mail, 
  Flag, 
  MessageSquare, 
  Bot, 
  User,
  Sparkles,
  RefreshCw,
  CornerDownRight,
  AlertTriangle
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationText, setConversationText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-switch to analysis tab when analysis is complete
  useEffect(() => {
    if (analysis && !analyzing) {
      setActiveTab('analysis');
    }
  }, [analysis, analyzing]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to UI immediately
    const userMessage = { sender: 'Customer', text: message };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract bot reply and add to messages
      const botMessage = { sender: 'Chatbot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);
      
      // Save full conversation text for analysis
      setConversationText(data.conversation);
      setMessage(''); // Clear input field after sending
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setMessages(prev => [...prev, { sender: 'System', text: 'Error sending message. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeChat = async () => {
    if (!conversationText) return;
    
    setAnalyzing(true);
    try {
      const response = await fetch('http://localhost:3000/api/analyze-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation: conversationText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing chat:', error);
      setAnalysis({ error: error.message });
    } finally {
      setAnalyzing(false);
    }
  };

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    if (!sentiment) return 'bg-gray-400';
    
    switch(sentiment.toLowerCase()) {
      case 'positive': return 'text-emerald-500';
      case 'negative': return 'text-destructive';
      case 'neutral': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  // Get ticket type icon
  const getTicketTypeIcon = (type) => {
    if (!type) return <AlertCircle className="h-5 w-5" />;
    
    const typeLC = type.toLowerCase();
    if (typeLC.includes('bug')) return <AlertTriangle className="h-5 w-5 text-destructive" />;
    if (typeLC.includes('billing')) return <AlertCircle className="h-5 w-5 text-amber-500" />;
    if (typeLC.includes('integration')) return <RefreshCw className="h-5 w-5 text-blue-500" />;
    return <AlertCircle className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen h-full bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 font-sans flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-slate-900/95 border-slate-700 shadow-xl">
        <CardHeader className="border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-lg py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-light flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-indigo-400" />
                ChatAnalysis
              </CardTitle>
              <CardDescription className="text-slate-400">
                Customer support insights powered by AI
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 bg-slate-800/70 px-3 py-1 rounded-full text-xs text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span>AI Active</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI analysis engine is ready</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        
        <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/80 p-1 rounded-lg">
              <TabsTrigger 
                value="chat" 
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md transition-all"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="analysis" 
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md transition-all" 
                disabled={!analysis && !analyzing}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analysis {analyzing && <RefreshCw className="ml-2 h-3 w-3 animate-spin" />}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chat" className="p-0 m-0">
            <CardContent className="pt-6">
              {/* Chat messages display */}
              <ScrollArea 
                ref={chatContainerRef}
                className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-4 h-96 flex flex-col space-y-4 mb-4 shadow-inner"
              >
                {messages.length === 0 ? (
                  <div className="text-slate-400 text-center my-auto flex flex-col items-center">
                    <MessageSquare className="h-10 w-10 mb-3 text-slate-500/30" />
                    Start a conversation...
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.sender === 'Customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-md transition-all ${
                          msg.sender === 'Customer' 
                            ? 'bg-indigo-600 rounded-tr-none' 
                            : msg.sender === 'System'
                              ? 'bg-red-600/80 text-center w-full'
                              : 'bg-slate-700 rounded-tl-none border-l-4 border-indigo-500'
                        }`}
                      >
                        <div className="flex items-center mb-1 space-x-2">
                          <Avatar className="h-5 w-5">
                            {msg.sender === 'Customer' ? 
                              <User className="h-3 w-3" /> : 
                              msg.sender === 'System' ? 
                                <AlertCircle className="h-3 w-3" /> : 
                                <Bot className="h-3 w-3" />
                            }
                          </Avatar>
                          <div className="text-xs text-slate-300 font-medium">{msg.sender}</div>
                        </div>
                        <div className="text-slate-100">{msg.text}</div>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700/80 p-3 rounded-lg flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-slate-400" />
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="flex-col space-y-4 pt-0 pb-6">
              <div className="flex space-x-2 w-full">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 bg-slate-800/60 border-slate-700 text-slate-100 placeholder:text-slate-400 rounded-full py-6 px-6"
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={loading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={loading || !message.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-12 w-12 flex items-center justify-center p-3 text-white"
                >
                  {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
              
              <Button 
                className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700" 
                onClick={handleAnalyzeChat} 
                disabled={analyzing || messages.length === 0}
                variant="outline"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analyze Conversation
                  </>
                )}
              </Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="analysis" className="p-0 m-0">
            <CardContent className="pt-6">
              {analyzing ? (
                <div className="bg-slate-800/50 rounded-lg p-6 flex flex-col items-center justify-center h-96">
                  <RefreshCw className="animate-spin h-12 w-12 text-indigo-500 mb-4" />
                  <div className="text-slate-300">Analyzing conversation...</div>
                </div>
              ) : analysis?.error ? (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2 text-red-400 flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5" /> Analysis Error
                  </h3>
                  <p className="text-red-300">{analysis.error}</p>
                </div>
              ) : analysis ? (
                <ScrollArea className="h-96 pr-4">
                  <div className="space-y-6">
                    {/* Summary Section */}
                    <Card className="bg-slate-800/50 border-slate-700 shadow-md overflow-hidden">
                      <div className="h-1 bg-indigo-500"></div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <CornerDownRight className="mr-2 h-4 w-4 text-indigo-400" />
                          Ticket Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300">{analysis.ticket_summary || "No summary available"}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Key Metrics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-slate-800/50 border-slate-700 shadow-md overflow-hidden">
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm flex items-center">
                            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                            Sentiment
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center">
                            <span className={`text-lg font-medium capitalize ${getSentimentColor(analysis.sentiment)}`}>
                              {analysis.sentiment || "Unknown"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-slate-800/50 border-slate-700 shadow-md overflow-hidden">
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm flex items-center">
                            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                            Ticket Type
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center">
                            {getTicketTypeIcon(analysis.ticket_type)}
                            <span className="text-lg font-medium ml-2 capitalize">{analysis.ticket_type || "Unknown"}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Separator className="bg-slate-700" />
                    
                    {/* Status Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-slate-800/50 border-slate-700 shadow-md">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <CheckCircle className={`h-5 w-5 mr-2 ${analysis.is_resolved ? 'text-emerald-500' : 'text-slate-500'}`} />
                              <span>Resolution Status</span>
                            </div>
                            <Badge variant={analysis.is_resolved ? "success" : "secondary"} className={analysis.is_resolved ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-slate-700 text-slate-300"}>
                              {analysis.is_resolved ? "Resolved" : "Open"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-slate-800/50 border-slate-700 shadow-md">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Mail className={`h-5 w-5 mr-2 ${analysis.requires_email ? 'text-indigo-400' : 'text-slate-500'}`} />
                              <span>Follow-up Required</span>
                            </div>
                            <Badge variant={analysis.requires_email ? "default" : "secondary"} className={analysis.requires_email ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-slate-700 text-slate-300"}>
                              {analysis.requires_email ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Email Context */}
                    {analysis.requires_email && analysis.email_context && (
                      <Card className="bg-slate-800/50 border-slate-700 shadow-md overflow-hidden">
                        <div className="h-1 bg-indigo-500"></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-indigo-400" />
                            Email Context
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-300">{analysis.email_context}</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Flags Section */}
                    {analysis.flags && (
                      <Card className="bg-slate-800/50 border-slate-700 shadow-md overflow-hidden">
                        <div className="h-1 bg-red-500"></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Flag className="h-4 w-4 mr-2 text-red-400" /> Flags
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(analysis.flags).map(([key, value]) => (
                              value && (
                                <Badge key={key} variant="outline" className="capitalize bg-slate-700/80 border-red-500/30 text-slate-300">
                                  {key.replace(/_/g, ' ')}
                                </Badge>
                              )
                            ))}
                            {Object.values(analysis.flags || {}).every(v => !v) && (
                              <span className="text-slate-400 italic">No flags detected</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <div className="bg-slate-800/50 rounded-lg p-6 flex flex-col items-center justify-center h-96">
                  <BarChart3 className="h-12 w-12 text-slate-500/40 mb-4" />
                  <div className="text-slate-400">No analysis available yet</div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="pb-6">
              <Button 
                variant="outline" 
                className="w-full rounded-lg border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-100"
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Return to Chat
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Chatbot;