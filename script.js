const pages = [
  { id:'executive-view', title:'Executive View', image:'images/executive-view.png' },
  { id:'financial-opportunity-analysis', title:'Financial Opportunity Analysis', image:'images/financial-opportunity-analysis.png' },
  { id:'10-point-rollout', title:'10-Point Rollout', image:'images/10-point-rollout.png' },
  { id:'pre-pilot', title:'Pre-Pilot', image:'images/pre-pilot.png' },
  { id:'pre-pilot-cost', title:'Pre-Pilot Cost', image:'images/pre-pilot-cost.png' },
  { id:'pilot-program', title:'Pilot Program', image:'images/pilot-program.png' },
  { id:'regional-rollout', title:'Regional Rollout', image:'images/regional-rollout.png' },
  { id:'divisional-rollout', title:'Divisional Rollout', image:'images/divisional-rollout.png' },
  { id:'divisional-investment-strategy', title:'Divisional Investment Strategy', image:'images/divisional-investment-strategy.png' },
  { id:'roi', title:'ROI', image:'images/roi.png' },
  { id:'cost-of-inaction', title:'Cost of Inaction', image:'images/cost-of-inaction.png' },
  { id:'red-team', title:'Red Team', image:'images/red-team.png' },
  { id:'research-references', title:'Research and References', html: renderReferences },
  { id:'thank-you', title:'Thank You', image:'images/thank-you.png' }
];

const refs = {
  'Retail & Industry Reports': [
    ['Kroger','Annual Reports','Financial performance & strategic overview','https://ir.kroger.com/financials/annual-reports/default.aspx'],
    ['Kroger','ESG Report','Environmental, social & governance','https://www.thekrogerco.com/sustainability/'],
    ['Kroger Investor Relations','Investor Relations Overview','Investor information & financial updates','https://ir.kroger.com/'],
    ['National Retail Federation','Retail Big Show','Retail industry trends & outlook','https://nrf.com/resources/retail-library/nrf-big-show'],
    ['Deloitte','Retail Industry Outlook','Retail trends, risks & opportunities','https://www.deloitte.com/us/en/industries/retail.html'],
    ['McKinsey & Company','Retail Insights','AI adoption and retail operations','https://www.mckinsey.com/industries/retail/our-insights'],
    ['PwC','Consumer Markets Insights','Consumer behavior & retail strategy','https://www.pwc.com/us/en/industries/consumer-markets.html'],
    ['Gartner','Technology Trends','Emerging technology impact on retail','https://www.gartner.com/en/information-technology']
  ],
  'Academic & Industry Research': [
    ['Harvard Business Review','The New Science of Strong Teams','Team performance & leadership','https://hbr.org/2017/04/the-new-science-of-strong-teams'],
    ['MIT Sloan Management Review','Digital Transformation Research','Digital transformation in retail','https://sloanreview.mit.edu/'],
    ['Stanford HAI','AI Index Report','AI trends and research insights','https://aiindex.stanford.edu/report/'],
    ['University of Michigan','Employee Engagement Research','Engagement & productivity','https://umich.edu/'],
    ['Cornell SC Johnson College','Retail Operations Research','Operational excellence in retail','https://www.johnson.cornell.edu/research/'],
    ['Forrester','Retail Execution Research','Retail execution platforms','https://www.forrester.com/reports/'],
    ['Accenture','Retail Operations with AI','AI-driven operations','https://www.accenture.com/us-en/industries/retail'],
    ['Josh Bersin Company','Global Talent Trends','Workforce strategy & development','https://joshbersin.com/research/']
  ],
  'Government & Regulatory Standards': [
    ['OSHA','Workplace Safety Guidelines','Workplace safety & compliance','https://www.osha.gov/'],
    ['U.S. Department of Labor','Workforce Development Programs','Workforce & training resources','https://www.dol.gov/'],
    ['U.S. Bureau of Labor Statistics','Employment & Wage Statistics','Labor market & economic data','https://www.bls.gov/'],
    ['FDA Food Code','Food Code','Food safety standards','https://www.fda.gov/food/fda-food-code'],
    ['USDA FSIS','Food Safety Resources','Meat & poultry safety','https://www.fsis.usda.gov/'],
    ['CDC','Food Safety & Hygiene','Public health & food safety','https://www.cdc.gov/foodsafety/'],
    ['EPA','Environmental Compliance','Environmental standards','https://www.epa.gov/'],
    ['NIST','AI Risk Management Framework','AI governance & risk management','https://www.nist.gov/itl/ai-risk-management-framework']
  ],
  'Technology & AI Resources': [
    ['Microsoft','Responsible AI','AI principles & governance','https://www.microsoft.com/en-us/ai/responsible-ai'],
    ['Google','AI Principles','AI ethics & best practices','https://ai.google/responsibility/principles/'],
    ['IBM','AI Governance Toolkit','Enterprise AI governance','https://www.ibm.com/think/topics/ai-governance'],
    ['OpenAI','Research','AI research & safety','https://openai.com/research/'],
    ['Amazon Web Services','AWS Retail Solutions','Cloud solutions for retail','https://aws.amazon.com/retail/'],
    ['Zebra Technologies','Retail Solutions','Frontline technology solutions','https://www.zebra.com/us/en/solutions/retail.html'],
    ['NVIDIA','AI for Retail','AI infrastructure & solutions','https://www.nvidia.com/en-us/industries/retail/'],
    ['Salesforce','Customer 360 for Retail','Customer experience platform','https://www.salesforce.com/industries/retail/']
  ],
  'Retail Operations & Best Practices': [
    ['Institute for Supply Management','Supply Chain Management Principles','Supply chain excellence','https://www.ismworld.org/'],
    ['APQC','Process & Performance Benchmarking','Operational benchmarking','https://www.apqc.org/'],
    ['Lean Enterprise Institute','Lean Management Resources','Process improvement','https://www.lean.org/'],
    ['Prosci','Change Management Best Practices','Organizational change management','https://www.prosci.com/'],
    ['Gallup','State of the Global Workplace','Employee engagement insights','https://www.gallup.com/workplace.aspx'],
    ['Kantar','Retail Shopper Behavior','Shopper insights & trends','https://www.kantar.com/campaigns/consumer-shopper']
  ]
};

const tabbar = document.getElementById('tabbar');
const stage = document.getElementById('stage');

function init(){
  tabbar.innerHTML = pages.map(p => `<button type="button" data-page="${p.id}">${p.title}</button>`).join('');
  tabbar.addEventListener('click', e => {
    const btn = e.target.closest('button[data-page]');
    if(btn) go(btn.dataset.page);
  });
  window.addEventListener('hashchange', () => load(currentId()));
  document.addEventListener('keydown', handleKeys);
  load(currentId());
}

function currentId(){
  const id = decodeURIComponent(location.hash.replace('#',''));
  return pages.some(p => p.id === id) ? id : pages[0].id;
}

function go(id){
  if(currentId() === id) return;
  location.hash = id;
}

function load(id){
  const page = pages.find(p => p.id === id) || pages[0];
  document.title = `F.R.I.E.N.D. Proposal | ${page.title}`;
  document.querySelectorAll('.tabbar button').forEach(btn => btn.classList.toggle('active', btn.dataset.page === page.id));
  const active = document.querySelector(`.tabbar button[data-page="${page.id}"]`);
  if(active) active.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});

  if(page.html){
    stage.innerHTML = `<article class="page-panel">${page.html()}</article>`;
  } else {
    stage.innerHTML = `<article class="page-panel"><img class="slide-image" src="${page.image}" alt="${page.title}"></article>`;
  }
}

function handleKeys(e){
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
  const index = pages.findIndex(p => p.id === currentId());
  if(e.key === 'ArrowRight') go(pages[Math.min(index + 1, pages.length - 1)].id);
  if(e.key === 'ArrowLeft') go(pages[Math.max(index - 1, 0)].id);
}

function renderReferences(){
  const cards = Object.entries(refs).map(([title, rows]) => {
    const wide = title.includes('Retail Operations') ? ' ref-wide' : '';
    const body = rows.map(r => `<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td><td><a href="${r[3]}" target="_blank" rel="noopener noreferrer">Open Source ↗</a></td></tr>`).join('');
    return `<section class="ref-card${wide}"><h3>${title}</h3><table class="ref-table"><thead><tr><th>Source / Organization</th><th>Publication / Resource</th><th>Topic / Focus</th><th>Link</th></tr></thead><tbody>${body}</tbody></table></section>`;
  }).join('');

  return `<div class="references-page">
    <div class="ref-header">
      <div class="ref-icon">⌕</div>
      <div><h2>RESEARCH & REFERENCES</h2><p>Evidence Base Supporting Project F.R.I.E.N.D.</p></div>
    </div>
    <div class="ref-grid">${cards}</div>
    <div class="source-note"><strong>Project F.R.I.E.N.D. is based on publicly available industry research, operational best practices, food safety standards, workforce development guidance, and enterprise AI frameworks.</strong><br>All external sources are cited and linked for independent review.</div>
  </div>`;
}

init();
