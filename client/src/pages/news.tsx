import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
import { Search, Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsArticle } from "@shared/schema";

export default function News() {
  const { t, language } = useLanguage();
  const isRTL = language.direction === 'rtl';
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const { data: articles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news', { published: true }],
  });

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.titleEn && article.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.contentEn && article.contentEn.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const categories = [
    { value: "", label: isRTL ? "جميع الفئات" : "All Categories" },
    { value: "تحديثات قانونية", label: isRTL ? "تحديثات قانونية" : "Legal Updates" },
    { value: "قرارات قضائية", label: isRTL ? "قرارات قضائية" : "Court Decisions" },
    { value: "نصائح قانونية", label: isRTL ? "نصائح قانونية" : "Legal Advice" },
  ];

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return isRTL 
      ? d.toLocaleDateString('ar-SA') 
      : d.toLocaleDateString('en-US');
  };

  const getArticleTitle = (article: NewsArticle) => {
    return isRTL ? article.title : (article.titleEn || article.title);
  };

  const getArticleExcerpt = (article: NewsArticle) => {
    return isRTL ? article.excerpt : (article.excerptEn || article.excerpt);
  };

  const getArticleCategory = (article: NewsArticle) => {
    return isRTL ? article.category : (article.categoryEn || article.category);
  };

  if (isLoading) {
    return (
      <div className="py-20 bg-sugar-light min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green mx-auto"></div>
            <p className="mt-4 text-text-medium">{isRTL ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-sugar-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-green mb-6" data-testid="news-title">
            {isRTL ? "الأخبار والمقالات القانونية" : "Legal News and Articles"}
          </h1>
          <p className="text-xl text-text-medium max-w-3xl mx-auto" data-testid="news-subtitle">
            {isRTL ? "آخر الأخبار والتطورات في المجال القانوني والتشريعي" : "Latest news and developments in the legal and legislative field"}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder={isRTL ? "ابحث في الأخبار والمقالات..." : "Search news and articles..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? 'pr-12' : 'pl-12'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent`}
                data-testid="search-input"
              />
              <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48" data-testid="category-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon"
              className="border-primary-green text-primary-green hover:bg-primary-green hover:text-white"
              data-testid="filter-button"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* News Articles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedArticles.map((article, index) => (
            <Card 
              key={article.id} 
              className="bg-white shadow-sm hover:shadow-lg transition-all overflow-hidden"
              data-testid={`article-card-${index}`}
            >
              {article.imageUrl && (
                <img 
                  src={article.imageUrl} 
                  alt={getArticleTitle(article)}
                  className="w-full h-48 object-cover"
                  data-testid={`article-image-${index}`}
                />
              )}
              
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-accent-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                    {getArticleCategory(article)}
                  </span>
                  <span className={`text-text-medium text-sm ${isRTL ? 'mr-3' : 'ml-3'}`} data-testid={`article-date-${index}`}>
                    {formatDate(article.publishedAt || article.createdAt)}
                  </span>
                </div>
                <h3 
                  className="text-xl font-bold text-primary-green mb-3 hover:text-accent-gold transition-colors cursor-pointer" 
                  data-testid={`article-title-${index}`}
                >
                  {getArticleTitle(article)}
                </h3>
                <p className="text-text-medium leading-relaxed mb-4" data-testid={`article-excerpt-${index}`}>
                  {getArticleExcerpt(article)}
                </p>
                <div className="flex justify-between items-center">
                  <button className="text-accent-gold font-semibold hover:underline" data-testid={`article-link-${index}`}>
                    {isRTL ? "اقرأ المزيد" : "Read More"}
                    {isRTL ? (
                      <ChevronRight className="w-4 h-4 inline mr-1" />
                    ) : (
                      <ChevronLeft className="w-4 h-4 inline ml-1" />
                    )}
                  </button>
                  <div className="flex items-center text-text-medium text-sm">
                    <Eye className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    <span data-testid={`article-views-${index}`}>{article.views}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                data-testid="prev-page-button"
              >
                {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? "bg-primary-green text-white" : ""}
                    data-testid={`page-button-${pageNum}`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                data-testid="next-page-button"
              >
                {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-medium text-lg" data-testid="no-results">
              {isRTL ? "لا توجد مقالات تطابق البحث المحدد" : "No articles match the specified search"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
