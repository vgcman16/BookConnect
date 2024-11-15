import { EventData, Page, NavigationEntry } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { showToast } from '../../utils/ui-helper';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const authService = AuthService.getInstance();
    
    // If user is already authenticated, navigate to home
    if (authService.isAuthenticated()) {
        navigateToHome(page);
        return;
    }
    
    const viewModel = {
        email: '',
        password: '',
        isLoading: false,
        errorMessage: '',
        
        async onLoginTap(args: EventData) {
            try {
                const vm = page.bindingContext;
                if (!vm.email || !vm.password) {
                    vm.errorMessage = 'Please enter both email and password';
                    return;
                }

                vm.isLoading = true;
                vm.errorMessage = '';

                await authService.signIn(vm.email, vm.password);
                navigateToHome(page);
            } catch (error) {
                console.error('Login error:', error);
                const vm = page.bindingContext;
                vm.errorMessage = error.message || 'Login failed';
            } finally {
                const vm = page.bindingContext;
                vm.isLoading = false;
            }
        },

        onGoogleLoginTap(args: EventData) {
            showToast('Google Sign In - Coming Soon!');
        },

        onFacebookLoginTap(args: EventData) {
            showToast('Facebook Sign In - Coming Soon!');
        },

        onSignUpTap(args: EventData) {
            const navigationEntry: NavigationEntry = {
                moduleName: 'views/auth/signup.view',
                clearHistory: false,
                animated: true,
                transition: {
                    name: 'slide',
                    duration: 200,
                    curve: 'ease'
                }
            };
            page.frame.navigate(navigationEntry);
        },

        onForgotPasswordTap(args: EventData) {
            showToast('Password Reset - Coming Soon!');
        }
    };

    page.bindingContext = viewModel;
}

function navigateToHome(page: Page) {
    const navigationEntry: NavigationEntry = {
        moduleName: 'views/home/home.view',
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
