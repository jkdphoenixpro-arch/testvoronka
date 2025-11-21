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
    title: "Turn back time!<br />Rewind visible age with just 15<br />minutes a day",
    subtitle: "Discover a science-based method to help you look and feel up to 10 years younger, naturally.",
    progress: 64,
    className: "splash-page",
    isSplashPage: true,
    options: []
  },
  {
    id: 2,
    title: "How old do you feel right now?",
    subtitle: "Sometimes your body tells the truth better than the calendar.",
    progress: 10,
    className: "page-2",
    options: [
      { value: "18-25", text: "Much younger (−10 yrs)" },
      { value: "26-35", text: "Slightly younger (−5 yrs)" },
      { value: "36-45", text: "About my age" },
      { value: "46-55", text: "A bit older (+5 yrs)" },
      { value: "56+", text: "Much older (+10 yrs)" }
    ]
  },
  {
    id: 3,
    title: "What’s your actual age today?",
    subtitle: "Your age helps us create a rewind path that fits your body.",
    progress: 25,
    className: "page-2",
    options: [
      { value: "Slow down aging", text: "18–29" },
      { value: "Look fresher and younger", text: "30–39" },
      { value: "Feel more energetic and active", text: "40-49" },
      { value: "Regain daily energy", text: "50-59" },
      { value: "Improve body & shape", text: "60+" }
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
      { value: "back-posture", text: "Back & posture", icon: "back&posture", selected: false },
      { value: "strength-bodytone", text: "Strength & body tone", icon: "strength&bodytone", selected: false },
      { value: "joints-flexibility", text: "Joints & flexibility", icon: "joints&flexibility", selected: false }
    ]
  },
  {
    id: 5,
    title: "If you could turn back time, what would you want to feel?",
    progress: 50,
    className: "page-5",
    options: [
      { value: "Feeling strong from the inside out", text: "Feeling strong from the inside out" },
      { value: "Moving freely and effortlessly", text: "Moving freely and effortlessly" },
      { value: "Seeing a fresher, younger reflection", text: "Seeing a fresher, younger reflection" },
      { value: "Feeling as I did in my prime", text: "Feeling as I did in my prime" },
      { value: "Regaining daily energy", text: "Regaining daily energy" }
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
