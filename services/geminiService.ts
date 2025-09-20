
import { GoogleGenAI, Type } from "@google/genai";
import { DetectedAnswers, AnswerKey, OMRResult, SubjectScores, Notification } from '../types';
import { SUBJECTS, ANSWER_KEYS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// This function now returns the raw detected answers
export const evaluateOMRWithGemini = async (imageFile: File): Promise<DetectedAnswers> => {
  const imagePart = await fileToGenerativePart(imageFile);

  const properties: { [key: string]: any } = {};
  for (let i = 1; i <= 100; i++) {
    properties[i.toString()] = {
      type: Type.STRING,
      description: `The marked answer for question ${i}. Should be 'A', 'B', 'C', 'D', or 'E'. If unmarked, return an empty string.`,
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            text: `You are an expert OMR (Optical Mark Recognition) sheet evaluation system.
            Your task is to analyze the following image of an OMR sheet and determine which bubble is marked for each question.
            The sheet has 100 questions.
            For each question from 1 to 100, identify the marked option ('A', 'B', 'C', 'D', or 'E').
            If a question has no mark or multiple marks, consider it unanswered and return an empty string for it.
            Respond ONLY with a single, valid JSON object that strictly adheres to the provided schema. Do not include any text before or after the JSON object.`
          },
          imagePart
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          answers: {
            type: Type.OBJECT,
            properties: properties,
          },
        },
        required: ['answers'],
      },
    },
  });

  const jsonText = response.text.trim();
  const result = JSON.parse(jsonText);
  return result.answers as DetectedAnswers;
};


export const calculateScores = (
    detectedAnswers: DetectedAnswers, 
    answerKey: AnswerKey,
    imageFileName: string,
    answerKeyId: string,
    evaluationName: string
): OMRResult => {
  const subjectScores: SubjectScores = {};
  let totalScore = 0;

  for (const subjectName in SUBJECTS) {
    const { start, end } = SUBJECTS[subjectName];
    let subjectCorrect = 0;
    for (let i = start; i <= end; i++) {
      if (detectedAnswers[i] && detectedAnswers[i] === answerKey[i]) {
        subjectCorrect++;
      }
    }
    subjectScores[subjectName] = { score: subjectCorrect, total: end - start + 1 };
    totalScore += subjectCorrect;
  }
  
  return {
    id: `res_${new Date().getTime()}`,
    evaluationName: evaluationName || '',
    imageFileName,
    evaluationDate: new Date().toISOString(),
    totalScore,
    subjectScores,
    detectedAnswers,
    answerKeyId,
  };
};

export const saveResultToLocalStorage = (result: OMRResult) => {
    const results = getResultsFromLocalStorage();
    results.unshift(result);
    localStorage.setItem('evalify_results', JSON.stringify(results));
};

export const getResultsFromLocalStorage = (): OMRResult[] => {
    const resultsJson = localStorage.getItem('evalify_results');
    try {
      return resultsJson ? JSON.parse(resultsJson) : [];
    } catch (e) {
      return [];
    }
};

// --- Answer Key Service ---
const CUSTOM_ANSWER_KEYS_KEY = 'evalify_custom_answer_keys';

export const getCustomAnswerKeys = (): { [key: string]: AnswerKey } => {
    const keysJson = localStorage.getItem(CUSTOM_ANSWER_KEYS_KEY);
    try {
        return keysJson ? JSON.parse(keysJson) : {};
    } catch (e) {
        return {};
    }
};

export const saveCustomAnswerKey = (name: string, key: AnswerKey) => {
    if (!name.trim()) {
        throw new Error("Answer key name cannot be empty.");
    }
    const customKeys = getCustomAnswerKeys();
    if (Object.keys(ANSWER_KEYS).includes(name)) {
        throw new Error(`Cannot overwrite default answer key: ${name}`);
    }
    customKeys[name] = key;
    localStorage.setItem(CUSTOM_ANSWER_KEYS_KEY, JSON.stringify(customKeys));
};

export const getAllAnswerKeys = (): { [key:string]: AnswerKey } => {
    const customKeys = getCustomAnswerKeys();
    return { ...ANSWER_KEYS, ...customKeys };
};


// --- Notification Service ---
const NOTIFICATION_KEY = 'evalify_notifications';

export const getNotifications = (): Notification[] => {
    const notificationsJson = localStorage.getItem(NOTIFICATION_KEY);
    try {
        const notifications = notificationsJson ? JSON.parse(notificationsJson) : [];
        return notifications.sort((a: Notification, b: Notification) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
        return [];
    }
};

export const addNotification = (notificationData: { type: 'success' | 'info'; message: string; }) => {
    const notifications = getNotifications();
    const newNotification: Notification = {
        id: `notif_${new Date().getTime()}`,
        timestamp: new Date().toISOString(),
        read: false,
        ...notificationData,
    };
    notifications.unshift(newNotification);
    const trimmedNotifications = notifications.slice(0, 20); // Keep last 20 notifications
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(trimmedNotifications));
    window.dispatchEvent(new Event('notifications-updated'));
};

export const markAllNotificationsAsRead = (): void => {
    const notifications = getNotifications();
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updatedNotifications));
    window.dispatchEvent(new Event('notifications-updated'));
};

export const hasUnreadNotifications = (): boolean => {
    return getNotifications().some(n => !n.read);
};