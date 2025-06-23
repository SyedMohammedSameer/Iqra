import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { DailyContent } from "@/components/DailyContent";
import { AIAssistant } from "@/components/AIAssistant";
import { FileUpload } from "@/components/FileUpload";
import { LanguageSelector } from "@/components/LanguageSelector";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useTranslation } from "react-i18next";

interface Class {
  id: number;
  title: string;
  description: string;
  teacherId: string;
  schedule: string;
  meetingLink: string;
  isActive: boolean;
}

interface FileData {
  id: number;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export default function StudentDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
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
  }, [user, authLoading, toast]);

  const { data: myClasses, isLoading: classesLoading } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
    retry: false,
  });

  const { data: availableClasses, isLoading: availableLoading } = useQuery<Class[]>({
    queryKey: ["/api/classes/available"],
    retry: false,
  });

  const { data: files, isLoading: filesLoading } = useQuery<FileData[]>({
    queryKey: ["/api/files"],
    retry: false,
  });

  const enrollMutation = useMutation({
    mutationFn: async (classId: number) => {
      const response = await apiRequest("POST", `/api/classes/${classId}/enroll`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully enrolled in class!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
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
        description: "Failed to enroll in class. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleJoinClass = (meetingLink: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    } else {
      toast({
        title: "No Meeting Link",
        description: "The teacher hasn't set up a meeting link for this class yet.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}/download`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("video")) return "🎥";
    if (mimeType.includes("audio")) return "🎵";
    if (mimeType.includes("image")) return "🖼️";
    if (mimeType.includes("word")) return "📝";
    return "📁";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">إ</span>
          </div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">👨‍🎓</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email?.split('@')[0] || 'Student'}
                </h3>
                <p className="text-green-100">Student • {myClasses?.length || 0} Active Courses</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button
                variant="ghost"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                asChild
              >
                <a href="/api/logout">Logout</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Classes */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-gray-900">{t('classes.myClasses')}</h4>
                <Button variant="outline" size="sm">{t('common.viewAll')}</Button>
              </div>
              
              {classesLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {myClasses && myClasses.length > 0 ? (
                    myClasses.map((classItem) => (
                      <Card key={classItem.id} className="hover:shadow-md transition">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 text-lg">📖</span>
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900">{classItem.title}</h5>
                                <p className="text-sm text-gray-600">{classItem.description}</p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleJoinClass(classItem.meetingLink)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {t('classes.joinClass')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-500">You haven't enrolled in any classes yet.</p>
                        <p className="text-sm text-gray-400 mt-2">Browse available classes below to get started!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Available Classes */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-gray-900">{t('classes.availableClasses')}</h4>
              </div>
              
              {availableLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {availableClasses
                    ?.filter(classItem => !myClasses?.find(myClass => myClass.id === classItem.id))
                    ?.map((classItem) => (
                    <Card key={classItem.id} className="hover:shadow-md transition">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 text-lg">📚</span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">{classItem.title}</h5>
                              <p className="text-sm text-gray-600">{classItem.description}</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => enrollMutation.mutate(classItem.id)}
                            disabled={enrollMutation.isPending}
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            {enrollMutation.isPending ? "Enrolling..." : "Enroll"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Materials */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-gray-900">{t('dashboard.recentMaterials')}</h4>
                <Button variant="outline" size="sm">{t('common.viewAll')}</Button>
              </div>
              
              {filesLoading ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {files && files.length > 0 ? (
                    files.slice(0, 4).map((file) => (
                      <Card key={file.id} className="hover:shadow-md transition">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 text-sm">{getFileIcon(file.mimeType)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h6 className="font-medium text-gray-900 truncate">{file.originalName}</h6>
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(file.createdAt).toLocaleDateString()} • {formatFileSize(file.fileSize)}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(file.id, file.originalName)}
                                className="text-green-600 hover:text-green-700 mt-2 p-0 h-auto"
                              >
                                {t('files.download')}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-2">
                      <Card>
                        <CardContent className="p-8 text-center">
                          <p className="text-gray-500">No materials available yet.</p>
                          <p className="text-sm text-gray-400 mt-2">Your teachers will upload course materials here.</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Daily Content */}
            <DailyContent />
            
            {/* AI Assistant */}
            <AIAssistant />
            
            {/* Learning Progress */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h5 className="font-semibold text-gray-900 mb-4">{t('dashboard.learningProgress')}</h5>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Quran Recitation</span>
                      <span className="text-sm text-gray-600">75%</span>
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Islamic History</span>
                      <span className="text-sm text-gray-600">60%</span>
                    </div>
                    <Progress value={60} className="w-full" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Hadith Studies</span>
                      <span className="text-sm text-gray-600">40%</span>
                    </div>
                    <Progress value={40} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
