import axios from 'axios';
import { imageHash } from 'imghash';
import exifParser from 'exif-parser';
import { getDistance } from 'geolib';
import { config } from '../config';
import { prisma } from '../utils/prisma';

export interface AIReviewResult {
  status: 'VERIFIED' | 'REJECTED' | 'FLAGGED';
  confidence: number;
  details: string;
  reasons: string[];
}

export const analyzeImage = async (
  imageUrl: string,
  category: string,
  latitude: number,
  longitude: number,
  userId: string
): Promise<AIReviewResult> => {
  const reasons: string[] = [];
  let confidence = 100;

  try {
    const visionAnalysis = await analyzeWithVision(imageUrl, category);
    confidence = visionAnalysis.confidence;
    reasons.push(visionAnalysis.description);

    if (visionAnalysis.confidence < 40) {
      return {
        status: 'REJECTED',
        confidence,
        details: visionAnalysis.description,
        reasons: ['Content does not match environmental activity', ...reasons],
      };
    }

    const isDuplicate = await checkDuplicate(imageUrl, userId);
    if (isDuplicate) {
      confidence -= 30;
      reasons.push('Similar image detected in recent submissions');
    }

    const metadataValid = await validateMetadata(imageUrl, latitude, longitude);
    if (!metadataValid) {
      confidence -= 20;
      reasons.push('Image metadata inconsistent with location');
    }

    const categoryMatch = await verifyCategoryMatch(visionAnalysis.labels, category);
    if (!categoryMatch) {
      confidence -= 25;
      reasons.push('Image content does not match selected category');
    }

    if (confidence >= 75) {
      return {
        status: 'VERIFIED',
        confidence,
        details: visionAnalysis.description,
        reasons,
      };
    } else if (confidence >= 40) {
      return {
        status: 'FLAGGED',
        confidence,
        details: visionAnalysis.description,
        reasons: ['Requires manual review', ...reasons],
      };
    } else {
      return {
        status: 'REJECTED',
        confidence,
        details: visionAnalysis.description,
        reasons: ['Low confidence score', ...reasons],
      };
    }
  } catch (error) {
    console.error('AI Review Error:', error);
    return {
      status: 'FLAGGED',
      confidence: 50,
      details: 'Error during AI analysis',
      reasons: ['Manual review required due to processing error'],
    };
  }
};

const analyzeWithVision = async (
  imageUrl: string,
  category: string
): Promise<{ confidence: number; description: string; labels: string[] }> => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image for environmental activity verification. The user claims this is "${category}". 
              
              Please evaluate:
              1. Is this showing genuine environmental activity (tree planting, cleaning, waste management, etc.)?
              2. Does the content match the category "${category}"?
              3. Are there signs of AI generation or manipulation?
              4. Rate confidence 0-100 that this is authentic environmental work.
              
              Respond in JSON format: {"confidence": number, "description": string, "labels": [string]}`,
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 500,
    },
    {
      headers: {
        'Authorization': `Bearer ${config.openai.apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = response.data.choices[0].message.content;
  const parsed = JSON.parse(content);

  return {
    confidence: parsed.confidence || 50,
    description: parsed.description || 'Analysis completed',
    labels: parsed.labels || [],
  };
};

const checkDuplicate = async (imageUrl: string, userId: string): Promise<boolean> => {
  try {
    const hash = await imageHash(imageUrl, 16, 'hex');

    const recentSubmissions = await prisma.submission.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: { imageHash: true },
    });

    for (const submission of recentSubmissions) {
      if (submission.imageHash) {
        const similarity = calculateHashSimilarity(hash, submission.imageHash);
        if (similarity > 0.9) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Duplicate check error:', error);
    return false;
  }
};

const calculateHashSimilarity = (hash1: string, hash2: string): number => {
  let matches = 0;
  const length = Math.min(hash1.length, hash2.length);

  for (let i = 0; i < length; i++) {
    if (hash1[i] === hash2[i]) matches++;
  }

  return matches / length;
};

const validateMetadata = async (
  imageUrl: string,
  latitude: number,
  longitude: number
): Promise<boolean> => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    const parser = exifParser.create(buffer);
    const result = parser.parse();

    if (result.tags?.GPSLatitude && result.tags?.GPSLongitude) {
      const exifLat = result.tags.GPSLatitude;
      const exifLon = result.tags.GPSLongitude;

      const distance = getDistance(
        { latitude, longitude },
        { latitude: exifLat, longitude: exifLon }
      );

      return distance < 5000;
    }

    return true;
  } catch (error) {
    return true;
  }
};

const verifyCategoryMatch = async (
  labels: string[],
  category: string
): Promise<boolean> => {
  const categoryKeywords: Record<string, string[]> = {
    'Tree Planting': ['tree', 'plant', 'sapling', 'forest', 'garden', 'soil'],
    'Waste Collection': ['waste', 'trash', 'garbage', 'litter', 'plastic', 'bag'],
    'River Cleaning': ['river', 'water', 'stream', 'canal', 'cleaning', 'pollution'],
    'Recycling': ['recycle', 'bottle', 'plastic', 'paper', 'container', 'sorting'],
    'Awareness Campaign': ['people', 'group', 'banner', 'poster', 'crowd', 'event'],
  };

  const keywords = categoryKeywords[category] || [];
  const labelsLower = labels.map(l => l.toLowerCase());

  return keywords.some(keyword => 
    labelsLower.some(label => label.includes(keyword))
  );
};
