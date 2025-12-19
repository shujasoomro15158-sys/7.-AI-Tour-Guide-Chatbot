
export interface Attraction {
  name: string;
  description: string;
}

export interface CityInfo {
  cityName: string;
  intro: string;
  attractions: Attraction[];
  travelTip: string;
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  cityData?: CityInfo;
  isLoading?: boolean;
}
