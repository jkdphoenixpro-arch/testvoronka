/**
 * Централизованная конфигурация онбординга
 * Все страницы и их настройки в одном месте для удобной реорганизации
 */

// Типы и интерфейсы
export interface OnboardingOption {
  value: string;
  text: string;
  icon?: string;
  selected?: boolean;
  width?: string; // для pill-кнопок (например, 'pill-w120')
}

export interface TestimonialItem {
  percentage?: string;
  description: string;
  author?: string;
  age?: string;
  rating?: string;
}

export interface StepItem {
  icon: string;             // Путь к иконке
  title: string;            // Заголовок шага
  description: string;      // Описание шага
}

export interface OnboardingStep {
  // Идентификация
  id: string;                    // Уникальный ID шага
  route: string;                 // URL путь

  // Навигация
  nextStepId?: string;           // ID следующего шага

  // Тип страницы
  pageType: 'splash' | 'single-select' | 'multi-select' |
  'testimonial-grid' | 'testimonial-advanced' |
  'chart' | 'info' | 'scale' | 'multi-pill' | 'steps-info' | 'testimonial-with-logos';

  // Контент
  title?: string;                 // Опционально для scale типа
  subtitle?: string;
  description?: string;
  question?: string;              // Для statements
  statement?: string;             // Для statements

  // Опции для выбора
  options?: OnboardingOption[];

  // Настройки поведения
  isMultiSelect?: boolean;
  maxSelections?: number;         // Максимум выборов для multi-select
  autoNavigate?: boolean;         // Автопереход после выбора
  autoNavigateDelay?: number;     // Задержка перед автопереходом (ms)
  showContinueButton?: boolean;

  // Ресурсы
  imageSrc?: string;              // Основное изображение
  imagesToPreload?: string[];     // Изображения для предзагрузки
  animationName?: string;         // Имя анимации для Lottie
  chartImage?: string;
  infoText?: string;              // Текст для info-block
  infoIcon?: string;              // Иконка для info-block

  // Данные для testimonial
  testimonials?: TestimonialItem[];
  bottomText?: string;                // Дополнительный текст под testimonials

  // Данные для steps-info
  steps?: StepItem[];

  // Стили - сохраняем существующие классы для совместимости
  legacyClassName?: string;       // Старый класс (goal-page-1, user-step-2 и т.д.)
  stepClass?: string;             // Класс для шага

  // Сохранение данных
  saveKey?: string;               // Ключ для сохранения выбора пользователя
}

/**
 * Полный список всех страниц онбординга в порядке следования
 * Изменяйте порядок здесь для реорганизации флоу
 */
export const onboardingSteps: OnboardingStep[] = [
  // ==================== GOAL СЕКЦИЯ ====================
  {
    id: 'goal-1',
    route: '/goal/1',
    pageType: 'splash',
    title: 'Turn back time!<br />Rewind visible age with just 15<br />minutes a day',
    subtitle: 'Discover a science-based method to help you look and feel up to 10 years younger, naturally.',
    imagesToPreload: [],
    nextStepId: 'goal-2',
    legacyClassName: 'goal-page-1',
  },

  {
    id: 'goal-2',
    route: '/goal/2',
    pageType: 'single-select',
    title: 'How old do you feel right now?',
    subtitle: 'Sometimes your body tells the truth better than the calendar.',
    options: [
      { value: '18-25', text: 'Much younger (−10 yrs)' },
      { value: '26-35', text: 'Slightly younger (−5 yrs)' },
      { value: '36-45', text: 'About my age' },
      { value: '46-55', text: 'A bit older (+5 yrs)' },
      { value: '56+', text: 'Much older (+10 yrs)' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: [],
    nextStepId: 'goal-3',
    legacyClassName: 'goal-page-2',
  },

  {
    id: 'goal-3',
    route: '/goal/3',
    pageType: 'single-select',
    title: "What's your actual age today?",
    subtitle: 'Your age helps us create a rewind path that fits your body.',
    options: [
      { value: '20s', text: '18–29' },
      { value: '30s', text: '30–39' },
      { value: '40s', text: '40-49' },
      { value: '50s', text: '50-59' },
      { value: '60s', text: '60+' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    saveKey: 'page3',
    imagesToPreload: [],
    nextStepId: 'goal-4new',  // Изменено: теперь ведет на goal-4new
    legacyClassName: 'goal-page-3',
  },

  // НОВАЯ СТРАНИЦА goal-4new с single-select
  {
    id: 'goal-4new',
    route: '/goal/new4',
    pageType: 'single-select',
    title: 'How far do you dream to rewind?',
    subtitle: 'Choose the result that feels both realistic and inspiring.',
    options: [
      { value: '2-3 years', text: '2 – 3 years' },
      { value: '5 years', text: '5 years' },
      { value: '7 – 8 years', text: '7 – 8 years' },
      { value: '10 years', text: '10 years' },
      { value: 'Not sure yet', text: 'Not sure yet' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: ['/image/age-rewind.webp', '/image/info-icon.svg'],
    nextStepId: 'goal-5new',
    legacyClassName: 'goal-page-4',
  },

  // НОВАЯ СТРАНИЦА goal-5new с типом chart (статичное изображение)
  {
    id: 'goal-5new',
    route: '/goal/new5',
    pageType: 'chart',
    title: 'Your real age is just a number. Your visible age can move backward!',
    subtitle: 'Age Back™ helps you visibly rewind your appearance and bring back your natural vitality within weeks.',
    chartImage: '/image/age-rewind.webp',
    infoText: 'Measured on <strong>500K+ Age Back</strong> users over 12 weeks of consistent practice. Your journey can start today.',
    infoIcon: '/image/info-icon.svg',
    showContinueButton: true,
    imagesToPreload: [],
    nextStepId: 'goal-6new',
    legacyClassName: 'goal-page-new5',
  },

  // НОВАЯ СТРАНИЦА goal-6new с single-select
  {
    id: 'goal-6new',
    route: '/goal/new6',
    pageType: 'single-select',
    title: 'What’s your real reason for turning back time?',
    subtitle: 'Pick what matters most to you right now. We’ll personalize your journey around it.',
    options: [
      { value: 'Look younger', text: 'Look younger and refresh skin tone' },
      { value: 'Improve body', text: 'Improve body & shape' },
      { value: 'Feel strong', text: 'Feel strong & energized' },
      { value: 'Move freely', text: 'Move freely and without stiffness' },
      { value: 'Feel confident', text: 'Feel confident again' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    saveKey: 'goalNew6',
    imagesToPreload: [],
    nextStepId: 'goal-7new',
    legacyClassName: 'goal-page-2',
  },
  // НОВАЯ СТРАНИЦА goal-7new с single-select
  {
    id: 'goal-7new',
    route: '/goal/new7',
    pageType: 'single-select',
    title: 'Do you ever feel the mirror shows someone older?',
    subtitle: 'Many people feel that way. That\'s where Age Back begins.',
    options: [
      { value: 'option-1', text: 'No, I see my true self' },
      { value: 'option-2', text: 'Maybe small changes' },
      { value: 'option-3', text: 'Sometimes, depends on the day' },
      { value: 'option-4', text: 'Often, I look older than I feel' },
      { value: 'option-5', text: 'Yes, I want my real reflection back' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: ['/image/rating.svg', '/image/znak.svg'],
    nextStepId: 'goal-8new',
    legacyClassName: 'goal-page-3',
  },

  // НОВАЯ СТРАНИЦА goal-8new (bывшая goal-6) - testimonial-grid
  {
    id: 'goal-8new',
    route: '/goal/new8',
    pageType: 'testimonial-grid',
    title: 'Real results. Real science.<br>Now it’s your turn.',
    subtitle: '500,000+ users have already turned back time with Age Back™, restoring posture, tone, and<br>energy in just minutes a day.',
    showContinueButton: true,
    testimonials: [],
    imagesToPreload: ['/image/clock-icon.svg', '/image/lamp-icon.svg', '/image/flash-icon.svg', '/image/rewind-icon.svg'],
    nextStepId: 'goal-9new',
    legacyClassName: 'goal-page-6',
  },

  // НОВАЯ СТРАНИЦА goal-9new - steps-info
  {
    id: 'goal-9new',
    route: '/goal/new9',
    pageType: 'steps-info',
    title: 'Ready to see where your youth begins to rewind?',
    showContinueButton: true,
    steps: [
      {
        icon: '/image/clock-icon.svg',
        title: 'Discover rewind potential',
        description: 'See how far your body can truly turn back time'
      },
      {
        icon: '/image/lamp-icon.svg',
        title: 'Spot hidden aging',
        description: 'Identify the areas that show early signs'
      },
      {
        icon: '/image/flash-icon.svg',
        title: 'Reactivate your youth zones',
        description: 'Reveal where your youth is simply paused'
      },
      {
        icon: '/image/rewind-icon.svg',
        title: 'Start your transformation',
        description: 'Get your personalized action plan'
      }
    ],
    imagesToPreload: [
      '/image/wrinkles&finelines.webp',
      '/image/puffiness&darkcircles.webp',
      '/image/jawline&doublechin.webp',
      '/image/neck&venusrings.webp',
      '/image/skintone&firmness.webp'
    ],
    nextStepId: 'user-new1',
    legacyClassName: 'goal-page-new9',
  },

  // Страница user-new1 (бывшая goal-4)
  {
    id: 'user-new1',
    route: '/user/new1',
    pageType: 'multi-select',
    title: 'Which areas of your face would you refresh first?',
    subtitle: 'Select up to 3 zones that feel tired or puffy.',
    isMultiSelect: true,
    showContinueButton: true,
    maxSelections: 3,
    options: [
      { value: 'Wrinkles & fine lines', text: 'Wrinkles & fine lines', icon: 'wrinkles&finelines', selected: false },
      { value: 'Puffiness & dark circles', text: 'Puffiness & dark circles', icon: 'puffiness&darkcircles', selected: false },
      { value: 'Jawline & double chin', text: 'Jawline & double chin', icon: 'jawline&doublechin', selected: false },
      { value: 'Neck & venus rings', text: 'Neck & venus rings', icon: 'neck&venusrings', selected: false },
      { value: 'Skin tone & firmness', text: 'Skin tone & firmness', icon: 'skintone&firmness', selected: false }
    ],
    saveKey: 'userNew1',
    imagesToPreload: [
      '/image/face-exploration.webp',
      '/image/Emblem2085663749.svg'
    ],
    nextStepId: 'user-new2',
    legacyClassName: 'goal-page-4',
  },

  // НОВАЯ СТРАНИЦА user/new2 с типом chart
  {
    id: 'user-new2',
    route: '/user/new2',
    pageType: 'chart',
    title: 'Your glow fades from stress. <br> Age Back brings it back.',
    subtitle: 'Stress and daily habits tighten your face and slow circulation. Age Back™ helps release tension and bring back your natural glow.',
    chartImage: '/image/face-exploration.webp',
    infoText: 'Research by Harvard Medical School shows: neuromuscular activation can visibly <strong>lift facial tone by up to 23 %</strong> in 21 days',
    infoIcon: '/image/Emblem2085663749.svg',
    showContinueButton: true,
    imagesToPreload: [
      '/image/slouching&neckhump.webp',
      '/image/chestfirmness&shape.webp',
      '/image/belly&bodyshape.webp',
      '/image/flattenedglutes_softerhips.webp',
      '/image/muscletoneloss.webp'
    ],
    nextStepId: 'user-new3',
    legacyClassName: 'user-step-new2',
  },

  // НОВАЯ СТРАНИЦА user/new3 с multi-select
  {
    id: 'user-new3',
    route: '/user/new3',
    pageType: 'multi-select',
    title: 'Where do you feel your body holding time?',
    subtitle: 'Select up to 3 areas that feel tense.',
    isMultiSelect: true,
    showContinueButton: true,
    maxSelections: 3,
    options: [
      { value: 'Slouching & neck hump', text: 'Slouching & neck hump', icon: 'slouching&neckhump', selected: false },
      { value: 'Chest firmness & shape', text: 'Chest firmness & shape', icon: 'chestfirmness&shape', selected: false },
      { value: 'Belly & body shape', text: 'Belly & body shape', icon: 'belly&bodyshape', selected: false },
      { value: 'Flattened glutes / softer hips', text: 'Flattened glutes / softer hips', icon: 'flattenedglutes_softerhips', selected: false },
      { value: 'Muscle tone loss', text: 'Muscle tone loss', icon: 'muscletoneloss', selected: false }
    ],
    saveKey: 'userNew3',
    imagesToPreload: [
      '/image/body-exploration.webp',
      '/image/purple-heart.svg'
    ],
    nextStepId: 'user-new4',
    legacyClassName: 'goal-page-4',
  },

  // НОВАЯ СТРАНИЦА user/new4 с типом chart
  {
    id: 'user-new4',
    route: '/user/new4',
    pageType: 'chart',
    title: 'Every centimeter you lift your posture turns back time!',
    subtitle: 'Tension speeds up visible aging. Age Back™ reactivates your natural flow to restore strength and motion.',
    chartImage: '/image/body-exploration.webp',
    infoText: 'Results with Age Back:<br> <strong>84 % of users</strong> noticed visible lift and lighter movement after just 3 weeks',
    infoIcon: '/image/purple-heart.svg',
    showContinueButton: true,
    imagesToPreload: [
      '/image/neck&shoulders.webp',
      '/image/back&spine.webp',
      '/image/hips&pelvis.webp',
      '/image/joints.webp',
      '/image/overallflexibility.webp'
    ],
    nextStepId: 'user-new5',
    legacyClassName: 'user-step-new2',
  },

  // НОВАЯ СТРАНИЦА user/new5 с multi-select
  {
    id: 'user-new5',
    route: '/user/new5',
    pageType: 'multi-select',
    title: 'Which parts of your body feel less free to move?',
    subtitle: 'Select up to 3 zones where stiffness or tension.',
    isMultiSelect: true,
    showContinueButton: true,
    maxSelections: 3,
    options: [
      { value: 'Neck & shoulders', text: 'Neck & shoulders', icon: 'neck&shoulders', selected: false },
      { value: 'Back & spine', text: 'Back & spine', icon: 'back&spine', selected: false },
      { value: 'Hips & pelvis', text: 'Hips & pelvis', icon: 'hips&pelvis', selected: false },
      { value: 'Joints', text: 'Joints', icon: 'joints', selected: false },
      { value: 'Overall flexibility', text: 'Overall flexibility', icon: 'overallflexibility', selected: false }
    ],
    saveKey: 'userNew5',
    imagesToPreload: [
      '/image/method-image.webp',
      '/image/rating.svg'
    ],
    nextStepId: 'user-new6',
    legacyClassName: 'goal-page-4',
  },

  {
    id: 'goal-5',
    route: '/goal/5',
    pageType: 'single-select',
    title: 'If you could turn back time, what would you want to feel?',
    options: [
      { value: 'Feeling strong from the inside out', text: 'Feeling strong from the inside out' },
      { value: 'Moving freely and effortlessly', text: 'Moving freely and effortlessly' },
      { value: 'Seeing a fresher, younger reflection', text: 'Seeing a fresher, younger reflection' },
      { value: 'Feeling as I did in my prime', text: 'Feeling as I did in my prime' },
      { value: 'Regaining daily energy', text: 'Regaining daily energy' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    saveKey: 'page5',
    nextStepId: 'goal-6',
    legacyClassName: 'goal-page-5',
  },

  // СТАРАЯ СТРАНИЦА goal-6 (оставлена для примера, не используется в основном флоу)
  {
    id: 'goal-6',
    route: '/goal/6',
    pageType: 'testimonial-grid',
    title: 'You are in the right place!',
    subtitle: 'Join 500,000+ users who have already felt the transformation',
    showContinueButton: true,
    testimonials: [],
    imagesToPreload: ['/image/rating.svg', '/image/znak.svg'],
    nextStepId: 'goal-7',
    legacyClassName: 'goal-page-6',
  },

  {
    id: 'goal-7',
    route: '/goal/7',
    pageType: 'chart',
    title: 'Turn back time: 25% slower aging with Age Back',
    subtitle: 'While years go by, your body, face, and posture keep their youth',
    chartImage: '/image/before&after.webp',
    infoText: 'Based on data from Age Back users showing measurable improvements in appearance and vitality over consistent practice.',
    showContinueButton: true,
    imagesToPreload: ['/image/before&after.webp', '/image/rating.svg'],
    nextStepId: 'user-1',
    legacyClassName: 'goal-page-7',
  },

  // ==================== USER СЕКЦИЯ ====================
  {
    id: 'user-1',
    route: '/user/1',
    pageType: 'multi-pill',
    title: 'Your face shows your story. Which areas concern you most?',
    subtitle: 'Select 1 to 3 options',
    options: [
      { value: 'Wrinkles', text: 'Wrinkles', width: 'pill-w98' },
      { value: 'Jowls', text: 'Jowls', width: 'pill-w76' },
      { value: 'Double chin', text: 'Double chin', width: 'pill-w122' },
      { value: 'Puffiness', text: 'Puffiness', width: 'pill-w103' },
      { value: 'Drooping eyelids', text: 'Drooping eyelids', width: 'pill-w158' },
      { value: 'Dark circles', text: 'Dark circles', width: 'pill-w120' },
      { value: 'Skin elasticity', text: 'Skin elasticity', width: 'pill-w135' },
      { value: 'Nasolabial folds', text: 'Nasolabial folds', width: 'pill-w151' },
      { value: "Crow's feet", text: "Crow's feet", width: 'pill-w116' },
      { value: 'Redness', text: 'Redness', width: 'pill-w98' },
      { value: 'Venus rings', text: 'Venus rings', width: 'pill-w120' }
    ],
    maxSelections: 3,
    showContinueButton: true,
    saveKey: 'user1',
    imagesToPreload: [],
    nextStepId: 'user-2',
    stepClass: 'user-step-1',
  },

  {
    id: 'user-2',
    route: '/user/2',
    pageType: 'multi-pill',
    title: 'Your body deserves attention. Where do you feel changes or tension?',
    subtitle: 'Select 1 to 3 options',
    options: [
      { value: 'Neck hump', text: 'Neck hump', width: 'pill-w119' },
      { value: 'Belly', text: 'Belly', width: 'pill-w69' },
      { value: 'Back', text: 'Back', width: 'pill-w70' },
      { value: 'Posture', text: 'Posture', width: 'pill-w90' },
      { value: 'Slouching', text: 'Slouching', width: 'pill-w108' },
      { value: 'Legs', text: 'Legs', width: 'pill-w69' },
      { value: 'Shoulders', text: 'Shoulders', width: 'pill-w109' },
      { value: 'Muscle weakness', text: 'Muscle weakness', width: 'pill-w166' },
      { value: 'Thighs / buttocks', text: 'Thighs / buttocks', width: 'pill-w162' },
      { value: 'Pelvis', text: 'Pelvis', width: 'pill-w76' },
      { value: 'Core strength', text: 'Core strength', width: 'pill-w135' }
    ],
    maxSelections: 3,
    showContinueButton: true,
    saveKey: 'user2',
    imagesToPreload: [],
    nextStepId: 'user-3',
    stepClass: 'user-step-2',
  },

  {
    id: 'user-3',
    route: '/user/3',
    pageType: 'multi-pill',
    title: 'Move freely. Where do you notice stiffness or limited flexibility?',
    subtitle: 'Select 1 to 3 options',
    options: [
      { value: 'Neck stiffness', text: 'Neck stiffness', width: 'pill-w140' },
      { value: 'Shoulder mobility', text: 'Shoulder mobility', width: 'pill-w163' },
      { value: 'Back flexibility', text: 'Back flexibility', width: 'pill-w139' },
      { value: 'Hips', text: 'Hips', width: 'pill-w67' },
      { value: 'Knees', text: 'Knees', width: 'pill-w80' },
      { value: 'Ankles', text: 'Ankles', width: 'pill-w83' },
      { value: 'Stiffness', text: 'Stiffness', width: 'pill-w99' },
      { value: 'Coordination', text: 'Coordination', width: 'pill-w129' },
      { value: 'Weak flexibility', text: 'Weak flexibility', width: 'pill-w144' },
      { value: 'Joint pain', text: 'Joint pain', width: 'pill-w105' },
      { value: 'Core stability', text: 'Core stability', width: 'pill-w130' }
    ],
    maxSelections: 3,
    showContinueButton: true,
    saveKey: 'user3',
    imagesToPreload: [],
    nextStepId: 'user-new6',
    stepClass: 'user-step-3',
  },

  {
    id: 'user-new6',
    route: '/user/new6',
    pageType: 'testimonial-grid',
    title: "People like you are already turning time backward!",
    subtitle: 'Real results prove one thing: your body remembers youth faster than you think.',
    showContinueButton: true,
    testimonials: [
      { percentage: '78%', description: 'reported visible posture improvement' },
      { percentage: '65%', description: 'noticed reduced puffiness' },
      { percentage: '72%', description: 'felt more daily energy' },
      { percentage: '81%', description: 'regained flexibility and lightness' }
    ],
    bottomText: 'We just guide it back there.',
    imagesToPreload: ['/image/method-image.webp', '/image/rating.svg'],
    nextStepId: 'user-new7',
    stepClass: 'user-step-4',
  },

  // НОВАЯ СТРАНИЦА user/new7 с типом chart
  {
    id: 'user-new7',
    route: '/user/new7',
    pageType: 'chart',
    title: 'Visible rejuvenation with the science<br>of "youth mechanics".',
    subtitle: 'Age Back™ Method reconnects your face, <br> posture, and mobility to revive the body\'s built-in "youth code."',
    chartImage: '/image/method-image.webp',
    testimonials: [
      {
        description: '"It\'s like my body remembered how to be young again. Clear science, simple steps, real results."',
        author: 'Elina',
        age: '46 y.o',
        rating: '/image/rating.svg'
      }
    ],
    showContinueButton: true,
    imagesToPreload: ['/image/doctor.webp', '/image/MindFlow.svg', '/image/Wellness Journal.svg', '/image/Bloom.svg', '/image/AgeWell.svg', '/image/GSR.svg'],
    nextStepId: 'user-new8',
    legacyClassName: 'user-step-new7',
  },

  // НОВАЯ СТРАНИЦА user/new8 с отзывом врача и логотипами
  {
    id: 'user-new8',
    route: '/user/new8',
    pageType: 'testimonial-with-logos',
    title: 'Backed by science. Guided by clinical expertise.',
    subtitle: 'Method developed by an expert in neuro<br>-movement & fascia therapy, and member of the European Anti-Aging Society.',
    showContinueButton: true,
    testimonials: [
      {
        description: '"Your body never forgets youth. It only needs a chance to remember."',
        author: 'Nora Klein, PhD',
        age: 'Clinical Director at Age Back'
      }
    ],
    imageSrc: '/image/doctor.webp',
    bottomText: 'As seen in:',
    imagesToPreload: [],
    nextStepId: 'user-new9',
    stepClass: 'user-step-new8',
  },

  // НОВАЯ СТРАНИЦА user/new9 с типом single-select
  {
    id: 'user-new9',
    route: '/user/new9',
    pageType: 'single-select',
    title: 'Listen to your body. How often does it signal discomfort?',
    subtitle: 'Your body can restore faster than you think.',
    options: [
      { value: 'option-1', text: 'Never, I feel comfortable' },
      { value: 'option-2', text: 'Rarely, minor discomfort' },
      { value: 'option-3', text: 'Sometimes, occasional aches' },
      { value: 'option-4', text: 'Often, noticeable pain' },
      { value: 'option-5', text: 'Constantly, frequent discomfort' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: ['/image/before&after.webp', '/image/rating.svg'],
    nextStepId: 'user-7',
    legacyClassName: 'user-step-new9',
  },

  {
    id: 'user-5',
    route: '/user/5',
    pageType: 'single-select',
    title: 'Listen to your body. How often does it signal discomfort?',
    subtitle: '',
    options: [
      { value: 'Never, I feel comfortable', text: 'Never, I feel comfortable' },
      { value: 'Rarely, minor discomfort', text: 'Rarely, minor discomfort' },
      { value: 'Sometimes, occasional aches', text: 'Sometimes, occasional aches' },
      { value: 'Often, noticeable pain', text: 'Often, noticeable pain' },
      { value: 'Constantly, frequent discomfort', text: 'Constantly, frequent discomfort' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 300,
    nextStepId: 'user-6',
    stepClass: 'user-step-5',
  },

  {
    id: 'user-6',
    route: '/user/6',
    pageType: 'single-select',
    title: 'Which best describes your typical energy level?',
    subtitle: '',
    options: [
      { value: 'Barely have energy to get through the day', text: 'Barely have energy to get through the day' },
      { value: 'Often feel drained or fatigued', text: 'Often feel drained or fatigued' },
      { value: 'Energy varies during the day', text: 'Energy varies during the day' },
      { value: 'Generally energetic and productive', text: 'Generally energetic and productive' },
      { value: 'Full of vitality and motivation', text: 'Full of vitality and motivation' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 300,
    imagesToPreload: ['/image/before&after.webp', '/image/rating.svg'],
    nextStepId: 'user-7',
    stepClass: 'user-step-6',
  },

  {
    id: 'user-7',
    route: '/user/new10',
    pageType: 'testimonial-advanced',
    title: 'Real User Stories and<br>science-backed results: visible rewind<br> in 12 weeks',
    subtitle: '',
    showContinueButton: true,
    testimonials: [
      {
        description: '"Using Age Back, I\'ve experienced a complete transformation. My posture improved, my face looks fresher, I feel lighter every morning."',
        author: 'Jessica',
        age: '32 y.o',
        rating: '/image/rating.svg'
      }
    ],
    imageSrc: '/image/before&after.webp',
    imagesToPreload: ['/image/approach.webp'],
    nextStepId: 'lifestyle-new1',
    stepClass: 'user-step-7',
  },

  // ==================== LIFESTYLE СЕКЦИЯ ====================
  {
    id: 'lifestyle-new1',
    route: '/lifestyle/new1',
    pageType: 'single-select',
    title: 'How much stress lives in your body?',
    subtitle: 'Stress often hides in muscles before you notice it.',
    options: [
      { value: 'option-1', text: 'Very little, I stay calm and balanced' },
      { value: 'option-2', text: 'Manageable, it comes and goes' },
      { value: 'option-3', text: 'Noticeable, I often feel tension' },
      { value: 'option-4', text: 'Frequent, it affects how I move and feel' },
      { value: 'option-5', text: 'Constant, my body rarely relaxes' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: [],
    nextStepId: 'lifestyle-new2',
    legacyClassName: 'lifestyle-step-new1',
  },

  // НОВАЯ СТРАНИЦА lifestyle/new2
  {
    id: 'lifestyle-new2',
    route: '/lifestyle/new2',
    pageType: 'single-select',
    title: 'How well does your body recharge at night?',
    subtitle: 'Deep rest is where visible rejuvenation begins.',
    options: [
      { value: 'option-1', text: 'Sleep deeply and wake refreshed' },
      { value: 'option-2', text: 'Mostly good, sometimes interrupted' },
      { value: 'option-3', text: 'Fall asleep fast but wake tired' },
      { value: 'option-4', text: 'My sleep is light or broken' },
      { value: 'option-5', text: 'Often struggle to rest fully' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: [],
    nextStepId: 'lifestyle-new3',
    legacyClassName: 'lifestyle-step-new2',
  },

  // НОВАЯ СТРАНИЦА lifestyle/new3
  {
    id: 'lifestyle-new3',
    route: '/lifestyle/new3',
    pageType: 'single-select',
    title: 'How much natural movement does your day include?',
    subtitle: 'Movement keeps your youth chemistry switched on.',
    options: [
      { value: 'option-1', text: 'Mostly sitting, long static hours' },
      { value: 'option-2', text: 'Some walking, no clear routine' },
      { value: 'option-3', text: 'Light activity most days' },
      { value: 'option-4', text: 'Balanced mix of movement and rest' },
      { value: 'option-5', text: 'I move a lot and feel awake and mobile' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: ['/image/progress-rate.webp', '/image/doctor.webp'],
    nextStepId: 'lifestyle-new4',
    legacyClassName: 'lifestyle-step-new3',
  },

  // НОВАЯ СТРАНИЦА lifestyle/new4 с графиком прогресса
  {
    id: 'lifestyle-new4',
    route: '/lifestyle/new4',
    pageType: 'chart',
    title: 'Users like you notice visible results<br>within 12 weeks',
    subtitle: 'With just 15 minutes a day, users reported<br>noticeable shifts in how they feel.',
    chartImage: '/image/progress-rate.webp',
    testimonials: [
      {
        description: '"How we rest and recover shapes how we look. This is the foundation of youth."',
        author: 'Nora Klein, PhD',
        age: 'Clinical Director at Age Back'
      }
    ],
    imageSrc: '/image/doctor.webp',
    showContinueButton: true,
    imagesToPreload: ['/image/chart-withwithout.svg'],
    nextStepId: 'lifestyle-new5',
    stepClass: 'lifestyle-step-new4',
  },

  {
    id: 'lifestyle-1',
    route: '/lifestyle/1',
    pageType: 'single-select',
    title: 'How much activity do you have in your life?',
    subtitle: '',
    options: [
      { value: 'Almost none', text: 'Almost none' },
      { value: 'Mostly sitting, occasional walks', text: 'Mostly sitting, occasional walks' },
      { value: 'Light workouts or short walks', text: 'Light workouts or short walks' },
      { value: 'Regular sports', text: 'Regular sports' },
      { value: 'Very active lifestyle', text: 'Very active lifestyle' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 300,
    nextStepId: 'lifestyle-2',
    stepClass: 'lifestyle-step-1',
  },

  {
    id: 'lifestyle-2',
    route: '/lifestyle/2',
    pageType: 'single-select',
    title: 'How does your nutrition usually look?',
    subtitle: '',
    options: [
      { value: 'Lots of fast food and sweets', text: 'Lots of fast food and sweets' },
      { value: 'More snacking than proper meals', text: 'More snacking than proper meals' },
      { value: 'Sometimes try to eat healthy', text: 'Sometimes try to eat healthy' },
      { value: 'Generally balanced', text: 'Generally balanced' },
      { value: 'Very careful about nutrition', text: 'Very careful about nutrition' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 300,
    nextStepId: 'lifestyle-3',
    stepClass: 'lifestyle-step-2',
  },

  {
    id: 'lifestyle-3',
    route: '/lifestyle/3',
    pageType: 'single-select',
    title: 'How about water? How much do you usually drink?',
    subtitle: '',
    options: [
      { value: 'Almost none', text: 'Almost none' },
      { value: 'Less than 1 liter', text: 'Less than 1 liter' },
      { value: 'About 1–1.5 liters', text: 'About 1–1.5 liters' },
      { value: 'About 2 liters', text: 'About 2 liters' },
      { value: 'More than 2 liters', text: 'More than 2 liters' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 300,
    imagesToPreload: ['/image/approach.webp'],
    nextStepId: 'lifestyle-4',
    stepClass: 'lifestyle-step-3',
  },

  {
    id: 'lifestyle-4',
    route: '/lifestyle/4',
    pageType: 'info',
    title: "Aging isn't just about years — it's about habits",
    subtitle: '',
    description: "That's why Age Back takes a whole-body approach. By working on posture, flexibility, skin, sleep, and stress, we help you feel and look younger from every angle.",
    imageSrc: '/image/approach.webp',
    showContinueButton: true,
    imagesToPreload: [],
    nextStepId: 'lifestyle-new5',
    stepClass: 'lifestyle-step-4',
  },

  // НОВАЯ СТРАНИЦА lifestyle/new5
  {
    id: 'lifestyle-new5',
    route: '/lifestyle/new5',
    pageType: 'single-select',
    title: 'When did “I’ll start soon” turn into years?',
    subtitle: 'You don’t age in one day. You age in habits that repeat.',
    options: [
      { value: 'option-1', text: 'I’ve already started taking care of myself' },
      { value: 'option-2', text: 'I notice small slips, but still in control' },
      { value: 'option-3', text: 'I keep saying “tomorrow” more than I like' },
      { value: 'option-4', text: 'I lost count of “tomorrows”' },
      { value: 'option-5', text: 'I didn’t notice — until now' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: ['/image/chart-withwithout.svg'],
    nextStepId: 'lifestyle-new6',
    legacyClassName: 'lifestyle-step-new5',
  },

  // НОВАЯ СТРАНИЦА lifestyle/new6
  {
    id: 'lifestyle-new6',
    route: '/lifestyle/new6',
    pageType: 'single-select',
    title: 'What kind of guidance would actually keep you going?',
    subtitle: 'Every transformation starts with structure.',
    options: [
      { value: 'option-1', text: 'Clear daily structure I can just follow' },
      { value: 'option-2', text: 'Short guided sessions with expert cues' },
      { value: 'option-3', text: 'Flexible plan with smart reminders' },
      { value: 'option-4', text: 'Freedom with gentle tracking' },
      { value: 'option-5', text: 'Not sure yet, show me what works best' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: ['/image/chart-withwithout.svg'],
    nextStepId: 'lifestyle-7',
    legacyClassName: 'lifestyle-step-new6',
  },

  {
    id: 'lifestyle-5',
    route: '/lifestyle/5',
    pageType: 'single-select',
    title: "Sleep is the main source of youth. How's yours?",
    subtitle: '',
    options: [
      { value: 'Sleep very poorly', text: 'Sleep very poorly' },
      { value: 'Often sleep badly', text: 'Often sleep badly' },
      { value: 'Varies', text: 'Varies' },
      { value: 'Generally sleep well', text: 'Generally sleep well' },
      { value: 'Sleep deeply and peacefully', text: 'Sleep deeply and peacefully' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 300,
    nextStepId: 'lifestyle-6',
    stepClass: 'lifestyle-step-5',
  },

  {
    id: 'lifestyle-6',
    route: '/lifestyle/6',
    pageType: 'single-select',
    title: 'How often does stress affect your mood or health?',
    subtitle: '',
    options: [
      { value: 'Constantly', text: 'Constantly' },
      { value: 'Often', text: 'Often' },
      { value: 'Sometimes', text: 'Sometimes' },
      { value: 'Rarely', text: 'Rarely' },
      { value: 'Almost never', text: 'Almost never' }
    ],
    autoNavigate: true,
    autoNavigateDelay: 300,
    imagesToPreload: ['/image/chart-withwithout.svg', '/image/znak.svg'],
    nextStepId: 'lifestyle-7',
    stepClass: 'lifestyle-step-6',
  },

  {
    id: 'lifestyle-7',
    route: '/lifestyle/7',
    pageType: 'chart',
    title: 'Your consistency. Our method.<br>2x Faster results.',
    subtitle: ' With the same 15 minutes a day, structured Age Back sessions lead to visible progress 2× faster than going alone.',
    chartImage: '/image/chart-withwithout.svg',
    infoText: 'Users following guided Age Back routines report up to 2× faster improvements in posture, tone and energy than self-training.',
    showContinueButton: true,
    animationName: 'lifestyle',
    imagesToPreload: [],
    nextStepId: 'lifestyle-new8',
    stepClass: 'lifestyle-step-7',
  },

  // НОВАЯ СТРАНИЦА lifestyle/new8 с типом scale
  {
    id: 'lifestyle-new8',
    route: '/lifestyle/new8',
    pageType: 'scale',
    question: 'How much do you agree with this?',
    statement: '“Sometimes I look in the mirror and don’t recognize myself.”',
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: [],
    nextStepId: 'lifestyle-new9',
  },

  // НОВАЯ СТРАНИЦА lifestyle/new9 с типом scale
  {
    id: 'lifestyle-new9',
    route: '/lifestyle/new9',
    pageType: 'scale',
    question: 'How much do you agree with this?',
    statement: '“My appearance often shapes how confident I feel.”',
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: [],
    nextStepId: 'lifestyle-new10',
  },

  // НОВАЯ СТРАНИЦА lifestyle/new10 с типом scale
  {
    id: 'lifestyle-new10',
    route: '/lifestyle/new10',
    pageType: 'scale',
    question: 'How much do you agree with this?',
    statement: '“I’m ready to see a reflection that matches who I am inside.”',
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: [
      '/image/age-rewind-high-2-3.webp',
      '/image/age-rewind-high-4-5.webp',
      '/image/age-rewind-extreme.webp',
      '/image/icon-info-24px.svg',
      '/image/user-icon-24px.svg',
      '/image/rewind-icon-24px.svg',
      '/image/clock-icon-24px.svg',
      '/image/flash-icon-24px.svg',
      '/image/lamp-icon-24px.svg'
    ],
    nextStepId: 'enteremail',
  },

  // ==================== ENTEREMAIL СТРАНИЦА ====================
  {
    id: 'enteremail',
    route: '/enteremail',
    pageType: 'info',
    title: 'Enter your email',
    showContinueButton: false,
    nextStepId: 'create-plan',
  },

  // ==================== STATEMENTS СЕКЦИЯ ====================
  {
    id: 'statements-1',
    route: '/statements/1',
    pageType: 'scale',
    question: 'Do you relate to the following statement?',
    statement: 'The reflection in the mirror affects my mood and my self-esteem',
    autoNavigate: true,
    autoNavigateDelay: 500,
    nextStepId: 'statements-2',
  },

  {
    id: 'statements-2',
    route: '/statements/2',
    pageType: 'scale',
    question: 'Do you relate to the following statement?',
    statement: 'I tend to compare myself to others and it makes me frustrated',
    autoNavigate: true,
    autoNavigateDelay: 500,
    nextStepId: 'statements-3',
  },

  {
    id: 'statements-3',
    route: '/statements/3',
    pageType: 'scale',
    question: 'Do you relate to the following statement?',
    statement: 'My appearance may affect my relationships',
    autoNavigate: true,
    autoNavigateDelay: 500,
    nextStepId: 'statements-4',
  },

  {
    id: 'statements-4',
    route: '/statements/4',
    pageType: 'scale',
    question: 'Do you relate to the following statement?',
    statement: "I'm afraid that people won't like me if I look older",
    autoNavigate: true,
    autoNavigateDelay: 500,
    imagesToPreload: ['/image/rating.svg'],
    nextStepId: 'create-plan',
  },

  // ==================== CREATE PLAN СТРАНИЦА ====================
  {
    id: 'create-plan',
    route: '/create-plan',
    pageType: 'info',
    title: 'Your Age-rewind profile',
    showContinueButton: true,
    nextStepId: 'buildingplan-1',
    legacyClassName: 'create-plan-page',
  },
];

// ==================== HELPER ФУНКЦИИ ====================

/**
 * Получить шаг по ID
 */
export const getStepById = (id: string): OnboardingStep | undefined => {
  return onboardingSteps.find(step => step.id === id);
};

/**
 * Получить шаг по route
 */
export const getStepByRoute = (route: string): OnboardingStep | undefined => {
  return onboardingSteps.find(step => step.route === route);
};

/**
 * Получить следующий шаг
 */
export const getNextStep = (currentId: string): OnboardingStep | null => {
  const current = getStepById(currentId);
  if (!current?.nextStepId) return null;
  return getStepById(current.nextStepId) || null;
};

/**
 * Получить предыдущий шаг (по цепочке nextStepId, а не по индексу)
 */
export const getPreviousStepById = (currentId: string): OnboardingStep | null => {
  // Ищем шаг, у которого nextStepId указывает на текущий шаг
  const previousStep = onboardingSteps.find(step => step.nextStepId === currentId);
  return previousStep || null;
};

/**
 * Получить предыдущий шаг по route
 */
export const getPreviousStepByRoute = (currentRoute: string): OnboardingStep | null => {
  const current = getStepByRoute(currentRoute);
  if (!current) return null;
  return getPreviousStepById(current.id);
};

/**
 * Получить все routes
 */
export const getAllRoutes = (): string[] => {
  return onboardingSteps.map(step => step.route);
};

/**
 * Получить индекс шага (для прогресса)
 */
export const getStepIndex = (id: string): number => {
  return onboardingSteps.findIndex(step => step.id === id);
};

/**
 * Получить индекс по route
 */
export const getStepIndexByRoute = (route: string): number => {
  return onboardingSteps.findIndex(step => step.route === route);
};

/**
 * Получить общее количество шагов
 */
export const getTotalSteps = (): number => {
  return onboardingSteps.length;
};

/**
 * Проверить, является ли путь валидным шагом онбординга
 */
export const isValidOnboardingStep = (route: string): boolean => {
  return onboardingSteps.some(step => step.route === route);
};

/**
 * Получить карту предзагрузки изображений
 * (генерируется автоматически из конфига)
 */
export const getImagePreloadMap = (): Record<string, string[]> => {
  const map: Record<string, string[]> = {};
  onboardingSteps.forEach(step => {
    if (step.imagesToPreload && step.imagesToPreload.length > 0) {
      map[step.route] = step.imagesToPreload;
    }
  });
  return map;
};
