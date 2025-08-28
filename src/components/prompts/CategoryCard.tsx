'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types/prompts';

interface CategoryCardProps {
  category: Category;
  promptCount?: number;
}

export default function CategoryCard({ category, promptCount }: CategoryCardProps) {
  return (
    <Link href={`/prompts?category=${category.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {category.icon}
            </div>
            {promptCount !== undefined && (
              <Badge variant="secondary" className="text-xs">
                {promptCount} prompts
              </Badge>
            )}
          </div>
          
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}