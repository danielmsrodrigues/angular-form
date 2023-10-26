interface City {
  id: number;
  name: string;
}

export interface Country {
  id: string;
  name: string;
  city: City[];
}
