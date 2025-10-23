export interface UserSelections {
  goal: {
    page3?: string;
    page5?: string;
  };
  issueAreas: {
    user1?: string[];
    user2?: string[];
    user3?: string[];
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
    issueAreas: {}
  };
};

export const saveGoalSelection = (page: 'page3' | 'page5', value: string) => {
  const selections = getUserSelections();
  selections.goal[page] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
};

export const saveIssueAreaSelections = (page: 'user1' | 'user2' | 'user3', values: string[]) => {
  const selections = getUserSelections();
  selections.issueAreas[page] = values;
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

export const clearUserSelections = () => {
  localStorage.removeItem(STORAGE_KEY);
};