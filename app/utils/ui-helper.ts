import { Application, Utils } from '@nativescript/core';
import { isIOS } from '@nativescript/core/platform';

export function showToast(message: string, duration: 'short' | 'long' = 'short') {
    if (isIOS) {
        const alert = UIAlertController.alertControllerWithTitleMessagePreferredStyle(
            null, 
            message, 
            UIAlertControllerStyle.Alert
        );
        
        const duration = Utils.ios.MajorVersion >= 13 ? 1.5 : 1;
        const window = UIApplication.sharedApplication.keyWindow;
        window.rootViewController.presentViewControllerAnimatedCompletion(
            alert, 
            true, 
            () => {
                setTimeout(() => {
                    alert.dismissViewControllerAnimatedCompletion(true, null);
                }, duration * 1000);
            }
        );
    } else {
        const context = Application.android.foregroundActivity || Application.android.startActivity;
        const toast = android.widget.Toast.makeText(
            context,
            message,
            duration === 'short' ? android.widget.Toast.LENGTH_SHORT : android.widget.Toast.LENGTH_LONG
        );
        toast.show();
    }
}
