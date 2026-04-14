(function () {
  /** 语言偏好存 localStorage；右上角「中文 / EN」切换，全文 data-i18n + I18N_EN */
  var STORAGE_KEY = 'hawaii_oahu_itinerary_lang';
  var CHECK_KEY = 'hawaii_oahu_checks_v3';
  /** Google 文档：打包清单标签页（编辑，新标签打开） */
  var PACK_DOC_EDIT_URL = 'https://docs.google.com/document/d/1N-616a6r5YAnN5FDbk1K6fnReAA6ADwBbMt4vKE9D7I/edit?tab=t.gsp9jwyouzj';
  /** 同一标签页的预览（iframe），由 /edit?tab=… 改为 /preview?tab=… */
  var PACK_DOC_PREVIEW_URL = 'https://docs.google.com/document/d/1N-616a6r5YAnN5FDbk1K6fnReAA6ADwBbMt4vKE9D7I/preview?tab=t.gsp9jwyouzj';
  /** 是否显示内嵌预览 */
  var PACK_DOC_USE_IFRAME = true;
  /** FareHarbor 确认邮件里的「Go to your tickets」完整链接；填写后行程页与预约 Tab 会显示深色按钮 */
  var MAUKA_TICKETS_URL = '';
  /** Kualoa 确认邮件里「Waiver」按钮的完整链接；填写后 D3 与预约 Tab 会显示深色按钮 */
  var KUALOA_WAIVER_URL = '';

  var I18N_EN = {
    doc_title: "👑 Wanting and Qingyue's Oahu Trip",
    hero_title: "<span class=\"crown-sparkle\">👑</span>Wanting and Qingyue's Oahu Princess Trip",
    tab_itinerary: 'Trip',
    tab_bookings: 'Book',
    tab_prep: 'Prep',
    tab_alerts: 'Alerts',
    wx_title: 'Weather vs. itinerary',
    wx_disclaimer: 'Waikiki-area grid forecast (Open-Meteo, free API). Verify on-site conditions and official warnings—this is not a decision tool.',
    wx_loading: 'Loading forecast…',
    wx_idle: 'Switch to this tab to load / refresh the Honolulu-area forecast.',
    wx_error: 'Could not load weather. Check your connection and try again.',
    wx_alerts_hd: 'Heads-up (may clash with the plan)',
    wx_no_alerts: 'No strong clashes with this forecast—still skim again before you head out.',
    wx_email_note: 'Automatic email needs a server or email API (this site is static). Use the button below to open a <strong>draft</strong> in your mail app—add recipients before sending.',
    wx_mailto_btn: 'Open email draft with alerts',
    wx_refresh_tip: 'Opening this tab refetches the forecast. Deep link: <code>index.html#alerts</code>',
    wx_forecast_ok: 'Forecast loaded (Open-Meteo).',
    wx_risk_hike: 'D2 · Diamond Head: rain risk looks elevated—consider another time slot, rain shell, and grippy shoes.',
    wx_risk_surf: 'D2 · Surf lesson: wind/rain may affect comfort or the school’s go/no-go—message them early if it looks rough.',
    wx_risk_kcc: 'D2 · KCC market is mostly outdoors—if morning rain is heavy, pack a brolly or shift breakfast timing.',
    wx_risk_luau: 'D1 · Mauka luau is largely outdoors—evening showers or storms happen; pack a light shell.',
    wx_risk_utv: 'D3 · Kualoa UTV: very wet weather can mean mud/visibility—re-read Kualoa notes or call if borderline.',
    wx_risk_temple: 'D3 · Byodo-In / memorial park: shorten if storms; keep a respectful “dry layer” plan.',
    wx_risk_turtle: 'D3 · Turtle beach: surf/weather can make the shoreline sketchy—don’t force it.',
    wx_risk_pearl: 'D4 · Pearl Harbor is partly outdoors—small bag + layers for sun or passing showers.',
    wx_risk_sunset: 'D2 · Beach sunset is weather-exposed—if socked in, pivot to a dry Plan B.',
    prep_panel_hero: 'Before you go · packing',
    prep_panel_intro: 'Below: transport + booking tables. For <strong>checkboxes, e-tickets & receipts</strong>, use the <strong>Book</strong> tab.',
    prep_crosslink_lead: 'Car plan, booking tables & packing list live in the <strong>Prep</strong> tab.',
    prep_crosslink_btn: 'Open Prep',
    prep_doc_title: 'Prep · car rental & bookings',
    prep_hero_title: '<span class="crown-sparkle">👑</span>Prep · car rental & bookings',
    prep_nav_back: '← Back to daily itinerary',
    aria_tablist: 'Page sections',
    aria_lang: 'Language',
    leg_must: 'Must-do',
    leg_opt: 'Optional',
    leg_food: 'Food',
    leg_nature: 'Nature',
    leg_culture: 'Culture',
    leg_book: 'Ticket / table reservation required',
    leg_wait: 'Remote waitlist or queue (not a fixed seat ticket)',
    leg_venue_req: 'Light-blue “Need-to-know” boxes = official or venue <strong>hard rules / important notes</strong> for that stop (items tagged <span class="req-crit">Important</span> first).',
    tag_chase_pts: 'CHASE pay',
    leg_chase_pts: 'Use an eligible Chase card at checkout to earn category rewards (final posting depends on <strong>MCC + your card rules</strong>).',
    tag_chase_xrt: 'CSR Exclusive Tables',
    leg_chase_xrt: 'Sapphire Reserve <strong>Exclusive Tables</strong> benefits only apply to restaurants currently listed on OpenTable: <a href="https://www.opentable.com/sapphire-reserve-dining" target="_blank" rel="noopener">check list</a> before you go.',
    tag_res_web: 'Book online',
    leg_res_web: 'Book online via official sites or partner platforms.',
    tag_res_phone: 'Phone res.',
    leg_res_phone: 'Phone reservation is the main channel.',
    tag_walkin: 'Walk-in / queue',
    leg_walkin: 'Mainly walk-in / queue.',
    d1_mall_req: '<div class="venue-req-hd">Ala Moana Center · mall + dining basics</div><ul><li><span class="req-crit">Important</span>Allergies (gluten, nuts, shellfish, etc.)—tell <strong>that restaurant’s staff</strong> before you order; policies differ by vendor.</li><li>No-smoking/pets/strollers/hours follow posted mall rules; don’t block walkways with luggage.</li></ul>',
    d1_mauka_req: '<div class="venue-req-hd">Mauka Warriors (KOA Classic) · verify before you go</div><ul><li><span class="req-crit">Important</span>Shuttle pickup: <strong>Waikiki Beach Marriott · Paoakalani entrance · 4:15pm</strong> (don’t mix up other Hyatt-area stops).</li><li><span class="req-crit">Important</span>Check-in address <strong>91-1780 Midway St</strong> (not the old Hawaii Country Club).</li><li>Alcohol rules follow <strong>Hawaii legal drinking age</strong> + ticket terms (confirm on-site/email).</li><li>Outdoor + fire-show zones: light jacket; follow fencing/staff safety cues; dietary/allergy—check site or call ahead.</li></ul>',
    d2_kcc_req: '<div class="venue-req-hd">KCC Farmers Market · basics</div><ul><li><span class="req-crit">Important</span><strong>Saturday only</strong>; hard close at <strong>11:00am</strong>—don’t arrive too late.</li><li>Cash/small bills help; keep walkways clear in lines.</li></ul>',
    d2_diamond_req: '<div class="venue-req-hd">Diamond Head State Monument · know before you hike</div><ul><li><span class="req-crit">Important</span>Enter on your <strong>reserved time</strong> (Summit Trail via recreation.gov)—don’t confuse with random third-party “shuttle only” products.</li><li><span class="req-crit">Important</span><strong>Bag bans/limits</strong> apply (read posted rules); typical carry is <strong>small pack + water</strong>; stay on trail/ranger instructions.</li><li>Heat + wind + stairs: hydrate; stop if you feel unwell.</li></ul>',
    d2_surf_req: '<div class="venue-req-hd">Surf lesson (Mickey / Moku / HSA) · confirm on each school’s site/email</div><ul><li><span class="req-crit">Important</span>Follow your <strong>confirmation email</strong> for meet time, pin, and cancel/reschedule rules.</li><li><span class="req-crit">Important</span>Lessons usually screen <strong>swim ability + health</strong>; don’t force it if injured, ill, or if lifeguards flag hazardous surf.</li><li>Rash/zinc + coach signals; waterproof your own electronics.</li></ul>',
    d2_skew_req: '<div class="venue-req-hd">Honolulu Skewer House · before you go</div><ul><li><span class="req-crit">Important</span>Busy nights: <strong>call ahead</strong> <strong>☎ (808) 888-8680</strong> (verify live); hours/prices per restaurant.</li><li>Tabletop grill heat—watch burns/clothing; indoor smoking rules per venue.</li></ul>',
    d3_lanikai_req: '<div class="venue-req-hd">Lanikai / Kailua beach · public-sand safety</div><ul><li><span class="req-crit">Important</span>If unguarded, don’t swim <strong>far out</strong>; watch for rip currents and sharp reef.</li><li>Respect private property lines; pack out trash.</li></ul>',
    d3_rental_req: '<div class="venue-req-hd">Waikiki rental pickup · typical contract notes</div><ul><li><span class="req-crit">Important</span>Driver needs a <strong>valid license + credit card</strong>; age rules, extra drivers, and international-license quirks are per <strong>the vendor you booked</strong>.</li><li>Insurance deductible, fuel/EV return, late return—confirm before you sign.</li></ul>',
    d3_utv_req: '<div class="venue-req-hd">Kualoa “2-Hour UTV Ride Along Tour” · official hard / important notes</div><p style="margin:0 0 6px;font-size:11px;opacity:.95">Clicking <strong>Continue</strong> means <strong>every participant</strong> meets the tour requirements (Kualoa site). Below summarizes Restrictions &amp; Requirements + a short <strong>cancellation summary</strong>—verify wording on your confirmation email.</p><ul><li><span class="req-crit">Required</span>Arrive at the <strong>Ticket Office</strong> for check-in <strong>45 minutes before</strong> your scheduled tour time (this itinerary: <strong>by 9:30am</strong> for a <strong>10:15am</strong> departure).</li><li><span class="req-crit">Required</span>Show <strong>photo ID</strong> that matches the name on your reservation at Ticket Office check-in.</li><li><span class="req-crit">Important</span><strong>You will not drive</strong>—a Kualoa guide drives the <strong>UTV Raptor</strong>; everyone rides.</li><li><span class="req-crit">Important</span><strong>Minimum age 5</strong>; guests <strong>17 &amp; under</strong> must be with an <strong>adult</strong> on all tours.</li><li><span class="req-crit">Important</span>When booking online, <strong>one vehicle is reserved for every 4 guests</strong> included in the reservation (follow your confirmation).</li><li><span class="req-crit">Important</span><strong>Helmets are provided and must be worn at all times.</strong></li><li><span class="req-crit">Important</span>At check-in, staff verify tour restrictions; <strong>anyone who does not meet requirements cannot continue</strong>.</li><li><span class="req-crit">Important</span>Tour is <strong>very bumpy</strong>—<strong>not recommended</strong> if <strong>pregnant</strong> or with <strong>existing/recurring injuries</strong>.</li><li><span class="req-crit">Recommended</span><strong>Covered shoes</strong>.</li><li><span class="req-crit">Important</span><strong>Liability waivers</strong> apply; booking on kualoa.com means your card is charged in full. <strong>Full refund / changes</strong> (if available) require calling Kualoa <strong>at least 48 hours before</strong> your tour date/time at <strong>808-237-7321</strong> (phone lines <strong>7:30am–4:30pm HST</strong>). No-shows, missing required check-in, or failing to call <strong>48+ hours ahead</strong> to cancel = <strong>no refunds</strong>. Reservations made <strong>within 48 hours</strong> of tour time and <strong>same-day</strong> reservations are <strong>final</strong>.</li></ul>',
    d3_byodo_req: '<div class="venue-req-hd">Byodo-In / Valley of the Temples · memorial park etiquette</div><ul><li><span class="req-crit">Important</span>Coming <strong>straight from UTV</strong>: finish <strong>face/hands wipe + outfit change</strong> at the <strong>restrooms / in your parked car</strong> before entering the pavilion/graves core—out of respect for the site and other visitors.</li><li><span class="req-crit">Important</span><strong>Pay gate admission on site</strong> (amount at window); hours on <a href="https://www.byodo-in.com/" target="_blank" rel="noopener">byodo-in.com</a>.</li><li><span class="req-crit">Important</span>Active cemetery/memorial: <strong>quiet voices</strong>, <strong>no climbing</strong> structures/markers; cover shoulders; avoid very short bottoms.</li><li>Cash helps; bugs/sun—plan repellent + sunscreen; pet rules per posted signs.</li></ul>',
    d3_turtle_req: '<div class="venue-req-hd">Laniakea sea turtles · wildlife &amp; law</div><ul><li><span class="req-crit">Important</span>Honu are <strong>protected</strong>: <strong>no touching, riding, or feeding</strong>; no harassing with flash—keep <strong>legal distance</strong> (fines possible).</li><li><span class="req-crit">Important</span>Street parking: never block <strong>fire hydrants</strong> or sightlines; rough surf—don’t risk wading in blindly.</li><li>Follow volunteers/traffic help; pack out trash.</li></ul>',
    d3_yosh_req: '<div class="venue-req-hd">Yoshitsune · house rules</div><ul><li><span class="req-crit">Important</span><strong>Reserve ahead</strong>: <strong>☎ (808) 926-5616</strong>, or try partner <a href="https://autoreserve.com/restaurants/mcPpL8hoLjo6AUtD3y2p" target="_blank" rel="noopener">AutoReserve</a> (confirm with the restaurant what’s “official”). Don’t assume walk-in at peak.</li><li>Keep voices low; pace alcohol; payment rules per restaurant.</li></ul>',
    d4_nalu_req: '<div class="venue-req-hd">Nalu Health Bar · quick notes</div><ul><li>Declare allergies (nuts/dairy/etc.) before ordering; lines possible at rush.</li><li>Tipping/card policy at checkout.</li></ul>',
    d4_hula_req: '<div class="venue-req-hd">Hyatt hula / cultural class · hotel program rules</div><ul><li><span class="req-crit">Important</span>Use the hotel’s published <strong>schedule / front desk</strong> for exact title, time, capacity, and cancel rules.</li><li><span class="req-crit">Important</span>Physical activity: stop if you feel unwell; medical limits—use your judgment.</li></ul>',
    d4_pearl_req: '<div class="venue-req-hd">Pearl Harbor National Memorial · security &amp; tone</div><ul><li><span class="req-crit">Important</span><strong>Large bags/backpacks restricted</strong> (posted size rules); easiest is <strong>small bag + ID + water</strong>.</li><li><span class="req-crit">Important</span><strong>USS Missouri</strong> vs <strong>Arizona Memorial</strong> are <strong>different tickets/lines</strong>; Arizona is timed and tight—arrive for your slot.</li><li>Memorial behavior: follow posted photo/food/noise rules and ranger directions.</li></ul>',
    d4_uosan_req: '<div class="venue-req-hd">Izakaya Uosan · booking policy</div><ul><li><span class="req-crit">Important</span><strong>Phone reservations only</strong> <strong>(808) 200-5077</strong>; <strong>closed Wednesdays</strong>.</li><li><span class="req-crit">Important</span>Fine-dining izakaya: cancellation/late/no-show rules, dress, or minimums—confirm with the restaurant; no outside food/drink.</li></ul>',
    d5_airport_req: '<div class="venue-req-hd">HNL · before security</div><ul><li><span class="req-crit">Important</span>Liquids follow <strong>TSA 3-1-1</strong>; <strong>power banks / lithium batteries in carry-on only</strong>—not checked; use in-flight per crew rules.</li><li>Knives/large sunscreen: follow TSA + airline checked/carry rules; budget checked-bag queue time.</li></ul>',
    tag_book: 'Book',
    tag_wait: 'Waitlist',
    car_plan_title: 'Car rental plan',
    c_day_417: 'Apr 17 (Fri)',
    c_day_418: 'Apr 18 (Sat)',
    c_day_419: 'Apr 19 (Sun)',
    c_day_420: 'Apr 20 (Mon)',
    c_day_421: 'Apr 21 (Tue)',
    c_det_417: 'No rental · all Uber after landing, ~US$55–80 (HNL→Ala Moana→Hyatt; Mauka round-trip shuttle already in ticket—walk ~8–12 min Hyatt → Marriott Paoakalani pickup)',
    c_det_418: 'Walk + Uber hops (Kapahulu, etc.), ~US$45–65',
    c_det_419: 'One-day rental · Enterprise / Budget Waikiki, ~US$60–90/day',
    c_det_420: 'No rental · all Uber, ~US$60–70',
    c_det_421: 'No rental · Uber to airport ~US$35',
    bdg_nocar: 'No car needed',
    bdg_1day: 'One-day rental',
    meal_label: 'Dining:',
    wear_pack_title: 'What to wear · what to bring (today’s plan)',
    wear_pack_sub: '<strong>On this page:</strong> directly <strong>under</strong> the gray “Dining” strip above; cross-check the <strong>route bar + timeline</strong> further down the same day card.',
    d1_wear_pack: '<ul><li><strong>By stops</strong>: <strong>HNL→Uber</strong> comfy travel clothes + walkable shoes; ID/phone/power bank on you. <strong>Ala Moana</strong> lots of walking + A/C—light layer; small tote. <strong>Hyatt</strong> change into Aloha; shoes you can walk 8–12 min to Marriott pickup. <strong>Mauka evening</strong> ocean breeze—light jacket; leave big bags at the hotel.</li><li><strong>Wear (one-liner)</strong>: breathable daytime layers + slightly nicer casual for luau.</li><li><strong>Bring</strong>: wallet, packable umbrella/shell, empty water bottle; follow airline rules for power banks.</li><li><strong>Spares</strong>: socks + a second light set (sweat / food splashes).</li><li><strong>Hair dryer</strong>: use the in-room hotel dryer—usually no need to pack your own.</li></ul>',
    d2_wear_pack: '<ul><li><strong>By stops</strong>: <strong>KCC</strong> light layers + hat + small bills; <strong>Diamond Head</strong> trail shoes, water, sunscreen; <strong>Waikiki lunch</strong> casual; <strong>Waikiki surf meet</strong> (Mickey/Moku/HSA—pin in email) swimsuit + zinc/sunscreen; <strong>back at Hyatt</strong> shower + <strong>blow-dry</strong> + dry clothes; <strong>sunset</strong> optional light layer; <strong>Kapahulu Skewer</strong> casual but not sloppy.</li><li><strong>Wear (one-liner)</strong>: sporty/sun morning → water afternoon → dry evening.</li><li><strong>Bring</strong>: backpack/sling, small dry sack, towel, phone dry pouch, sunscreen.</li><li><strong>Spares</strong>: roll <strong>dry underwear, tee, shorts, socks</strong>—after surf, hotel first; plastic bag for wet suits.</li></ul>',
    d3_wear_pack: '<ul><li><strong>By stops</strong>: <strong>Waikiki pickup</strong> license + cards + phone mount; <strong>Kailua/Lanikai</strong> swimsuit or shorts + sandals, sun gear, towel (keep it <strong>light</strong> for wading + shoreline photos); <strong>Kualoa UTV</strong> <strong>covered shoes (recommended)</strong>, dark durable pants/shorts, shades; <strong>Byodo-In</strong>—there’s <strong>no shower</strong> between ranch and gate: in the parking lot, change into a <strong>full clean “temple layer”</strong> + lighter shoes (<strong>shoulders covered</strong>); <strong>Laniakea</strong> hat + easy walking shoes; <strong>return car→Hyatt</strong> shower + <strong>hair dryer</strong>; <strong>Yoshitsune</strong> neat casual.</li><li><strong>Wear (one-liner)</strong>: beach + dirty UTV clothes + <strong>packed-clean set for the memorial park</strong>.</li><li><strong>Bring</strong>: water bottle, <strong>large wet wipes</strong>, cash for gate, camera, <strong>big zip bags</strong> (isolate muddy UTV clothes from seats).</li><li><strong>Spares</strong>: a <strong>UTV→Byodo</strong> clean shirt + pants + socks + shoes; optional extra set if you swam at Lanikai.</li></ul>',
    d4_wear_pack: '<ul><li><strong>By stops</strong>: <strong>Nalu</strong> easy walk clothes; <strong>Hyatt hula</strong> moveable shorts/tee—sweaty? quick room rinse; <strong>Waikiki lunch</strong> still easy/packable; <strong>Pearl Harbor</strong> lots of walking → <strong>comfortable sneakers</strong>, <strong>small bag + water</strong> for security; <strong>Uosan</strong> smart-casual; hotel <strong>hair dryer</strong> for touch-ups.</li><li><strong>Wear (one-liner)</strong>: casual athletic base, step up one notch for dinner.</li><li><strong>Bring</strong>: ID easy to reach, power bank, tissues; avoid huge packs at Pearl Harbor.</li><li><strong>Spares</strong>: fresh underwear/tee after hula; light layer for A/C or evening breeze.</li></ul>',
    d5_wear_pack: '<ul><li><strong>By stops</strong>: <strong>Hotel morning</strong> comfy, easy on/off, suitcase-friendly; <strong>checkout→Uber</strong> keep ID/phone handy; <strong>HNL</strong> flight layers (cabins cold), TSA-friendly shoes.</li><li><strong>Wear (one-liner)</strong>: “road comfort + cabin warmth” in layers.</li><li><strong>Bring</strong>: boarding pass/mobile, power bank, empty bottle (fill after security).</li><li><strong>Spares</strong>: pack night before; optional spare tee for coffee spills.</li><li><strong>Hair dryer</strong>: finish at the hotel before you seal the suitcase.</li></ul>',
    tag_must: 'Must-do',
    tag_opt: 'Optional',
    tag_food: 'Food',
    tag_nature: 'Nature',
    tag_culture: 'Culture',
    tag_must_eat: 'Must-try',
    d1_title: 'Apr 17 (Fri) — Arrival + Ala Moana Japanese lunch + Mauka KOA luau',
    d1_sub: 'Lands 11:05am · HNL → Ala Moana area lunch → check-in at Hyatt → <strong>KOA Classic</strong> (buffet dinner included)',
    d1_ml1: '🍱 Lunch — Ala Moana Japanese (Goma Tei noodles / Kamukura on The Lanai)',
    d1_ml2: '🌺 Dinner — Mauka <strong>KOA Classic</strong> includes Polynesian buffet + main show',
    d1_mauka_strip: '<strong>Mauka Warriors</strong> full confirmation, pricing & e-tickets live in the <strong>Book</strong> tab—this day card keeps the timeline + need-to-knows only.',
    d1_mauka_strip_btn: 'Go to Book · Mauka',
    d3_kualoa_strip: '<strong>Kualoa UTV</strong> full order, pricing & waiver live in the <strong>Book</strong> tab—this day card keeps routing + notes.',
    d3_kualoa_strip_btn: 'Go to Book · Kualoa',
    d1_mauka_title: 'Mauka Warriors — booking confirmation (#343484830)',
    d1_mauka_body: '<p><strong>Confirmation</strong> #343484830 · <strong>Package</strong> KOA Classic Package (online, <em>rear seating</em>)</p><p><strong>Party / hours</strong> 2 adults · main run about <strong>5:00–9:00pm</strong> HST</p><p><strong>Shuttle pickup</strong> <strong>4:15pm</strong> at <strong>Waikiki Beach Marriott</strong>, <strong>Paoakalani Ave entrance</strong> (not Hyatt—follow email). Round-trip transport included (~<strong>US$30/p</strong>, US$60 for two).</p><p><strong>Venue</strong> 91-1780 Midway St, Kapolei, HI 96707 · <strong>Do not go to</strong> the old Hawaii Country Club address.</p><p><strong>Check-in / doors</strong> aim to check in by ~<strong>4:45pm</strong> for the full package; grounds open <strong>5:00pm</strong>.</p><p><strong>Special request:</strong> note asks for best front/window pair; ticket still says rear section—final seats on site.</p><p><strong>Paid breakdown:</strong> adults US$127.30 each (before processing) · code <strong>Aloha30</strong> −US$83.40 · transport US$60 · taxes/fees US$27.28 · <strong>total charged US$281.88</strong> (verify on your card).</p>',
    d1_mauka_btn_tickets: 'Open e-tickets (FareHarbor)',
    d1_mauka_btn_png: 'View confirmation screenshot (receipt)',
    d1_mauka_hint: 'To show the black button: paste the full FareHarbor “Go to your tickets” URL into <strong>MAUKA_TICKETS_URL</strong> in <code>trip.js</code>, save, and refresh.',
    d3_kualoa_title: 'Kualoa Ranch — booking confirmation (KRHI012604130550)',
    d3_kualoa_body: '<p><strong>Order</strong> KRHI012604130550 · <strong>Product</strong> 2-Hour UTV Ride Along Tour (e-commerce, paid in full)</p><p><strong>Date / party</strong> Sun Apr 19, 2026 · guide drives, guests ride · <strong>~10:15am</strong> tour time · adults ×2</p><p><strong>Check-in</strong> Arrive at the ranch <strong>Ticket Office</strong> <strong>45 minutes before</strong> your scheduled tour time—this confirmation: <strong>by 9:30am</strong> (matches the red banner on the receipt). Bring <strong>photo ID</strong> matching the reservation name.</p><p><strong>Totals</strong> Subtotal <strong>US$309.90</strong> · taxes/fees <strong>US$15.68</strong> · <strong>order total US$325.58</strong> (verify on your card). Order created Apr 12, 2026.</p><p><strong>Before arrival</strong> Complete the online <strong>waiver</strong> to save time; helmets are provided and required at all times.</p>',
    d3_kualoa_btn_waiver: 'Open Kualoa waiver (e-sign)',
    d3_kualoa_btn_png: 'View confirmation screenshot (receipt)',
    d3_kualoa_hint: 'To show the black button: paste the full waiver URL from your confirmation email into <strong>KUALOA_WAIVER_URL</strong> in <code>trip.js</code>, save, and refresh.',
    bk_kualoa_title: 'Kualoa waiver & receipt',
    bk_mauka_title: 'Mauka e-tickets & receipt',
    route_d1: '<span class="route-stop">HNL Airport</span><span class="route-arrow">→</span><span class="route-stop">Ala Moana lunch</span><span class="route-arrow">→</span><span class="route-stop">Hyatt check-in</span><span class="route-arrow">→</span><span class="route-stop">Marriott pickup</span><span class="route-arrow">→</span><span class="route-stop">Mauka Warriors</span><span class="route-arrow">→</span><span class="route-stop">Return to Waikiki</span>',
    d1_t1: 'Arrive HNL — Uber toward Ala Moana for lunch',
    d1_n1: 'Luggage with you; immigration + baggage varies a lot—<strong>don’t force “eat the second you land.”</strong> A lighter noodle meal saves room for the Mauka buffet; then check in at Hyatt',
    d1_u1: 'Uber: HNL → Ala Moana Center, ~12–22 min / ~US$20–30 (depends on immigration & baggage claim)',
    d1_t2: 'Japanese lunch (Ala Moana area)',
    d1_n2: 'If you skip tonkatsu set meals: try <strong>Goma Tei Ramen</strong> (Ala Moana <strong>Ste 1215</strong>; tantan / shoyu / udon—many bowls land around <strong>US$14–22</strong> before tax/tip; check <a href="https://www.gomatei.com/" target="_blank" rel="noopener">gomatei.com</a> for promos/happy hour). Backup: <strong>Kamukura</strong> on <strong>Level 2 The Lanai</strong> (ramen/bento; opens early). Evening: booked <strong>Mauka KOA (Classic Package)</strong>—rear section + shell lei + 1 drink ticket + buffet + main show (per confirmation email)',
    d1_u2: 'Uber: Ala Moana → Hyatt Waikiki, ~12–18 min / ~US$15–22',
    d1_t3: 'Check in at Hyatt — luggage + Aloha outfit',
    d1_n3: 'Even with a slightly late lunch you still have <strong>1.5h+</strong> to shower, settle, or stroll near Waikiki; aim to leave for the Marriott pickup by <strong>3:10pm</strong>',
    d1_t4: 'Walk to Luau shuttle pickup (Marriott side)',
    d1_n4: '~8–12 min walk from Hyatt to <strong>Waikiki Beach Marriott</strong>, <strong>Paoakalani Ave entrance</strong>; board by <strong>4:15pm</strong> (booking <strong>#343484830</strong>). Don’t mix up other Hyatt-area stops.',
    d1_t4b: 'Shuttle departs for Mauka (Kapolei)',
    d1_n4b: 'Drive time traffic-dependent. Check in at <strong>91-1780 Midway St</strong> per confirmation (<strong>not</strong> the old Hawaii Country Club).',
    d1_t5: 'Mauka Warriors Luau — KOA Classic · about 5:00–9:00pm',
    d1_n5: '<strong>KOA Classic</strong> check-in from ~<strong>4:45pm</strong>; grounds open <strong>5:00pm</strong>. Typical flow (on-site): shell lei → culture (hula / kava / tattoo / spear) → umu pig → Polynesian buffet → main show (warrior + fire + hula) → ends ~<strong>9:00pm</strong>',
    d1_u3: 'Included shuttle back to Waikiki — often ~9:30–10pm hotel-side',
    d1_t6: 'Back to hotel — wind down',
    d1_n6: 'KCC at 7:15am tomorrow—sleep early',
    day_map_lbl: 'Map: open today’s route for free (new tab)',
    day_map_osm_caption: 'Free map (OpenStreetMap)—pan & zoom. For turn-by-turn directions, use the Google Maps link above.',
    d1_uber_total: 'Uber/Lyft ballpark: ~US$45–65 (HNL→Ala Moana→Hyatt; Mauka round-trip shuttle already bundled—no extra “per ride” if you walk to the Marriott pickup)',
    d2_title: 'Apr 18 (Sat) — KCC + Diamond Head + Waikiki lunch + surf + sunset + Skewer',
    d2_sub: 'East-side beach day · after surf, <strong>back to the hotel</strong> for a real shower + dry clothes before sunset / Kapahulu Skewer (don’t stay soaked)',
    d2_ml1: '🥣 Breakfast — KCC Farmers Market',
    d2_ml2: '🍱 Lunch — Waikiki light bite / takeout (e.g. Leonard\'s)',
    d2_ml4: '🔥 Night — Honolulu Skewer House',
    route_d2: '<span class="route-stop">KCC market</span><span class="route-arrow">→</span><span class="route-stop">Diamond Head</span><span class="route-arrow">→</span><span class="route-stop">Waikiki lunch</span><span class="route-arrow">→</span><span class="route-stop">Surf lesson</span><span class="route-arrow">→</span><span class="route-stop">Hotel shower & change</span><span class="route-arrow">→</span><span class="route-stop">Sunset</span><span class="route-arrow">→</span><span class="route-stop">Skewer</span>',
    d2_uber_total: 'Uber/Lyft ballpark: ~US$30–50 (KCC hops, Diamond→Waikiki, evening Kapahulu Skewer; lots is walkable)',
    d2_t1: 'KCC Farmers Market — breakfast',
    d2_n1: 'Sat only 7:30–11am; closes at 11 sharp. Oxtail pho, acai bowl, tropical fruit. Walk or Uber ~US$10',
    d2_u1: 'Walk 500 m → Diamond Head entrance',
    d2_t2: 'Diamond Head summit hike',
    d2_n2: 'Book online in advance (US$5/person). ~1.5h round trip, panoramic Waikiki. Go early to beat heat',
    d2_u2: 'Uber: Diamond Head → Waikiki lunch zone, ~12–15 min / ~US$12–18',
    d2_t3: 'Waikiki lunch (light / takeout)',
    d2_n3: 'Keep lunch <strong>quick / takeout</strong>. Options: bites near the hotel, musubi, or Leonard\'s malasadas (Kapahulu—same strip as Skewer later) to save stomach for surf',
    d2_t4: 'Surf lesson (Waikiki Beach)',
    d2_n4: 'Meet on <strong>Waikiki Beach</strong> (walking distance—confirm the pin in each school’s email): <strong>Mickey Surf School</strong>, <strong>Moku Hawaii</strong>, or <strong>Hawaii Surfing Academy (HSA)</strong>. Book a <strong>Sat 1pm or 2pm group lesson</strong>. <strong>Top pick Mickey</strong>: often includes free video + photos—best keepsake value. <strong>Moku</strong>: great coach vibe; add-on photo ~US$100/hr. <strong>HSA</strong>: often includes gear + photos but usually the priciest tier—verify each site. <strong>Route fit</strong>: morning KCC + Diamond sits southeast; after lunch you’re back in <strong>Waikiki</strong>—afternoon surf stays on <strong>hotel-walking-distance</strong> sand, so the day lines up cleanly.',
    d2_u4: 'Walk <strong>back to the hotel</strong>: change out of a wet rash guard / suit, <strong>shower, dry hair, full dry outfit</strong>; then nap or a light Kalakaua stroll—avoid sitting in AC soaking wet',
    d2_t5: 'Back to hotel — shower & change (post-surf “must”)',
    d2_n5: 'Treat this as <strong>mandatory logistics</strong>: salt/sand + soaked clothes make malls/sunset/Skewer miserable. Rinse gear in the bathroom or use hotel laundry if needed—show up to dinner dry and comfortable',
    d2_t7: 'Waikiki Beach sunset',
    d2_n7: 'Finish hotel shower + dry clothes <strong>before</strong> sunset; April sunset ~<strong>6:50pm</strong>—walk to the sand or Kalakaua; no extra drive needed',
    d2_u5: 'Uber: Waikiki → Honolulu Skewer House (567 Kapahulu Ave), ~8–12 min / ~US$10–14',
    d2_t8: 'Honolulu Skewer House — late-night skewers',
    d2_n8: '567 Kapahulu Ave, 5–11pm. Table-grill skewers; call ahead. ~US$80/person; Uber back to the hotel after',
    d3_title: 'Apr 19 (Sun) — Lanikai + Kualoa UTV + Byodo-In + turtles + Yoshitsune',
    d3_sub: 'Lanikai wade/photos → <strong>Kualoa 2-Hour UTV</strong> (<strong>9:30am Ticket Office check-in</strong> · <strong>10:15am departure</strong>) → <strong>Byodo-In</strong> (Valley of the Temples, Kaneohe—right after Kualoa) → Laniakea turtles → return car → <strong>Yoshitsune</strong> dinner',
    d3_ml2: '🍣 Dinner — Yoshitsune',
    route_d3: '<span class="route-stop">Pick up car</span><span class="route-arrow">→</span><span class="route-stop">Lanikai</span><span class="route-arrow">→</span><span class="route-stop">Kualoa UTV</span><span class="route-arrow">→</span><span class="route-stop">Byodo-In</span><span class="route-arrow">→</span><span class="route-stop">Laniakea</span><span class="route-arrow">→</span><span class="route-stop">Return car</span><span class="route-arrow">→</span><span class="route-stop">Yoshitsune</span>',
    d3_uber_total: 'Mostly rental driving; Uber ballpark ~US$0–15 (short hops after drop-off if needed)',
    d3_t1: 'Pick up rental (Waikiki)',
    d3_n1: 'Enterprise / Budget / Alamo—book online; confirm <strong>7:00</strong> pickup. Counter + inspection often <strong>15–25 min</strong>. With <strong>Kualoa 2-Hour UTV</strong> (<strong>10:15am</strong> departure, <strong>9:30am Ticket Office</strong> check-in), be <strong>on time at the counter</strong> and head <strong>straight east</strong> after keys—no Waikiki detours',
    d3_t2: 'Lanikai Beach — morning wade & photos',
    d3_n2: '<strong>Is 9:30am Ticket Office check-in realistic?</strong> Yes—<strong>tight but workable</strong> (your <strong>10:15am</strong> departure is later—don’t mix up the two). Finish rental and be rolling east by ~<strong>7:00–7:25am</strong>; treat Lanikai as a <strong>short wade/photo stop</strong>. <strong>Leave Kailua by ~8:25am latest</strong> for Kualoa (often <strong>35–40 min</strong> + AM traffic + on-site lines; after ~8:30am risk jumps). If the rental counter runs long or you want more beach time, pick another <strong>midday</strong> Kualoa time on the site instead. If you swim, rinse feet and change before driving.',
    d3_dr1: 'Drive: Kailua/Lanikai → Kualoa Ranch, ~35–40 min (H3; AM traffic varies)',
    d3_t3: 'Kualoa Ranch — 2-Hour UTV Ride Along (10:15am departure · 9:30am Ticket Office check-in)',
    d3_n3: 'Official tour name: <strong>2-Hour UTV Ride Along Tour</strong>. This booking paid <strong>US$325.58</strong> total (subtotal ~US$309.90 + taxes/fees ~US$15.68—verify on your card). Guide drives the <strong>UTV Raptor</strong>; guests ride; runs in rain—bring sunglasses. Plan to exit the ranch flow around <strong>~12:15pm</strong> (2hr + change buffer—confirm on-site). Rules, ID, waiver, cancellation: <strong>blue “Need-to-know” box below</strong> + confirmation email.',
    d3_dr2: 'Drive: Kualoa Ranch → Byodo-In, ~20–30 min (windward). <strong>At the park lot, don’t rush straight in</strong>: use restrooms to <strong>clean hands/face</strong>; change in the car into your <strong>packed-clean outfit + lighter shoes</strong> (UTV dust/mud is normal—there’s <strong>no shower</strong> here, so wipes + a full clothing swap = “temple-ready”). Stash muddy clothes in a <strong>sealed bag</strong>.',
    d3_t5: 'Byodo-In Temple (Valley of the Temples)',
    d3_n5: '<strong>UTV → Byodo:</strong> you’ll look dusty after Kualoa—that’s fine if you <strong>change + wipe down</strong> before entering sacred space (not a hotel shower). Park, hit <strong>restrooms / car trunk</strong>, put on your <strong>clean “memorial-park layer”</strong> (see drive note + packing list: <strong>zip bag for dirty clothes</strong>), then buy tickets. Slotted <strong>after ~12:15pm UTV</strong>: short hop to <strong>Kaneohe / Ahuimanu</strong>; timeline uses <strong>~12:45pm at the gate</strong> as a reference, then North Shore turtles. <strong>Pay admission on site</strong> (often ~US$5–10pp—verify window). Hours on <a href="https://www.byodo-in.com/" target="_blank" rel="noopener">byodo-in.com</a>. Plan <strong>30–45 min</strong>; keep voices low. If UTV runs late, shorten here—<strong>don’t</strong> blow the turtle + return-car buffer.',
    d3_dr4: 'Drive: Byodo-In → Laniakea Beach, ~50–65 min (often via H2; traffic varies)',
    d3_t4: 'Laniakea Beach — sea turtles',
    d3_n4: 'Turtles often more active ~2–4pm; volunteers on site. Street parking—watch hydrants. <strong>Save energy</strong>: <strong>20–35 min</strong> can be enough before the long drive back to Waikiki.',
    d3_dr5: 'Drive: Laniakea → Waikiki rental return, ~55–75 min (H2/H1, traffic varies)',
    d3_t7: 'Return rental — back to hotel to shower & change',
    d3_n7: 'Even if you changed for Byodo, <strong>shoe soles may still carry dust</strong>—back at Hyatt, <strong>shower + change</strong> before Yoshitsune is safest. If you got <strong>wet/sandy</strong> at Lanikai / turtle beach: same—shower after car return, not in AC at the izakaya in damp clothes.',
    d3_t8: 'Dinner: Yoshitsune',
    d3_n8: 'Walkable; open until 10pm. Must-try: miso / misoyaki butterfish. Reserve ahead',
    d4_title: 'Apr 20 (Mon) — Nalu breakfast + hula + Pearl Harbor + Izakaya Uosan',
    d4_sub: 'Hula 11am · Pearl Harbor afternoon · Uosan dinner · all Uber',
    d4_ml1: '🥣 Breakfast — Nalu Health Bar Waikiki',
    d4_ml2: '🍶 Dinner — Izakaya Uosan',
    route_d4: '<span class="route-stop">Nalu breakfast</span><span class="route-arrow">→</span><span class="route-stop">Hula 11am</span><span class="route-arrow">→</span><span class="route-stop">Lunch on your own</span><span class="route-arrow">→</span><span class="route-stop">Pearl Harbor (pm)</span><span class="route-arrow">→</span><span class="route-stop">Izakaya Uosan</span>',
    d4_uber_total: 'Uber/Lyft ballpark: ~US$60–75 (Waikiki↔Pearl Harbor + Pearl Harbor→Uosan + return to hotel)',
    d4_t1: 'Nalu Health Bar Waikiki — breakfast',
    d4_n1: '226 Lewers St, walking distance, opens 7am. 2023 Best of Honolulu acai bowl; organic; add local coffee',
    d4_t3: 'Hula class (hotel, 11am)',
    d4_n3: 'Book through Hyatt Regency Waikiki; ~1h. If you sweat a lot, <strong>zip back to the room for a quick rinse + light clothes</strong> before lunch (still hotel-adjacent)',
    d4_t4: 'Lunch on your own (near Waikiki)',
    d4_n4: 'Prefer <strong>takeout / quick bites</strong>—avoid long sit-down meals. Target <strong>done by ~1:15pm</strong> with ID/water ready; aim to be <strong>in an Uber toward Pearl Harbor by ~1:25–1:35pm</strong> (~35–45 min ride; buffer if you want on-site before <strong>2pm</strong>)',
    d4_u1: 'Uber: Waikiki → Pearl Harbor, ~35–50 min / ~US$35 (Monday PM traffic can spike—leave earlier)',
    d4_t5: 'Pearl Harbor National Memorial — afternoon',
    d4_n5: 'USS Missouri is a must, ~1.5–2h. Site closes ~<strong>5pm</strong>; arriving <strong>before ~2pm</strong> is safe. Security is <strong>strict on large bags</strong>—small bag + water only. Arizona Memorial is a separate timed ticket and can add queue time; with a <strong>5:30pm Uosan</strong> reservation, <strong>prioritize Missouri</strong> first and only add Arizona if your ticket window + lines still feel comfortable. Open Mondays',
    d4_u2: 'Uber: Pearl Harbor → Izakaya Uosan, ~20 min / ~US$25',
    d4_t6: 'Dinner: Izakaya Uosan',
    d4_n6: '1221 Kapiolani Blvd, opens 5pm (closed Wed). Uni truffle butter rice + foie gras daikon. Book first seating. Call (808) 200-5077',
    d4_t7: 'Uber back to Waikiki — last evening',
    d4_n7: 'Stroll Kalakaua Ave or head straight to the hotel',
    d5_title: 'Apr 21 (Tue) — Check-out + flight home',
    d5_sub: 'Flight 12:10pm · departure day centers on <strong>checkout + airport buffer</strong> · aim for hotel pickup ~9:40am to HNL',
    d5_ml1: '☕ Morning — coffee / light bite near the hotel (before checkout)',
    d5_ml2: '✈ Departure — airport snack / grab-and-go (timing depends on your flight)',
    route_d5: '<span class="route-stop">Hotel checkout</span><span class="route-arrow">→</span><span class="route-stop">HNL</span>',
    d5_uber_total: 'Uber/Lyft ballpark: ~US$28–42 (one hotel→HNL ride; keep departure day simple)',
    d5_t1: 'Final morning · coffee + pack & check out',
    d5_n1: 'Leave margin for <strong>checkout, luggage, and TSA</strong>; avoid extra long drives. For ocean photos, the hotel lanai or a short Waikiki sand walk is enough.',
    d5_u1: 'Uber: hotel → HNL (~25–40 min / ~US$28–42 depending on traffic)',
    d5_t3: 'Uber to airport — flight 12:10pm',
    d5_n3: 'Domestic: allow 2h+ at HNL; traffic varies—9:40am pickup is safer. Aloha 🤙',
    rost_title: 'Restaurant overview',
    rost_1: '<strong>D1 lunch · Ala Moana (skip tonkatsu)</strong><br><strong>Goma Tei Ramen</strong> Ste 1215 · ramen / tantan / udon · often ~US$14–22 bowls (verify menu)<br><a href="https://www.gomatei.com/" target="_blank" rel="noopener">gomatei.com</a><br><strong>Kamukura</strong> · Level 2 The Lanai food hall · ramen/bento · opens early<br><a href="https://www.google.com/maps/search/?api=1&query=Kamukura+Ramen+Ala+Moana+Center" target="_blank" rel="noopener">Find Kamukura (Google Maps)</a><br><span class="tag chase-pts-tag">CHASE pay</span><span class="tag walkin-tag">Walk-in / queue</span>',
    rost_2: '<strong>Mauka Warriors Luau — KOA Classic</strong><br>Apr 17 (Fri) ~5:00–9:00pm · booking <strong>#343484830</strong> · pickup <strong>4:15pm</strong> Waikiki Beach Marriott (Paoakalani entrance)<br>Closed Mon/Sat · maukawarriorsluau.com<br><span class="tag res-web-tag">Book online</span><span class="tag chase-pts-tag">CHASE pay</span>',
    rost_3: '<strong>KCC Farmers Market</strong><br>Apr 18 (Sat) breakfast<br>Sat only 7:30–11am<br><span class="tag walkin-tag">Walk-in / queue</span><span class="tag chase-pts-tag">CHASE pay</span>',
    rost_leo: '<strong>Leonard\'s Bakery</strong><br>Apr 18 (Sat) lunch takeout option<br>Kapahulu · malasadas<br><span class="tag walkin-tag">Walk-in / queue</span><span class="tag chase-pts-tag">CHASE pay</span>',
    rost_byodo: '<strong>Byodo-In Temple ☸</strong><br>Apr 19 (Sun) afternoon · after Kualoa UTV<br>Valley of the Temples · Kaneohe / Ahuimanu · on-site admission<br><a href="https://www.byodo-in.com/" target="_blank" rel="noopener">byodo-in.com</a>',
    rost_8: '<strong>Yoshitsune</strong><br>Apr 19 (Sun) dinner<br>From 5:30pm · walkable · <strong>☎ (808) 926-5616</strong> or <a href="https://autoreserve.com/restaurants/mcPpL8hoLjo6AUtD3y2p" target="_blank" rel="noopener">AutoReserve</a> (verify with restaurant)<br><span class="tag res-web-tag">Book online</span><span class="tag res-phone-tag">Phone res.</span><span class="tag chase-pts-tag">CHASE pay</span>',
    rost_9: '<strong>Honolulu Skewer House</strong><br>Apr 18 (Sat) night<br>5–11pm · 567 Kapahulu Ave · call <strong>☎ (808) 888-8680</strong><br><span class="tag res-phone-tag">Phone res.</span><span class="tag chase-pts-tag">CHASE pay</span>',
    rost_10: '<strong>Nalu Health Bar</strong><br>Apr 20 (Mon) breakfast<br>226 Lewers St · opens 7am · walkable<br><span class="tag walkin-tag">Walk-in / queue</span><span class="tag chase-pts-tag">CHASE pay</span>',
    rost_11: '<strong>Izakaya Uosan ★</strong><br>Apr 20 (Mon) dinner<br>From 5pm · phone required ☎ (808) 200-5077<br><span class="tag res-phone-tag">Phone res.</span><span class="tag chase-pts-tag">CHASE pay</span>',
    surf_title: 'Surf schools (pick one · Sat D2 · meet on Waikiki Beach · ~1–2pm)',
    surf_pick: 'The three options are <strong>Mickey Surf School</strong>, <strong>Moku Hawaii</strong>, and <strong>Hawaii Surfing Academy (HSA)</strong>—all meet on <strong>Waikiki Beach</strong> within walking distance of the hotel (follow each booking email’s meeting pin). <strong>Fits Sat D2</strong>: KCC + Diamond are southeast; after lunch you’re back in Waikiki, and the 1–2pm lesson stays on the <strong>same hotel-side beach axis</strong>. <strong>Top pick: Mickey</strong>—lessons often include free video + stills (best souvenir ROI). <strong>Moku</strong>—fun coach energy; optional paid photo add-on. <strong>HSA</strong>—often bundles gear + photos but is usually the most expensive—confirm on each official site.',
    surf_mickey: 'Group lessons often include free video + photos<br>Best first-timer pick if you want footage<br>Book Sat 1pm / 2pm slot',
    surf_moku: 'Sky / Ray coaches; relaxed vibe<br>Optional add-on shoot (~US$100/hr tier)<br>Good flexibility for private/semi-private',
    surf_hsa: 'Often includes water shoes + rash guard<br>Photos included · small ratios common<br>Often US$200+ / 2hr—verify website',
    tips_title: 'Trip notes',
    tip_1: '· Day 1 (17th): HNL → Ala Moana lunch (timeline uses <strong>12:00</strong> as reference—if immigration is slow, shift everything later) → Hyatt check-in <strong>1:45</strong> → leave for Marriott pickup by <strong>3:10pm</strong> (<strong>4:15pm</strong> shuttle departs) → Mauka <strong>KOA Classic</strong> (5:00–9:00pm) → rest ~9:30pm',
    tip_2: '· Apr 18: KCC Sat only; Diamond reservation; light Waikiki lunch; surf 1pm/2pm then <strong>hotel shower + dry clothes</strong> before sunset / Skewer; Apr 21—prioritize airport time',
    tip_3: '· Apr 19: <strong>2-Hour UTV Ride Along</strong>—booked <strong>10:15am</strong> departure with <strong>9:30am Ticket Office</strong> check-in (45 min early) + matching <strong>photo ID</strong>; do the online <strong>waiver</strong> ahead of time if you can. Still works with a short Lanikai stop, but <strong>leave Kailua by ~8:25am</strong> for Kualoa; for more slack pick another site time. <strong>Byodo-In</strong> between UTV and turtles (on-site admission—check <a href="https://www.byodo-in.com/" target="_blank" rel="noopener">byodo-in.com</a> hours); keep Laniakea turtle stop short if tired; Yoshitsune dinner; one-day rental',
    tip_4: '· Apr 20: Izakaya Uosan—phone (808) 200-5077; closed Wed',
    tip_5: '· No car Apr 17–18 & Apr 20–21; Apr 19 North Shore one-day rental, return same night',
    tip_6: '· Day-1 lunch at <strong>Ala Moana</strong>: if you dislike pork-katsu sets, use <strong>Goma Tei</strong> noodles or <strong>Kamukura</strong> on The Lanai (see restaurant roster). Evening <strong>Mauka KOA Classic</strong> is booked (#343484830)—rear section on ticket, pickup 4:15pm Marriott Paoakalani per confirmation.',
    tip_7: '· <strong>Flow rule</strong>: after water sports or a sweaty hike/hula block, default to <strong>hotel shower + change</strong> before malls, fine dining, or long A/C—D2 surf always; D3 if you swam or are sandy, same after car return before izakaya',
    pay_pace_title: 'Pace & booking overview',
    pay_pace_block: '<p style="margin:0 0 8px;"><strong>Note:</strong> tickets, reservations, and prices below are handled directly on each official site (or on-site) as listed.</p><p style="margin:0;"><strong>Is it still “a lot”?</strong> <strong>Sat Apr 18</strong> is an <strong>early, full day</strong> (KCC + Diamond Head + surf + Skewer). <strong>Sun Apr 19</strong> is <strong>long driving</strong>: Lanikai + Kualoa UTV + <strong>Byodo-In</strong> (windward, after UTV) + a shorter North Shore turtle stop + Yoshitsune. <strong>Doable</strong> if you sleep enough; if you need slack on-site, shorten <strong>temple time</strong> or <strong>turtle time</strong> first—not Mauka or UTV.</p>',
    pay_book_master_title: 'Every ticket / reservation / waitlist — exact product names & sites',
    pay_book_master_block: '<table><thead><tr><th>Type</th><th>When</th><th>Activity</th><th>Exact product (don’t mix up)</th><th>Where to book</th><th>Ballpark</th></tr></thead><tbody><tr><td><span class="badge-alt badge-alt--care">Required</span></td><td>Apr 17 pm</td><td>Mauka Warriors Luau</td><td><strong>KOA — Classic Package</strong>: rear section + shell lei + drink tickets per age rules + pre-show + Polynesian buffet + main show. <strong>Not</strong> SHOW ONLY. Pick <strong>With Transportation</strong> from Waikiki if needed (~<strong>US$30/p</strong>)</td><td><a href="https://www.maukawarriorsluau.com/reservations/" target="_blank" rel="noopener">maukawarriorsluau.com/reservations</a></td><td>~<strong>US$139+</strong> adult (verify checkout); shuttle extra</td></tr><tr><td><span class="badge-alt badge-alt--talk">Suggested</span></td><td>Apr 17 lunch</td><td>Japanese lunch</td><td>Mall noodles <strong>without</strong> a heavy tonkatsu teishoku: <strong>Goma Tei Ramen</strong> (Ste 1215; tantan/shoyu/udon—many bowls ~US$14–22 before tax/tip) or <strong>Kamukura</strong> (The Lanai; ramen/bento; opens early)</td><td><a href="https://www.gomatei.com/" target="_blank" rel="noopener">gomatei.com</a> · <a href="https://www.google.com/maps/search/?api=1&query=Kamukura+Ramen+Ala+Moana+Center" target="_blank" rel="noopener">Kamukura (maps)</a></td><td>~<strong>US$14–25pp</strong> typical noodle meal</td></tr><tr><td><span class="badge-alt badge-alt--care">Required</span></td><td>Apr 18 am</td><td>Diamond Head</td><td><strong>Diamond Head State Monument — Summit Trail</strong> timed entry (<strong>not</strong> a random third-party “shuttle only” product unless you choose to switch)</td><td><a href="https://www.recreation.gov/ticket/facility/300005" target="_blank" rel="noopener">recreation.gov</a></td><td><strong>US$5</strong> + fee</td></tr><tr><td><span class="badge-alt badge-alt--care">Required</span></td><td>Apr 18 pm</td><td>Surf</td><td>Meet on <strong>Waikiki Beach</strong> (walking distance)—pick ONE: <strong>Mickey Surf School</strong>, <strong>Moku Hawaii</strong>, or <strong>Hawaii Surfing Academy (HSA)</strong>. Book that school’s <strong>Group Lesson</strong> for <strong>Sat 1pm or 2pm</strong>. <strong>Top pick: Mickey</strong> (often includes free video + photos—best souvenir value).</td><td><a href="https://www.mickeysurfschool.com/" target="_blank" rel="noopener">Mickey</a> · <a href="https://www.mokuhawaii.com/" target="_blank" rel="noopener">Moku</a> · <a href="https://www.hawaiisurfingacademy.com/" target="_blank" rel="noopener">HSA</a></td><td><strong>US$75–200+pp</strong></td></tr><tr><td><span class="badge-alt badge-alt--talk">Strongly rec.</span></td><td>Apr 18 night</td><td>Skewer</td><td>Table reservation by phone</td><td>Google Maps “Honolulu Skewer House”</td><td>~<strong>US$80pp</strong> est.</td></tr><tr><td><span class="badge-alt badge-alt--care">Required</span></td><td>Apr 19</td><td>Rental car</td><td>Waikiki same-day pickup/return, prepaid</td><td><a href="https://www.enterprise.com/" target="_blank" rel="noopener">Enterprise</a> / <a href="https://www.budget.com/" target="_blank" rel="noopener">Budget</a> / <a href="https://www.alamo.com/" target="_blank" rel="noopener">Alamo</a></td><td><strong>US$60–95/day</strong>+tax/ins</td></tr><tr><td><span class="badge-alt badge-alt--care">Required</span></td><td>Apr 19 tour <strong>10:15am</strong> HST (<strong>Ticket Office check-in by 9:30am</strong>—45 min early; confirm email). Other daily times on site—verify live.</td><td>Kualoa UTV</td><td><strong>2-Hour UTV Ride Along Tour</strong> (~2hr, guide drives UTV Raptor—match this exact tour name on kualoa.com). <strong>Do not book</strong> Hollywood Movie Sites, Secret Island, solo ATV, zipline—same ranch, different products. This page’s timeline uses <strong>9:30am check-in</strong> / <strong>10:15am departure</strong>; slide later stops if you pick another slot.</td><td><a href="https://www.kualoa.com/experiences/tours" target="_blank" rel="noopener">kualoa.com/experiences/tours</a></td><td><strong>Paid ~US$325.58</strong> (2 adults—receipt: subtotal ~US$309.90 + taxes/fees ~US$15.68)</td></tr><tr><td><span class="badge-alt badge-alt--talk">Optional</span></td><td>Apr 19 pm</td><td>Byodo-In Temple</td><td><strong>Valley of the Temples</strong> memorial-park admission (includes the Japanese temple replica). Pay on site; <strong>not</strong> another Oʻahu “temple tour” product.</td><td><a href="https://www.byodo-in.com/" target="_blank" rel="noopener">byodo-in.com</a> (hours often ~8:30am–5pm—verify)</td><td>often ~<strong>US$5–10pp</strong></td></tr><tr><td><span class="badge-alt badge-alt--talk">Strongly rec.</span></td><td>Apr 19 dinner</td><td>Yoshitsune</td><td>Dinner reservation</td><td>Phone / Google listing</td><td>À la carte</td></tr><tr><td><span class="badge-alt badge-alt--talk">Recommended</span></td><td>Apr 20 11am</td><td>Hula</td><td>Hyatt guest <strong>cultural / hula experience</strong> (exact title on hotel schedule)</td><td><a href="https://www.hyatt.com/hotel/hawaii/hyatt-regency-waikiki-beach-resort-and-spa/hnlrw" target="_blank" rel="noopener">Hyatt Regency Waikiki</a> front desk / activities</td><td>Hotel pricing</td></tr><tr><td><span class="badge-alt badge-alt--care">Required</span></td><td>Apr 20 pm</td><td>USS Missouri</td><td><strong>Battleship Missouri Memorial</strong> ticket (<strong>separate</strong> from Arizona boat)</td><td><a href="https://www.visitpearlharbor.org/battleship-missouri/" target="_blank" rel="noopener">visitpearlharbor.org</a></td><td>~<strong>US$35–42</strong></td></tr><tr><td><span class="badge-alt badge-alt--talk">Optional</span></td><td>Apr 20</td><td>Arizona boat</td><td><strong>USS Arizona Memorial</strong> program ticket on recreation.gov (very limited)</td><td><a href="https://www.recreation.gov/" target="_blank" rel="noopener">recreation.gov</a> (search Arizona)</td><td>often ~<strong>US$1</strong></td></tr><tr><td><span class="badge-alt badge-alt--care">Required</span></td><td>Apr 20 dinner</td><td>Izakaya Uosan</td><td>Phone reservation—no online booking</td><td>☎ <strong>(808) 200-5077</strong></td><td>High-end à la carte</td></tr></tbody></table>',
    pay_table_title: 'Paid activities: where to book & ballpark prices',
    pay_table_foot: 'US$ ranges are planning estimates—<strong>re-check each official site before travel</strong>; tax, tips & transfers are extra.',
    pay_table_block: '<table><thead><tr><th>Item</th><th>Exact product to book</th><th>Official / booking</th><th>Ballpark</th><th>Deals / tips</th></tr></thead><tbody><tr><td>Mauka Warriors Luau</td><td>Fri · <strong>KOA Classic Package</strong> (full dinner + show); add Waikiki transfer if needed</td><td><a href="https://www.maukawarriorsluau.com/reservations/" target="_blank" rel="noopener">maukawarriorsluau.com/reservations</a></td><td>~<strong>US$139+</strong> adult; shuttle ~<strong>US$30/p</strong> if bundled</td><td>Do not book show-only</td></tr><tr><td>D1 Japanese lunch</td><td><strong>Goma Tei</strong> ramen/udon (Ste 1215) or <strong>Kamukura</strong> on The Lanai—not a ticket; lighter than a big katsu set before Mauka buffet</td><td><a href="https://www.gomatei.com/" target="_blank" rel="noopener">gomatei.com</a> · Google “Kamukura Ala Moana”</td><td><strong>US$14–25pp</strong> ballpark noodles</td><td>Check Goma Tei for happy-hour notes; Friday queues possible</td></tr><tr><td>Diamond Head</td><td><strong>Summit Trail</strong> timed entry + parking</td><td><a href="https://www.recreation.gov/ticket/facility/300005" target="_blank" rel="noopener">recreation.gov</a></td><td><strong>US$5</strong> + small fee</td><td>No Groupon; Sat AM slots tight</td></tr><tr><td>KCC Market</td><td>Food only</td><td><a href="https://www.kapiolani.hawaii.edu/event/kcc-farmers-market/" target="_blank" rel="noopener">KCC Farmers Market</a></td><td><strong>US$8–25</strong> food</td><td>Free entry; closes 11am</td></tr><tr><td>Surf lesson</td><td>Waikiki Beach group lesson <strong>Sat 1pm or 2pm</strong>—pick one: <strong>Mickey Surf School</strong>, <strong>Moku Hawaii</strong>, <strong>Hawaii Surfing Academy (HSA)</strong>. <strong>Top pick Mickey</strong> for free video + photos (best keepsake ROI).</td><td><a href="https://www.mickeysurfschool.com/" target="_blank" rel="noopener">Mickey</a> · <a href="https://www.mokuhawaii.com/" target="_blank" rel="noopener">Moku</a> · <a href="https://www.hawaiisurfingacademy.com/" target="_blank" rel="noopener">HSA</a></td><td><strong>US$75–200+pp</strong> varies</td><td>Moku add-on photo ~US$100/hr; HSA often pricier—verify each site’s “Group Lesson” product</td></tr><tr><td>Honolulu Skewer House</td><td>Reserve Sat night</td><td>Google Maps / phone</td><td><strong>~US$80pp</strong> est.</td><td>Rare coupons</td></tr><tr><td>Kualoa UTV</td><td><strong>2-Hour UTV Ride Along Tour</strong> (~2hr; guide drives UTV Raptor; not Hollywood tour)</td><td><a href="https://www.kualoa.com/experiences/tours" target="_blank" rel="noopener">kualoa.com/experiences/tours</a></td><td><strong>~US$325.58</strong> paid (2 adults—subtotal ~US$309.90 + taxes/fees ~US$15.68)</td><td>This itinerary: <strong>10:15am</strong> tour = <strong>9:30am Ticket Office</strong> check-in (45 min). Other daily times on site—verify. <strong>Secret Island / Movie Tour / ATV</strong> are all <strong>≠</strong> this</td></tr><tr><td>Byodo-In (D3)</td><td><strong>Valley of the Temples</strong> gate ticket; slotted <strong>after Kualoa UTV</strong>, before Laniakea turtles (Kaneohe area)</td><td><a href="https://www.byodo-in.com/" target="_blank" rel="noopener">byodo-in.com</a> · Google “Byodo-In Temple Oahu”</td><td>often <strong>US$5–10pp</strong> on site</td><td>Dress respectfully; budget ~40min + drives; trim turtles if tight</td></tr><tr><td>1-day car</td><td>Waikiki pickup/drop Apr 19</td><td><a href="https://www.enterprise.com/" target="_blank" rel="noopener">Enterprise</a> / <a href="https://www.budget.com/" target="_blank" rel="noopener">Budget</a> / <a href="https://www.alamo.com/" target="_blank" rel="noopener">Alamo</a></td><td><strong>US$60–95/day</strong>+tax/ins</td><td>Prepay, AAA, Costco Travel compare</td></tr><tr><td>Yoshitsune</td><td>Dinner reserve</td><td>Phone / Google</td><td>À la carte</td><td>No standard discount</td></tr><tr><td>Nalu Health Bar</td><td>Breakfast bowls</td><td><a href="https://www.naluhealthbar.com/" target="_blank" rel="noopener">naluhealthbar.com</a></td><td><strong>US$12–22</strong></td><td>Watch IG promos</td></tr><tr><td>Hyatt hula</td><td>Hotel cultural class</td><td><a href="https://www.hyatt.com/hotel/hawaii/hyatt-regency-waikiki-beach-resort-and-spa/hnlrw" target="_blank" rel="noopener">Hyatt Regency Waikiki</a></td><td>Hotel pricing</td><td>Packages sometimes bundle</td></tr><tr><td>USS Missouri</td><td>Battleship ticket</td><td><a href="https://www.visitpearlharbor.org/battleship-missouri/" target="_blank" rel="noopener">visitpearlharbor.org</a></td><td><strong>~US$35–42</strong> adult</td><td>Separate from Arizona boat—buy ahead</td></tr><tr><td>Arizona Memorial</td><td>Optional boat lottery/ticket</td><td><a href="https://www.recreation.gov/" target="_blank" rel="noopener">recreation.gov</a></td><td>often <strong>~US$1</strong> fee</td><td>Hard to get; can skip</td></tr><tr><td>Izakaya Uosan</td><td>Mon first seating</td><td>Phone <strong>(808) 200-5077</strong></td><td>High-end omakase-style</td><td>Closed Wed; phone only</td></tr></tbody></table>',
    bk_all_title: 'Book ahead (sooner is better)',
    bk_1: '<strong>Kualoa 2-Hour UTV Ride Along</strong> <span class="bk-tag-urgent">Confirm details</span><br>kualoa.com · Sun <strong>10:15am</strong> departure · <strong>9:30am</strong> Ticket Office check-in · order <strong>KRHI012604130550</strong> · paid ~<strong>US$325.58</strong>',
    bk_2: '<strong>Mauka KOA Classic</strong> <span class="bk-tag-urgent">Confirm details</span><br>Booking <strong>#343484830</strong> · Fri ~5:00pm · pickup <strong>4:15pm</strong> Waikiki Beach Marriott (Paoakalani entrance) · <strong>not</strong> show-only',
    bk_3: '<strong>Izakaya Uosan</strong> <span class="bk-tag-urgent">Phone only</span><br>☎ (808) 200-5077 · Mon dinner · no DMs',
    bk_5: '<strong>Diamond Head hike</strong> <span class="bk-tag-soon">Reservation</span><br>recreation.gov (Summit Trail) · Sat 9am · US$5/person + fee',
    bk_6: '<strong>Surf lesson</strong> <span class="bk-tag-soon">Book ahead</span><br>Mickey / Moku / HSA · Waikiki Beach meet · Sat 1–2pm · top pick Mickey',
    bk_skew: '<strong>Honolulu Skewer House</strong> <span class="bk-tag-soon">Reserve</span><br>567 Kapahulu Ave · Sat evening · ☎ <strong>(808) 888-8680</strong>',
    bk_7: '<strong>Hula class</strong><br>Hyatt Regency Waikiki · Mon 11am',
    bk_8: '<strong>Yoshitsune</strong><br>Apr 19 (Sun) dinner · call ahead',
    bk_9: '<strong>Pearl Harbor</strong> · <strong>USS Missouri</strong> ticket <span class="bk-tag-soon">buy ahead</span><br>visitpearlharbor.org/battleship-missouri · Arizona boat optional · recreation.gov',
    bk_10: '<strong>Apr 19 rental car</strong><br>Enterprise / Budget / Alamo Waikiki · confirm <strong>7:00am</strong> pickup',
    bk_note: 'Full “exact product + official site” matrix: <strong>Prep</strong> tab. D1 lunch: follow the restaurant’s line/reservation rules. Mauka: <strong>KOA Classic</strong> full-package ticket.',
    pack_collab_title: 'Packing list (Google Doc)',
    pack_collab_intro: 'The list lives in the Google Doc below. The embed is read-only preview; use the button to open and edit (sharing permissions apply).',
    pack_doc_setup: 'If nothing appears: share the doc, then set PACK_DOC_EDIT_URL and PACK_DOC_PREVIEW_URL in <code>trip.js</code>, and redeploy.',
    pack_doc_btn: 'Open in Google Docs',
    pack_doc_iframe_note: 'If the preview looks wrong, use the button above—some browsers restrict embedded docs.'
  };

  function captureZh() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el.dataset.zhSaved) return;
      el.dataset.zhSaved = '1';
      if (el.tagName === 'TITLE') {
        el.dataset.zh = el.textContent;
        return;
      }
      el.dataset.zh = el.innerHTML;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      if (el.dataset.zhAriaSaved) return;
      el.dataset.zhAriaSaved = '1';
      el.dataset.zhAria = el.getAttribute('aria-label') || '';
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      if (el.dataset.zhPhSaved) return;
      el.dataset.zhPhSaved = '1';
      el.dataset.zhPh = el.getAttribute('placeholder') || '';
    });
  }

  /** Open-Meteo（无 API Key）· 与行程弱规则匹配 — 非专业预警 */
  var WX_LAT = 21.281;
  var WX_LON = -157.826;
  var WX_START = '2026-04-17';
  var WX_END = '2026-04-21';
  var lastWxDaily = null;
  var wxFetchState = 'idle';

  var WX_RISK_ZH = {
    wx_risk_hike: 'D2 · 钻石山：降雨概率偏高，考虑改约时段、雨壳与防滑鞋。',
    wx_risk_surf: 'D2 · 冲浪课：风雨可能影响体感或学校是否开课——若海况差尽早短信/邮件学校确认。',
    wx_risk_kcc: 'D2 · KCC 市集多在户外——若清晨雨大，带折叠伞或略推迟早餐时段。',
    wx_risk_luau: 'D1 · Mauka Luau 多在户外/海风区——傍晚阵雨或雷暴可能，备薄外套。',
    wx_risk_utv: 'D3 · Kualoa UTV：大雨后可能泥泞/视线差——留意官网/邮件或电话确认是否照常。',
    wx_risk_temple: 'D3 · 平等院/陵园：暴雨时缩短停留，尊重场地并保持干爽得体。',
    wx_risk_turtle: 'D3 · 海龟岸：浪况与天气可能不适合靠近——别硬下水。',
    wx_risk_pearl: 'D4 · 珍珠港部分户外——小包+防晒/薄外套应对日晒或阵雨。',
    wx_risk_sunset: 'D2 · 日落：若云层封死，准备室内/商场 Plan B。'
  };

  function wxIsEn() {
    return document.documentElement.lang === 'en';
  }

  function wxRiskText(key) {
    return wxIsEn() ? (I18N_EN[key] || '') : (WX_RISK_ZH[key] || I18N_EN[key] || '');
  }

  function wxRainish(code) {
    return [51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].indexOf(code) !== -1;
  }

  function wxStormish(code) {
    return [95, 96, 99].indexOf(code) !== -1;
  }

  function wxCollectAlerts(d) {
    var alerts = [];
    var times = d.time || [];
    var i;
    for (i = 0; i < times.length; i++) {
      var code = d.weathercode[i];
      var precip = d.precipitation_probability_max[i] || 0;
      var wind = d.wind_speed_10m_max[i] || 0;
      var date = times[i];
      if (date === '2026-04-17') {
        if (precip >= 55 || wxStormish(code)) alerts.push('wx_risk_luau');
        else if (precip >= 40 && wxRainish(code)) alerts.push('wx_risk_luau');
      }
      if (date === '2026-04-18') {
        if (precip >= 42 || wxRainish(code)) alerts.push('wx_risk_hike');
        if (precip >= 48 || wxRainish(code) || wind >= 24) alerts.push('wx_risk_surf');
        if (precip >= 48 && wxRainish(code)) alerts.push('wx_risk_kcc');
        if (precip >= 72 || wxStormish(code)) alerts.push('wx_risk_sunset');
      }
      if (date === '2026-04-19') {
        if (precip >= 55 || wxStormish(code)) alerts.push('wx_risk_utv');
        if (precip >= 50 || wxStormish(code)) alerts.push('wx_risk_temple');
        if (wind >= 26 || precip >= 50) alerts.push('wx_risk_turtle');
      }
      if (date === '2026-04-20') {
        if (precip >= 50 || wxStormish(code)) alerts.push('wx_risk_pearl');
      }
    }
    var out = [];
    var seen = {};
    alerts.forEach(function (k) {
      if (!seen[k]) {
        seen[k] = 1;
        out.push(k);
      }
    });
    return out;
  }

  function wxWmoEmoji(code) {
    if (code === 0 || code === 1) return '☀';
    if (code === 2 || code === 3) return '⛅';
    if ([45, 48].indexOf(code) !== -1) return '🌫';
    if (wxRainish(code) || code === 66 || code === 67) return '🌧';
    if (wxStormish(code)) return '⛈';
    if ([71, 73, 75, 77, 85, 86].indexOf(code) !== -1) return '❄';
    return '🌤';
  }

  function wxDayLabel(dateStr) {
    var map = { '2026-04-17': { zh: 'D1 周五 4/17', en: 'D1 Fri Apr 17' }, '2026-04-18': { zh: 'D2 周六 4/18', en: 'D2 Sat Apr 18' }, '2026-04-19': { zh: 'D3 周日 4/19', en: 'D3 Sun Apr 19' }, '2026-04-20': { zh: 'D4 周一 4/20', en: 'D4 Mon Apr 20' }, '2026-04-21': { zh: 'D5 周二 4/21', en: 'D5 Tue Apr 21' } };
    var m = map[dateStr];
    if (!m) return dateStr;
    return wxIsEn() ? m.en : m.zh;
  }

  function refreshWeatherPanel() {
    var st = document.getElementById('wx-status');
    var grid = document.getElementById('wx-grid');
    var wrap = document.getElementById('wx-alerts-wrap');
    var ul = document.getElementById('wx-alerts');
    var none = document.getElementById('wx-no-alerts');
    var mail = document.getElementById('wx-mailto');
    if (!st || !grid || !wrap || !ul || !none || !mail) return;

    if (wxFetchState === 'idle') {
      st.textContent = wxIsEn() ? I18N_EN.wx_idle : '切换到本 Tab 后将自动加载天气预报。';
      grid.hidden = true;
      wrap.hidden = true;
      none.hidden = true;
      mail.hidden = true;
      return;
    }

    if (wxFetchState === 'loading') {
      var elWx = document.getElementById('wx-status');
      st.textContent = wxIsEn() ? I18N_EN.wx_loading : ((elWx && elWx.dataset.zh) || '正在加载天气…');
      grid.hidden = true;
      wrap.hidden = true;
      none.hidden = true;
      mail.hidden = true;
      return;
    }
    if (wxFetchState === 'error' || !lastWxDaily) {
      st.textContent = wxIsEn() ? I18N_EN.wx_error : '无法加载天气，请检查网络或稍后再试。';
      grid.hidden = true;
      wrap.hidden = true;
      none.hidden = true;
      mail.hidden = true;
      return;
    }

    st.textContent = wxIsEn() ? I18N_EN.wx_forecast_ok : '预报已更新（Open-Meteo）。';
    var d = lastWxDaily;
    var times = d.time || [];
    grid.innerHTML = '';
    var j;
    for (j = 0; j < times.length; j++) {
      var code = d.weathercode[j];
      var tmax = d.temperature_2m_max[j];
      var tmin = d.temperature_2m_min[j];
      var pr = d.precipitation_probability_max[j];
      var wn = d.wind_speed_10m_max[j];
      var card = document.createElement('div');
      card.className = 'wx-card';
      card.innerHTML = '<div class="wx-card-hd">' + wxWmoEmoji(code) + ' <span>' + wxDayLabel(times[j]) + '</span></div>' +
        '<div class="wx-card-temp">' + Math.round(tmax) + '° / ' + Math.round(tmin) + '°F</div>' +
        '<div class="wx-card-meta">' + (wxIsEn() ? 'Rain chance' : '降雨概率') + ' ' + pr + '% · ' + (wxIsEn() ? 'Wind' : '风') + ' ~' + Math.round(wn) + ' mph</div>';
      grid.appendChild(card);
    }
    grid.hidden = false;

    var keys = wxCollectAlerts(d);
    ul.innerHTML = '';
    if (keys.length === 0) {
      wrap.hidden = true;
      none.hidden = false;
      mail.hidden = true;
      mail.setAttribute('href', '#');
    } else {
      none.hidden = true;
      wrap.hidden = false;
      keys.forEach(function (k) {
        var li = document.createElement('li');
        li.textContent = wxRiskText(k);
        ul.appendChild(li);
      });
      var subj = wxIsEn() ? 'Oahu trip — weather heads-up' : '欧胡行程 — 天气提醒';
      var bodyLines = keys.map(function (k) {
        return wxRiskText(k);
      });
      bodyLines.unshift(wxIsEn() ? ('Dates ' + WX_START + '–' + WX_END + ' · Waikiki grid forecast') : ('日期 ' + WX_START + '–' + WX_END + ' · Waikiki 网格预报'));
      bodyLines.push('');
      bodyLines.push(wxIsEn() ? 'Open-Meteo: https://open-meteo.com/' : '数据来源 Open-Meteo：https://open-meteo.com/');
      mail.href = 'mailto:?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(bodyLines.join('\n'));
      mail.hidden = false;
    }
  }

  function fetchWeather() {
    var st = document.getElementById('wx-status');
    if (!st) return;
    wxFetchState = 'loading';
    refreshWeatherPanel();
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + WX_LAT + '&longitude=' + WX_LON +
      '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max' +
      '&timezone=Pacific%2FHonolulu&start_date=' + WX_START + '&end_date=' + WX_END +
      '&temperature_unit=fahrenheit&wind_speed_unit=mph';
    fetch(url, { method: 'GET', credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) throw new Error('wx');
        return r.json();
      })
      .then(function (json) {
        if (!json || !json.daily) throw new Error('wx');
        lastWxDaily = json.daily;
        wxFetchState = 'ok';
        refreshWeatherPanel();
      })
      .catch(function () {
        lastWxDaily = null;
        wxFetchState = 'error';
        refreshWeatherPanel();
      });
  }

  function applyLang(lang) {
    var isEn = lang === 'en';
    document.documentElement.lang = isEn ? 'en' : 'zh-Hans';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var zh = el.dataset.zh;
      var text = isEn ? (I18N_EN[key] != null ? I18N_EN[key] : zh) : zh;
      if (el.tagName === 'TITLE') {
        el.textContent = text;
        document.title = text;
        return;
      }
      el.innerHTML = text;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      var zhA = el.dataset.zhAria;
      el.setAttribute('aria-label', isEn ? (I18N_EN[key] != null ? I18N_EN[key] : zhA) : zhA);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var zhP = el.dataset.zhPh;
      el.placeholder = isEn ? (I18N_EN[key] != null ? I18N_EN[key] : zhP) : zhP;
    });
    var bZh = document.getElementById('lang-zh');
    var bEn = document.getElementById('lang-en');
    if (bZh && bEn) {
      bZh.classList.toggle('is-active', !isEn);
      bEn.classList.toggle('is-active', isEn);
      bZh.setAttribute('aria-pressed', !isEn ? 'true' : 'false');
      bEn.setAttribute('aria-pressed', isEn ? 'true' : 'false');
    }
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    loadChecks();
    initPackDoc();
    initMaukaLinks();
    initKualoaLinks();
    refreshWeatherPanel();
  }

  function loadChecks() {
    try {
      var raw = localStorage.getItem(CHECK_KEY);
      var o = raw ? JSON.parse(raw) : {};
      document.querySelectorAll('[data-check-key]').forEach(function (el) {
        el.checked = !!o[el.getAttribute('data-check-key')];
      });
    } catch (e) {}
  }

  function saveCheck(key, on) {
    try {
      var raw = localStorage.getItem(CHECK_KEY);
      var o = raw ? JSON.parse(raw) : {};
      o[key] = on;
      localStorage.setItem(CHECK_KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function initPackDoc() {
    var editUrl = PACK_DOC_EDIT_URL && String(PACK_DOC_EDIT_URL).replace(/^\s+|\s+$/g, '');
    var previewUrl = PACK_DOC_PREVIEW_URL && String(PACK_DOC_PREVIEW_URL).replace(/^\s+|\s+$/g, '');
    var nActive = document.getElementById('pack-doc-active');
    var nOpen = document.getElementById('pack-doc-open');
    var nIf = document.getElementById('pack-doc-if');
    var nHint = document.getElementById('pack-doc-setup-hint');
    if (editUrl && nActive && nOpen) {
      nActive.hidden = false;
      nOpen.href = editUrl;
      if (nHint) nHint.hidden = true;
      if (nIf && PACK_DOC_USE_IFRAME && previewUrl) {
        nIf.src = previewUrl;
        nIf.hidden = false;
      }
    }
  }

  function initMaukaLinks() {
    var raw = typeof MAUKA_TICKETS_URL === 'string' ? MAUKA_TICKETS_URL : '';
    var u = raw.replace(/^\s+|\s+$/g, '');
    document.querySelectorAll('a[data-mauka-tickets]').forEach(function (a) {
      if (u) {
        a.href = u;
        a.removeAttribute('hidden');
        a.onclick = null;
      } else {
        a.setAttribute('hidden', '');
        a.setAttribute('href', '#');
        a.onclick = function (e) { e.preventDefault(); };
      }
    });
    document.querySelectorAll('.mauka-tickets-hint').forEach(function (p) {
      if (u) {
        p.setAttribute('hidden', '');
      } else {
        p.removeAttribute('hidden');
      }
    });
  }

  function initKualoaLinks() {
    var raw = typeof KUALOA_WAIVER_URL === 'string' ? KUALOA_WAIVER_URL : '';
    var u = raw.replace(/^\s+|\s+$/g, '');
    document.querySelectorAll('a[data-kualoa-waiver]').forEach(function (a) {
      if (u) {
        a.href = u;
        a.removeAttribute('hidden');
        a.onclick = null;
      } else {
        a.setAttribute('hidden', '');
        a.setAttribute('href', '#');
        a.onclick = function (e) { e.preventDefault(); };
      }
    });
    document.querySelectorAll('.kualoa-waiver-hint').forEach(function (p) {
      if (u) {
        p.setAttribute('hidden', '');
      } else {
        p.removeAttribute('hidden');
      }
    });
  }

  document.body.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches && t.matches('input[type="checkbox"][data-check-key]')) {
      saveCheck(t.getAttribute('data-check-key'), t.checked);
    }
  });

  var tabs = document.querySelectorAll('.tab-btn');
  var pIt = document.getElementById('panel-itinerary');
  var pBk = document.getElementById('panel-bookings');
  var pPr = document.getElementById('prep');
  var pAl = document.getElementById('panel-alerts');

  function setActiveTab(tabId) {
    tabs.forEach(function (b) {
      var on = b.getAttribute('data-tab') === tabId;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (pIt) pIt.hidden = tabId !== 'itinerary';
    if (pBk) pBk.hidden = tabId !== 'bookings';
    if (pPr) pPr.hidden = tabId !== 'prep';
    if (pAl) pAl.hidden = tabId !== 'alerts';
    try {
      if (tabId === 'prep') {
        if (location.hash !== '#prep') history.replaceState(null, '', '#prep');
      } else if (tabId === 'alerts') {
        if (location.hash !== '#alerts') history.replaceState(null, '', '#alerts');
        fetchWeather();
      } else if (location.hash === '#prep' || location.hash === '#alerts') {
        history.replaceState(null, '', location.pathname + location.search);
      }
    } catch (e) {}
  }

  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setActiveTab(btn.getAttribute('data-tab'));
    });
  });

  document.querySelectorAll('[data-tab-jump]').forEach(function (el) {
    el.addEventListener('click', function () {
      var id = el.getAttribute('data-tab-jump');
      if (!id) return;
      var anchor = el.getAttribute('data-jump-anchor');
      var t = document.querySelector('.tab-btn[data-tab="' + id + '"]');
      if (t) t.click();
      if (anchor) {
        requestAnimationFrame(function () {
          var ae = document.getElementById(anchor);
          if (ae) ae.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    });
  });

  captureZh();
  loadChecks();

  var saved = 'zh';
  try {
    saved = localStorage.getItem(STORAGE_KEY) || 'zh';
  } catch (e) {}
  if (saved === 'en') {
    applyLang('en');
  }

  var h = (location.hash || '').replace(/^#/, '');
  if (h === 'prep' || h === 'packing' || h === '准备') {
    setActiveTab('prep');
  } else if (h === 'alerts' || h === '提醒' || h === 'weather') {
    setActiveTab('alerts');
  }

  initPackDoc();
  initMaukaLinks();
  initKualoaLinks();

  var bZh = document.getElementById('lang-zh');
  var bEn = document.getElementById('lang-en');
  if (bZh) bZh.addEventListener('click', function () { applyLang('zh'); });
  if (bEn) bEn.addEventListener('click', function () { applyLang('en'); });
})();
