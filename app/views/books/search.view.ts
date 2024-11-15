import { EventData, Page, SearchBar, ListView, ItemEventData } from '@nativescript/core';
import { GoogleBooksService, GoogleBook } from '../../services/google-books.service';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const googleBooksService = GoogleBooksService.getInstance();
    
    const viewModel = {
        isLoading: false,
        searchQuery: '',
        books: [],
        noResults: false,
        errorMessage: '',

        async onSearchSubmit(args: EventData) {
            try {
                const searchBar = <SearchBar>args.object;
                const query = searchBar.text;

                if (!query || query.trim().length === 0) {
                    return;
                }

                const vm = page.bindingContext;
                vm.isLoading = true;
                vm.errorMessage = '';
                vm.noResults = false;

                const result = await googleBooksService.searchBooks(query, {
                    maxResults: 20,
                    orderBy: 'relevance'
                });

                vm.books = result.items;
                vm.noResults = result.items.length === 0;
            } catch (error) {
                console.error('Search error:', error);
                const vm = page.bindingContext;
                vm.errorMessage = 'Failed to search books';
                vm.books = [];
            } finally {
                const vm = page.bindingContext;
                vm.isLoading = false;
            }
        },

        onSearchClear() {
            const vm = page.bindingContext;
            vm.books = [];
            vm.noResults = false;
            vm.errorMessage = '';
        },

        onBookTap(args: ItemEventData) {
            const book = this.books[args.index];
            page.frame.navigate({
                moduleName: 'views/books/details.view',
                context: { bookId: book.id },
                animated: true,
                transition: {
                    name: 'slide',
                    duration: 200,
                    curve: 'ease'
                }
            });
        },

        getBookThumbnail(book: GoogleBook): string {
            return book.volumeInfo.imageLinks?.thumbnail || 
                   book.volumeInfo.imageLinks?.smallThumbnail || 
                   '~/assets/images/book-placeholder.png';
        },

        getBookAuthors(book: GoogleBook): string {
            return book.volumeInfo.authors?.join(', ') || 'Unknown Author';
        }
    };

    page.bindingContext = viewModel;
}
