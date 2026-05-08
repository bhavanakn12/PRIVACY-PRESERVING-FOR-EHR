module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",    // deep blue
        accent: "#10b981",     // green
        warn: "#f59e42",       // orange
        info: "#64748b",       // slate
        highlight: "#f472b6",  // pink
      },
    },
  },
  plugins: [],
}
