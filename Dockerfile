# Gunakan image Bun resmi
FROM oven/bun:latest

# Set direktori kerja dalam container
WORKDIR /app

# Salin package.json dan bun.lock terlebih dahulu untuk caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Salin seluruh file proyek setelah dependency terinstall
COPY . .

# Generate Prisma Client (Tanpa migrate)
RUN bunx prisma generate

# Buka port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["bun", "run", "dev"]
