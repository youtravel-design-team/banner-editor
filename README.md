# Редактор баннеров YouTravel.me

Статический сайт: редактор HTML-баннеров. Работает в браузере, без сервера и сборки.

- **Обычные баннеры** — 13 ресайзов (сайт, соцсети, реклама), стили `assets/ytb.css`.
- **TopSort** — 1176×147 и 343×188 по мастер-шаблону Figma, стили `assets/tsb.css`.
- Загрузка своих фото, кадрирование, цвета, тексты; экспорт PNG ×2, ZIP и самодостаточного HTML.
- Фото и настройки хранятся в браузере пользователя (localStorage + IndexedDB), на сервер ничего не уходит.

## Публикация на GitHub Pages
Settings → Pages → Build and deployment → Source: **Deploy from a branch**, Branch: **main**, папка **/ (root)**.
Через 1–2 минуты сайт откроется по адресу `https://<логин>.github.io/<репозиторий>/`.
Вкладку можно открыть сразу: `…/#topsort`.

## Обновление
Меняете файлы → коммит → push в `main`. Pages пересобирается сам.

## Шрифты и картинки
- Шрифт — **Inter** (Google Fonts, SIL Open Font License). SF Pro в репозиторий не кладём: лицензия Apple не разрешает его распространение.
- `img/bg-paraglider.jpg` — Raimond Klavins, Unsplash (`xAqrT-279UA`); `img/fg-paraglider-full.webp` — вырезка из этого фото.
- `img/bg-maldives.jpg` — Shai Pal, Unsplash (`viJHpQoeHyU`).
- Лицензия Unsplash: бесплатно для коммерческого использования, без обязательной атрибуции.
- Архиватор ZIP — JSZip 3.10.1 с cdnjs (MIT).

## Новый шаблон
Запись в `TEMPLATES` в скрипте `index.html` + свой CSS в `assets/` + блок полей `.tpanel[data-panel="…"]` в панели.
