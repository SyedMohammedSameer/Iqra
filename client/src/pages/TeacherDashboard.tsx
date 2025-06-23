import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const classFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  schedule: z.string().min(1, "Schedule is required"),
  meetingLink: z.string().url("Valid URL required").optional().or(z.literal("")),
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
}

interface FileData {
  id: number;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

interface ClassEnrollment {
  id: number;
  classId: number;
  studentId: string;
  enrolledAt: string;
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
        title: "Success",
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

  const updateClassMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ClassFormValues> }) => {
      const response = await apiRequest("PUT", `/api/classes/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Class updated successfully!",
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
        description: "Failed to update class. Please try again.",
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
          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">👨‍🏫</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email?.split('@')[0] || 'Teacher'}
                </h3>
                <p className="text-yellow-100">Senior Islamic Studies Teacher • {myClasses?.length || 0} Active Classes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white">
                    + New Class
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Class</DialogTitle>
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
                              <Input placeholder="e.g., Quran Recitation - Beginners" {...field} />
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
                              <Textarea placeholder="Describe your class..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="schedule"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Schedule</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Monday & Wednesday 3:00 PM" {...field} />
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
                              <Input placeholder="https://meet.google.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
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
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          {createClassMutation.isPending ? "Creating..." : "Create Class"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
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
            {/* Class Management */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-gray-900">{t('classes.myClasses')}</h4>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {t('classes.scheduleNew')}
                </Button>
              </div>
              
              {classesLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100 text-sm font-medium text-gray-700">
                      <div>Class Name</div>
                      <div>Students</div>
                      <div>Schedule</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>
                    
                    {myClasses && myClasses.length > 0 ? (
                      myClasses.map((classItem) => (
                        <div key={classItem.id} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 items-center">
                          <div>
                            <h6 className="font-medium text-gray-900">{classItem.title}</h6>
                            <p className="text-sm text-gray-600">{classItem.schedule}</p>
                          </div>
                          <div className="text-sm text-gray-600">0 students</div>
                          <div className="text-sm text-gray-600">{classItem.schedule}</div>
                          <div>
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleStartClass(classItem.meetingLink)}
                              className="text-green-600 hover:text-green-700"
                              variant="ghost"
                            >
                              Start
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-600 hover:text-gray-700"
                            >
                              {t('common.edit')}
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500">You haven't created any classes yet.</p>
                        <p className="text-sm text-gray-400 mt-2">Click "New Class" to get started!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* File Upload Area */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-gray-900">{t('files.upload')}</h4>
                <Button variant="outline" size="sm">{t('common.viewAll')}</Button>
              </div>
              
              <FileUpload
                classId={selectedClassId || undefined}
                onUploadComplete={() => queryClient.invalidateQueries({ queryKey: ["/api/files"] })}
              />
            </div>
          </div>
          
          {/* Teacher Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h5 className="font-semibold text-gray-900 mb-4">Quick Stats</h5>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-lg">👥</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">0</p>
                        <p className="text-sm text-gray-600">Total Students</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-yellow-600 text-lg">📚</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{myClasses?.length || 0}</p>
                        <p className="text-sm text-gray-600">Active Classes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-lg">📄</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{files?.length || 0}</p>
                        <p className="text-sm text-gray-600">Uploaded Files</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Files */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h5 className="font-semibold text-gray-900 mb-4">Recent Files</h5>
                
                {filesLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {files && files.length > 0 ? (
                      files.slice(0, 5).map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-blue-600 text-sm">{getFileIcon(file.mimeType)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm truncate max-w-[150px]">{file.originalName}</p>
                              <p className="text-xs text-gray-600">
                                {new Date(file.createdAt).toLocaleDateString()} • {formatFileSize(file.fileSize)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No files uploaded yet
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Calendar Widget */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h5 className="font-semibold text-gray-900 mb-4">Upcoming Schedule</h5>
                
                <div className="space-y-3">
                  {myClasses && myClasses.length > 0 ? (
                    myClasses.slice(0, 3).map((classItem) => (
                      <div key={classItem.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{classItem.title}</p>
                          <p className="text-xs text-gray-600">{classItem.schedule}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No scheduled classes
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
