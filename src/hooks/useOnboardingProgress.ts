import { useLocation } from 'react-router-dom';

// Определяем все шаги онбординга от goal/1 до statements/4
const ONBOARDING_STEPS = [
    // Goal steps (7 шагов)
    { route: '/goal/1', step: 1 },
    { route: '/goal/2', step: 2 },
    { route: '/goal/3', step: 3 },
    { route: '/goal/4', step: 4 },
    { route: '/goal/5', step: 5 },
    { route: '/goal/6', step: 6 },
    { route: '/goal/7', step: 7 },

    // User steps (7 шагов)
    { route: '/user/1', step: 8 },
    { route: '/user/2', step: 9 },
    { route: '/user/3', step: 10 },
    { route: '/user/4', step: 11 },
    { route: '/user/5', step: 12 },
    { route: '/user/6', step: 13 },
    { route: '/user/7', step: 14 },

    // Lifestyle steps (7 шагов)
    { route: '/lifestyle/1', step: 15 },
    { route: '/lifestyle/2', step: 16 },
    { route: '/lifestyle/3', step: 17 },
    { route: '/lifestyle/4', step: 18 },
    { route: '/lifestyle/5', step: 19 },
    { route: '/lifestyle/6', step: 20 },
    { route: '/lifestyle/7', step: 21 },

    // Statements steps (4 шага)
    { route: '/statements/1', step: 22 },
    { route: '/statements/2', step: 23 },
    { route: '/statements/3', step: 24 },
    { route: '/statements/4', step: 25 }
];

const TOTAL_STEPS = ONBOARDING_STEPS.length; // 25 шагов
const MAX_PROGRESS = 99; // Максимальный прогресс 99%

export const useOnboardingProgress = () => {
    const location = useLocation();

    // Находим текущий шаг
    const currentStepData = ONBOARDING_STEPS.find(step =>
        location.pathname === step.route
    );

    // Если не найден в основном списке, проверяем паттерны
    let currentStep = currentStepData?.step || 0;

    if (!currentStepData) {
        // Проверяем паттерны для случаев, когда точный маршрут не найден
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

    // Вычисляем прогресс (равномерное распределение от 0% до 99%)
    const progress = currentStep > 0 ? Math.round((currentStep / TOTAL_STEPS) * MAX_PROGRESS) : 0;

    // Проверяем, находимся ли мы в онбординге
    const isInOnboarding = currentStep > 0;

    return {
        progress,
        currentStep,
        totalSteps: TOTAL_STEPS,
        isInOnboarding
    };
};