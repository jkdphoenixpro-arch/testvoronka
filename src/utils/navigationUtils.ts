const ONBOARDING_STEPS = [
  'goal/1', 'goal/2', 'goal/3', 'goal/4', 'goal/5', 'goal/6', 'goal/7',
  'user/1', 'user/2', 'user/3', 'user/4', 'user/5', 'user/6', 'user/7',
  'lifestyle/1', 'lifestyle/2', 'lifestyle/3', 'lifestyle/4', 'lifestyle/5', 'lifestyle/6', 'lifestyle/7',
  'statements/1', 'statements/2', 'statements/3', 'statements/4',
  'buildingplan/1',
  'results',
  'enteremail',
  'paywall'
];

export function getPreviousStep(currentPath: string): string | null {
  const cleanPath = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;
  
  const currentIndex = ONBOARDING_STEPS.indexOf(cleanPath);
  
  if (currentIndex === -1) {
    console.warn(`Неизвестный этап: ${cleanPath}`);
    return null;
  }
  
  if (currentIndex === 0) {
    return null;
  }
  
  const previousStep = ONBOARDING_STEPS[currentIndex - 1];
  return `/${previousStep}`;
}

export function getNextStep(currentPath: string): string | null {
  const cleanPath = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;
  
  const currentIndex = ONBOARDING_STEPS.indexOf(cleanPath);
  
  if (currentIndex === -1) {
    console.warn(`Неизвестный этап: ${cleanPath}`);
    return null;
  }
  
  if (currentIndex === ONBOARDING_STEPS.length - 1) {
    return null;
  }
  
  const nextStep = ONBOARDING_STEPS[currentIndex + 1];
  return `/${nextStep}`;
}

export function isValidOnboardingStep(path: string): boolean {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return ONBOARDING_STEPS.includes(cleanPath);
}

export function getStepIndex(path: string): number {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return ONBOARDING_STEPS.indexOf(cleanPath);
}

export function getAllSteps(): string[] {
  return [...ONBOARDING_STEPS];
}