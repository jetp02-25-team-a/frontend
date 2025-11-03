// types/props.ts

export interface TripCardProps {
  title: string;
  area: string;
  date: string;
  image: string;
}

export interface TripFilterProps {
  selectedArea?: string;
  onFilterChange: (area: string) => void;
}

export interface TripProfileProps {
  name: string;
}
