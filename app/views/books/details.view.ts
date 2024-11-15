import { EventData, Page, NavigationEntry } from '@nativescript/core';
import { GoogleBooksService, GoogleBook } from '../../services/google-books.service';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const googleBooksService = GoogleBooksService.getInstance();
    
    const viewModel = {
        book: null,
        isLoading: true,
        errorMessage: '',

        async loadBook() {
            try {
                const bookId = page.navigationContext.bookId;
                if (!bookId) {
                    throw new Error('No book ID provided');
                }

                const vm = page.bindingContext;
                vm.isLoading = true;
                vm.errorMessage = '';

                const book = await googleBooksService.getBookById(bookId);
                vm.book = book;
            } catch (error) {
                console.error('Error loading book:', error);
                const vm = page.bindingContext;
                vm.errorMessage = error.message || 'Failed to load book details';
            } finally {
                const vm = page.bindingContext;
                vm.isLoading = false;
            }
        },

        getBookThumbnail(book: GoogleBook): string {
            return book?.volumeInfo?.imageLinks?.thumbnail || 
                   book?.volumeInfo?.imageLinks?.smallThumbnail || 
                   '~/assets/images/book-placeholder.png';
        },

        getBookAuthors(book: GoogleBook): string {
            return book?.volumeInfo?.authors?.join(', ') || 'Unknown Author';
        },

        getBookCategories(book: GoogleBook): string {
            return book?.volumeInfo?.categories?.join(', ') || 'Uncategorized';
        },

        onAddToLibraryTap(args: EventData) {
            // TODO: Implement add to library functionality
            console.log('Add to library tapped');
        },

        onWriteReviewTap(args: EventData) {
            // TODO: Implement write review functionality
            console.log('Write review tapped');
        },

        onShareTap(args: EventData) {
            // TODO: Implement share functionality
            console.log('Share tapped');
        }
    };

    page.bindingContext = viewModel;
    viewModel.loadBook();
}
