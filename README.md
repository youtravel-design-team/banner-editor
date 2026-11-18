# Редактор баннеров YouTravel.me

Статический сайт: редактор HTML-баннеров. Работает в браузере, без сервера и сборки.

- Сайт: https://youtravel-design-team.github.io/banner-editor/ (TopSort — `#topsort`)
- Репозиторий: https://github.com/youtravel-design-team/banner-editor

- **Обычные баннеры** — 13 ресайзов (сайт, соцсети, реклама), стили `assets/ytb.css`.
- **TopSort** — 1176×147 и 343×188 по мастер-шаблону Figma, стили `assets/tsb.css`.
- Загрузка своих фото, кадрирование, цвета, тексты; экспорт PNG ×2, ZIP и самодостаточного HTML.
- Фото и настройки хранятся в браузере пользователя (localStorage + IndexedDB), на сервер ничего не уходит.

## Публикация на GitHub Pages
Settings → Pages → Build and deployment → Source: **Deploy from a branch**, Branch: **main**, папка **/ (root)**.
Через 1–2 минуты сайт откроется по адресу https://youtravel-design-team.github.io/banner-editor/.
Вкладку можно открыть сразу: https://youtravel-design-team.github.io/banner-editor/#topsort

## Обновление
Меняете файлы → коммит → push в `main`. Pages пересобирается сам.

## Шрифты и картинки
- Шрифт — **Inter** (Google Fonts, SIL Open Font License).
- `img/bg-paraglider.jpg` — Raimond Klavins, Unsplash (`xAqrT-279UA`); `img/fg-paraglider-full.webp` — вырезка из этого фото.
- `img/logo-white.svg`, `img/logo-color.svg` — логотип YouTravel.me из DS 3.0 (Logos), обрезан по охранному полю.
- `img/bg-maldives.jpg` — Shai Pal, Unsplash (`viJHpQoeHyU`).
- Лицензия Unsplash: бесплатно для коммерческого использования, без обязательной атрибуции.
- Архиватор ZIP — JSZip 3.10.1 с cdnjs (MIT).

## Новый шаблон
Запись в `TEMPLATES` в скрипте `index.html` + свой CSS в `assets/` + блок полей `.tpanel[data-panel="…"]` в панели.
