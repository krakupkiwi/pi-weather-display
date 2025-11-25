# Pi Weather Display

A sleek, modern weather and clock display designed for Raspberry Pi 3 with a 5-inch touchscreen. Built with React and TypeScript, featuring auto day/night themes, weather forecasts, tide information, and fishing conditions.

## Features

- **Real-time Clock** - Large, easy-to-read time and date display
- **Current Weather** - Temperature, conditions, humidity, and wind speed
- **7-Day Forecast** - Week-ahead weather predictions
- **Tide Information** - Daily high and low tides (NOAA data)
- **Fishing Forecast** - Conditions rating based on weather, tides, and moon phase
- **Auto Day/Night Theme** - Switches between light and dark themes based on time
- **Touch Interactions** - Tap to switch between main and tide views
- **Smooth Animations** - Framer Motion for polished transitions
- **Optimized for 5-inch Display** - Perfect for 800x480 resolution

## Prerequisites

- Raspberry Pi 3 (or newer)
- 5-inch touchscreen display (800x480 recommended)
- Node.js 18+ and npm
- OpenWeatherMap API key (free tier)

## Setup Instructions

### 1. Get API Keys

**OpenWeatherMap API:**
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Navigate to API keys section
4. Copy your API key

**Find Your Coordinates:**
1. Go to https://www.latlong.net/
2. Search for your location
3. Note your latitude and longitude

**Find Tide Station (optional):**
1. Go to https://tidesandcurrents.noaa.gov/
2. Search for your nearest tide station
3. Note the Station ID

### 2. Install on Raspberry Pi

```bash
# Clone or copy the project to your Raspberry Pi
cd ~/
git clone <your-repo-url> pi-weather-display
cd pi-weather-display

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your API key and location
nano .env
```

Update `.env` with your information:
```env
VITE_OPENWEATHER_API_KEY=your_actual_api_key
VITE_LATITUDE=your_latitude
VITE_LONGITUDE=your_longitude
VITE_TIDE_STATION=your_tide_station_id
```

### 3. Build the Application

```bash
npm run build
```

### 4. Install and Configure Chromium for Fullscreen

```bash
# Install Chromium browser
sudo apt-get update
sudo apt-get install -y chromium-browser unclutter

# Install a simple HTTP server
npm install -g serve
```

### 5. Create Auto-Start Script

Create a startup script:

```bash
nano ~/start-weather-display.sh
```

Add the following content:

```bash
#!/bin/bash

# Hide mouse cursor
unclutter -idle 0 &

# Start the web server
cd ~/pi-weather-display
serve -s dist -l 3000 &

# Wait for server to start
sleep 5

# Start Chromium in kiosk mode
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-restore-session-state \
  --app=http://localhost:3000 \
  --touch-events=enabled \
  --disable-pinch \
  --overscroll-history-navigation=0
```

Make it executable:

```bash
chmod +x ~/start-weather-display.sh
```

### 6. Configure Auto-Start on Boot

Edit the autostart file:

```bash
mkdir -p ~/.config/lxsession/LXDE-pi
nano ~/.config/lxsession/LXDE-pi/autostart
```

Add these lines:

```
@xset s off
@xset -dpms
@xset s noblank
@/home/pi/start-weather-display.sh
```

### 7. Disable Screen Blanking (Optional)

Edit the lightdm configuration:

```bash
sudo nano /etc/lightdm/lightdm.conf
```

Find the `[Seat:*]` section and add:

```
xserver-command=X -s 0 -dpms
```

### 8. Reboot

```bash
sudo reboot
```

The display should start automatically in fullscreen mode!

## Development

To run in development mode on your computer:

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Add your API keys to .env
nano .env

# Start development server
npm run dev
```

Visit http://localhost:5173 in your browser.

## Project Structure

```
pi-weather-display/
├── src/
│   ├── components/           # React components
│   │   ├── Clock.tsx         # Time and date display
│   │   ├── CurrentWeather.tsx # Current conditions
│   │   ├── WeeklyForecast.tsx # 7-day forecast
│   │   ├── Tides.tsx         # Tide information
│   │   └── FishingConditions.tsx # Fishing forecast
│   ├── hooks/                # Custom React hooks
│   │   ├── useWeather.ts     # Weather API integration
│   │   ├── useTides.ts       # Tide API integration
│   │   └── useFishingConditions.ts # Fishing logic
│   ├── ThemeContext.tsx      # Day/night theme provider
│   ├── types.ts              # TypeScript interfaces
│   ├── App.tsx               # Main app component
│   ├── App.css               # Styles
│   └── main.tsx              # Entry point
├── .env.example              # Environment variables template
├── package.json              # Dependencies
└── README.md                 # This file
```

## Customization

### Change Theme Colors

Edit `src/App.css` and modify the gradient backgrounds:

```css
.app.light {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app.dark {
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
}
```

### Adjust Day/Night Transition Time

Edit `src/ThemeContext.tsx` and modify the hour check:

```typescript
const newTheme: Theme = hour >= 6 && hour < 18 ? 'light' : 'dark';
```

### Change Update Intervals

- Weather: `src/hooks/useWeather.ts` (default: 10 minutes)
- Tides: `src/hooks/useTides.ts` (default: 1 hour)
- Theme: `src/ThemeContext.tsx` (default: 1 minute)

### Temperature Units

The weather API is set to imperial (Fahrenheit) by default. To change to metric (Celsius), edit `src/hooks/useWeather.ts`:

```typescript
units=metric  // Change from units=imperial
```

## Troubleshooting

**Weather not loading:**
- Check your API key in `.env`
- Verify your coordinates are correct
- Check internet connection
- OpenWeatherMap free tier may have delays

**Tides not showing:**
- Verify your NOAA station ID is correct
- Some areas don't have tide data available
- Check if you're near a coastal area

**Screen not turning off:**
- Verify the autostart configuration
- Check lightdm.conf settings
- Some displays may need additional configuration

**Touch not working:**
- Ensure your display drivers are installed
- Check if touch is enabled in Raspberry Pi config

## APIs Used

- **OpenWeatherMap** - Weather data (https://openweathermap.org/api)
- **NOAA Tides & Currents** - Tide predictions (https://tidesandcurrents.noaa.gov/)

## License

MIT License - feel free to use and modify for your own projects!

## Credits

Built with:
- React + TypeScript
- Vite
- Framer Motion
- date-fns
- Lucide React Icons
