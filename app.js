/* ============================================================================
 * CONSTANTES : TOUS LES TAUX, SEUILS ET DATES DE L'OUTIL
 * ----------------------------------------------------------------------------
 * A relire chaque année (et à chaque changement de loi).
 * Dernière vérification : 2026-10-18.
 * Détail, source exacte et niveau de confiance de chaque valeur :
 *   README (sources officielles citées dans la page)
 *
 * Légende des commentaires :
 *   [OFFICIEL]    lu sur une page officielle (service-public.fr, impots.gouv.fr)
 *   [SECONDAIRE]  trouvé seulement sur un site tiers : A VERIFIER avant mise en ligne
 * ========================================================================== */

const RATES_CHECKED_ON = "2026-10-18";

const RATES = {
  year: 2026,

  // Taux micro-social par activité (cotisations sociales, hors CFP).
  //   cotisations : taux appliqué au CA
  //   cfp          : contribution à la formation professionnelle, appliquée au CA
  //   vfl          : versement libératoire de l'IR, appliqué au CA
  //   ceiling      : plafond annuel de CA du régime micro
  //   tvaBase      : seuil de base de la franchise en base de TVA (CA de N-1)
  //   tvaTolerance : seuil de tolérance de la franchise en base de TVA (CA de N)
  activities: {
    // Vente de marchandises (BIC)
    vente: {
      label: "Vente de marchandises (BIC)",
      cotisations: 0.123,  // [OFFICIEL] 12,3 % (autoentrepreneur.urssaf.fr, lessentiel-du-statut)
      cfp: 0.001,          // [OFFICIEL] 0,1 % commerçants (autoentrepreneur.urssaf.fr, lessentiel-du-statut)
      vfl: 0.01,           // [OFFICIEL] 1 % (service-public.fr/vosdroits/F23267)
      ceiling: 203100,     // [OFFICIEL] 203 100 € (service-public.fr/vosdroits/F23267)
      tvaBase: 85000,      // [OFFICIEL] 85 000 € (service-public.fr/vosdroits/F21746)
      tvaTolerance: 93500  // [OFFICIEL] 93 500 € (service-public.fr/vosdroits/F21746)
    },

    // Prestations de services commerciales ou artisanales (BIC)
    services: {
      label: "Prestations de services (BIC)",
      cotisations: 0.212,  // [OFFICIEL] 21,2 % (autoentrepreneur.urssaf.fr, lessentiel-du-statut)
      cfp: 0.001,          // [OFFICIEL] 0,1 % commerçants, 0,3 % artisans (autoentrepreneur.urssaf.fr, lessentiel-du-statut)
      vfl: 0.017,          // [OFFICIEL] 1,7 % (service-public.fr/vosdroits/F23267)
      ceiling: 83600,      // [OFFICIEL] 83 600 € (service-public.fr/vosdroits/F23267)
      tvaBase: 37500,      // [OFFICIEL] 37 500 € (service-public.fr/vosdroits/F21746)
      tvaTolerance: 41250  // [OFFICIEL] 41 250 € (service-public.fr/vosdroits/F21746)
    },

    // Prestations non commerciales, régime SSI (BNC)
    bnc: {
      label: "Prestations non commerciales (BNC, SSI)",
      cotisations: 0.256,  // [OFFICIEL] 25,6 % (autoentrepreneur.urssaf.fr, lessentiel-du-statut)
      cfp: 0.002,          // [OFFICIEL] 0,2 % professions libérales (autoentrepreneur.urssaf.fr)
      vfl: 0.022,          // [OFFICIEL] 2,2 % (service-public.fr/vosdroits/F23267)
      ceiling: 83600,      // [OFFICIEL] 83 600 € (service-public.fr/vosdroits/F23267)
      tvaBase: 37500,      // [OFFICIEL] seuil "prestations de services" (service-public.fr/vosdroits/F21746)
      tvaTolerance: 41250  // [OFFICIEL] idem
    },

    // Profession libérale réglementée, régime CIPAV (BNC)
    cipav: {
      label: "Profession libérale réglementée (CIPAV)",
      cotisations: 0.232,  // [OFFICIEL] 23,2 % (autoentrepreneur.urssaf.fr, lessentiel-du-statut)
      cfp: 0.002,          // [OFFICIEL] 0,2 % professions libérales (autoentrepreneur.urssaf.fr)
      vfl: 0.022,          // [OFFICIEL] 2,2 % (service-public.fr/vosdroits/F23267)
      ceiling: 83600,      // [OFFICIEL] 83 600 € (service-public.fr/vosdroits/F23267)
      tvaBase: 37500,      // [OFFICIEL] idem BNC
      tvaTolerance: 41250  // [OFFICIEL] idem BNC
    }
  },

  // ACRE : réduction des cotisations sociales (pas du CFP ni du VFL).
  // [OFFICIEL] 25 % pour une activité débutée à partir du 1er juillet 2026, demande dans les 60 jours
  // (service-public.fr/vosdroits/F11677, vérifié le 2026-10-18). 50 % avant cette date : ancien taux.
  acre: {
    before: 0.5,  // activité débutée avant le 2026-07-01
    from: 0.25    // activité débutée à partir du 2026-07-01
  },

  // Non modélisé dans le simulateur : CFE, TFCC (chambres consulaires, commerçants et artisans),
  // IR si pas de versement libératoire (dépend du foyer), conditions d'éligibilité au VFL.
};

// Dates de la facturation électronique.
// [OFFICIEL, lu via impots.gouv.fr] https://www.impots.gouv.fr/professionnel/je-decouvre-la-facturation-electronique
const EINVOICE_DATES = {
  receptionFrom: "2026-09-01",    // réception obligatoire pour toutes les entreprises assujetties à la TVA
  issueMicroFrom: "2027-09-01",   // émission pour PME et micro-entreprises (grandes entreprises et ETI : 2026-09-01)
};

// ============================================================================
// FIN DES CONSTANTES. Le code ci-dessous n'a pas besoin d'être modifié chaque année.
// ============================================================================

const URL_IMPOTS_EINVOICE = "https://www.impots.gouv.fr/professionnel/je-decouvre-la-facturation-electronique";
const URL_SP_MICRO = "https://entreprendre.service-public.gouv.fr/vosdroits/F23267";
const URL_SP_TVA = "https://entreprendre.service-public.gouv.fr/vosdroits/F21746";
const URL_URSSAF = "https://www.urssaf.fr";

const fmtEur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const fmtPct = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 1 });
const fmtInt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

function parseDay(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function fmtDate(d) {
  const s = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return d.getDate() === 1 ? s.replace(/^1 /, "1er ") : s;
}

function daysUntil(d) {
  return Math.ceil((d - startOfToday()) / 86400000);
}

function dateStatus(d) {
  const days = daysUntil(d);
  if (days <= 0) {
    return { done: true, text: "En vigueur depuis le " + fmtDate(d) };
  }
  return { done: false, text: "Dès le " + fmtDate(d) + " (dans " + fmtInt.format(days) + " jours)" };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function formValues(form) {
  const out = {};
  new FormData(form).forEach(function (v, k) { out[k] = v; });
  return out;
}

// ----------------------------------------------------------------------------
// SECTION 1 : facturation électronique
// ----------------------------------------------------------------------------

function renderEinvoice(ans) {
  const box = document.getElementById("einvoice-results");

  if (!ans.micro || !ans.tva || !ans.clients) {
    box.innerHTML = '<p class="muted">Répondez aux trois questions pour voir vos échéances.</p>';
    return;
  }

  if (ans.micro === "non") {
    box.innerHTML =
      '<div class="notice warn">' +
      "<p>Cet outil est conçu pour les micro-entrepreneurs. Pour un autre statut, retenez le calendrier général :</p>" +
      "<ul>" +
      "<li>Réception de factures électroniques : dès le " + fmtDate(parseDay(EINVOICE_DATES.receptionFrom)) + " pour toutes les entreprises assujetties à la TVA.</li>" +
      "<li>Émission : dès le " + fmtDate(parseDay(EINVOICE_DATES.receptionFrom)) + " pour les grandes entreprises et les ETI, dès le " + fmtDate(parseDay(EINVOICE_DATES.issueMicroFrom)) + " pour les PME.</li>" +
      "</ul>" +
      '<p class="src">Source : <a href="' + URL_IMPOTS_EINVOICE + '">impots.gouv.fr, je découvre la facturation électronique</a></p>' +
      "</div>";
    return;
  }

  const cards = [];

  // Carte 1 : réception
  const rec = dateStatus(parseDay(EINVOICE_DATES.receptionFrom));
  let recText =
    "Toutes les entreprises assujetties à la TVA doivent pouvoir recevoir des factures électroniques, micro-entrepreneurs compris. " +
    "Prévoyez une solution de réception (plateforme agréée).";
  if (ans.tva === "franchise") {
    recText += " Vous êtes en franchise de TVA : cette obligation s'applique quand même.";
  }
  cards.push(card("Recevoir vos factures électroniques", rec, recText, URL_IMPOTS_EINVOICE, rec.done));

  // Carte 2 : émission
  const iss = dateStatus(parseDay(EINVOICE_DATES.issueMicroFrom));
  let issText;
  if (ans.clients === "b2c") {
    issText =
      "Vos ventes aux particuliers ne donnent pas lieu à une facture électronique. Elles relèvent de l'e-reporting (carte suivante). " +
      "Si vous facturez aussi des entreprises, ces factures devront être électroniques.";
  } else {
    issText = "Vos factures à des entreprises (B2B) devront être émises au format électronique.";
  }
  cards.push(card("Émettre vos factures électroniques", iss, issText, URL_IMPOTS_EINVOICE, iss.done));

  // Carte 3 : e-reporting
  if (ans.clients === "b2c" || ans.clients === "both") {
    const er = dateStatus(parseDay(EINVOICE_DATES.issueMicroFrom));
    cards.push(card(
      "Transmettre l'e-reporting de vos ventes aux particuliers",
      er,
      "Transmission des données de vos ventes aux particuliers à l'administration. Le calendrier suit celui de l'émission. " +
      "Confirmez les modalités exactes pour votre cas.",
      URL_IMPOTS_EINVOICE,
      er.done
    ));
  } else {
    const er2 = { done: false, text: "Pas d'e-reporting pour vos ventes à des entreprises françaises (à confirmer)" };
    cards.push(card(
      "E-reporting",
      er2,
      "Pour des ventes à des entreprises françaises, la facture électronique suffit en principe. Vérifiez si votre cas particulier change la règle.",
      URL_IMPOTS_EINVOICE,
      false
    ));
  }

  box.innerHTML = cards.join("");
}

function card(title, status, text, url, done) {
  return (
    '<article class="card' + (done ? " done" : "") + '">' +
    "<h3>" + escapeHtml(title) + "</h3>" +
    '<p class="when">' + escapeHtml(status.text) + "</p>" +
    "<p>" + escapeHtml(text) + "</p>" +
    '<p class="src">Source : <a href="' + url + '">impots.gouv.fr</a></p>' +
    "</article>"
  );
}

// ----------------------------------------------------------------------------
// SECTION 2 : simulateur de revenu net
// ----------------------------------------------------------------------------

function simulate(input) {
  const a = RATES.activities[input.activity];
  const amount = Math.max(0, Number(String(input.amount).replace(",", ".")) || 0);
  const ca = input.period === "mois" ? amount * 12 : amount;

  const acreRate = input.acre === "avant" ? RATES.acre.before
    : input.acre === "apres" ? RATES.acre.from
    : 0;

  const cotisBrut = ca * a.cotisations;
  const acreGain = cotisBrut * acreRate;
  const cotis = cotisBrut - acreGain;
  const cfp = ca * a.cfp;
  const vfl = input.vfl === "oui" ? ca * a.vfl : 0;
  const net = ca - cotis - cfp - vfl;

  return {
    a: a,
    ca: ca,
    cotisBrut: cotisBrut,
    acreRate: acreRate,
    acreGain: acreGain,
    cotis: cotis,
    cfp: cfp,
    vfl: vfl,
    net: net,
    vflChosen: input.vfl === "oui"
  };
}

function renderSimulation(input) {
  const box = document.getElementById("sim-results");
  const amount = Number(String(input.amount).replace(",", "."));

  if (!amount || amount <= 0) {
    box.innerHTML = '<p class="muted">Saisissez votre chiffre d\'affaires pour voir l\'estimation.</p>';
    return;
  }

  const r = simulate(input);
  const a = r.a;
  const ceilingRatio = r.ca / a.ceiling;
  const ceilingPct = Math.min(100, Math.round(ceilingRatio * 100));
  const overCeiling = r.ca > a.ceiling;
  const tvaBaseRatio = r.ca / a.tvaTolerance;
  const overTolerance = r.ca > a.tvaTolerance;
  const overBase = r.ca > a.tvaBase;

  const rows = [];
  rows.push(row("Chiffre d'affaires annuel", fmtEur.format(r.ca), ""));
  rows.push(row(
    "Cotisations sociales (" + fmtPct.format(a.cotisations) + ")" +
      (r.acreGain > 0 ? '<span class="note">dont réduction ACRE de ' + fmtPct.format(r.acreRate) + " : " + fmtEur.format(r.acreGain) + "</span>" : ""),
    "− " + fmtEur.format(r.cotis), ""
  ));
  rows.push(row("CFP, formation professionnelle (" + fmtPct.format(a.cfp) + ")", "− " + fmtEur.format(r.cfp), ""));
  if (r.vflChosen) {
    rows.push(row("Versement libératoire de l'IR (" + fmtPct.format(a.vfl) + ")", "− " + fmtEur.format(r.vfl), ""));
  } else {
    rows.push(row("Impôt sur le revenu", '<span class="note">non calculé : dépend de votre foyer fiscal</span>', ""));
  }
  rows.push(row(
    r.vflChosen ? "Revenu net après cotisations, CFP et impôt (VFL)" : "Revenu net avant impôt sur le revenu",
    fmtEur.format(r.net), "total"
  ));
  rows.push(row("Soit par mois", fmtEur.format(r.net / 12), ""));

  let html = '<div class="table-wrap"><table class="sim"><tbody>' + rows.join("") + "</tbody></table></div>";

  // Plafond du régime micro
  html +=
    "<h3>Plafond de chiffre d'affaires (" + escapeHtml(a.label) + ")</h3>" +
    '<div class="progress" role="img" aria-label="' + ceilingPct + ' % du plafond"><span class="' + (overCeiling ? "over" : "") + '" style="width:' + Math.min(100, ceilingPct) + '%"></span></div>' +
    "<p>" + fmtEur.format(a.ceiling) + " de plafond annuel 2026. " +
    (overCeiling
      ? "<strong>Vous dépassez ce plafond</strong> : le régime micro ne s'applique pas à votre CA."
      : "Il vous reste " + fmtEur.format(a.ceiling - r.ca) + " (" + fmtInt.format(ceilingPct) + " % du plafond utilisé).") +
    "</p>";

  // Franchise en base de TVA
  html +=
    "<h3>Franchise en base de TVA</h3>" +
    '<div class="progress" role="img" aria-label="' + Math.round(tvaBaseRatio * 100) + ' % du seuil de tolérance"><span class="' + (overTolerance ? "over" : "") + '" style="width:' + Math.min(100, Math.round(tvaBaseRatio * 100)) + '%"></span></div>';
  if (overTolerance) {
    html += "<p><strong>Vous dépassez le seuil de tolérance</strong> (" + fmtEur.format(a.tvaTolerance) + ") : la franchise ne s'appliquera plus. Vérifiez les modalités sur service-public.fr.</p>";
  } else if (overBase) {
    html += "<p>Vous êtes au-dessus du seuil de base (" + fmtEur.format(a.tvaBase) + "), mais sous le seuil de tolérance (" + fmtEur.format(a.tvaTolerance) + "). La franchise dépend de votre CA de l'année précédente : vérifiez votre situation.</p>";
  } else {
    html += "<p>Sous le seuil de base (" + fmtEur.format(a.tvaBase) + "). Il vous reste " + fmtEur.format(a.tvaTolerance - r.ca) + " avant le seuil de tolérance.</p>";
  }

  // Sources et limites
  html +=
    '<div class="notice">' +
    "<p><strong>Ce qui n'est pas inclus :</strong> CFE (due à partir de la 2e année), TFCC pour les commerçants et artisans, impôt sur le revenu sans versement libératoire, conditions d'éligibilité au versement libératoire." +
    (input.activity === "services" ? " Le CFP est calculé au taux commerçant (0,1 %) : il est de 0,3 % pour une activité artisanale." : "") + "</p>" +
    '<p class="src">Sources : <a href="' + URL_SP_MICRO + '">service-public.fr, régime micro (plafonds et VFL)</a>, <a href="' + URL_SP_TVA + '">service-public.fr, franchise en base de TVA</a>, <a href="' + URL_URSSAF + '">urssaf.fr (cotisations)</a>. Taux contrôlés sur les pages officielles le ' + RATES_CHECKED_ON + '.</p>' +
    "</div>";

  box.innerHTML = html;
}

function row(label, value, cls) {
  return '<tr' + (cls ? ' class="' + cls + '"' : "") + '><th scope="row">' + label + "</th><td>" + value + "</td></tr>";
}

// ----------------------------------------------------------------------------
// Initialisation
// ----------------------------------------------------------------------------

(function init() {
  const einvoiceForm = document.getElementById("einvoice-form");
  const simForm = document.getElementById("sim-form");

  function onEinvoice() {
    renderEinvoice(formValues(einvoiceForm));
  }
  einvoiceForm.addEventListener("change", onEinvoice);

  function onSim() {
    renderSimulation(formValues(simForm));
  }
  simForm.addEventListener("input", onSim);
  simForm.addEventListener("change", onSim);

  onEinvoice();
  onSim();
})();
