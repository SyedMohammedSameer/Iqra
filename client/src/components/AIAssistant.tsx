import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ChatMessage {
  id: number;
  userId: string;
  message: string;
  response: string;
  createdAt: string;
}

interface ChatResponse {
  answer: string;
  sources?: string[];
  isAuthentic: boolean;
}

export function AIAssistant() {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: chatHistory, isLoading, refetch } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/history"],
    retry: false,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      refetch();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-lg">🤖</span>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900">{t('dashboard.aiAssistant')}</h5>
            <p className="text-sm text-gray-600">{t('dashboard.askQuestion')}</p>
          </div>
        </div>
        
        <ScrollArea className="h-32 mb-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-3/4" />
            </div>
          ) : (
            <div className="space-y-3">
              {chatHistory?.slice().reverse().slice(0, 4).map((chat) => (
                <div key={chat.id} className="space-y-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{chat.message}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{chat.response}</p>
                  </div>
                </div>
              ))}
              {(!chatHistory || chatHistory.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Start a conversation by asking an Islamic question!
                </p>
              )}
            </div>
          )}
        </ScrollArea>
        
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder={t('chat.askQuestion')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sendMessageMutation.isPending}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={sendMessageMutation.isPending || !message.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {sendMessageMutation.isPending ? "..." : t('chat.send')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
