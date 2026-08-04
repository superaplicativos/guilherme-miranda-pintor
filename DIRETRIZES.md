# DIRETRIZES.md — Documentação Técnica do Site Guilherme Miranda

> **Para qualquer IA ou desenvolvedor:** este documento explica como o site funciona, como adicionar obras, atualizar textos, fazer deploy, e manter o site sem quebrar nada.

**Site em produção:** https://superaplicativos.github.io/guilherme-miranda-pintor/

**Repo GitHub:** https://github.com/superaplicativos/guilherme-miranda-pintor

---

## 📋 SUMÁRIO

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Estrutura de Pastas](#2-estrutura-de-pastas)
3. [Como o Site Funciona](#3-como-o-site-funciona)
4. [Adicionar Nova Obra](#4-adicionar-nova-obra)
5. [Editar Obra Existente](#5-editar-obra-existente)
6. [Sistema de Idiomas (7 idiomas)](#6-sistema-de-idiomas-7-idiomas)
7. [Atualizar Bio, Conquistas, Exposições](#7-atualizar-bio-conquistas-exposições)
8. [Atualizar Contato e Links](#8-atualizar-contato-e-links)
9. [Fazer Deploy](#9-fazer-deploy)
10. [Cache e Versionamento](#10-cache-e-versionamento)
11. [SEO e AEO](#11-seo-e-aeo)
12. [Padrões e Boas Práticas](#12-padrões-e-boas-práticas)
13. [Troubleshooting](#13-troubleshooting)
14. [Checklist de Validação](#14-checklist-de-validação)

---

## 1. Stack Tecnológico

- **HTML5 estático** (sem build, sem framework)
- **JavaScript vanilla** (sem React, sem Vue, sem npm)
- **CSS com Custom Properties** (variáveis CSS)
- **Three.js r128** (CDN) — planeta 3D no hero
- **GSAP 3.12 + ScrollTrigger** (CDN) — animações de scroll
- **Canvas 2D API** — starfield de fundo
- **Google Fonts** — Cormorant Garamond + Inter + Space Mono
- **GitHub Pages** — hospedagem gratuita

**Tudo é estático:** não há backend, não há banco de dados, não há API. Todo conteúdo dinâmico está no `js/data.js`.

---

## 2. Estrutura de Pastas

```
guilherme-miranda-pintor/
├── index.html              # Página única (todas as seções)
├── README.md               # Comercial/SEO (não técnico)
├── DIRETRIZES.md           # ESTE ARQUIVO (documentação técnica)
├── .nojekyll               # Desativa Jekyll no GitHub Pages
├── .gitignore              # Arquivos ignorados pelo git
├── robots.txt              # Directivas para crawlers
├── sitemap.xml             # Sitemap com hreflang (7 idiomas)
├── modelo-obras-guilherme-miranda.xlsx  # Planilha modelo pra preencher obras
│
├── css/
│   └── styles.css          # Único arquivo CSS (tema Cosmos Dark)
│
├── js/
│   ├── data.js             # ⭐ TODOS os dados do site (obras, bio, contato)
│   ├── i18n.js             # Traduções da interface (7 idiomas)
│   ├── three-scene.js      # Planeta 3D no hero (Three.js + shaders)
│   ├── gsap-animations.js  # Animações de scroll
│   └── main.js             # Orquestração + rendering dinâmico
│
└── assets/
    ├── atropelo-portrait.jpg     # Foto do artista na bio
    ├── the-time-machine.mp4      # Vídeo da obra CR-018
    └── artworks/                 # Fotos das 18 obras
        ├── CR-001-planeta-turquesa.jpg
        ├── CR-002-sol-papelao.jpg
        └── ... (18 obras)
```

---

## 3. Como o Site Funciona

### Fluxo de carregamento:

1. `index.html` carrega com texto estático em PT (placeholder)
2. `js/data.js` carrega (define `window.ARTWORKS`, `window.BIO`, etc.)
3. `js/i18n.js` carrega (define `window.I18N` com 7 idiomas)
4. `js/i18n.js` detecta idioma do navegador ou `localStorage` ou `?lang=xx` na URL
5. `js/i18n.js` aplica traduções (substitui textos com `data-i18n`)
6. `js/main.js` carrega e renderiza dinamicamente:
   - Bio completa (7 parágrafos)
   - Stats do hero
   - Portfolio (grid de obras)
   - Catálogo Raisonné (tabela acadêmica)
   - Loja (cards de compra)
   - Beco Street (conquistas)
   - Livros (stats + shelf)
   - Exposições (timeline)
7. `js/three-scene.js` inicializa o planeta 3D no hero
8. `js/gsap-animations.js` configura animações de scroll

### Idiomas suportados (7):

| Código | Idioma | Bandeira |
|--------|--------|----------|
| `pt` | Português | 🇧🇷 |
| `en` | English | 🇬🇧 |
| `es` | Español | 🇪🇸 |
| `fr` | Français | 🇫🇷 |
| `de` | Deutsch | 🇩🇪 |
| `zh` | 中文 (Mandarim) | 🇨🇳 |
| `hi` | हिन्दी (Hindi) | 🇮🇳 |

### Auto-detecção de idioma:

1. Primeiro: `?lang=xx` na URL (ex: `?lang=fr`)
2. Segundo: `localStorage.getItem('cosmos-lang')`
3. Terceiro: `navigator.languages` (idioma do browser)
4. Fallback: `pt` (português)

---

## 4. Adicionar Nova Obra

### Passo a passo completo:

#### 4.1. Preparar a imagem da obra

1. Foto da obra em `.jpg` (ideal: 1500×2000px, 1-3MB)
2. Renomear para o padrão: `CR-XXX-slug-da-obra.jpg`
   - `CR-XXX`: próximo número (ex: `CR-019`)
   - `slug-da-obra`: versão URL-friendly do título (ex: `planeta-aurora`)
3. Salvar em: `assets/artworks/CR-019-nova-obra.jpg`

#### 4.2. Adicionar entrada no `js/data.js`

Abrir `js/data.js` e找到 o array `ARTWORKS`. Adicionar novo objeto **antes do fechamento `];`**:

```javascript
{
  id: "CR-019",
  slug: "nova-obra",
  title: {
    pt: "Título em Português",
    en: "Title in English",
    es: "Título en Español",
    fr: "Titre en Français",
    de: "Titel auf Deutsch",
    zh: "中文标题",
    hi: "हिन्दी शीर्षक"
  },
  year: 2026,
  series: {
    pt: "Série Space",  // ou "Série Dadaísmo" ou "Série Técnica"
    en: "Space Series"
  },
  technique: {
    pt: "Acrílica com tingidor sobre papelão ecológico",
    en: "Acrylic with dye on ecological cardboard"
    // Pode adicionar es, fr, de, zh, hi se quiser
  },
  dimensions: "63,5 × 38,1 cm",
  price: "R$ 250,00",  // ou "R$ 8.000,00" para obras premium
  status: "available",  // ou "sold"
  medium: "painting",   // ou "mixed"
  description: {
    pt: "Descrição longa em português (3-5 frases)...",
    en: "Long description in English (3-5 sentences)...",
    es: "Descripción larga en español...",
    fr: "Description longue en français...",
    de: "Lange Beschreibung auf Deutsch...",
    zh: "中文长描述...",
    hi: "हिन्दी लंबी विवरण..."
  },
  provenance: {
    pt: "Atelier do artista em Ribeirão Preto, SP.",
    en: "Artist's studio in Ribeirão Preto, SP."
  },
  exhibitions: [],
  bibliography: [],
  signature: {
    pt: "Adesivo em vinil @guimiranda.tech",
    en: "Vinyl sticker @guimiranda.tech"
  },
  condition: {
    pt: "Excelente, com certificado de autenticidade",
    en: "Excellent, with certificate of authenticity"
  },
  imageFile: "CR-019-nova-obra.jpg"
},
```

#### 4.3. Campos obrigatórios vs opcionais

| Campo | Obrigatório | Notas |
|-------|-------------|-------|
| `id` | ✅ | Único, formato `CR-XXX` |
| `slug` | ✅ | URL-friendly, bate com nome do arquivo |
| `title` | ✅ | Mínimo `pt` e `en`. Outros idiomas = fallback EN |
| `year` | ✅ | Número (ex: 2026) |
| `series` | ✅ | `pt` e `en` |
| `technique` | ✅ | `pt` e `en` |
| `dimensions` | ✅ | String (ex: "63,5 × 38,1 cm") |
| `price` | ✅ | String (ex: "R$ 250,00") ou vazio = "Sob consulta" |
| `status` | ✅ | `"available"` ou `"sold"` |
| `medium` | ✅ | `"painting"` ou `"mixed"` |
| `description` | ✅ | `pt` e `en` obrigatórios. Outros = fallback EN |
| `provenance` | ✅ | `pt` e `en` |
| `exhibitions` | Opcional | Array vazio `[]` ou com strings |
| `bibliography` | Opcional | Array vazio `[]` ou com strings |
| `signature` | ✅ | `pt` e `en` |
| `condition` | ✅ | `pt` e `en` |
| `imageFile` | ✅ | Nome do arquivo em `assets/artworks/` |

#### 4.4. Validação antes de commitar

```bash
# Verificar sintaxe do JS
node --check js/data.js

# Verificar que a imagem existe
ls assets/artworks/CR-019-nova-obra.jpg
```

---

## 5. Editar Obra Existente

### 5.1. Encontrar a obra

```bash
# Buscar por ID
grep -n "CR-001" js/data.js

# Buscar por título
grep -n "Planeta Turquesa" js/data.js
```

### 5.2. Editar campos

Abrir `js/data.js`, encontrar a obra, e editar os campos diretamente. Exemplo — mudar preço:

```javascript
// Antes
price: "R$ 250,00",

// Depois
price: "R$ 350,00",
```

### 5.3. Editar descrição em um idioma específico

```javascript
description: {
  pt: "Nova descrição em português...",
  en: "New description in English...",
  // Outros idiomas continuam iguais (não precisa mexer)
},
```

### 5.4. Trocar a imagem

1. Subir nova foto em `assets/artworks/` com o mesmo nome do `imageFile`
2. Ou subir com nome novo e atualizar o campo `imageFile` no `data.js`

---

## 6. Sistema de Idiomas (7 idiomas)

### 6.1. Estrutura

O sistema tem 2 camadas:

1. **Interface** (menu, botões, labels): traduzida no `js/i18n.js`
2. **Conteúdo** (bio, obras, conquistas): traduzido no `js/data.js`

### 6.2. Adicionar tradução de interface (i18n.js)

Abrir `js/i18n.js` e找到 o bloco do idioma. Exemplo — adicionar chave nova em todos os 7 idiomas:

```javascript
pt: {
  // ... chaves existentes ...
  'nav.novaSecao': 'Nova Seção',
},
en: {
  // ...
  'nav.novaSecao': 'New Section',
},
// ... repetir para es, fr, de, zh, hi
```

### 6.3. Usar a tradução no HTML

```html
<!-- Antes -->
<li><a href="#nova">Nova Seção</a></li>

<!-- Depois -->
<li><a href="#nova" data-i18n="nav.novaSecao">Nova Seção</a></li>
```

O `i18n.js` substitui o texto do elemento pelo valor da chave no idioma atual.

### 6.4. Fallback gracioso

Se um campo não tem tradução no idioma atual, o sistema faz fallback em cadeia:

```javascript
// No main.js, todos os campos usam fallback:
art.title[lang] || art.title.en || art.title.pt || ''
```

**Isso significa:** se você só preencher `pt` e `en`, o site funciona em todos os 7 idiomas (mostra EN para ES/FR/DE/ZH/HI). Não precisa traduzir tudo pra funcionar.

### 6.5. Traduzir conteúdo dinâmico (data.js)

Para traduzir um campo de obra, adicionar a chave do idioma:

```javascript
// Antes (só PT e EN)
title: { pt: "Planeta Turquesa", en: "Turquoise Planet" },

// Depois (com 7 idiomas)
title: {
  pt: "Planeta Turquesa",
  en: "Turquoise Planet",
  es: "Planeta Turquesa",
  fr: "Planeta Turquesa",
  de: "Planet Türkis",
  zh: "绿松石行星",
  hi: "टर्कोइज़ ग्रह"
},
```

---

## 7. Atualizar Bio, Conquistas, Exposições

### 7.1. Bio (resumo curto + fullBio)

No `js/data.js`,找到 o objeto `BIO`:

```javascript
const BIO = {
  name: "Guilherme Miranda",
  role: { pt: "...", en: "...", es: "...", fr: "...", de: "...", zh: "...", hi: "..." },
  tagline: { pt: "...", en: "...", /* ... 7 idiomas */ },
  bio: { pt: "...", en: "...", /* resumo curto, 7 idiomas */ },
  fullBio: {
    pt: ["parágrafo 1", "parágrafo 2", /* 7 parágrafos */],
    en: ["paragraph 1", "paragraph 2", /* 7 paragraphs */],
    es: [...], fr: [...], de: [...], zh: [...], hi: [...]
  },
  stats: [
    { number: "25+", label: { pt: "Anos de carreira", en: "Years of career", /* ... */ } },
    // ... 4 stats
  ]
};
```

### 7.2. Conquistas (BECO_STREET)

```javascript
const BECO_STREET = {
  description: { pt: "...", en: "...", /* 7 idiomas */ },
  highlights: [
    { pt: "1º lugar Deloitte", en: "1st place Deloitte", es: "...", /* 7 idiomas */ },
    // ... 5 highlights
  ],
  website: "https://becostreet.com.br"
};
```

### 7.3. Exposições (EXHIBITIONS)

```javascript
const EXHIBITIONS = [
  {
    year: "2026",
    title: { pt: "Web Summit Lisboa", en: "Web Summit Lisbon", es: "...", /* 7 idiomas */ },
    venue: { pt: "Lisboa, Portugal", en: "Lisbon, Portugal", es: "...", /* 7 idiomas */ },
    type: { pt: "Evento internacional", en: "International event", es: "...", /* 7 idiomas */ }
  },
  // ... mais entradas
];
```

### 7.4. Livros (BOOKS)

```javascript
const BOOKS = {
  description: { pt: "...", en: "...", /* 7 idiomas */ },
  stats: [
    { number: "250+", label: { pt: "Livros publicados", en: "Books published", /* ... */ } },
    // ... 4 stats
  ],
  link: "https://www.amazon.com.br/stores/author/B0DGDMZ4KC"
};
```

---

## 8. Atualizar Contato e Links

### 8.1. Dados de contato (data.js)

```javascript
const CONTACT = {
  email: "superaplicativos2022@gmail.com",
  phone: "+55 11 96616-1611",
  whatsapp: "5511966161611",  // só números, com código país
  instagram: "@GuiMiranda.tech",
  linkedin: "https://www.linkedin.com/in/desenvolvimentodeaplicativos/",
  location: { pt: "Ribeirão Preto, SP · Brasil", en: "Ribeirão Preto, SP · Brazil" },
  notes: {
    pt: "Atelier, studio e galeria com atendimento por hora marcada...",
    en: "Atelier, studio and gallery with appointment-only attendance..."
  }
};
```

### 8.2. Atualizar no HTML também

O `index.html` tem alguns dados hardcoded que precisam ser atualizados junto:

```bash
# Buscar todas as menções a email/whatsapp/instagram
grep -n "superaplicativos2022\|5511966161611\|GuiMiranda.tech\|linkedin" index.html
```

Atualizar cada ocorrência.

### 8.3. Link da Amazon

```bash
# No data.js
grep "link:" js/data.js

# No index.html
grep "amazon" index.html
```

---

## 9. Fazer Deploy

### 9.1. Fluxo completo de deploy

```bash
# 1. Validar sintaxe de todos os JS
node --check js/data.js
node --check js/i18n.js
node --check js/main.js
node --check js/three-scene.js
node --check js/gsap-animations.js

# 2. Bump de versão (força reload do cache)
# Em index.html, trocar v=XXX por v=YYY em todos os assets
# Ex: v=20260731v28 → v=20260731v29
sed -i 's/v=20260731v28/v=20260731v29/g' index.html

# 3. Commit
git add -A
git commit -m "feat: descrição do que mudou"

# 4. Push
git push origin main

# 5. Forçar rebuild do GitHub Pages (opcional, build é automático)
curl -s -X POST \
  -H "Authorization: token SEU_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/superaplicativos/guilherme-miranda-pintor/pages/builds

# 6. Aguardar 60-90 segundos e validar
curl -s -o /dev/null -w "%{http_code}" "https://superaplicativos.github.io/guilherme-miranda-pintor/?v=29"
```

### 9.2. Token do GitHub

Para push, precisa de token com escopo `repo`. Criar em:
https://github.com/settings/tokens

### 9.3. Build é automático

O GitHub Pages detecta o push e faz build automático (60-90 segundos). Não precisa rodar nada.

---

## 10. Cache e Versionamento

### 10.1. Problema de cache

O GitHub Pages usa CDN Fastly com `cache-control: max-age=600` (10 minutos). Para forçar reload:

### 10.2. Solução: cache-bust com versão

Em `index.html`, todos os assets têm `?v=XXX`:

```html
<link rel="stylesheet" href="css/styles.css?v=20260731v28" />
<script src="js/data.js?v=20260731v28"></script>
<script src="js/i18n.js?v=20260731v28"></script>
```

**A cada deploy, bump da versão:**

```bash
# Trocar v=28 por v=29 em todos os assets
sed -i 's/v=20260731v28/v=20260731v29/g' index.html
```

### 10.3. Meta tags anti-cache

O `index.html` já tem:

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

### 10.4. URL com cache-bust

Para testar sem cache, adicionar `?nocache=TIMESTAMP` na URL:

```
https://superaplicativos.github.io/guilherme-miranda-pintor/?nocache=1234567890
```

---

## 11. SEO e AEO

### 11.1. Meta tags (no `index.html`)

- `title`, `description`, `keywords` — atualizados dinamicamente por `i18n.js`
- `hreflang` para 7 idiomas
- Open Graph completo (Facebook, WhatsApp, LinkedIn)
- Twitter Cards
- Meta geo (Ribeirão Preto, BR-SP, coordenadas)

### 11.2. Schema.org JSON-LD (no `index.html`)

4 schemas implementados:

1. **VisualArtist** — tipo específico para artistas (melhor que `Person`)
2. **FAQPage** — 7 perguntas otimizadas para "People Also Ask"
3. **BreadcrumbList** — navegação estruturada
4. **WebSite** com `SearchAction` — habilita busca no Google

### 11.3. Atualizar SEO

Se mudar dados do artista (nome, location, conquistas), atualizar também:

1. Schema `VisualArtist` no `index.html`
2. Schema `FAQPage` no `index.html`
3. Meta `description` e `keywords` no `index.html`
4. Meta `_meta` no `js/i18n.js` (7 idiomas)

### 11.4. Sitemap

`sitemap.xml` lista todas as seções com hreflang para 7 idiomas. Atualizar se adicionar nova seção.

### 11.5. robots.txt

Permite crawl de tudo, bloqueia `/obras-originais/` (fotos originais em alta resolução).

---

## 12. Padrões e Boas Práticas

### 12.1. Nomenclatura de arquivos

- **Fotos das obras:** `CR-XXX-slug-da-obra.jpg` (ex: `CR-001-planeta-turquesa.jpg`)
- **Slug:** lowercase, sem acentos, hífens entre palavras (ex: `planeta-turquesa`)

### 12.2. Código

- **Sem travessões (—)** nos textos. Usar vírgula ou ponto final.
- **Aspas duplas** em strings JS (não aspas simples)
- **Vírgula trailing** permitida no último item de arrays/objetos
- **Indentação:** 2 espaços

### 12.3. Traduções

- **PT e EN são obrigatórios** em todos os campos
- **ES, FR, DE, ZH, HI** são opcionais (sistema faz fallback EN)
- **Nomes próprios** não traduzir: Guilherme Miranda, Beco Street, Cornershop, Brastemp, PlayStation, etc.
- **Termos artísticos** manter no original: assemblage, ready-made, etc.

### 12.4. Imagens

- **Formato:** JPG (fotos), PNG (transparência), SVG (ilustrações)
- **Tamanho:** 1500×2000px ideal, 1-3MB por foto
- **Otimização:** usar `python3 scripts/otimizar_fotos.py` (PIL)
- **Lazy loading:** já configurado (`loading="lazy"` em todas as imgs)

### 12.5. Acessibilidade

- Todos os botões têm `aria-label`
- Imagens têm `alt` descritivo
- Modal fecha com ESC
- Seletor de idiomas tem `role="menu"` e `aria-expanded`

---

## 13. Troubleshooting

### 13.1. Site não atualiza após push

**Causa:** Cache do CDN Fastly (10 min) ou cache do browser.

**Solução:**
1. Bump de versão: `sed -i 's/v=XXX/v=YYY/g' index.html`
2. Acessar com `?nocache=TIMESTAMP` na URL
3. Abrir em aba anônima

### 13.2. Erro "Cannot read properties of undefined"

**Causa:** Campo multilíngue sem tradução no idioma atual.

**Solução:** Garantir que todos os renderizadores têm fallback:
```javascript
art.title[lang] || art.title.en || art.title.pt || ''
```

### 13.3. Seletor de idiomas não abre

**Causa:** JavaScript com erro de sintaxe impede inicialização.

**Solução:**
```bash
node --check js/main.js
node --check js/i18n.js
node --check js/data.js
```

### 13.4. Loader infinito ("Carregando cosmos...")

**Causa:** Erro de JS impede `initLoader()` de rodar.

**Solução:** Verificar console do browser (F12) e corrigir erro de JS.

### 13.5. Fotos não aparecem

**Causa:** Nome do arquivo não bate com `imageFile` no `data.js`.

**Solução:**
```bash
# Verificar que todas as fotos existem
ls assets/artworks/

# Verificar que imageFile no data.js bate
grep "imageFile:" js/data.js
```

### 13.6. Push rejeitado ("non-fast-forward")

**Causa:** Repo remoto tem commits que não estão localmente.

**Solução:**
```bash
git pull --rebase origin main
git push origin main
```

### 13.7. Conflito no rebase

**Solução:**
```bash
git rebase --abort
git push origin main --force  # ⚠️ só em último caso
```

---

## 14. Checklist de Validação

Antes de cada deploy, verificar:

### 14.1. Sintaxe

- [ ] `node --check js/data.js` — OK
- [ ] `node --check js/i18n.js` — OK
- [ ] `node --check js/main.js` — OK
- [ ] `node --check js/three-scene.js` — OK
- [ ] `node --check js/gsap-animations.js` — OK

### 14.2. Conteúdo

- [ ] Todas as obras têm `imageFile` correspondente a arquivo em `assets/artworks/`
- [ ] Todas as obras têm pelo menos `pt` e `en` em `title`, `description`, `technique`
- [ ] `BIO.fullBio` tem 7 parágrafos em `pt` e `en`
- [ ] `CONTACT` tem email, whatsapp, instagram, linkedin válidos
- [ ] Link da Amazon correto: `https://www.amazon.com.br/stores/author/B0DGDMZ4KC`

### 14.3. Cache-bust

- [ ] Bump de versão em `index.html`: `sed -i 's/v=XXX/v=YYY/g' index.html`

### 14.4. Pós-deploy

- [ ] Aguardar 90s
- [ ] Verificar HTTP 200: `curl -s -o /dev/null -w "%{http_code}" URL`
- [ ] Verificar data.js carrega: `curl -s URL/js/data.js?v=YYY | head -5`
- [ ] Abrir no browser em aba anônima e testar troca de idiomas

---

## 📞 Contato do Mantenedor

- **Artista:** Guilherme Miranda
- **Email:** superaplicativos2022@gmail.com
- **WhatsApp:** +55 11 96616-1611
- **Instagram:** @GuiMiranda.tech
- **LinkedIn:** https://www.linkedin.com/in/desenvolvimentodeaplicativos/

---

## 📜 Histórico de Versões

| Versão | Data | Mudança |
|--------|------|---------|
| v1.0 | 2026-07-31 | Site inicial com 12 obras fictícias |
| v2.0 | 2026-07-31 | 18 obras reais + bio atualizada + WhatsApp |
| v3.0 | 2026-07-31 | 7 idiomas + SEO/AEO forense |
| v4.0 | 2026-07-31 | Traduções manuais DE/ZH/HI completas |

---

**Fim do documento.** Para qualquer dúvida, consultar este arquivo antes de modificar o site.
