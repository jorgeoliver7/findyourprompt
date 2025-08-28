'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Download, Star, Eye, DollarSign } from 'lucide-react';
import { PromptWithDetails } from '@/types/prompts';
import { useAuth } from '@/hooks/useAuth';
import { likePrompt, unlikePrompt } from '@/lib/prompts-client';
import { toast } from 'sonner';

interface PromptCardProps {
  prompt: PromptWithDetails;
  showAuthor?: boolean;
  compact?: boolean;
}

export default function PromptCard({ 
  prompt, 
  showAuthor = true, 
  compact = false 
}: PromptCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(prompt.isLiked || false);
  const [likesCount, setLikesCount] = useState(prompt.likes_count || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Debes iniciar sesión para dar like');
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        const { error } = await unlikePrompt(prompt.id, user.id);
        if (error) throw error;
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        toast.success('Like removido');
      } else {
        const { error } = await likePrompt(prompt.id, user.id);
        if (error) throw error;
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        toast.success('¡Like agregado!');
      }
    } catch (error) {
      console.error('Error al dar like:', error);
      toast.error('Error al procesar el like');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <Link href={`/prompts/${prompt.id}`}>
        <CardHeader className={compact ? 'p-4 pb-2' : 'p-6 pb-4'}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-semibold line-clamp-2 group-hover:text-primary transition-colors ${
                compact ? 'text-sm' : 'text-lg'
              }`}>
                {prompt.title}
              </h3>
              <p className={`text-muted-foreground line-clamp-2 mt-1 ${
                compact ? 'text-xs' : 'text-sm'
              }`}>
                {prompt.description}
              </p>
            </div>
            {prompt.is_featured && (
              <Badge variant="secondary" className="ml-2">
                Destacado
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className={compact ? 'p-4 pt-0' : 'p-6 pt-0'}>
          {/* Category and Model */}
          <div className="flex items-center gap-2 mb-3">
            {prompt.category_name && (
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: prompt.category_color }}
              >
                {prompt.category_icon} {prompt.category_name}
              </Badge>
            )}
            {prompt.model_name && (
              <Badge variant="outline" className="text-xs">
                {prompt.model_name}
              </Badge>
            )}
          </div>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {prompt.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {prompt.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{prompt.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Author */}
          {showAuthor && prompt.author_name && (
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={prompt.author_avatar_url || ''} />
                <AvatarFallback className="text-xs">
                  {prompt.author_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {prompt.author_name}
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className={`flex items-center justify-between ${
          compact ? 'p-4 pt-0' : 'p-6 pt-0'
        }`}>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{prompt.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{prompt.downloads || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{prompt.average_rating?.toFixed(1) || '0.0'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLoading}
              className="p-1 h-8 w-8"
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                }`} 
              />
            </Button>
            <span className="text-sm text-muted-foreground">{likesCount}</span>
            
            <div className="flex items-center gap-1 ml-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className={`font-semibold ${
                prompt.is_free ? 'text-green-600' : 'text-foreground'
              }`}>
                {formatPrice(prompt.price)}
              </span>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}