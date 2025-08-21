import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Mail, Phone, CheckCheck, Check, Trash2, Reply } from "lucide-react";
import type { ContactMessage } from "@shared/schema";

export function ContactMessages() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isRTL = language.direction === 'rtl';

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/contact/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to mark as read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: isRTL ? "تم تمييز الرسالة كمقروءة" : "Message Marked as Read",
        description: isRTL ? "تم تمييز الرسالة كمقروءة بنجاح" : "Message marked as read successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ في التمييز" : "Error Marking",
        description: isRTL ? "حدث خطأ أثناء تمييز الرسالة" : "Error occurred while marking message",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete message');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: isRTL ? "تم حذف الرسالة" : "Message Deleted",
        description: isRTL ? "تم حذف الرسالة بنجاح" : "Message deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ في الحذف" : "Error Deleting",
        description: isRTL ? "حدث خطأ أثناء حذف الرسالة" : "Error occurred while deleting message",
        variant: "destructive",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('admin_token');
      const unreadMessages = messages.filter(msg => !msg.isRead);
      
      await Promise.all(
        unreadMessages.map(msg =>
          fetch(`/api/contact/${msg.id}/read`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: isRTL ? "تم تمييز جميع الرسائل كمقروءة" : "All Messages Marked as Read",
        description: isRTL ? "تم تمييز جميع الرسائل كمقروءة بنجاح" : "All messages marked as read successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ في التمييز" : "Error Marking",
        description: isRTL ? "حدث خطأ أثناء تمييز الرسائل" : "Error occurred while marking messages",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(isRTL ? "هل أنت متأكد من حذف هذه الرسالة؟" : "Are you sure you want to delete this message?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleReply = (message: ContactMessage) => {
    const subject = isRTL ? `رد على: ${message.subject}` : `Re: ${message.subject}`;
    const body = isRTL 
      ? `مرحباً ${message.name}،\n\nشكراً لتواصلك معنا...\n\nمع تحياتي،\nشركة فردوس سعود الشرهان للمحاماة`
      : `Dear ${message.name},\n\nThank you for contacting us...\n\nBest regards,\nFirdous Saud Al-Sharhan Law Company`;
    
    window.location.href = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return isRTL 
      ? d.toLocaleDateString('ar-SA') + ' - ' + d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString('en-US') + ' - ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getSubjectLabel = (subject: string) => {
    const subjects: Record<string, { ar: string; en: string }> = {
      'commercial': { ar: 'قانون تجاري', en: 'Commercial Law' },
      'civil': { ar: 'قانون مدني', en: 'Civil Law' },
      'arbitration': { ar: 'تحكيم', en: 'Arbitration' },
      'contracts': { ar: 'عقود', en: 'Contracts' },
      'other': { ar: 'أخرى', en: 'Other' }
    };
    
    return subjects[subject] ? (isRTL ? subjects[subject].ar : subjects[subject].en) : subject;
  };

  // Filter messages based on selected filter
  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.isRead;
    if (filter === 'read') return message.isRead;
    return true;
  });

  const unreadCount = messages.filter(msg => !msg.isRead).length;

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
          <h2 className="text-3xl font-bold text-primary-green" data-testid="messages-title">
            {t('admin.dashboard.messages')}
          </h2>
          <p className="text-text-medium mt-2">
            {isRTL ? "إدارة الرسائل الواردة من نموذج التواصل" : "Manage incoming messages from contact form"}
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                {unreadCount} {isRTL ? "غير مقروءة" : "unread"}
              </Badge>
            )}
          </p>
        </div>
        
        <div className="flex gap-3">
          {/* Filter Buttons */}
          <div className="flex gap-1 bg-sugar rounded-lg p-1">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-primary-green text-white' : ''}
              data-testid="filter-all"
            >
              {isRTL ? "الكل" : "All"}
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 'bg-primary-green text-white' : ''}
              data-testid="filter-unread"
            >
              {isRTL ? "غير مقروءة" : "Unread"} ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('read')}
              className={filter === 'read' ? 'bg-primary-green text-white' : ''}
              data-testid="filter-read"
            >
              {isRTL ? "مقروءة" : "Read"}
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              data-testid="mark-all-read"
            >
              <CheckCheck className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? "تمييز الكل كمقروء" : "Mark All as Read"}
            </Button>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card
            key={message.id}
            className={`p-6 shadow-sm hover:shadow-md transition-shadow ${
              message.isRead ? 'opacity-70' : 'border-l-4 border-blue-500'
            }`}
            data-testid={`message-card-${message.id}`}
          >
            <CardContent className="p-0">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} ${
                    message.isRead ? 'bg-gray-300' : 'bg-blue-500'
                  }`} title={message.isRead ? (isRTL ? "رسالة مقروءة" : "Read message") : (isRTL ? "رسالة جديدة" : "New message")} />
                  <div>
                    <h3 className="font-semibold text-text-dark" data-testid={`message-name-${message.id}`}>
                      {message.name}
                    </h3>
                    <p className="text-sm text-text-medium" data-testid={`message-email-${message.id}`}>
                      {message.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-medium" data-testid={`message-date-${message.id}`}>
                    {formatDate(message.createdAt)}
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-1"
                    data-testid={`message-subject-${message.id}`}
                  >
                    {getSubjectLabel(message.subject)}
                  </Badge>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-text-medium leading-relaxed" data-testid={`message-content-${message.id}`}>
                  {message.message}
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-text-medium flex items-center">
                  <Phone className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  <span data-testid={`message-phone-${message.id}`}>{message.phone}</span>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReply(message)}
                    className="text-green-600 hover:text-green-800 hover:bg-green-50"
                    data-testid={`reply-message-${message.id}`}
                  >
                    <Reply className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {isRTL ? "رد" : "Reply"}
                  </Button>
                  {!message.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsReadMutation.mutate(message.id)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      data-testid={`mark-read-${message.id}`}
                    >
                      <Check className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      {isRTL ? "تمييز كمقروء" : "Mark as Read"}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(message.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    data-testid={`delete-message-${message.id}`}
                  >
                    <Trash2 className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {isRTL ? "حذف" : "Delete"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-text-medium text-lg" data-testid="no-messages">
            {filter === 'all' 
              ? (isRTL ? "لا توجد رسائل بعد" : "No messages yet")
              : filter === 'unread'
              ? (isRTL ? "لا توجد رسائل غير مقروءة" : "No unread messages")
              : (isRTL ? "لا توجد رسائل مقروءة" : "No read messages")
            }
          </p>
        </div>
      )}
    </div>
  );
}
