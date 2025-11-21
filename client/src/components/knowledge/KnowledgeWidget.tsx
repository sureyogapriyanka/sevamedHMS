import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { knowledgeArticleService } from "../../services/api";
import { BookOpen, User, Eye, ExternalLink, Play } from "lucide-react";

interface KnowledgeArticle {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  viewCount: number;
  createdAt: string;
}

export default function KnowledgeWidget() {
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const { data: articlesResponse, isLoading } = useQuery({
    queryKey: ['knowledge-articles'],
    queryFn: async () => {
      try {
        const response = await knowledgeArticleService.getAll();
        return response.data || [];
      } catch (error) {
        // If API fails, return sample data
        return [
          {
            id: '1',
            title: 'The Importance of Staying Hydrated',
            content: 'Water is essential for life and plays a crucial role in maintaining our health. It helps regulate body temperature, transport nutrients, and remove waste. Aim to drink at least 8 glasses of water daily, and more if you are physically active or in hot climates. Proper hydration can improve energy levels, brain function, and physical performance.',
            author: 'Dr. Sarah Johnson',
            category: 'Nutrition',
            tags: ['hydration', 'water', 'health'],
            imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
            viewCount: 1240,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Understanding Heart Health',
            content: 'Heart disease is the leading cause of death worldwide. Maintaining heart health involves regular exercise, a balanced diet, avoiding smoking, and managing stress. Regular check-ups with your doctor can help detect early signs of heart problems. Know the warning signs of heart attack and stroke, and don\'t hesitate to seek emergency care if needed.',
            author: 'Dr. Michael Chen',
            category: 'Cardiology',
            tags: ['heart', 'cardiovascular', 'exercise'],
            imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
            viewCount: 980,
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Benefits of Regular Exercise',
            content: 'Regular physical activity is one of the best things you can do for your health. It can help prevent chronic diseases, improve mental health, boost energy levels, and promote better sleep. Adults should aim for at least 150 minutes of moderate-intensity aerobic activity per week, along with muscle-strengthening activities on two or more days.',
            author: 'Dr. Emily Rodriguez',
            category: 'Fitness',
            tags: ['exercise', 'fitness', 'wellness'],
            imageUrl: 'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?auto=format&fit=crop&w=800&q=80',
            viewCount: 1560,
            createdAt: new Date().toISOString()
          }
        ];
      }
    }
  });

  // Ensure articles is always an array
  const articles = Array.isArray(articlesResponse) ? articlesResponse : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="knowledge-widgets">
      {articles.map((article: any) => (
        <Card key={article._id || article.id} className="border-2 border-indigo-500/30 overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
          {article.imageUrl && (
            <div className="h-48 overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <Badge variant="secondary" className="text-xs">
                {article.category}
              </Badge>
              <div className="flex items-center text-muted-foreground text-xs">
                <Eye className="h-3 w-3 mr-1" />
                {article.viewCount}
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
              {article.title}
            </h4>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {article.content?.substring(0, 120)}...
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <User className="h-3 w-3 mr-1" />
                <span>{article.author}</span>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedArticle(article)}
                    data-testid={`read-article-${article._id || article.id}`}
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Read More
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      {selectedArticle?.title}
                    </DialogTitle>
                  </DialogHeader>

                  {selectedArticle && (
                    <div className="space-y-6">
                      {selectedArticle.imageUrl && (
                        <div className="w-full h-64 overflow-hidden rounded-lg">
                          <img
                            src={selectedArticle.imageUrl}
                            alt={selectedArticle.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary">
                            {selectedArticle.category}
                          </Badge>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <User className="h-4 w-4 mr-1" />
                            <span>{selectedArticle.author}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{selectedArticle.viewCount} views</span>
                          </div>
                        </div>

                        {selectedArticle.videoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedArticle.videoUrl, '_blank')}
                            data-testid="watch-video"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Watch Video
                          </Button>
                        )}
                      </div>

                      <div className="prose prose-slate max-w-none">
                        <div className="whitespace-pre-wrap text-foreground">
                          {selectedArticle.content}
                        </div>
                      </div>

                      {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-muted-foreground">Tags:</span>
                          {selectedArticle.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Published on {new Date(selectedArticle.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}

      {articles.length === 0 && (
        <div className="col-span-full text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Articles Available</h3>
          <p className="text-muted-foreground">
            Knowledge articles will appear here once they are added to the system.
          </p>
        </div>
      )}
    </div>
  );
}