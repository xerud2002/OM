# 🚀 Deploy Rapid OferteMutare.ro

## Pasul 1: Conectează-te la VPS

```bash
ssh root@80.96.6.93
```

## Pasul 2: Descarcă și rulează scriptul automat

```bash
cd /tmp
curl -o auto-deploy-vps.sh https://raw.githubusercontent.com/xerud2002/OM/main/auto-deploy-vps.sh
chmod +x auto-deploy-vps.sh
sudo bash auto-deploy-vps.sh
```

**SAU** manual:

```bash
cd /tmp
git clone https://github.com/xerud2002/OM.git
cd OM
chmod +x auto-deploy-vps.sh
sudo bash auto-deploy-vps.sh
```

## Pasul 3: Completează credențialele

Când scriptul oprește la **[12/15]**, deschide alt terminal și editează `.env`:

```bash
ssh root@80.96.6.93
nano /var/www/om/.env
```

### Credențiale necesare:

#### 1. Firebase Admin (obligatoriu)

Mergi la: https://console.firebase.google.com/project/omro-e5a88/settings/serviceaccounts/adminsdk

Click **"Generate new private key"** → Se descarcă un fișier JSON

Din fișierul JSON, copiază:

```
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@omro-e5a88.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXX\n-----END PRIVATE KEY-----\n"
```

**IMPORTANT**: Private key trebuie în ghilimele și cu `\n` păstrate!

#### 2. Resend API (pentru email-uri)

Mergi la: https://resend.com/api-keys

Click **"Create API Key"** → Copiază cheia

```
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXX
```

### Salvează fișierul:

- Apasă `Ctrl + X`
- Apasă `Y`
- Apasă `Enter`

### Revino la terminalul cu scriptul și apasă ENTER

Scriptul va continua automat.

---

## Pasul 4: Configurează SSL (HTTPS)

După ce scriptul se termină:

```bash
certbot --nginx -d ofertemutare.ro -d www.ofertemutare.ro
```

Răspunde:

- Email: `adresa_ta@email.com`
- Terms: `Y`
- Redirect HTTP to HTTPS: `Y` (recomandat)

---

## Pasul 5: Configurează Firebase

Mergi la: https://console.firebase.google.com/project/omro-e5a88/authentication/settings

Scroll la **"Authorized domains"**

Click **"Add domain"** și adaugă:

1. `ofertemutare.ro`
2. `www.ofertemutare.ro`
3. `80.96.6.93`

Click **"Add"** pentru fiecare.

**Fără acest pas, autentificarea NU va funcționa!**

---

## Pasul 6: Testează site-ul

### Test rapid:

```bash
curl http://localhost:3000
```

### Test în browser:

- http://ofertemutare.ro
- https://ofertemutare.ro (după SSL)

### Verifică logs:

```bash
pm2 logs om-app
```

### Rulează teste automate:

```bash
cd /var/www/om
chmod +x post-deployment-test.sh
./post-deployment-test.sh
```

---

## Rezolvare Probleme

### Site-ul nu se încarcă

```bash
# Verifică PM2
pm2 status

# Verifică Nginx
systemctl status nginx
nginx -t

# Restart totul
pm2 restart om-app
systemctl restart nginx
```

### Erori în logs

```bash
# Vezi ultimele 100 linii
pm2 logs om-app --lines 100

# Vezi doar erorile
pm2 logs om-app --err
```

### Autentificare nu funcționează

1. Verifică Firebase authorized domains
2. Verifică `.env` are credențiale corecte
3. Verifică browser console pentru erori

### Build failed

```bash
cd /var/www/om
rm -rf .next node_modules
npm install
npm run build
pm2 restart om-app
```

---

## Comenzi Utile

```bash
# Status aplicație
pm2 status

# Restart aplicație
pm2 restart om-app

# Logs real-time
pm2 logs om-app

# Monitor CPU/Memory
pm2 monit

# Deploy update-uri
cd /var/www/om && ./deploy.sh

# Verifică disk space
df -h

# Verifică memorie
free -m
```

---

## Setup CRON pentru remindere

```bash
crontab -e
```

Adaugă:

```
0 9 * * * curl -X POST http://localhost:3000/api/sendUploadReminders -H "x-api-key: 7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0" >> /var/log/cron-reminders.log 2>&1
```

Salvează: `Ctrl+X`, `Y`, `Enter`

---

## ✅ Checklist Final

- [ ] Script automat rulat cu succes
- [ ] `.env` completat cu toate credențialele
- [ ] Aplicația build fără erori
- [ ] PM2 arată status "online"
- [ ] Nginx pornit și configurat
- [ ] Site accesibil pe http://ofertemutare.ro
- [ ] SSL configurat (https://ofertemutare.ro)
- [ ] Firebase authorized domains adăugate
- [ ] Test autentificare customer funcționează
- [ ] Test autentificare company funcționează
- [ ] CRON configurat pentru remindere
- [ ] Teste automate passed

---

## 🎉 Gata!

Site-ul ar trebui să funcționeze la:

- **https://ofertemutare.ro**
- **https://www.ofertemutare.ro**

Timp total estimat: **30-45 minute**

Dacă întâmpini probleme, verifică:

1. `pm2 logs om-app`
2. `/var/log/nginx/om_error.log`
3. `.env` are toate credențialele
