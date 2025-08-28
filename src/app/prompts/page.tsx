import { Suspense } from 'react';
import { Metadata } from 'next';
import PromptsPageClient from './PromptsPageClient';
import { getPrompts, getCategories, getAIModels } from '@/lib/prompts';
import { PromptCardSkeletonGrid } from '@/components/prompts/PromptCardSkeleton';

export const metadata: Metadata = {
  title: 'Explorar Prompts - FindYourPrompt',
  description: 'Descubre y explora una amplia colección de prompts para IA',
};

interface PromptsPageProps {
  searchParams: {
    search?: string;
    category?: string;
    model?: string;
    sort?: string;
    price?: string;
    page?: string;
  };
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  
  // Fetch data in parallel
  const [promptsResult, categoriesResult, modelsResult] = await Promise.all([
    getPrompts({
      search: searchParams.search,
      categoryId: searchParams.category,
      modelId: searchParams.model,
      sortBy: searchParams.sort as any,
      priceFilter: searchParams.price as any,
      page,
      limit,
    }),
    getCategories(),
    getAIModels(),
  ]);

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Explorar Prompts</h1>
        <p className="text-lg text-muted-foreground">
          Descubre prompts de alta calidad para potenciar tu creatividad con IA
        </p>
      </div>

      <Suspense fallback={<PromptCardSkeletonGrid count={12} />}>
        <PromptsPageClient
          initialPrompts={promptsResult.data || []}
          categories={categoriesResult.data || []}
          models={modelsResult.data || []}
          searchParams={searchParams}
          totalCount={promptsResult.count || 0}
          currentPage={page}
          limit={limit}
        />
      </Suspense>
    </div>
  );
}