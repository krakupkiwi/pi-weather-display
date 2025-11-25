export interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    wind_speed: number;
  };
  daily: DailyWeather[];
}

export interface DailyWeather {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  pop: number;
}

export interface TideData {
  date: string;
  tides: {
    time: string;
    type: 'high' | 'low';
    height: number;
  }[];
}

export interface FishingConditions {
  rating: 'poor' | 'fair' | 'good' | 'excellent';
  factors: {
    moon: string;
    barometer: string;
    tides: string;
    weather: string;
  };
}

export type Theme = 'light' | 'dark';
