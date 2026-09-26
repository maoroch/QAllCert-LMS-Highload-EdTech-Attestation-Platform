export const dictionaries = {
  ru: {
    seo: {
      home: {
        title: "QAllCert — Аккредитованные курсы повышения квалификации педагогов (Казахстан)",
        description: "Официальные курсы повышения квалификации для учителей и педагогов Казахстана (80 и 86 академических часов). Аккредитованный сертификат для аттестации. Онлайн-обучение.",
      },
      pricing: {
        title: "Тарифы QAllCert — Доступные решения для обучения в Казахстане",
        description: "Гибкие тарифные планы QAllCert для школ и педагогов в Казахстане. Оплата в KZT, интеграция со Stripe, закрывающие документы для ТОО и ИП.",
      },
      features: {
        title: "Возможности QAllCert — Платформа для обучения (LMS)",
        description: "Узнайте о возможностях QAllCert: роли (Студент, Учитель, Администратор), надежная архитектура (Nginx, Redis, MinIO), автогенерация сертификатов.",
      },
      contacts: {
        title: "Контакты QAllCert — Офисы в Алматы и Астане",
        description: "Свяжитесь с командой QAllCert. Наши офисы: БЦ на Аль-Фараби (Алматы) и EXPO-центр (Астана).",
      }
    },
    accreditation: {
      badge: "Аккредитованная организация",
      title: "Официальный сертификат об институциональной аккредитации",
      subtitle: "Свидетельство CAAAE об институциональной аккредитации ТОО «QALLCert» (БИН 250240001104).",
      viewDoc: "Посмотреть сертификат аккредитации (PDF)",
      hoursNote: "Курсы на 80 и 86 академических часов под аттестацию педагогов РК",
      validityNote: "Сертификаты официально учитываются аттестационными комиссиями управлений образования",
      docNumber: "№ 25/20КА0003",
      bin: "250240001104",
      validity: "11.04.2025 – 10.04.2028",
      agency: "CAAAE (Центрально-Азиатская Ассоциация по аккредитации образования)"
    },
    home: {
      heroTitle: "Повышение квалификации педагогов с",
      heroSubtitle: "Официальные аккредитованные онлайн-курсы для учителей и преподавателей Казахстана. Программы на 80 и 86 академических часов с выдачей верифицируемого сертификата для аттестации.",
      ctaStart: "Выбрать курс",
      ctaDemo: "Документ об аккредитации",
      stats: [
        { value: "80-86", label: "Академических часов" },
        { value: "100%", label: "Аккредитация для аттестации" },
        { value: "QR-код", label: "Верификация сертификата" },
        { value: "24/7", label: "Доступ к платформе" }
      ],
      benefitsTitle: "Как устроено обучение",
      benefits: [
        { title: "Интерактивная практика", desc: "Решай задачи по Python, JavaScript, Go прямо в браузере с мгновенным фидбеком." },
        { title: "Командные проекты", desc: "Участвуй в реальной разработке, пиши код в команде и учись работать с Git." },
        { title: "Ревью кода", desc: "Твой код проверяют опытные менторы из топовых IT-компаний Казахстана." },
        { title: "Сертификаты в LinkedIn", desc: "Получи официальный цифровой сертификат, подтверждающий твои навыки." },
        { title: "Портфолио на GitHub", desc: "Все твои курсовые работы превратятся в готовые репозитории на GitHub." },
        { title: "Помощь в карьере", desc: "Готовим к собеседованиям, составляем резюме и рекомендуем лучшим компаниям." }
      ],
      testimonialsTitle: "Истории успеха наших студентов",
      testimonials: [
        { text: "Благодаря курсу по React устроился Junior-разработчиком в стартап в Алматы на третьем курсе университета.", author: "Адильбек Сериков", location: "Алматы" },
        { text: "Автопроверка задач — это супер. Не нужно ждать преподавателя, сразу видишь ошибки в коде. Прошла курс по Python.", author: "Мария Волкова", location: "Астана" },
        { text: "Очень сильная программа по алгоритмам. Помогла пройти технический отбор в крупную финтех-компанию.", author: "Бахтияр Нургалиев", location: "Шымкент" }
      ],
      coursesTitle: "Курсы повышения квалификации (для аттестации)",
      courses: [
        { 
          id: 1,
          slug: "math-trigonometry-80h",
          title: "«Математика пәні мұғалімдеріне тригонометриялық теңдеулер мен теңсіздіктер» тарауына проблемалық оқыту технологиясын пайдалану", 
          level: "Педагогтарға", 
          duration: "80 сағат", 
          desc: "Математика мұғалімдеріне тригонометрияны проблемалық оқыту әдістемесі. Аттестаттауға арналған 80 академиялық сағаттық аккредиттелген курс." 
        },
        { 
          id: 2,
          slug: "python-pedagog-80h",
          title: "«Python бағдарламалау тілі: теориясы мен практикасы»", 
          level: "Информатика мұғалімдеріне", 
          duration: "80 сағат", 
          desc: "Python тілін мектепте оқыту әдістемесі және практикалық программалау. 80 академиялық сағат, ресми сертификат." 
        },
        { 
          id: 3,
          slug: "steam-education-80h",
          title: "«STEAM білім беру: білім алушылармен жұмыс жасау технологиялары мен формалары»", 
          level: "Мұғалімдерге", 
          duration: "80 сағат", 
          desc: "Инновациялық STEAM оқыту әдістері, сабақ жоспарлары мен жобалық жұмыстар. 80 академиялық сағаттық біліктілікті арттыру." 
        },
        { 
          id: 4,
          slug: "ai-education-86h",
          title: "«Білім берудегі жасанды интеллект технологиялары: теориясы мен практикасы»", 
          level: "Барлық пән мұғалімдеріне", 
          duration: "86 сағат", 
          desc: "Оқу процесінде жасанды интеллект пен нейрожелілерді тиімді пайдалану. 86 академиялық сағат, аттестацияға жарамды ресми сертификат." 
        }
      ],
      howItWorksTitle: "Как проходит повышение квалификации",
      howItWorks: [
        { step: "01", title: "Выбираете программу курса", desc: "Выберите курс на 80 или 86 академических часов по вашему предмету или направлению (математика, IT, STEAM, AI)." },
        { step: "02", title: "Обучаетесь онлайн в удобном темпе", desc: "Изучайте лекции, современные методики преподавания, типовые КСП/ҚМЖ и дидактические материалы 24/7." },
        { step: "03", title: "Сдаете итоговое тестирование", desc: "Проходите аттестационный тест в личном кабинете. Доступно несколько попыток без стресса и очередей." },
        { step: "04", title: "Получаете официальный сертификат", desc: "Моментальная выдача сертификата с уникальным номером, печатью и QR-кодом для прикрепления к аттестационному портфолио." }
      ],
      editorTitle: "Современная цифровая среда для педагогов",
      editorSubtitle: "Доступ к лекциям, презентациям и готовым поурочным планам с любого устройства — компьютера, планшета или смартфона.",
      studentFaqTitle: "Часто задаваемые вопросы учителей",
      studentFaqs: [
        { q: "Примет ли аттестационная комиссия этот сертификат?", a: "Да, безусловно. ТОО «QALLCert» обладает официальной институциональной аккредитацией CAAAE (№ 25/20КА0003, БИН 250240001104). Программы рассчитаны на 80 и 86 академических часов и полностью соответствуют правилам аттестации педагогических работников РК." },
        { q: "Как быстро выдается сертификат после прохождения курса?", a: "Электронный сертификат с защитным QR-кодом генерируется моментально в вашем личном кабинете сразу после успешной сдачи итогового теста. Вы можете сразу скачать его в PDF." },
        { q: "Предоставляются ли закрывающие документы для школы или профсоюза?", a: "Да, мы предоставляем официальный договор, электронный акт выполненных работ (ЭСФ) и фискальный чек для школьной бухгалтерии или профсоюзной компенсации." },
        { q: "Можно ли совмещать обучение с уроками в школе?", a: "Да, курс полностью дистанционный. Вы можете изучать материалы вечером, на выходных или во время каникул в комфортном для себя ритме." }
      ],
      ctaTitle: "Готовы повысить категорию и пройти аттестацию?",
      ctaSubtitle: "Начните обучение на официальном аккредитованном курсе уже сегодня и получите сертификат государственного образца.",
      ctaButton: "Выбрать курс и начать"
    },
    pricing: {
      toggleMonthly: "Ежемесячно",
      toggleYearly: "Ежегодно (-20%)",
      plans: [
        { name: "Базовый", price: "15 000", features: ["До 100 студентов", "Базовая аналитика", "Поддержка по email"] },
        { name: "Бизнес", price: "45 000", features: ["До 1000 студентов", "Интеграция со Stripe", "Выдача сертификатов", "Приоритетная поддержка"], highlight: true },
        { name: "Корпоративный", price: "Индивидуально", features: ["Безлимит", "Собственное хранилище (MinIO)", "API доступ", "Персональный менеджер"] }
      ],
      faqTitle: "Частые вопросы",
      faqs: [
        { q: "Какой аптайм у платформы?", a: "Мы гарантируем аптайм 99.9% благодаря надежной архитектуре." },
        { q: "Принимаете ли вы платежи в KZT?", a: "Да, благодаря нативной интеграции со Stripe." },
        { q: "Где хранятся наши данные?", a: "Все данные надежно зашифрованы и хранятся в защищенном хранилище MinIO." },
        { q: "Предоставляете ли вы закрывающие документы?", a: "Да, для ТОО и ИП в РК." },
        { q: "Можно ли брендировать портал?", a: "Да, в Корпоративном тарифе доступна полная кастомизация (White-label)." }
      ]
    },
    features: {
      title: "Возможности для студентов",
      subtitle: "Всё необходимое для эффективного изучения веб-разработки и быстрого старта карьеры в IT.",
      items: [
        {
          id: "sandbox",
          title: "Интерактивная песочница",
          description: "Пишите код прямо в браузере на Python, JavaScript или Go. Никаких сложных установок ПО — учитесь с первого клика.",
          details: ["Поддержка автодополнения кода", "Подсветка синтаксиса и ошибок", "Встроенный терминал для тестов"]
        },
        {
          id: "autograder",
          title: "Мгновенная автопроверка",
          description: "Наш робот-тестировщик проверяет ваши решения за секунды и дает понятные подсказки, если что-то пошло не так.",
          details: ["Запуск юнит-тестов в реальном времени", "Детализированные логи ошибок", "Персонализированные подсказки ИИ"]
        },
        {
          id: "review",
          title: "Код-ревью от менторов",
          description: "Практикующие разработчики из топ-компаний проверяют ваши проекты и подсказывают, как писать чище.",
          details: ["Построчные комментарии к коду", "Советы по архитектуре приложений", "Оценка соответствия Clean Code"]
        },
        {
          id: "gamification",
          title: "Геймификация и мотивация",
          description: "Зарабатывайте опыт (XP), собирайте достижения и соревнуйтесь в лиге студентов, чтобы поддерживать регулярный темп обучения.",
          details: ["Календарь непрерывных дней (Streak)", "Таблица лидеров по Казахстану", "Уникальные ачивки за сложные задачи"]
        },
        {
          id: "github",
          title: "Интеграция с GitHub",
          description: "Свяжите свой аккаунт и автоматически отправляйте решенные задачи и курсовые проекты в личный репозиторий.",
          details: ["Автоматический экспорт кода", "Синхронизация профиля с резюме", "Готовое портфолио для работодателей"]
        },
        {
          id: "career",
          title: "Карьерный кабинет",
          description: "Следите за вакансиями партнеров в Алматы, Астане и Шымкенте. Откликайтесь прямо с платформы со своим цифровым резюме.",
          details: ["Шаблоны резюме IT-специалиста", "Запись на тренировочные интервью", "Прямой доступ к рекрутерам партнеров"]
        }
      ],
      interactiveTitle: "Попробуйте платформу в действии",
      interactiveSubtitle: "Напишите простую программу ниже и посмотрите, как работает автопроверка.",
      editorPlaceholder: "// Напишите функцию, которая возвращает сумму a и b\nfunction sum(a, b) {\n  return a + b;\n}",
      editorRun: "Запустить тесты",
      editorTesting: "Проверка...",
      editorSuccess: "Все тесты успешно пройдены! 🚀 Отличная работа!",
      editorFail: "Тест не пройден. Ожидалось: 5, получено: "
    },
    contacts: {
      officesTitle: "Наши офисы в Казахстане",
      offices: [
        { city: "Алматы", address: "БЦ на Аль-Фараби / Almaty Hub", phone: "+7 707 123 4567", email: "almaty@Qallcert.kz" },
        { city: "Астана", address: "EXPO-центр / Astana Hub", phone: "+7 701 987 6543", email: "astana@Qallcert.kz" }
      ],
      formTitle: "Связаться с нами",
      formName: "Имя",
      formEmail: "Email",
      formMessage: "Сообщение",
      formSubmit: "Отправить заявку"
    },
    layout: {
      nav: {
        home: "Главная",
        features: "Возможности",
        pricing: "Тарифы",
        contacts: "Контакты",
        login: "Войти",
        start: "Начать обучение"
      },
      footer: {
        desc: "Современная LMS-платформа для бизнеса и образования в Казахстане. Обучайте сотрудников и студентов эффективно.",
        offices: "Офисы",
        company: "Компания",
        features: "Возможности",
        pricing: "Тарифы",
        contacts: "Контакты",
        legal: "Юридическая информация",
        privacy: "Политика конфиденциальности",
        terms: "Условия использования",
        rights: "Все права защищены."
      }
    }
  },
  kk: {
    seo: {
      home: {
        title: "QAllCert — Педагогтарға арналған аккредиттелген біліктілікті арттыру курстары",
        description: "Қазақстан мұғалімдері мен оқытушыларына арналған ресми біліктілікті арттыру курстары (80 және 86 академиялық сағат). Аттестаттауға жарамды ресми сертификат.",
      },
      pricing: {
        title: "QAllCert Тарифтері — Мектептер мен мұғалімдерге арналған шешімдер",
        description: "Мұғалімдер мен мектептерге арналған QAllCert икемді тарифтік жоспарлары. KZT төлемі, есеп беру құжаттары.",
      },
      features: {
        title: "QAllCert Мүмкіндіктері — Заманауи білім беру платформасы (LMS)",
        description: "QAllCert мүмкіндіктері: педагогтарға арналған жеке кабинет, интерактивті оқу, сертификаттарды QR арқылы тексеру.",
      },
      contacts: {
        title: "QAllCert Байланыс — Алматы және Астанадағы кеңселер",
        description: "QAllCert командасымен байланысыңыз. Біздің кеңселер: Әл-Фараби даңғылы (Алматы) және EXPO орталығы (Астана).",
      }
    },
    accreditation: {
      badge: "Аккредиттелген ұйым",
      title: "Ресми институционалдық аккредиттеу сертификаты",
      subtitle: "«QALLCert» ЖШС (БСН 250240001104) білім беру ұйымын институционалдық аккредиттеу туралы CAAAE куәлігі.",
      viewDoc: "Аккредиттеу сертификатын ашу (PDF)",
      hoursNote: "ҚР педагогтарын аттестаттауға арналған 80-86 академиялық сағаттық курстар",
      validityNote: "Сертификаттар білім басқармаларының аттестаттау комиссияларында ресми қабылданады",
      docNumber: "№ 25/20КА0003",
      bin: "250240001104",
      validity: "11.04.2025 – 10.04.2028",
      agency: "CAAAE (Орталық Азия білім жүйесін аккредиттеу қауымдастығы)"
    },
    home: {
      heroTitle: "Педагогтардың біліктілігін арттыру",
      heroSubtitle: "Қазақстан мұғалімдеріне арналған ресми аккредиттелген онлайн курстар. Аттестаттауға жарамды 80 және 86 академиялық сағаттық бағдарламалар мен QR-кодты ресми сертификат.",
      ctaStart: "Курсты таңдау",
      ctaDemo: "Аккредиттеу құжаты",
      stats: [
        { value: "80-86", label: "Академиялық сағат" },
        { value: "100%", label: "Аттестаттауға жарамдылық" },
        { value: "QR-код", label: "Сертификат түпнұсқалығы" },
        { value: "24/7", label: "Платформаға қолжетімділік" }
      ],
      benefitsTitle: "Оқу қалай ұйымдастырылған",
      benefits: [
        { title: "Интерактивті практика", desc: "Python, JavaScript, Go есептерін браузерде тікелей шешіп, лезде жауап ал." },
        { title: "Командалық жобалар", desc: "Нақты әзірлеуге қатыс, командада код жаз және Git-пен жұмыс істеуді үйрен." },
        { title: "Кодты тексеру (Review)", desc: "Сенің кодыңызды Қазақстанның үздік IT-компанияларының тәжірибелі менторлары тексереді." },
        { title: "LinkedIn сертификаттары", desc: "Дағдыларыңызды растайтын ресми цифрлық сертификат ал." },
        { title: "GitHub-тағы портфолио", desc: "Барлық курстық жұмыстарың GitHub-тағы дайын репозиторийлерге айналады." },
        { title: "Мансапқа көмек", desc: "Сұхбаттарға дайындаймыз, түйіндеме жасаймыз және үздік компанияларға ұсынамыз." }
      ],
      testimonialsTitle: "Студенттеріміздің табыс тарихы",
      testimonials: [
        { text: "React курсының арқасында университеттің үшінші курсында Алматыдағы стартапқа Junior әзірлеуші болып жұмысқа тұрдым.", author: "Әділбек Серіков", location: "Алматы" },
        { text: "Есептерді автоматты тексеру — тамаша. Мұғалімді күтудің қажеті жоқ, қателерді бірден көресің.", author: "Мария Волкова", location: "Астана" },
        { text: "Алгоритмдер бойынша өте күшті бағдарлама. Ірі финтех компаниясындағы техникалық іріктеуден өтуге көмектесті.", author: "Бақтияр Нұрғалиев", location: "Шымкент" }
      ],
      coursesTitle: "Біліктілікті арттыру курстары (Аттестаттау үшін)",
      courses: [
        { 
          id: 1,
          slug: "math-trigonometry-80h",
          title: "«Математика пәні мұғалімдеріне тригонометриялық теңдеулер мен теңсіздіктер» тарауына проблемалық оқыту технологиясын пайдалану", 
          level: "Педагогтарға", 
          duration: "80 сағат", 
          desc: "Математика мұғалімдеріне тригонометрияны проблемалық оқыту әдістемесі. Аттестаттауға арналған 80 академиялық сағаттық аккредиттелген курс." 
        },
        { 
          id: 2,
          slug: "python-pedagog-80h",
          title: "«Python бағдарламалау тілі: теориясы мен практикасы»", 
          level: "Информатика мұғалімдеріне", 
          duration: "80 сағат", 
          desc: "Python тілін мектепте оқыту әдістемесі және практикалық программалау. 80 академиялық сағат, ресми сертификат." 
        },
        { 
          id: 3,
          slug: "steam-education-80h",
          title: "«STEAM білім беру: білім алушылармен жұмыс жасау технологиялары мен формалары»", 
          level: "Мұғалімдерге", 
          duration: "80 сағат", 
          desc: "Инновациялық STEAM оқыту әдістері, сабақ жоспарлары мен жобалық жұмыстар. 80 академиялық сағаттық біліктілікті арттыру." 
        },
        { 
          id: 4,
          slug: "ai-education-86h",
          title: "«Білім берудегі жасанды интеллект технологиялары: теориясы мен практикасы»", 
          level: "Барлық пән мұғалімдеріне", 
          duration: "86 сағат", 
          desc: "Оқу процесінде жасанды интеллект пен нейрожелілерді тиімді пайдалану. 86 академиялық сағат, аттестацияға жарамды ресми сертификат." 
        }
      ],
      howItWorksTitle: "Біліктілікті арттыру қалай өтеді?",
      howItWorks: [
        { step: "01", title: "Курс бағдарламасын таңдайсыз", desc: "Өз пәніңіз немесе бағытыңыз бойынша 80 немесе 86 академиялық сағаттық аккредиттелген курсты таңдаңыз." },
        { step: "02", title: "Ыңғайлы уақытта онлайн оқисыз", desc: "Бейнедәрістерді, заманауи оқыту әдістемелерін, дайын ҚМЖ үлгілері мен тапсырмаларды кез келген уақытта оқисыз." },
        { step: "03", title: "Қорытынды тест тапсырасыз", desc: "Жеке кабинетте қорытынды аттестаттау тестін тапсырасыз. Ешқандай кезексіз әрі стресссіз қайта тапсыру мүмкіндігі бар." },
        { step: "04", title: "Ресми сертификат аласыз", desc: "QR-коды, тіркеу нөмірі мен мөрі бар ресми сертификатты бірден жүктеп алып, аттестациялық портфолиоңызға тіркейсіз." }
      ],
      editorTitle: "Педагогтарға арналған заманауи онлайн платформа",
      editorSubtitle: "Сабақ жоспарларына, әдістемелік құралдар мен презентацияларға компьютерден, планшеттен немесе телефоннан қол жеткізіңіз.",
      studentFaqTitle: "Мұғалімдердің жиі қоятын сұрақтары",
      studentFaqs: [
        { q: "Бұл сертификатты аттестаттау комиссиясы қабылдай ма?", a: "Иә, міндетті түрде қабылдайды. «QALLCert» ЖШС ресми институционалдық аккредитация куәлігіне ие (CAAAE № 25/20КА0003, БСН 250240001104). Бағдарламалар 80-86 сағат көлемінде бекітілген және ҚР Оқу-ағарту министрлігінің аттестаттау ережелеріне толық сай келеді." },
        { q: "Тест тапсырған соң сертификат қашан беріледі?", a: "Қорытынды тестті сәтті аяқтаған соң QR-кодпен қорғалған электронды сертификат жеке кабинетте лезде дайын болады. Оны сол сәтте PDF түрінде жүктеп алуға болады." },
        { q: "Мектеп бухгалтериясына арналған құжаттар беріле ме?", a: "Иә, мектептен немесе кәсіподақтан төлем жасау үшін ресми шарт, электронды шот-фактура (ЭСФ) және акт толық ұсынылады." },
        { q: "Оқуды мектептегі сабақпен қатар алып жүруге бола ма?", a: "Әрине, оқыту толық қашықтан онлайн өтеді. Сіз бос уақытыңызда, демалыс күндері немесе каникул кезінде өзіңізге ыңғайлы қарқынмен оқисыз." }
      ],
      ctaTitle: "Біліктілік санатыңызды көтеруге дайынсыз ба?",
      ctaSubtitle: "Ресми аккредиттелген курсты бүгін бастап, аттестаттауға арналған заңды сертификатқа ие болыңыз.",
      ctaButton: "Курсты таңдап, бастау"
    },
    pricing: {
      toggleMonthly: "Ай сайын",
      toggleYearly: "Жыл сайын (-20%)",
      plans: [
        { name: "Базалық", price: "15 000", features: ["100 студентке дейін", "Базалық аналитика", "Email арқылы қолдау"] },
        { name: "Бизнес", price: "45 000", features: ["1000 студентке дейін", "Stripe интеграциясы", "Сертификаттар беру", "Басымдықты қолдау"], highlight: true },
        { name: "Корпоративті", price: "Жеке", features: ["Шексіз", "Жеке қойма (MinIO)", "API қолжетімділігі", "Жеке менеджер"] }
      ],
      faqTitle: "Жиі қойылатын сұрақтар",
      faqs: [
        { q: "Платформаның аптаймы қандай?", a: "Сенімді архитектураның арқасында 99.9% аптаймға кепілдік береміз." },
        { q: "KZT төлемдерін қабылдайсыз ба?", a: "Иә, Stripe-пен нативті интеграцияның арқасында." },
        { q: "Деректеріміз қайда сақталады?", a: "Барлық деректер шифрланған және MinIO қоймасында қауіпсіз сақталады." },
        { q: "Жабу құжаттарын ұсынасыз ба?", a: "Иә, ҚР ЖШС және ЖК үшін." },
        { q: "Порталды брендтеуге бола ма?", a: "Иә, Корпоративті тарифте толық кастомизация (White-label) қолжетімді." }
      ]
    },
    features: {
      title: "Студенттерге арналған мүмкіндіктер",
      subtitle: "Веб-әзірлеуді тиімді үйрену және IT-де мансапты жылдам бастау үшін қажет нәрсенің бәрі.",
      items: [
        {
          id: "sandbox",
          title: "Интерактивті песочница",
          description: "Python, JavaScript немесе Go тілдерінде тікелей браузерде код жазыңыз. Күрделі бағдарламалық жасақтаманы орнатудың қажеті жоқ — бірінші басудан бастап үйреніңіз.",
          details: ["Кодты автоматты түрде аяқтауды қолдау", "Синтаксис пен қателерді бөлектеу", "Тесттерге арналған кірістірілген терминал"]
        },
        {
          id: "autograder",
          title: "Лездік автоматты тексеру",
          description: "Біздің робот-тестілеуші шешімдеріңізді бірнеше секундта тексереді және бірдеңе дұрыс болмаса, түсінікті кеңестер береді.",
          details: ["Нақты уақыттағы юнит-тесттерді іске қосу", "Қателердің егжей-тегжейлі журналдары", "ЖИ-дің жекелендірілген кеңестері"]
        },
        {
          id: "review",
          title: "Менторлардан кодты тексеру",
          description: "Үздік компаниялардың тәжірибелі әзірлеушілері жобаларыңызды тексереді және кодты қалай таза жазу керектігін айтады.",
          details: ["Кодқа жолма-жол түсініктемелер", "Қосымша архитектурасы бойынша кеңестер", "Clean Code стандарттарына сәйкестігін бағалау"]
        },
        {
          id: "gamification",
          title: "Геймификация және мотивация",
          description: "Тұрақты оқу қарқынын сақтау үшін тәжірибе (XP) жинаңыз, жетістіктерді жинаңыз және студенттер лигасында бақ сынасыңыз.",
          details: ["Үздіксіз күндер күнтізбесі (Streak)", "Қазақстан бойынша көшбасшылар тақтасы", "Күрделі есептер үшін бірегей ачивкалар"]
        },
        {
          id: "github",
          title: "GitHub-пен интеграция",
          description: "Тіркелгіңізді байланыстырыңыз және шешілген есептер мен курстық жобаларды жеке репозиторийге автоматты түрде жіберіңіз.",
          details: ["Кодты автоматты түрде экспорттау", "Профильді түйіндемемен синхрондау", "Жұмыс берушілер үшін дайын портфолио"]
        },
        {
          id: "career",
          title: "Мансап кабинеті",
          description: "Алматы, Астана және Шымкенттегі серіктестердің бос жұмыс орындарын қадағалаңыз. Цифрлық түйіндемеңізбен тікелей платформадан жауап беріңіз.",
          details: ["IT-маманның түйіндеме үлгілері", "Жаттығу сұхбаттарына жазылу", "Серіктестердің рекрутерлеріне тікелей қол жеткізу"]
        }
      ],
      interactiveTitle: "Платформаны іс жүзінде қолданып көріңіз",
      interactiveSubtitle: "Төменде қарапайым бағдарлама жазып, автоматты тексерудің қалай жұмыс істейтінін көріңіз.",
      editorPlaceholder: "// a және b қосындысын қайтаратын функцияны жазыңыз\nfunction sum(a, b) {\n  return a + b;\n}",
      editorRun: "Тесттерді іске қосу",
      editorTesting: "Тексерілуде...",
      editorSuccess: "Барлық тесттер сәтті өтті! 🚀 Керемет жұмыс!",
      editorFail: "Тест сәтсіз аяқталды. Күтілді: 5, алынды: "
    },
    contacts: {
      officesTitle: "Қазақстандағы біздің кеңселер",
      offices: [
        { city: "Алматы", address: "Әл-Фарабидегі БО / Almaty Hub", phone: "+7 707 123 4567", email: "almaty@Qallcert.kz" },
        { city: "Астана", address: "EXPO-орталық / Astana Hub", phone: "+7 701 987 6543", email: "astana@Qallcert.kz" }
      ],
      formTitle: "Бізбен байланысыңыз",
      formName: "Аты",
      formEmail: "Email",
      formMessage: "Хабарлама",
      formSubmit: "Өтінім жіберу"
    },
    layout: {
      nav: {
        home: "Басты бет",
        features: "Мүмкіндіктер",
        pricing: "Тарифтер",
        contacts: "Контактілер",
        login: "Кіру",
        start: "Оқуды бастау"
      },
      footer: {
        desc: "Қазақстандағы бизнес пен білім беруге арналған заманауи LMS платформасы. Қызметкерлер мен студенттерді тиімді оқытыңыз.",
        offices: "Кеңселер",
        company: "Компания",
        features: "Мүмкіндіктер",
        pricing: "Тарифтер",
        contacts: "Контактілер",
        legal: "Құқықтық ақпарат",
        privacy: "Құпиялылық саясаты",
        terms: "Пайдалану шарттары",
        rights: "Барлық құқықтар қорғалған."
      }
    }
  },
  en: {
    seo: {
      home: {
        title: "QAllCert — Accredited Teacher Professional Development (Kazakhstan)",
        description: "Official accredited professional development courses for teachers in Kazakhstan (80 and 86 academic hours). Verified certificates for state teacher attestation.",
      },
      pricing: {
        title: "QAllCert Pricing — Professional Learning Solutions in Kazakhstan",
        description: "Flexible QAllCert plans for schools and educators in Kazakhstan. Pay in KZT, Stripe integration, official documentation for accounting.",
      },
      features: {
        title: "QAllCert Features — Accredited Learning Management Platform",
        description: "Discover QAllCert: educator portal, interactive practice, verifiable digital certificates with QR codes.",
      },
      contacts: {
        title: "QAllCert Contacts — Offices in Almaty and Astana",
        description: "Contact the QAllCert team. Our offices: Al-Farabi Business Center (Almaty) and EXPO Center (Astana).",
      }
    },
    accreditation: {
      badge: "Accredited Organization",
      title: "Official Institutional Accreditation Certificate",
      subtitle: "CAAAE Institutional Accreditation Certificate for QALLCert LLP (BIN 250240001104).",
      viewDoc: "View Accreditation Certificate (PDF)",
      hoursNote: "80 and 86 academic hours courses for teacher certification in Kazakhstan",
      validityNote: "Certificates are officially recognized by regional education departments",
      docNumber: "№ 25/20КА0003",
      bin: "250240001104",
      validity: "11.04.2025 – 10.04.2028",
      agency: "CAAAE (Central Asian Association for Accreditation of Education)"
    },
    home: {
      heroTitle: "Educator Professional Development with",
      heroSubtitle: "Official accredited online programs for teachers in Kazakhstan. 80 and 86 academic hours courses with verifiable certificates for state teacher qualification upgrade.",
      ctaStart: "Explore Courses",
      ctaDemo: "Accreditation Document",
      stats: [
        { value: "80-86", label: "Academic Hours" },
        { value: "100%", label: "Attestation Recognition" },
        { value: "QR-Code", label: "Certificate Verification" },
        { value: "24/7", label: "Platform Access" }
      ],
      benefitsTitle: "How Our Program Works",
      benefits: [
        { title: "Interactive Coding", desc: "Solve Python, JavaScript, and Go tasks directly in the browser with instant code feedback." },
        { title: "Team Projects", desc: "Collaborate on real-world codebases, write clean code, and master Git version control." },
        { title: "Code Review", desc: "Get personalized line-by-line feedback from experienced mentors in top IT companies." },
        { title: "Shareable Certificates", desc: "Earn a verified digital certificate to highlight your skills on LinkedIn." },
        { title: "GitHub Portfolio", desc: "Turn your assignments and capstone projects into polished GitHub repositories." },
        { title: "Career Support", desc: "Get resume assistance, mock interviews, and direct recommendations to top employers." }
      ],
      testimonialsTitle: "Student Success Stories",
      testimonials: [
        { text: "Thanks to the React course, I got hired as a Junior Developer at an Almaty startup during my junior year of university.", author: "Adilbek Serikov", location: "Almaty" },
        { text: "The auto-grader is awesome. You don't have to wait for the teacher and immediately see syntax or logical errors.", author: "Maria Volkova", location: "Astana" },
        { text: "Extremely rigorous algorithms module. It helped me pass the technical interview at a major fintech company.", author: "Bakhtiyar Nurgaliyev", location: "Shymkent" }
      ],
      coursesTitle: "Teacher Development Courses (For Attestation)",
      courses: [
        { 
          id: 1,
          slug: "math-trigonometry-80h",
          title: "Problem-Based Learning of Trigonometric Equations and Inequalities for Math Teachers", 
          level: "For Teachers", 
          duration: "80 hours", 
          desc: "Methodology of problem-based learning in trigonometry for mathematics teachers. Accredited 80 academic hours course for attestation." 
        },
        { 
          id: 2,
          slug: "python-pedagog-80h",
          title: "Python Programming Language: Theory and Practice", 
          level: "For CS Teachers", 
          duration: "80 hours", 
          desc: "School teaching methodology and practical programming in Python. 80 academic hours, official verified certificate." 
        },
        { 
          id: 3,
          slug: "steam-education-80h",
          title: "STEAM Education: Technologies and Forms of Working with Students", 
          level: "For Teachers", 
          duration: "80 hours", 
          desc: "Innovative STEAM teaching methods, lesson plans, and student project work. 80 academic hours professional development." 
        },
        { 
          id: 4,
          slug: "ai-education-86h",
          title: "Artificial Intelligence Technologies in Education: Theory and Practice", 
          level: "All Subject Teachers", 
          duration: "86 hours", 
          desc: "Practical application of AI and neural networks in classroom teaching. 86 academic hours, accredited certificate for teacher portfolio." 
        }
      ],
      howItWorksTitle: "How Teacher Certification Works",
      howItWorks: [
        { step: "01", title: "Select a Course Program", desc: "Choose an officially accredited 80 or 86 academic hours program in Mathematics, CS, STEAM, or AI." },
        { step: "02", title: "Learn Online at Your Own Pace", desc: "Access high-quality video lectures, lesson plans, modern teaching methodologies, and didactic materials 24/7." },
        { step: "03", title: "Pass the Final Assessment", desc: "Complete the online qualification exam in your personal dashboard without stress or queues." },
        { step: "04", title: "Receive an Official Certificate", desc: "Instantly download a verified digital certificate with a QR code and registry number for your teacher portfolio." }
      ],
      editorTitle: "Modern Digital Environment for Educators",
      editorSubtitle: "Access verified course lectures, lesson blueprints, and teaching presentations from any PC, tablet, or smartphone.",
      studentFaqTitle: "Frequently Asked Questions by Teachers",
      studentFaqs: [
        { q: "Is this certificate recognized for teacher attestation in Kazakhstan?", a: "Yes, absolutely. QALLCert LLP holds official institutional accreditation from CAAAE (Certificate No. 25/20КА0003, BIN 250240001104). The 80-86 academic hours programs fully satisfy all teacher attestation requirements." },
        { q: "How quickly is the certificate issued upon completion?", a: "The digital certificate with a verifiable QR code is generated instantly in your student dashboard right after completing the final test." },
        { q: "Are formal accounting and invoice documents provided for schools?", a: "Yes, we provide official electronic acts of completion, electronic invoices (ESF), and payment receipts for school accounting." },
        { q: "Can I combine this course with full-time teaching?", a: "Yes, the training is 100% online and flexible. You can study in the evenings, on weekends, or during school holidays." }
      ],
      ctaTitle: "Ready to Upgrade Your Teaching Category?",
      ctaSubtitle: "Enroll in an accredited professional development course today and get your officially verified certificate.",
      ctaButton: "Choose Course and Start"
    },
    pricing: {
      toggleMonthly: "Monthly",
      toggleYearly: "Yearly (-20%)",
      plans: [
        { name: "Basic", price: "15,000", features: ["Up to 100 students", "Basic analytics", "Email support"] },
        { name: "Business", price: "45,000", features: ["Up to 1000 students", "Stripe integration", "Certificate issuance", "Priority support"], highlight: true },
        { name: "Enterprise", price: "Custom", features: ["Unlimited", "Private storage (MinIO)", "API access", "Dedicated manager"] }
      ],
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "What is the platform's uptime?", a: "We guarantee 99.9% uptime thanks to a reliable architecture." },
        { q: "Do you accept payments in KZT?", a: "Yes, thanks to native integration with Stripe." },
        { q: "Where is our data stored?", a: "All data is securely encrypted and stored in secure MinIO storage." },
        { q: "Do you provide closing documents?", a: "Yes, for LLPs and IEs in Kazakhstan." },
        { q: "Can the portal be branded?", a: "Yes, full customization (White-label) is available in the Enterprise plan." }
      ]
    },
    features: {
      title: "Features for Students",
      subtitle: "Everything you need to effectively learn web development and launch your career in IT.",
      items: [
        {
          id: "sandbox",
          title: "Interactive Sandbox",
          description: "Write code directly in your browser using Python, JavaScript, or Go. No complex setups—start learning in one click.",
          details: ["Autocomplete support", "Syntax & error highlighting", "Built-in testing terminal"]
        },
        {
          id: "autograder",
          title: "Instant Autograder",
          description: "Our automated system checks your code in seconds and provides helpful tips if something isn't working.",
          details: ["Real-time unit testing", "Detailed error stack traces", "AI-powered custom hints"]
        },
        {
          id: "review",
          title: "Mentor Code Reviews",
          description: "Active developers from top tech companies review your code to teach you best practices and clean code guidelines.",
          details: ["Line-by-line code feedback", "Application architecture tips", "Clean Code standards analysis"]
        },
        {
          id: "gamification",
          title: "Gamification & Motivation",
          description: "Earn XP, collect achievements, and compete in the student leaderboard to stay motivated and consistent.",
          details: ["Daily study streaks", "Kazakhstan-wide leaderboards", "Special badges for complex tasks"]
        },
        {
          id: "github",
          title: "GitHub Integration",
          description: "Connect your GitHub account to automatically sync your completed projects and build a professional portfolio.",
          details: ["Automatic code exporting", "Profile-to-resume sync", "Employer-ready portfolio"]
        },
        {
          id: "career",
          title: "Career Hub",
          description: "Browse curated job openings in Almaty, Astana, and Shymkent. Apply directly from the platform with your student profile.",
          details: ["IT resume templates", "Mock technical interviews", "Direct access to hiring partners"]
        }
      ],
      interactiveTitle: "Try the Platform Live",
      interactiveSubtitle: "Write a simple function below and see how the automated testing works.",
      editorPlaceholder: "// Write a function that returns the sum of a and b\nfunction sum(a, b) {\n  return a + b;\n}",
      editorRun: "Run Tests",
      editorTesting: "Testing...",
      editorSuccess: "All tests passed successfully! 🚀 Great job!",
      editorFail: "Test failed. Expected: 5, got: "
    },
    contacts: {
      officesTitle: "Our Offices in Kazakhstan",
      offices: [
        { city: "Almaty", address: "BC on Al-Farabi / Almaty Hub", phone: "+7 707 123 4567", email: "almaty@Qallcert.kz" },
        { city: "Astana", address: "EXPO Center / Astana Hub", phone: "+7 701 987 6543", email: "astana@Qallcert.kz" }
      ],
      formTitle: "Contact Us",
      formName: "Name",
      formEmail: "Email",
      formMessage: "Message",
      formSubmit: "Submit Request"
    },
    layout: {
      nav: {
        home: "Home",
        features: "Features",
        pricing: "Pricing",
        contacts: "Contacts",
        login: "Sign In",
        start: "Start Learning"
      },
      footer: {
        desc: "A modern LMS platform for business and education in Kazakhstan. Train employees and students effectively.",
        offices: "Offices",
        company: "Company",
        features: "Features",
        pricing: "Pricing",
        contacts: "Contacts",
        legal: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        rights: "All rights reserved."
      }
    }
  }
} as const;

export type Locale = keyof typeof dictionaries;

export function getDictionary(locale: string) {
  const norm = locale === 'kz' ? 'kk' : locale;
  return dictionaries[norm as 'ru' | 'kk' | 'en'] ?? dictionaries.ru;
}
