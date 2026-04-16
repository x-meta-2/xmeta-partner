export interface Country {
  alpha2: string;
  code: string;
  dialCode: string;
  emoji: string;
  formFields: CountryFormFields;
  isEnabled: number;
  name: string;
  order: number;
  region: string;
  subRegion: string;
}

type CountryFormFields = {
  SK: string;
  TableName: string;
  PK: string;
};
