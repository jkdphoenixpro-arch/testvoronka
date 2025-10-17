import { useLocation } from 'react-router-dom';


const ONBOARDING_STEPS = [

    { route: '/goal/1', step: 1 },
    { route: '/goal/2', step: 2 },
    { route: '/goal/3', step: 3 },
    { route: '/goal/4', step: 4 },
    { route: '/goal/5', step: 5 },
    { route: '/goal/6', step: 6 },
    { route: '/goal/7', step: 7 },


    { route: '/user/1', step: 8 },
    { route: '/user/2', step: 9 },
    { route: '/user/3', step: 10 },
    { route: '/user/4', step: 11 },
    { route: '/user/5', step: 12 },
    { route: '/user/6', step: 13 },
    { route: '/user/7', step: 14 },


    { route: '/lifestyle/1', step: 15 },
    { route: '/lifestyle/2', step: 16 },
    { route: '/lifestyle/3', step: 17 },
    { route: '/lifestyle/4', step: 18 },
    { route: '/lifestyle/5', step: 19 },
    { route: '/lifestyle/6', step: 20 },
    { route: '/lifestyle/7', step: 21 },


    { route: '/statements/1', step: 22 },
    { route: '/statements/2', step: 23 },
    { route: '/statements/3', step: 24 },
    { route: '/statements/4', step: 25 }
];

const TOTAL_STEPS = ONBOARDING_STEPS.length;
const MAX_PROGRESS = 99;

export const useOnboardingProgress = () => {
    const location = useLocation();


    const currentStepData = ONBOARDING_STEPS.find(step =>
        location.pathname === step.route
    );

    let currentStep = currentStepData?.step || 0;

    if (!currentStepData) {

        if (location.pathname.startsWith('/goal/')) {
            const stepId = parseInt(location.pathname.split('/')[2]);
            if (stepId >= 1 && stepId <= 7) {
                currentStep = stepId;
            }
        } else if (location.pathname.startsWith('/user/')) {
            const stepId = parseInt(location.pathname.split('/')[2]);
            if (stepId >= 1 && stepId <= 7) {
                currentStep = 7 + stepId;
            }
        } else if (location.pathname.startsWith('/lifestyle/')) {
            const stepId = parseInt(location.pathname.split('/')[2]);
            if (stepId >= 1 && stepId <= 7) {
                currentStep = 14 + stepId;
            }
        } else if (location.pathname.startsWith('/statements/')) {
            const stepId = parseInt(location.pathname.split('/')[2]);
            if (stepId >= 1 && stepId <= 4) {
                currentStep = 21 + stepId;
            }
        }
    }


    // Расчет прогресса: первые 6 этапов = 30%, оставшиеся 19 этапов = 30%-99%
    let progress = 0;
    if (currentStep > 0) {
        if (currentStep <= 6) {
            // Первые 6 этапов: от 0% до 30%
            progress = Math.round((currentStep / 6) * 30);
        } else {
            // Оставшиеся 19 этапов: от 30% до 99%
            const remainingSteps = currentStep - 6;
            const remainingTotal = TOTAL_STEPS - 6;
            progress = 30 + Math.round((remainingSteps / remainingTotal) * (MAX_PROGRESS - 30));
        }
    }


    const isInOnboarding = currentStep > 0;

    return {
        progress,
        currentStep,
        totalSteps: TOTAL_STEPS,
        isInOnboarding
    };
};