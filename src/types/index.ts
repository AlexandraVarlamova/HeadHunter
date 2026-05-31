


export interface Vacancy {
  id: string;
  name: string;
  employer: {
    name: string;
  };
  area: {
    name: string;
  };
  salary: {
    from: number | null;
    to: number | null;
    currency: string;
  } | null;
  experience: {
    name: string;
  };
  schedule: {
    name: string;
  };
  alternate_url: string;
}

export interface HHResponse {
  items: Vacancy[];
  pages: number;
  page: number;
  per_page: number;
  found: number;

}


