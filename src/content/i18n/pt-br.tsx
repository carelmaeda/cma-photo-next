import Link from "next/link";
import { InstagramLink } from "@/components/instagram-link";
import { siteConfig } from "@/lib/siteConfig";
import type { Dictionary } from "./dictionary";

/**
 * Brazilian Portuguese. Same voice as the English (SPEC §4): first person,
 * short sentences, specific names, no sales language, no dashes.
 *
 * TODO (owner): first draft. Read it, correct it, make it yours before the
 * Portuguese pages go live.
 */
export const ptBr: Dictionary = {
  locale: "pt-br",

  site: {
    title: "Carel Maeda: Receitas Fujifilm e Fotografia de Viagem",
    description:
      "Receitas Fujifilm gratuitas com todas as configurações, fotografia de viagem cidade por cidade e notas sobre fotografar em JPG direto da câmera. Feito em São Paulo, baseado em Toronto.",
    keywords: [
      "receitas Fujifilm",
      "receitas de simulação de filme Fujifilm",
      "fotografia de viagem Fujifilm",
      "fotografia de viagem",
      "JPG direto da câmera",
      "Carel Maeda",
    ],
  },

  skipToContent: "Pular para o conteúdo",

  nav: {
    labels: {
      home: "Início",
      recipes: "Receitas",
      gallery: "Galeria",
      prints: "Prints",
      downloads: "Downloads",
      blog: "Blog",
      about: "Sobre",
    },
    logoHome: `${siteConfig.name}, página inicial`,
    main: "Principal",
    mobile: "Celular",
    menu: "Menu",
    openMenu: "Abrir menu",
    language: "Idioma",
    en: "EN",
    pt: "PT",
  },

  breadcrumbs: { home: "Início", recipes: "Receitas", blog: "Blog" },

  person: {
    jobTitle: "Fotógrafo de viagem",
    description:
      "Fotógrafo de viagem com Fujifilm, JPG direto da câmera. Publica receitas Fujifilm gratuitas com todas as configurações.",
    knowsAbout: [
      "Receitas de simulação de filme Fujifilm",
      "Fotografia de viagem",
      "Fujifilm X100V",
      "Fujifilm GFX100RF",
      "Fotografia em JPEG",
    ],
    homeLocation: "Toronto, Canadá",
    birthPlace: "São Paulo, Brasil",
  },

  home: {
    h1: "Carel Maeda. Fotografia de viagem com Fujifilm.",
    keywords: [
      "receitas Fujifilm grátis",
      "receitas Fujifilm X100V",
      "fotos Fujifilm GFX100RF",
      "fotógrafo de viagem Toronto",
    ],
  },

  about: {
    title: "Sobre: Fotógrafo de Viagem Fujifilm em Toronto",
    description:
      "Feito em São Paulo, baseado em Toronto. Por que fotografo só em JPG na Fujifilm sem editar, por que uma lente fixa basta e o equipamento que carrego: GFX100RF, X100V, X-Pro3, Leica M5.",
    keywords: [
      "Carel Maeda fotógrafo",
      "fotógrafo de viagem Toronto",
      "fotógrafo Fujifilm",
      "GFX100RF",
      "X100V",
    ],
    heading: "Sobre",
    intro: (
      <>
        <p className="text-ink">Eu sou o Carel. Feito em São Paulo, baseado em Toronto.</p>
        <p>
          Cresci numa cidade de vinte milhões de pessoas e hoje vivo numa que
          congela metade do ano. As duas me ensinaram a mesma coisa: a luz é o
          assunto. O resto é só estar no lugar certo.
        </p>
        <p>
          Fotografo com Fujifilm: uma GFX100RF para as viagens, uma X100V para
          o dia a dia, uma X-Pro3 quando quero a sensação de rangefinder. E uma
          Leica M5 com Portra 160 quando quero desacelerar de vez.
        </p>
        <p>
          Tudo que é digital é JPG, direto da câmera. Sem Lightroom, sem
          edição. Eu construo o visual dentro da câmera com receitas.{" "}
          <Link href="/pt-br/recipes/vanilla-summer" className="underline hover:text-indigo">
            Vanilla Summer
          </Link>{" "}
          é a que eu sempre volto. A limitação me deixa mais criativo: uma
          lente, um visual, e toda a atenção no enquadramento.
        </p>
        <p>
          O que eu fotografo: cidades, viagens, os momentos entre uma coisa e
          outra que ninguém planeja. O que eu não fotografo: casamentos,
          eventos, estúdio.
        </p>
      </>
    ),
    gearHeading: "O que eu carrego",
    gearIntro:
      "Uma lista curta de propósito. Cada item ganhou o lugar por ser o que eu realmente pego, quase sempre um de cada vez.",
    gearCategories: {
      Cameras: "Câmeras",
      Lenses: "Lentes",
      "Film & Accessories": "Filme e acessórios",
      "Bags & Straps": "Bolsas e alças",
    },
    gearNote:
      "Nada aqui é patrocinado e não há links de afiliado por enquanto. Se isso mudar um dia, vai estar escrito aqui, com todas as letras.",
    contact: (
      <p className="text-ink-soft">
        Dúvidas sobre uma receita, um lugar, um print, ou imprensa e
        colaborações? O jeito mais rápido de me encontrar é uma DM no{" "}
        <InstagramLink />. Eu leio tudo.
      </p>
    ),
  },

  recipes: {
    title: "Receitas Fujifilm Grátis, Configurações Completas",
    description: (recipes) =>
      `Receitas de simulação de filme Fujifilm gratuitas para corpos X-Trans IV e V: ${recipes
        .map((recipe) => `${recipe.name} em ${recipe.filmSimulation}`)
        .join(", ")}. Todas as configurações listadas, nada bloqueado.`,
    keywords: [
      "receitas Fujifilm grátis",
      "receitas Fujifilm X-Trans IV",
      "receitas Fujifilm X-Trans V",
      "receitas de simulação de filme X100V",
      "configurações JPEG Fujifilm",
      "presets Lightroom Fujifilm",
    ],
    listName: "Receitas Fujifilm",
    eyebrow: "Grátis, configurações completas",
    heading: "Receitas Fujifilm",
    intro:
      "Os visuais feitos dentro da câmera por trás das minhas fotos. Toda configuração está na página, de graça. Ajuste, salve num slot personalizado, vá fotografar.",
    presetsHeading: "Presets para Lightroom",
    presetsIntro:
      "Eu fotografo em JPG e construo o visual na câmera. Se você fotografa em RAW e edita, estes presets dão o mesmo visual no Lightroom. Download grátis, sem pedir e-mail.",
    newsletterHeading: "Quando a próxima receita sair",
    newsletterIntro:
      "Mando um e-mail por mês, quase só fotos, e receitas novas quando ficam prontas. Cancele quando quiser.",
  },

  recipePage: {
    title: (recipe) => `${recipe.name}: Receita Fujifilm ${recipe.filmSimulation}`,
    description: (recipe) =>
      `Receita Fujifilm grátis: ${recipe.name}, um visual ${recipe.filmSimulation} para corpos ${recipe.compatibility}. Todas as configurações listadas. ${recipe.taglinePt}`,
    keywords: (recipe) => [
      `receita Fujifilm ${recipe.name}`,
      `receita ${recipe.filmSimulation}`,
      `receita Fujifilm ${recipe.filmSimulation}`,
      "receitas X-Trans IV",
      "receitas X-Trans V",
      "receitas X100V",
      "configurações JPEG Fujifilm",
    ],
    headline: (recipe) => `${recipe.name}: uma receita Fujifilm ${recipe.filmSimulation}`,
    aboutName: "Receitas de simulação de filme Fujifilm",
    ldKeywords: (recipe) =>
      `${recipe.name}, ${recipe.filmSimulation}, ${recipe.compatibility}, receita Fujifilm`,
    eyebrow: "Grátis, configurações completas",
    heading: (recipe) => `Receita Fujifilm ${recipe.name}`,
    by: "por",
    settingHeader: "Configuração",
    download: "Baixar em PNG",
    loadingHeading: "Como carregar",
    loading1:
      "Salve num slot personalizado (C1 a C7) para ficar a um giro do dial. Depois é só entrar no visual sem mexer nos menus de novo.",
    loading2:
      "E então pare de pensar nisso. A ideia toda é a câmera fazer o trabalho enquanto você olha a luz.",
    wroteAbout: "Escrevi sobre o porquê de cada configuração:",
    alsoPublish: "Também publico",
    sameDeal: ". Mesmo esquema: grátis, toda configuração na página.",
    shotOn: (recipe) => `Fotografado com ${recipe.name}`,
    lightroomHeading: "A versão para Lightroom",
    lightroomIntro:
      "Eu fotografo em JPG, então o visual acima vive dentro da câmera. Se você fotografa em RAW e edita, estes presets chegam na mesma sensação no Lightroom. Download grátis.",
    newsletterHeading: "Se quiser a próxima",
    newsletterIntro:
      "Mando um e-mail por mês, quase só fotos, e receitas novas quando ficam prontas. Cancele quando quiser.",
  },

  blog: {
    title: "Blog de Receitas Fujifilm e Fotografia de Viagem",
    description:
      "Guias em português claro sobre receitas e simulações de filme Fujifilm, fotografar em JPG sem editar e fotografia de viagem com a X100V e a GFX100RF.",
    keywords: [
      "receitas Fujifilm explicadas",
      "guia de simulações de filme Fujifilm",
      "fotografar só em JPEG",
      "blog de fotografia de viagem",
    ],
    listName: "Blog",
    heading: "Blog",
    intro: "Coisas que eu descobri, escritas direito. Sem enchimento.",
    categories: {
      "recipe-guide": "Receitas",
      "city-guide": "Guias de cidade",
      craft: "Ofício",
    },
  },

  related: {
    heading: "Continue",
    album: (title) => `O álbum de ${title}`,
    recipe: "Vanilla Summer, a receita",
    about: "O que eu carrego",
  },

  notFound: {
    title: "Não encontrado",
    eyebrow: "FR-404 · Não encontrado",
    heading: "Esse frame não existe.",
    body: "A página que você procura não está aqui. As fotografias estão.",
    back: "← Voltar ao início",
  },

  codeBlock: { copy: "Copiar", copyAria: "Copiar código", copied: "Copiado" },
};
