# Wikipedia — автотест зміни мови інтерфейсу

Автоматизований тест на Playwright + TypeScript, який перевіряє, що авторизований користувач може змінити мову інтерфейсу Wikipedia через **Preferences → User profile → Internationalisation**.

## Тест-кейс, який автоматизовано

**Назва:** Interface language switch.

**Передумова:** користувач логіниться через https://uk.wikipedia.org, та може вибрати мову інтерфейсу  по замовчуваню стоїть Українська.

**Коли:**
1. Користувач переходить у розділ **Preferences**.
2. У вкладці **User profile**, у розділі **Internationalisation**, обирає іншу мову відображення інтерфейсу (відмінну від поточної). Перемикання відбувається з Української на Англійську та навпаки, дивлячись яка мова обрана поточна (у подальшому можна розширити перелік чи вибирати вручну).
3. Натискає **Save**.

**Тоді:**
- Інтерфейс додатка одразу відображається обраною мовою (перевіряється через атрибут `<html lang="...">`), хоч можна додати і більше перевірок у майбутньому


Файл тесту: [`tests/changeInterfaceLanguage.spec.ts`](./tests/changeInterfaceLanguage.spec.ts).

## Структура проєкту

```
├── pages/                     # Page Object Model
│   ├── BasePage.ts             # спільна навігація + логіка меню користувача
│   ├── LoginPage.ts            # портал wikipedia.org → вибір мови → форма логіну
│   └── PreferencesPage.ts      # Preferences → User profile → Internationalisation
├── fixtures/
│   └── testFixture.ts          # фікстури Playwright (page objects через test.extend)
├── utils/
│   └── config.ts               # креди/URL з process.env (.env), константи мов і таймаутів
├── tests/
│   └── changeInterfaceLanguage.spec.ts
├── playwright.config.ts        # HTML-репортер, локаль браузера, timeouts
├── Dockerfile                  # образ на базі офіційного mcr.microsoft.com/playwright
├── docker-compose.yml          # запуск тесту в контейнері + volume-мапінг звіту на хост
├── .env.example                # шаблон змінних середовища (без реальних кредів)
└── .env                        # реальні креди — НЕ комітиться (див. .gitignore)
```

## Вимоги

- Node.js 18+ і npm — для запуску локально
- Docker + Docker Compose — для запуску в контейнері

## Налаштування (крок перший, спільний для обох способів запуску у докер еонтейнері чи локально на ПК)

1. Клонувати репозиторій і перейти в його папку:
   ```bash
   git clone <URL_репозиторію>
   cd <назва_папки>
   ```
2. Створити шаблон .env і заповнити свої дані:
   У `.env` потрібно вказати:
   ```env
   BASE_URL=https://uk.wikipedia.org
   WIKI_USERNAME=ваш_логін
   WIKI_PASSWORD=ваш_пароль
   ```
   Креди в код ніде не хардкодяться — вони читаються лише з `process.env` (`utils/config.ts`), а сам `.env` додано до `.gitignore` і в репозиторій не потрапляє.

## Запуск локально (на своїй машині)

```bash
npm install
npx playwright install chromium
npx playwright test
```

## Запуск у Docker

```bash
docker compose build
docker compose up --abort-on-container-exit
```

Креди для запуску в контейнері за замовчуванням теж беруться з `.env` у корені проєкту. Якщо потрібно прогнати тест з **іншими** креденшелами — без редагування `.env` — є два варіанти:

```bash
# 1) підмінити змінні прямо в команді (bash)
WIKI_USERNAME=other_user WIKI_PASSWORD=other_pass docker compose up --build

# 1) те саме у PowerShell
$env:WIKI_USERNAME="other_user"; $env:WIKI_PASSWORD="other_pass"; docker compose up --build

# 2) або вказати повністю інший env-файл
docker compose --env-file .env.other-user up --build
```

## Де шукати звіт

Playwright пише HTML-звіт напряму в папку хоста завдяки volume-мапінгу в `docker-compose.yml` (`./playwright-report:/app/playwright-report`) — звіт **не залишається всередині контейнера**.

Після прогону (як локально, так і в Docker) відкрити:

```
playwright-report/index.html
```

просто у браузері, або командою:

```bash
npx playwright show-report
```

Скріншоти/відео/трейси невдалих кроків — у папці `test-results/` (теж змаплена на хост при Docker-запуску).
