export interface LatestContent {
    uid: string;
    id: number;
    title: string;
    date: Date;
    page_name: 'Nouvelle' | 'JDR' | 'Histoire dont vous êtes le héros';
    page_link: 'jdr' | 'news' | 'yourHeroStories';
}