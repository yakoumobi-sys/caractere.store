'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ArticleAutocompleteProps {
  value: string;
  onChange: (value: string, id?: string) => void;
  onAddNew?: (name: string) => void;
}

export default function ArticleAutocomplete({
  value,
  onChange,
  onAddNew,
}: ArticleAutocompleteProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('pipeline_orders')
        .select('product_name')
        .order('product_name', { ascending: true });

      if (!error && data) {
        // Dédupliquer les articles
        const unique = Array.from(
          new Map(data.map(item => [item.product_name, item])).values()
        );
        setArticles(unique);
      }
      setIsLoading(false);
    };

    fetchArticles();
  }, [supabase]);

  useEffect(() => {
    if (value.length < 2) {
      setFilteredArticles([]);
      setIsOpen(false);
      return;
    }

    const filtered = articles.filter(a =>
      a.product_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredArticles(filtered);
    setIsOpen(true);
  }, [value, articles]);

  const handleSelect = (article: any) => {
    onChange(article.product_name, article.product_name);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    if (value.trim() && onAddNew) {
      onAddNew(value);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 2 && setIsOpen(true)}
        placeholder="Chercher ou créer un article..."
        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg">
          {isLoading ? (
            <div className="p-3 text-sm text-slate-500 dark:text-slate-400">
              Chargement...
            </div>
          ) : filteredArticles.length > 0 ? (
            <div>
              <div className="max-h-48 overflow-y-auto">
                {filteredArticles.map((article) => (
                  <button
                    key={article.product_name}
                    onClick={() => handleSelect(article)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition-colors"
                  >
                    {article.product_name}
                  </button>
                ))}
              </div>
              {value.trim() && (
                <button
                  onClick={handleAddNew}
                  className="w-full text-left px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium border-t border-slate-100 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  + Créer: "{value}"
                </button>
              )}
            </div>
          ) : value.trim() ? (
            <button
              onClick={handleAddNew}
              className="w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              + Créer: "{value}"
            </button>
          ) : (
            <div className="p-3 text-sm text-slate-500 dark:text-slate-400">
              Tape au moins 2 caractères
            </div>
          )}
        </div>
      )}
    </div>
  );
}
