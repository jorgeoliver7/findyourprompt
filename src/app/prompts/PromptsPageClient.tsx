'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import PromptCard from '@/components/prompts/PromptCard';
import { PromptWithDetails, Category, AIModel, PromptSortBy } from '@/types/prompts';

interface PromptsPageClientProps {
  initialPrompts: PromptWithDetails[];
  categories: Category[];
  models: AIModel[];
  searchParams: {
    search?: string;
    category?: string;
    model?: string;
    sort?: string;
    price?: string;
    page?: string;
  };
  totalCount: number;
  currentPage: number;
  limit: number;
}

export default function PromptsPageClient({
  initialPrompts,
  categories,
  models,
  searchParams,
  totalCount,
  currentPage,
  limit,
}: PromptsPageClientProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [prompts, setPrompts] = useState(initialPrompts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || '');
  const [selectedModel, setSelectedModel] = useState(searchParams.model || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.sort || 'created_at');
  const [selectedPrice, setSelectedPrice] = useState(searchParams.price || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const totalPages = Math.ceil(totalCount / limit);

  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(urlSearchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    // Reset page when filters change
    if (Object.keys(params).some(key => key !== 'page')) {
      newParams.delete('page');
    }

    router.push(`/prompts?${newParams.toString()}`);
  };

  const handleSearch = () => {
    updateURL({ search: searchTerm });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedModel('');
    setSelectedSort('created_at');
    setSelectedPrice('');
    router.push('/prompts');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedModel || selectedPrice;

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || '';
  };

  const getModelName = (modelId: string) => {
    return models.find(model => model.id === modelId)?.name || '';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>

        {/* Quick Sort */}
        <Select value={selectedSort} onValueChange={(value) => updateURL({ sort: value })}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Más recientes</SelectItem>
            <SelectItem value="downloads">Más descargados</SelectItem>
            <SelectItem value="likes">Más populares</SelectItem>
            <SelectItem value="rating">Mejor valorados</SelectItem>
            <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Sheet */}
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Refina tu búsqueda con estos filtros
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Categoría</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Modelo de IA</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los modelos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los modelos</SelectItem>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} - {model.provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Precio</label>
                <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los precios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los precios</SelectItem>
                    <SelectItem value="free">Gratis</SelectItem>
                    <SelectItem value="paid">De pago</SelectItem>
                    <SelectItem value="under_5">Menos de $5</SelectItem>
                    <SelectItem value="5_to_20">$5 - $20</SelectItem>
                    <SelectItem value="over_20">Más de $20</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Apply Filters */}
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    updateURL({
                      category: selectedCategory,
                      model: selectedModel,
                      price: selectedPrice,
                    });
                    setIsFilterOpen(false);
                  }}
                  className="w-full"
                >
                  Aplicar filtros
                </Button>
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Búsqueda: {searchTerm}
              <button
                onClick={() => {
                  setSearchTerm('');
                  updateURL({ search: '' });
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {getCategoryName(selectedCategory)}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  updateURL({ category: '' });
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedModel && (
            <Badge variant="secondary" className="gap-1">
              {getModelName(selectedModel)}
              <button
                onClick={() => {
                  setSelectedModel('');
                  updateURL({ model: '' });
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedPrice && (
            <Badge variant="secondary" className="gap-1">
              {selectedPrice === 'free' && 'Gratis'}
              {selectedPrice === 'paid' && 'De pago'}
              {selectedPrice === 'under_5' && 'Menos de $5'}
              {selectedPrice === '5_to_20' && '$5 - $20'}
              {selectedPrice === 'over_20' && 'Más de $20'}
              <button
                onClick={() => {
                  setSelectedPrice('');
                  updateURL({ price: '' });
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {totalCount === 0 ? (
          'No se encontraron prompts'
        ) : (
          `Mostrando ${(currentPage - 1) * limit + 1}-${Math.min(currentPage * limit, totalCount)} de ${totalCount} prompts`
        )}
      </div>

      {/* Prompts Grid */}
      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No se encontraron prompts</p>
            <p className="text-sm">Intenta ajustar tus filtros de búsqueda</p>
          </div>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline">
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => updateURL({ page: (currentPage - 1).toString() })}
          >
            Anterior
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateURL({ page: pageNum.toString() })}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => updateURL({ page: (currentPage + 1).toString() })}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}