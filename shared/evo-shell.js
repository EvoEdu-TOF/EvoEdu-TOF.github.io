(function () {
  var LANGUAGE_STORAGE_KEY = 'evoEduPreferredLanguage';
  var DEFAULT_LANGUAGE = 'en';
  var LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' }
  ];
  var SHELL_LABELS = {
    en: {
      home: 'Home',
      platforms: 'Platforms',
      notebook: 'Notebook',
      pathways: 'Pathways',
      curriculum: 'Curriculum',
      roadmap: 'Roadmap',
      translations: 'Translations',
      language: 'Language',
      translationPreviewTitle: 'Translation preview:',
      translationPreviewBody: 'is in the translation queue for this page.',
      translationPreviewCurrent: 'You are currently viewing the English original.',
      translationPreviewLink: 'Open translation queue'
    },
    es: {
      home: 'Inicio',
      platforms: 'Plataformas',
      notebook: 'Cuaderno',
      pathways: 'Rutas',
      curriculum: 'Plan de estudios',
      roadmap: 'Hoja de ruta',
      translations: 'Traducciones',
      language: 'Idioma',
      translationPreviewTitle: 'Vista previa de traducción:',
      translationPreviewBody: 'está en la cola de traducción para esta página.',
      translationPreviewCurrent: 'Actualmente está viendo el original en inglés.',
      translationPreviewLink: 'Abrir cola de traducción'
    },
    fr: {
      home: 'Accueil',
      platforms: 'Plateformes',
      notebook: 'Carnet',
      pathways: 'Parcours',
      curriculum: 'Programme',
      roadmap: 'Feuille de route',
      translations: 'Traductions',
      language: 'Langue',
      translationPreviewTitle: 'Aperçu de traduction :',
      translationPreviewBody: 'est dans la file de traduction pour cette page.',
      translationPreviewCurrent: 'Vous consultez actuellement l’original anglais.',
      translationPreviewLink: 'Ouvrir la file de traduction'
    },
    de: {
      home: 'Startseite',
      platforms: 'Plattformen',
      notebook: 'Notebook',
      pathways: 'Lernpfade',
      curriculum: 'Lehrplan',
      roadmap: 'Fahrplan',
      translations: 'Übersetzungen',
      language: 'Sprache',
      translationPreviewTitle: 'Übersetzungsvorschau:',
      translationPreviewBody: 'steht für diese Seite in der Übersetzungswarteschlange.',
      translationPreviewCurrent: 'Sie sehen derzeit das englische Original.',
      translationPreviewLink: 'Übersetzungswarteschlange öffnen'
    },
    pt: {
      home: 'Início',
      platforms: 'Plataformas',
      notebook: 'Caderno',
      pathways: 'Percursos',
      curriculum: 'Currículo',
      roadmap: 'Roteiro',
      translations: 'Traduções',
      language: 'Idioma',
      translationPreviewTitle: 'Prévia da tradução:',
      translationPreviewBody: 'está na fila de tradução para esta página.',
      translationPreviewCurrent: 'Você está vendo o original em inglês.',
      translationPreviewLink: 'Abrir fila de tradução'
    }
  };

  function labelsFor(code) {
    return SHELL_LABELS[code] || SHELL_LABELS[DEFAULT_LANGUAGE];
  }

  function getSelectedLanguage() {
    try {
      return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;
    } catch (error) {
      return DEFAULT_LANGUAGE;
    }
  }

  function setSelectedLanguage(code) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    } catch (error) {
      // Ignore storage failures and keep the UI functional.
    }
  }

  function buildNav() {
    var nav = document.querySelector('[data-evo-nav]');
    if (!nav) {
      return;
    }

    var current = nav.getAttribute('data-current') || '';
    var labels = labelsFor(getSelectedLanguage());
    var items = [
      { href: '/', key: 'home' },
      { href: '/apps/', key: 'platforms' },
      { href: '/evo/notebook/', key: 'notebook' },
      { href: '/evo/pathways/', key: 'pathways' },
      { href: '/evo/curriculum/', key: 'curriculum' },
      { href: '/evo/roadmap.html', key: 'roadmap' },
      { href: '/translation-status/', key: 'translations' }
    ];

    nav.innerHTML = items.map(function (item) {
      var active = item.key === current ? ' aria-current="page"' : '';
      return '<a href="' + item.href + '"' + active + '>' + (labels[item.key] || item.key) + '</a>';
    }).join('');
  }

  function ensureTranslationLink(nav) {
    if (!nav || nav.querySelector('[data-translation-link]')) {
      return;
    }

    var labels = labelsFor(getSelectedLanguage());
    var link = document.createElement('a');
    link.href = '/translation-status/';
    link.textContent = labels.translations;
    link.setAttribute('data-translation-link', 'true');
    nav.appendChild(link);
  }

  function updateBannerText(banner, language) {
    var labels = labelsFor(language.code);
    if (language.code === DEFAULT_LANGUAGE) {
      banner.hidden = true;
      return;
    }

    banner.hidden = false;
    banner.innerHTML =
      '<strong>' + labels.translationPreviewTitle + '</strong> ' +
      language.label +
      ' ' + labels.translationPreviewBody + ' ' +
      labels.translationPreviewCurrent + ' ' +
      '<a href="/translation-status/">' + labels.translationPreviewLink + '</a>.';
  }

  function ensureLanguageSwitch(nav) {
    if (!nav || nav.querySelector('.site-language-switch')) {
      return;
    }

    var selected = getSelectedLanguage();
    var wrapper = document.createElement('div');
    wrapper.className = 'site-language-switch';
    wrapper.setAttribute('data-language-switch', 'true');

    var label = document.createElement('label');
    label.className = 'site-language-label';
    label.setAttribute('for', 'site-language-select');
    label.textContent = labelsFor(selected).language;

    var select = document.createElement('select');
    select.className = 'site-language-select';
    select.id = 'site-language-select';
    select.setAttribute('aria-label', labelsFor(selected).language);

    LANGUAGES.forEach(function (language) {
      var option = document.createElement('option');
      option.value = language.code;
      option.textContent = language.label;
      if (language.code === selected) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener('change', function () {
      var code = select.value;
      var language = LANGUAGES.find(function (item) {
        return item.code === code;
      }) || LANGUAGES[0];
      setSelectedLanguage(code);
      label.textContent = labelsFor(code).language;
      select.setAttribute('aria-label', labelsFor(code).language);
      buildNav();
      var banner = document.querySelector('.translation-banner');
      if (banner) {
        updateBannerText(banner, language);
      }
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    nav.appendChild(wrapper);
  }

  function ensureTranslationBanner() {
    var shell = document.querySelector('.site-shell');
    if (!shell) {
      return;
    }

    var topbar = shell.querySelector('.site-topbar');
    if (!topbar) {
      return;
    }

    var banner = shell.querySelector('.translation-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'note-band translation-banner';
      banner.hidden = true;
      topbar.insertAdjacentElement('afterend', banner);
    }

    var selected = getSelectedLanguage();
    var language = LANGUAGES.find(function (item) {
      return item.code === selected;
    }) || LANGUAGES[0];
    updateBannerText(banner, language);
  }

  function initializeShell() {
    buildNav();

    document.querySelectorAll('.site-nav').forEach(function (nav) {
      ensureTranslationLink(nav);
      ensureLanguageSwitch(nav);
    });

    ensureTranslationBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShell);
  } else {
    initializeShell();
  }
})();
