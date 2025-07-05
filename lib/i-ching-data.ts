import * as data from './data111-888.json';

export interface Hexagram {
  id: string;
  name: string;
  description: string;
  meaning: string;
  details: string;
}

// The JSON data is on the 'default' property of the imported module.
const hexagramsData: Hexagram[] = (data as any).default;

export const getHexagramById = (id: string): Hexagram | undefined => {
  if (!Array.isArray(hexagramsData)) {
    return undefined;
  }
  return hexagramsData.find(hexagram => hexagram.id === id);
};

export const hexagrams: Hexagram[] = Array.isArray(hexagramsData) ? hexagramsData : [];

// Mapping from binary trigram representation to ID (1-8)
// Binary is read from bottom line to top line (lines[0] to lines[2])
// Yang = 1 (odd numbers), Yin = 0 (even numbers)
const trigramMapping: { [key: string]: number } = {
  '111': 1, // ☰ Càn
  '011': 2, // ☱ Đoài
  '101': 3, // ☲ Ly
  '001': 4, // ☳ Chấn
  '110': 5, // ☴ Tốn
  '010': 6, // ☵ Khảm
  '100': 7, // ☶ Cấn
  '000': 8, // ☷ Khôn
};

/**
 * Converts three lines (e.g., 6,7,8,9) to a trigram ID (1-8).
 * @param lines An array of three numbers representing the lines.
 * @returns The trigram ID number.
 */
const getTrigramId = (lines: number[]): number => {
  // Convert lines to binary (0 for yin, 1 for yang) and join to form a key.
  const binaryString = lines.map(line => line % 2).join('');
  return trigramMapping[binaryString] || 0;
};

/**
 * Finds a hexagram based on the six lines provided.
 * @param lines An array of six numbers (e.g., 6,7,8,9) representing the lines of the hexagram.
 * @returns The corresponding Hexagram object or undefined if not found.
 */
export const getHexagramByLines = (lines: number[]): Hexagram | undefined => {
  if (lines.length !== 6) {
    return undefined;
  }

  const lowerTrigramLines = lines.slice(0, 3);
  const upperTrigramLines = lines.slice(3, 6);

  const lowerTrigramId = getTrigramId(lowerTrigramLines);
  const upperTrigramId = getTrigramId(upperTrigramLines);

  if (!lowerTrigramId || !upperTrigramId) {
    return undefined;
  }

  // Constructs the hexagram ID based on the data's pattern (e.g., upper=2, lower=1 -> "221")
  const hexagramId = `${upperTrigramId}${upperTrigramId}${lowerTrigramId}`;

  return getHexagramById(hexagramId);
};

/**
 * Generates a random hexagram by creating six random lines.
 * @returns A random Hexagram object and the lines that generated it.
 */
export const generateRandomHexagram = (): { hexagram: Hexagram | undefined, lines: number[] } => {
  // A coin toss can result in values 6, 7, 8, or 9.
  const lines = Array.from({ length: 6 }, () => Math.floor(Math.random() * 4) + 6);
  const hexagram = getHexagramByLines(lines);
  return { hexagram, lines };
};
