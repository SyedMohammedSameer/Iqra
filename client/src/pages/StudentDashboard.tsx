import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { DailyContent } from "@/components/DailyContent";
import { AIAssistant } from "@/components/AIAssistant";
import { LanguageSelector } from "@/components/LanguageSelector";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Download,
  GraduationCap,
  Play,
  Star,
  TrendingUp,
  Video,
  FileText,
  Award,
  Bell,
  Search,
  Filter,
  LogOut,
  Settings
} from "lucide-react";

interface Class {
  id: number;
  title: string;
  description: string;
  teacherId: string;
  schedule: string;
  meetingLink: string;
  isActive: boolean;
  category: string;
  level: string;
  progress?: number;
}

interface FileData {
  id: number;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  category: string;
}

interface DashboardStats {
  enrolledClasses: number;
  completedClasses: number;
  totalProgress: number;
  certificates: number;
}

export default function StudentDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the dashboard.",
        variant: "destructive",
      });
      window.location.href = "/login";
      return;
    }
  }, [user, authLoading, toast]);

  // Queries
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

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  // Mutations
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
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to enroll in class. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Helper functions
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return <FileText className="w-5 h-5" />;
    if (mimeType.includes("video")) return <Video className="w-5 h-5" />;
    if (mimeType.includes("audio")) return <Play className="w-5 h-5" />;
    if (mimeType.includes("image")) return <FileText className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-bold text-2xl font-serif">إقرأ</span>
          </div>
          <div className="space-y-2">
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
            <div className="w-24 h-3 bg-gray-100 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg font-serif">إقرأ</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Iqra</h1>
                <p className="text-xs text-gray-500 -mt-1">Learning Dashboard</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              <LanguageSelector />
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.email?.split('@')[0] || 'Student'}
                  </p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t('dashboard.welcome')}, {user?.firstName || 'Student'}! 👋
              </h2>
              <p className="text-gray-600">Continue your Islamic learning journey</p>
            </div>
            
            {/* Quick Stats */}
            {!statsLoading && stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{stats.enrolledClasses}</div>
                  <div className="text-xs text-gray-500">Active Classes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{stats.completedClasses}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalProgress}%</div>
                  <div className="text-xs text-gray-500">Avg Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.certificates}</div>
                  <div className="text-xs text-gray-500">Certificates</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* My Classes */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-emerald-600" />
                  {t('classes.myClasses')}
                </h3>
                <Button variant="outline" size="sm">
                  {t('common.viewAll')}
                </Button>
              </div>
              
              {classesLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <Skeleton className="h-3 w-full mb-2" />
                        <Skeleton className="h-3 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {myClasses && myClasses.length > 0 ? (
                    myClasses.map((classItem) => (
                      <Card key={classItem.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                                {classItem.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">{classItem.description}</p>
                              <div className="flex items-center space-x-2 mb-3">
                                <Badge className={getLevelBadgeColor(classItem.level || 'beginner')}>
                                  {classItem.level || 'Beginner'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {classItem.category || 'Islamic Studies'}
                                </Badge>
                              </div>
                              {classItem.progress !== undefined && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-medium">{classItem.progress}%</span>
                                  </div>
                                  <Progress value={classItem.progress} className="h-2" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              onClick={() => handleJoinClass(classItem.meetingLink)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                              size="sm"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              {t('classes.joinClass')}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="md:col-span-2">
                      <CardContent className="p-8 text-center">
                        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Enrolled Classes</h4>
                        <p className="text-gray-500 mb-4">You haven't enrolled in any classes yet.</p>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          Browse Available Classes
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </section>

            {/* Available Classes */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" />
                  {t('classes.availableClasses')}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search classes..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {availableLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <Skeleton className="h-3 w-full mb-2" />
                        <Skeleton className="h-3 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableClasses
                    ?.filter(classItem => !myClasses?.find(myClass => myClass.id === classItem.id))
                    ?.filter(classItem => 
                      searchQuery === "" || 
                      classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      classItem.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    ?.slice(0, 6)
                    ?.map((classItem) => (
                    <Card key={classItem.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                            {classItem.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{classItem.description}</p>
                          <div className="flex items-center space-x-2 mb-4">
                            <Badge className={getLevelBadgeColor(classItem.level || 'beginner')}>
                              {classItem.level || 'Beginner'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {classItem.category || 'Islamic Studies'}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          onClick={() => enrollMutation.mutate(classItem.id)}
                          disabled={enrollMutation.isPending}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                          size="sm"
                        >
                          {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Materials */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  {t('dashboard.recentMaterials')}
                </h3>
                <Button variant="outline" size="sm">
                  {t('common.viewAll')}
                </Button>
              </div>
              
              {filesLoading ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {files && files.length > 0 ? (
                    files.slice(0, 6).map((file) => (
                      <Card key={file.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <div className="text-blue-600">{getFileIcon(file.mimeType)}</div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 truncate">{file.originalName}</h5>
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(file.createdAt).toLocaleDateString()} • {formatFileSize(file.fileSize)}
                              </p>
                              {file.category && (
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {file.category}
                                </Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="md:col-span-2">
                      <CardContent className="p-8 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Materials Yet</h4>
                        <p className="text-gray-500">Your teachers will upload course materials here.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Content */}
            <DailyContent />
            
            {/* AI Assistant */}
            <AIAssistant />
            
            {/* Learning Progress */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                  {t('dashboard.learningProgress')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Quran Recitation</span>
                    <span className="text-sm text-gray-600">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Islamic History</span>
                    <span className="text-sm text-gray-600">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Hadith Studies</span>
                    <span className="text-sm text-gray-600">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>

                <div className="pt-3 border-t">
                  <Button variant="outline" className="w-full" size="sm">
                    <Award className="w-4 h-4 mr-2" />
                    View Achievements
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Study Time
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Set Prayer Reminders
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Daily Quran Reading
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}