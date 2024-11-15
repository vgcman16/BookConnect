import { Observable } from '@nativescript/core/data/observable';
import { Http, HttpResponse } from '@nativescript/core';

export interface GoogleBook {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        publishedDate?: string;
        publisher?: string;
        categories?: string[];
        imageLinks?: {
            thumbnail?: string;
            smallThumbnail?: string;
        };
        pageCount?: number;
        language?: string;
        averageRating?: number;
        ratingsCount?: number;
        industryIdentifiers?: Array<{
            type: string;
            identifier: string;
        }>;
    };
}

export class GoogleBooksService extends Observable {
    private static instance: GoogleBooksService;
    private readonly API_BASE_URL = 'https://www.googleapis.com/books/v1';
    private readonly API_KEY = ''; // TODO: Add your Google Books API key

    private constructor() {
        super();
    }

    public static getInstance(): GoogleBooksService {
        if (!GoogleBooksService.instance) {
            GoogleBooksService.instance = new GoogleBooksService();
        }
        return GoogleBooksService.instance;
    }

    async searchBooks(query: string, options: {
        startIndex?: number;
        maxResults?: number;
        orderBy?: 'relevance' | 'newest';
        langRestrict?: string;
    } = {}): Promise<{ items: GoogleBook[]; totalItems: number }> {
        try {
            const params = new URLSearchParams({
                q: query,
                startIndex: (options.startIndex || 0).toString(),
                maxResults: (options.maxResults || 10).toString(),
                orderBy: options.orderBy || 'relevance',
                langRestrict: options.langRestrict || 'en',
                key: this.API_KEY
            });

            const response: HttpResponse = await Http.request({
                url: `${this.API_BASE_URL}/volumes?${params.toString()}`,
                method: 'GET'
            });

            if (!response.content) {
                throw new Error('No content in response');
            }

            const data = response.content.toJSON();
            return {
                items: data.items || [],
                totalItems: data.totalItems || 0
            };
        } catch (error) {
            console.error('Error searching books:', error);
            throw new Error('Failed to search books');
        }
    }

    async getBookById(bookId: string): Promise<GoogleBook> {
        try {
            const response: HttpResponse = await Http.request({
                url: `${this.API_BASE_URL}/volumes/${bookId}?key=${this.API_KEY}`,
                method: 'GET'
            });

            if (!response.content) {
                throw new Error('No content in response');
            }

            return response.content.toJSON();
        } catch (error) {
            console.error('Error fetching book:', error);
            throw new Error('Failed to fetch book details');
        }
    }

    async getBooksByISBN(isbn: string): Promise<GoogleBook[]> {
        try {
            const response: HttpResponse = await Http.request({
                url: `${this.API_BASE_URL}/volumes?q=isbn:${isbn}&key=${this.API_KEY}`,
                method: 'GET'
            });

            if (!response.content) {
                throw new Error('No content in response');
            }

            const data = response.content.toJSON();
            return data.items || [];
        } catch (error) {
            console.error('Error fetching book by ISBN:', error);
            throw new Error('Failed to fetch book by ISBN');
        }
    }

    async getBooksByAuthor(author: string): Promise<GoogleBook[]> {
        try {
            const response: HttpResponse = await Http.request({
                url: `${this.API_BASE_URL}/volumes?q=inauthor:"${author}"&key=${this.API_KEY}`,
                method: 'GET'
            });

            if (!response.content) {
                throw new Error('No content in response');
            }

            const data = response.content.toJSON();
            return data.items || [];
        } catch (error) {
            console.error('Error fetching books by author:', error);
            throw new Error('Failed to fetch books by author');
        }
    }

    async getBooksByCategory(category: string): Promise<GoogleBook[]> {
        try {
            const response: HttpResponse = await Http.request({
                url: `${this.API_BASE_URL}/volumes?q=subject:"${category}"&key=${this.API_KEY}`,
                method: 'GET'
            });

            if (!response.content) {
                throw new Error('No content in response');
            }

            const data = response.content.toJSON();
            return data.items || [];
        } catch (error) {
            console.error('Error fetching books by category:', error);
            throw new Error('Failed to fetch books by category');
        }
    }
}
