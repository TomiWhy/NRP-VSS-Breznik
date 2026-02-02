# Vaja 4: UX/UI zasnova aplikacije  
## Aplikacija: **SubReminder**

SubReminder je spletna aplikacija za upravljanje digitalnih naročnin, opozarjanje pred obnovitvami ter pomoč pri preklicu in vračilu kupnine. Poslovni model temelji na **success-based proviziji** – uporabnik plača le, če je refund uspešen.

---

## 1️⃣ Seznam vseh zaslonov aplikacije

Aplikacija vsebuje naslednje zaslone:

1. **Landing page (predstavitvena stran)**
2. **Prijava / Registracija**
3. **Dashboard (nadzorna plošča)**
4. **Seznam naročnin (Subscriptions)**
5. **Dodaj / Uredi naročnino**
6. **Podrobnosti naročnine**
7. **Refund Assistant (zahteva za vračilo ali preklic)**
8. **Refund Confirmation & Fee Breakdown**
9. **Refund History (zgodovina in status refundov)**
10. **Notifications / Renewal reminders**
11. **Settings**
   - General  
   - Billing & Savings  
   - Security  
   - Notifications  

---

## 2️⃣ UX struktura (kaj se dogaja na strani)

### 🟦 Landing Page  
**Glavni namen:**  
Predstavitev aplikacije in razlaga success-based modela (brez naročnine, plačilo samo ob uspehu).

**Uporabnik lahko:**
- klikne **Track My Subscriptions Free** → vodi na registracijo  
- klikne **See How It Works** → razlaga delovanja  
- pregleda success provizijsko lestvico  

**Navigacija vodi na:**  
Prijava / Dashboard (če je uporabnik že prijavljen)

---

### 🟦 Prijava / Registracija  
**Glavni namen:**  
Omogoča dostop do uporabniškega računa.

**Uporabnik lahko:**
- ustvari nov račun  
- se prijavi z obstoječim računom  

**Gumbi vodijo na:**  
Dashboard

---

### 🟦 Dashboard  
**Glavni namen:**  
Centralni pregled vseh naročnin in porabe.

**Uporabnik lahko:**
- vidi skupno mesečno porabo  
- vidi prihajajoče obnovitve  
- vidi “Money Recovered So Far”  
- vidi potencialne prihranke  
- klikne **Add New Subscription**  
- izbere posamezno naročnino  

**Navigacija vodi na:**  
Subscription Details, Add Subscription, Refund Assistant

---

### 🟦 Seznam naročnin  
**Glavni namen:**  
Pregled vseh aktivnih naročnin.

**Uporabnik lahko:**
- filtrira seznam  
- uredi naročnino  
- sproži preklic ali refund  

**Gumbi vodijo na:**  
Podrobnosti naročnine ali Refund Assistant

---

### 🟦 Dodaj / Uredi naročnino  
**Glavni namen:**  
Ročni vnos ali urejanje naročnine.

**Uporabnik lahko vnese:**
- ime storitve  
- kategorijo  
- ceno  
- interval plačila  
- datum obnovitve  

**Gumb:**  
Save → vrne na Dashboard

---

### 🟦 Podrobnosti naročnine  
**Glavni namen:**  
Podrobna analiza ene naročnine.

**Uporabnik vidi:**
- plan  
- ceno in letni strošek  
- graf uporabe (usage frequency)  

**Lahko:**
- prekliče naročnino  
- zahteva refund (success-based)

---

### 🟦 Refund Assistant  
**Glavni namen:**  
Uporabniku pomaga avtomatizirano pripraviti zahtevo za preklic ali refund.

**Uporabnik lahko:**
- izbere “Cancel Subscription” ali “Request Refund”  
- pregleda generirano e-pošto  
- potrdi pošiljanje  

**Naprej vodi na:**  
Refund Confirmation

---

### 🟦 Refund Confirmation & Fee Breakdown  
**Glavni namen:**  
Transparentno prikaže, koliko denarja bo uporabnik obdržal in kolikšna je provizija.

**Uporabnik vidi:**
- ocenjen refund  
- % provizije  
- koliko obdrži  
- koliko zasluži SubReminder  

**Gumbi:**  
Cancel / Proceed with Refund Request

---

### 🟦 Refund History  
**Glavni namen:**  
Spremljanje vseh refund zahtevkov.

**Uporabnik vidi statuse:**  
Sent / Waiting / Approved / Denied

---

### 🟦 Notifications / Renewal reminders  
**Glavni namen:**  
Opozorila o prihajajočih obnovitvah.

**Uporabnik lahko:**
- prekliče naročnino  
- nastavi opomnik za kasneje

---

### 🟦 Settings  
**Glavni namen:**  
Upravljanje računa in nastavitev.

Podstrani:
- **General** – osnovni podatki  
- **Billing & Savings** – statistika uspešnih refundov in provizij  
- **Security** – varnostne nastavitve  
- **Notifications** – nastavitve obvestil  

---

## 3️⃣ UI postavitev (razpored elementov)

### 🖥 Landing Page
- Velik **hero naslov**
- CTA gumbi
- Vizual success-based modela
- Success commission tabela
- Sekcija o zasebnosti
- Footer navigacija

---

### 🖥 Dashboard
- **Naslov:** Dashboard  
- Zgornje kartice: Monthly Spend, Upcoming Renewals, Money Recovered, Potential Savings  
- Gumb: **Add New Subscription**  
- Tabela: **Your Subscriptions**  
- Desni panel: podrobnosti izbrane naročnine

---

### 🖥 Subscription Details
- Naslov naročnine  
- Status badge (Low usage / Active)  
- Graf uporabe  
- Billing details  
- Gumbi: Cancel / Request Refund  

---

### 🖥 Refund Assistant
- Naslov: Refund Assistant  
- Kartica s podatki o naročnini  
- Gumbi: Cancel Subscription / Request Refund  
- Email preview polje  
- Status timeline na desni strani

---

### 🖥 Refund History
- Zgornje statistične kartice (Total Refunded, Pending, Commission Paid)  
- Tabela z zgodovino refundov  
- Filtri in iskanje

---

### 🖥 Settings – Billing & Savings
- Informacijska kartica o success-based modelu  
- Statistika refundov  
- Payment method  
- Tabela “Recent Savings History”

---

## 4️⃣ UX skice / končni design

Končni dizajn je izdelan kot **visoko-zvest (high-fidelity) UI** v modernem SaaS slogu.

**Značilnosti dizajna:**
- kartični layout  
- jasna tipografija  
- barvno kodirani statusi (zelena = uspeh, oranžna = opozorila)  
- poudarek na transparentnosti provizij  

**Ključni zasloni, ki so oblikovani:**
- Landing page  
- Dashboard  
- Subscription detail panel  
- Refund Assistant  
- Refund Confirmation  
- Refund History  
- Settings (Billing & Savings)

Dizajni so priloženi kot vizualni prototipi.

<img width="689" height="1600" alt="screen" src="https://github.com/user-attachments/assets/07fd2e32-b021-4360-8381-240921db139f" />

<img width="1600" height="1370" alt="screen" src="https://github.com/user-attachments/assets/56d96975-834d-49cd-8268-056e0d2012a0" />

<img width="1600" height="1280" alt="screen" src="https://github.com/user-attachments/assets/29edb333-3336-459f-92c1-9daa3f934520" />

<img width="1573" height="1600" alt="screen" src="https://github.com/user-attachments/assets/56673303-c4d3-4662-9a13-a24a74c9a5b5" />

<img width="1600" height="1520" alt="screen" src="https://github.com/user-attachments/assets/8277f2fa-09c4-473a-8c04-957cf4aace19" />



