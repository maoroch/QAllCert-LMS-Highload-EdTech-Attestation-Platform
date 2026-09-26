import { Metadata } from 'next';
import CourseDetailsClient, { CourseData, ModuleData } from './CourseDetailsClient';
import { API_BASE_URL, APP_NAME } from '../../../../lib/constants';

type Props = {
  params: Promise<{ id: string }>;
};

// Fallback catalog of the 4 flagship accredited courses
const CANONICAL_COURSES: Record<string, CourseData> = {
  'math-trigonometry-80h': {
    id: 1,
    slug: 'math-trigonometry-80h',
    title: '«Математика пәні мұғалімдеріне тригонометриялық теңдеулер мен теңсіздіктер» тарауына проблемалық оқыту технологиясын пайдалану',
    description: 'Математика пәні мұғалімдеріне тригонометриялық теңдеулер мен теңсіздіктерді оқытуда проблемалық оқыту әдістемесін қолдану. Аттестаттауға арналған 80 академиялық сағаттық аккредиттелген ресми курс.',
    price: 15000,
    hours: 80,
    target_audience: 'Математика пәні мұғалімдеріне'
  },
  'python-pedagog-80h': {
    id: 2,
    slug: 'python-pedagog-80h',
    title: '«Python бағдарламалау тілі: теориясы мен практикасы»',
    description: 'Мектеп мұғалімдері мен жаңадан бастаушыларға арналған Python программалау тілін оқыту әдістемесі мен практикасы. Аттестаттауға арналған 80 академиялық сағаттық ресми курс.',
    price: 15000,
    hours: 80,
    target_audience: 'Информатика мұғалімдері, IT мамандар'
  },
  'steam-education-80h': {
    id: 3,
    slug: 'steam-education-80h',
    title: '«STEAM білім беру: білім алушылармен жұмыс жасау технологиялары мен формалары»',
    description: 'Мектепте STEAM оқыту әдістемесін енгізу, пәнаралық байланыс, жобалық жұмыстар мен дайын сабақ жоспарлары. 80 академиялық сағаттық біліктілікті арттыру курсы.',
    price: 15000,
    hours: 80,
    target_audience: 'Жаратылыстану және гуманитарлық пән мұғалімдері'
  },
  'ai-education-86h': {
    id: 4,
    slug: 'ai-education-86h',
    title: '«Білім берудегі жасанды интеллект технологиялары: теориясы мен практикасы»',
    description: 'Сабақ беруде жасанды интеллект (ChatGPT, нейрожелілер) құралдарын тиімді қолдану. 86 академиялық сағаттық ресми аккредиттелген курс.',
    price: 18000,
    hours: 86,
    target_audience: 'Барлық пән мұғалімдері мен оқытушылар'
  },
  '1': {
    id: 1,
    slug: 'math-trigonometry-80h',
    title: '«Математика пәні мұғалімдеріне тригонометриялық теңдеулер мен теңсіздіктер» тарауына проблемалық оқыту технологиясын пайдалану',
    description: 'Математика пәні мұғалімдеріне тригонометриялық теңдеулер мен теңсіздіктерді оқытуда проблемалық оқыту әдістемесін қолдану. Аттестаттауға арналған 80 академиялық сағаттық аккредиттелген ресми курс.',
    price: 15000,
    hours: 80
  },
  '2': {
    id: 2,
    slug: 'python-pedagog-80h',
    title: '«Python бағдарламалау тілі: теориясы мен практикасы»',
    description: 'Мектеп мұғалімдері мен жаңадан бастаушыларға арналған Python программалау тілін оқыту әдістемесі мен практикасы. Аттестаттауға арналған 80 академиялық сағаттық ресми курс.',
    price: 15000,
    hours: 80
  },
  '3': {
    id: 3,
    slug: 'steam-education-80h',
    title: '«STEAM білім беру: білім алушылармен жұмыс жасау технологиялары мен формалары»',
    description: 'Мектепте STEAM оқыту әдістемесін енгізу, пәнаралық байланыс, жобалық жұмыстар мен дайын сабақ жоспарлары. 80 академиялық сағаттық біліктілікті арттыру курсы.',
    price: 15000,
    hours: 80
  },
  '4': {
    id: 4,
    slug: 'ai-education-86h',
    title: '«Білім берудегі жасанды интеллект технологиялары: теориясы мен практикасы»',
    description: 'Сабақ беруде жасанды интеллект (ChatGPT, нейрожелілер) құралдарын тиімді қолдану. 86 академиялық сағаттық ресми аккредиттелген курс.',
    price: 18000,
    hours: 86
  }
};

const DEFAULT_CURRICULUM: Record<string, ModuleData[]> = {
  'math-trigonometry-80h': [
    {
      module_id: 101,
      module_title: '1-модуль. Проблемалық оқытудың теориялық негіздері (8 сағат)',
      is_final: false,
      lessons: [
        { id: 1001, title: 'Проблемалық оқыту концепциясы және оның математикадағы маңызы', content_type: 'video', order_index: 1 },
        { id: 1002, title: 'Оқушылардың танымдық белсенділігін арттыру әдістері', content_type: 'text', order_index: 2 }
      ]
    },
    {
      module_id: 102,
      module_title: '2-модуль. Тригонометриялық теңдеулер мен теңсіздіктерді шешудің стандартты емес әдістері (32 сағат)',
      is_final: false,
      lessons: [
        { id: 1003, title: 'Күрделі тригонометриялық теңдеулерді жіктеу', content_type: 'video', order_index: 1 },
        { id: 1004, title: 'Параметрлі тригонометриялық теңсіздіктерді шешу практикасы', content_type: 'practice', order_index: 2 }
      ]
    },
    {
      module_id: 103,
      module_title: '3-модуль. Оқушылардың математикалық сауаттылығын дамыту (30 сағат)',
      is_final: false,
      lessons: [
        { id: 1005, title: 'Функционалдық сауаттылықты арттыруға арналған қолданбалы есептер', content_type: 'text', order_index: 1 },
        { id: 1006, title: 'PISA және ҰБТ есептерін талдау әдістемесі', content_type: 'practice', order_index: 2 }
      ]
    },
    {
      module_id: 104,
      module_title: '4-модуль. Қорытынды бағалау және аттестаттау тесті (10 сағат)',
      is_final: true,
      lessons: [
        { id: 1007, title: '80 академиялық сағаттық қорытынды тестілеу', content_type: 'practice', order_index: 1 }
      ]
    }
  ],
  'python-pedagog-80h': [
    {
      module_id: 201,
      module_title: '1-модуль. Мектепте Python тілін оқыту әдістемесі мен синтаксис (20 сағат)',
      is_final: false,
      lessons: [
        { id: 2001, title: 'Python ортасын орнату және қарапайым алгоритмдер', content_type: 'video', order_index: 1 },
        { id: 2002, title: 'Деректер типтері және шартты операторлар', content_type: 'practice', order_index: 2 }
      ]
    },
    {
      module_id: 202,
      module_title: '2-модуль. Алгоритмдер мен деректер құрылымы (25 сағат)',
      is_final: false,
      lessons: [
        { id: 2003, title: 'Тізімдер (list), сөздіктер (dict) және жиындар (set)', content_type: 'video', order_index: 1 },
        { id: 2004, title: 'Мектеп олимпиадасының есептерін Python-да шешу', content_type: 'practice', order_index: 2 }
      ]
    },
    {
      module_id: 203,
      module_title: '3-модуль. Графика және оқу жобалары (25 сағат)',
      is_final: false,
      lessons: [
        { id: 2005, title: 'Turtle және Pygame модульдерімен графикалық ойындар жасау', content_type: 'text', order_index: 1 },
        { id: 2006, title: 'Мектепке арналған оқу-ақпараттық Telegram-бот құрастыру', content_type: 'practice', order_index: 2 }
      ]
    },
    {
      module_id: 204,
      module_title: '4-модуль. Қорытынды практикалық жоба (10 сағат)',
      is_final: true,
      lessons: [
        { id: 2007, title: 'Авторлық жобаны қорғау және 80 сағаттық қорытынды тест', content_type: 'practice', order_index: 1 }
      ]
    }
  ],
  'steam-education-80h': [
    {
      module_id: 301,
      module_title: '1-модуль. STEAM білім беру тұжырымдамасы (15 сағат)',
      is_final: false,
      lessons: [
        { id: 3001, title: 'STEAM философиясы және халықаралық үздік тәжірибелер', content_type: 'video', order_index: 1 },
        { id: 3002, title: 'STEAM пәндерін интеграциялау принциптері', content_type: 'text', order_index: 2 }
      ]
    },
    {
      module_id: 302,
      module_title: '2-модуль. Пәнаралық байланыс және инженерия (25 сағат)',
      is_final: false,
      lessons: [
        { id: 3003, title: 'Ғылым, технология және өнерді сабақта тоғыстыру', content_type: 'video', order_index: 1 },
        { id: 3004, title: 'Оқушылармен ғылыми-зерттеу жобаларын жүргізу', content_type: 'practice', order_index: 2 }
      ]
    },
    {
      module_id: 303,
      module_title: '3-модуль. STEAM сабақ жоспарлары мен зертханалар (30 сағат)',
      is_final: false,
      lessons: [
        { id: 3005, title: 'Қолжетімді материалдармен STEAM тәжірибелер жасау', content_type: 'text', order_index: 1 },
        { id: 3006, title: 'ҚМЖ үлгілері және критериалды бағалау', content_type: 'practice', order_index: 2 }
      ]
    },
    {
      module_id: 304,
      module_title: '4-модуль. Сертификаттау және қорытынды сараптама (10 сағат)',
      is_final: true,
      lessons: [
        { id: 3007, title: '80 академиялық сағаттық аттестациялық бақылау', content_type: 'practice', order_index: 1 }
      ]
    }
  ],
  'ai-education-86h': [
    {
      module_id: 401,
      module_title: '1-модуль. Білім берудегі жасанды интеллект парадигмасы (16 сағат)',
      is_final: false,
      lessons: [
        { id: 4001, title: 'ЖИ негіздері, этикасы және мектептегі қолданылуы', content_type: 'video', order_index: 1 },
        { id: 4002, title: 'Педагогқа арналған заманауи нейрожелілер шолуы', content_type: 'text', order_index: 2 }
      ]
    },
    {
      module_id: 402,
      module_title: '2-модуль. Сабақ жоспарлау және материал дайындау (30 сағат)',
      is_final: false,
      lessons: [
        { id: 4003, title: 'Промпт-инжиниринг: сабақ жоспарларын 5 минутта генерациялау', content_type: 'practice', order_index: 1 },
        { id: 4004, title: 'Әртүрлі деңгейлі дидактикалық тапсырмалар құрастыру', content_type: 'practice', order_index: 2 }
      ]
    },
    {
      module_id: 403,
      module_title: '3-модуль. Визуалды және интерактивті контент жасау (30 сағат)',
      is_final: false,
      lessons: [
        { id: 4005, title: 'Нейрожелілер арқылы оқу презентациялары мен суреттер жасау', content_type: 'video', order_index: 1 },
        { id: 4006, title: 'Тесттер, викториналар мен интерактивті бағалау жүйелері', content_type: 'practice', order_index: 2 }
      ]
    },
    {
      module_id: 404,
      module_title: '4-модуль. Қорытынды аттестаттау (10 сағат)',
      is_final: true,
      lessons: [
        { id: 4007, title: 'AI-қолданылған авторлық сабақ жобасын тапсыру және 86 сағаттық тест', content_type: 'practice', order_index: 1 }
      ]
    }
  ]
};

async function getCourseData(identifier: string): Promise<{ course: CourseData; curriculum: ModuleData[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/courses/${identifier}`, {
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        let curriculum: ModuleData[] = [];
        try {
          const curRes = await fetch(`${API_BASE_URL}/courses/${data.id || identifier}/curriculum`, {
            next: { revalidate: 3600 }
          });
          if (curRes.ok) {
            curriculum = await curRes.json();
          }
        } catch {
          curriculum = DEFAULT_CURRICULUM[identifier] || DEFAULT_CURRICULUM[data.slug] || [];
        }

        return {
          course: {
            id: data.id,
            slug: data.slug || identifier,
            title: data.title,
            description: data.description,
            price: data.price,
            teacher_name: data.teacher_name,
            hours: data.title.includes('86') ? 86 : 80
          },
          curriculum: curriculum.length > 0 ? curriculum : (DEFAULT_CURRICULUM[identifier] || DEFAULT_CURRICULUM[data.slug] || [])
        };
      }
    }
  } catch (err) {
    // API not reachable or static build fallback
  }

  const fallback = CANONICAL_COURSES[identifier] || CANONICAL_COURSES['math-trigonometry-80h'];
  const curFallback = DEFAULT_CURRICULUM[identifier] || DEFAULT_CURRICULUM[fallback.slug || 'math-trigonometry-80h'] || DEFAULT_CURRICULUM['math-trigonometry-80h'];
  return {
    course: fallback,
    curriculum: curFallback
  };
}

export async function generateStaticParams() {
  return [
    { id: 'math-trigonometry-80h' },
    { id: 'python-pedagog-80h' },
    { id: 'steam-education-80h' },
    { id: 'ai-education-86h' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' }
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const { course } = await getCourseData(resolved.id);
  const hours = course.hours || (course.title.includes('86') ? '86' : '80');

  const title = `${course.title} (${hours} сағат) — аккредиттелген курс | ${APP_NAME}`;
  const description = `${course.description} Ресми аккредиттелген сертификат, педагогтарды аттестаттауға толық жарамды. Онлайн оқу.`;
  const canonicalUrl = `https://qallcert.kz/courses/${course.slug || resolved.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://qallcert.kz/kk/courses/${course.slug || resolved.id}`,
      languages: {
        'kk-KZ': `https://qallcert.kz/kk/courses/${course.slug || resolved.id}`,
        'ru-KZ': `https://qallcert.kz/ru/courses/${course.slug || resolved.id}`,
        'en-US': `https://qallcert.kz/en/courses/${course.slug || resolved.id}`,
        'x-default': `https://qallcert.kz/kk/courses/${course.slug || resolved.id}`
      }
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: APP_NAME,
      locale: 'kk_KZ',
      type: 'website'
    }
  };
}

export default async function PublicCoursePage({ params }: Props) {
  const resolved = await params;
  const { course, curriculum } = await getCourseData(resolved.id);
  const hours = course.hours || (course.title.includes('86') ? '86' : '80');
  const price = Number(course.price) || (course.title.includes('86') ? 18000 : 15000);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
          "@type": "EducationalOrganization",
          "name": APP_NAME,
          "legalName": "ТОО «QALLCert»",
          "url": "https://qallcert.kz",
          "taxID": "250240001104",
          "description": "ҚР ресми аккредиттелген педагогикалық біліктілікті арттыру орталығы (Аккредитация CAAAE № 25/20КА0003)"
        },
        "educationalCredentialAwarded": `Сертификат о повышении квалификации (${hours} академических часов для аттестации педагогов РК)`,
        "timeRequired": `PT${hours}H`,
        "inLanguage": ["kk", "ru"],
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": "KZT",
          "availability": "https://schema.org/InStock",
          "url": `https://qallcert.kz/courses/${course.slug || resolved.id}`
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "online",
          "courseWorkload": `${hours} academic hours`,
          "instructor": {
            "@type": "Person",
            "name": course.teacher_name || "QAllCert Академиялық кеңесі"
          }
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Бұл сертификатты аттестаттау комиссиясы (РайОО / ГорОО) қабылдай ма?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Иә, міндетті түрде қабылдайды. QAllCert платформасы ресми институционалдық аккредиттеу сертификатына ие (№ 25/20КА0003, Орталық Азия білім жүйесін аккредиттеу қауымдастығы CAAAE, БСН 250240001104). Курс бағдарламасы 80-86 академиялық сағатты құрайды, бұл Қазақстан Республикасының педагог қызметкерлерін аттестаттау ережелерінің талаптарына толық сәйкес келеді."
            }
          },
          {
            "@type": "Question",
            "name": "Оқыту және қорытынды тест қалай өтеді?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Оқыту толығымен қашықтан онлайн форматта өтеді. Сіз бейнесабақтарды, әдістемелік материалдар мен практикалық тапсырмаларды өзіңізге ыңғайлы уақытта оқисыз. Курс соңында онлайн тестілеу тапсырылады."
            }
          },
          {
            "@type": "Question",
            "name": "Курс аяқталған соң сертификат қашан беріледі?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Бірегей нөмірі мен қорғалған QR-коды бар электронды сертификат тестті сәтті тапсырғаннан кейін бірден жеке кабинетте дайын болады. Оны PDF форматында жүктеп алып, аттестациялық портфолиоға бірден тіркеуге болады."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Басты бет",
            "item": "https://qallcert.kz"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Курстар",
            "item": "https://qallcert.kz/#courses"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": course.title,
            "item": `https://qallcert.kz/courses/${course.slug || resolved.id}`
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CourseDetailsClient
        initialCourse={course}
        initialCurriculum={curriculum}
        courseIdentifier={resolved.id}
      />
    </>
  );
}
