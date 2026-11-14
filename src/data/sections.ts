export interface SectionItem {
  id: string
  label: string
  number: string
  index: number
}

export const SECTIONS: SectionItem[] = [
  { id: 'hero', label: 'Home', number: '01', index: 1 },
  { id: 'about', label: 'About', number: '02', index: 2 },
  { id: 'projects', label: 'Work', number: '03', index: 3 },
  { id: 'skills', label: 'Skills', number: '04', index: 4 },
  { id: 'experience', label: 'Experience', number: '05', index: 5 },
  { id: 'contact', label: 'Contact', number: '06', index: 6 },
]
