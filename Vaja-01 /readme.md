# SubReminder
### Spletni upravljalnik naročnin z e-mail in spletnimi opozorili

SubReminder je spletna aplikacija, ki uporabnikom omogoča pregledno spremljanje vseh naročniških storitev na enem mestu, analizo stroškov, pravočasna opozorila pred obnovitvami ter pomoč pri preklicu in vračilu že plačanih naročnin.

---

## 1. Problem Statement

### Kontekst
Digitalne naročniške storitve so postale del vsakdana – od zabave in produktivnosti do učenja in fitnesa. Večina teh storitev uporablja model samodejnega mesečnega ali letnega zaračunavanja, kar pomeni, da uporabniki pogosto nimajo neposrednega občutka za skupne stroške.

### Koga problem zadeva
Problem zadeva predvsem posameznike, stare med 18 in 40 let, ki uporabljajo več spletnih in mobilnih naročniških storitev, vendar nimajo centralnega pregleda nad njimi.

### Posledice, če problem ostane nerešen
Če problem ostane nerešen, uporabniki:
- redno plačujejo za storitve, ki jih ne uporabljajo več,
- zamujajo roke za preklic ali konec brezplačnih preizkusnih obdobij,
- izgubljajo denar in čas,
- razvijejo nezaupanje do naročniških modelov in digitalnih storitev.

---

## 2. Ciljni uporabnik

Ciljni uporabnik je vsakdanji spletni uporabnik, star med **18 in 40 let**, ki uporablja več naročniških storitev in želi boljši nadzor nad svojimi stroški.

### Značilnosti uporabnika
- uporablja spletne in mobilne aplikacije,
- prejema obvestila prek e-pošte,
- ceni enostavnost, preglednost in zasebnost.

### Glavne težave v praksi
- nima enotnega pregleda nad naročninami,
- ne spremlja redno datumov obnovitve,
- spregleda ali prejme prepozna opozorila,
- ne pozna postopkov za preklic ali vračilo kupnine.

---

## 3. Predlagana rešitev

SubReminder je spletna stran, ki omogoča centralizirano upravljanje naročnin ter aktivno pomoč uporabniku pri preprečevanju ali reševanju nepotrebnih stroškov.

### Osnovne funkcionalnosti
- ročni vnos naročnin (ime, cena, interval, datum obnovitve),
- izračun **mesečne in letne cene** posamezne naročnine,
- skupni pregled mesečnih in letnih stroškov,
- osnovna **analitika porabe** (npr. grafi po kategorijah),
- e-mail in spletna (in-app) opozorila pred obnovitvami.

### Analitika in priporočila
- vizualna predstavitev porabe na mesec,
- prikaz najdražjih naročnin,
- označevanje redko uporabljenih naročnin,
- priporočila za **brezplačne ali cenejše alternative aplikacij**.

### Napredna funkcionalnost: pomoč pri preklicu in vračilu
Če je naročnina že bila obnovljena ali uporabnik zamudi preklic, lahko SubReminder:
- samodejno pripravi zahtevo za preklic naročnine,
- generira ali pošlje e-mail podpori ponudnika v imenu uporabnika,
- zaprosi za vračilo kupnine (refund),
- spremlja status zahteve in uporabnika obvešča o odzivu.

Rešitev ne zahteva povezave z bančnimi računi, kar povečuje zasebnost in zaupanje uporabnikov.

---

## 4. Primer uporabe

Marko uporablja več spletnih naročnin (pretočna platforma, orodje za delo, učno platformo). Po prijavi v SubReminder vnese vse naročnine in na nadzorni plošči vidi, koliko denarja mesečno porabi.

Ko ugotovi, da ene storitve ne uporablja več, jo označi kot nepotrebno. Ker je naročnina že bila obnovljena, SubReminder samodejno pripravi zahtevo za preklic in refund ter jo pošlje podpori ponudnika. Marko prejme odgovor in povrnjen znesek brez dodatnega napora.

---

## 5. Market Research

### Rast naročniških storitev (SaaS in aplikacije)
- Globalni trg naročniških storitev (t. i. *subscription economy*) je bil v letu 2024 ocenjen na približno **500 milijard USD**, do leta 2030–2033 pa naj bi presegel **1,5 bilijona USD**, z letno rastjo okoli **13 %**.
- Povprečen uporabnik ima danes **5–6 aktivnih naročnin**, kar vključuje pretočne storitve, aplikacije in SaaS orodja.
- Več kot **75 % potrošnikov** po svetu uporablja vsaj eno plačljivo digitalno naročnino.

### Težava neučinkovitega upravljanja naročnin
- Raziskave kažejo, da **okoli 40 % uporabnikov** plačuje vsaj eno naročnino, na katero so pozabili ali je ne uporabljajo več.
- Povprečni uporabniki **močno podcenjujejo svojo porabo**: ocenjujejo okoli 80–90 USD mesečno, dejanska poraba pa pogosto presega **200 USD na mesec**.
- Gospodinjstva v razvitih državah za naročnine letno porabijo več kot **1.000 USD**, pri čemer je pomemben delež porabljen za neuporabljene storitve.

### Tržni potencial orodij za upravljanje naročnin
- Aplikacije za upravljanje naročnin (npr. Rocket Money / Truebill) imajo **več milijonov aktivnih uporabnikov** in beležijo hitro rast.
- Podjetje Truebill je bilo leta 2021 prevzeto za **1,275 milijarde USD**, kar potrjuje visoko tržno vrednost tovrstnih rešitev.
- Uporabniki vse bolj iščejo:
  - centraliziran pregled naročnin,
  - opozorila pred obnovitvami,
  - pomoč pri preklicu,
  - priporočila za cenejše ali brezplačne alternative.

### Zakaj je problem tržno zanimiv
- Naročniški modeli se hitro širijo, kompleksnost upravljanja pa raste.
- Uporabniki so vse bolj cenovno občutljivi in iščejo načine za optimizacijo stroškov.
- Rešitve, ki prihranijo denar in čas, imajo visoko dodano vrednost in velik potencial za dolgoročno uporabo.

---

## 6. Monetizacija

SubReminder uporablja preprost in uporabniku prijazen monetizacijski model, ki temelji na kombinaciji **freemium pristopa** in **enkratnega plačila za polni dostop**.

### Freemium model
- **Brezplačna različica** omogoča osnovno funkcionalnost:
  - omejeno število naročnin,
  - osnovni pregled stroškov,
  - e-mail opozorila pred obnovitvami.

- **Premium naročnina** (približno **2 USD na mesec**) vključuje:
  - neomejeno število naročnin,
  - napredno analitiko porabe (mesečni trendi, kategorije),
  - pomoč pri preklicu naročnin in zahtevah za vračilo,
  - priporočila za brezplačne ali cenejše alternative aplikacij.

Ta pristop omogoča enostaven vstop za nove uporabnike, hkrati pa ustvarja stabilen ponavljajoč se prihodek.

### Enkratni »lifetime« paket
Poleg mesečne naročnine SubReminder ponuja tudi možnost **enkratnega plačila (lifetime access)** za premium funkcionalnosti. Ta možnost je namenjena uporabnikom, ki ne želijo dodatnih naročnin in želijo dolgoročen dostop brez ponavljajočih se stroškov.

Takšen model je priljubljen pri produktivnih orodjih in predstavlja dodatni vir prihodkov brez povečevanja kompleksnosti sistema.

---

## 7. Konkurenca

Na trgu že obstajajo rešitve, kot so Rocket Money, Truebill, Bobby in DoNotPay. Večina teh orodij omogoča spremljanje naročnin, vendar pogosto zahteva povezavo z bančnimi računi.

SubReminder se razlikuje kot **lahka spletna aplikacija**, ki združuje ročni vnos naročnin, pregledno analitiko, aktivno pomoč pri preklicu naročnin ter priporočila za brezplačne ali cenejše alternative – brez zapletenih finančnih integracij.

---

## 8. Viri

1. **Grand View Research** – *Subscription Economy Market Size, Share & Trends Analysis*  
   (analiza rasti globalnega trga naročniških storitev)

2. **McKinsey & Company** – *The Future of Subscription Business Models*  
   (strateški vpogled v naročniške modele in njihovo širitev)

3. **Deloitte** – *Digital Media Trends Report*  
   (uporaba digitalnih naročnin in vedenje uporabnikov)

4. **C+R Research** – *Subscription Services Survey*  
   (statistike o pozabljenih in neuporabljenih naročninah)

5. **Harvard Business Review** – *The Subscription Economy*  
   (analiza vpliva naročniških modelov na potrošnike in podjetja)

6. **Rocket Companies / Rocket Money** – javno objavljeni podatki o rasti uporabnikov in prihrankih

---
