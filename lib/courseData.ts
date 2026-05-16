export interface Lesson {
  id: number
  title: string
  vimeoId?: string
  vimeoHash?: string
  pdf?: string
}

export interface Module {
  id: number
  title: string
  description: string
  icon: string
  lessons: Lesson[]
}

export interface FeatureVideo {
  title: string
  vimeoId: string
  vimeoHash?: string
}

export const introVideo: FeatureVideo = {
  title: 'סרטון פתיחה',
  vimeoId: '1192787426',
  vimeoHash: '347f255d14',
}

export const outroVideo: FeatureVideo = {
  title: 'סרטון סיום',
  vimeoId: '1192787052',
  vimeoHash: 'fa67ac0e0f',
}

export interface ContactLink {
  label: string
  href: string
  icon: string
}

export const contactLinks: ContactLink[] = [
  { label: 'וואטסאפ', href: 'https://wa.me/972546904940', icon: '💬' },
  { label: 'פייסבוק', href: 'https://www.facebook.com/profile.php?id=61576575695878', icon: '📘' },
  { label: 'אינסטגרם', href: 'https://www.instagram.com/nirit_shoch/', icon: '📷' },
]

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
        { id: 1, title: 'איך לענות על Tell me about yourself', vimeoId: '1192787051', vimeoHash: '43f09cbbc6', pdf: '/pdfs/module-1-lesson-1.pdf' },
        { id: 2, title: 'איך לדבר על נסיון תעסוקתי', vimeoId: '1192787053', vimeoHash: 'ae0bcaa3c1', pdf: '/pdfs/module-1-lesson-2.pdf' },
        { id: 3, title: 'איך לדבר על החוזקות שלך', vimeoId: '1192787054', vimeoHash: '6faa151580', pdf: '/pdfs/module-1-lesson-3.pdf' },
        { id: 4, title: 'איך לסיים בצורה טובה', vimeoId: '1192787113', vimeoHash: '8112c64e93', pdf: '/pdfs/module-1-lesson-4.pdf' },
        { id: 5, title: 'איך לבנות תשובה מלאה', vimeoId: '1192787143', vimeoHash: '2823e8fef0', pdf: '/pdfs/module-1-lesson-5.pdf' },
      ],
    },
    {
      id: 2,
      title: 'שאלות נפוצות בראיון עבודה',
      description: 'הכנה מקיפה לשאלות הכי נפוצות בראיונות עבודה',
      icon: '💼',
      lessons: [
        { id: 1, title: 'למה אתה רוצה את העבודה?', vimeoId: '1192787146', vimeoHash: '2867fb01c3', pdf: '/pdfs/module-2-lesson-1.pdf' },
        { id: 2, title: 'מה החוזקות שלך?', vimeoId: '1192787153', vimeoHash: 'fe004f0c84', pdf: '/pdfs/module-2-lesson-2.pdf' },
        { id: 3, title: 'מה החולשה שלך?', vimeoId: '1192787152', vimeoHash: '44eccaf2e1', pdf: '/pdfs/module-2-lesson-3.pdf' },
        { id: 4, title: 'למה נבחר בך?', vimeoId: '1192787169', vimeoHash: 'ae077aeb83', pdf: '/pdfs/module-2-lesson-4.pdf' },
        { id: 5, title: 'תרגול ראיון קצר', vimeoId: '1192787236', vimeoHash: '66ce69ee86', pdf: '/pdfs/module-2-lesson-5.pdf' },
      ],
    },
    {
      id: 3,
      title: 'שיחה מקצועית בעבודה',
      description: 'שפת העבודה היומיומית — פגישות, שיחות ועוד',
      icon: '🗣️',
      lessons: [
        { id: 1, title: 'Small Talk בתחילת השיחה', vimeoId: '1192787235', vimeoHash: 'd07692ef91', pdf: '/pdfs/module-3-lesson-1.pdf' },
        { id: 2, title: 'איך להשתתף בפגישה מקצועית', vimeoId: '1192787237', vimeoHash: 'a7e28d016d', pdf: '/pdfs/module-3-lesson-2.pdf' },
        { id: 3, title: 'איך לשאול שאלות בעבודה?', vimeoId: '1192787234', vimeoHash: '76a669d2ba', pdf: '/pdfs/module-3-lesson-3.pdf' },
        { id: 4, title: 'איך לבקש הבהרה כשלא מבינים?', vimeoId: '1192787295', vimeoHash: 'aaffa3aa01', pdf: '/pdfs/module-3-lesson-4.pdf' },
        { id: 5, title: 'תרגול שיחה מקצועית קצרה', vimeoId: '1192787296', vimeoHash: '5fc2811eaa', pdf: '/pdfs/module-3-lesson-5.pdf' },
      ],
    },
    {
      id: 4,
      title: 'מיילים והודעות מקצועיות',
      description: 'כתיבה מקצועית — מיילים, הודעות ו-LinkedIn',
      icon: '📧',
      lessons: [
        { id: 1, title: 'איך מתחילים מייל מקצועי', vimeoId: '1192787294', vimeoHash: '1374176e41', pdf: '/pdfs/module-4-lesson-1.pdf' },
        { id: 2, title: 'איך לכתוב הודעה קצרה אחרי הראיון', vimeoId: '1192787305', vimeoHash: '787113fea0', pdf: '/pdfs/module-4-lesson-2.pdf' },
        { id: 3, title: 'איך לשאול שאלה במייל', vimeoId: '1192787353', vimeoHash: '7caf0b6b37', pdf: '/pdfs/module-4-lesson-3.pdf' },
        { id: 4, title: 'איך לסיים מייל בצורה מקצועית', vimeoId: '1192787358', vimeoHash: 'ea2f3522e6', pdf: '/pdfs/module-4-lesson-4.pdf' },
        { id: 5, title: 'איך לכתוב מייל שלם', vimeoId: '1192787356', vimeoHash: '8b6f463a88', pdf: '/pdfs/module-4-lesson-5.pdf' },
      ],
    },
    {
      id: 5,
      title: 'ביטחון, הגייה וטעויות נפוצות',
      description: 'שיפור הגייה ומניעת טעויות שכיחות',
      icon: '🎯',
      lessons: [
        { id: 1, title: 'למה אנחנו נתקעים באנגלית?', vimeoId: '1192787361', vimeoHash: 'a5ae1bf7e1', pdf: '/pdfs/module-5-lesson-1.pdf' },
        { id: 2, title: 'איך לדבר לאט וברור', vimeoId: '1192787371', vimeoHash: '06aae1676e', pdf: '/pdfs/module-5-lesson-2.pdf' },
        { id: 3, title: 'משפטי הצלה כשנתקעים', vimeoId: '1192787384', vimeoHash: 'd223b570ad', pdf: '/pdfs/module-5-lesson-3.pdf' },
        { id: 4, title: 'טעויות נפוצות - לא צריך לפחד מהן', vimeoId: '1192787400', vimeoHash: 'eefd27e29a', pdf: '/pdfs/module-5-lesson-4.pdf' },
        { id: 5, title: 'תרגול ביטחון', vimeoId: '1192787411', vimeoHash: '2f738c9f47', pdf: '/pdfs/module-5-lesson-5.pdf' },
      ],
    },
  ] as Module[],
}

export const TOTAL_LESSONS = courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0)
