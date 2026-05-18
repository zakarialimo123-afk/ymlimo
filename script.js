/* YM LIMOUSINE INC. - Virtual Chauffeur Chatbot */
/* v2.0 — Short, human, no fluff */

const KB = {
  name: 'YM Limousine Inc.',
  tagline: "It's More Than a Ride",
  phone: '(773) 809-9782',
  email: 'info@ymlimo.com',
  hours: '24/7, 365 days a year',
  website: 'ymlimo.com',
  instagram: '@ymlimousine',
  address: 'Chicago, IL',
  founded: 'Family-run Chicago operation',
  fleet: [
    { name: 'Luxury Sedan', capacity: 'up to 3', perfect: 'Business travel, airport solo, couples', rate: '$89/hr (Executive)' },
    { name: 'Luxury SUV (Escalade/Navigator)', capacity: 'up to 6', perfect: 'Small groups, executives, families', rate: '$129/hr (Premium) — most popular' },
    { name: 'Stretch Limousine', capacity: 'up to 10', perfect: 'Weddings, prom, bachelor/bachelorette', rate: '$199/hr (VIP)' },
    { name: 'Sprinter Van', capacity: 'up to 12', perfect: 'Wine tours, corporate shuttles, groups', rate: '$199/hr (VIP)' },
    { name: 'Party Bus', capacity: 'up to 30', perfect: 'Night outs, birthdays, celebrations', rate: '$199/hr (VIP)' }
  ],
  airports: [
    { code: 'ORD', name: "O'Hare International Airport", wait: '30 min free (domestic), 60 min (intl)' },
    { code: 'MDW', name: 'Midway International Airport', wait: '30 min free (domestic), 60 min (intl)' }
  ],
  services: ['Airport transfers', 'Corporate transportation', 'Weddings', 'Proms', 'Night outs', 'Wine tours', 'Concert events', 'Bachelor/bachelorette parties', 'Birthday celebrations', 'Sporting events']
};

class ChatbotAI {
  constructor() {
    this.memory = {
      askedAbout: [],
      topicCount: {},
      turnCount: 0
    };
  }

  detectIntent(text) {
    const t = text.toLowerCase().trim();
    this.memory.turnCount++;
    const intents = [];

    // Greetings
    if (this.matchAny(t, ['hi', 'hello', 'hey', 'yo', 'sup', 'howdy', 'good morning', 'good afternoon', 'good evening', 'whats up', 'was good', "what's good", 'greetings'])) {
      intents.push('greeting');
    }

    // Fleet/vehicles
    if (this.matchAny(t, ['fleet', 'vehicle', 'suv', 'sedan', 'limo', 'limousine', 'sprinter', 'party bus', 'van', 'escalade', 'navigator', 'cadillac', 'lincoln', 'stretch', 'what do you have', 'what cars', 'what vehicles', 'vehicles', 'types', 'options', 'available'])) {
      intents.push('fleet');
      this.memory.lastTopic = 'fleet';
    }

    // Pricing
    if (this.matchAny(t, ['price', 'pricing', 'cost', 'how much', 'rate', 'rates', 'quote', 'quotes', 'expensive', 'cheap', 'afford', 'budget', 'fee', 'pay', 'paying'])) {
      intents.push('pricing');
      this.memory.lastTopic = 'pricing';
    }

    // Airport
    if (this.matchAny(t, ['airport', 'ohare', "o'hare", 'ord', 'midway', 'mdw', 'flight', 'plane', 'flying', 'pickup', 'terminal', 'gate', 'baggage', 'luggage', 'landing', 'arrival', 'departure'])) {
      intents.push('airport');
    }

    // Booking
    if (this.matchAny(t, ['book', 'booking', 'reserve', 'reservation', 'schedule', 'arrange', 'set up', 'make a', 'want to', 'i need', 'sign up', 'how do i'])) {
      intents.push('booking');
    }

    // Hours
    if (this.matchAny(t, ['hour', 'hours', 'open', 'close', '24/7', 'when', 'time', 'late', 'early', 'midnight', 'morning', 'tonight', 'today', 'tomorrow'])) {
      intents.push('hours');
    }

    // Events
    if (this.matchAny(t, ['wedding', 'bride', 'groom', 'prom', 'homecoming', 'party', 'parties', 'night out', 'bachelor', 'bachelorette', 'birthday', 'event', 'concert', 'celebration'])) {
      intents.push('events');
    }

    // Human / contact
    if (this.matchAny(t, ['human', 'person', 'talk', 'speak', 'real', 'agent', 'representative', 'call', 'phone', 'number', 'contact', 'support', 'emergency', 'speak to'])) {
      intents.push('human');
    }

    // Area / destinations (keep it tight — no generic words that cause false matches)
    if (this.matchAny(t, ['milwaukee', 'wisconsin', 'indiana', 'regional', 'long distance', 'interstate', 'road trip', 'out of town', 'outside chicago', 'naperville', 'evanston', 'lincoln park', 'river north', 'gold coast', 'wicker park', 'hyde park', 'orland park', 'oak park', 'schaumburg', 'rosemont', 'area you serve', 'service area', 'where do you', 'do you go', 'chicago suburbs', 'do you serve'])) {
      intents.push('area');
    }

    // Corporate
    if (this.matchAny(t, ['corporate', 'business', 'office', 'client', 'executive', 'meeting', 'conference'])) {
      intents.push('corporate');
    }

    // About the company
    if (this.matchAny(t, ['who are you', 'about', 'your company', 'tell me about', 'history', 'are you', 'how long', 'family', 'family-run', 'family owned'])) {
      intents.push('about');
    }

    // Child seats
    if (this.matchAny(t, ['car seat', 'booster', 'child seat', 'child', 'children', 'kid', 'kids', 'baby', 'infant', 'toddler'])) {
      intents.push('childseats');
    }

    // Recommendation (group size or "what should I get")
    if (this.matchAny(t, ['recommend', 'suggestion', 'which', 'best', 'perfect', 'right for', 'group of', 'people', 'passenger', 'passengers'])) {
      intents.push('recommendation');
    }

    // Gratitude
    if (this.matchAny(t, ['thank', 'thanks', 'appreciate', 'ty', 'thx', 'thank you'])) {
      intents.push('thanks');
    }

    // Farewell
    if (this.matchAny(t, ['bye', 'goodbye', 'later', 'see you', 'cya', 'peace', 'good night'])) {
      intents.push('farewell');
    }

    // Compliment
    if (this.matchAny(t, ['great', 'awesome', 'amazing', 'fantastic', 'excellent', 'love', 'best', 'cool', 'nice', 'good job'])) {
      intents.push('compliment');
    }

    // Tipping
    if (this.matchAny(t, ['tip', 'tips', 'gratuity', 'gratuities', 'tipping'])) {
      intents.push('tipping');
    }

    // Alcohol
    if (this.matchAny(t, ['alcohol', 'drink', 'drinks', 'beer', 'wine', 'liquor', 'champagne', 'alcoholic', 'bar', 'can we bring'])) {
      intents.push('alcohol');
    }

    // Wait time
    if (this.matchAny(t, ['wait', 'waiting', 'delay', 'delayed', 'late', 'on time', 'tracking', 'monitor', 'what if my flight'])) {
      intents.push('waittime');
    }

    // Negative
    if (this.matchAny(t, ['bad', 'terrible', 'awful', 'horrible', 'worst', 'trash', 'useless', 'not helpful'])) {
      intents.push('negative');
    }

    return intents;
  }

  matchAny(text, keywords) {
    return keywords.some(k => text.includes(k));
  }

  trackTopic(intents) {
    intents.forEach(intent => {
      this.memory.topicCount[intent] = (this.memory.topicCount[intent] || 0) + 1;
      if (!this.memory.askedAbout.includes(intent) && intent !== 'greeting' && intent !== 'thanks' && intent !== 'farewell') {
        this.memory.askedAbout.push(intent);
      }
    });
  }

  extractNumber(text) {
    const nums = text.match(/\d+/g);
    return nums ? parseInt(nums[0]) : null;
  }

  respond(text, isQuickButton) {
    const intents = this.detectIntent(text);
    this.trackTopic(intents);
    const userNum = this.extractNumber(text);
    const lower = text.toLowerCase();

    // --- Regional trip first (Milwaukee etc.) — must check before generic area ---
    if (this.matchAny(lower, ['milwaukee', 'wisconsin', 'indiana', 'road trip', 'long distance', 'interstate', 'out of town', 'outside chicago', 'regional', 'do you go', 'trip to', 'trips to'])) {
      return "Yeah we do regional trips — Milwaukee, Indiana, that area. Custom quote though since it's outside our normal zone. Call <b>(773) 809-9782</b> and they'll sort out pricing for you.";
    }

    // --- Negative ---
    if (intents.includes('negative')) {
      return "Sorry about that. Call <b>(773) 809-9782</b> and our dispatch team will fix whatever's going on.";
    }

    // --- Fleet recommendation with number ---
    if ((intents.includes('recommendation') || (intents.includes('fleet') && userNum)) && userNum) {
      return this.recommendVehicle(userNum);
    }

    // --- Human ---
    if (intents.includes('human') && !intents.includes('greeting')) {
      return "Call <b>(773) 809-9782</b> — a real person picks up 24/7. No automated menus.";
    }

    // --- Booking ---
    if (intents.includes('booking')) {
      return "Fill out the booking form on this page — they'll confirm within minutes. Or call <b>(773) 809-9782</b> to book over the phone.";
    }

    // --- Airport ---
    if (intents.includes('airport') && !isQuickButton) {
      return "We do O'Hare and Midway. We track your flight, meet you inside baggage claim with a name sign. 30 min free wait domestic, 60 min international. Sedan ($89/hr) for 1-2 people, SUV ($129/hr) for groups up to 6.";
    }

    // --- Events ---
    if (intents.includes('events')) {
      return "Weddings → Stretch Limo (up to 10). Prom → Limo or SUV. Night out → Party Bus (up to 30). We do all of it. Which one you thinking?";
    }

    // --- Hours ---
    if (intents.includes('hours')) {
      return "24/7, 365. Holidays too. Call anytime — dispatch never sleeps.";
    }

    // --- Pricing ---
    if (intents.includes('pricing') && !isQuickButton) {
      return "Sedan $89/hr, SUV $129/hr (most popular), Limo/Sprinter/Party Bus $199/hr. No surge pricing. For an exact quote, fill out the booking form on this page.";
    }

    // --- Fleet ---
    if (intents.includes('fleet') && !isQuickButton) {
      return this.describeFleet();
    }

    // --- Area (non-regional) ---
    if (intents.includes('area')) {
      return "We cover all of Chicago and most suburbs. Also do ORD, Midway, train stations, United Center, Soldier Field, Wrigley, McCormick Place. If you're not sure, just ask.";
    }

    // --- Child seats ---
    if (intents.includes('childseats')) {
      return "Yeah we've got car seats and boosters — no extra charge. Just tell us how many and what ages when you book.";
    }

    // --- Corporate ---
    if (intents.includes('corporate')) {
      return "We work with businesses of all sizes in Chicago. Corporate accounts get priority booking and consolidated billing. Call <b>(773) 809-9782</b> to set one up.";
    }

    // --- About ---
    if (intents.includes('about')) {
      return "Family-run Chicago operation. We own our fleet — not a broker. Licensed, insured, all that. We've been at this a while.";
    }

    // --- Tipping ---
    if (intents.includes('tipping')) {
      return "Not included. 15-20% is typical for good service. Cash to the chauffeur or add it when you book — either works.";
    }

    // --- Alcohol ---
    if (intents.includes('alcohol')) {
      return "On VIP-tier vehicles (Limo, Sprinter, Party Bus) you can bring your own. We provide cups and ice. Just drink responsibly — your chauffeur's job is getting you home safe.";
    }

    // --- Wait time ---
    if (intents.includes('waittime')) {
      return "We track flights in real-time. 30 min free wait domestic, 60 min international. If you're running late from an event, just call and we adjust.";
    }

    // --- Greeting ---
    if (intents.includes('greeting') && this.memory.turnCount <= 1) {
      return "Welcome to YM Limousine — Virtual Chauffeur here 🚗. Need a ride, a quote, or just browsing?";
    }

    // --- Compliment ---
    if (intents.includes('compliment')) {
      return "Appreciate that 🙌. Anything else I can help with?";
    }

    // --- Thanks ---
    if (intents.includes('thanks')) {
      return "You got it.";
    }

    // --- Farewell ---
    if (intents.includes('farewell')) {
      return "Take care. Call anytime — (773) 809-9782.";
    }

    // --- Recommendation only (no number detected) ---
    if (intents.includes('recommendation')) {
      return "How many people and what's the occasion? That'll tell me exactly which vehicle to point you to.";
    }

    // --- Fallback ---
    return this.contextualFallback();
  }

  recommendVehicle(num) {
    if (num <= 3)
      return `${num} people? Luxury Sedan ($89/hr) — smooth, professional, great for airport or business. If you want more room, the SUV ($129/hr) seats up to 6.`;
    if (num <= 6)
      return `${num} people? Luxury SUV ($129/hr) — fits up to 6, most popular choice. Need bigger? We've got Limo (up to 10) or Sprinter (up to 12).`;
    if (num <= 10)
      return `${num} people? Stretch Limo ($199/hr) — seats up to 10, classic for weddings and events. Or Sprinter Van ($199/hr) if you want more headroom.`;
    if (num <= 12)
      return `${num} people? Sprinter Van ($199/hr) — seats 12, great for wine tours and shuttles. Party Bus also available if you want the party vibe.`;
    if (num <= 30)
      return `${num} people? Party Bus ($199/hr) — seats up to 30, full setup. For anything bigger we can run multiple vehicles.`;
    return `${num} people? That's a big group. Party Bus seats 30, or we can arrange multiple vehicles. Call (773) 809-9782 to plan it out.`;
  }

  describeFleet() {
    // Just list em quick.
    return "Sedan (up to 3, $89/hr) · SUV (up to 6, $129/hr) ⭐ · Limo (up to 10, $199/hr) · Sprinter (up to 12, $199/hr) · Party Bus (up to 30, $199/hr). All company-owned. Which one you interested in?";
  }

  get fleet() { return KB.fleet; }

  contextualFallback() {
    const topics = this.memory.askedAbout;
    const turn = this.memory.turnCount;

    if (topics.length === 0 && turn <= 2) {
      return "Not sure I got that. Try asking about <b>vehicles</b>, <b>pricing</b>, <b>airport transfers</b>, or just say <b>talk to a person</b>.";
    }

    if (topics.includes('fleet'))
      return "Any specific vehicle you're curious about? I can tell you pricing or what works best for your occasion.";
    if (topics.includes('pricing'))
      return "Pricing depends on vehicle and trip. SUV ($129/hr) is the most popular. Booking form on this page will get you an exact quote fast.";
    if (topics.includes('airport'))
      return "Thinking airport pickup? Sedan for 1-2 people ($89/hr), SUV for up to 6 ($129/hr). Flight tracking included.";

    const fallbacks = [
      "I missed that — try asking about our fleet, pricing, or airport transfers. Or just say 'talk to a person'.",
      "Didn't catch that. Try something like 'what vehicles do you have' or 'how much to O'Hare'.",
      "Can you rephrase that? I handle fleet info, pricing, airport runs, events."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

// ====== CHATBOT UI ======

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('chatbotBtn');
  const popup = document.getElementById('chatbotPopup');
  const close = document.getElementById('chatbotClose');
  const body = document.getElementById('chatbotBody');
  const input = document.getElementById('chatbotInput');
  const send = document.getElementById('chatbotSend');
  if (!btn) return;

  const ai = new ChatbotAI();
  let optionsShown = false;

  function scrollBottom() {
    setTimeout(() => body.scrollTop = body.scrollHeight, 50);
  }

  function addMsg(text, type) {
    const div = document.createElement('div');
    div.className = 'msg ' + type;
    if (type === 'bot') {
      div.innerHTML = '<span class="msg-label">Virtual Chauffeur</span>' + text;
    } else {
      div.innerHTML = text;
    }
    body.appendChild(div);
    scrollBottom();
  }

  function makeOptBtn(key, label) {
    const b = document.createElement('button');
    b.textContent = label;
    b.dataset.answer = key;
    return b;
  }

  function showOptions() {
    if (optionsShown) return;
    optionsShown = true;
    const old = body.querySelector('.options-msg');
    if (old) old.remove();
    const div = document.createElement('div');
    div.className = 'msg bot options-msg';
    div.innerHTML = '<span class="msg-label">Virtual Chauffeur</span>Anything else?';
    const optDiv = document.createElement('div');
    optDiv.className = 'msg-options';
    optDiv.appendChild(makeOptBtn('fleet', 'What vehicles?'));
    optDiv.appendChild(makeOptBtn('pricing', 'How much?'));
    optDiv.appendChild(makeOptBtn('airport', 'Airport info'));
    optDiv.appendChild(makeOptBtn('human', 'Talk to human'));
    div.appendChild(optDiv);
    body.appendChild(div);
    scrollBottom();
  }

  function handleAnswer(key) {
    optionsShown = false;
    const old = body.querySelector('.options-msg');
    if (old) old.remove();
    const labelMap = { fleet: 'What vehicles?', pricing: 'How much?', airport: 'Airport info', human: 'Talk to human' };
    addMsg(labelMap[key] || key, 'user');
    const resp = ai.respond(key, true);
    setTimeout(() => {
      addMsg(resp, 'bot');
      if (key !== 'human') setTimeout(showOptions, 1500);
    }, 500);
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    optionsShown = false;
    const old = body.querySelector('.options-msg');
    if (old) old.remove();
    addMsg(text, 'user');
    input.value = '';

    const typing = document.createElement('div');
    typing.className = 'msg bot';
    typing.id = 'typingIndicator';
    typing.innerHTML = '<span class="msg-label">Virtual Chauffeur</span>...';
    body.appendChild(typing);
    scrollBottom();

    const resp = ai.respond(text);
    const delay = Math.min(600 + resp.length * 1.5, 2000);

    setTimeout(() => {
      const ind = document.getElementById('typingIndicator');
      if (ind) ind.remove();
      addMsg(resp, 'bot');
      if (!text.toLowerCase().includes('bye') && !text.toLowerCase().includes('goodbye') && !text.toLowerCase().includes('cya')) {
        setTimeout(showOptions, 1000);
      }
    }, delay);
  }

  send.addEventListener('click', handleSend);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSend();
  });

  body.addEventListener('click', function(e) {
    const optBtn = e.target.closest('.msg-options button');
    if (optBtn) handleAnswer(optBtn.dataset.answer);
  });

  btn.addEventListener('click', function() { popup.classList.toggle('open'); });
  close.addEventListener('click', function() { popup.classList.remove('open'); });

  setTimeout(() => {
    addMsg("Welcome to YM Limousine! I'm your <b>Virtual Chauffeur</b> 🚗. Ask about our fleet, pricing, or airport transfers.", 'bot');
    showOptions();
  }, 600);
});
