export interface Lesson {
  id: number
  title: string
  duration: string
}

export interface Module {
  id: number
  title: string
  description: string
  icon: string
  lessons: Lesson[]
}

export const courseData = {
  title: 'אנגלית לקריירה — להתקבל ולדבר בביטחון',
  subtitle:
    'קורס דיגיטלי ומעשי שיעזור לכם לדבר שוטף באנגלית ולהרגיש בטוחים יותר בראיונות עבודה ובשיחות מקצועיות.',
  modules: [
    {
      id: 1,
      title: 'איך להציג את עצמכם',
      description: 'למדו להציג את עצמכם בצורה מקצועית ובטוחה באנגלית',
      icon: '👤',
      lessons: [
        { id: 1, title: 'מבוא — למה חשוב להציג את עצמנו נכון', duration: '8:30' },
        { id: 2, title: 'מבנה ה-Elevator Pitch', duration: '12:15' },
        { id: 3, title: 'תרגול: Tell me about yourself', duration: '10:45' },
        { id: 4, title: 'ביטויים חשובים להצגה עצמית', duration: '9:20' },
        { id: 5, title: 'טיפים לביטחון עצמי', duration: '7:50' },
      ],
    },
    {
      id: 2,
      title: 'שאלות נפוצות בראיון עבודה',
      description: 'הכנה מקיפה לשאלות הכי נפוצות בראיונות עבודה',
      icon: '💼',
      lessons: [
        { id: 1, title: 'Why do you want this job?', duration: '11:30' },
        { id: 2, title: 'What are your strengths and weaknesses?', duration: '13:00' },
        { id: 3, title: 'Where do you see yourself in 5 years?', duration: '9:45' },
        { id: 4, title: 'Tell me about a challenge you faced', duration: '12:30' },
        { id: 5, title: 'Do you have any questions for us?', duration: '8:15' },
      ],
    },
    {
      id: 3,
      title: 'שיחה מקצועית בעבודה',
      description: 'שפת העבודה היומיומית — פגישות, שיחות ועוד',
      icon: '🗣️',
      lessons: [
        { id: 1, title: 'ניהול פגישות באנגלית', duration: '14:20' },
        { id: 2, title: 'הבעת דעות ורעיונות', duration: '11:15' },
        { id: 3, title: 'בקשת עזרה והבהרות', duration: '9:30' },
        { id: 4, title: 'שיחות Small Talk', duration: '10:45' },
        { id: 5, title: 'טלפונים ושיחות וידאו', duration: '12:00' },
      ],
    },
    {
      id: 4,
      title: 'מיילים והודעות מקצועיות',
      description: 'כתיבה מקצועית — מיילים, הודעות ו-LinkedIn',
      icon: '📧',
      lessons: [
        { id: 1, title: 'מבנה המייל המקצועי', duration: '10:30' },
        { id: 2, title: 'Subject lines שמושכים תשומת לב', duration: '8:45' },
        { id: 3, title: 'טון מקצועי לעומת ידידותי', duration: '11:20' },
        { id: 4, title: 'הודעות LinkedIn אפקטיביות', duration: '13:15' },
        { id: 5, title: 'תגובה לדחייה ומעקב אחרי ראיון', duration: '9:50' },
      ],
    },
    {
      id: 5,
      title: 'ביטחון, הגייה וטעויות נפוצות',
      description: 'שיפור הגייה ומניעת טעויות שכיחות',
      icon: '🎯',
      lessons: [
        { id: 1, title: 'הגייה של צלילים קשים לישראלים', duration: '15:30' },
        { id: 2, title: 'טעויות דקדוק נפוצות', duration: '12:45' },
        { id: 3, title: 'Filler words ואיך להימנע מהם', duration: '9:15' },
        { id: 4, title: 'בניית אוצר מילים מקצועי', duration: '11:00' },
        { id: 5, title: 'סיכום ותרגול אינטגרטיבי', duration: '16:20' },
      ],
    },
  ] as Module[],
}

export const TOTAL_LESSONS = courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0)
