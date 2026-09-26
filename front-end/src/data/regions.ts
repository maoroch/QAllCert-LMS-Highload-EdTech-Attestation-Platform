export interface RegionalFAQ {
  question: {
    kk: string;
    ru: string;
    en: string;
  };
  answer: {
    kk: string;
    ru: string;
    en: string;
  };
}

export interface RegionData {
  slug: string;
  names: {
    kk: string;
    ru: string;
    en: string;
  };
  regionTitle: {
    kk: string;
    ru: string;
    en: string;
  };
  metaTitle: {
    kk: string;
    ru: string;
    en: string;
  };
  metaDescription: {
    kk: string;
    ru: string;
    en: string;
  };
  department: {
    kk: string;
    ru: string;
    en: string;
  };
  schoolsInfo: {
    kk: string;
    ru: string;
    en: string;
  };
  features: {
    kk: string[];
    ru: string[];
    en: string[];
  };
  attestationNote: {
    kk: string;
    ru: string;
    en: string;
  };
  popularSlugs: string[];
  faqs: RegionalFAQ[];
}

export const REGIONS: Record<string, RegionData> = {
  shymkent: {
    slug: 'shymkent',
    names: {
      kk: 'Шымкент қаласы',
      ru: 'город Шымкент',
      en: 'Shymkent city'
    },
    regionTitle: {
      kk: 'Шымкент мұғалімдеріне арналған біліктілікті арттыру курстары (80–86 сағат)',
      ru: 'Курсы повышения квалификации для учителей Шымкента (80–86 часов)',
      en: 'Teacher Professional Development Courses in Shymkent (80–86 hours)'
    },
    metaTitle: {
      kk: 'Шымкент мұғалімдеріне арналған біліктілікті арттыру курстары 80-86 сағат | QAllCert',
      ru: 'Курсы повышения квалификации учителей в Шымкенте для аттестации | QAllCert',
      en: 'Teacher Certification Courses in Shymkent | QAllCert'
    },
    metaDescription: {
      kk: 'Шымкент қаласы мектептері мен колледждерінің педагогтары үшін аккредиттелген онлайн курстар (80-86 сағат). Ресми сертификат, QR-код, аттестаттау комиссиясына 100% жарамды.',
      ru: 'Аккредитованные онлайн курсы (80-86 часов) для педагогов школ и колледжей Шымкента. Официальный сертификат с QR-кодом для аттестации и ГорОО.',
      en: 'Accredited online professional development courses (80-86 hours) for school and college teachers in Shymkent. Official certificate for attestation.'
    },
    department: {
      kk: 'Шымкент қаласының білім басқармасы және қалалық білім бөлімдері (ГорОО / РайОО)',
      ru: 'Управление образования города Шымкент и районные отделы образования (ГорОО/РайОО)',
      en: 'Education Department of Shymkent city'
    },
    schoolsInfo: {
      kk: '170-тен астам мектептер, лицейлер, гимназиялар және 23 000-нан астам педагогтар',
      ru: 'Более 170 школ, лицеев, гимназий и свыше 23 000 педагогов',
      en: 'Over 170 schools, lyceums, gymnasiums and 23,000+ teachers'
    },
    features: {
      kk: [
        '100% қашықтықтан оқу: сабақтан қол үзбей, ыңғайлы уақытта оқу мүмкіндігі',
        'Шымкент қалалық білім басқармасының аттестаттау комиссиясына ресми жарамды',
        'CAAAE институционалдық аккредитациясы (№ 25/20КА0003, БСН 250240001104)',
        'Мектеп бухгалтериясына арналған ресми құжаттар (ЭСФ, шот-фактура, шарт)',
        'Kaspi Red және 0-0-12 бөліп төлеу арқылы оқу'
      ],
      ru: [
        '100% дистанционный формат: обучение в свободное от уроков время без отрыва от работы',
        'Официальное признание аттестационной комиссией Управления образования Шымкента',
        'Институциональная аккредитация CAAAE (№ 25/20КА0003, БИН 250240001104)',
        'Полный пакет закрывающих документов для школьной бухгалтерии (ЭСФ, АВР, договор)',
        'Оплата в рассрочку Kaspi Red и 0-0-12 без переплат'
      ],
      en: [
        '100% online self-paced study without disruption to school hours',
        'Officially accepted by the Shymkent Education Board attestation committee',
        'Accredited by CAAAE (No. 25/20KA0003, BIN 250240001104)',
        'Full set of accounting documents for schools (ESF, AVR, official contract)',
        'Installment payment via Kaspi Red and 0-0-12'
      ]
    },
    attestationNote: {
      kk: 'Шымкент қаласы мектептеріндегі мұғалімдерге кезекті немесе мерзімінен бұрын аттестаттаудан сәтті өту үшін 80 немесе 86 академиялық сағаттық сертификат толық жарамды және білім бөлімдерінде еш кедергісіз қабылданады.',
      ru: 'Для педагогов школ Шымкента сертификаты объемом 80 или 86 академических часов полностью соответствуют требованиям аттестации на категорию (модератор, сарапшы, зерттеуші, шебер).',
      en: 'Certificates of 80 or 86 academic hours fully comply with teacher qualification upgrades and category promotions in Shymkent.'
    },
    popularSlugs: ['math-trigonometry-80h', 'python-pedagog-80h', 'steam-education-80h', 'ai-education-86h'],
    faqs: [
      {
        question: {
          kk: 'Шымкент қалалық білім басқармасы бұл сертификаттарды қабылдай ма?',
          ru: 'Принимает ли Управление образования города Шымкент данные сертификаты?',
          en: 'Does the Shymkent City Department of Education accept these certificates?'
        },
        answer: {
          kk: 'Иә, әрине. QAllCert оқу орталығы Орталық Азия білім жүйесін аккредиттеу қауымдастығының (CAAAE) ресми институционалдық аккредитациясынан өткен (Куәлік № 25/20КА0003). Біздің барлық бағдарламаларымыз ҚР Оқу-ағарту министрлігінің талаптарына сай жасалған.',
          ru: 'Да, безусловно. Учебный центр QAllCert имеет официальную институциональную аккредитацию CAAAE (№ 25/20КА0003). Все программы разработаны согласно приказам Минпросвещения РК и принимаются аттестационными комиссиями.',
          en: 'Yes. QAllCert is officially accredited by CAAAE (No. 25/20KA0003) and all programs strictly meet the requirements of the Ministry of Education of the Republic of Kazakhstan.'
        }
      },
      {
        question: {
          kk: 'Шымкент қаласындағы мектептің есепшісі үшін құжаттар беріле ме?',
          ru: 'Предоставляются ли документы для бухгалтерии школы в Шымкенте?',
          en: 'Are accounting documents provided for school bookkeeping in Shymkent?'
        },
        answer: {
          kk: 'Иә. Егер мектеп немесе кәсіподақ комитеті төлем жасайтын болса, біз ресми шарт, төлем шоты және ЭСФ (электрондық шот-фактура) жүйесі арқылы орындалған жұмыстар актісін (АВР) ұсынамыз.',
          ru: 'Да. При безналичной оплате от школы или профкома оформляется официальный договор, счет на оплату и АВР через ИС ЭСФ.',
          en: 'Yes. Official contracts, commercial invoices, and electronic acts via the national ESF system are provided for school administrations.'
        }
      }
    ]
  },

  turkestan: {
    slug: 'turkestan',
    names: {
      kk: 'Түркістан облысы',
      ru: 'Туркестанская область',
      en: 'Turkistan region'
    },
    regionTitle: {
      kk: 'Түркістан облысы мұғалімдеріне арналған біліктілікті арттыру курстары (80–86 сағат)',
      ru: 'Курсы повышения квалификации учителей Туркестанской области (80–86 часов)',
      en: 'Teacher Professional Development Courses in Turkistan Region'
    },
    metaTitle: {
      kk: 'Түркістан облысы мұғалімдеріне біліктілікті арттыру курстары 80 сағат | QAllCert',
      ru: 'Курсы повышения квалификации учителей в Туркестанской области | QAllCert',
      en: 'Teacher Certification in Turkistan Region | QAllCert'
    },
    metaDescription: {
      kk: 'Түркістан облысы аудан және ауыл мектептерінің мұғалімдеріне арналған 100% қашықтықтан аккредиттелген курстар. Түркістан, Кентау, Сарыағаш, Жетісай, Ордабасы, Сайрам, Мақтаарал педагогтарына.',
      ru: 'Дистанционные курсы повышения квалификации (80-86 ч.) для учителей Туркестанской области (Туркестан, Кентау, Сарыагаш, Жетысай, Сайрам). Сертификаты для аттестации.',
      en: 'Online courses (80-86 hours) for teachers across the Turkistan region. Official accredited certificates for qualification upgrades.'
    },
    department: {
      kk: 'Түркістан облысының білім басқармасы және аудандық білім бөлімдері (РайОО)',
      ru: 'Управление образования Туркестанской области и районные отделы образования (РайОО)',
      en: 'Department of Education of Turkistan Region'
    },
    schoolsInfo: {
      kk: '1 000-нан астам мектеп, 65 000-нан астам ұстаздар мен тәрбиешілер қауымы',
      ru: 'Свыше 1 000 школ и более 65 000 педагогов и методистов',
      en: 'Over 1,000 schools and more than 65,000 teachers'
    },
    features: {
      kk: [
        'Ауыл мен аудан орталықтарынан облыс орталығына бармай-ақ үйден немесе мектептен оқу',
        'Түркістан облыстық білім басқармасының барлық аудандық бөлімдеріне жарамды',
        'Аттестаттауға арналған 80 және 86 академиялық сағаттық ресми сертификат',
        'Қазақ тіліндегі толық түсінікті видео-дәрістер және дайын ҚМЖ (сабақ жоспарлары)',
        'QR-кодпен дереу тексеру мүмкіндігі'
      ],
      ru: [
        'Обучение прямо из дома или школы: не требуется поездок в областной центр или города',
        'Полное признание районными отделами образования Туркестанской области',
        'Официальные сертификаты 80 и 86 академических часов для категории педагога',
        'Полноценные видеолекции и методические материалы (КСП/ҚМЖ) на казахском и русском языках',
        'Мгновенная проверка подлинности через реестр и QR-код'
      ],
      en: [
        'Study directly from home or school without traveling to regional centers',
        'Recognized by all district education offices across Turkistan Region',
        'Official 80 and 86 hour certificates for category attestation',
        'Comprehensive video lessons and lesson plans in Kazakh and Russian',
        'Instant verification via QR code and public register'
      ]
    },
    attestationNote: {
      kk: 'Түркістан облысы — еліміздегі мұғалімдер саны ең көп өңір. Ауылдық жердегі әріптестерімізге алыс жолға шықпай, сапалы білім алып, санатын (педагог-сарапшы, педагог-зерттеуші) көтеруге барлық жағдай жасалған.',
      ru: 'Туркестанская область лидирует по числу педагогов в РК. Онлайн-формат позволяет учителям сельских школ проходить обучение без отрыва от занятий и расходов на дорогу.',
      en: 'Turkistan region has the largest educator population in Kazakhstan. Online access enables rural teachers to advance without travel costs.'
    },
    popularSlugs: ['math-trigonometry-80h', 'python-pedagog-80h', 'steam-education-80h', 'ai-education-86h'],
    faqs: [
      {
        question: {
          kk: 'Ауылдық мектеп мұғалімдері үшін интернет байланысы баяу болса не істеу керек?',
          ru: 'Что делать учителям сельских школ, если скорость интернета ограничена?',
          en: 'What if internet connection is slow in rural school areas?'
        },
        answer: {
          kk: 'Платформа баяу интернет желісіне оңтайландырылған. Барлық дәрістер мен конспектілерді мобильді телефоннан да қарауға болады, сондай-ақ материалдарды жүктеп алып оқу қарастырылған.',
          ru: 'Платформа QAllCert оптимизирована для мобильных устройств и сетей с невысокой скоростью. Материалы доступны 24/7 с любого смартфона.',
          en: 'The QAllCert platform is optimized for mobile phones and low-bandwidth networks. Study materials are available 24/7.'
        }
      }
    ]
  },

  almaty: {
    slug: 'almaty',
    names: {
      kk: 'Алматы қаласы және Алматы облысы',
      ru: 'город Алматы и Алматинская область',
      en: 'Almaty city and region'
    },
    regionTitle: {
      kk: 'Алматы педагогтарына арналған біліктілікті арттыру курстары (80–86 сағат)',
      ru: 'Курсы повышения квалификации учителей Алматы (80–86 часов)',
      en: 'Teacher Qualification Courses in Almaty'
    },
    metaTitle: {
      kk: 'Алматы мұғалімдеріне арналған біліктілікті арттыру курстары 80-86 сағат | QAllCert',
      ru: 'Курсы повышения квалификации для учителей Алматы для аттестации | QAllCert',
      en: 'Teacher Certification in Almaty | QAllCert'
    },
    metaDescription: {
      kk: 'Алматы қаласы мен Алматы облысының мұғалімдеріне арналған аккредиттелген онлайн курстар (80-86 сағат). Математика, информатика, STEAM және жасанды интеллект бағыттары.',
      ru: 'Аккредитованные курсы повышения квалификации (80-86 ч.) для учителей гимназий, лицеев и школ г. Алматы. Официальный сертификат для аттестации педагогов.',
      en: 'Accredited teacher development courses in Almaty. Math, Python, STEAM, and AI in classrooms.'
    },
    department: {
      kk: 'Алматы қаласы Білім басқармасы және Алматы облысының білім басқармасы',
      ru: 'Управление образования города Алматы и Управление образования Алматинской области',
      en: 'Education Department of Almaty city & region'
    },
    schoolsInfo: {
      kk: '300-ден астам жетекші мектептер, лицейлер, гимназиялар және 35 000+ оқытушылар',
      ru: 'Более 300 школ, лицеев, гимназий и свыше 35 000 преподавателей',
      en: 'Over 300 schools, gymnasiums and 35,000+ educators'
    },
    features: {
      kk: [
        'Заманауи әдістемелер: AI нейрожелілер, STEAM жобалау, олимпиадалық математика және Python',
        'Алматы қалалық және облыстық білім басқармаларының аттестаттауына 100% жарамды',
        'Институционалдық аккредитация CAAAE куәлігі № 25/20КА0003',
        'Kaspi және банк карточкалары арқылы қауіпсіз төлем',
        'Сертификатты цифрлық тізілімнен жылдам тексеру'
      ],
      ru: [
        'Передовые тренды: генеративный искусственный интеллект, STEAM, олимпиадная математика и программирование',
        '100% признание аттестационными комиссиями УО города Алматы и Алматинской области',
        'Институциональная аккредитация CAAAE (свидетельство № 25/20КА0003)',
        'Безопасная оплата картой или через Kaspi Red / рассрочку 0-0-12',
        'Моментальная онлайн-верификация сертификата для руководства школы'
      ],
      en: [
        'Cutting-edge trends: AI neural networks, STEAM, math, and programming',
        '100% recognized by Almaty city and regional education boards',
        'Institutional accreditation by CAAAE',
        'Secure payments via Kaspi and card installments',
        'Instant digital verification for school principals'
      ]
    },
    attestationNote: {
      kk: 'Алматының инновациялық мектептері мен лицейлерінің ұстаздары біздің STEAM және Жасанды Интеллект (86 сағат) бағдарламаларын жоғары бағалап, портфолиосына сәтті қосып келеді.',
      ru: 'Педагоги лицеев и гимназий Алматы активно используют сертификаты QAllCert по STEAM и ИИ (86 часов) для подтверждения высших квалификационных категорий.',
      en: 'Educators in Almaty gymnasiums actively apply QAllCert certificates in STEAM and AI to qualify for top categories.'
    },
    popularSlugs: ['ai-education-86h', 'steam-education-80h', 'python-pedagog-80h', 'math-trigonometry-80h'],
    faqs: [
      {
        question: {
          kk: 'Алматы мектептеріндегі мұғалімдер үшін сертификат қалай жеткізіледі?',
          ru: 'Как доставляется сертификат учителям школ Алматы?',
          en: 'How is the certificate delivered to teachers in Almaty?'
        },
        answer: {
          kk: 'Курсты аяқтаған соң сертификат бірден жеке кабинетте PDF форматында қолжетімді болады және ресми QR-кодпен қорғалған. Оны басып шығарып немесе электронды түрде аттестаттау портфолиосына тіркеуге болады.',
          ru: 'Сразу после завершения курса электронный сертификат с защитным QR-кодом и печатью формируется в личном кабинете. Вы можете скачать PDF и распечатать в высоком качестве.',
          en: 'Upon completion, a high-resolution PDF certificate with a verified QR code is generated instantly in your account.'
        }
      }
    ]
  },

  astana: {
    slug: 'astana',
    names: {
      kk: 'Астана қаласы және Ақмола облысы',
      ru: 'город Астана и Акмолинская область',
      en: 'Astana city and Akmola region'
    },
    regionTitle: {
      kk: 'Астана қаласы мұғалімдеріне арналған біліктілікті арттыру курстары (80–86 сағат)',
      ru: 'Курсы повышения квалификации учителей Астаны (80–86 часов)',
      en: 'Teacher Professional Development Courses in Astana'
    },
    metaTitle: {
      kk: 'Астана мұғалімдеріне арналған біліктілікті арттыру курстары 80-86 сағат | QAllCert',
      ru: 'Курсы повышения квалификации учителей в Астане для аттестации | QAllCert',
      en: 'Teacher Certification Courses in Astana | QAllCert'
    },
    metaDescription: {
      kk: 'Астана қаласы мен Ақмола облысы ұстаздарына арналған аккредиттелген онлайн курстар (80-86 сағат). Ресми сертификат, аттестаттау талаптарына толық сәйкестік.',
      ru: 'Официальные аккредитованные курсы (80-86 часов) для педагогов Астаны и Акмолинской области. Сертификаты государственного образца для аттестации.',
      en: 'Official accredited courses (80-86 hours) for teachers in Astana and Akmola region.'
    },
    department: {
      kk: 'Астана қаласының білім басқармасы және Ақмола облысының білім басқармасы',
      ru: 'Управление образования города Астана и Управление образования Акмолинской области',
      en: 'Education Department of Astana city & Akmola region'
    },
    schoolsInfo: {
      kk: '200-ден астам елордалық мектептер, BINOM, инновациялық лицейлер және 25 000+ педагог',
      ru: 'Более 200 столичных школ, школ BINOM, лицеев и свыше 25 000 педагогов',
      en: 'Over 200 capital schools, BINOM schools, and 25,000+ teachers'
    },
    features: {
      kk: [
        'Елорданың жетекші білім ошақтарының аттестаттау комиссияларында 100% қабылданады',
        'ҚР білім беру стандартына толық сай келетін цифрлық технологиялар курстары',
        'Институционалдық аккредитация CAAAE куәлігі № 25/20КА0003',
        'Электрондық шот-фактура және заңды құжаттармен қамтамасыз ету',
        'Тәулік бойы (24/7) платформаға қолжетімділік'
      ],
      ru: [
        '100% соответствие требованиям аттестации столичных школ и лицеев',
        'Инновационные программы по ИИ, STEAM и IT-технологиям в образовании',
        'Официальная аккредитация CAAAE (№ 25/20КА0003, БИН 250240001104)',
        'Оформление ЭСФ, договоров и актов для организаций образования',
        'Круглосуточный онлайн-доступ к лекциям без привязки ко времени'
      ],
      en: [
        'Full compliance with the attestation requirements of capital schools',
        'Cutting edge curricula on AI, STEAM, and Python',
        'Accreditation by CAAAE (No. 25/20KA0003)',
        'Invoices and accounting contracts provided',
        '24/7 online access'
      ]
    },
    attestationNote: {
      kk: 'Астана мектептеріндегі цифрландыру талаптары өте жоғары. Біздің «Білім берудегі жасанды интеллект» (86 сағат) бағдарламамыз заманауи педагогтың негізгі артықшылығына айналады.',
      ru: 'Для педагогов Астаны владение цифровыми инструментами критично. Сертификат по ИИ на 86 часов подтверждает высокую квалификацию педагога-исследователя и мастера.',
      en: 'Digital fluency is paramount in Astana schools. Our 86-hour AI course serves as a key asset for teachers.'
    },
    popularSlugs: ['ai-education-86h', 'python-pedagog-80h', 'math-trigonometry-80h', 'steam-education-80h'],
    faqs: [
      {
        question: {
          kk: 'Астанадағы мектептер мен BINOM желісі бұл сертификатты қабылдай ма?',
          ru: 'Принимают ли школы Астаны и школы BINOM эти сертификаты?',
          en: 'Do schools in Astana and the BINOM network accept these certificates?'
        },
        answer: {
          kk: 'Иә. Сертификаттар аккредиттелген ұйым тарапынан беріледі және барлық мемлекеттік әрі жеке мектептердің аттестаттау комиссиялары үшін толық заңды күшке ие.',
          ru: 'Да. Сертификаты выдаются аккредитованной организацией ТОО «QALLCert» и обладают полной юридической силой для государственных и частных школ.',
          en: 'Yes. Issued by accredited provider QALLCert LLP, certificates are fully valid for state and private school boards.'
        }
      }
    ]
  },

  taraz: {
    slug: 'taraz',
    names: {
      kk: 'Жамбыл облысы, Тараз қаласы',
      ru: 'Жамбылская область, г. Тараз',
      en: 'Zhambyl region, Taraz'
    },
    regionTitle: {
      kk: 'Жамбыл облысы және Тараз мұғалімдеріне арналған біліктілікті арттыру курстары (80–86 сағат)',
      ru: 'Курсы повышения квалификации для учителей Жамбылской области и Тараза (80–86 часов)',
      en: 'Teacher Certification in Zhambyl Region & Taraz'
    },
    metaTitle: {
      kk: 'Тараз және Жамбыл облысы мұғалімдеріне біліктілікті арттыру курстары 80 сағат | QAllCert',
      ru: 'Курсы повышения квалификации учителей в Таразе и Жамбылской области | QAllCert',
      en: 'Teacher Qualification Courses in Taraz | QAllCert'
    },
    metaDescription: {
      kk: 'Тараз қаласы және Жамбыл облысының аудан-ауыл мектептері ұстаздарына арналған 80-86 сағаттық аккредиттелген курстар. Қордай, Меркі, Шу, Байзақ мұғалімдеріне онлайн.',
      ru: 'Онлайн-курсы повышения квалификации (80-86 ч.) для педагогов Тараза и Жамбылской области (Кордай, Мерке, Шу, Байзак). Официальные сертификаты с QR для аттестации.',
      en: 'Online teacher courses for Zhambyl region and Taraz. 80-86 academic hours, accredited certification.'
    },
    department: {
      kk: 'Жамбыл облысы әкімдігінің білім басқармасы және аудандық білім бөлімдері',
      ru: 'Управление образования акимата Жамбылской области и районные отделы образования',
      en: 'Department of Education of Zhambyl Region'
    },
    schoolsInfo: {
      kk: '450-ден астам мектеп және 30 000-нан астам мұғалімдер мен тәрбиешілер',
      ru: 'Свыше 450 школ и более 30 000 учителей',
      en: 'Over 450 schools and 30,000+ educators'
    },
    features: {
      kk: [
        'Тараз қаласы мен аудандардан облыс орталығына бармай, өз үйіңізден оқу',
        'Жамбыл облыстық білім басқармасының барлық талаптарына сай аккредитация',
        'Қазақ тіліндегі толық түсінікті материалдар және дайын әдістемелік құралдар',
        'Kaspi Red / бөліп төлеу қарастырылған',
        'Нәтижесінде мемлекеттік үлгідегі QR-кодты ресми сертификат беріледі'
      ],
      ru: [
        'Дистанционное обучение для учителей Тараза и сельских районов Жамбылской области',
        'Соответствие правилам аттестации Управления образования Жамбылской области',
        'Методические материалы на казахском и русском языках',
        'Удобная оплата частями через Kaspi Red',
        'Официальный защищенный сертификат с QR-кодом'
      ],
      en: [
        'Remote study for teachers in Taraz and rural districts',
        'Full compliance with Zhambyl regional education board',
        'Bilingual learning resources',
        'Kaspi Red installment support',
        'QR-verified accredited certificate'
      ]
    },
    attestationNote: {
      kk: 'Жамбыл облысының ұстаздары аттестаттау комиссиясына құжат өткізгенде сағат саны мен аккредитация куәлігіне ерекше мән береді. QAllCert куәлігі № 25/20КА0003 бұл талаптарды толық орындайды.',
      ru: 'Сертификаты QAllCert на 80 и 86 академических часов принимаются всеми районными комиссиями Жамбылской области при присвоении и подтверждении категорий.',
      en: 'QAllCert certificates fulfill all qualification requirements for Zhambyl regional school evaluation committees.'
    },
    popularSlugs: ['math-trigonometry-80h', 'steam-education-80h', 'ai-education-86h', 'python-pedagog-80h'],
    faqs: [
      {
        question: {
          kk: 'Аудандық білім бөлімдері (РайОО) онлайн сертификатты қабылдай ма?',
          ru: 'Принимают ли районные отделы образования (РайОО) электронные сертификаты?',
          en: 'Do district education departments accept electronic certificates?'
        },
        answer: {
          kk: 'Иә, ҚР Заңнамасына сәйкес электрондық цифрлық қолтаңба және QR-кодпен расталған құжаттар қағаз түріндегі құжатпен бірдей заңды күшке ие.',
          ru: 'Да, согласно закону РК об электронном документообороте, сертификаты с QR-кодом и проверкой через реестр имеют равную юридическую силу.',
          en: 'Yes, pursuant to Kazakhstan law on electronic documents, QR-verified digital certificates possess full legal validity.'
        }
      }
    ]
  },

  karaganda: {
    slug: 'karaganda',
    names: {
      kk: 'Қарағанды облысы',
      ru: 'Карагандинская область',
      en: 'Karaganda region'
    },
    regionTitle: {
      kk: 'Қарағанды облысы мұғалімдеріне арналған біліктілікті арттыру курстары (80–86 сағат)',
      ru: 'Курсы повышения квалификации учителей Карагандинской области (80–86 часов)',
      en: 'Teacher Certification in Karaganda Region'
    },
    metaTitle: {
      kk: 'Қарағанды мұғалімдеріне біліктілікті арттыру курстары 80 сағат | QAllCert',
      ru: 'Курсы повышения квалификации учителей в Караганде для аттестации | QAllCert',
      en: 'Teacher Qualification Courses in Karaganda | QAllCert'
    },
    metaDescription: {
      kk: 'Қарағанды, Теміртау, Балқаш, Саран мұғалімдеріне арналған аккредиттелген онлайн курстар (80-86 сағат). Ресми сертификат, аттестаттау комиссиясына 100% жарамды.',
      ru: 'Онлайн-курсы повышения квалификации (80-86 ч.) для педагогов Караганды, Темиртау, Балхаша. Сертификат с QR-кодом для аттестации.',
      en: 'Accredited teacher courses in Karaganda, Temirtau, and Balkhash. 80-86 hours for qualification upgrade.'
    },
    department: {
      kk: 'Қарағанды облысының білім басқармасы және қалалық/аудандық білім бөлімдері',
      ru: 'Управление образования Карагандинской области и городские/районные отделы образования',
      en: 'Education Department of Karaganda Region'
    },
    schoolsInfo: {
      kk: '400-ден астам мектептер, IT-лицейлер мен колледждер, 28 000+ педагог',
      ru: 'Свыше 400 школ, IT-лицеев и колледжей, более 28 000 педагогов',
      en: 'Over 400 schools, IT-lyceums and colleges, 28,000+ teachers'
    },
    features: {
      kk: [
        'Информатика, математика және цифрлық сауаттылықты арттыруға арналған күшті бағдарламалар',
        'Қарағанды облыстық білім басқармасының аттестаттау комиссиясына толық жарамды',
        'CAAAE аккредитация куәлігі № 25/20КА0003',
        'Мектептер мен колледждерге заңды құжаттар топтамасы',
        'Қашықтықтан ыңғайлы оқу'
      ],
      ru: [
        'Сильные программы по информатике, математике и внедрению искусственного интеллекта',
        'Полное соответствие требованиям аттестации в Карагандинской области',
        'Аккредитация CAAAE (свидетельство № 25/20КА0003, БИН 250240001104)',
        'Закрывающие бухгалтерские документы для школ и отделов образования',
        'Удобный дистанционный график обучения 24/7'
      ],
      en: [
        'Strong curriculum in computer science, math, and AI technologies',
        'Compliant with Karaganda regional qualification upgrade mandates',
        'Accreditation by CAAAE (No. 25/20KA0003)',
        'School accounting documents provided',
        'Flexible 24/7 self-paced format'
      ]
    },
    attestationNote: {
      kk: 'Қарағанды облысының информатика және жаратылыстану пәні мұғалімдеріне «Python бағдарламалау тілі» және «Жасанды интеллект» курстары аттестаттауда үлкен артықшылық береді.',
      ru: 'Учителям информатики и точных наук Карагандинской области курсы по Python и ИИ помогают набрать максимальный балл при защите педагогического портфолио.',
      en: 'In Karaganda region, certificates in Python and AI provide significant competitive advantages during portfolio defense.'
    },
    popularSlugs: ['python-pedagog-80h', 'ai-education-86h', 'math-trigonometry-80h', 'steam-education-80h'],
    faqs: [
      {
        question: {
          kk: 'Колледж оқытушылары бұл курстарды өте ала ма?',
          ru: 'Подходят ли данные курсы для преподавателей колледжей Караганды?',
          en: 'Are these courses suitable for college instructors in Karaganda?'
        },
        answer: {
          kk: 'Иә, біздің 80 және 86 сағаттық бағдарламаларымыз мектеп мұғалімдерімен қатар техникалық және кәсіптік білім беру (ТиПО) колледждерінің оқытушылары үшін де аккредиттелген.',
          ru: 'Да, наши курсы подходят как школьным учителям, так и преподавателям колледжей системы ТиПО.',
          en: 'Yes, our accredited courses serve both general secondary school teachers and vocational college faculty.'
        }
      }
    ]
  },

  aktobe: {
    slug: 'aktobe',
    names: {
      kk: 'Ақтөбе облысы',
      ru: 'Актюбинская область',
      en: 'Aktobe region'
    },
    regionTitle: {
      kk: 'Ақтөбе облысы мұғалімдеріне арналған біліктілікті арттыру курстары (80–86 сағат)',
      ru: 'Курсы повышения квалификации учителей Актюбинской области (80–86 часов)',
      en: 'Teacher Certification in Aktobe Region'
    },
    metaTitle: {
      kk: 'Ақтөбе мұғалімдеріне біліктілікті арттыру курстары 80 сағат | QAllCert',
      ru: 'Курсы повышения квалификации учителей в Актобе для аттестации | QAllCert',
      en: 'Teacher Qualification Courses in Aktobe | QAllCert'
    },
    metaDescription: {
      kk: 'Ақтөбе қаласы және Ақтөбе облысының аудан мектептері ұстаздарына арналған 80-86 сағаттық ресми курстар. Хромтау, Қандыағаш, Шалқар мұғалімдеріне қашықтықтан оқу.',
      ru: 'Курсы повышения квалификации (80-86 ч.) для педагогов Актобе и Актюбинской области (Хромтау, Кандыагаш, Шалкар). Официальные документы для аттестации.',
      en: 'Teacher professional development courses in Aktobe and Aktobe region. 80-86 hours online.'
    },
    department: {
      kk: 'Ақтөбе облысының білім басқармасы және қалалық/аудандық білім бөлімдері',
      ru: 'Управление образования Актюбинской области и районные отделы образования',
      en: 'Education Department of Aktobe Region'
    },
    schoolsInfo: {
      kk: '410-дан астам мектеп, 26 000-нан астам білім беру саласының мамандары',
      ru: 'Свыше 410 школ и более 26 000 специалистов образования',
      en: 'Over 410 schools and 26,000+ educational professionals'
    },
    features: {
      kk: [
        'Батыс Қазақстан педагогтарына ыңғайлы қашықтықтан білім беру форматы',
        'Ақтөбе облыстық білім басқармасының барлық аудандық бөлімдері үшін ресми жарамды',
        'Орталық Азия білім жүйесін аккредиттеу қауымдастығы (CAAAE) мақұлдаған',
        'Мектеп бухгалтериясына арналған ресми құжаттар (ЭСФ, актілер)',
        'Қолжетімді баға және Kaspi Red арқылы төлеу'
      ],
      ru: [
        'Удобный онлайн-формат для педагогов Западного Казахстана без командировочных расходов',
        'Признание аттестационными комиссиями районных отделов образования Актюбинской области',
        'Официальная аккредитация CAAAE (№ 25/20КА0003)',
        'Полный пакет документов для бухгалтерии школы (ЭСФ, договор)',
        'Доступная стоимость и оплата через Kaspi Red'
      ],
      en: [
        'Convenient distance learning for educators in Western Kazakhstan',
        'Accepted across all Aktobe regional education districts',
        'Accreditation by CAAAE (No. 25/20KA0003)',
        'Complete invoices and documents for schools',
        'Affordable tuition with Kaspi Red'
      ]
    },
    attestationNote: {
      kk: 'Ақтөбе облысындағы мектеп мұғалімдеріне санатын растау немесе көтеру үшін 80 сағаттық көлем заңнамалық талап болып табылады. QAllCert сертификаты бұл талапқа толық сай келеді.',
      ru: 'Для подтверждения или повышения квалификационной категории учителям Актюбинской области необходимы 80 академических часов. Сертификаты QAllCert гарантируют полное соответствие правилам.',
      en: 'An 80-hour volume is mandatory for teacher attestation in Aktobe region. QAllCert certificates fully fulfill this criteria.'
    },
    popularSlugs: ['math-trigonometry-80h', 'steam-education-80h', 'python-pedagog-80h', 'ai-education-86h'],
    faqs: [
      {
        question: {
          kk: 'Ақтөбе облысы аудандарынан қалай жазылуға болады?',
          ru: 'Как записаться на курс учителю из районного центра Актюбинской области?',
          en: 'How can a teacher from an Aktobe district register for a course?'
        },
        answer: {
          kk: 'Сайттан қажетті курсты таңдап, «Курсқа тіркелу» түймесін басыңыз. Төлем жасалған соң оқу материалдарына бірден қолжетімділік ашылады.',
          ru: 'Выберите нужный курс на сайте и нажмите кнопку регистрации. Доступ к учебным видеоматериалам открывается моментально после оплаты.',
          en: 'Select the desired course on the site and click enroll. Access opens immediately.'
        }
      }
    ]
  },

  kyzylorda: {
    slug: 'kyzylorda',
    names: {
      kk: 'Қызылорда облысы',
      ru: 'Кызылординская область',
      en: 'Kyzylorda region'
    },
    regionTitle: {
      kk: 'Қызылорда облысы мұғалімдеріне арналған біліктілікті арттыру курстары (80–86 сағат)',
      ru: 'Курсы повышения квалификации учителей Кызылординской области (80–86 часов)',
      en: 'Teacher Certification in Kyzylorda Region'
    },
    metaTitle: {
      kk: 'Қызылорда мұғалімдеріне біліктілікті арттыру курстары 80 сағат | QAllCert',
      ru: 'Курсы повышения квалификации учителей в Кызылорде для аттестации | QAllCert',
      en: 'Teacher Qualification Courses in Kyzylorda | QAllCert'
    },
    metaDescription: {
      kk: 'Қызылорда қаласы және Қызылорда облысының аудан мектептері (Арал, Қазалы, Қармақшы, Жалағаш, Сырдария, Шиелі, Жаңақорған) мұғалімдеріне арналған 80-86 сағаттық аккредиттелген онлайн курстар.',
      ru: 'Дистанционные курсы повышения квалификации (80-86 ч.) для педагогов Кызылорды и Кызылординской области (Аральск, Казалинск, Шиели, Жанакорган). Официальные сертификаты с QR.',
      en: 'Online teacher courses for Kyzylorda region. 80-86 hours accredited qualification upgrade.'
    },
    department: {
      kk: 'Қызылорда облысының білім басқармасы және аудандық білім бөлімдері',
      ru: 'Управление образования Кызылординской области и районные отделы образования',
      en: 'Education Department of Kyzylorda Region'
    },
    schoolsInfo: {
      kk: '310-нан астам мектеп және 21 000-нан астам ұстаздар қауымы',
      ru: 'Свыше 310 школ и более 21 000 педагогов',
      en: 'Over 310 schools and 21,000+ educators'
    },
    features: {
      kk: [
        'Шалғай аудандардан облыс орталығына бармай-ақ, 100% онлайн оқу мүмкіндігі',
        'Қызылорда облыстық білім басқармасының аттестаттау комиссиясына толық жарамды',
        'CAAAE ұлттық аккредитация куәлігі № 25/20КА0003',
        'Сертификатты цифрлық тізілім және QR-код арқылы тексеру',
        'Kaspi Red бөліп төлеу'
      ],
      ru: [
        'Обучение 100% онлайн без необходимости выезда из отдаленных районов области',
        'Полное соответствие требованиям аттестационной комиссии Кызылординской области',
        'Институциональная аккредитация CAAAE (№ 25/20КА0003)',
        'Проверка подлинности сертификата в публичном реестре',
        'Рассрочка через Kaspi Red'
      ],
      en: [
        '100% remote format without traveling from remote districts',
        'Fully accepted by Kyzylorda regional school boards',
        'Accreditation by CAAAE (No. 25/20KA0003)',
        'Public register QR-code verification',
        'Installments via Kaspi Red'
      ]
    },
    attestationNote: {
      kk: 'Қызылорда облысының ұстаздары үшін сағат саны (80/86 сағат) мен куәлік нөмірінің түпнұсқалығы өте маңызды. QAllCert ұсынатын құжаттар барлық тексерулерден сәтті өтеді.',
      ru: 'Сертификаты QAllCert на 80 и 86 часов признаются всеми районными отделами образования Кызылординской области при аттестации педагогов.',
      en: 'QAllCert 80 and 86-hour certificates are approved by all district education offices of Kyzylorda region.'
    },
    popularSlugs: ['math-trigonometry-80h', 'steam-education-80h', 'ai-education-86h', 'python-pedagog-80h'],
    faqs: [
      {
        question: {
          kk: 'Сертификатты мектеп директоры немесе комиссия қалай тексере алады?',
          ru: 'Как директор школы или комиссия могут проверить сертификат в Кызылорде?',
          en: 'How can a school principal verify a certificate in Kyzylorda?'
        },
        answer: {
          kk: 'Сертификаттағы арнайы QR-кодты кез келген телефон камерасымен сканерлеу немесе qallcert.kz/certificates/verify сайтына нөмірін енгізу арқылы тыңдаушының аты-жөні, сағат саны және аккредитация туралы мәліметті лезде көруге болады.',
          ru: 'Достаточно отсканировать QR-код камерой смартфона или ввести номер на странице qallcert.kz/certificates/verify, чтобы увидеть статус документа и данные слушателя.',
          en: 'Simply scan the QR code with any smartphone camera or enter the number on qallcert.kz/certificates/verify to inspect verification details.'
        }
      }
    ]
  }
};

export const ALL_REGION_SLUGS = Object.keys(REGIONS);
