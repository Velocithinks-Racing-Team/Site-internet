(() => {
  const $ = id => document.getElementById(id);
  const GOAL = 4500;
  const fmt = n => n.toLocaleString('fr-FR') + ' €';
  const TIERS = [
    { min: 1500, name: 'Partenaire principal', color: '--orange', perks: ['Votre logo en grand sur la voiture', 'Mention lors de nos présentations orales', 'Une place privilégiée dans toutes nos communications'] },
    { min: 750, name: 'Premium', color: '--red', perks: ['Votre logo sur les tenues de l\'équipe', 'Votre logo sur notre stand en compétition'] },
    { min: 300, name: 'Partenaire', color: '--violet', perks: ['Votre logo dans nos supports de communication', 'Une publication Instagram dédiée'] },
    { min: 100, name: 'Supporter', color: '--blue', perks: ['Remerciement sur notre compte Instagram', 'Votre nom sur la page partenaires du site'] }
  ];
  const slider = $('montant'), box = $('mecenat'), sim = document.querySelector('.sim');

  function update() {
    const a = +slider.value, mec = box.checked;
    $('val').textContent = fmt(a);
    let title, perks, color = '--blue', note = '';
    if (a === 0) {
      title = 'Choisissez un montant'; perks = ['Chaque euro compte pour notre saison'];
    } else if (mec) {
      const red = Math.round(a * 0.6);
      title = 'Don de mécénat'; color = '--orange';
      perks = [`Réduction d'impôt : ${fmt(red)} (60 %)`, `Coût réel pour votre entreprise : ${fmt(a - red)}`, 'Reçu fiscal, selon l\'éligibilité de notre structure'];
      note = 'Un don de mécénat est sans contrepartie publicitaire, c\'est ce qui le distingue du sponsoring. Informations indicatives, à valider auprès de votre expert-comptable.';
    } else {
      const t = TIERS.find(t => a >= t.min);
      if (t) { title = 'Formule ' + t.name; color = t.color; perks = ['Cumule les contreparties des niveaux précédents', ...t.perks]; }
      else { title = 'Don libre'; perks = ['Merci ! Dès 100 €, vous devenez Supporter']; }
    }
    sim.style.setProperty('--c', `var(${color})`);
    $('tier').textContent = title;
    $('perks').innerHTML = perks.map(p => `<li>${p}</li>`).join('');
    $('fill').style.width = Math.min(100, a / GOAL * 100) + '%';
    $('goaltxt').textContent = a ? `Votre soutien couvre ${(a / GOAL * 100).toFixed(1).replace('.', ',')} % de notre objectif de ${fmt(GOAL)}.` : `Objectif de la saison : ${fmt(GOAL)}.`;
    $('note').textContent = note;
  }
  slider.addEventListener('input', update); box.addEventListener('change', update); update();

  // Choisir une formule -> pré-remplit le formulaire
  document.querySelectorAll('details button').forEach(b => b.addEventListener('click', () => {
    $('formule').value = b.closest('details').dataset.f;
    $('contact').scrollIntoView();
  }));

  // Barres du budget : animation à l'apparition
  const bars = document.querySelector('.bars');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((e, o) => e[0].isIntersecting && (bars.classList.add('in'), o.disconnect()), { threshold: .3 }).observe(bars);
  } else bars.classList.add('in');

  // Formulaire -> ouvre la messagerie
  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const body = `Nom : ${d.nom}\nEntreprise : ${d.entreprise || '-'}\nE-mail : ${d.email}\nFormule envisagée : ${d.formule}\n\n${d.message}`;
    location.href = 'mailto:velocithinksracing@gmail.com?subject=' + encodeURIComponent('Partenariat Velocithinks – ' + d.nom) + '&body=' + encodeURIComponent(body);
  });
})();
