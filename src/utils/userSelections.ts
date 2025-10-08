// Утилиты для работы с выборами пользователя

export interface UserSelections {
  goal: {
    page3?: string;  // goal/3 - primary goal
    page5?: string;  // goal/5 - what would you want to feel
  };
  issueAreas: {
    user1?: string[];  // user/1 - face areas (до 3 опций)
    user2?: string[];  // user/2 - body areas (до 3 опций)  
    user3?: string[];  // user/3 - flexibility areas (до 3 опций)
  };
}

// Ключ для localStorage
const STORAGE_KEY = 'ageBack_userSelections';

// Получить сохраненные выборы пользователя
export const getUserSelections = (): UserSelections => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Ошибка при загрузке выборов пользователя:', error);
  }
  
  return {
    goal: {},
    issueAreas: {}
  };
};

// Сохранить выбор для goal страницы
export const saveGoalSelection = (page: 'page3' | 'page5', value: string) => {
  const selections = getUserSelections();
  selections.goal[page] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
};

// Сохранить выборы для user страницы (issue areas)
export const saveIssueAreaSelections = (page: 'user1' | 'user2' | 'user3', values: string[]) => {
  const selections = getUserSelections();
  selections.issueAreas[page] = values;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
};

// Получить все выбранные цели
export const getSelectedGoals = (): string[] => {
  const selections = getUserSelections();
  const goals: string[] = [];
  
  if (selections.goal.page3) {
    goals.push(selections.goal.page3);
  }
  if (selections.goal.page5) {
    goals.push(selections.goal.page5);
  }
  
  return goals;
};

// Получить все выбранные проблемные зоны
export const getSelectedIssueAreas = (): string[] => {
  const selections = getUserSelections();
  const issueAreas: string[] = [];
  
  // Объединяем все выборы из user/1, user/2, user/3
  if (selections.issueAreas.user1) {
    issueAreas.push(...selections.issueAreas.user1);
  }
  if (selections.issueAreas.user2) {
    issueAreas.push(...selections.issueAreas.user2);
  }
  if (selections.issueAreas.user3) {
    issueAreas.push(...selections.issueAreas.user3);
  }
  
  return issueAreas;
};

// Очистить все выборы (для отладки или сброса)
export const clearUserSelections = () => {
  localStorage.removeItem(STORAGE_KEY);
};