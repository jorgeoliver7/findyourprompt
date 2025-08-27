'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Prompt } from '@/types';

type PromptCardProps = {
  prompt: Prompt;
};

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={prompt.user.avatar_url} alt={prompt.user.name} />
            <AvatarFallback>{prompt.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{prompt.user.name}</span>
        </div>
        <CardTitle className="line-clamp-1 text-lg">{prompt.title}</CardTitle>
        <CardDescription className="line-clamp-2">{prompt.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{prompt.model.name}</span>
            <span className="text-xs text-muted-foreground">{prompt.model.provider}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              {prompt.price === 0 ? 'Gratis' : `$${(prompt.price / 100).toFixed(2)}`}
            </span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {prompt.purchases_count} compras
            </span>
            <span className="text-sm text-muted-foreground">
              ★ {prompt.average_rating.toFixed(1)}
            </span>
          </div>
          <Button asChild size="sm">
            <Link href={`/prompts/${prompt.id}`}>Ver Detalles</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}