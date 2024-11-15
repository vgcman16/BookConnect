import { EventData, Page, NavigationEntry } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';

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
        confirmPassword: '',
        displayName: '',
        isLoading: false,
        errorMessage: '',
        
        async onSignUpTap(args: EventData) {
            try {
                const vm = page.bindingContext;
                
                // Validation
                if (!vm.displayName) {
                    vm.errorMessage = 'Display name is required';
                    return;
                }
                if (!vm.email) {
                    vm.errorMessage = 'Email is required';
                    return;
                }
                if (!vm.password) {
                    vm.errorMessage = 'Password is required';
                    return;
                }
                if (vm.password.length < 6) {
                    vm.errorMessage = 'Password must be at least 6 characters';
                    return;
                }
                if (vm.password !== vm.confirmPassword) {
                    vm.errorMessage = 'Passwords do not match';
                    return;
                }

                vm.isLoading = true;
                vm.errorMessage = '';

                await authService.signUp(vm.email, vm.password, vm.displayName);
                navigateToHome(page);
            } catch (error) {
                console.error('Signup error:', error);
                const vm = page.bindingContext;
                vm.errorMessage = error.message || 'Signup failed';
            } finally {
                const vm = page.bindingContext;
                vm.isLoading = false;
            }
        },

        async onGoogleSignUpTap(args: EventData) {
            try {
                const vm = page.bindingContext;
                vm.isLoading = true;
                vm.errorMessage = '';

                await authService.signInWithGoogle();
                navigateToHome(page);
            } catch (error) {
                console.error('Google signup error:', error);
                const vm = page.bindingContext;
                vm.errorMessage = error.message || 'Google signup failed';
            } finally {
                const vm = page.bindingContext;
                vm.isLoading = false;
            }
        },

        async onFacebookSignUpTap(args: EventData) {
            try {
                const vm = page.bindingContext;
                vm.isLoading = true;
                vm.errorMessage = '';

                await authService.signInWithFacebook();
                navigateToHome(page);
            } catch (error) {
                console.error('Facebook signup error:', error);
                const vm = page.bindingContext;
                vm.errorMessage = error.message || 'Facebook signup failed';
            } finally {
                const vm = page.bindingContext;
                vm.isLoading = false;
            }
        },

        onLoginTap(args: EventData) {
            page.frame.goBack();
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
