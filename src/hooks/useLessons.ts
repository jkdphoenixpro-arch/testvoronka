import { useState, useEffect } from 'react';
import API_CONFIG from '../config/api';

export interface Lesson {
  id: number;
  category: string;
  title: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
  videoPreview: string;
  description: string;
  tipTitle: string;
  tipText: string;
}

const API_BASE_URL = API_CONFIG.BASE_URL;

export const useLessons = () => {
  const [lessons, setLessons] = useState<Record<number, Lesson>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/lessons`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить уроки');
      }
      const data = await response.json();
      setLessons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return { lessons, loading, error, refetch: fetchLessons };
};

export const useLesson = (id: number) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLesson = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/lesson/${id}`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить урок');
      }
      const data = await response.json();
      setLesson(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLesson();
    }
  }, [id]);

  return { lesson, loading, error, refetch: fetchLesson };
};