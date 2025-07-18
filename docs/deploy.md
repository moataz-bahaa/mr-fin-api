# 🚀 Deploy Node.js + Express + Prisma + MySQL App on Ubuntu VPS

This guide walks you through deploying The Node.js + Express + MySQL app using **Prisma** ORM on a **Ubuntu VPS**, using **Node.js v20.14** and **pnpm v10.4.1**.

---

## 📋 Prerequisites

- Ubuntu 20.04+ VPS
- Node.js v20.14 installed
- MySQL database (local or remote)
- Your app using `pnpm` and `Prisma`
- SSH access to the server
- Optional: domain name for HTTPS setup

---

## 🛠️ 1. SSH into Your Server

```bash
ssh your-user@your-server-ip
````

---

## ⚙️ 2. Install System Dependencies

### Update system packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js v20.14

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install pnpm via npm

```bash
npm i -g pnpm
```

Check versions:

```bash
node -v   # should be v20.14.x
pnpm -v   # should be v10.4.1
```

---

## 🗃️ 3. Install MySQL

```bash
sudo apt install mysql-server
sudo mysql_secure_installation
```

---

## 📦 4. Upload Your App

Upload your project folder to the VPS:

```bash
scp -r ./mr-fin-api-folder your-user@your-server-ip:/home/your-user/
```

Or clone it from Git:

```bash
git clone https://github.com/your/repo.git
cd mr-fin-api-folder
```

---

## 🧪 5. Configure Environment

In your project folder:

```bash
cp .env.example .env
nano .env
```

Update your environment variables:

---

## 📥 6. Install App Dependencies

```bash
pnpm install
```

---

## 🧱 7. Set Up Prisma

Run migrations and generate Prisma client:

```bash
pnpm prisma db push
```

---

## 🔍 8. Test the App

```bash
pnpm run dev   # or your production command like `pnpm start`
```

Test it at: `http://your-server-ip:3000`

---

## 🔄 9. Use PM2 to Keep App Running

Install PM2:

```bash
pnpm add -g pm2
```

Start your app:

```bash
pnpm build # bulid the production app
pm2 start pnpm --name "mr-fin-api-name" -- start
```

Save the process and enable auto-start on reboot:

```bash
pm2 save
pm2 startup
```

---

## 🌍 10. (Optional) Set Up Nginx + SSL

### Install Nginx if not already installed

```bash
sudo apt install nginx
```

### Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/mr-fin-api
```

Paste this:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;  # or your actual app port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/mr-fin-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Add HTTPS (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔁 11. Auto-Start on Reboot

```bash
pm2 startup
pm2 save
```

---

## 📦 Useful PM2 Commands

```bash
pm2 list          # Show running apps
pm2 logs          # Tail logs
pm2 restart all   # Restart apps
pm2 stop all      # Stop all apps
```

---

## ✅ Done!

Your app should now be:

* Running persistently via PM2
* Using Prisma with your MySQL DB
* Accessible via IP or domain name
* Secured with HTTPS (if configured)
