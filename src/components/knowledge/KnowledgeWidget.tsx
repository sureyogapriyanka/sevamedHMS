import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, User, Eye, ExternalLink, Play } from "lucide-react";

interface KnowledgeArticle {
  id: string;
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

  const { data: articles = [], isLoading } = useQuery<KnowledgeArticle[]>({
    queryKey: ["/api/knowledge-articles"],
  });

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
      {articles.map((article) => (
        <Card key={article.id} className="border-2 border-indigo-500/30 overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
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
              {article.content.substring(0, 120)}...
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
                    data-testid={`read-article-${article.id}`}
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
                          {selectedArticle.tags.map((tag, index) => (
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
