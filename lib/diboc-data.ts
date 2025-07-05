// Interface cho dữ liệu tiên tri từ file JSON
export interface DibocPrediction {
  id: string;
  Name: string;
  original: string;
  interpretation: string;
}

// Import dữ liệu từ file JSON
import dibocData from './data111-888.json';

// Validate và filter dữ liệu hợp lệ
const validPredictions: DibocPrediction[] = dibocData.filter((item: any) => {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.Name === 'string' &&
    typeof item.original === 'string' &&
    typeof item.interpretation === 'string' &&
    item.id.trim() !== '' &&
    item.Name.trim() !== '' &&
    item.original.trim() !== '' &&
    item.interpretation.trim() !== ''
  );
});

// Tạo Map để truy xuất nhanh theo ID
const predictionMap = new Map<string, DibocPrediction>();
validPredictions.forEach(prediction => {
  predictionMap.set(prediction.id, prediction);
});

/**
 * Lấy dữ liệu tiên tri theo ID số quẻ
 * @param hexagramNumber - Số quẻ cần tìm
 * @returns Dữ liệu tiên tri hoặc null nếu không tìm thấy
 */
export function getPredictionById(hexagramNumber: string): DibocPrediction | null {
  try {
    // Chuẩn hóa ID (loại bỏ khoảng trắng và chuyển thành string)
    const normalizedId = hexagramNumber.toString().trim();
    
    // Tìm kiếm trong Map
    const prediction = predictionMap.get(normalizedId);
    
    if (prediction) {
      return prediction;
    }
    
    // Fallback: tìm kiếm trong array nếu Map không có
    const fallbackPrediction = validPredictions.find(p => p.id === normalizedId);
    return fallbackPrediction || null;
  } catch (error) {
    console.error('Error getting prediction by ID:', error);
    return null;
  }
}

/**
 * Lấy tất cả dữ liệu tiên tri hợp lệ
 * @returns Mảng tất cả dữ liệu tiên tri
 */
export function getAllPredictions(): DibocPrediction[] {
  return [...validPredictions];
}

/**
 * Kiểm tra xem ID có tồn tại trong dữ liệu không
 * @param hexagramNumber - Số quẻ cần kiểm tra
 * @returns true nếu tồn tại, false nếu không
 */
export function hasPrediction(hexagramNumber: string): boolean {
  const normalizedId = hexagramNumber.toString().trim();
  return predictionMap.has(normalizedId);
}

/**
 * Lấy thống kê về dữ liệu tiên tri
 * @returns Thông tin thống kê
 */
export function getPredictionStats() {
  return {
    total: validPredictions.length,
    totalInFile: dibocData.length,
    validPercentage: Math.round((validPredictions.length / dibocData.length) * 100),
    availableIds: Array.from(predictionMap.keys()).sort((a, b) => parseInt(a) - parseInt(b))
  };
}

// Export dữ liệu để sử dụng trong các component khác
export { validPredictions as DIBOC_PREDICTIONS };