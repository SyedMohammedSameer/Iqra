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
  Settings,
  Plus,
  MoreVertical,
  Target,
  Zap,
  Sparkles,
  ChevronRight,
  Users,
  BookMarked,
  PlayCircle,
  Eye,
  Share,
  Bookmark
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
  const [activeTab, setActiveTab] = useState("overview");

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
        title: "Success! 🎉",
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
    if (mimeType.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
    if (mimeType.includes("video")) return <PlayCircle className="w-5 h-5 text-blue-500" />;
    if (mimeType.includes("audio")) return <Play className="w-5 h-5 text-green-500" />;
    if (mimeType.includes("image")) return <Eye className="w-5 h-5 text-purple-500" />;
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-bold text-3xl font-serif">إقرأ</span>
          </div>
          <div className="space-y-3">
            <div className="w-32 h-6 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full animate-pulse mx-auto"></div>
            <div className="w-24 h-4 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg font-serif">إقرأ</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Iqra</h1>
                <p className="text-xs text-gray-500 -mt-1">Learning Dashboard</p>
              </div>
            </div>

            {/* Enhanced User Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative hover:bg-emerald-50 transition-all duration-300">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
              </Button>
              <LanguageSelector />
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-all duration-300">
                <Avatar className="w-8 h-8 ring-2 ring-emerald-100">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 font-bold">
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
              <Button variant="ghost" size="icon" className="hover:bg-gray-50 transition-all duration-300">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600 transition-all duration-300">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent">
                  {t('dashboard.welcome')}, {user?.firstName || 'Student'}! 
                </h2>
                <span className="text-2xl animate-bounce">👋</span>
              </div>
              <p className="text-gray-600 text-lg">Continue your Islamic learning journey with passion and dedication</p>
            </div>
            
            {/* Enhanced Quick Stats */}
            {!statsLoading && stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: stats.enrolledClasses, label: "Active Classes", icon: BookOpen, color: "emerald" },
                  { value: stats.completedClasses, label: "Completed", icon: Award, color: "blue" },
                  { value: `${stats.totalProgress}%`, label: "Progress", icon: TrendingUp, color: "purple" },
                  { value: stats.certificates, label: "Certificates", icon: Star, color: "yellow" }
                ].map((stat, index) => (
                  <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Enhanced My Classes */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{t('classes.myClasses')}</h3>
                    <p className="text-sm text-gray-500">Continue your learning journey</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300">
                  <Eye className="w-4 h-4 mr-2" />
                  {t('common.viewAll')}
                </Button>
              </div>
              
              {classesLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse border-0 shadow-lg">
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
                      <Card key={classItem.id} className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-white/70 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                  <BookMarked className="w-4 h-4 text-blue-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors text-lg">
                                  {classItem.title}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{classItem.description}</p>
                              <div className="flex items-center space-x-2 mb-4">
                                <Badge className={`${getLevelBadgeColor(classItem.level || 'beginner')} transition-all duration-300`}>
                                  <Target className="w-3 h-3 mr-1" />
                                  {classItem.level || 'Beginner'}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all duration-300">
                                  <BookOpen className="w-3 h-3 mr-1" />
                                  {classItem.category || 'Islamic Studies'}
                                </Badge>
                              </div>
                              {classItem.progress !== undefined && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 flex items-center">
                                      <TrendingUp className="w-4 h-4 mr-1" />
                                      Progress
                                    </span>
                                    <span className="font-medium text-emerald-600">{classItem.progress}%</span>
                                  </div>
                                  <div className="relative">
                                    <Progress value={classItem.progress} className="h-2" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              onClick={() => handleJoinClass(classItem.meetingLink)}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
                              size="sm"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              {t('classes.joinClass')}
                            </Button>
                            <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-all duration-300">
                              <Calendar className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-all duration-300">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="md:col-span-2 border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50">
                      <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <GraduationCap className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Ready to Start Learning?</h4>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">You haven't enrolled in any classes yet. Discover amazing Islamic courses and start your journey today!</p>
                        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Browse Courses
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </section>

            {/* Enhanced Available Classes */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{t('classes.availableClasses')}</h3>
                    <p className="text-sm text-gray-500">Discover new learning opportunities</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search classes..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {availableLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse border-0 shadow-lg">
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
                    <Card key={classItem.id} className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-white/70 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500">24 students</span>
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2 text-lg">
                            {classItem.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{classItem.description}</p>
                          <div className="flex items-center space-x-2 mb-4">
                            <Badge className={`${getLevelBadgeColor(classItem.level || 'beginner')} transition-all duration-300`}>
                              <Target className="w-3 h-3 mr-1" />
                              {classItem.level || 'Beginner'}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all duration-300">
                              {classItem.category || 'Islamic Studies'}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          onClick={() => enrollMutation.mutate(classItem.id)}
                          disabled={enrollMutation.isPending}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                          size="sm"
                        >
                          {enrollMutation.isPending ? (
                            <>
                              <Zap className="w-4 h-4 mr-2 animate-spin" />
                              Enrolling...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Enroll Now
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Enhanced Recent Materials */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{t('dashboard.recentMaterials')}</h3>
                    <p className="text-sm text-gray-500">Latest resources from your classes</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                  <Eye className="w-4 h-4 mr-2" />
                  {t('common.viewAll')}
                </Button>
              </div>
              
              {filesLoading ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse border-0 shadow-lg">
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
                      <Card key={file.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white/70 backdrop-blur-sm group">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              {getFileIcon(file.mimeType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{file.originalName}</h5>
                              <p className="text-sm text-gray-600 mt-1 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(file.createdAt).toLocaleDateString()} • {formatFileSize(file.fileSize)}
                              </p>
                              {file.category && (
                                <Badge variant="outline" className="mt-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-300">
                                  {file.category}
                                </Badge>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm" className="hover:bg-blue-50 transition-all duration-300">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-50 transition-all duration-300">
                                <Share className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="md:col-span-2 border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                      <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <FileText className="w-10 h-10 text-blue-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">No Materials Yet</h4>
                        <p className="text-gray-600">Your teachers will upload course materials here as you progress.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </section>
          </div>
          
          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Daily Content */}
            <DailyContent />
            
            {/* AI Assistant */}
            <AIAssistant />
            
            {/* Enhanced Learning Progress */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  {t('dashboard.learningProgress')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { name: "Quran Recitation", progress: 75, color: "emerald" },
                  { name: "Islamic History", progress: 60, color: "blue" },
                  { name: "Hadith Studies", progress: 40, color: "purple" }
                ].map((subject, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <BookMarked className="w-4 h-4 mr-2 text-gray-500" />
                        {subject.name}
                      </span>
                      <span className="text-sm text-gray-600 font-bold">{subject.progress}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={subject.progress} className="h-3" />
                      <div className={`absolute inset-0 bg-gradient-to-r from-${subject.color}-500/20 to-${subject.color}-600/20 rounded-full`}></div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-emerald-200">
                  <Button variant="outline" className="w-full hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300" size="sm">
                    <Award className="w-4 h-4 mr-2" />
                    View Achievements
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quick Actions */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-slate-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-300 group" size="sm">
                  <Calendar className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                  Schedule Study Time
                  <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-300 transition-all duration-300 group" size="sm">
                  <Clock className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                  Set Prayer Reminders
                  <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 group" size="sm">
                  <BookOpen className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                  Daily Quran Reading
                  <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group" size="sm">
                  <Bookmark className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                  Saved Resources
                  <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}