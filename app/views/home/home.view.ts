import { EventData, Page, NavigationEntry } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const authService = AuthService.getInstance();
    
    const viewModel = {
        user: authService.currentUser,
        
        async onLogoutTap(args: EventData) {
            try {
                await authService.signOut();
                navigateToLogin(page);
            } catch (error) {
                console.error('Logout error:', error);
                // Navigate to login anyway since we've cleared local auth data
                navigateToLogin(page);
            }
        },
        
        onProfileTap(args: EventData) {
            const navigationEntry: NavigationEntry = {
                moduleName: 'views/profile/profile.view',
                clearHistory: false,
                animated: true,
                transition: {
                    name: 'slide',
                    duration: 200,
                    curve: 'ease'
                }
            };
            page.frame.navigate(navigationEntry);
        }
    };

    page.bindingContext = viewModel;
}

function navigateToLogin(page: Page) {
    const navigationEntry: NavigationEntry = {
        moduleName: 'views/auth/login.view',
        clearHistory: true,
        animated: true,
        transition: {
            name: 'fade',
            duration: 200,
            curve: 'ease'
        }
    };
    page.frame.navigate(navigationEntry);
}
