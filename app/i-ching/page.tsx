"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Coins, 
  Sparkles, 
  Shuffle,
  Eye
} from 'lucide-react';
import { Hexagram, getHexagramByLines } from '@/lib/i-ching-data';
import { HexagramDisplay } from '@/components/i-ching/hexagram-display';
import { CoinToss } from '@/components/i-ching/coin-toss';
import { DiBocTienTri } from '@/components/i-ching/di-boc-tien-tri';

type ViewMode = 'intro' | 'coin-toss' | 'di-boc' | 'hexagram';

export default function IChing() {
  const [viewMode, setViewMode] = useState<ViewMode>('intro');
  const [currentHexagram, setCurrentHexagram] = useState<Hexagram | null>(null);
  const [currentLines, setCurrentLines] = useState<number[]>([]); // State mới để lưu các vạch
  const [changingLines, setChangingLines] = useState<number[]>([]);
  const [question, setQuestion] = useState('');

  const handleCoinTossComplete = (lines: boolean[], changingLinesResult: number[]) => {
    const numericLines = lines.map(line => (line ? 1 : 0));
    const hexagram = getHexagramByLines(numericLines);

    if (hexagram) {
      setCurrentHexagram(hexagram);
      setCurrentLines(numericLines); // Lưu các vạch vào state
      setChangingLines(changingLinesResult);
      setViewMode('hexagram');
    }
  };

  const handleQuickReading = () => {
    // Tự tạo 6 vạch ngẫu nhiên (0 hoặc 1)
    const randomLines = Array.from({ length: 6 }, () => Math.round(Math.random()));
    
    // Tìm quẻ dựa trên các vạch ngẫu nhiên
    const hexagram = getHexagramByLines(randomLines);
    
    if (hexagram) {
      // Tạo các vạch biến đổi ngẫu nhiên
      const randomChangingLines = Math.random() < 0.3 
        ? [Math.floor(Math.random() * 6) + 1] 
        : [];
      
      // Cập nhật tất cả state cần thiết
      setCurrentHexagram(hexagram);
      setCurrentLines(randomLines); // Lưu các vạch vào state
      setChangingLines(randomChangingLines);
      setViewMode('hexagram');
    }
  };

  const resetReading = () => {
    setViewMode('intro');
    setCurrentHexagram(null);
    setCurrentLines([]); // Reset state của các vạch
    setChangingLines([]);
    setQuestion('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
             <Card className="shadow-lg border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600 font-semibold">
                  Về Kinh Dịch
                </CardTitle>
                <CardDescription className="text-lg">
                  Kinh Thay Đổi, một trong những kinh điển cổ nhất của Trung Quốc
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Kinh Dịch (易經) là một văn bản bói toán cổ đại của Trung Quốc có niên đại hơn 3.000 năm. 
                  Nó bao gồm 64 quẻ, mỗi quẻ được tạo thành từ sáu vạch có thể là đứt (âm) hoặc liền (dương). 
                  Những quẻ này đại diện cho các tình huống khác nhau trong cuộc sống và cung cấp hướng dẫn để hiểu về sự thay đổi và đưa ra quyết định.
                </p>
                <p className="text-gray-700">
                  Oracle hoạt động bằng cách tạo ra một quẻ thông qua việc tung đồng xu hoặc que cỏ, 
                  sau đó được giải thích theo trí tuệ cổ đại có trong văn bản. 
                  Mỗi quẻ có nhiều lớp ý nghĩa, bao gồm giải thích chung, 
                  lời khuyên cụ thể cho các lĩnh vực khác nhau trong cuộc sống, và những hiểu biết bổ sung từ các vạch thay đổi.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => setViewMode('coin-toss')}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Coins className="w-8 h-8 text-blue-500" />
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
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
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={handleQuickReading}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Shuffle className="w-8 h-8 text-purple-500" />
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                      Nhanh
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                    Đọc Tức Thì
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-6">
                    Nhận ngay một quẻ để được hướng dẫn nhanh chóng. 
                    Hoàn hảo cho cảm hứng hàng ngày hoặc khi bạn cần câu trả lời nhanh.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => setViewMode('di-boc')}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Sparkles className="w-8 h-8 text-amber-500" />
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                      Cổ Đại
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                    Dị Bốc Tiên Tri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-6">
                    Phương pháp bói toán cổ đại với 512 quẻ tiên tri, đưa ra lời tiên tri trực tiếp và chính xác cho 6 lĩnh vực.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {viewMode === 'coin-toss' && (
          <div className="space-y-6">
            <Button
              onClick={resetReading}
              variant="ghost"
              className="hover:bg-gray-100"
            >
              ← Quay Lại Giới Thiệu
            </Button>
            <CoinToss onComplete={handleCoinTossComplete} />
          </div>
        )}

        {viewMode === 'di-boc' && (
          <div className="space-y-6">
            <Button
              onClick={resetReading}
              variant="ghost"
              className="hover:bg-gray-100"
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
                className="hover:bg-gray-100"
              >
                ← Đọc Mới
              </Button>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  Quẻ {currentHexagram.id}
                </Badge>
                {changingLines.length > 0 && (
                  <Badge variant="outline" className="border-purple-300 text-purple-700">
                    {changingLines.length} Vạch Thay Đổi
                  </Badge>
                )}
              </div>
            </div>

            {question && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-700">Câu Hỏi Của Bạn:</span> {question}
                  </p>
                </CardContent>
              </Card>
            )}

            <HexagramDisplay 
              hexagram={currentHexagram}
              lines={currentLines}
              changedLines={changingLines}
            />
          </div>
        )}
      </div>
    </div>
  );
}
