// ---- STATE ----
let currentMode = 'all';
let currentRegion = 'all';

// ---- TRIP DATA — single source of truth ----
// Cards, map markers, totals and tooltips are all rendered from this array: adding a trip
// here is the only edit needed. `dist` is the one-way flight distance from Buenos Aires (km),
// `stats` is the trio shown on the card ('$days' is filled in from `days` so it can't drift),
// `cities` are the map markers (a city visited twice still gets one marker).
const SEED_TRIPS = [
  {
    id:'costa-rica', name:'Costa Rica', flag:'🇨🇷', mode:'girlfriend', region:'america',
    date:'2026-12-24', dateLabel:'24 Dec 2026 – 3 Jan 2027 · With GF 💕',
    startDate:'2026-12-24', endDate:'2027-01-03', days:11, dist:6300,
    currency:'USD', budget:3600,
    stats:[['$days','Days'],['4','Stops'],['$spend','Spent']],
    highlights:[['🌋','Arenal volcano, hot springs &amp; waterfall'],['🌥️','Monteverde cloud forest &amp; hanging bridges'],['🏖️','Manuel Antonio beaches &amp; wildlife']],
    cities:[
      {name:'La Fortuna',country:'Costa Rica',lat:10.47,lng:-84.64,flag:'🇨🇷'},
      {name:'Monteverde',country:'Costa Rica',lat:10.30,lng:-84.82,flag:'🇨🇷'},
      {name:'Manuel Antonio',country:'Costa Rica',lat:9.39,lng:-84.14,flag:'🇨🇷'},
      {name:'San José',country:'Costa Rica',lat:9.93,lng:-84.08,flag:'🇨🇷'}
    ],
    stops:[
      {
        place:'La Fortuna', country:'Costa Rica', nights:3,
        lodging:{name:'Airbnb — La Fortuna', type:'airbnb', checkIn:'2026-12-24', checkOut:'2026-12-27', cost:321},
        transfer:'Fly into San José 2:00 AM, then drive north to La Fortuna',
        eat:['Don Rufino','Tierra Mia','Chifa la Familia','El Chante Verde','Soda Viquez','Red Frog','SpecTACOlar','Nanku','Soda La Hormiga','Jalapas']
      },
      {
        place:'Monteverde', country:'Costa Rica', nights:3,
        lodging:{name:'Airbnb — Santa Elena', type:'airbnb', checkIn:'2026-12-27', checkOut:'2026-12-30', cost:463, address:'Ruta Nacional 606, Santa Elena'},
        transfer:'Jeep–boat–jeep shuttle across Lake Arenal from La Fortuna',
        eat:['Soda La Salvadita','Morpho\'s','Mar Y Tierra']
      },
      {
        place:'Manuel Antonio', country:'Costa Rica', nights:3,
        lodging:{name:'Boutique Hotel Las Cascadas', type:'hotel', checkIn:'2026-12-30', checkOut:'2027-01-02', cost:485},
        transfer:'Pick up rental car in Manuel Antonio (Adobe Rent a Car, conf. 1357708)',
        eat:['Rico Tico Jungle Grill','El Arado','Café Agua Azul','El Patio de Café Milagro','Oceano','Mangata']
      },
      {
        place:'San José', country:'Costa Rica', nights:1,
        lodging:{name:'Sleep Inn Paseo Las Damas', type:'hotel', checkIn:'2027-01-02', checkOut:'2027-01-03', cost:85, address:'Centro, San José'},
        transfer:'3 h drive from Manuel Antonio; drop the car at the airport the next morning',
        eat:['Mercado Central']
      }
    ],
    itinerary:[
      {date:'2026-12-24', place:'Travel → La Fortuna', text:'Fly to San José 2:00 AM. Arrive in the afternoon — settle in and walk the town.'},
      {date:'2026-12-25', place:'La Fortuna', text:'Parque Nacional Volcán Arenal (Sendero Las Coladas), La Fortuna waterfall, rafting and kayak on the lake, hot springs.'},
      {date:'2026-12-26', place:'La Fortuna', text:'Volcano tour with hot springs and waterfall.'},
      {date:'2026-12-27', place:'Monteverde', text:'Transfer from La Fortuna, settle in Santa Elena.', note:'Refugio Night Tour · 5:00 PM · $35 pp'},
      {date:'2026-12-28', place:'Monteverde', text:'Cloud forest reserve. Chocolate tour — tasting from fruit to bar.'},
      {date:'2026-12-29', place:'Monteverde', text:'Don Juan Coffee Tour. Hanging bridges or Sky Adventures in the afternoon.'},
      {date:'2026-12-30', place:'Manuel Antonio', text:'Pick up rental car. Playa Espadilla Sur and Playa Biesanz.'},
      {date:'2026-12-31', place:'Manuel Antonio', text:'Beach day — Espadilla, Playitas, Las Gemelas, Escondida.'},
      {date:'2027-01-01', place:'Manuel Antonio', text:'Slow beach day around Manuel Antonio.'},
      {date:'2027-01-02', place:'San José', text:'Drive 3 h, leave early. Saprissa jersey shopping, Mercado Central, Barrio Amón.'},
      {date:'2027-01-03', place:'Travel', text:'Drop the car at the airport. Departure 10:00 AM.'}
    ],
    expenses:[
      {category:'Flights', label:'Round-trip airfare', amount:1378},
      {category:'Lodging', label:'Airbnb — La Fortuna (3 nights)', amount:321},
      {category:'Lodging', label:'Airbnb — Monteverde (3 nights)', amount:463},
      {category:'Transport', label:'Rental car — Adobe Rent a Car', amount:563},
      {category:'Lodging', label:'Hotel Las Cascadas — Manuel Antonio (3 nights)', amount:485},
      {category:'Lodging', label:'Sleep Inn — San José (1 night)', amount:85}
    ],
    transport:[
      {mode:'✈️', label:'Outbound — fly to San José', detail:'24 Dec · 2:00 AM'},
      {mode:'🚐', label:'La Fortuna → Monteverde', detail:'Jeep–boat–jeep shuttle across the lake'},
      {mode:'🚗', label:'Rental car from Manuel Antonio', detail:'Adobe Rent a Car · confirmation 1357708 · $563'},
      {mode:'✈️', label:'Return — San José', detail:'3 Jan · 10:00 AM · drop car at airport'}
    ],
    notes:'Excursions (volcano tour, night tour, chocolate, coffee, hanging bridges) still to be priced and booked.'
  },
  {
    id:'southafrica', name:'South Africa', flag:'🇿🇦', mode:'girlfriend', region:'africa',
    date:'2024-01-13', dateLabel:'13–29 Jan, 2024 · With GF 💕', days:16, dist:6869,
    stats:[['$days','Days'],['5','Cities'],['2.3K','km']],
    highlights:[['🦁','Kariega Safari — 3 nights'],['🪂','Bloukrans Bridge bungee jump'],['🦈','Shark diving in Knysna']],
    cities:[{name:'Cape Town',country:'South Africa',lat:-33.92,lng:18.42,flag:'🇿🇦'}]
  },
  {
    id:'southeast-asia', name:'Southeast Asia', flag:'🌏', mode:'girlfriend', region:'asia',
    date:'2024-12-28', dateLabel:'28 Dec 2024 – 20 Jan 2025 · With GF 💕', days:24, dist:16872,
    stats:[['$days','Days'],['10+','Cities'],['3','Countries']],
    highlights:[['🛕','Angkor Wat temples'],['🏝️','Ha Long Bay — Natural Wonder of the World'],['✨','Maya Bay & bioluminescent plankton']],
    cities:[
      {name:'Bangkok',country:'Thailand',lat:13.75,lng:100.5,flag:'🇹🇭'},
      {name:'Siem Reap',country:'Cambodia',lat:13.36,lng:103.86,flag:'🇰🇭'},
      {name:'Ho Chi Minh City',country:'Vietnam',lat:10.82,lng:106.63,flag:'🇻🇳'}
    ]
  },
  {
    id:'colombia', name:'Colombia', flag:'🇨🇴', mode:'girlfriend', region:'america',
    date:'2026-02-13', dateLabel:'13–21 Feb, 2026 · With GF 💕', days:9, dist:5320,
    stats:[['$days','Days'],['2','Cities'],['850','km']],
    highlights:[['🏰','Cartagena historic center'],['🤿','Islas del Rosario snorkeling'],['🎨','Barrio Getsemaní street art']],
    cities:[{name:'Cartagena',country:'Colombia',lat:10.39,lng:-75.51,flag:'🇨🇴'}]
  },
  {
    id:'chile', name:'Chile', flag:'🇨🇱', mode:'girlfriend', region:'america',
    date:'2025-07-24', dateLabel:'24–28 Jul, 2025 · With GF 💕', days:5, dist:1138,
    stats:[['$days','Days'],['1','City'],['250','km']],
    highlights:[['🏛️','Historic Santiago center'],['🛍️','Shopping at Parque Arauco'],['🎨','Barrio Bellavista']],
    cities:[{name:'Santiago',country:'Chile',lat:-33.45,lng:-70.66,flag:'🇨🇱'}]
  },
  {
    id:'iguazu', name:'Iguazu Falls', flag:'🇦🇷', mode:'girlfriend', region:'argentina',
    date:'2024-07-01', dateLabel:'Jul 2024 · With GF 💕', days:4, dist:1061,
    stats:[['$days','Days'],['2','Sides'],['600','km']],
    highlights:[['🌙','Full moon excursion'],['💦','Brazilian & Argentine sides'],['🚤','Boat adventure']],
    cities:[{name:'Iguazú Falls',country:'Argentina',lat:-25.69,lng:-54.44,flag:'🇦🇷'}]
  },
  {
    id:'salta-region', name:'Salta Region', flag:'🇦🇷', mode:'girlfriend', region:'argentina',
    date:'2023-09-01', dateLabel:'Northern Argentina · With GF 💕', days:5, dist:1285,
    stats:[['$days','Days'],['4','Cities'],['1.2K','km']],
    highlights:[['🧂','Salinas Grandes salt flats'],['🏔️','Quebrada de las Conchas'],['🍷','Cafayate wine region']],
    cities:[{name:'Salta',country:'Argentina',lat:-24.79,lng:-65.41,flag:'🇦🇷'}]
  },
  {
    id:'uruguay', name:'Uruguay', flag:'🇺🇾', mode:'girlfriend', region:'america',
    date:'2026-03-22', dateLabel:'22–24 Mar, 2026 · With GF 💕', days:3, dist:205,
    stats:[['$days','Days'],['1','City'],['~270','km']],
    highlights:[['🏙️','Ciudad Vieja & la rambla'],['🥩','Bar Facal — chivito & asado'],['🏖️','Barrios costeros de Pocitos']],
    cities:[{name:'Montevideo',country:'Uruguay',lat:-34.9,lng:-56.16,flag:'🇺🇾'}]
  },
  {
    id:'salta-jujuy', name:'Salta &amp; Jujuy', flag:'🇦🇷', mode:'girlfriend', region:'argentina',
    date:'2026-07-01', dateLabel:'Jul 2026 · With GF 💕', days:5, dist:1391,
    stats:[['$days','Days'],['5','Cities'],['1.1K','km']],
    highlights:[['🌈','Cerro de los 7 Colores — Purmamarca'],['🧂','Salinas Grandes salt flats'],['⛰️','Humahuaca &amp; Tilcara, la Quebrada']],
    cities:[{name:'Jujuy / Purmamarca',country:'Argentina',lat:-23.74,lng:-65.5,flag:'🇦🇷'}]
  },
  {
    id:'la-2026', name:'Los Angeles', flag:'🇺🇸', mode:'solo', region:'america',
    date:'2026-08-04', dateLabel:'4–9 Aug, 2026', days:6, dist:9852,
    stats:[['$days','Days'],['1','City'],['300','km']],
    highlights:[['🔭','Griffith Observatory &amp; Hollywood Hills'],['🏖️','Santa Monica &amp; Venice Beach'],['🌴','Downtown LA &amp; Arts District']],
    cities:[{name:'Los Angeles',country:'United States',lat:34.05,lng:-118.24,flag:'🇺🇸'}]
  },
  {
    id:'denver', name:'Denver', flag:'🇺🇸', mode:'solo', region:'america',
    date:'2026-06-28', dateLabel:'28 Jun 2026', days:7, dist:9551,
    stats:[['$days','Days'],['1','City'],['250','km']],
    highlights:[['🛍️','Cherry Creek Shopping'],['🎨','RiNo Art District &amp; Larimer Square'],['🏛️','Civic Center &amp; Downtown']],
    cities:[{name:'Denver',country:'United States',lat:39.74,lng:-104.99,flag:'🇺🇸'}]
  },
  {
    id:'austin', name:'Austin', flag:'🇺🇸', mode:'solo', region:'america',
    date:'2025-09-26', dateLabel:'26 Sep – 5 Oct 2025', days:10, dist:8320,
    stats:[['$days','Days'],['1','City'],['300','km']],
    highlights:[['🎸','Live music on 6th Street'],['🌮','Tacos &amp; Texas BBQ'],['🦇','Congress Ave bats at dusk']],
    cities:[{name:'Austin',country:'United States',lat:30.27,lng:-97.74,flag:'🇺🇸'}]
  },
  {
    id:'poland-israel', name:'Poland & Israel', flag:'🇵🇱🇮🇱', mode:'solo', region:'europe',
    date:'2025-05-01', dateLabel:'2025', days:15, dist:12140,
    stats:[['2','Countries'],['3','Cities'],['~2K','km']],
    highlights:[['🏰','Kraków and Warsaw'],['🕊️','Jerusalem exploration']],
    cities:[
      {name:'Kraków',country:'Poland',lat:50.06,lng:19.94,flag:'🇵🇱'},
      {name:'Jerusalem',country:'Israel',lat:31.78,lng:35.21,flag:'🇮🇱'}
    ]
  },
  {
    id:'san-diego', name:'San Diego', flag:'🇺🇸', mode:'solo', region:'america',
    date:'2025-03-01', dateLabel:'2025', days:5, dist:9677,
    stats:[['~5','Days'],['1','City'],['200','km']],
    highlights:[['🌊','Pacific beaches'],['🌮','Mexican food scene']],
    cities:[{name:'San Diego',country:'United States',lat:32.72,lng:-117.16,flag:'🇺🇸'}]
  },
  {
    id:'nyc', name:'New York City', flag:'🇺🇸', mode:'solo', region:'america',
    date:'2024-05-01', dateLabel:'2024', days:5, dist:8527,
    stats:[['~5','Days'],['1','City'],['150','km']],
    highlights:[['🗽','Manhattan & Brooklyn'],['🎭','Broadway shows']],
    cities:[{name:'New York City',country:'United States',lat:40.71,lng:-74.01,flag:'🇺🇸'}]
  },
  {
    id:'rio-2023', name:'Rio de Janeiro', flag:'🇧🇷', mode:'solo', region:'america',
    date:'2023-02-01', dateLabel:'2023', days:7, dist:1968,
    stats:[['~7','Days'],['1','City'],['400','km']],
    highlights:[['⛰️','Christ the Redeemer'],['🏖️','Copacabana & Ipanema']],
    cities:[{name:'Rio de Janeiro',country:'Brazil',lat:-22.91,lng:-43.17,flag:'🇧🇷'}]
  },
  {
    id:'la', name:'Los Angeles', flag:'🇺🇸', mode:'solo', region:'america',
    date:'2023-06-01', dateLabel:'2023', days:5, dist:9852,
    stats:[['~5','Days'],['1','City'],['300','km']],
    highlights:[['🎬','Hollywood & Santa Monica'],['🌴','Venice Beach']],
    cities:[{name:'Los Angeles',country:'United States',lat:34.05,lng:-118.24,flag:'🇺🇸'}]
  },
  {
    id:'mexico', name:'Mexico — Riviera Maya', flag:'🇲🇽', mode:'solo', region:'america',
    date:'2022-07-01', dateLabel:'2022', days:7, dist:6892,
    stats:[['~7','Days'],['3','Cities'],['~200','km']],
    highlights:[['🏛️','Chichen Itza pyramid'],['🏖️','Tulum & Playa del Carmen'],['🤿','Cancun cenotes diving']],
    cities:[{name:'Cancún',country:'Mexico',lat:21.16,lng:-86.85,flag:'🇲🇽'}]
  },
  {
    id:'peru', name:'Peru — Machu Picchu', flag:'🇵🇪', mode:'solo', region:'america',
    date:'2020-02-01', dateLabel:'2020', days:10, dist:2713,
    stats:[['$days','Days'],['2','Cities'],['~600','km']],
    highlights:[['🏛️','Machu Picchu wonder of the world'],['🚂','Sacred Valley exploration'],['⛰️','Cusco historic center']],
    cities:[{name:'Cusco',country:'Peru',lat:-13.53,lng:-71.97,flag:'🇵🇪'}]
  },
  {
    id:'patagonia-sur', name:'Patagonia Sur', flag:'🇦🇷', mode:'solo', region:'argentina',
    date:'2020-11-01', dateLabel:'2020', days:7, dist:2080,
    stats:[['~7','Days'],['3','Cities'],['1.5K','km']],
    highlights:[['🏔️','El Chaltén & El Calafate'],['❄️','Perito Moreno Glacier']],
    cities:[{name:'El Calafate',country:'Argentina',lat:-50.34,lng:-72.27,flag:'🇦🇷'}]
  },
  {
    id:'europe-tour', name:'Europe Tour', flag:'🇮🇹🇭🇷🇬🇷', mode:'solo', region:'europe',
    date:'2018-06-01', dateLabel:'2018', days:21, dist:11152,
    stats:[['4','Countries'],['7+','Cities'],['~3K','km']],
    highlights:[['🏛️','Colosseum in Rome'],['🌊','Venice, Florence, Dubrovnik'],['🏝️','Athens & Mykonos']],
    cities:[
      {name:'Rome',country:'Italy',lat:41.9,lng:12.5,flag:'🇮🇹'},
      {name:'Dubrovnik',country:'Croatia',lat:42.65,lng:18.09,flag:'🇭🇷'},
      {name:'Athens',country:'Greece',lat:37.98,lng:23.73,flag:'🇬🇷'}
    ]
  },
  {
    id:'rio-2016', name:'Rio de Janeiro', flag:'🇧🇷', mode:'solo', region:'america',
    date:'2016-08-01', dateLabel:'2016', days:7, dist:1968,
    stats:[['~7','Days'],['1','City'],['400','km']],
    highlights:[['🏛️','Christ the Redeemer'],['🏅','Olympic Games 2016'],['🎉','Carnival vibes']],
    cities:[{name:'Rio de Janeiro',country:'Brazil',lat:-22.91,lng:-43.17,flag:'🇧🇷'}]
  },
  {
    id:'patagonia-norte', name:'Patagonia Norte', flag:'🇦🇷', mode:'solo', region:'argentina',
    date:'2015-07-01', dateLabel:'2015', days:7, dist:1345,
    stats:[['~7','Days'],['2','Cities'],['1.5K','km']],
    highlights:[['⛰️','Bariloche & Villa La Angostura'],['🎿','Cerro Catedral skiing']],
    cities:[{name:'Bariloche',country:'Argentina',lat:-41.13,lng:-71.31,flag:'🇦🇷'}]
  }
];

// ---- STORE — localStorage keeps only a PATCH over the seed data ----
// So a later code change to a seed trip still reaches you: the patch records only the
// trips you edited, deleted or added; everything else always comes from SEED_TRIPS.
const PATCH_KEY = 'td_trips_patch_v3';
const OLD_TRIPS_KEY = 'td_trips_v2';   // pre-overlay format: a full snapshot of the array
const clone = o => JSON.parse(JSON.stringify(o));
const EMPTY_PATCH = () => ({ v: 3, edited: {}, deleted: [], added: [] });

// Diff a live trips array against the seed → { edited, deleted, added }
function computePatch(live) {
  const seedStr = new Map(SEED_TRIPS.map(t => [t.id, JSON.stringify(t)]));
  const liveIds = new Set(live.map(t => t.id));
  const patch = EMPTY_PATCH();
  for (const s of SEED_TRIPS) if (!liveIds.has(s.id)) patch.deleted.push(s.id);
  for (const t of live) {
    if (!seedStr.has(t.id)) patch.added.push(t);
    else if (JSON.stringify(t) !== seedStr.get(t.id)) patch.edited[t.id] = t;
  }
  return patch;
}
// Fresh seed copy + patch → the array the app renders
function applyPatch(patch) {
  const del = new Set(patch.deleted || []);
  const out = [];
  for (const s of SEED_TRIPS) {
    if (del.has(s.id)) continue;
    out.push((patch.edited && patch.edited[s.id]) || clone(s));
  }
  for (const t of (patch.added || [])) out.push(t);
  return out;
}
function loadPatch() {
  try {
    const raw = localStorage.getItem(PATCH_KEY);
    if (raw) return Object.assign(EMPTY_PATCH(), JSON.parse(raw));
    const old = localStorage.getItem(OLD_TRIPS_KEY);   // one-time migration from the old whole-array format
    if (old) {
      const patch = computePatch(JSON.parse(old));
      localStorage.setItem(PATCH_KEY, JSON.stringify(patch));
      localStorage.removeItem(OLD_TRIPS_KEY);
      return patch;
    }
  } catch (e) {}
  return EMPTY_PATCH();
}
function saveTrips() { try { localStorage.setItem(PATCH_KEY, JSON.stringify(computePatch(trips))); } catch (e) {} }
function resetTrips() {
  try { localStorage.removeItem(PATCH_KEY); localStorage.removeItem(OLD_TRIPS_KEY); } catch (e) {}
  trips.length = 0; SEED_TRIPS.forEach(s => trips.push(clone(s)));
}
const trips = applyPatch(loadPatch());

// ---- BUCKET LIST — same localStorage-overlay pattern as trips ----
const BUCKET_KEY = 'td_bucket_v1';
const BUCKET_SEED = [
  { name:'Europa 1', flag:'🇬🇧🇫🇷', status:'🔥 Coming up', mode:'couple', highlights:[['🎡','London — Thames & West End'],['🗼','Paris — Eiffel & Louvre'],['🚄','Eurostar between the two']] },
  { name:'Antarctica', flag:'🇦🇶', status:'⭐ Dream Goal', mode:'solo', highlights:[['🐧','See penguins in the wild'],['🚢','Drake Passage crossing'],['❄️','Step on the 7th continent']] },
  { name:'Australia & New Zealand', flag:'🇦🇺🇳🇿', status:'Planned: TBD', mode:'solo', highlights:[['🏝️','Great Barrier Reef diving'],['🦘','Outback adventure'],['🏔️','New Zealand fjords']] },
  { name:'Japan', flag:'🇯🇵', status:'High Priority', mode:'solo', highlights:[['🗻','Mt. Fuji climb'],['🍜','Tokyo food tour'],['⛩️','Kyoto temples']] },
  { name:'Europa 2', flag:'🇩🇪🇷🇴🇧🇦', status:'Planned: TBD', mode:'couple', highlights:[['🍺','Berlin & Munich'],['🏰','Transylvania castles'],['🌉','Mostar old bridge']] },
  { name:'Everest Base Camp', flag:'🏔️', status:'Epic Challenge', mode:'solo', highlights:[['⛰️','Trek to 5,364m altitude'],['🥾','14-day hiking challenge'],['🏔️','See the world’s highest peak']] },
  { name:'Kenya & Tanzania', flag:'🇰🇪🇹🇿', status:'Wildlife Dream', mode:'solo', highlights:[['🦁','Big Five in the Serengeti'],['🦓','Great Migration — Masai Mara'],['🏕️','Glamping under stars']] },
  { name:'Maldives', flag:'🏝️', status:'Romantic Escape', mode:'couple', highlights:[['🏖️','Overwater bungalow'],['🤿','Diving paradise'],['🌅','Perfect sunsets']] },
  { name:'Iceland', flag:'🇮🇸', status:'Northern Lights', mode:'solo', highlights:[['🌌','Aurora Borealis hunting'],['♨️','Blue Lagoon geothermal spa'],['💧','Waterfalls & glaciers']] },
  { name:'Nórdicos', flag:'🇸🇪🇳🇴🇫🇮', status:'Planned: TBD', mode:'couple', highlights:[['⛴️','Norwegian fjords'],['🌌','Lapland & northern lights'],['🏙️','Stockholm & Helsinki']] },
  { name:'Bálticos', flag:'🇱🇻🇱🇹🇪🇪', status:'Letonia, Lituania & Estonia', mode:'couple', highlights:[['🏛️','Riga art nouveau quarter'],['⛪','Vilnius old town'],['🏰','Tallinn medieval walls']] },
  { name:'Guatemala', flag:'🇬🇹', status:'Planned: TBD', mode:'couple', highlights:[['🏛️','Tikal Mayan ruins'],['🌋','Acatenango volcano hike'],['🏞️','Lago de Atitlán']] },
  { name:'Disney & Miami', flag:'🇺🇸', status:'Planned: TBD', mode:'couple', highlights:[['🎢','Disney World parks'],['🏖️','South Beach & Wynwood'],['🐊','Everglades airboat']] },
  { name:'New York', flag:'🇺🇸', status:'Return trip', mode:'couple', highlights:[['🎄','Manhattan at Christmas'],['🏟️','A game at Madison Square Garden'],['🍕','Pizza tour across boroughs']] },
  { name:'Arizona & Grand Canyon', flag:'🏜️', status:'Planned: TBD', mode:'couple', highlights:[['🌄','Grand Canyon south rim'],['🪨','Antelope Canyon & Horseshoe Bend'],['🚗','Route 66 road trip']] }
];
function loadStoredBucket() { try { const r = localStorage.getItem(BUCKET_KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
function saveBucket() { try { localStorage.setItem(BUCKET_KEY, JSON.stringify(bucketList)); } catch (e) {} }
const bucketList = loadStoredBucket() || JSON.parse(JSON.stringify(BUCKET_SEED));

// New7Wonders of the World (2007) / of Nature (2011) — ticked from the country you've visited
const MODERN_WONDERS = [
  ['Machu Picchu', 'Peru'], ['Christ the Redeemer', 'Brazil'], ['Chichén Itzá', 'Mexico'],
  ['Colosseum', 'Italy'], ['Great Wall of China', 'China'], ['Petra', 'Jordan'], ['Taj Mahal', 'India']
];
const NATURAL_WONDERS = [
  ['Iguazú Falls', 'Argentina'], ['Table Mountain', 'South Africa'], ['Hạ Long Bay', 'Vietnam'],
  ['Amazon Rainforest', 'Brazil'], ['Jeju Island', 'South Korea'], ['Komodo', 'Indonesia'], ['Puerto Princesa River', 'Philippines']
];

// Home base — on the map, but not a trip
const HOME_BASE = {name:'Buenos Aires',country:'Argentina',label:'Argentina (home base)',lat:-34.61,lng:-58.38,flag:'🇦🇷',gf:true};

// Country → continent. `svg` is only needed when the world-map path uses a different name.
const COUNTRIES = {
  'Argentina':      { cont:'South America' },
  'Brazil':         { cont:'South America' },
  'Chile':          { cont:'South America' },
  'Colombia':       { cont:'South America' },
  'Peru':           { cont:'South America' },
  'Uruguay':        { cont:'South America' },
  'Mexico':         { cont:'North America' },
  'Costa Rica':     { cont:'North America' },
  'United States':  { cont:'North America', svg:'United States of America' },
  'Croatia':        { cont:'Europe' },
  'Greece':         { cont:'Europe' },
  'Italy':          { cont:'Europe' },
  'Poland':         { cont:'Europe' },
  'Cambodia':       { cont:'Asia' },
  'Israel':         { cont:'Asia' },
  'Thailand':       { cont:'Asia' },
  'Vietnam':        { cont:'Asia' },
  'South Africa':   { cont:'Africa' }
};

const CONTINENTS = {
  'South America':'🌎', 'North America':'🌎', 'Europe':'🇪🇺', 'Africa':'🌍',
  'Asia':'🌏', 'Oceania':'🌏', 'Antarctica':'🇦🇶'
};


const ROUND_TRIP = 2;      // every trip is a there-and-back flight
const CRUISE_KMH = 800;    // average incl. climb/descent — for the flight-hours estimate
const COUNTRY_GOAL = 195, CONTINENT_GOAL = 7;

// ---- DERIVED TOTALS ----
function totals(mode) {
  const ts = mode === 'girlfriend' ? trips.filter(t => t.mode === 'girlfriend') : trips;
  const cities = new Map();  // same place in two different years → one city
  ts.forEach(t => t.cities.forEach(c => cities.set(c.name, c)));
  const countries = [...new Map([...cities.values()].map(c => [c.country, c.flag]))];
  const continents = [...new Set(countries.map(([c]) => (COUNTRIES[c] || {}).cont).filter(Boolean))];
  const km = ts.reduce((s, t) => s + t.dist, 0) * ROUND_TRIP;
  const days = ts.reduce((s, t) => s + t.days, 0);
  return {
    trips: ts.length,
    cities: cities.size + 1,  // + home base
    countries,                // [[name, flag], ...] in visit order
    continents, km, days,
    hours: Math.round(km / CRUISE_KMH)
  };
}

let T = { all: totals('all'), girlfriend: totals('girlfriend') };
function recomputeTotals() { T = { all: totals('all'), girlfriend: totals('girlfriend') }; }

function setVal(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }
function setHTML(id, v) { const el = document.getElementById(id); if (el) el.innerHTML = v; }
function setWidth(id, w) { const el = document.getElementById(id); if (el) el.style.width = w + '%'; }
const pct = (n, goal) => Math.round(n / goal * 1000) / 10;

function applyMode(mode) {
  currentMode = mode;
  const d = T[mode] || T.all;

  // Overview stat cards
  setVal('stat-distance', Math.round(d.km / 1000) + 'K km');
  setVal('stat-countries', `${d.countries.length} / ${COUNTRY_GOAL}`);
  setVal('stat-continents', `${d.continents.length} / ${CONTINENT_GOAL}`);
  setVal('stat-total-trips', d.trips);

  // Stats tab
  setVal('sv-flight', `~${d.hours}h`);
  setVal('sv-countries', d.countries.length);
  setVal('sv-continents', d.continents.length);
  setVal('sv-nights', `~${d.days}`);

  // Trips
  updateTripsDisplay();

  // Bucket list — show couple-only goals when the toggle is on "Couple Goals"
  const goals = [...document.querySelectorAll('#bucketGrid .bucket-goal-card')];
  goals.forEach(c => {
    c.style.display = (mode === 'all' || c.getAttribute('data-bucket-mode') === 'couple') ? '' : 'none';
  });
  const shown = mode === 'all' ? bucketList : bucketList.filter(b => b.mode === 'couple');
  setVal('b-continents', `${d.continents.length} / ${CONTINENT_GOAL}`);
  setVal('b-continents-missing', 'Missing: ' + Object.keys(CONTINENTS).filter(c => !d.continents.includes(c)).join(', '));
  setVal('b-bucket', shown.length);
  setVal('b-bucket-sub', mode === 'all' ? 'places on the wishlist' : 'couple trips on the wishlist');

  // Map
  updateMap(mode);

  // Spending (Statistics tab)
  renderSpending(mode);
}

// Spend stats on the Statistics tab — only trips with expenses logged count
function renderSpending(mode) {
  const scope = mode === 'girlfriend' ? trips.filter(t => t.mode === 'girlfriend') : trips;
  const ts = scope.filter(t => tripSpend(t) > 0);
  const note = document.getElementById('spendNote');
  const bar = document.getElementById('sp-bar'), key = document.getElementById('sp-key');
  if (!ts.length) {
    ['sp-total', 'sp-avg', 'sp-day', 'sp-max'].forEach(id => setVal(id, '—'));
    setVal('sp-max-sub', '');
    if (bar) bar.innerHTML = ''; if (key) key.innerHTML = '';
    if (note) note.textContent = `No costs logged yet on any of your ${scope.length} trips — add costs when you import or edit a trip.`;
    return;
  }
  const total = ts.reduce((s, t) => s + tripSpend(t), 0);
  const days = ts.reduce((s, t) => s + (t.days || 0), 0);
  const byCat = {};
  ts.forEach(t => (t.expenses || []).forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + (+e.amount || 0); }));
  const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const max = ts.reduce((m, t) => tripSpend(t) > tripSpend(m) ? t : m, ts[0]);
  setVal('sp-total', money(total));
  setVal('sp-avg', money(total / ts.length));
  setVal('sp-day', days ? money(total / days) : '—');
  setVal('sp-max', money(tripSpend(max)));
  setVal('sp-max-sub', `${max.flag} ${max.name}`);
  if (bar) bar.innerHTML = cats.map(([c, v]) => `<i style="width:${(v / total * 100).toFixed(1)}%;background:${CAT_COLOR[c] || CAT_COLOR.Other}"></i>`).join('');
  if (key) key.innerHTML = cats.map(([c, v]) => `<span><i style="background:${CAT_COLOR[c] || CAT_COLOR.Other}"></i>${c} ${money(v)} · ${Math.round(v / total * 100)}%</span>`).join('');
  if (note) note.textContent = `Based on ${ts.length} of ${scope.length} trip${scope.length === 1 ? '' : 's'} — only those with costs logged.`;
}

// Values that don't depend on the mode toggle — set once at init
function renderStaticStats() {
  const flags = d => d.countries.map(([, f]) => f).join('');
  const conts = d => d.continents.map(c => `${CONTINENTS[c]} ${c}`).join(', ');
  setHTML('tt-countries', `<strong>All:</strong> ${flags(T.all)}<br><br><strong>With GF:</strong> ${flags(T.girlfriend)}`);
  setHTML('tt-continents', `<strong>All:</strong> ${conts(T.all)}<br><br><strong>With GF:</strong> ${conts(T.girlfriend)}`);
  renderWonders();
}

// Wonders of the World — ticked from the visited-country set, so it updates itself
function renderWonders() {
  const visited = new Set(T.all.countries.map(([c]) => c));
  const paint = (list, listId) => {
    const el = document.getElementById(listId);
    const hit = list.filter(([, c]) => visited.has(c)).length;
    if (el) el.innerHTML = list.map(([name, c]) =>
      `${visited.has(c) ? '✅' : '⬜'} ${esc(name)}`).join('<br>');
    return hit;
  };
  const m = paint(MODERN_WONDERS, 'wonder-modern');
  const n = paint(NATURAL_WONDERS, 'wonder-natural');
  setVal('wonder-count', `${m + n} / ${MODERN_WONDERS.length + NATURAL_WONDERS.length}`);
}

// Bucket List — rendered from `bucketList`, add via the modal, remove with the ✕ on each card
function renderBucket() {
  const grid = document.getElementById('bucketGrid');
  if (!grid) return;
  grid.innerHTML = bucketList.map((b, i) => `
    <div class="trip-card bucket-goal-card" data-bucket-mode="${b.mode === 'couple' ? 'couple' : 'solo'}">
      <button class="bucket-del" data-del="${i}" title="Remove goal" aria-label="Remove goal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>
      <div class="trip-header"><div class="trip-flag">${esc(b.flag || '📍')}</div><div class="trip-info"><h3>${esc(b.name)}</h3><div class="trip-date" style="color:var(--accent)">${esc(b.status || 'Planned: TBD')}</div></div></div>
      ${(b.highlights && b.highlights.length) ? `<div class="trip-highlights">${b.highlights.map(([ic, tx]) => `<div class="highlight-item"><span class="highlight-icon">${esc(ic)}</span><span>${esc(tx)}</span></div>`).join('')}</div>` : ''}
    </div>`).join('');
  grid.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => {
    bucketList.splice(+btn.getAttribute('data-del'), 1);
    saveBucket(); renderBucket(); applyMode(currentMode);
  }));
}

// ---- TRIP CARDS ----
const tripSpend = t => (t.expenses || []).reduce((s, e) => s + (Number(e.amount) || 0), 0);
const statValue = (t, v) =>
  v === '$days' ? t.days :
  v === '$spend' ? (tripSpend(t) ? '$' + Math.round(tripSpend(t)).toLocaleString('en-US') : '—') :
  v;

function renderTrips() {
  const grid = document.getElementById('tripsGrid');
  if (!grid) return;
  grid.innerHTML = trips.map(t => `
        <div class="trip-card" data-mode="${t.mode}" data-region="${t.region}" data-trip="${t.id}" data-date="${t.date}" data-days="${t.days}" data-dist="${t.dist}">
          <div class="trip-header"><div class="trip-flag">${t.flag}</div><div class="trip-info"><h3>${t.name}${(t.stops && t.stops.length) || (t.itinerary && t.itinerary.length) || (t.expenses && t.expenses.length) ? '<span class="trip-badge" title="Full itinerary"></span>' : ''}</h3><div class="trip-date">${t.dateLabel}</div></div></div>
          <div class="trip-stats">${t.stats.map(([v, l]) => `<div class="trip-stat"><div class="trip-stat-value">${statValue(t, v)}</div><div class="trip-stat-label">${l}</div></div>`).join('')}</div>
          <div class="trip-highlights">${t.highlights.map(([icon, text]) => `<div class="highlight-item"><span class="highlight-icon">${icon}</span><span>${text}</span></div>`).join('')}</div>
        </div>`).join('');
}

// ---- MAP ----
const SVG_TO_COUNTRY = Object.fromEntries(
  Object.entries(COUNTRIES).map(([name, meta]) => [meta.svg || name, name])
);

function updateMap(mode) {
  const visited = new Set(T.all.countries.map(([c]) => c));
  const gfVisited = new Set(T.girlfriend.countries.map(([c]) => c));
  // Paint the map from the trip data, and dim what wasn't visited together in "With Girlfriend"
  document.querySelectorAll('.country[data-name]').forEach(p => {
    const name = SVG_TO_COUNTRY[p.getAttribute('data-name')];
    const isVisited = visited.has(name);
    p.classList.toggle('visited', isVisited);
    p.setAttribute('data-gf', gfVisited.has(name) ? '1' : '0');
    p.style.opacity = (isVisited && mode === 'girlfriend' && !gfVisited.has(name)) ? '0.3' : '1';
  });
  // Dim solo markers in "With Girlfriend" mode
  document.querySelectorAll('.marker-group').forEach(g => {
    const dim = (mode === 'girlfriend' && g.getAttribute('data-gf') !== '1');
    g.style.opacity = dim ? '0.12' : '1';
  });
  const d = T[mode] || T.all;
  setVal('legendText', `${d.countries.length} countries visited • ${d.cities} cities explored`);
}

// ---- MARKERS ----
// Equirectangular projection — matches the world map viewBox (2000 x 1000, lon -180..180 / lat 90..-90)
const project = (lng, lat) => ({ x: (lng + 180) / 360 * 2000, y: (90 - lat) / 180 * 1000 });

// One marker per city — a place visited on two trips keeps both, newest first
function cityMarkers() {
  const byCity = new Map();
  trips.forEach(t => t.cities.forEach(c => {
    const m = byCity.get(c.name) || { ...c, gf: false, trips: [] };
    m.gf = m.gf || t.mode === 'girlfriend';
    m.trips.push(t);
    byCity.set(c.name, m);
  }));
  byCity.forEach(m => m.trips.sort((a, b) => b.date.localeCompare(a.date)));
  return [{ ...HOME_BASE, trips: [] }, ...byCity.values()];
}

const mapGroup = document.getElementById('mapGroup');
const mapContainer = document.getElementById('mapContainer');
const mapTooltip = document.getElementById('mapTooltip');
const tripPicker = document.getElementById('tripPicker');

// Position an overlay (tooltip, picker) at a click/hover point inside the map container
function placeInMap(el, e, dx = 12, dy = -12) {
  const box = mapContainer.getBoundingClientRect();
  el.style.left = (e.clientX - box.left + dx) + 'px';
  el.style.top = (e.clientY - box.top + dy) + 'px';
}

const closePicker = () => tripPicker?.classList.remove('show');

// A city visited more than once: let the pin ask which trip you meant
function openTripPicker(loc, e) {
  tripPicker.innerHTML =
    `<div class="trip-picker-title">${loc.flag} ${loc.name} — ${loc.trips.length} trips</div>` +
    // The date is what tells two visits apart; the trip name only helps when it differs
    loc.trips.map(t => `<button class="trip-picker-item" data-trip="${t.id}">${t.dateLabel}${t.name === loc.name ? '' : `<span>${t.name}</span>`}</button>`).join('');
  tripPicker.querySelectorAll('.trip-picker-item').forEach(btn => {
    btn.addEventListener('click', () => {
      closePicker();
      goToTrip(btn.getAttribute('data-trip'));
    });
  });
  placeInMap(tripPicker, e);
  tripPicker.classList.add('show');
  // Keep the picker inside the map once its size is known
  const box = mapContainer.getBoundingClientRect(), p = tripPicker.getBoundingClientRect();
  if (p.right > box.right) tripPicker.style.left = Math.max(8, box.width - p.width - 8) + 'px';
  if (p.bottom > box.bottom) tripPicker.style.top = Math.max(8, box.height - p.height - 8) + 'px';
  if (p.top < box.top) tripPicker.style.top = '8px';
}

document.addEventListener('click', e => {
  if (!e.target.closest('#tripPicker') && !e.target.closest('.marker-group')) closePicker();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePicker(); });

function renderMarkers() {
  if (!mapGroup) return;
  mapGroup.querySelectorAll('.marker-group').forEach(n => n.remove());
  cityMarkers().forEach(loc => {
    const trip = loc.trips[0];
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.classList.add('marker-group');
    g.setAttribute('data-gf', loc.gf ? '1' : '0');

    const { x, y } = project(loc.lng, loc.lat);

    const hit = document.createElementNS('http://www.w3.org/2000/svg','circle');
    hit.setAttribute('cx', x); hit.setAttribute('cy', y); hit.setAttribute('r', '14');
    hit.classList.add('marker-hit');

    const pulse = document.createElementNS('http://www.w3.org/2000/svg','circle');
    pulse.setAttribute('cx', x); pulse.setAttribute('cy', y); pulse.setAttribute('r', '6');
    pulse.classList.add('marker-pulse');

    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', '5');
    circle.classList.add('marker-circle');

    const label = document.createElementNS('http://www.w3.org/2000/svg','text');
    label.setAttribute('x', x); label.setAttribute('y', y - 9);
    label.classList.add('marker-label');
    label.textContent = loc.flag;

    g.append(hit, pulse, circle, label);
    if (trip) g.style.cursor = 'pointer';
    g.addEventListener('mouseenter', e => {
      const hintText = loc.trips.length > 1
        ? `→ ${loc.trips.length} trips — click to choose`
        : '→ Click to view trip';
      const hint = trip ? `<p style="color:#a78bfa;margin-top:4px">${hintText}</p>` : '';
      mapTooltip.innerHTML = `<h4>${loc.flag} ${loc.name}</h4><p>${loc.label || loc.country}</p>${hint}`;
      placeInMap(mapTooltip, e);
      mapTooltip.classList.add('show');
    });
    g.addEventListener('mouseleave', () => mapTooltip.classList.remove('show'));
    g.addEventListener('click', e => {
      if (mapDragged || !trip) return; // ignore clicks that were actually drags
      mapTooltip.classList.remove('show');
      if (loc.trips.length > 1) openTripPicker(loc, e);
      else goToTrip(trip.id);
    });
    mapGroup.appendChild(g);
  });
}
renderMarkers();

// ---- ZOOM/PAN ----
// Visible map window in user units (matches the SVG viewBox "0 110 2000 720")
const MIN_ZOOM = 1, MAX_ZOOM = 6;
const VB = { x: 0, y: 110, w: 2000, h: 720, fullW: 2000, fullH: 1000 };
const worldMap = document.getElementById('worldMap');
let zoom = 1, panX = 0, panY = 0, isPanning = false, startVB, startPan, mapDragged = false;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const mapIsFs = () => !!(mapContainer && mapContainer.classList.contains('map-fs'));

// Screen↔viewBox mapping is constant unless the container resizes, so cache it and only
// refresh on resize / full-screen toggle / at the start of a gesture — never per frame.
let mapCTMInv = null, visW = { x: VB.x, y: VB.y, w: VB.w, h: VB.h };
function refreshMapCTM() {
  const ctm = worldMap.getScreenCTM();
  if (!ctm) return;
  mapCTMInv = ctm.inverse();
  const b = mapContainer.getBoundingClientRect();
  const tl = new DOMPoint(b.left, b.top).matrixTransform(mapCTMInv);
  const br = new DOMPoint(b.right, b.bottom).matrixTransform(mapCTMInv);
  visW = { x: tl.x, y: tl.y, w: br.x - tl.x, h: br.y - tl.y };
}
// Map a client (screen) point into SVG user coordinates (the space pan/scale live in)
function clientToVB(clientX, clientY) {
  if (!mapCTMInv) refreshMapCTM();
  const pt = worldMap.createSVGPoint();
  pt.x = clientX; pt.y = clientY;
  return mapCTMInv ? pt.matrixTransform(mapCTMInv) : { x: clientX, y: clientY };
}

function applyTransform(animate) {
  closePicker(); // the picker is anchored to a screen point, not to the map
  // Keep the content (0..fullW / 0..fullH) covering the actually-visible window
  panX = clamp(panX, visW.x + visW.w - VB.fullW * zoom, visW.x);
  panY = clamp(panY, visW.y + visW.h - VB.fullH * zoom, visW.y);
  mapGroup.style.transition = animate ? 'transform .24s cubic-bezier(.22,1,.36,1)' : 'none';
  mapGroup.setAttribute('transform', `translate(${panX},${panY}) scale(${zoom})`);
  // Embedded + zoom 1: let a swipe scroll the page. Zoomed in or full-screen: capture the gesture.
  if (mapContainer) mapContainer.style.touchAction = (mapIsFs() || zoom > 1) ? 'none' : 'pan-y';
}

// ---- pan momentum ----
let flingId = 0, velX = 0, velY = 0, velT = 0, velPX = 0, velPY = 0;
function cancelFling() { if (flingId) cancelAnimationFrame(flingId); flingId = 0; }
function primeVelocity() { velT = performance.now(); velPX = panX; velPY = panY; velX = velY = 0; }
function trackVelocity() {
  const now = performance.now(), dt = now - velT;
  if (dt > 0 && dt < 120) { velX = (panX - velPX) / dt; velY = (panY - velPY) / dt; }
  velT = now; velPX = panX; velPY = panY;
}
function startFling() {
  if (Math.hypot(velX, velY) < 0.03) return; // released too slowly to fling
  let prev = performance.now();
  const step = () => {
    const now = performance.now(), dt = Math.min(now - prev, 32); prev = now;
    const bx = panX, by = panY;
    panX += velX * dt; panY += velY * dt;
    applyTransform();
    if (panX === bx) velX = 0;                 // hit an edge → kill that axis
    if (panY === by) velY = 0;
    const k = Math.pow(0.94, dt / 16);
    velX *= k; velY *= k;
    flingId = Math.hypot(velX, velY) > 0.004 ? requestAnimationFrame(step) : 0;
  };
  flingId = requestAnimationFrame(step);
}

// Zoom toward a fixed point U (in SVG user coords) so it stays under the cursor
function zoomTo(newZoom, U, animate) {
  newZoom = clamp(newZoom, MIN_ZOOM, MAX_ZOOM);
  if (newZoom === zoom) return;
  cancelFling();
  panX = U.x - (U.x - panX) / zoom * newZoom;
  panY = U.y - (U.y - panY) / zoom * newZoom;
  zoom = newZoom;
  applyTransform(animate);
}

const center = () => ({ x: VB.x + VB.w / 2, y: VB.y + VB.h / 2 });

document.getElementById('zoomIn')?.addEventListener('click', () => zoomTo(zoom * 1.5, center(), true));
document.getElementById('zoomOut')?.addEventListener('click', () => zoomTo(zoom / 1.5, center(), true));
document.getElementById('resetZoom')?.addEventListener('click', () => { cancelFling(); zoom = 1; panX = 0; panY = 0; applyTransform(true); });
addEventListener('resize', () => { cancelFling(); refreshMapCTM(); applyTransform(); });
refreshMapCTM();   // prime the screen mapping once at startup

// ---- MAP FULLSCREEN ----
const mapFsBtn = document.getElementById('mapFsBtn');
const FS_EXPAND = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
const FS_CLOSE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
function toggleMapFs(force) {
  const on = force != null ? force : !mapContainer.classList.contains('map-fs');
  mapContainer.classList.toggle('map-fs', on);
  document.body.classList.toggle('map-fs-open', on);
  if (mapFsBtn) mapFsBtn.innerHTML = on ? FS_CLOSE : FS_EXPAND;
  cancelFling();
  zoom = 1; panX = 0; panY = 0;
  // container size changed → recompute the screen mapping once layout settles, then re-fit
  requestAnimationFrame(() => { refreshMapCTM(); applyTransform(); });
}
mapFsBtn?.addEventListener('click', () => toggleMapFs());
document.addEventListener('keydown', e => { if (e.key === 'Escape' && mapContainer?.classList.contains('map-fs')) toggleMapFs(false); });

// ---- MAP: tap a grey country → start an Add Trip for the nearest known country ----
const unproject = (x, y) => ({ lng: x / 2000 * 360 - 180, lat: 90 - y / 1000 * 180 });
function clientToPath(cx, cy) {
  const pt = worldMap.createSVGPoint();
  pt.x = cx; pt.y = cy;
  return pt.matrixTransform(mapGroup.getScreenCTM().inverse());
}
function nearestKnownCountry(lat, lng) {
  let best = '', bestD = Infinity;
  for (const [name, g] of Object.entries(GAZ_C)) {
    if (g.lat == null) continue;
    const d = haversine(lat, lng, g.lat, g.lng);
    if (d < bestD) { bestD = d; best = name; }
  }
  return bestD < 2800 ? best : '';
}
function countryAtEvent(e) {
  const t = e.target;
  if (!t.classList || !t.classList.contains('country') || t.classList.contains('visited')) return '';
  const p = clientToPath(e.clientX, e.clientY);
  const { lat, lng } = unproject(p.x, p.y);
  return nearestKnownCountry(lat, lng);
}
function openAddTripForCountry(country) {
  if (!country) return;
  if (mapContainer?.classList.contains('map-fs')) toggleMapFs(false);
  switchTab('add');
  renderManual();
  const cf = document.querySelector('#manualForm [name="country"]');
  const nf = document.querySelector('#manualForm [name="name"]');
  if (cf) { cf.value = country; cf.dispatchEvent(new Event('input', { bubbles: true })); }
  if (nf && !nf.value.trim()) nf.value = country;
}
const onPhone = () => matchMedia('(max-width:768px)').matches;
mapContainer?.addEventListener('click', e => {
  if (mapDragged || e.target.closest('.zoom-controls') || e.target.closest('.map-fs-btn') || e.target.closest('#tripPicker')) return;
  // Phone: the embedded map is a preview — a tap opens it full-screen (markers still open the trip)
  if (onPhone() && !mapIsFs()) { if (!e.target.closest('.marker-group')) toggleMapFs(true); return; }
  if (e.target.closest('.marker-group')) return;
  openAddTripForCountry(countryAtEvent(e));
});
mapGroup?.addEventListener('mouseover', e => {
  if (isPanning) return;
  const c = countryAtEvent(e);
  if (!c) return;
  mapTooltip.innerHTML = `<h4>＋ Add a trip</h4><p>${flagFor(c)} ${c}</p>`;
  placeInMap(mapTooltip, e);
  mapTooltip.classList.add('show');
});
mapGroup?.addEventListener('mouseout', e => {
  if (e.target.classList && e.target.classList.contains('country') && !e.target.classList.contains('visited')) mapTooltip.classList.remove('show');
});

mapContainer?.addEventListener('mousedown', e => {
  if (e.target.closest('.zoom-controls') || e.target.closest('.map-fs-btn') || e.target.closest('#tripPicker')) return;
  cancelFling();
  refreshMapCTM();
  isPanning = true;
  mapDragged = false;
  startVB = clientToVB(e.clientX, e.clientY);
  startPan = { x: panX, y: panY };
  primeVelocity();
  mapContainer.classList.add('grabbing');
});
mapContainer?.addEventListener('mousemove', e => {
  if (!isPanning) return;
  const cur = clientToVB(e.clientX, e.clientY);
  if (Math.abs(cur.x - startVB.x) > 6 || Math.abs(cur.y - startVB.y) > 6) mapDragged = true;
  panX = startPan.x + (cur.x - startVB.x);
  panY = startPan.y + (cur.y - startVB.y);
  applyTransform();
  trackVelocity();
});
['mouseup','mouseleave'].forEach(ev => mapContainer?.addEventListener(ev, () => {
  if (isPanning && mapDragged) startFling();
  isPanning = false; mapContainer.classList.remove('grabbing');
}));
mapContainer?.addEventListener('wheel', e => {
  if (e.ctrlKey) {
    // Pinch-to-zoom (trackpad) or ctrl + wheel — zoom toward the cursor
    e.preventDefault();
    zoomTo(zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08), clientToVB(e.clientX, e.clientY));
    return;
  }
  // Embedded at default zoom: let the wheel scroll the page. Full-screen always pans.
  if (zoom <= 1 && !mapIsFs()) return;
  // Zoomed in: two-finger scroll / mouse wheel pans the map (px delta → user units)
  e.preventDefault();
  cancelFling();
  if (!mapCTMInv) refreshMapCTM();
  const perPx = mapCTMInv ? mapCTMInv.a : 1;
  panX -= e.deltaX * perPx;
  panY -= e.deltaY * perPx;
  applyTransform();
}, { passive: false });

// ---- MAP TOUCH — one finger pans, two fingers pinch-zoom ----
let pinchDist = 0, pinchMid = null;
const tDist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
const tMid = t => ({ x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 });

mapContainer?.addEventListener('touchstart', e => {
  if (e.target.closest('.zoom-controls') || e.target.closest('.map-fs-btn') || e.target.closest('#tripPicker')) return;
  const t = e.touches;
  cancelFling();
  refreshMapCTM();
  mapDragged = false;
  if (t.length === 1) {
    isPanning = mapIsFs() || zoom > 1; // embedded at zoom 1 stays locked so the page can scroll
    startVB = clientToVB(t[0].clientX, t[0].clientY);
    startPan = { x: panX, y: panY };
    primeVelocity();
  } else if (t.length >= 2) {
    isPanning = false;
    pinchDist = tDist(t);
    const m = tMid(t);
    pinchMid = clientToVB(m.x, m.y);
  }
}, { passive: true });

mapContainer?.addEventListener('touchmove', e => {
  const t = e.touches;
  if (t.length === 1 && isPanning) {
    e.preventDefault();
    const cur = clientToVB(t[0].clientX, t[0].clientY);
    if (Math.abs(cur.x - startVB.x) > 6 || Math.abs(cur.y - startVB.y) > 6) mapDragged = true;
    panX = startPan.x + (cur.x - startVB.x);
    panY = startPan.y + (cur.y - startVB.y);
    applyTransform();
    trackVelocity();
  } else if (t.length >= 2 && pinchDist) {
    e.preventDefault();
    const d = tDist(t);
    if (d > 0) { zoomTo(zoom * (d / pinchDist), pinchMid); pinchDist = d; }
    const m = tMid(t);
    pinchMid = clientToVB(m.x, m.y);
    mapDragged = true;
  }
}, { passive: false });

function endMapTouch(e) {
  const t = e.touches;
  if (!t || t.length === 0) {
    if (isPanning && mapDragged) startFling();
    isPanning = false; pinchDist = 0; pinchMid = null;
  } else if (t.length === 1) {
    isPanning = mapIsFs() || zoom > 1; pinchDist = 0;
    startVB = clientToVB(t[0].clientX, t[0].clientY);
    startPan = { x: panX, y: panY };
    primeVelocity();
  }
}
mapContainer?.addEventListener('touchend', endMapTouch);
mapContainer?.addEventListener('touchcancel', endMapTouch);

// ---- SIDEBAR TOGGLE ----
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');
document.getElementById('sidebarToggle').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('collapsed');
});

// ---- TABS ----
const switchTab = (tabId) => {
  const wasActive = document.getElementById(tabId)?.classList.contains('active');
  document.querySelectorAll('.sidebar-icon').forEach(i => i.classList.toggle('active', i.getAttribute('data-tab') === tabId));
  document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  const tab = document.getElementById(tabId);
  if (tab) tab.classList.add('active');
  // Entering the Add Trip tab fresh always lands on the upload screen
  if (tabId === 'add' && !wasActive && typeof renderAddEmpty === 'function') renderAddEmpty();
};

document.querySelectorAll('.sidebar-icon').forEach(icon => {
  icon.addEventListener('click', () => switchTab(icon.getAttribute('data-tab')));
});

document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
});

// ---- TRIPS DISPLAY ----
const regionKeys = ['all','america','europe','argentina','asia','africa'];

const updateTripsDisplay = () => {
  const counts = {};
  regionKeys.forEach(r => { counts[r] = 0; });

  document.querySelectorAll('#tripsGrid .trip-card').forEach(c => {
    const m = c.getAttribute('data-mode');
    const r = c.getAttribute('data-region');
    const passesMode = currentMode === 'all' || m === currentMode || (currentMode === 'girlfriend' && m === 'girlfriend');
    const passesRegion = currentRegion === 'all' || r === currentRegion;
    const visible = passesMode && passesRegion;
    c.style.display = visible ? (tripsGrid.classList.contains('list-view') ? 'flex' : 'block') : 'none';
    if (passesMode) {
      counts['all']++;
      if (r) { counts[r] = (counts[r] || 0) + 1; }
    }
  });

  regionKeys.forEach(r => {
    const el = document.getElementById('rc-' + r);
    if (el) { el.textContent = counts[r] || 0; }
  });
};

document.querySelectorAll('.region-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentRegion = btn.getAttribute('data-region');
    document.querySelectorAll('.region-btn').forEach(b => b.classList.toggle('active', b === btn));
    updateTripsDisplay();
  });
});

// ---- TOGGLE BUTTONS ----
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.getAttribute('data-mode');
    // Sync all toggle buttons in the current tab
    const parentTab = btn.closest('.tab-content') || document;
    parentTab.querySelectorAll('.toggle-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-mode') === mode));
    applyMode(mode);
  });
});

// ---- VIEW TOGGLE ----
const tripsGrid = document.getElementById('tripsGrid');
const listHeader = document.getElementById('listHeader');

document.getElementById('viewCards').addEventListener('click', () => {
  tripsGrid.classList.remove('list-view');
  listHeader.style.display = 'none';
  document.getElementById('viewCards').classList.add('active');
  document.getElementById('viewList').classList.remove('active');
  tripsGrid.querySelectorAll('.trip-card').forEach(c => { if (c.style.display !== 'none') c.style.display = 'block'; });
});

document.getElementById('viewList').addEventListener('click', () => {
  tripsGrid.classList.add('list-view');
  listHeader.style.display = 'flex';
  document.getElementById('viewList').classList.add('active');
  document.getElementById('viewCards').classList.remove('active');
  tripsGrid.querySelectorAll('.trip-card').forEach(c => { if (c.style.display !== 'none') c.style.display = 'flex'; });
});

// ---- SORTING ----
function sortTrips(value) {
  const [key, dir] = value.split('-');
  const cards = Array.from(tripsGrid.querySelectorAll('.trip-card'));
  const val = c => { const raw = c.getAttribute('data-' + key); return key === 'date' ? raw : Number(raw); };
  cards.sort((a, b) => {
    const va = val(a), vb = val(b);
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return dir === 'asc' ? cmp : -cmp;
  });
  cards.forEach(c => tripsGrid.appendChild(c)); // appendChild moves nodes into sorted order
}

const tripSort = document.getElementById('tripSort');
tripSort?.addEventListener('change', () => sortTrips(tripSort.value));

// ---- MAP MARKER → TRIP CARD ----
function goToTrip(tripId) {
  const card = tripsGrid.querySelector(`.trip-card[data-trip="${tripId}"]`);
  if (!card) return;
  switchTab('trips');
  openFlyout(tripId); // open the detail panel straight from the map
  // Reset filters so the target card is guaranteed visible
  currentRegion = 'all';
  document.querySelectorAll('.region-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-region') === 'all'));
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-mode') === 'all'));
  applyMode('all'); // sets currentMode + refreshes trip visibility
  setTimeout(() => {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.remove('trip-target'); void card.offsetWidth; card.classList.add('trip-target');
    setTimeout(() => card.classList.remove('trip-target'), 2000);
  }, 60);
}

// ---- TRIP DETAIL FLYOUT ----
const tripFlyout = document.getElementById('tripFlyout');
const tfPanel = document.getElementById('tfPanel');
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const CAT_COLOR = { Flights:'#a78bfa', Lodging:'#ec4899', Transport:'#67e8f9', Food:'#fbbf24', Activities:'#4ade80', Other:'#a1a1aa' };
const fmtDay = iso => {
  const d = new Date((iso || '') + 'T00:00');
  return isNaN(d) ? { d: '·', m: '' } : { d: d.getDate(), m: d.toLocaleString('en-US', { month: 'short' }) };
};

function renderFlyout(t) {
  const spend = tripSpend(t);
  const perDay = spend && t.days ? money(spend / t.days) : '—';
  const hasRich = (t.stops && t.stops.length) || (t.itinerary && t.itinerary.length) || (t.expenses && t.expenses.length);

  const nCountries = new Set(t.cities.map(c => c.country)).size;
  const metrics = spend
    ? [[money(spend), 'Spent'], [perDay, 'Per day'], [t.days, 'Days'], [(t.stops || []).length || t.cities.length, (t.stops && t.stops.length) ? 'Stops' : 'Cities']]
    : [[t.days, 'Days'], [t.cities.length, t.cities.length === 1 ? 'City' : 'Cities'], [nCountries, nCountries === 1 ? 'Country' : 'Countries'], [((t.dist * 2) / 1000).toFixed(1) + 'K', 'km']];

  let html = `
    <div class="tf-head">
      <div class="tf-top">
        <div class="tf-title"><span class="tf-flag">${t.flag}</span><h2>${t.name}</h2></div>
        <button class="tf-icon-btn tf-close-x" data-tf-close aria-label="Close">&times;</button>
      </div>
      <div class="tf-meta">
        <span>${t.dateLabel}</span>
        ${t.dist ? `<span class="tf-tag" title="Estimated flying time each way · ${t.dist.toLocaleString('en-US')} km one-way">✈ ~${fmtDuration(flightHrs(t.dist))} each way</span>` : ''}
        ${t.mode === 'girlfriend' ? '' : '<span class="tf-tag">Solo</span>'}
      </div>
    </div>
    <div class="tf-body">
      <section><div class="tf-metrics">${metrics.map(([v, l]) => `<div class="tf-metric"><div class="tf-m-v">${v}</div><div class="tf-m-l">${l}</div></div>`).join('')}</div></section>`;

  if (t.highlights && t.highlights.length) {
    html += `<section><div class="tf-s-label">Highlights</div>${t.highlights.map(([i, x]) => `<div class="tf-hl"><span>${i}</span><span>${x}</span></div>`).join('')}</section>`;
  }

  if (t.stops && t.stops.length) {
    html += `<section><div class="tf-s-label">Route</div><div class="tf-route">${t.stops.map(s => `
      <div class="tf-stop">
        <div class="tf-st-h"><span class="tf-st-name">${s.place}</span><span class="tf-st-nights">${s.nights} night${s.nights === 1 ? '' : 's'}</span></div>
        ${s.lodging ? `<div class="tf-st-sub">${s.lodging.name}${s.lodging.address ? ' · ' + s.lodging.address : ''}</div>` : ''}
        ${s.transfer ? `<div class="tf-st-transfer">${s.transfer}</div>` : ''}
      </div>`).join('')}</div></section>`;
  }

  if (t.expenses && t.expenses.length) {
    const byCat = {};
    t.expenses.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + Number(e.amount || 0); });
    const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    html += `<section><div class="tf-s-label">Budget</div>
      <div class="tf-bar">${cats.map(([c, v]) => `<i style="width:${(v / spend * 100).toFixed(1)}%;background:${CAT_COLOR[c] || CAT_COLOR.Other}"></i>`).join('')}</div>
      <div class="tf-bar-key">${cats.map(([c, v]) => `<span><i style="background:${CAT_COLOR[c] || CAT_COLOR.Other}"></i>${c} ${money(v)}</span>`).join('')}</div>
      <div class="tf-lines">
        ${t.expenses.map(e => `<div class="tf-li"><div class="tf-li-main"><b>${e.label}</b><span>${e.category}</span></div><span class="tf-li-amt">${money(e.amount)}</span></div>`).join('')}
        <div class="tf-li tf-total"><div class="tf-li-main"><b>Total</b></div><span class="tf-li-amt">${money(spend)}</span></div>
      </div>
      ${t.budget ? `<div class="tf-st-transfer" style="margin-top:10px">Planned budget ${money(t.budget)} · ${spend <= t.budget ? money(t.budget - spend) + ' under' : money(spend - t.budget) + ' over'}</div>` : ''}
    </section>`;
  }

  if (t.itinerary && t.itinerary.length) {
    html += `<section><div class="tf-s-label">Day by day</div>${t.itinerary.map(d => {
      const f = fmtDay(d.date);
      return `<div class="tf-day"><div class="tf-d-date"><b>${f.d}</b><span>${f.m}</span></div><div class="tf-d-body"><div class="tf-d-place">${d.place}</div><div class="tf-d-text">${d.text}</div>${d.note ? `<span class="tf-d-note">${d.note}</span>` : ''}</div></div>`;
    }).join('')}</section>`;
  }

  const stays = (t.stops || []).filter(s => s.lodging);
  if (stays.length) {
    html += `<section><div class="tf-s-label">Stays</div>${stays.map(s => {
      const l = s.lodging;
      return `<div class="tf-stay"><div class="tf-sy-h"><span class="tf-badge">${l.type || 'stay'}</span><span class="tf-sy-name">${l.name}</span>${l.cost ? `<span class="tf-sy-amt">${money(l.cost)}</span>` : ''}</div><div class="tf-sy-sub">${s.place} · ${s.nights} night${s.nights === 1 ? '' : 's'}${l.address ? ' · ' + l.address : ''}${l.confirmation ? ' · conf. ' + l.confirmation : ''}</div></div>`;
    }).join('')}</section>`;
  }

  if (t.transport && t.transport.length) {
    html += `<section><div class="tf-s-label">Getting around</div>${t.transport.map(m => `<div class="tf-move"><span class="tf-mv-ico">${m.mode || '•'}</span><div class="tf-mv-main"><b>${m.label}</b>${m.detail ? `<span>${m.detail}</span>` : ''}</div></div>`).join('')}</section>`;
  }

  const eats = (t.stops || []).filter(s => s.eat && s.eat.length);
  if (eats.length) {
    html += `<section><div class="tf-s-label">Where to eat</div>${eats.map(s => `<div class="tf-eat"><div class="tf-eg-l">${s.place}</div><div class="tf-chips">${s.eat.map(n => `<span class="tf-chip">${n}</span>`).join('')}</div></div>`).join('')}</section>`;
  }

  if (t.notes) html += `<section><div class="tf-empty">${t.notes}</div></section>`;
  if (!hasRich) html += `<section><div class="tf-empty">No detailed itinerary yet. Import an Excel or add stops, budget and day-by-day plans to see the full breakdown here.</div></section>`;

  html += `</div><div class="tf-foot">
    <button class="tf-btn tf-primary" data-tf-edit>Edit</button>
    <button class="tf-btn tf-danger" data-tf-del>Delete</button>
  </div>`;
  tfPanel.innerHTML = html;
}

function openFlyout(id) {
  const t = trips.find(x => x.id === id);
  if (!t) return;
  renderFlyout(t);
  tripFlyout.dataset.trip = id;
  tripFlyout.classList.add('open');
  tripFlyout.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  tfPanel.scrollTop = 0;
}
function closeFlyout() {
  tripFlyout.classList.remove('open');
  tripFlyout.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
tripFlyout.addEventListener('click', e => {
  if (e.target.classList.contains('tf-backdrop') || e.target.closest('[data-tf-close]')) { closeFlyout(); return; }
  const id = tripFlyout.dataset.trip;
  if (e.target.closest('[data-tf-edit]')) {
    const t = trips.find(x => x.id === id);
    closeFlyout(); switchTab('add'); renderManual(t);
  } else if (e.target.closest('[data-tf-del]')) {
    const t = trips.find(x => x.id === id);
    if (t && confirm(`Delete "${t.name}"? This can't be undone.`)) {
      trips.splice(trips.findIndex(x => x.id === id), 1);
      saveTrips(); refreshAll(); closeFlyout();
    }
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && tripFlyout.classList.contains('open')) closeFlyout(); });
tripsGrid.addEventListener('click', e => {
  const card = e.target.closest('.trip-card');
  if (card && card.dataset.trip) openFlyout(card.dataset.trip);
});

// ---- ADD TRIP: geocoding helpers ----
const _C = {
  'Argentina':['AR',-38.4,-63.6,'South America'],'Brazil':['BR',-14.2,-51.9,'South America'],
  'Chile':['CL',-35.7,-71.5,'South America'],'Colombia':['CO',4.6,-74.3,'South America'],
  'Peru':['PE',-9.2,-75.0,'South America'],'Uruguay':['UY',-32.5,-55.8,'South America'],
  'Bolivia':['BO',-16.3,-63.6,'South America'],'Ecuador':['EC',-1.8,-78.2,'South America'],
  'Paraguay':['PY',-23.4,-58.4,'South America'],'Costa Rica':['CR',9.75,-83.75,'North America'],
  'Mexico':['MX',23.6,-102.6,'North America'],'Panama':['PA',8.5,-80.8,'North America'],
  'Guatemala':['GT',15.8,-90.2,'North America'],'Cuba':['CU',21.5,-77.8,'North America'],
  'United States':['US',39.8,-98.6,'North America'],'Canada':['CA',56.1,-106.3,'North America'],
  'Spain':['ES',40.4,-3.7,'Europe'],'Portugal':['PT',39.4,-8.2,'Europe'],'France':['FR',46.6,2.2,'Europe'],
  'Italy':['IT',41.9,12.6,'Europe'],'Germany':['DE',51.2,10.4,'Europe'],'United Kingdom':['GB',54.5,-3.4,'Europe'],
  'Netherlands':['NL',52.1,5.3,'Europe'],'Belgium':['BE',50.6,4.7,'Europe'],'Switzerland':['CH',46.8,8.2,'Europe'],
  'Austria':['AT',47.6,14.1,'Europe'],'Greece':['GR',39.1,21.8,'Europe'],'Croatia':['HR',45.1,15.2,'Europe'],
  'Poland':['PL',51.9,19.1,'Europe'],'Czechia':['CZ',49.8,15.5,'Europe'],'Hungary':['HU',47.2,19.5,'Europe'],
  'Ireland':['IE',53.4,-8.2,'Europe'],'Iceland':['IS',64.9,-19.0,'Europe'],'Norway':['NO',60.5,8.5,'Europe'],
  'Sweden':['SE',60.1,18.6,'Europe'],'Denmark':['DK',56.3,9.5,'Europe'],'Finland':['FI',61.9,25.7,'Europe'],
  'Turkey':['TR',39.0,35.2,'Asia'],'Morocco':['MA',31.8,-7.1,'Africa'],'Egypt':['EG',26.8,30.8,'Africa'],
  'South Africa':['ZA',-30.6,22.9,'Africa'],'Kenya':['KE',0.2,37.9,'Africa'],'Tanzania':['TZ',-6.4,34.9,'Africa'],
  'Thailand':['TH',15.9,100.9,'Asia'],'Vietnam':['VN',14.1,108.3,'Asia'],'Cambodia':['KH',12.6,104.9,'Asia'],
  'Indonesia':['ID',-2.5,118.0,'Asia'],'Japan':['JP',36.2,138.3,'Asia'],'China':['CN',35.9,104.2,'Asia'],
  'India':['IN',20.6,79.0,'Asia'],'United Arab Emirates':['AE',24.0,54.0,'Asia'],'Israel':['IL',31.0,34.9,'Asia'],
  'Jordan':['JO',30.6,36.2,'Asia'],'Australia':['AU',-25.3,133.8,'Oceania'],'New Zealand':['NZ',-41.0,174.0,'Oceania']
};
const GAZ_C = {}; Object.entries(_C).forEach(([k,v]) => GAZ_C[k] = { iso:v[0], lat:v[1], lng:v[2], cont:v[3] });
const _P = {
  'la fortuna':['Costa Rica',10.47,-84.64],'monteverde':['Costa Rica',10.30,-84.82],'santa elena':['Costa Rica',10.31,-84.82],
  'manuel antonio':['Costa Rica',9.39,-84.14],'quepos':['Costa Rica',9.43,-84.16],'san jose':['Costa Rica',9.93,-84.08],
  'tamarindo':['Costa Rica',10.30,-85.84],'liberia':['Costa Rica',10.63,-85.44],'la paz':['Bolivia',-16.5,-68.15],
  'cusco':['Peru',-13.53,-71.97],'lima':['Peru',-12.05,-77.04],'cartagena':['Colombia',10.39,-75.51],
  'bogota':['Colombia',4.71,-74.07],'medellin':['Colombia',6.24,-75.57],'paris':['France',48.86,2.35],
  'london':['United Kingdom',51.51,-0.13],'rome':['Italy',41.90,12.50],'madrid':['Spain',40.42,-3.70],
  'barcelona':['Spain',41.39,2.17],'lisbon':['Portugal',38.72,-9.14],'amsterdam':['Netherlands',52.37,4.90],
  'tokyo':['Japan',35.68,139.69],'kyoto':['Japan',35.01,135.77],'bangkok':['Thailand',13.75,100.50],
  'new york':['United States',40.71,-74.01],'los angeles':['United States',34.05,-118.24],'miami':['United States',25.76,-80.19]
};
const GAZ_P = {}; Object.entries(_P).forEach(([k,v]) => GAZ_P[k] = { country:v[0], lat:v[1], lng:v[2] });

const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const p2 = n => String(n).padStart(2, '0');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'trip';
function uniqueId(base) { let id = base, n = 2; while (trips.some(t => t.id === id)) id = base + '-' + n++; return id; }
function flagFor(country) { const iso = (GAZ_C[country] || {}).iso; return iso ? iso.replace(/./g, c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))) : '🌍'; }
// Learn every place already logged (name -> country + coords) so future imports resolve on their own.
// Also index each half of a combined name ("Jujuy / Purmamarca" -> "jujuy", "purmamarca").
trips.forEach(t => (t.cities || []).forEach(c => {
  [c.name, ...String(c.name).split(/\s*[/&+]\s*| y | e /i)].forEach(nm => {
    const k = norm(nm);
    if (k && !GAZ_P[k]) GAZ_P[k] = { country: c.country, lat: c.lat, lng: c.lng };
  });
}));
// "Salta & Jujuy", "Kraków + Vienna", "Lima / Cusco", "Bariloche y El Bolsón" -> ["Salta", "Jujuy"].
// Only trusted when a token is a known place, so "Rest & Relax" stays a single name.
function placesFromName(name) {
  const parts = String(name || '').split(/\s*(?:&|\+|\/|·|—|–|,| y | e | and )\s*/i)
    .map(s => cleanImported(s).trim()).filter(Boolean);
  if (parts.length < 2 || parts.length > 4) return [];
  return parts.some(p => GAZ_P[norm(p)] || GAZ_C[p]) ? parts : [];
}
const ISO_TO_COUNTRY = {}; Object.entries(GAZ_C).forEach(([n, v]) => { ISO_TO_COUNTRY[v.iso] = n; });
// Read a country out of a flag emoji embedded in text (e.g. a sheet named "Denver 🇺🇸")
function countryFromFlag(s) {
  const m = String(s || '').match(/[\u{1F1E6}-\u{1F1FF}]{2}/u);
  if (!m) return '';
  const iso = [...m[0]].map(ch => String.fromCodePoint(ch.codePointAt(0) - 0x1F1E6 + 65)).join('');
  return ISO_TO_COUNTRY[iso] || '';
}
// Strip flags / check marks / doubled spaces out of an imported name or place
const cleanImported = s => String(s || '').replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '').replace(/[✅✔☑]️?/g, '').replace(/\s+/g, ' ').trim();
function regionForCountry(c) {
  if (c === 'Argentina') return 'argentina';
  const cont = (GAZ_C[c] || {}).cont || (COUNTRIES[c] || {}).cont || '';
  if (cont === 'Europe') return 'europe';
  if (cont === 'Asia') return 'asia';
  if (cont === 'Africa') return 'africa';
  if (cont === 'Oceania') return 'asia';
  return 'america';
}
function haversine(la1, lo1, la2, lo2) {
  const R = 6371, r = Math.PI / 180;
  const dLa = (la2 - la1) * r, dLo = (lo2 - lo1) * r;
  const x = Math.sin(dLa / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
// Length of the outbound path home → each waypoint in order (km). Return leg is added by callers via ×2.
function routeKm(pts) {
  let km = 0;
  for (let i = 1; i < pts.length; i++) km += haversine(pts[i - 1].lat, pts[i - 1].lng, pts[i].lat, pts[i].lng);
  return km;
}
// One-way block time for a flight of `km`: cruise at CRUISE_KMH + ~40 min taxi / climb / descent.
function flightHrs(km) { return km > 0 ? km / CRUISE_KMH + 0.7 : 0; }
function fmtDuration(hrs) {
  if (!hrs) return '';
  const h = Math.floor(hrs), m = Math.round((hrs - h) * 60);
  return m === 60 ? `${h + 1}h` : m ? `${h}h ${m}m` : `${h}h`;
}
const mostCommon = arr => { const m = {}; let best = arr[0], bc = 0; arr.forEach(v => { m[v] = (m[v] || 0) + 1; if (m[v] > bc) { bc = m[v]; best = v; } }); return best; };
function parseDate(s) {
  if (s == null) return null;
  s = String(s).trim(); if (!s) return null;
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (m) return `${m[1]}-${p2(m[2])}-${p2(m[3])}`;
  m = s.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})$/);
  if (m) { let yy = m[3]; if (yy.length === 2) yy = '20' + yy; return `${yy}-${p2(m[2])}-${p2(m[1])}`; }
  // Reject partial junk that Date would happily invent a day for: bare years ("2025"),
  // year-month ("2025-05"), Excel serial numbers, plain numbers
  if (/^\d+$/.test(s) || /^\d{4}[-/]\d{1,2}$/.test(s)) return null;
  // Only trust free text if it actually names a month
  if (!/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|ene|abr|ago|dic)/i.test(s)) return null;
  const d = new Date(s);
  return isNaN(d) ? null : d.toISOString().slice(0, 10);
}
function parseAmount(s) {
  if (s == null) return null;
  let x = String(s).trim().replace(/[^\d.,-]/g, '');
  if (!x) return null;
  if (/,\d{1,2}$/.test(x) && !/\.\d/.test(x)) x = x.replace(/\./g, '').replace(',', '.');
  else x = x.replace(/,/g, '');
  const n = parseFloat(x);
  return isFinite(n) ? n : null;
}
const splitList = s => String(s || '').split(/[,;\n]+/).map(x => x.trim()).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
const guessType = s => /airbnb/i.test(s) ? 'airbnb' : /hostel|hoster/i.test(s) ? 'hostel' : /hotel|inn|resort|lodge/i.test(s) ? 'hotel' : /amig|friend|family|casa/i.test(s) ? 'friends' : 'stay';
const guessMode = s => /✈|avion|avión|vuelo|flight|fly|aero/i.test(s) ? '✈️' : /🚗|auto|car\b|drive|rent|taxi|uber/i.test(s) ? '🚗' : /bus|shuttle|jeep|van|combi/i.test(s) ? '🚐' : /tren|train|rail/i.test(s) ? '🚆' : /boat|ferry|barco|lancha/i.test(s) ? '⛴️' : '📍';
const guessCategory = s => /avion|avión|vuelo|flight|aero/i.test(s) ? 'Flights' : /airbnb|hotel|hostel|inn|aloj|hosp|lodg|noche/i.test(s) ? 'Lodging' : /auto|car\b|rent|taxi|bus|tren|train|transfer|shuttle|traslado|uber|nafta|gas|peaje|toll/i.test(s) ? 'Transport' : /comida|food|restau|cena|almuerzo|desayuno/i.test(s) ? 'Food' : /tour|excursion|excursión|entrada|ticket|activ|museo|parque/i.test(s) ? 'Activities' : 'Other';
function fmtRange(a, b) {
  const f = x => { const d = new Date(x + 'T00:00'); return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }); };
  return b && b !== a ? `${f(a)} – ${f(b)}` : f(a);
}

// ---- ADD TRIP: parsing ----
const KEYMAP = [
  [['fecha','date','dia','día','day'], 'date'],
  [['noches','nights','noche'], 'nights'],
  [['lugar','place','destino','ciudad','city','location'], 'place'],
  [['actividades','activities','actividad','plan','itinerario','notes','descripcion','descripción'], 'act'],
  [['hospedaje','alojamiento','lodging','hotel','stay'], 'lodging'],
  [['gastronomia','gastronomía','comida','food','restaurantes','restaurants','eat'], 'food'],
  [['traslado','transporte','transport','movilidad'], 'transport'],
  [['costo','cost','gasto','concepto','item','expense'], 'costlabel'],
  [['usd','monto','amount','precio','price','valor','ars','eur'], 'amount']
];
function canonKey(h) {
  const n = norm(h);
  for (const [alts, k] of KEYMAP) if (alts.some(a => n === a || n.includes(a))) return k;
  return '';
}
function csvToMatrix(text) {
  const rows = []; let row = [], cell = '', q = false;
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
function matrixToDraft(matrix, sheetName) {
  const rows = matrix.filter(r => r && r.some(c => String(c == null ? '' : c).trim() !== ''));
  if (rows.length < 2) return null;
  const header = rows[0].map(canonKey);
  if (!header.includes('place') && !header.includes('act') && !header.includes('date')) return null;
  const objs = rows.slice(1).map(r => {
    const o = {}; header.forEach((k, i) => { if (k) o[k] = (r[i] == null ? '' : String(r[i])).trim(); });
    return o;
  });
  return rowsToDraft(objs, sheetName);
}
function rowsToDraft(objs, name) {
  const d = { name: cleanImported(name) || 'Trip', places: [], stops: [], itinerary: [], expenses: [], transport: [] };
  let flagHint = countryFromFlag(name);
  const stopByPlace = {}; let cur = null; const dates = [];
  objs.forEach(o => {
    const iso = parseDate(o.date);
    if (iso) dates.push(iso);
    if (!flagHint) flagHint = countryFromFlag(o.place) || countryFromFlag(o.act);
    const place = cleanImported(o.place);
    if (place) {
      cur = stopByPlace[norm(place)];
      if (!cur) { cur = { place, nights: 0, eat: [] }; stopByPlace[norm(place)] = cur; d.stops.push(cur); d.places.push(place); }
    }
    const n = parseInt(o.nights, 10);
    if (cur && !cur.nights && n) cur.nights = n;
    if (cur && o.lodging && !cur.lodging) cur.lodging = { name: o.lodging, type: guessType(o.lodging) };
    if (cur && o.transport && !cur.transfer) cur.transfer = o.transport;
    if (o.transport) d.transport.push({ mode: guessMode(o.transport), label: o.transport, detail: place || '' });
    if (cur && o.food) splitList(o.food).forEach(x => { if (!cur.eat.includes(x)) cur.eat.push(x); });
    if (o.act) d.itinerary.push({ date: iso || '', place: (cur && cur.place) || place || 'Travel', text: o.act });
    const amt = parseAmount(o.amount), lbl = (o.costlabel || '').trim();
    if (amt != null && lbl && norm(lbl) !== 'total') d.expenses.push({ category: guessCategory(lbl), label: lbl, amount: amt });
    else if (amt != null && !lbl && (o.act || '').trim()) d.expenses.push({ category: 'Other', label: o.act.slice(0, 40), amount: amt });
  });
  d.stops.forEach(s => { if (!s.nights) s.nights = Math.max(1, d.itinerary.filter(it => norm(it.place) === norm(s.place)).length); });
  d.stops.forEach(s => { if (!s.eat.length) delete s.eat; });
  const sorted = dates.slice().sort();
  if (sorted.length) { d.startDate = sorted[0]; d.endDate = sorted[sorted.length - 1]; }
  const span = (d.startDate && d.endDate) ? Math.round((new Date(d.endDate) - new Date(d.startDate)) / 864e5) + 1 : 0;
  const fromRows = d.itinerary.length || d.stops.reduce((a, s) => a + (s.nights || 0), 0);
  // Trust the date span only if it's a plausible trip length; a stray booking/year cell can blow it up
  d.days = (span >= 1 && span <= 45) ? span : (fromRows || span || 1);
  if (span > 45) d._dateSpanOff = true;
  if (!d.places.length) {
    const split = placesFromName(d.name);
    if (split.length) { d.places.push(...split); d._namesFromTitle = true; }
    else d.places.push(d.name);
  }
  d._flagCountry = flagHint || '';
  return d;
}
function finalizeTrip(d, opts) {
  const gf = opts.mode === 'girlfriend';
  const coords = opts.coords || {};
  const builtFromStops = !!(d.stops && d.stops.length);
  // Editing a trip whose places weren't re-entered as stops: keep its existing cities
  // (real names + coords) instead of collapsing them to one entry from the trip name.
  const cities = (!builtFromStops && opts.existingCities && opts.existingCities.length)
    ? opts.existingCities
    : d.places.map(p => {
      const country = opts.placeCountry[p] || '';
      const ov = coords[p], g = GAZ_P[norm(p)] || {}, cc = GAZ_C[country] || {};
      return {
        name: p, country,
        lat: ov ? ov[0] : (g.lat != null ? g.lat : (cc.lat || 0)),
        lng: ov ? ov[1] : (g.lng != null ? g.lng : (cc.lng || 0)),
        flag: flagFor(country)
      };
    });
  const primary = mostCommon(cities.map(c => c.country)) || (cities[0] || {}).country || '';
  const pc0 = cities.find(c => c.country === primary) || cities[0] || { lat: 0, lng: 0 };
  // Outbound path: home → every stop in route order (inter-city hops included), not just home → main city.
  const geoPath = [HOME_BASE, ...cities.filter(c => c.lat || c.lng)];
  const dist = Math.round(routeKm(geoPath))
    || Math.round(haversine(HOME_BASE.lat, HOME_BASE.lng, pc0.lat, pc0.lng)) || 1000;
  const spend = (d.expenses || []).reduce((s, e) => s + (+e.amount || 0), 0);
  const days = d.days || d.itinerary?.length || 1;
  const label = (d.startDate ? fmtRange(d.startDate, d.endDate) : d.name) + (gf ? ' · With GF 💕' : '');
  const nStops = (d.stops && d.stops.length) || cities.length;
  const stats = spend
    ? [['$days', 'Days'], [String(nStops), nStops === 1 ? 'Stop' : 'Stops'], ['$spend', 'Spent']]
    : [['$days', 'Days'], [String(cities.length), cities.length === 1 ? 'City' : 'Cities'], [(dist * 2 / 1000).toFixed(1) + 'K', 'km']];
  return {
    id: opts.editId || uniqueId(slug(opts.name) + (d.startDate ? '-' + d.startDate.slice(0, 4) : '')),
    name: opts.name, flag: flagFor(primary), mode: gf ? 'girlfriend' : 'solo', region: regionForCountry(primary),
    date: d.startDate || '2099-01-01', dateLabel: label,
    startDate: d.startDate || undefined, endDate: d.endDate || undefined,
    days, dist, currency: 'USD',
    stats,
    highlights: (opts.highlights && opts.highlights.length)
      ? opts.highlights
      : (d.stops || []).slice(0, 3).map(s => ['📍', s.place]),
    cities,
    stops: d.stops && d.stops.length ? d.stops : undefined,
    itinerary: d.itinerary && d.itinerary.length ? d.itinerary : undefined,
    expenses: d.expenses && d.expenses.length ? d.expenses : undefined,
    transport: d.transport && d.transport.length ? d.transport : undefined,
    notes: d.notes || undefined
  };
}

// ---- ADD TRIP: file intake ----
let _xlsxP;
function loadXLSX() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  if (_xlsxP) return _xlsxP;
  _xlsxP = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = () => res(window.XLSX);
    s.onerror = () => rej(new Error('Could not load the Excel reader (offline?). Save the sheet as CSV and try that.'));
    document.head.appendChild(s);
  });
  return _xlsxP;
}
function handleFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'csv') {
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = matrixToDraft(csvToMatrix(r.result), file.name.replace(/\.csv$/i, ''));
        if (!d) throw new Error('Could not find a header row (Fecha, Lugar, Actividades…) in that CSV.');
        showReview([d], file.name);
      } catch (e) { renderAddEmpty(); addMsg('err', e.message); }
    };
    r.readAsText(file);
  } else if (ext === 'xlsx' || ext === 'xls') {
    loadXLSX().then(XLSX => {
      const r = new FileReader();
      r.onload = () => {
        try {
          const wb = XLSX.read(r.result, { type: 'array' });
          const drafts = wb.SheetNames
            .map(nm => matrixToDraft(XLSX.utils.sheet_to_json(wb.Sheets[nm], { header: 1, raw: false, blankrows: false }), nm))
            .filter(Boolean);
          if (!drafts.length) throw new Error('No trips found. Each sheet needs a header row and at least one data row.');
          showReview(drafts, file.name);
        } catch (e) { renderAddEmpty(); addMsg('err', e.message); }
      };
      r.readAsArrayBuffer(file);
    }).catch(e => { renderAddEmpty(); addMsg('err', e.message); });
  } else {
    addMsg('err', 'Please choose a .xlsx or .csv file.');
  }
}

// ---- ADD TRIP: views ----
const addRoot = document.getElementById('addRoot');
const dataInput = Object.assign(document.createElement('input'), { type: 'file', accept: '.xlsx,.xls,.csv' });
const jsonInput = Object.assign(document.createElement('input'), { type: 'file', accept: '.json,application/json' });
[dataInput, jsonInput].forEach(i => { i.style.display = 'none'; document.body.appendChild(i); });
dataInput.addEventListener('change', () => { if (dataInput.files[0]) handleFile(dataInput.files[0]); dataInput.value = ''; });
jsonInput.addEventListener('change', () => { if (jsonInput.files[0]) importJSONFile(jsonInput.files[0]); jsonInput.value = ''; });

function addMsg(kind, text) {
  const m = document.getElementById('addMsg');
  if (m) { m.className = 'add-msg ' + kind; m.textContent = text; }
}
const rowEl = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

function refreshAll() {
  recomputeTotals();
  renderTrips();
  renderStaticStats();
  renderBucket();
  applyMode(currentMode);
  renderMarkers();
  const s = document.getElementById('tripSort');
  if (s) sortTrips(s.value);
}

function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function downloadTemplate() {
  const rows = [
    ['Fecha', 'Noches', 'Lugar', 'Actividades', 'Hospedaje', 'Gastronomía', 'Traslado', 'Costo', 'USD'],
    ['24/12/2026', '', '', 'Fly to San José 2:00 AM', '', '', '', 'Avión', '1378'],
    ['25/12/2026', '3', 'La Fortuna', 'Arenal volcano, hot springs, La Fortuna waterfall', 'Airbnb', 'Don Rufino, Soda Viquez', '', 'Airbnb', '321'],
    ['27/12/2026', '3', 'Monteverde', 'Cloud forest reserve, hanging bridges, coffee tour', 'Airbnb Santa Elena', 'Soda La Salvadita, Morphos', 'Jeep–boat–jeep from La Fortuna', 'Airbnb', '463'],
    ['30/12/2026', '3', 'Manuel Antonio', 'Playa Espadilla, Playa Biesanz', 'Hotel Las Cascadas', 'Rico Tico, Oceano', 'Rental car (Adobe)', 'Auto', '563'],
    ['02/01/2027', '1', 'San José', 'Mercado Central, Barrio Amón', 'Sleep Inn', '', '3 h drive from Manuel Antonio', 'Hotel', '85'],
    ['03/01/2027', '', '', 'Departure 10:00 AM', '', '', '', '', '']
  ];
  const csv = rows.map(r => r.map(c => /[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c).join(',')).join('\r\n');
  downloadBlob(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), 'trip-template.csv');
}
function exportJSON() {
  downloadBlob(new Blob([JSON.stringify(trips, null, 2)], { type: 'application/json' }), 'my-trips.json');
}
function importJSONFile(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const arr = JSON.parse(r.result);
      if (!Array.isArray(arr) || !arr.length) throw new Error('That file is not a trips export.');
      if (!confirm(`Replace your ${trips.length} trips with ${arr.length} from the file?`)) return;
      trips.length = 0; arr.forEach(t => trips.push(t));
      saveTrips(); refreshAll();
      renderAddEmpty(); addMsg('ok', `Loaded ${arr.length} trips.`);
    } catch (e) { addMsg('err', e.message); }
  };
  r.readAsText(file);
}

function renderAddEmpty() {
  addRoot.innerHTML = `
  <div class="add-grid">
    <div>
      <div class="drop-zone" id="dropZone">
        <div class="dz-ico">📄</div>
        <h3>Drop your travel plan here</h3>
        <p>Excel or CSV — one sheet per trip, one row per day</p>
        <div class="dz-fmts"><span class="dz-fmt">.xlsx</span><span class="dz-fmt">.csv</span></div>
        <div class="btn-line"><button class="btn-ghost" id="browseBtn">Browse files</button></div>
      </div>
      <div class="add-or">or</div>
      <div style="text-align:center"><button class="btn-link" id="manualBtn">Add a trip manually →</button></div>
      <div id="addMsg"></div>
      <div style="margin-top:26px;padding-top:18px;border-top:1px solid rgba(255,255,255,.09)">
        <h4 style="font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:#71717a;font-weight:700;margin-bottom:12px">Backup</h4>
        <div class="btn-line" style="justify-content:flex-start">
          <button class="btn-ghost" id="exportBtn">Export all trips (JSON)</button>
          <button class="btn-ghost" id="importJsonBtn">Import trips (JSON)</button>
          <button class="btn-ghost" id="resetBtn">Reset to defaults</button>
        </div>
      </div>
    </div>
    <div class="tips-box">
      <h4>How the file should look</h4>
      <ul>
        <li><span class="tk">✓</span><span><b>One sheet per trip.</b> Upload the whole workbook — each tab becomes its own trip.</span></li>
        <li><span class="tk">✓</span><span><b>One row per day.</b> Columns: Fecha, Noches, Lugar, Actividades, Hospedaje, Gastronomía, Traslado, Costo, USD.</span></li>
        <li><span class="tk">✓</span><span><b>Group by Lugar.</b> Rows sharing a place become one stop with its lodging and food.</span></li>
        <li><span class="tk">✓</span><span><b>Costs in Costo / USD.</b> Label plus amount per row; the total is summed for you.</span></li>
        <li><span class="tk">✓</span><span><b>Leave blanks.</b> Missing data is fine — fill it in after import.</span></li>
      </ul>
      <div class="tpl"><button class="btn-ghost" id="tplBtn">⬇ Download template (.csv)</button></div>
    </div>
  </div>`;
  document.getElementById('browseBtn').onclick = () => dataInput.click();
  document.getElementById('manualBtn').onclick = () => renderManual();
  document.getElementById('tplBtn').onclick = downloadTemplate;
  document.getElementById('exportBtn').onclick = exportJSON;
  document.getElementById('importJsonBtn').onclick = () => jsonInput.click();
  document.getElementById('resetBtn').onclick = () => {
    if (confirm('Replace all trips with the built-in defaults? Imported trips will be removed.')) {
      resetTrips(); saveTrips(); refreshAll(); addMsg('ok', 'Reset to the default trips.');
    }
  };
  const dz = document.getElementById('dropZone');
  ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('drag'); }));
  ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('drag'); }));
  dz.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) handleFile(f); });
  dz.addEventListener('click', e => { if (e.target.id !== 'browseBtn') dataInput.click(); });
}

function showReview(drafts, filename) {
  _reviewDrafts = drafts;
  addRoot.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:12px;min-width:0">
        <button class="btn-ghost" id="revBack">← Back</button>
        <div style="font-size:.95rem;font-weight:600">Review ${drafts.length} trip${drafts.length === 1 ? '' : 's'} <span style="color:#71717a;font-weight:400">· from ${esc(filename)}</span></div>
      </div>
      <div style="display:flex;gap:10px;flex-shrink:0">
        <button class="btn-ghost" id="revCancel">Cancel</button>
        <button class="btn-primary" id="importBtn">Import</button>
      </div>
    </div>
    <datalist id="countryList">${Object.keys(GAZ_C).sort().map(c => `<option value="${c}">`).join('')}</datalist>
    <div class="rev-list" id="revList"></div>
    <div id="addMsg"></div>`;
  const list = document.getElementById('revList');
  drafts.forEach(d => list.appendChild(revCard(d)));
  list.addEventListener('click', e => {
    const b = e.target.closest('.rev-auto-edit'); if (!b) return;
    const box = b.closest('.rev-auto');
    const inp = box.querySelector('[data-country-all]');
    inp.type = 'text';
    inp.setAttribute('list', 'countryList');
    inp.style.cssText = 'margin-left:2px;background:#26262b;border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#e4e4e7;font-size:.82rem;padding:6px 9px';
    box.querySelector('.rev-auto-view').textContent = 'Country ';
    b.remove();
    inp.focus();
  });
  document.getElementById('importBtn').onclick = commitImport;
  document.getElementById('revBack').onclick = renderAddEmpty;
  document.getElementById('revCancel').onclick = renderAddEmpty;
}
let _reviewDrafts = [];
function revCard(d) {
  const distinct = [...new Set(d.places)];
  const guesses = {}; distinct.forEach(p => guesses[p] = (GAZ_P[norm(p)] || {}).country || countryFromFlag(p) || d._flagCountry || '');
  const filled = [...new Set(Object.values(guesses))].filter(Boolean);
  const single = distinct.length === 1 || (filled.length === 1 && Object.values(guesses).every(Boolean));
  // Every place resolved from the gazetteer / an embedded flag → no need to ask, just show it
  const autoOk = single && filled.length === 1 &&
    distinct.every(p => (GAZ_P[norm(p)] || {}).country || countryFromFlag(p));
  const spend = (d.expenses || []).reduce((s, e) => s + (+e.amount || 0), 0);
  const nStops = d.stops.length || distinct.length;
  const meta = `${d.days} day${d.days === 1 ? '' : 's'} · ${nStops} stop${nStops === 1 ? '' : 's'}${spend ? ` · $${Math.round(spend).toLocaleString('en-US')}` : ''}${d._namesFromTitle ? ` · ${distinct.length} places from the name` : ''}${d._dateSpanOff ? ' · ⚠ check dates' : ''}`;
  const fields = autoOk
    ? `<div class="rev-auto" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
         <span class="rev-auto-view">${flagFor(filled[0])} <b>${esc(filled[0])}</b> <span style="color:#71717a">· auto-detected</span></span>
         <button type="button" class="rev-auto-edit" style="background:none;border:none;color:var(--accent);font-size:.72rem;cursor:pointer;padding:0;text-decoration:underline">change</button>
         <input type="hidden" data-country-all value="${esc(filled[0])}">
       </div>`
    : single
      ? `<label>Country<input data-country-all list="countryList" value="${esc(filled[0] || '')}" placeholder="Country"></label>`
      : distinct.map(p => `<label>${esc(p)}<input data-place="${esc(p)}" list="countryList" value="${esc(guesses[p] || '')}" placeholder="Country"></label>`).join('');
  const unknown = distinct.filter(p => !GAZ_P[norm(p)]);
  const coordFields = unknown.length
    ? `<div class="rev-fields" style="border-top:none;padding-top:4px">${unknown.map(p => `<label>${esc(p)} pin<input data-coord="${esc(p)}" placeholder="lat, lng (optional)"></label>`).join('')}</div>
       <div class="rev-warn" style="color:#71717a">Unlisted places drop a pin at the country's centre — paste coordinates above for an exact spot.</div>`
    : '';
  return rowEl(`<div class="rev-card">
    <div class="rev-top">
      <input type="checkbox" class="rev-chk" checked>
      <span class="rev-flag">${flagFor(filled[0] || '')}</span>
      <input class="rev-name rev-name-input" value="${esc(d.name)}">
      <span class="rev-meta">${meta}</span>
    </div>
    <div class="rev-fields">
      ${fields}
      <label>Trip type<select class="rev-mode"><option value="solo">Solo</option><option value="girlfriend">With GF</option></select></label>
    </div>
    ${coordFields}
  </div>`);
}
function commitImport() {
  const cards = [...document.querySelectorAll('#revList .rev-card')];
  const picked = [];
  cards.forEach((card, i) => {
    if (!card.querySelector('.rev-chk').checked) return;
    const d = _reviewDrafts[i], pc = {};
    const all = card.querySelector('[data-country-all]');
    if (all) d.places.forEach(p => pc[p] = all.value.trim());
    else card.querySelectorAll('[data-place]').forEach(inp => { pc[inp.getAttribute('data-place')] = inp.value.trim(); });
    const coords = {};
    card.querySelectorAll('[data-coord]').forEach(inp => {
      const nums = inp.value.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
      if (nums.length === 2) coords[inp.getAttribute('data-coord')] = nums;
    });
    card.classList.toggle('bad', d.places.some(p => !pc[p]));
    picked.push({ card, d, pc, coords });
  });
  if (!picked.length) { addMsg('err', 'Tick at least one trip to import.'); return; }
  if (picked.some(p => p.card.classList.contains('bad'))) { addMsg('err', 'Pick a country for every place in the highlighted trips.'); return; }
  let firstId = null;
  picked.forEach(({ card, d, pc, coords }) => {
    const name = card.querySelector('.rev-name-input').value.trim() || d.name;
    const t = finalizeTrip(d, { placeCountry: pc, coords, name, mode: card.querySelector('.rev-mode').value });
    trips.push(t); firstId = firstId || t.id;
  });
  saveTrips(); refreshAll();
  switchTab('trips');
  if (firstId) openFlyout(firstId);
  renderAddEmpty();
}

function renderManual(editTrip) {
  const ed = editTrip && editTrip.id ? editTrip : null;
  const edCountry = ed ? (mostCommon(ed.cities.map(c => c.country)) || '') : '';
  addRoot.innerHTML = `
  <form id="manualForm" autocomplete="off">
    <datalist id="countryList">${Object.keys(GAZ_C).sort().map(c => `<option value="${c}">`).join('')}</datalist>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <button type="button" class="btn-ghost" id="mBack">← Back</button>
      <span style="font-weight:600">${ed ? 'Editing ' + esc(ed.name) : 'New trip'}</span>
      <div style="margin-left:auto;display:flex;gap:10px;flex-shrink:0">
        <button type="button" class="btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn-primary">${ed ? 'Save changes' : 'Save trip'}</button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Trip name</label><input name="name" placeholder="Costa Rica" value="${ed ? esc(ed.name) : ''}" required></div>
      <div class="form-field"><label>Main country</label><input name="country" list="countryList" placeholder="Costa Rica" value="${esc(edCountry)}" required></div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Start date</label><input type="date" name="start" value="${ed && ed.startDate ? ed.startDate : ''}"></div>
      <div class="form-field"><label>End date</label><input type="date" name="end" value="${ed && ed.endDate ? ed.endDate : ''}"></div>
      <div class="form-field"><label>Trip type</label><select name="mode"><option value="solo"${ed && ed.mode !== 'girlfriend' ? ' selected' : ''}>Solo</option><option value="girlfriend"${ed && ed.mode === 'girlfriend' ? ' selected' : ''}>With GF</option></select></div>
    </div>
    <div class="form-sub"><h5>Stops</h5><div id="stopRows"></div><button type="button" class="mini-btn" id="addStop">＋ Add stop</button></div>
    <div class="form-sub"><h5>Expenses</h5><div id="expRows"></div><button type="button" class="mini-btn" id="addExp">＋ Add expense</button></div>
    <div class="form-sub"><h5>Day by day (optional)</h5><div id="dayRows"></div><button type="button" class="mini-btn" id="addDay">＋ Add day</button></div>
    <div class="form-field"><label>Notes</label><textarea name="notes" rows="2" placeholder="Anything else worth remembering">${ed && ed.notes ? esc(ed.notes) : ''}</textarea></div>
    <div id="addMsg"></div>
  </form>`;
  const form = document.getElementById('manualForm');
  const stopRows = document.getElementById('stopRows'), expRows = document.getElementById('expRows'), dayRows = document.getElementById('dayRows');
  const opt = (list, v) => list.map(o => `<option${o === v ? ' selected' : ''}>${o}</option>`).join('');
  const stopTpl = (v = {}) => rowEl(`<div class="form-row" data-row style="align-items:end">
    <div class="form-field"><label>Place</label><input data-f="place" placeholder="La Fortuna" value="${esc(v.place || '')}"><span data-geo-hint style="font-size:.7rem;color:var(--accent);margin-top:4px;min-height:.9rem"></span></div>
    <div class="form-field"><label>Nights</label><input data-f="nights" type="number" min="0" value="${v.nights != null ? v.nights : ''}"></div>
    <div class="form-field"><label>Lodging</label><input data-f="lodging" placeholder="Airbnb" value="${esc(v.lodging || '')}"></div>
    <div class="form-field"><label>Type</label><select data-f="ltype"><option value="">—</option>${opt(['hotel', 'airbnb', 'hostel', 'friends'], v.ltype || '')}</select></div>
    <div class="form-field"><label>Lodging cost</label><input data-f="lcost" type="number" min="0" value="${v.lcost != null ? v.lcost : ''}"></div>
    <div class="form-field"><label>Getting there</label><input data-f="transfer" placeholder="Shuttle from…" value="${esc(v.transfer || '')}"></div>
    <div class="form-field" style="min-width:180px"><label>Eat (comma-separated)</label><input data-f="eat" placeholder="Soda X, Restaurant Y" value="${esc(v.eat || '')}"></div>
    <button type="button" class="row-del" data-del aria-label="Remove">✕</button></div>`);
  const expTpl = (v = {}) => rowEl(`<div class="form-row" data-row style="align-items:end">
    <div class="form-field"><label>Category</label><select data-f="cat">${opt(['Flights', 'Lodging', 'Transport', 'Food', 'Activities', 'Other'], v.cat || 'Flights')}</select></div>
    <div class="form-field" style="min-width:180px"><label>Label</label><input data-f="label" placeholder="Round-trip airfare" value="${esc(v.label || '')}"></div>
    <div class="form-field"><label>Amount</label><input data-f="amount" type="number" min="0" value="${v.amount != null ? v.amount : ''}"></div>
    <button type="button" class="row-del" data-del aria-label="Remove">✕</button></div>`);
  const dayTpl = (v = {}) => rowEl(`<div class="form-row" data-row style="align-items:end">
    <div class="form-field"><label>Date</label><input data-f="date" type="date" value="${v.date || ''}"></div>
    <div class="form-field"><label>Place</label><input data-f="place" placeholder="La Fortuna" value="${esc(v.place || '')}"></div>
    <div class="form-field" style="min-width:220px;flex:1"><label>What you did</label><input data-f="text" placeholder="Volcano hike, hot springs" value="${esc(v.text || '')}"></div>
    <button type="button" class="row-del" data-del aria-label="Remove">✕</button></div>`);
  const seed = {
    stopRows: ed && ed.stops ? ed.stops.map(s => ({ place: s.place, nights: s.nights, lodging: s.lodging && s.lodging.name, ltype: s.lodging && s.lodging.type, lcost: s.lodging && s.lodging.cost, transfer: s.transfer, eat: (s.eat || []).join(', ') })) : [{}],
    expRows: ed && ed.expenses ? ed.expenses.map(e => ({ cat: e.category, label: e.label, amount: e.amount })) : [{}],
    dayRows: ed && ed.itinerary ? ed.itinerary.map(it => ({ date: it.date, place: it.place, text: it.text })) : [{}]
  };
  [[stopRows, stopTpl, 'addStop', seed.stopRows], [expRows, expTpl, 'addExp', seed.expRows], [dayRows, dayTpl, 'addDay', seed.dayRows]].forEach(([box, tpl, btn, rows]) => {
    (rows.length ? rows : [{}]).forEach(v => box.appendChild(tpl(v)));
    document.getElementById(btn).onclick = () => box.appendChild(tpl());
    box.addEventListener('click', e => { if (e.target.matches('[data-del]')) e.target.closest('[data-row]').remove(); });
  });
  // Live geocode: typing a known stop names its country (and fills Main country if still blank)
  stopRows.addEventListener('input', e => {
    const inp = e.target.closest('[data-f="place"]'); if (!inp) return;
    const hint = inp.parentElement.querySelector('[data-geo-hint]');
    const g = GAZ_P[norm(inp.value)];
    if (g && g.country) {
      hint.textContent = `→ ${g.country} ${flagFor(g.country)}`;
      const cf = form.elements.country;
      if (cf && !cf.value.trim()) cf.value = g.country;
    } else hint.textContent = '';
  });
  stopRows.querySelectorAll('[data-f="place"]').forEach(inp => inp.dispatchEvent(new Event('input', { bubbles: true })));
  document.getElementById('mBack').onclick = renderAddEmpty;
  document.getElementById('mBack').onclick = renderAddEmpty;
  document.getElementById('mCancel').onclick = renderAddEmpty;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = form.elements;
    const country = f.country.value.trim();
    const d = { name: f.name.value.trim(), places: [], stops: [], itinerary: [], expenses: [], transport: ed ? ed.transport || [] : [] };
    d.startDate = f.start.value || undefined; d.endDate = f.end.value || undefined;
    [...stopRows.children].forEach(r => {
      const g = s => (r.querySelector(`[data-f="${s}"]`) || {}).value?.trim() || '';
      const place = g('place'); if (!place) return;
      d.places.push(place);
      const st = { place, nights: parseInt(g('nights'), 10) || 0, eat: splitList(g('eat')) };
      if (g('lodging')) st.lodging = { name: g('lodging'), type: g('ltype') || guessType(g('lodging')) };
      const lc = parseAmount(g('lcost')); if (lc != null && st.lodging) st.lodging.cost = lc;
      if (g('transfer')) st.transfer = g('transfer');
      if (!st.eat.length) delete st.eat;
      d.stops.push(st);
    });
    [...expRows.children].forEach(r => {
      const g = s => (r.querySelector(`[data-f="${s}"]`) || {}).value?.trim() || '';
      const amt = parseAmount(g('amount')); if (amt == null || !g('label')) return;
      d.expenses.push({ category: g('cat') || guessCategory(g('label')), label: g('label'), amount: amt });
    });
    [...dayRows.children].forEach(r => {
      const g = s => (r.querySelector(`[data-f="${s}"]`) || {}).value?.trim() || '';
      if (!g('text')) return;
      d.itinerary.push({ date: g('date') || '', place: g('place') || '', text: g('text') });
    });
    if (!d.expenses.length) d.stops.forEach(s => { if (s.lodging && s.lodging.cost) d.expenses.push({ category: 'Lodging', label: s.lodging.name || s.place, amount: s.lodging.cost }); });
    d.notes = f.notes.value.trim() || undefined;
    if (!d.places.length) {
      const split = ed ? [] : placesFromName(d.name);
      if (split.length) d.places.push(...split); else d.places.push(d.name);
    }
    if (!ed && !d.startDate && !d.stops.length && !d.itinerary.length) { addMsg('err', 'Add at least a start date, a stop, or one day.'); return; }
    d.days = (d.startDate && d.endDate) ? Math.round((new Date(d.endDate) - new Date(d.startDate)) / 864e5) + 1
      : (d.itinerary.length || d.stops.reduce((a, s) => a + (s.nights || 0), 0) || (ed && ed.days) || 1);
    const pc = {}; d.places.forEach(p => pc[p] = country);
    const t = finalizeTrip(d, {
      placeCountry: pc, name: d.name, mode: f.mode.value,
      editId: ed ? ed.id : null,
      existingCities: ed ? ed.cities : null,   // keep real city names/coords if stops weren't re-entered
      highlights: ed ? ed.highlights : null    // keep the card's hand-written highlights
    });
    if (ed) trips[trips.findIndex(x => x.id === ed.id)] = t;
    else trips.push(t);
    saveTrips(); refreshAll();
    switchTab('trips'); openFlyout(t.id); renderAddEmpty();
  });
}

// ---- INIT ----
renderTrips();        // cards must exist before the filters/counters run
renderStaticStats();
renderBucket();       // bucket cards too — applyMode reads them from the DOM
applyMode('all');
sortTrips('date-desc');
renderAddEmpty();
document.querySelectorAll('.add-trip-btn').forEach(b => b.addEventListener('click', () => switchTab('add')));

// ---- BUCKET-LIST MODAL ----
(() => {
  const modal = document.getElementById('bucketModal');
  const form = document.getElementById('bucketForm');
  if (!modal || !form) return;
  const open = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); form.elements.name.focus(); };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); form.reset(); };
  document.getElementById('addGoalBtn')?.addEventListener('click', open);
  modal.querySelectorAll('[data-bl-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').trim();
    if (!name) return;
    bucketList.push({
      name,
      flag: (fd.get('flag') || '').trim() || '📍',
      status: (fd.get('status') || '').trim() || 'Planned: TBD',
      mode: 'solo',
      highlights: []
    });
    saveBucket(); renderBucket(); applyMode(currentMode);
    close();
  });
})();

if (window.lucide) lucide.createIcons();
