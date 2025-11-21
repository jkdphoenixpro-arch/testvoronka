export interface UserSelections {
  goal: {
    page3?: string;
    page5?: string;
    goalNew6?: string;
  };
  issueAreas: {
    user1?: string[];
    user2?: string[];
    user3?: string[];
  };
  challenges: {
    userNew1?: string[];
    userNew3?: string[];
    userNew5?: string[];
  };
}

const STORAGE_KEY = 'ageBack_userSelections';

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
    issueAreas: {},
    challenges: {}
  };
};

export const saveGoalSelection = (page: string, value: string) => {
  const selections = getUserSelections();
  // Приводим к типу ключа
  const key = page as 'page3' | 'page5';
  selections.goal[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
};

export const saveIssueAreaSelections = (page: string, values: string[]) => {
  const selections = getUserSelections();
  // Приводим к типу ключа
  const key = page as 'user1' | 'user2' | 'user3';
  selections.issueAreas[key] = values;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
};

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

export const getSelectedIssueAreas = (): string[] => {
  const selections = getUserSelections();
  const issueAreas: string[] = [];
  
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

export const saveChallengeSelections = (page: string, values: string[]) => {
  const selections = getUserSelections();
  const key = page as 'userNew1' | 'userNew3' | 'userNew5';
  selections.challenges[key] = values;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
};

export const getAllChallenges = (): string[] => {
  const selections = getUserSelections();
  const challenges: string[] = [];
  
  if (selections.challenges?.userNew1) {
    challenges.push(...selections.challenges.userNew1);
  }
  if (selections.challenges?.userNew3) {
    challenges.push(...selections.challenges.userNew3);
  }
  if (selections.challenges?.userNew5) {
    challenges.push(...selections.challenges.userNew5);
  }
  
  return challenges;
};

export const getAgeGroup = (): string => {
  const selections = getUserSelections();
  return selections.goal.page3 || '30s';
};

export const getMotivation = (): string => {
  const selections = getUserSelections();
  return selections.goal.goalNew6 || 'Feel confident';
};

export const clearUserSelections = () => {
  localStorage.removeItem(STORAGE_KEY);
};