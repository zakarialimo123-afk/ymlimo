/* YM LIMOUSINE INC. - Virtual Chauffeur Chatbot */
/* Advanced conversational engine - v1.0 */

// ====== CONVERSATION ENGINE ======

const KB = {
  name: 'YM Limousine Inc.',
  tagline: "It's More Than a Ride",
  phone: '(773) 809-9782',
  email: 'info@ymlimo.com',
  hours: '24 hours a day, 7 days a week',
  website: 'ymlimo.com',
  instagram: '@ymlimousine',
  address: 'Chicago, IL (serve entire metro area)',
  founded: 'Family-run Chicago operation',
  fleet: [
    { name: 'Luxury Sedan', capacity: 'up to 3', perfect: 'Business travel, airport solo, couples', rate: '$89/hr (Executive)' },
    { name: 'Luxury SUV (Escalade/Navigator)', capacity: 'up to 6', perfect: 'Small groups, executives, families', rate: '$129/hr (Premium) — most popular' },
    { name: 'Stretch Limousine', capacity: 'up to 10', perfect: 'Weddings, prom, bachelor/bachelorette', rate: '$199/hr (VIP)' },
    { name: 'Sprinter Van', capacity: 'up to 12', perfect: 'Wine tours, corporate shuttles, groups', rate: '$199/hr (VIP)' },
    { name: 'Party Bus', capacity: 'up to 30', perfect: 'Night outs, birthdays, celebrations', rate: '$199/hr (VIP)' }
  ],
  neighborhoods: ['Lincoln Park', 'River North', 'Gold Coast', 'Wicker Park', 'Logan Square', 'Hyde Park', 'Naperville', 'Evanston', 'Oak Park', 'Schaumburg', 'Rosemont'],
  airports: [
    { code: 'ORD', name: "O'Hare International Airport", wait: '30 min free (domestic), 60 min (international)' },
    { code: 'MDW', name: 'Midway International Airport', wait: '30 min free (domestic), 60 min (international)' }
  ],
  services: ['Airport transfers', 'Corporate transportation', 'Weddings', 'Proms', 'Night outs', 'Wine tours', 'Concert events', 'Bachelor/bachelorette parties', 'Birthday celebrations', 'Sporting events']
};

// ====== INTENT CLASSIFIER ======

class ChatbotAI {
  constructor() {
    this.memory = {
      askedAbout: [],
      mentionedName: null,
      topicCount: {},
      conversationStage: 'greeting', // greeting, exploring, specific, booking, human
      lastTopic: null,
      turnCount: 0
    };
  }

  // --- Intent detection with word groups ---

  detectIntent(text) {
    const t = text.toLowerCase().trim();
    const words = t.split(/\s+/);
    this.memory.turnCount++;

    // Detect core intent by checking keyword groups against synonyms
    const intents = [];

    // Greetings
    if (this.matchAny(t, ['hi', 'hello', 'hey', 'yo', 'sup', 'howdy', 'good morning', 'good afternoon', 'good evening', 'whats up', 'was good', "what's good", 'greetings'])) {
      intents.push('greeting');
    }

    // Fleet/vehicles
    if (this.matchAny(t, ['fleet', 'vehicle', 'car', 'cars', 'ride', 'rides', 'suv', 'sedan', 'limo', 'limousine', 'sprinter', 'party bus', 'bus', 'van', 'what do you have', 'what cars', 'what vehicles', 'types', 'selection', 'choose', 'options', 'available', 'stretch', 'escalade', 'navigator', 'cadillac', 'lincoln'])) {
      intents.push('fleet');
      this.memory.lastTopic = 'fleet';
    }

    // Pricing
    if (this.matchAny(t, ['price', 'prices', 'pricing', 'cost', 'costs', 'how much', 'rate', 'rates', 'quote', 'quotes', 'expensive', 'cheap', 'afford', 'budget', '$$', 'money', 'dollar', 'fee', 'fees', 'charge', 'charges', 'pay', 'paying', 'payment', 'priceless'])) {
      intents.push('pricing');
      this.memory.lastTopic = 'pricing';
    }

    // Airport
    if (this.matchAny(t, ['airport', 'ohare', "o'hare", 'ord', 'midway', 'mdw', 'flight', 'flights', 'plane', 'travel', 'flying', 'fly', 'baggage', 'luggage', 'customs', 'terminal', 'gate', 'landing', 'departure', 'arrival', 'pickup'])) {
      intents.push('airport');
    }

    // Booking / reservation
    if (this.matchAny(t, ['book', 'booking', 'reserve', 'reservation', 'schedule', 'scheduling', 'order', 'arrange', 'plan', 'planning', 'set up', 'make a', 'want to', 'i need', 'i need to', 'how to', 'how do i', 'sign up'])) {
      intents.push('booking');
    }

    // Hours / availability
    if (this.matchAny(t, ['hour', 'hours', 'open', 'close', '24', '24/7', 'available', 'when', 'time', 'times', 'late', 'early', 'midnight', 'morning', 'tonight', 'today', 'tomorrow'])) {
      intents.push('hours');
    }

    // Events (wedding, prom, party)
    if (this.matchAny(t, ['wedding', 'weddings', 'bride', 'groom', 'prom', 'homecoming', 'party', 'parties', 'night out', 'bachelor', 'bachelorette', 'birthday', 'celebration', 'event', 'concert', 'game', 'show', 'date night'])) {
      intents.push('events');
    }

    // Human / contact
    if (this.matchAny(t, ['human', 'person', 'talk', 'speak', 'real', 'agent', 'representative', 'call', 'phone', 'number', 'contact', 'support', 'help', 'emergency'])) {
      intents.push('human');
    }

    // Child seats
    if (this.matchAny(t, ['child', 'children', 'kid', 'kids', 'car seat', 'booster', 'baby', 'infant', 'toddler', 'safety', 'car seat'])) {
      intents.push('childseats');
    }

    // Service area — including regional destinations
    if (this.matchAny(t, ['area', 'where', 'location', 'chicago', 'suburb', 'suburbs', 'neighborhood', 'naperville', 'evanston', 'lincoln park', 'river north', 'gold coast', 'wicker park', 'hyde park', 'milwaukee', 'wisconsin', 'indiana', 'regional', 'long distance', 'road trip', 'interstate', 'out of town', 'outside chicago', 'go to', 'trip to', 'trips to'])) {
      intents.push('area');
    }

    // Corporate / business
    if (this.matchAny(t, ['corporate', 'business', 'company', 'office', 'client', 'executive', 'meeting', 'conference', 'work'])) {
      intents.push('corporate');
    }

    // About the company
    if (this.matchAny(t, ['who', 'about', 'company', 'family', 'history', 'tell me about', 'your company', 'are you', 'how long'])) {
      intents.push('about');
    }

    // Fleet recommendation ("I need a car for X people")
    if (this.matchAny(t, ['recommend', 'suggestion', 'which', 'best', 'perfect', 'right', 'suitable', 'appropriate', 'for me', 'group of', 'people', 'passenger', 'passengers'])) {
      intents.push('recommendation');
    }

    // Gratitude
    if (this.matchAny(t, ['thank', 'thanks', 'appreciate', 'grateful', 'ty', 'thx', 'thank you'])) {
      intents.push('thanks');
    }

    // Farewell
    if (this.matchAny(t, ['bye', 'goodbye', 'later', 'see you', 'cya', 'peace', 'good night', 'have a good'])) {
      intents.push('farewell');
    }

    // Negative / frustrated
    if (this.matchAny(t, ['bad', 'terrible', 'awful', 'horrible', 'worst', 'trash', 'garbage', 'useless', 'stupid', 'dumb', 'waste', 'not helpful', "doesn't work", 'not working'])) {
      intents.push('negative');
    }

    // Compliment
    if (this.matchAny(t, ['great', 'awesome', 'amazing', 'wonderful', 'fantastic', 'excellent', 'perfect', 'love', 'best', 'cool', 'nice', 'good job', 'well done'])) {
      intents.push('compliment');
    }

    // Gratuity / tip
    if (this.matchAny(t, ['tip', 'tips', 'gratuity', 'gratuities', 'tipping'])) {
      intents.push('tipping');
    }

    // Alcohol / drinks
    if (this.matchAny(t, ['alcohol', 'drink', 'drinks', 'beer', 'wine', 'liquor', 'champagne', 'alcoholic', 'bar'])) {
      intents.push('alcohol');
    }

    // Wait time / delays
    if (this.matchAny(t, ['wait', 'waiting', 'delay', 'delayed', 'late', 'early', 'on time', 'tracking', 'monitor'])) {
      intents.push('waittime');
    }

    return intents;
  }

  matchAny(text, keywords) {
    return keywords.some(k => text.includes(k));
  }

  // --- Track topics for conversation memory ---
  trackTopic(intents) {
    intents.forEach(intent => {
      this.memory.topicCount[intent] = (this.memory.topicCount[intent] || 0) + 1;
      if (!this.memory.askedAbout.includes(intent) && intent !== 'greeting' && intent !== 'thanks' && intent !== 'farewell') {
        this.memory.askedAbout.push(intent);
      }
    });
  }

  // --- Extract numbers (for group size detection) ---
  extractNumber(text) {
    const nums = text.match(/\d+/g);
    return nums ? parseInt(nums[0]) : null;
  }

  // --- Generate response ---
  respond(text, isQuickButton) {
    const intents = this.detectIntent(text);
    this.trackTopic(intents);

    const userNum = this.extractNumber(text);
    const lower = text.toLowerCase();

    // --- Priority: negative → human (if frustrated) ---
    if (intents.includes('negative')) {
      return "I hear you, and I want to make this right. Let me connect you directly with our dispatch team — call <b>(773) 809-9782</b> and someone will personally handle whatever's going on. What can I help fix?";
    }

    // --- Fleet recommendation based on group size ---
    if ((intents.includes('recommendation') || (intents.includes('fleet') && (text.match(/\d+/g) || text.includes('people') || text.includes('passenger')))) && userNum) {
      return this.recommendVehicle(userNum, text);
    }

    // --- Multi-intent: e.g. "what SUVs do you have and how much?" ---
    if (intents.includes('fleet') && intents.includes('pricing')) {
      return "Great question! Let me cover both. Our most popular is the <b>Luxury SUV</b> (Escalade/Navigator) — seats up to 6, perfect for groups. It runs on our <b>Premium tier at $129/hr</b>. For specific pricing, we offer flat-rate quotes — fill out the booking form and we'll get you a personalized rate in minutes. Want me to walk through all the options?";
    }

    // --- Primary single intents (priority-ordered) ---
    if (intents.includes('human') && !intents.includes('greeting')) {
      return "Absolutely — real people, 24/7. Call us at <b>(773) 809-9782</b> and you'll get our dispatch team directly. Or email <b>info@ymlimo.com</b> and we'll respond fast. We don't do automated menus — you get a human every time.";
    }

    if (intents.includes('booking')) {
      return "Booking is easy! Just scroll up to the booking form on this page — pick your vehicle, enter your details, and we'll confirm within minutes. Or if you prefer, call <b>(773) 809-9782</b> and we can book you right over the phone. Need help deciding which vehicle works best for your group?";
    }

    if (intents.includes('hours')) {
      return "We're <b>open 24/7, 365 days a year</b> — including holidays. Late night flight? Early morning meeting? We're there. Our dispatch team never sleeps. Call <b>(773) 809-9782</b> anytime.";
    }

    if (intents.includes('events')) {
      return "We love events! Here's what works best:<br><br>• <b>Weddings</b> → Stretch Limousine (up to 10) — classy arrival<br>• <b>Prom/Homecoming</b> → Stretch Limo or SUV (up to 6)<br>• <b>Night out / Birthday</b> → Party Bus (up to 30) or SUV<br>• <b>Bachelor/Bachelorette</b> → Party Bus or Limo<br><br>We've done hundreds of events in Chicago. Want specific pricing or to book?";
    }

    if (intents.includes('airport')) {
      return `We handle both Chicago airports with real-time flight tracking:<br><br>• <b>O'Hare (ORD)</b> — 30 min free wait (domestic), 60 min (international)<br>• <b>Midway (MDW)</b> — same free wait times<br><br>Your chauffeur meets you <b>inside baggage claim</b> with a name sign — no hunting around. We monitor your flight automatically so if it's delayed, we adjust. For a 1-2 person airport run, our <b>Luxury Sedan ($89/hr)</b> is perfect. For groups up to 6, go with the <b>SUV ($129/hr)</b>. Want me to help you pick?`;
    }

    if (intents.includes('pricing') && !intents.includes('recommendation') && !isQuickButton) {
      return "We use <b>flat-rate pricing</b> — no surge, no hidden fees, no surprises. Here's what our tiers look like:<br><br>• <b>Executive</b> — $89/hr (Luxury Sedan — 1-3 pax)<br>• <b>Premium</b> — $129/hr (Luxury SUV — up to 6 pax) ⭐ most popular<br>• <b>VIP</b> — $199/hr (Limo, Sprinter, Party Bus — up to 30 pax)<br><br>For the most accurate quote, just fill out the booking form above and we'll respond with your personalized rate in minutes. Want pricing by the vehicle?";
    }

    if (intents.includes('fleet')) {
      return this.describeFleet(userNum);
    }

    if (intents.includes('childseats')) {
      return "Yes — we provide <b>car seats and booster seats at no extra charge</b>! Just let us know how many and what ages when you book, and we'll have them properly installed before pickup. Safety and peace of mind come standard with every ride.";
    }

    if (intents.includes('area')) {
      // Detect if they're asking about a specific trip/destination outside Chicago
      if (this.matchAny(text.toLowerCase(), ['milwaukee', 'wisconsin', 'indiana', 'road trip', 'long distance', 'interstate', 'out of town', 'outside', 'trip to', 'go to'])) {
        return "Great question! We're based in <b>Chicago</b> and primarily serve the metro area and suburbs. For trips beyond that — like <b>Milwaukee</b>, Wisconsin, or Indiana — we handle those on a <b>custom quote basis</b>. Just give us a call at <b>(773) 809-9782</b> or fill out the booking form with your destination details and we'll get you a price. We've done regional runs before and can usually make it work!";
      }
      return "We serve <b>all of Chicago</b> and most suburbs — from Lincoln Park and River North to Naperville and Evanston. We also cover all Chicago airports (ORD & MDW), train stations (Union Station, Ogilvie), and event venues (United Center, Soldier Field, Wrigley Field, McCormick Place). Not sure if we cover your area? Just ask!";
    }

    if (intents.includes('corporate')) {
      return "We work with <b>Chicago businesses of all sizes</b> — from startups to enterprise. Corporate accounts get priority booking, consolidated billing, and dedicated dispatch. We handle airport transfers for clients, executive meetings, conferences, and team events. Want to set up a corporate account? Call <b>(773) 809-9782</b> and we'll get you set up.";
    }

    if (intents.includes('about')) {
      return "We're <b>YM Limousine Inc.</b> — a family-run Chicago operation. We're not a broker; we own our entire fleet. Every vehicle is maintained by us and driven by our professional chauffeurs. We've been serving Chicago with the philosophy that it should be <i>more than a ride</i> — it should be an experience. Licensed, insured, and committed.";
    }

    if (intents.includes('tipping')) {
      return "Gratuity is <b>not included</b> in our rates and is at your discretion. For exceptional service (which is our standard), 15-20% of the total fare is typical. You can add it when booking or hand it directly to your chauffeur. Either way is fine!";
    }

    if (intents.includes('alcohol')) {
      return "On our VIP-tier vehicles (Stretch Limousine, Sprinter, Party Bus), you're welcome to bring your own drinks. We don't provide alcohol, but we do provide the cups, ice, and vibe. <b>Please drink responsibly</b> — your chauffeur is there to get you there safely. No open containers in Executive/Premium vehicles per Illinois law.";
    }

    if (intents.includes('waittime')) {
      return "We track your flight or event in real-time. For airport pickups:<br><br>• <b>Domestic flights:</b> 30 minutes free wait from landing<br>• <b>International flights:</b> 60 minutes free wait (customs)<br>• If you're running late from an event, just call <b>(773) 809-9782</b> — we adjust.<br><br>We'd rather you be relaxed than rushed. That's the YM difference.";
    }

    if (intents.includes('greeting') && this.memory.turnCount <= 1) {
      return "Welcome to YM Limousine! I'm your Virtual Chauffeur 🚗. I can help you with <b>fleet info</b>, <b>pricing</b>, <b>airport transfers</b>, <b>events</b>, and more. What brings you in today? Looking for a specific vehicle, need a quote, or just exploring?";
    }

    if (intents.includes('compliment')) {
      return "Really appreciate that! We take pride in what we do. If you ever need a ride — airport run, night out, wedding — you know where to find us. Anything else I can help with?";
    }

    if (intents.includes('thanks')) {
      if (this.memory.askedAbout.length > 0) {
        return "You got it 🙌. If you're ready to lock in a ride, hit the booking form above or call <b>(773) 809-9782</b> — we're here 24/7.";
      }
      return "No problem, that's what I'm here for. Anything else I can help with?";
    }

    if (intents.includes('farewell')) {
      return "Take care! YM Limousine is here whenever you need us — 24/7 at <b>(773) 809-9782</b>. Whether it's an airport run or a night out, we've got you. It's more than a ride. 🚗✨";
    }

    // --- Recommendation only (no specific intent detected) ---
    if (intents.includes('recommendation')) {
      return "Happy to help find your perfect ride! A few quick questions:<br><br>• <b>How many people?</b><br>• <b>What's the occasion?</b> (airport, wedding, night out, etc.)<br>• <b>Any preference?</b> (luxury, spacious, party vibe)<br><br>Tell me a bit more and I'll steer you exactly right!";
    }

    // --- Context-aware fallback ---
    return this.contextualFallback();
  }

  recommendVehicle(num, text) {
    if (num <= 3) {
      return `For ${num} people, our <b>Luxury Sedan (Executive tier — $89/hr)</b> is perfect. Comfortable, professional, great for airport runs and business. But if you want more space, our <b>Luxury SUV (Premium — $129/hr)</b> seats up to 6 and is our most popular choice. Want pricing or to book?`;
    } else if (num <= 6) {
      return `For ${num} people, the <b>Luxury SUV (Premium tier — $129/hr)</b> is ideal. Seats up to 6 in comfort. It's our most popular vehicle for a reason! Need something more spacious? We also have the Stretch Limo (up to 10) and Sprinter (up to 12). Want me to go through options?`;
    } else if (num <= 10) {
      return `For ${num} people, I'd recommend our <b>Stretch Limousine (VIP — $199/hr)</b> — seats up to 10, perfect for weddings, proms, and celebrations. If you want something more modern, our <b>Sprinter Van (VIP — $199/hr)</b> also seats up to 12 with more headroom. Want to know more about either?`;
    } else if (num <= 12) {
      return `${num} people? Go with our <b>Sprinter Van (VIP — $199/hr)</b> — seats up to 12 comfortably. Great for wine tours, corporate shuttles, and group outings. If you're looking for a party vibe, our <b>Party Bus (VIP — $199/hr)</b> seats up to 30. Which sounds better?`;
    } else if (num <= 30) {
      return `${num} people? Our <b>Party Bus (VIP — $199/hr)</b> is what you need — seats up to 30 with a full party setup. Perfect for birthdays, bachelor/bachelorette parties, and celebrations. Want to check availability?`;
    } else {
      return `${num} people? That's a big group! Our <b>Party Bus</b> seats up to 30 — for anything larger, we can arrange multiple vehicles. Call <b>(773) 809-9782</b> and our team will plan a custom solution for your group.`;
    }
  }

  describeFleet(highlightNum) {
    let response = "Here's our full fleet:<br><br>";
    this.fleet.forEach(v => {
      response += `<b>${v.name}</b> — ${v.capacity} — ${v.perfect}<br>`;
    });
    response += "<br>All company-owned, maintained by us, driven by our professional chauffeurs. Which one catches your eye?";
    return response;
  }

  get fleet() { return KB.fleet; }

  contextualFallback() {
    const topics = this.memory.askedAbout;
    const turn = this.memory.turnCount;

    if (topics.length === 0 && turn <= 2) {
      return "I didn't quite catch that — no worries! I can help you with:<br><br>• <b>Our fleet</b> — see all vehicle options<br>• <b>Pricing</b> — flat rates, no surge<br>• <b>Airport transfers</b> — ORD & MDW<br>• <b>Events</b> — weddings, parties, prom<br>• Or just <b>talk to a real person</b><br><br>What sounds helpful?";
    }

    if (topics.includes('fleet') && !topics.includes('pricing')) {
      return "Good question! Since you were checking out our fleet — any particular vehicle catch your eye? I can tell you more about pricing, capacity, or what works best for your occasion. Or if you're ready, the booking form above will get you a quote in minutes.";
    }

    if (topics.includes('pricing') && !topics.includes('fleet')) {
      return "Since you're looking at pricing — our rates depend on the vehicle and trip. The <b>Luxury SUV ($129/hr — Premium)</b> is our most popular choice. For a specific quote, the booking form above is fastest, or call <b>(773) 809-9782</b> and we'll price it out for you right now.";
    }

    if (topics.includes('airport')) {
      return "Thinking about airport transfers? We do both ORD and Midway with free wait time and flight tracking. The Luxury Sedan ($89/hr) is perfect for 1-2 people, or the SUV ($129/hr) for groups up to 6. Want to set up a pickup?";
    }

    if (topics.includes('events')) {
      return "For events, we've got you covered! Our Stretch Limo is the classic choice, but the Party Bus is a lot of fun for bigger groups. Want me to help you pick the right one? Or ready to book?";
    }

    // General intelligent fallback
    const fallbacks = [
      "Not quite sure I got that — no worries though. You can ask about <b>our fleet</b>, <b>pricing</b>, <b>airport pickups</b>, <b>events</b>, or anything YM Limo related. Or just say 'talk to a person' and I'll get you a real human 24/7.",
      "I want to help but I'm not following yet. Try something like 'What vehicles do you have?', 'How much to O\'Hare?', or 'I need a ride for 8 people.' Or call <b>(773) 809-9782</b> and a real person will sort you out.",
      "Let me try again — what are you after? A vehicle recommendation? Price quote? Airport run? Event transport? Tell me more and I'll get you sorted. Or hit 'talk to a person' if it's something complex."
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
    const label = labelMap[key] || key;
    addMsg(label, 'user');
    
    const response = ai.respond(key, true);
    setTimeout(() => {
      addMsg(response, 'bot');
      if (!key.startsWith('human_')) {
        setTimeout(showOptions, 1500);
      }
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

    // Show typing indicator
    const typing = document.createElement('div');
    typing.className = 'msg bot';
    typing.id = 'typingIndicator';
    typing.innerHTML = '<span class="msg-label">Virtual Chauffeur</span><span class="typing">Thinking<span class="dot1">.</span><span class="dot2">.</span><span class="dot3">.</span></span>';
    body.appendChild(typing);
    scrollBottom();

    // Generate response with variable delay based on complexity
    const response = ai.respond(text);
    const delay = Math.min(800 + response.length * 2, 2500);

    setTimeout(() => {
      const ind = document.getElementById('typingIndicator');
      if (ind) ind.remove();
      addMsg(response, 'bot');
      
      // Show options unless it's a farewell/goodbye
      if (!text.toLowerCase().includes('bye') && !text.toLowerCase().includes('goodbye')) {
        setTimeout(showOptions, 1000);
      }
    }, delay);
  }

  // Event listeners
  send.addEventListener('click', handleSend);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSend();
  });

  // Quick button handler (event delegation)
  body.addEventListener('click', function(e) {
    const optBtn = e.target.closest('.msg-options button');
    if (optBtn) {
      const key = optBtn.dataset.answer;
      handleAnswer(key);
    }
  });

  // Chat open/close
  btn.addEventListener('click', function() {
    popup.classList.toggle('open');
  });
  close.addEventListener('click', function() {
    popup.classList.remove('open');
  });

  // Welcome message
  setTimeout(() => {
    addMsg("Welcome to YM Limousine! I'm your <b>Virtual Chauffeur</b> 🚗. Need help with our fleet, pricing, airport transfers, or events? Just ask — or tap one of the buttons below!", 'bot');
    showOptions();
  }, 600);
});
