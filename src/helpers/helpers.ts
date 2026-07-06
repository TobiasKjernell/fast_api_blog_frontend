export const formatDate = (iso: string) => 
    new Intl.DateTimeFormat('en-US', { dateStyle: 'medium'}).format(new Date(iso))