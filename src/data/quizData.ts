export interface QuizOption {
  value: string;
  text: string;
  selected?: boolean;
  icon?: string;
}

export interface QuizPageData {
  id: number;
  title: string;
  subtitle?: string;
  options: QuizOption[];
  progress: number;
  className?: string;
  isMultiSelect?: boolean;
  showContinueButton?: boolean;
  isTestimonialPage?: boolean;
  isChartPage?: boolean;
  isSplashPage?: boolean;
}

export const quizPages: QuizPageData[] = [
  {
    id: 1,
    title: "Stop aging in its tracks",
    subtitle: "Take a 3-minute quiz to slow down time and see a fresher you",
    progress: 64,
    className: "splash-page",
    isSplashPage: true,
    options: []
  },
  {
    id: 2,
    title: "Your age helps us guide you. How old are you?",
    subtitle: "Age Back will create your personalised program based on your age",
    progress: 10,
    className: "page-2",
    options: [
      { value: "18-25", text: "18-25" },
      { value: "26-35", text: "26-35" },
      { value: "36-45", text: "36-45", selected: true },
      { value: "46-55", text: "46-55" },
      { value: "56+", text: "56+" }
    ]
  },
  {
    id: 3,
    title: "What's your primary goal for feeling your best?",
    progress: 25,
    className: "page-2",
    options: [
      { value: "lose-weight", text: "Lose weight", selected: true },
      { value: "gain-energy", text: "Gain energy" },
      { value: "improve-mobility", text: "Improve mobility" },
      { value: "reduce-pain", text: "Reduce pain" },
      { value: "feel-younger", text: "Feel younger" }
    ]
  },
  {
    id: 4,
    title: "Great! Which areas do you want to focus on first?",
    progress: 35,
    className: "page-4",
    isMultiSelect: true,
    showContinueButton: true,
    options: [
      { value: "face-neck", text: "Face & neck", icon: "face&neck", selected: false },
      { value: "belly-waist", text: "Belly & waist", icon: "belly&waist", selected: false },
      { value: "back-posture", text: "Back & posture", icon: "back&posture", selected: true },
      { value: "strength-bodytone", text: "Strength & body tone", icon: "strength&bodytone", selected: false },
      { value: "joints-flexibility", text: "Joints & flexibility", icon: "joints&flexibility", selected: false }
    ]
  },
  {
    id: 5,
    title: "If you could turn back time, what would you want to feel?",
    progress: 50,
    className: "page-5",
    showContinueButton: true,
    options: [
      { value: "more-energetic", text: "More energetic" },
      { value: "stronger", text: "Stronger" },
      { value: "confident", text: "More confident" },
      { value: "pain-free", text: "Pain-free" },
      { value: "flexible", text: "More flexible" }
    ]
  },
  {
    id: 6,
    title: "You are in the right place!",
    subtitle: "Join 500,000+ users who have already felt the transformation",
    progress: 60,
    className: "page-6",
    isTestimonialPage: true,
    showContinueButton: true,
    options: []
  },
  {
    id: 7,
    title: "Turn back time: 25% slower aging with Age Back",
    subtitle: "While years go by, your body, face, and posture keep their youth",
    progress: 70,
    className: "page-7",
    isChartPage: true,
    showContinueButton: true,
    options: []
  }
];
