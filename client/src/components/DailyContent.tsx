import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";

interface DailyContentItem {
  id: number;
  type: "verse" | "hadith";
  content: string;
  source: string;
  date: string;
  language: string;
}

export function DailyContent() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const { data: dailyContent, isLoading } = useQuery<DailyContentItem[]>({
    queryKey: ["/api/daily-content", language],
    retry: false,
  });

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-yellow-50">
        <CardContent className="p-6">
          <h5 className="font-semibold text-gray-900 mb-4">{t('dashboard.dailyInspiration')}</h5>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const verse = dailyContent?.find(item => item.type === "verse");
  const hadith = dailyContent?.find(item => item.type === "hadith");

  return (
    <Card className="bg-gradient-to-br from-green-50 to-yellow-50">
      <CardContent className="p-6">
        <h5 className="font-semibold text-gray-900 mb-4">{t('dashboard.dailyInspiration')}</h5>
        
        <div className="space-y-4">
          {verse && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-600 text-lg">🕌</span>
                <span className="text-sm font-medium text-gray-700">{t('dashboard.verseOfDay')}</span>
              </div>
              <p className="text-sm text-gray-800 font-medium mb-2">
                {verse.content}
              </p>
              <p className="text-xs text-gray-600">{verse.source}</p>
            </div>
          )}
          
          {hadith && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-600 text-lg">📿</span>
                <span className="text-sm font-medium text-gray-700">{t('dashboard.hadithOfDay')}</span>
              </div>
              <p className="text-sm text-gray-800 mb-2">
                {hadith.content}
              </p>
              <p className="text-xs text-gray-600">{hadith.source}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
