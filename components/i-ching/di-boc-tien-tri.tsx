"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  Dices, 
  AlertCircle, 
  CheckCircle,
  BookOpen,
  Hash,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb
} from 'lucide-react';
import { getPredictionById, hasPrediction, getPredictionStats, type DibocPrediction } from '@/lib/diboc-data';

// Định nghĩa đầy đủ các chủ đề từ file text với 8 cung Bát Quái
const TOPICS = {
  // Cung Càn
  'mangvan': { name: 'Mạng vận (mạng đời sống)', table: 'can', values: [116,267,374,445,553,638,782,821] },
  'doctho': { name: 'Đọc thơ (đọc sách)', table: 'can', values: [113,268,372,441,556,637,784,825] },
  'tanhoc': { name: 'Tấn học (đi học)', table: 'can', values: [112,261,376,447,554,635,783,828] },
  'khocu': { name: 'Khoa cử (thi cử)', table: 'can', values: [118,262,371,446,557,634,785,823] },
  'tinhvu': { name: 'Tinh vũ (mưa tạnh)', table: 'can', values: [111,266,377,444,555,633,788,822] },
  'thuthao': { name: 'Thủ thảo (đòi nợ)', table: 'can', values: [114,265,373,448,552,631,786,827] },
  'chieute': { name: 'Chiêu tế (cưới rể)', table: 'can', values: [115,263,378,442,551,636,787,824] },
  'thinhy': { name: 'Thỉnh y (rước thầy thuốc)', table: 'can', values: [117,264,375,443,558,632,781,826] },

  // Cung Đoài
  'hoissu': { name: 'Hội sự (nhóm hội)', table: 'doai', values: [122,211,366,477,544,655,733,888] },
  'muusu': { name: 'Mưu sự (mưu chước)', table: 'doai', values: [123,218,362,471,546,657,734,885] },
  'maioc': { name: 'Mãi ốc (mua nhà)', table: 'doai', values: [125,213,368,472,541,656,737,884] },
  'dicu': { name: 'Di cư (đổi chổ ở việc làm)', table: 'doai', values: [121,216,367,474,545,653,738,882] },
  'phangia': { name: 'Phân gia (chia gia tài)', table: 'doai', values: [126,217,364,475,543,658,732,881] },
  'thienhoa': { name: 'Thiên hoa (đau trái giống)', table: 'doai', values: [128,212,361,476,547,654,735,883] },
  'phubenh': { name: 'Phụ bệnh (cha đau)', table: 'doai', values: [124,215,363,478,542,651,736,887] },
  'benhchung': { name: 'Bệnh chứng (đau, bệnh)', table: 'doai', values: [127,214,365,473,548,652,731,886] },

  // Cung Ly
  'khaitiem': { name: 'Khai tiệm (khai trương)', table: 'ly', values: [134,285,323,418,562,671,746,857] },
  'cautai': { name: 'Cầu tài (kiếm lời)', table: 'ly', values: [131,286,327,414,565,673,748,852] },
  'maisuc': { name: 'Mãi súc (mua súc vật)', table: 'ly', values: [133,288,322,411,566,677,744,855] },
  'phanquynh': { name: 'Phần quýnh (coi mả mồ)', table: 'ly', values: [137,284,325,413,568,672,741,856] },
  'hoihuong': { name: 'Hồi hương (trở về xứ sở)', table: 'ly', values: [135,283,328,412,561,676,747,854] },
  'tatai': { name: 'Tá tài (cho vay mượn tiền)', table: 'ly', values: [132,281,326,417,564,675,743,858] },
  'phongtruong': { name: 'Phóng trướng (cho vay)', table: 'ly', values: [136,287,324,415,563,678,742,851] },
  'dobac': { name: 'Đổ bác (cờ bạc)', table: 'ly', values: [138,282,321,416,567,674,745,853] },

  // Cung Chấn
  'nhapnhai': { name: 'Nhập nhái (cưới vợ ở quê vợ)', table: 'chan', values: [147,254,335,483,528,612,761,876] },
  'cautu': { name: 'Cầu tử (cầu con)', table: 'chan', values: [143,258,332,481,526,617,764,875] },
  'xuathanh': { name: 'Xuất hành (người đi)', table: 'chan', values: [144,255,333,488,522,611,766,877] },
  'tamquan': { name: 'Tầm quán (tìm quê quán)', table: 'chan', values: [142,251,336,487,524,615,763,878] },
  'thuthau': { name: 'Thu thâu (mùa gặt lúa)', table: 'chan', values: [141,256,337,484,525,613,768,872] },
  'thungu': { name: 'Thủ ngư (đi bắt cá)', table: 'chan', values: [145,253,338,482,521,616,767,874] },
  'damong': { name: 'Dạ mộng (ngủ chiêm bao)', table: 'chan', values: [146,257,334,485,523,618,762,871] },
  'khauthiet': { name: 'Khẩu thiệt (rầy rà với người)', table: 'chan', values: [148,252,331,486,527,614,765,873] },

  // Cung Tốn
  'sanhy': { name: 'Sanh ý (việc buôn bán)', table: 'ton', values: [156,237,384,425,513,668,772,841] },
  'thachoa': { name: 'Thác hoá (khai cửa hàng)', table: 'ton', values: [151,236,387,424,515,663,778,842] },
  'khoitao': { name: 'Khơi tạo (khởi công làm)', table: 'ton', values: [155,233,388,422,511,666,777,844] },
  'xuantam': { name: 'Xuân tàm (để tầm)', table: 'ton', values: [153,238,382,421,516,667,774,845] },
  'vanbang': { name: 'Văn bằng (giấy tờ cấp bằng)', table: 'ton', values: [157,234,385,423,518,662,771,846] },
  'kienquoi': { name: 'Kiến quới (thăm người)', table: 'ton', values: [152,231,386,427,514,665,773,848] },
  'giailuong': { name: 'Giải lương (phát lương)', table: 'ton', values: [154,235,383,428,512,661,776,847] },
  'totrang': { name: 'Tố trạng (bị kiện kêu nài)', table: 'ton', values: [158,232,381,426,517,664,775,843] },

  // Cung Khảm
  'napgiam': { name: 'Nạp giám (làm công chức)', table: 'kham', values: [163,278,342,451,536,687,724,815] },
  'thangthien': { name: 'Thăng thiên (cấp bực có lên không)', table: 'kham', values: [161,276,347,454,535,683,728,812] },
  'hoasu': { name: 'Hoà sự (cầu hoà)', table: 'kham', values: [164,275,343,458,532,681,726,817] },
  'giaoviec': { name: 'Giao việc (mua bán)', table: 'kham', values: [167,274,345,453,538,682,721,816] },
  'honnhan': { name: 'Hôn nhơn (cưới vợ)', table: 'kham', values: [165,273,348,452,531,686,727,814] },
  'thuthiep': { name: 'Thú thiếp (cưới vợ lẻ)', table: 'kham', values: [168,272,341,456,537,684,725,813] },
  'lucgiap': { name: 'Lục giáp (chuyển bụng đẻ)', table: 'kham', values: [166,277,344,455,533,688,722,811] },
  'tamnhon': { name: 'Tầm nhơn (kiếm người)', table: 'kham', values: [162,271,346,457,534,685,723,818] },

  // Cung Cấn
  'giatin': { name: 'Gia tín (biết tin nhà)', table: 'can2', values: [172,241,356,437,584,625,713,868] },
  'cauquan': { name: 'Cầu quan (muốn làm quan)', table: 'can2', values: [176,247,354,435,583,628,712,861] },
  'trihoa': { name: 'Trí hóa (trữ hàng hóa)', table: 'can2', values: [175,243,358,432,581,626,717,864] },
  'caotrang': { name: 'Cáo trạng (kiện người ta)', table: 'can2', values: [174,245,353,438,582,621,716,867] },
  'noplai': { name: 'Nộp lại (làm lính, công chức)', table: 'can2', values: [173,248,352,431,586,627,714,865] },
  'diensan': { name: 'Điền sản (đất vườn)', table: 'can2', values: [171,246,357,434,585,623,718,862] },
  'thaoboc': { name: 'Thảo bộc (bắt người ở trốn)', table: 'can2', values: [178,242,351,436,587,624,715,863] },
  'canquan': { name: 'Căn quan (đi tùy tùng với quan)', table: 'can2', values: [177,244,355,433,588,622,711,866] },

  // Cung Khôn
  'giatrach': { name: 'Gia trạch (cuộc nhà)', table: 'khon', values: [182,221,316,467,574,645,753,838] },
  'thonguon': { name: 'Thọ ngươn (sống chết)', table: 'khon', values: [181,226,317,464,575,643,758,832] },
  'tauthuat': { name: 'Tẩu thất (người trốn)', table: 'khon', values: [185,223,318,462,571,646,757,834] },
  'thatvat': { name: 'Thất vật (mất đồ)', table: 'khon', values: [184,225,313,468,572,641,756,837] },
  'hieploa': { name: 'Hiệp lỏa (hùng hiệp mua bán)', table: 'khon', values: [183,228,312,461,576,647,754,835] },
  'hanhnhon': { name: 'Hành nhơn (người đi)', table: 'khon', values: [186,227,314,465,573,648,752,831] },
  'giaigiao': { name: 'Giải giao (giải tội)', table: 'khon', values: [188,222,311,466,577,644,755,833] },
  'thunghe': { name: 'Thủ nghệ (làm nghề)', table: 'khon', values: [187,224,315,463,578,642,751,836] }
};

// Nhóm chủ đề theo 8 cung với thông tin chi tiết
const TOPIC_GROUPS = {
  'Cung Càn': {
    topics: ['mangvan', 'doctho', 'tanhoc', 'khocu', 'tinhvu', 'thuthao', 'chieute', 'thinhy'],
    description: 'Về học tập, tri thức, sức khỏe và phát triển bản thân',
    color: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  'Cung Đoài': {
    topics: ['hoissu', 'muusu', 'maioc', 'dicu', 'phangia', 'thienhoa', 'phubenh', 'benhchung'],
    description: 'Về xã hội, gia đình, sức khỏe và các mối quan hệ',
    color: 'bg-purple-50 border-purple-200 text-purple-800'
  },
  'Cung Ly': {
    topics: ['khaitiem', 'cautai', 'maisuc', 'phanquynh', 'hoihuong', 'tatai', 'phongtruong', 'dobac'],
    description: 'Về tài chính, kinh doanh và các hoạt động thương mại',
    color: 'bg-red-50 border-red-200 text-red-800'
  },
  'Cung Chấn': {
    topics: ['nhapnhai', 'cautu', 'xuathanh', 'tamquan', 'thuthau', 'thungu', 'damong', 'khauthiet'],
    description: 'Về hôn nhân, gia đình, di chuyển và các hoạt động nông nghiệp',
    color: 'bg-green-50 border-green-200 text-green-800'
  },
  'Cung Tốn': {
    topics: ['sanhy', 'thachoa', 'khoitao', 'xuantam', 'vanbang', 'kienquoi', 'giailuong', 'totrang'],
    description: 'Về kinh doanh, công việc, giấy tờ và các giao dịch',
    color: 'bg-teal-50 border-teal-200 text-teal-800'
  },
  'Cung Khảm': {
    topics: ['napgiam', 'thangthien', 'hoasu', 'giaoviec', 'honnhan', 'thuthiep', 'lucgiap', 'tamnhon'],
    description: 'Về công danh, hôn nhân, tìm kiếm và các mối quan hệ',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-800'
  },
  'Cung Cấn': {
    topics: ['giatin', 'cauquan', 'trihoa', 'caotrang', 'noplai', 'diensan', 'thaoboc', 'canquan'],
    description: 'Về tin tức, quan lộ, tài sản và các vấn đề pháp lý',
    color: 'bg-amber-50 border-amber-200 text-amber-800'
  },
  'Cung Khôn': {
    topics: ['giatrach', 'thonguon', 'tauthuat', 'thatvat', 'hieploa', 'hanhnhon', 'giaigiao', 'thunghe'],
    description: 'Về gia đạo, sức khỏe, mất mát và các nghề thủ công',
    color: 'bg-orange-50 border-orange-200 text-orange-800'
  }
};

// Bảng tra cứu Bát Quái
const BAGUA_NAMES = {
  1: 'Càn', 2: 'Đoài', 3: 'Ly', 4: 'Chấn',
  5: 'Tốn', 6: 'Khảm', 7: 'Cấn', 8: 'Khôn'
};

interface DiBocResult {
  topic: string;
  number: number;
  hexagramNumber: string;
  hexagramName: string;
  prediction: DibocPrediction | null;
  hasValidPrediction: boolean;
}

export function DiBocTienTri() {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [numberMethod, setNumberMethod] = useState<'random' | 'manual'>('random');
  const [manualNumber, setManualNumber] = useState<string>('');
  const [result, setResult] = useState<DiBocResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showStats, setShowStats] = useState(false);

  // Get prediction statistics
  const predictionStats = getPredictionStats();

  // Toggle expanded state for topic groups
  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  // Validate input số
  const validateNumber = (num: string): boolean => {
    const number = parseInt(num);
    return !isNaN(number) && number >= 1 && number <= 8;
  };

  // Tính toán số quẻ và tên quái
  const calculateHexagram = (topicKey: string, number: number): { hexagramNumber: string, hexagramName: string } => {
    const topic = TOPICS[topicKey as keyof typeof TOPICS];
    if (!topic) return { hexagramNumber: '', hexagramName: '' };

    // Lấy số quẻ từ bảng tra cứu (index = number - 1)
    const hexagramValue = topic.values[number - 1];
    const hexagramNumber = hexagramValue.toString();
    
    // Tách 2 số cuối để xác định nội quái và ngoại quái
    const lastTwoDigits = hexagramNumber.slice(-2);
    const innerTrigram = parseInt(lastTwoDigits.charAt(1)); // Nội quái
    const outerTrigram = parseInt(lastTwoDigits.charAt(0)); // Ngoại quái
    
    // Tạo tên quẻ từ ngoại quái và nội quái
    const outerName = BAGUA_NAMES[outerTrigram as keyof typeof BAGUA_NAMES] || '';
    const innerName = BAGUA_NAMES[innerTrigram as keyof typeof BAGUA_NAMES] || '';
    const hexagramName = `${outerName} ${innerName}`;

    return { hexagramNumber, hexagramName };
  };

  // Xử lý gieo quẻ
  const handleGenerateHexagram = async () => {
    try {
      setError('');
      setIsGenerating(true);

      // Validate chủ đề
      if (!selectedTopic) {
        setError('Vui lòng chọn chủ đề cần hỏi bói.');
        return;
      }

      let finalNumber: number;

      // Xác định số sử dụng
      if (numberMethod === 'random') {
        finalNumber = Math.floor(Math.random() * 8) + 1;
      } else {
        if (!manualNumber.trim()) {
          setError('Vui lòng nhập số từ 1 đến 8.');
          return;
        }
        
        if (!validateNumber(manualNumber)) {
          setError('Số phải từ 1 đến 8. Vui lòng nhập lại.');
          return;
        }
        
        finalNumber = parseInt(manualNumber);
      }

      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // Tính toán kết quả
      const { hexagramNumber, hexagramName } = calculateHexagram(selectedTopic, finalNumber);
      const topicName = TOPICS[selectedTopic as keyof typeof TOPICS].name;
      
      // Lấy dữ liệu tiên tri từ JSON
      const prediction = getPredictionById(hexagramNumber);
      const hasValidPrediction = prediction !== null;

      const newResult: DiBocResult = {
        topic: topicName,
        number: finalNumber,
        hexagramNumber,
        hexagramName,
        prediction,
        hasValidPrediction
      };

      setResult(newResult);
    } catch (err) {
      setError('Có lỗi xảy ra khi gieo quẻ. Vui lòng thử lại.');
      console.error('Error generating hexagram:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setResult(null);
    setError('');
    setSelectedTopic('');
    setManualNumber('');
    setNumberMethod('random');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="mystical-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-mystical-gold">
            <Sparkles className="w-6 h-6" />
            <span className="text-2xl font-mystical">Dị Bốc Tiên Tri</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Tiên Thiên Diệt Số - 512 Quẻ Tiên Tri Cổ Đại
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-mystical-gold/5 p-4 rounded-lg border border-mystical-gold/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Dị Bốc Tiên Tri</strong> là một cuốn sách cổ của tiên sinh Thiệu Khang Tiết, 
              ghi lại các chiêm nghiệm của quẻ Kinh Dịch đối với các sự việc cần hỏi. 
              Đây là phương pháp bói toán trực tiếp, cho kết quả rõ ràng và chính xác với 64 chủ đề khác nhau.
            </p>
            
            {/* Data Statistics */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>Dữ liệu: {predictionStats.total} quẻ tiên tri hợp lệ</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className="text-xs"
              >
                {showStats ? 'Ẩn' : 'Hiện'} thống kê
                {showStats ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
              </Button>
            </div>
            
            {showStats && (
              <div className="mt-3 p-3 bg-white/50 rounded border border-mystical-gold/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-mystical-gold">{predictionStats.total}</div>
                    <div className="text-muted-foreground">Quẻ hợp lệ</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-mystical-gold">{predictionStats.totalInFile}</div>
                    <div className="text-muted-foreground">Tổng trong file</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-mystical-gold">{predictionStats.validPercentage}%</div>
                    <div className="text-muted-foreground">Tỷ lệ hợp lệ</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-mystical-gold">512</div>
                    <div className="text-muted-foreground">Quẻ truyền thống</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Card className="mystical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-mystical-gold">
            <Dices className="w-5 h-5" />
            <span>Gieo Quẻ Tiên Tri</span>
          </CardTitle>
          <CardDescription>
            Chọn chủ đề từ 64 lĩnh vực và phương pháp để nhận lời tiên tri từ 8 cung Bát Quái
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Topic Selection */}
          <div className="space-y-2">
            <Label htmlFor="topic-select" className="text-mystical-gold font-medium">
              Chọn chủ đề cần hỏi bói (64 lĩnh vực)
            </Label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="bg-white/50 border-mystical-gold/30 focus:border-mystical-gold">
                <SelectValue placeholder="-- Chọn loại câu hỏi --" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {Object.entries(TOPIC_GROUPS).map(([groupName, groupData]) => (
                  <div key={groupName}>
                    <div className="px-2 py-1 text-sm font-semibold text-mystical-gold bg-mystical-gold/5 sticky top-0">
                      {groupName}
                    </div>
                    {groupData.topics.map((topicKey) => (
                      <SelectItem key={topicKey} value={topicKey} className="pl-4">
                        {TOPICS[topicKey as keyof typeof TOPICS].name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Number Method Selection */}
          <div className="space-y-4">
            <Label className="text-mystical-gold font-medium">Chọn phương pháp lấy số</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="random"
                  name="numberMethod"
                  value="random"
                  checked={numberMethod === 'random'}
                  onChange={(e) => setNumberMethod(e.target.value as 'random')}
                  className="text-mystical-gold focus:ring-mystical-gold"
                />
                <Label htmlFor="random" className="cursor-pointer">
                  Số ngẫu nhiên (hệ thống sinh quẻ)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="manual"
                  name="numberMethod"
                  value="manual"
                  checked={numberMethod === 'manual'}
                  onChange={(e) => setNumberMethod(e.target.value as 'manual')}
                  className="text-mystical-gold focus:ring-mystical-gold"
                />
                <Label htmlFor="manual" className="cursor-pointer">
                  Nhập số (từ 1 đến 8)
                </Label>
              </div>
            </div>

            {/* Manual Number Input */}
            {numberMethod === 'manual' && (
              <div className="space-y-2">
                <Label htmlFor="manual-number" className="text-sm text-muted-foreground">
                  Nhập số từ 1 đến 8
                </Label>
                <Input
                  id="manual-number"
                  type="number"
                  min="1"
                  max="8"
                  value={manualNumber}
                  onChange={(e) => setManualNumber(e.target.value)}
                  placeholder="Nhập số từ 1-8"
                  className="bg-white/50 border-mystical-gold/30 focus:border-mystical-gold"
                />
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="flex space-x-3">
            <Button
              onClick={handleGenerateHexagram}
              disabled={isGenerating || !selectedTopic}
              className="mystical-button flex-1"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mystical-dark-purple mr-2"></div>
                  Đang gieo quẻ...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Gieo Quẻ
                </>
              )}
            </Button>
            
            {result && (
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="border-mystical-gold/30 hover:border-mystical-gold"
              >
                Gieo Lại
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {result && (
        <Card className="mystical-card border-mystical-gold/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-mystical-gold">
                <CheckCircle className="w-5 h-5" />
                <span>Kết Quả Tiên Tri</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Badge variant="secondary" className="bg-mystical-gold/10 text-mystical-gold">
                  {result.topic}
                </Badge>
                <Badge variant="outline" className="border-mystical-gold/30">
                  Số {result.number}
                </Badge>
                {result.hasValidPrediction && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Có dữ liệu tiên tri
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hexagram Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-mystical-gold/5 rounded-lg border border-mystical-gold/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Hash className="w-4 h-4 text-mystical-gold" />
                  <span className="font-semibold text-mystical-gold">Số Quẻ</span>
                </div>
                <div className="text-2xl font-bold text-mystical-dark-purple">
                  {result.hexagramNumber}
                </div>
              </div>
              
              <div className="p-4 bg-mystical-gold/5 rounded-lg border border-mystical-gold/20">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-4 h-4 text-mystical-gold" />
                  <span className="font-semibold text-mystical-gold">Tên Quái</span>
                </div>
                <div className="text-xl font-bold text-mystical-dark-purple">
                  {result.hexagramName}
                </div>
              </div>
            </div>

            <Separator className="bg-mystical-gold/20" />

            {/* Prediction Content */}
            {result.hasValidPrediction && result.prediction ? (
              <div className="space-y-4">
                {/* Tên quẻ từ JSON */}
                <div className="p-4 bg-gradient-to-br from-mystical-gold/5 to-yellow-50 rounded-lg border border-mystical-gold/20">
                  <h4 className="font-semibold text-mystical-gold mb-2 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Tên Quẻ</span>
                  </h4>
                  <p className="text-mystical-dark-purple font-medium text-lg">
                    {result.prediction.Name}
                  </p>
                </div>

                {/* Lời quẻ gốc */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-700 mb-3 flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Lời Quẻ</span>
                  </h4>
                  <ScrollArea className="max-h-32">
                    <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">
                      {result.prediction.original}
                    </p>
                  </ScrollArea>
                </div>

                {/* Dịch nghĩa */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>Dịch Nghĩa</span>
                  </h4>
                  <ScrollArea className="max-h-40">
                    <p className="text-green-800 leading-relaxed whitespace-pre-wrap">
                      {result.prediction.interpretation}
                    </p>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-600 mb-2">Không có dữ liệu tiên tri</h4>
                <p className="text-gray-500 text-sm">
                  Số quẻ {result.hexagramNumber} chưa có dữ liệu tiên tri trong hệ thống. 
                  Vui lòng thử gieo quẻ khác hoặc liên hệ để cập nhật dữ liệu.
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Kết quả dựa trên phương pháp Dị Bốc Tiên Tri của tiên sinh Thiệu Khang Tiết
                {result.hasValidPrediction && (
                  <span className="block mt-1 text-green-600">
                    ✓ Dữ liệu tiên tri được truy xuất từ kho dữ liệu cổ điển
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mystical-card">
        <CardHeader>
          <CardTitle className="text-mystical-gold">Hướng Dẫn Sử Dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-mystical-gold mb-2">Cách Thức Hoạt Động</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Chọn chủ đề cần hỏi bói từ 64 lĩnh vực được phân chia theo 8 cung</li>
                <li>• Lựa chọn số ngẫu nhiên hoặc tự nhập số từ 1-8</li>
                <li>• Hệ thống sẽ tra cứu trong bảng cung Bát Quái tương ứng</li>
                <li>• Nhận kết quả với số quẻ và lời tiên tri chi tiết từ dữ liệu cổ điển</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-mystical-gold mb-2">8 Cung Bát Quái</h4>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {Object.entries(BAGUA_NAMES).map(([num, name]) => (
                  <div key={num} className="text-center p-2 bg-mystical-gold/5 rounded border border-mystical-gold/20">
                    <div className="font-bold text-mystical-gold">{num}</div>
                    <div className="text-muted-foreground">{name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Topic Groups Summary with Detailed Information */}
          <div className="mt-6">
            <h4 className="font-semibold text-mystical-gold mb-3">64 Chủ Đề Theo 8 Cung Chi Tiết</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {Object.entries(TOPIC_GROUPS).map(([groupName, groupData]) => (
                <div key={groupName} className={`p-3 rounded border ${groupData.color}`}>
                  <button
                    onClick={() => toggleGroup(groupName)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{groupName}</div>
                      {expandedGroups.has(groupName) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-xs opacity-75 mb-2">
                      {groupData.description}
                    </div>
                    <div className="text-xs opacity-60">
                      {groupData.topics.length} chủ đề
                    </div>
                  </button>
                  
                  {expandedGroups.has(groupName) && (
                    <div className="mt-3 pt-3 border-t border-current/20">
                      <div className="space-y-1">
                        {groupData.topics.map((topicKey) => (
                          <div key={topicKey} className="text-xs opacity-75 leading-relaxed">
                            • {TOPICS[topicKey as keyof typeof TOPICS].name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}