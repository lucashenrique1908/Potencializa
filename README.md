Potencializa

Potencializa is a responsive website for a digital marketing and social media company, focused on presenting its services, plans, case studies and brand positioning.

The project is currently under development and is being built as an independent project, with a focus on creating a complete and polished front-end experience.

Technologies: 
React,
JavaScript,
Vite,
CSS,
Font Awesome,
Swiper,
Features,
Responsive landing page,
Services and pricing sections,
Case studies and results,
Social media content sections,
Contact modal and CTA interactions,
Light/dark theme support,
Reusable React components,
Scroll-based UI interactions,
Status,

In development.

The project is being progressively improved with new sections, interactions and refinements to the user experience.

Repository

https://github.com/lucashenrique1908/Potencializa

## Publicar no GitHub Pages

Na pasta que contém `package.json`, execute `npm run deploy`. O comando
executa o build e publica somente `dist/` na branch `gh-pages` do remoto `origin`.
Para este projeto, o remoto deve ser `https://github.com/riqueecode/Potencializa.git`.

Em Settings > Pages > Build and deployment, configure Source como
`Deploy from a branch`, Branch como `gh-pages` e pasta como `/ (root)`.
Publicar a raiz de `main` serve o HTML de desenvolvimento, que referencia
`/src/main.jsx`, em vez do JavaScript compilado.

O `base` do Vite é `/Potencializa/`. Após `npm run build`, `dist/index.html`
deve apontar para `/Potencializa/assets/index.js` e
`/Potencializa/assets/index.css`, nunca para `/src/main.jsx`.
A referência a `/src/main.jsx` no `index.html` original é a entrada do Vite
e deve ser mantida.

Para conferir antes de publicar, execute `npm run preview` e abra
`http://localhost:4173/Potencializa/`.
Site publicado: https://riqueecode.github.io/Potencializa/

Se o navegador ainda solicitar `main.jsx` após o deploy, recarregue com
`Ctrl+Shift+R` e confira a origem de publicação acima.

## Integração YouTube

O backend lê `YOUTUBE_API_KEY` e `YOUTUBE_CHANNEL_HANDLE` do `.env` local ou das
variáveis de ambiente do serviço de alojamento. A chave é exclusiva do backend
e nunca deve ser prefixada com `VITE_` ou incluída no frontend.
`YOUTUBE_CHANNEL_HANDLE` é opcional e, quando omitida, usa
`@edilenemagalhaesmendel`.

O endpoint `GET /api/youtube/playlist` resolve o canal pelo handle, consulta a
playlist automática de uploads e devolve os vídeos normalizados. Para
desenvolvimento local, configure também `VITE_API_URL` para `http://localhost:3001`.
Em produção, defina `VITE_API_URL=https://potencializa.onrender.com` no momento
do build do frontend. O backend aceita os domínios
`potencializavideos.com`, `www.potencializavideos.com`,
`riqueecode.github.io` e `potencializa-nine.vercel.app`, além das origens
configuradas por `CORS_ORIGIN` e `FRONTEND_ORIGIN`.
