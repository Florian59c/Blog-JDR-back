export interface LatestContent {
    id: number;
    title: string;
    link: string;
    date: Date;
    type: 'jdr' | 'news' | 'yourHeroStories';
}
