"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Coins, 
  Sparkles, 
  History,
  Shuffle,
  Eye
} from 'lucide-react';
import { Hexagram, generateRandomHexagram, getHexagramByLines } from '@/lib/i-ching-data';
import { HexagramDisplay } from '@/components/i-ching/hexagram-display';
import { CoinToss } from '@/components/i-ching/coin-toss';
import { DiBocTienTri } from '@/components/i-ching/di-boc-tien-tri';

type ViewMode = 'intro' | 'coin-toss' | 'quick-reading' | 'di-boc' | 'hexagram';

export default function IChing() {
  const [viewMode, setViewMode] = useState<ViewMode>('intro');
  const [currentHexagram, setCurrentHexagram] = useState<Hexagram | null>(null);
  const [changingLines, setChangingLines] = useState<number[]>([]);
  const [question, setQuestion] = useState('');

  const handleCoinTossComplete = (lines: boolean[], changingLinesResult: number[]) => {
  // Convert the boolean array to a number array
  const numericLines = lines.map(line => (line ? 1 : 0));

  // Pass the numeric array to the function
  const hexagram = getHexagramByLines(numericLines);

  if (hexagram) {
    setCurrentHexagram(hexagram);
    setChangingLines(changingLinesResult);
  }
};

  const handleQuickReading = () => {
    const hexagram = generateRandomHexagram();
    const randomChangingLines = Math.random() < 0.3 
      ? [Math.floor(Math.random() * 6) + 1] 
      : [];
    
    setCurrentHexagram(hexagram);
    setChangingLines(randomChangingLines);
    setViewMode('hexagram');
  };

  const resetReading = () => {
    setViewMode('intro');
    setCurrentHexagram(null);
    setChangingLines([]);
    setQuestion('');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 border border-white/30 mb-6">
            <BookOpen className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Kinh Thay Đổi</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Kinh Dịch Oracle
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tham khảo Kinh Dịch cổ đại của Trung Quốc để được hướng dẫn và trí tuệ. 
            Tạo quẻ của bạn bằng phương pháp truyền thống và khám phá những hiểu biết sâu sắc.
          </p>
        </div>

        {/* Content */}
        {viewMode === 'intro' && (
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="moonrise-card">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600 font-semibold">
                  Về Kinh Dịch
                </CardTitle>
                <CardDescription className="text-lg">
                  Kinh Thay Đổi, một trong những kinh điển cổ nhất của Trung Quốc
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Kinh Dịch (易經) là một văn bản bói toán cổ đại của Trung Quốc có niên đại hơn 3.000 năm. 
                  Nó bao gồm 64 quẻ, mỗi quẻ được tạo thành từ sáu vạch có thể là đứt (âm) hoặc liền (dương). 
                  Những quẻ này đại diện cho các tình huống khác nhau trong cuộc sống và cung cấp hướng dẫn để hiểu về sự thay đổi và đưa ra quyết định.
                </p>
                <p className="text-gray-600">
                  Oracle hoạt động bằng cách tạo ra một quẻ thông qua việc tung đồng xu hoặc que cỏ, 
                  sau đó được giải thích theo trí tuệ cổ đại có trong văn bản. 
                  Mỗi quẻ có nhiều lớp ý nghĩa, bao gồm giải thích chung, 
                  lời khuyên cụ thể cho các lĩnh vực khác nhau trong cuộc sống, và những hiểu biết bổ sung từ các vạch thay đổi.
                </p>
              </CardContent>
            </Card>

            {/* Consultation Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="moonrise-card group hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => setViewMode('coin-toss')}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Coins className="w-8 h-8 text-blue-400 animate-float" />
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200">
                      Truyền Thống
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Phương Pháp Ba Đồng Xu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-6">
                    Sử dụng phương pháp ba đồng xu truyền thống để tạo quẻ của bạn. 
                    Phương pháp này bao gồm việc tung ba đồng xu sáu lần để xây dựng quẻ từ dưới lên trên.
                  </CardDescription>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Phương pháp truyền thống chính thống nhất</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Xác định các vạch thay đổi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Hoạt ảnh đồng xu tương tác</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="moonrise-card group hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => setViewMode('quick-reading')}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Shuffle className="w-8 h-8 text-purple-400 animate-float" style={{ animationDelay: '0.2s' }} />
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200">
                      Nhanh
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Đọc Tức Thì
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-6">
                    Nhận ngay một quẻ để được hướng dẫn nhanh chóng. 
                    Hoàn hảo cho cảm hứng hàng ngày hoặc khi bạn cần câu trả lời nhanh cho câu hỏi của mình.
                  </CardDescription>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Tạo quẻ tức thì</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Giải thích hoàn chỉnh</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Hoàn hảo cho hướng dẫn hàng ngày</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mystical-card group hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => setViewMode('di-boc')}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Sparkles className="w-8 h-8 text-mystical-gold animate-float" style={{ animationDelay: '0.4s' }} />
                    <Badge variant="secondary" className="bg-mystical-gold/10 text-mystical-gold border-mystical-gold/30">
                      Cổ Đại
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-mystical-gold transition-colors">
                    Dị Bốc Tiên Tri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-6">
                    Phương pháp bói toán cổ đại với 512 quẻ tiên tri. 
                    Sử dụng 8 cung Bát Quái để đưa ra lời tiên tri trực tiếp và chính xác.
                  </CardDescription>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-mystical-gold rounded-full"></div>
                      <span>512 quẻ tiên tri cổ đại</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-mystical-gold rounded-full"></div>
                      <span>Kết quả trực tiếp, rõ ràng</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-mystical-gold rounded-full"></div>
                      <span>6 lĩnh vực chuyên biệt</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Featured Hexagrams */}
            <Card className="moonrise-card">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600 font-semibold">
                  Quẻ Nổi Bật
                </CardTitle>
                <CardDescription>
                  Khám phá một số quẻ quan trọng nhất trong Kinh Dịch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 1, name: "Quẻ Càn", symbol: "☰", keywords: ["Lãnh Đạo", "Sáng Tạo"] },
                    { id: 2, name: "Quẻ Khôn", symbol: "☷", keywords: ["Kiên Nhẫn", "Hỗ Trợ"] },
                    { id: 3, name: "Khó Khăn Ban Đầu", symbol: "☳", keywords: ["Kiên Trì", "Phát Triển"] }
                  ].map((hex) => (
                    <div key={hex.id} className="text-center p-4 bg-white/50 rounded-lg border border-white/20">
                      <div className="text-2xl mb-2">{hex.symbol}</div>
                      <div className="font-semibold text-blue-600">{hex.name}</div>
                      <div className="flex justify-center space-x-1 mt-2">
                        {hex.keywords.map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs border-blue-300">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {viewMode === 'coin-toss' && (
          <div className="space-y-6">
            <Button
              onClick={resetReading}
              variant="ghost"
              className="hover:bg-blue-50"
            >
              ← Quay Lại Giới Thiệu
            </Button>
            <CoinToss onComplete={handleCoinTossComplete} />
          </div>
        )}

        {viewMode === 'quick-reading' && (
          <div className="space-y-6">
            <Card className="moonrise-card text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600 font-semibold">
                  Đọc Nhanh
                </CardTitle>
                <CardDescription>
                  Tập trung vào câu hỏi của bạn và nhận hướng dẫn tức thì
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-w-md mx-auto">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Bạn tìm kiếm hướng dẫn gì? (tùy chọn)"
                    className="w-full p-3 bg-white/50 border border-white/20 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleQuickReading}
                  size="lg"
                  className="moonrise-button"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Hiển Thị Quẻ Của Bạn
                </Button>
                <Button
                  onClick={resetReading}
                  variant="ghost"
                  className="hover:bg-blue-50"
                >
                  Quay Lại Giới Thiệu
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {viewMode === 'di-boc' && (
          <div className="space-y-6">
            <Button
              onClick={resetReading}
              variant="ghost"
              className="hover:bg-blue-50"
            >
              ← Quay Lại Giới Thiệu
            </Button>
            <DiBocTienTri />
          </div>
        )}

        {viewMode === 'hexagram' && currentHexagram && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={resetReading}
                variant="ghost"
                className="hover:bg-blue-50"
              >
                ← Đọc Mới
              </Button>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200">
                  Quẻ {currentHexagram.id}
                </Badge>
                {changingLines.length > 0 && (
                  <Badge variant="outline" className="border-blue-300">
                    {changingLines.length} Vạch Thay Đổi
                  </Badge>
                )}
              </div>
            </div>

            {question && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">Câu Hỏi Của Bạn:</span> {question}
                  </p>
                </CardContent>
              </Card>
            )}

            <HexagramDisplay 
              hexagram={currentHexagram} 
              changingLines={changingLines}
            />
          </div>
        )}
      </div>
    </div>
  );
}
