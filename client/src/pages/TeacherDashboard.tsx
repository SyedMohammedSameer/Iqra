import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";
import { LanguageSelector } from "@/components/LanguageSelector";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Users,
  BookOpen,
  FileText,
  Video,
  Calendar,
  Clock,
  Settings,
  LogOut,
  Plus,
  Edit,
  Eye,
  Star,
  TrendingUp,
  Award,
  Zap,
  PlayCircle,
  Download,
  Share,
  MoreVertical,
  ChevronRight,
  Target,
  Sparkles,
  Globe,
  MessageSquare,
  Bell,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

const classFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  schedule: z.string().min(1, "Schedule is required"),
  meetingLink: z.string().url("Valid URL required").optional().or(z.literal("")),
  category: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

interface Class {
  id: number;
  title: string;
  description: string;
  teacherId: string;
  schedule: string;
  meetingLink: string;
  isActive: boolean;
  createdAt: string;
  category?: string;
  level?: string;
}

interface FileData {
  id: number;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  category?: string;
}

export default function TeacherDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      title: "",
      description: "",
      schedule: "",
      meetingLink: "",
      category: "",
      level: "beginner",
    },
  });

  // Redirect if not authenticated or not a teacher
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'teacher')) {
      toast({
        title: "Unauthorized",
        description: "You need to be a teacher to access this page.",
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

  const { data: files, isLoading: filesLoading } = useQuery<FileData[]>({
    queryKey: ["/api/files"],
    retry: false,
  });

  const createClassMutation = useMutation({
    mutationFn: async (data: ClassFormValues) => {
      const response = await apiRequest("POST", "/api/classes", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success! 🎉",
        description: "Class created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      setIsCreateDialogOpen(false);
      form.reset();
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
        description: "Failed to create class. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStartClass = (meetingLink: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    } else {
      toast({
        title: "No Meeting Link",
        description: "Please add a meeting link to start the class.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: ClassFormValues) => {
    createClassMutation.mutate(data);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return <FileText className="w-4 h-4 text-red-500" />;
    if (mimeType.includes("video")) return <PlayCircle className="w-4 h-4 text-blue-500" />;
    if (mimeType.includes("audio")) return <PlayCircle className="w-4 h-4 text-green-500" />;
    if (mimeType.includes("image")) return <Eye className="w-4 h-4 text-purple-500" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  const getLevelColor = (level: string = 'beginner') => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-bold text-3xl">👨‍🏫</span>
          </div>
          <div className="space-y-3">
            <div className="w-32 h-6 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full animate-pulse mx-auto"></div>
            <div className="w-24 h-4 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      title: "Total Students", 
      value: "247", 
      change: "+12%", 
      icon: Users, 
      color: "emerald",
      bgGradient: "from-emerald-500 to-teal-600"
    },
    { 
      title: "Active Classes", 
      value: myClasses?.length || "0", 
      change: "+3", 
      icon: BookOpen, 
      color: "blue",
      bgGradient: "from-blue-500 to-indigo-600"
    },
    { 
      title: "Total Files", 
      value: files?.length || "0", 
      change: "+8", 
      icon: FileText, 
      color: "purple",
      bgGradient: "from-purple-500 to-pink-600"
    },
    { 
      title: "This Month", 
      value: "89h", 
      change: "+15h", 
      icon: Clock, 
      color: "orange",
      bgGradient: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-yellow-50/30">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white text-3xl">👨‍🏫</span>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Welcome back, {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email?.split('@')[0] || 'Teacher'}! 
                </h3>
                <p className="text-yellow-100 text-lg">Islamic Studies Teacher • Inspiring minds since 2020</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-200" />
                    <span className="text-yellow-100 text-sm">4.9 Rating</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4 text-yellow-200" />
                    <span className="text-yellow-100 text-sm">Global Reach</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Plus className="w-4 h-4 mr-2" />
                    New Class
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-xl">
                      <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                      Create New Class
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Quran Recitation - Beginners" {...field} className="bg-white/70" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe your class..." {...field} className="bg-white/70" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Quran Studies" {...field} className="bg-white/70" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Level</FormLabel>
                              <FormControl>
                                <select {...field} className="w-full p-2 border border-gray-200 rounded-md bg-white/70">
                                  <option value="beginner">Beginner</option>
                                  <option value="intermediate">Intermediate</option>
                                  <option value="advanced">Advanced</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="schedule"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Schedule</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Monday & Wednesday 3:00 PM" {...field} className="bg-white/70" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="meetingLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meeting Link (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://meet.google.com/..." {...field} className="bg-white/70" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createClassMutation.isPending}
                          className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                        >
                          {createClassMutation.isPending ? (
                            <>
                              <Zap className="w-4 h-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Create Class
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" className="text-white hover:bg-white/20 transition-all duration-300">
                <Bell className="w-5 h-5" />
              </Button>
              <LanguageSelector />
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 transition-all duration-300"
                asChild
              >
                <a href="/api/logout">
                  <LogOut className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-emerald-600 font-medium flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.bgGradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Class Management */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{t('classes.myClasses')}</h4>
                    <p className="text-sm text-gray-500">Manage your teaching schedule</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('classes.scheduleNew')}
                </Button>
              </div>
              
              {classesLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {myClasses && myClasses.length > 0 ? (
                    myClasses.map((classItem) => (
                      <Card key={classItem.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white/80 backdrop-blur-sm group">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h6 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{classItem.title}</h6>
                                <p className="text-sm text-gray-600 mt-1">{classItem.description}</p>
                                <div className="flex items-center space-x-3 mt-2">
                                  <Badge className={getLevelColor(classItem.level)}>
                                    <Target className="w-3 h-3 mr-1" />
                                    {classItem.level || 'Beginner'}
                                  </Badge>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {classItem.schedule}
                                  </span>
                                  <span className="text-xs text-emerald-600 font-medium flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    24 students
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleStartClass(classItem.meetingLink)}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Start Class
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-gray-50 transition-all duration-300"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-gray-50 transition-all duration-300"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                      <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <BookOpen className="w-10 h-10 text-blue-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Ready to Start Teaching?</h4>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">You haven't created any classes yet. Start your teaching journey by creating your first class!</p>
                        <Button 
                          onClick={() => setIsCreateDialogOpen(true)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Create First Class
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </section>

            {/* Enhanced File Upload Area */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">Course Materials</h4>
                    <p className="text-sm text-gray-500">Upload and manage your teaching resources</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300 transition-all duration-300">
                  <Eye className="w-4 h-4 mr-2" />
                  {t('common.viewAll')}
                </Button>
              </div>
              
              <FileUpload
                classId={selectedClassId || undefined}
                onUploadComplete={() => queryClient.invalidateQueries({ queryKey: ["/api/files"] })}
              />
            </section>
          </div>
          
          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
                  Teaching Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">247</p>
                      <p className="text-sm text-gray-600">Total Students</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">+12%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">89 hrs</p>
                      <p className="text-sm text-gray-600">This Month</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">+15h</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">4.9</p>
                      <p className="text-sm text-gray-600">Avg Rating</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">98%</Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Enhanced Recent Files */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Recent Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filesLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {files && files.length > 0 ? (
                      files.slice(0, 5).map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300 group">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              {getFileIcon(file.mimeType)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm truncate max-w-[150px] group-hover:text-blue-600 transition-colors">{file.originalName}</p>
                              <p className="text-xs text-gray-600 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(file.createdAt).toLocaleDateString()} • {formatFileSize(file.fileSize)}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <Share className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No files uploaded yet</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Enhanced Schedule Widget */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myClasses && myClasses.length > 0 ? (
                  myClasses.slice(0, 3).map((classItem) => (
                    <div key={classItem.id} className="flex items-center space-x-3 p-3 bg-white/70 hover:bg-white/90 rounded-lg transition-all duration-300 group cursor-pointer">
                      <div className="w-3 h-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full animate-pulse"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{classItem.title}</p>
                        <p className="text-xs text-gray-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {classItem.schedule}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No scheduled classes</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-slate-50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-300 group" size="sm">
                  <MessageSquare className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                  Student Messages
                  <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group" size="sm">
                  <BarChart3 className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                  View Analytics
                  <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 group" size="sm">
                  <Settings className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                  Profile Settings
                  <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 group" size="sm">
                  <Award className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                  Certificates
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