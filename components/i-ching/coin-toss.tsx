"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, RotateCcw } from 'lucide-react';

interface CoinTossProps {
  onComplete: (lines: number[], changingLines: number[]) => void;
}

interface CoinResult {
  coin1: 'heads' | 'tails';
  coin2: 'heads' | 'tails';
  coin3: 'heads' | 'tails';
  value: number;
  isYang: boolean;
  isChanging: boolean;
}

export function CoinToss({ onComplete }: CoinTossProps) {
  const [currentLine, setCurrentLine] = useState(1);
  const [results, setResults] = useState<CoinResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const tossCoin = (): 'heads' | 'tails' => {
    return Math.random() < 0.5 ? 'heads' : 'tails';
  };

  const calculateLineValue = (coin1: 'heads' | 'tails', coin2: 'heads' | 'tails', coin3: 'heads' | 'tails') => {
    const headValue = 3;
    const tailValue = 2;
    
    const total = 
      (coin1 === 'heads' ? headValue : tailValue) +
      (coin2 === 'heads' ? headValue : tailValue) +
      (coin3 === 'heads' ? headValue : tailValue);
    
    return total;
  };

  const handleCoinToss = async () => {
    setIsAnimating(true);
    setShowInstructions(false);
    
    // Simulate coin toss animation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const coin1 = tossCoin();
    const coin2 = tossCoin();
    const coin3 = tossCoin();
    const value = calculateLineValue(coin1, coin2, coin3);
    
    // Determine line type based on traditional I Ching values
    const isYang = value % 2 === 1; // 9 or 7 (odd) = Yang, 8 or 6 (even) = Yin
    const isChanging = value === 6 || value === 9; // 6 = changing yin, 9 = changing yang
    
    const newResult: CoinResult = {
      coin1,
      coin2,
      coin3,
      value,
      isYang,
      isChanging
    };
    
    const newResults = [...results, newResult];
    setResults(newResults);
    setIsAnimating(false);
    
    if (currentLine < 6) {
      setCurrentLine(currentLine + 1);
    } else {
      // All lines complete, generate hexagram
      const lines = newResults.map(r => r.value);
      const changingLines = newResults
        .map((r, index) => r.isChanging ? index + 1 : null)
        .filter(Boolean) as number[];
      
      onComplete(lines, changingLines);
    }
  };

  const resetReading = () => {
    setCurrentLine(1);
    setResults([]);
    setShowInstructions(true);
  };

  const renderCoin = (coin: 'heads' | 'tails', index: number) => (
    <div
      key={index}
      className={`w-12 h-12 rounded-full border-2 border-mystical-gold flex items-center justify-center font-bold text-sm transition-all duration-300 ${
        coin === 'heads' 
          ? 'bg-mystical-gold text-mystical-dark-purple' 
          : 'bg-mystical-dark-purple text-mystical-gold'
      } ${isAnimating ? 'animate-spin' : ''}`}
    >
      {coin === 'heads' ? '☰' : '☷'}
    </div>
  );

  return (
    <Card className="mystical-card">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2 text-mystical-gold">
          <Coins className="w-6 h-6" />
          <span>Oracle Ba Đồng Xu</span>
        </CardTitle>
        <CardDescription>
          Phương pháp Kinh Dịch truyền thống sử dụng ba đồng xu để tạo vạch quẻ
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {showInstructions && (
          <div className="bg-mystical-gold/5 p-4 rounded-lg border border-mystical-gold/20">
            <h4 className="font-semibold text-mystical-gold mb-2">Cách Thực Hiện</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Suy nghĩ rõ ràng về câu hỏi của bạn</li>
              <li>• Tung ba đồng xu sáu lần để xây dựng quẻ của bạn</li>
              <li>• Mỗi lần tung tạo ra một vạch, bắt đầu từ dưới lên</li>
              <li>• Mặt ngửa = 3 điểm, Mặt sấp = 2 điểm</li>
              <li>• 6 điểm = âm thay đổi, 7 = âm, 8 = dương, 9 = dương thay đổi</li>
            </ul>
          </div>
        )}

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="secondary" className="bg-mystical-gold/10 text-mystical-gold">
              Vạch {currentLine} / 6
            </Badge>
            <Badge variant="outline" className="border-mystical-gold/30">
              Vị trí: {7 - currentLine} (từ dưới lên)
            </Badge>
          </div>

          {results.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-mystical-gold">Kết Quả Tung Xu</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result, index) => (
                  <Card key={index} className="bg-background/50">
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="text-sm font-medium text-mystical-gold">
                          Vạch {index + 1}
                        </div>
                        <div className="flex justify-center space-x-1">
                          {renderCoin(result.coin1, 0)}
                          {renderCoin(result.coin2, 1)}
                          {renderCoin(result.coin3, 2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Tổng: {result.value} - {result.isYang ? 'Dương' : 'Âm'}
                          {result.isChanging && ' (Thay đổi)'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentLine <= 6 && (
            <div className="space-y-4">
              <Button
                onClick={handleCoinToss}
                disabled={isAnimating}
                size="lg"
                className="mystical-button w-full"
              >
                <Coins className="w-5 h-5 mr-2" />
                {isAnimating ? 'Đang tung...' : `Tung Vạch ${currentLine}`}
              </Button>
            </div>
          )}

          {results.length === 6 && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-mystical-gold/5 rounded-lg border border-mystical-gold/20">
                <p className="text-mystical-gold font-semibold">
                  Quẻ hoàn thành! Lời giải của bạn đã sẵn sàng.
                </p>
              </div>
              <Button
                onClick={resetReading}
                variant="outline"
                className="w-full border-mystical-gold/30 hover:border-mystical-gold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Tung Quẻ Mới
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
