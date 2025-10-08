// Простой тестовый файл для проверки функций навигации
const { getPreviousStep, getNextStep, isValidOnboardingStep, getStepIndex } = require('./navigationUtils.ts');

// Тестовые случаи
console.log('=== Тестирование функций навигации ===\n');

// Тест getPreviousStep
console.log('Тестирование getPreviousStep:');
console.log('goal/3 -> ', getPreviousStep('goal/3')); // Ожидается: /goal/2
console.log('/goal/3 -> ', getPreviousStep('/goal/3')); // Ожидается: /goal/2
console.log('goal/6 -> ', getPreviousStep('goal/6')); // Ожидается: /goal/5 (даже если пользователь перешел напрямую)
console.log('user/1 -> ', getPreviousStep('user/1')); // Ожидается: /goal/7
console.log('buildingplan/1 -> ', getPreviousStep('buildingplan/1')); // Ожидается: /statements/4
console.log('results -> ', getPreviousStep('results')); // Ожидается: /buildingplan/1
console.log('goal/1 -> ', getPreviousStep('goal/1')); // Ожидается: null (первый этап)
console.log('неизвестный -> ', getPreviousStep('неизвестный/этап')); // Ожидается: null
console.log('');

// Тест getNextStep
console.log('Тестирование getNextStep:');
console.log('goal/3 -> ', getNextStep('goal/3')); // Ожидается: /goal/4
console.log('goal/7 -> ', getNextStep('goal/7')); // Ожидается: /user/1
console.log('paywall -> ', getNextStep('paywall')); // Ожидается: null (последний этап)
console.log('');

// Тест isValidOnboardingStep
console.log('Тестирование isValidOnboardingStep:');
console.log('goal/3 валиден? ', isValidOnboardingStep('goal/3')); // Ожидается: true
console.log('/goal/3 валиден? ', isValidOnboardingStep('/goal/3')); // Ожидается: true
console.log('неизвестный валиден? ', isValidOnboardingStep('неизвестный/этап')); // Ожидается: false
console.log('');

// Тест getStepIndex
console.log('Тестирование getStepIndex:');
console.log('goal/1 индекс: ', getStepIndex('goal/1')); // Ожидается: 0
console.log('goal/3 индекс: ', getStepIndex('goal/3')); // Ожидается: 2
console.log('user/1 индекс: ', getStepIndex('user/1')); // Ожидается: 7
console.log('paywall индекс: ', getStepIndex('paywall')); // Ожидается: 27 (последний)
console.log('');

console.log('=== Особые случаи ===');
console.log('Если пользователь был на goal/3 и напрямую перешел на goal/6:');
console.log('goal/6 -> ', getPreviousStep('goal/6')); // Должен вернуться на goal/5, а не на goal/3

console.log('\nТестирование завершено!');