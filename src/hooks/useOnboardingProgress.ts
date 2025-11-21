import { useLocation } from 'react-router-dom';


import { getStepIndexByRoute, getTotalSteps, isValidOnboardingStep } from '../config/onboardingConfig';

const MAX_PROGRESS = 99;

export const useOnboardingProgress = () => {
    const location = useLocation();


    // Индекс текущего шага из централизованного конфига
    let currentStep = 0;
    if (isValidOnboardingStep(location.pathname)) {
        currentStep = getStepIndexByRoute(location.pathname) + 1;
    }

    const totalSteps = getTotalSteps();

    // Расчет прогресса: первые 6 этапов = 30%, оставшиеся шаги = 30%-99%
    let progress = 0;
    if (currentStep > 0) {
        if (currentStep <= 6) {
            progress = Math.round((currentStep / 6) * 30);
        } else {
            const remainingSteps = currentStep - 6;
            const remainingTotal = totalSteps - 6;
            progress = 30 + Math.round((remainingSteps / remainingTotal) * (MAX_PROGRESS - 30));
        }
    }

    const isInOnboarding = currentStep > 0;

    return {
        progress,
        currentStep,
        totalSteps,
        isInOnboarding
    };
};