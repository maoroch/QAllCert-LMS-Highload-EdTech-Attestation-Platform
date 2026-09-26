export interface CourseInfo {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  hours: number;
  target_audience: string;
  rating?: number;
  students_count?: number;
  certificate_hours?: number;
}

export const CANONICAL_COURSES: Record<string, CourseInfo> = {
  'math-trigonometry-80h': {
    id: 1,
    slug: 'math-trigonometry-80h',
    title: '«Математика пәні мұғалімдеріне тригонометриялық теңдеулер мен теңсіздіктер» тарауына проблемалық оқыту технологиясын пайдалану',
    description: 'Математика пәні мұғалімдеріне тригонометриялық теңдеулер мен теңсіздіктерді оқытуда проблемалық оқыту әдістемесін қолдану. Аттестаттауға арналған 80 академиялық сағаттық аккредиттелген ресми курс.',
    price: 15000,
    hours: 80,
    certificate_hours: 80,
    target_audience: 'Математика пәні мұғалімдеріне'
  },
  'python-pedagog-80h': {
    id: 2,
    slug: 'python-pedagog-80h',
    title: '«Python бағдарламалау тілі: теориясы мен практикасы»',
    description: 'Мектеп мұғалімдері мен жаңадан бастаушыларға арналған Python программалау тілін оқыту әдістемесі мен практикасы. Аттестаттауға арналған 80 академиялық сағаттық ресми курс.',
    price: 15000,
    hours: 80,
    certificate_hours: 80,
    target_audience: 'Информатика мұғалімдері, IT мамандар'
  },
  'steam-education-80h': {
    id: 3,
    slug: 'steam-education-80h',
    title: '«STEAM білім беру: білім алушылармен жұмыс жасау технологиялары мен формалары»',
    description: 'Мектепте STEAM оқыту әдістемесін енгізу, пәнаралық байланыс, жобалық жұмыстар мен дайын сабақ жоспарлары. 80 академиялық сағаттық біліктілікті арттыру курсы.',
    price: 15000,
    hours: 80,
    certificate_hours: 80,
    target_audience: 'Жаратылыстану және гуманитарлық пән мұғалімдері'
  },
  'ai-education-86h': {
    id: 4,
    slug: 'ai-education-86h',
    title: '«Білім берудегі жасанды интеллект технологиялары: теориясы мен практикасы»',
    description: 'Сабақ беруде жасанды интеллект (ChatGPT, нейрожелілер) құралдарын тиімді қолдану. 86 академиялық сағаттық ресми аккредиттелген курс.',
    price: 18000,
    hours: 86,
    certificate_hours: 86,
    target_audience: 'Барлық пән мұғалімдері мен оқытушылар'
  }
};

export const ALL_COURSE_SLUGS = Object.keys(CANONICAL_COURSES);
