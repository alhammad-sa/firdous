import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Plus, Edit, Trash2, Eye, Upload, Image } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { NewsArticle, InsertNewsArticle } from "@shared/schema";
import type { UploadResult } from "@uppy/core";
import defaultNewsImage from "@assets/saudi_1756151692465.jpg";

export function NewsManagement() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isRTL = language.direction === 'rtl';

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState<Partial<InsertNewsArticle>>({
    title: '',
    titleEn: '',
    excerpt: '',
    excerptEn: '',
    content: '',
    contentEn: '',
    category: '',
    categoryEn: '',
    imageUrl: defaultNewsImage,
    published: false
  });

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const { data: articles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertNewsArticle) => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create article');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      resetForm();
      setShowAddModal(false);
      toast({
        title: isRTL ? "تم إضافة المقال" : "Article Added",
        description: isRTL ? "تم إضافة المقال بنجاح" : "Article added successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ في الإضافة" : "Error Adding",
        description: isRTL ? "حدث خطأ أثناء إضافة المقال" : "Error occurred while adding article",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertNewsArticle> }) => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update article');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      resetForm();
      setEditingArticle(null);
      toast({
        title: isRTL ? "تم تحديث المقال" : "Article Updated",
        description: isRTL ? "تم تحديث المقال بنجاح" : "Article updated successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ في التحديث" : "Error Updating",
        description: isRTL ? "حدث خطأ أثناء تحديث المقال" : "Error occurred while updating article",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete article');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({
        title: isRTL ? "تم حذف المقال" : "Article Deleted",
        description: isRTL ? "تم حذف المقال بنجاح" : "Article deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ في الحذف" : "Error Deleting",
        description: isRTL ? "حدث خطأ أثناء حذف المقال" : "Error occurred while deleting article",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      excerpt: '',
      excerptEn: '',
      content: '',
      contentEn: '',
      category: '',
      categoryEn: '',
      imageUrl: defaultNewsImage,
      published: false
    });
    setUploadedImageUrl('');
  };

  const handleGetUploadParameters = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return {
        method: 'PUT' as const,
        url: data.uploadURL,
      };
    } catch (error) {
      console.error('Error getting upload URL:', error);
      throw error;
    }
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    try {
      if (result.successful && result.successful.length > 0) {
        const uploadedFile = result.successful[0];
        const imageURL = uploadedFile.uploadURL;
        
        // Set ACL policy for the uploaded image
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/objects/set-acl', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageURL }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setUploadedImageUrl(data.objectPath);
          toast({
            title: isRTL ? "تم رفع الصورة" : "Image Uploaded",
            description: isRTL ? "تم رفع الصورة بنجاح" : "Image uploaded successfully",
          });
        }
      }
    } catch (error) {
      console.error('Error handling upload completion:', error);
      toast({
        title: isRTL ? "خطأ في رفع الصورة" : "Upload Error",
        description: isRTL ? "حدث خطأ أثناء رفع الصورة" : "Error occurred while uploading image",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only require title for drafts, all fields for published articles
    if (!formData.title) {
      toast({
        title: isRTL ? "خطأ في النموذج" : "Form Error",
        description: isRTL ? "العنوان مطلوب" : "Title is required",
        variant: "destructive",
      });
      return;
    }

    // If trying to publish, require all fields
    if (formData.published && (!formData.excerpt || !formData.content || !formData.category)) {
      toast({
        title: isRTL ? "خطأ في النموذج" : "Form Error",
        description: isRTL ? "جميع الحقول مطلوبة لنشر المقال" : "All fields are required to publish the article",
        variant: "destructive",
      });
      return;
    }

    const dataToSubmit: InsertNewsArticle = {
      title: formData.title || '',
      titleEn: formData.titleEn || '',
      excerpt: formData.excerpt || '',
      excerptEn: formData.excerptEn || '',
      content: formData.content || '',
      contentEn: formData.contentEn || '',
      category: formData.category || '',
      categoryEn: formData.categoryEn || '',
      imageUrl: uploadedImageUrl || defaultNewsImage,
      published: formData.published || false
    };

    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setUploadedImageUrl(article.imageUrl || '');
    setFormData({
      title: article.title,
      titleEn: article.titleEn || '',
      excerpt: article.excerpt,
      excerptEn: article.excerptEn || '',
      content: article.content,
      contentEn: article.contentEn || '',
      category: article.category,
      categoryEn: article.categoryEn || '',
      imageUrl: article.imageUrl || defaultNewsImage,
      published: article.published
    });
  };

  const handleDelete = (id: string) => {
    if (confirm(isRTL ? "هل أنت متأكد من حذف هذا المقال؟" : "Are you sure you want to delete this article?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return isRTL ? "غير منشور" : "Not published";
    const d = new Date(date);
    return isRTL ? d.toLocaleDateString('ar-SA') : d.toLocaleDateString('en-US');
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary-green" data-testid="news-management-title">
            {isRTL ? "إدارة الأخبار والمقالات" : "News and Articles Management"}
          </h2>
          <p className="text-text-medium mt-2">
            {isRTL ? "إضافة وتعديل وحذف المقالات القانونية" : "Add, edit and delete legal articles"}
          </p>
        </div>
        
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button 
              className="bg-accent-gold text-white hover:bg-accent-gold/90"
              onClick={() => {
                resetForm();
                setEditingArticle(null);
              }}
              data-testid="add-article-button"
            >
              <Plus className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? "إضافة مقال جديد" : "Add New Article"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="article-modal">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? 
                  (isRTL ? "تعديل المقال" : "Edit Article") : 
                  (isRTL ? "إضافة مقال جديد" : "Add New Article")
                }
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="article-form">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-semibold text-text-dark mb-2">
                    {isRTL ? "العنوان (عربي) *" : "Title (Arabic) *"}
                  </Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn" className="text-sm font-semibold text-text-dark mb-2">
                    {isRTL ? "العنوان (إنجليزي)" : "Title (English)"}
                  </Label>
                  <Input
                    id="titleEn"
                    value={formData.titleEn || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                    data-testid="input-title-en"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category" className="text-sm font-semibold text-text-dark mb-2">
                    {isRTL ? "الفئة (عربي)" : "Category (Arabic)"}
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    data-testid="input-category"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryEn" className="text-sm font-semibold text-text-dark mb-2">
                    {isRTL ? "الفئة (إنجليزي)" : "Category (English)"}
                  </Label>
                  <Input
                    id="categoryEn"
                    value={formData.categoryEn || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryEn: e.target.value }))}
                    data-testid="input-category-en"
                  />
                </div>
              </div>


              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="excerpt" className="text-sm font-semibold text-text-dark mb-2">
                    {isRTL ? "المقدمة (عربي)" : "Excerpt (Arabic)"}
                  </Label>
                  <Textarea
                    id="excerpt"
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    data-testid="textarea-excerpt"
                  />
                </div>
                <div>
                  <Label htmlFor="excerptEn" className="text-sm font-semibold text-text-dark mb-2">
                    {isRTL ? "المقدمة (إنجليزي)" : "Excerpt (English)"}
                  </Label>
                  <Textarea
                    id="excerptEn"
                    rows={3}
                    value={formData.excerptEn || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerptEn: e.target.value }))}
                    data-testid="textarea-excerpt-en"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="content" className="text-sm font-semibold text-text-dark mb-2">
                    {isRTL ? "المحتوى (عربي)" : "Content (Arabic)"}
                  </Label>
                  <Textarea
                    id="content"
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    data-testid="textarea-content"
                  />
                </div>
                <div>
                  <Label htmlFor="contentEn" className="text-sm font-semibold text-text-dark mb-2">
                    {isRTL ? "المحتوى (إنجليزي)" : "Content (English)"}
                  </Label>
                  <Textarea
                    id="contentEn"
                    rows={8}
                    value={formData.contentEn || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, contentEn: e.target.value }))}
                    data-testid="textarea-content-en"
                  />
                </div>
              </div>

              {/* Image Upload Section - Moved to bottom */}
              <div>
                <Label className="text-sm font-semibold text-text-dark mb-2">
                  {isRTL ? "صورة المقال" : "Article Image"}
                </Label>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    {(uploadedImageUrl || formData.imageUrl) && (
                      <div className="relative">
                        <img 
                          src={uploadedImageUrl || formData.imageUrl || defaultNewsImage} 
                          alt={isRTL ? "صورة المقال" : "Article image"}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          {uploadedImageUrl ? (isRTL ? "صورة مرفوعة" : "Uploaded") : (isRTL ? "صورة افتراضية" : "Default")}
                        </div>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // You can click to upload image manually when ready
                      }}
                      className="w-full"
                      data-testid="button-upload-image"
                    >
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>{isRTL ? "رفع صورة (اختياري)" : "Upload Image (Optional)"}</span>
                      </div>
                    </Button>
                  </div>
                  <p className="text-xs text-text-medium">
                    {isRTL ? "إذا لم ترفع صورة، ستستخدم الصورة الافتراضية" : "If no image is uploaded, the default image will be used"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  data-testid="switch-published"
                />
                <Label htmlFor="published" className="text-sm font-semibold text-text-dark">
                  {isRTL ? "نشر المقال" : "Publish Article"}
                </Label>
              </div>

              <div className="flex justify-end space-x-4 space-x-reverse pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingArticle(null);
                    resetForm();
                  }}
                  data-testid="cancel-button"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-primary-green text-white hover:bg-primary-green/90"
                  data-testid="save-button"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    editingArticle ? (isRTL ? "تحديث" : "Update") : (isRTL ? "إضافة" : "Add")
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Articles Table */}
      <Card className="shadow-sm" data-testid="articles-table-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-sugar">
                  <TableHead className="px-6 py-4 text-sm font-semibold text-text-dark">
                    {isRTL ? "العنوان" : "Title"}
                  </TableHead>
                  <TableHead className="px-6 py-4 text-sm font-semibold text-text-dark">
                    {isRTL ? "الفئة" : "Category"}
                  </TableHead>
                  <TableHead className="px-6 py-4 text-sm font-semibold text-text-dark">
                    {isRTL ? "تاريخ النشر" : "Published Date"}
                  </TableHead>
                  <TableHead className="px-6 py-4 text-sm font-semibold text-text-dark">
                    {isRTL ? "الحالة" : "Status"}
                  </TableHead>
                  <TableHead className="px-6 py-4 text-sm font-semibold text-text-dark">
                    {isRTL ? "الإجراءات" : "Actions"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id} data-testid={`article-row-${article.id}`}>
                    <TableCell className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-text-dark" data-testid={`article-title-${article.id}`}>
                          {isRTL ? article.title : (article.titleEn || article.title)}
                        </div>
                        <div className="text-sm text-text-medium truncate max-w-xs" data-testid={`article-excerpt-${article.id}`}>
                          {isRTL ? article.excerpt : (article.excerptEn || article.excerpt)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="secondary" data-testid={`article-category-${article.id}`}>
                        {isRTL ? article.category : (article.categoryEn || article.category)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-text-medium" data-testid={`article-date-${article.id}`}>
                      {formatDate(article.publishedAt)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant={article.published ? "default" : "secondary"}
                        className={article.published ? "bg-green-100 text-green-800" : ""}
                        data-testid={`article-status-${article.id}`}
                      >
                        {article.published ? (isRTL ? "منشور" : "Published") : (isRTL ? "مسودة" : "Draft")}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex space-x-2 space-x-reverse">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleEdit(article);
                            setShowAddModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          data-testid={`edit-article-${article.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          data-testid={`delete-article-${article.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-medium text-lg" data-testid="no-articles">
            {isRTL ? "لا توجد مقالات بعد" : "No articles yet"}
          </p>
        </div>
      )}
    </div>
  );
}
