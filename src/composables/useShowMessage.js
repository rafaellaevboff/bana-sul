import {ref} from 'vue';

export function useShowMessage() {
    const message = ref('');
    const color = ref('');
    const snackbar = ref(false);

    const showMessage = (msg, colorFeedback) => {
        message.value = msg;
        color.value = colorFeedback;
        snackbar.value = true;
    };

    return {
        message,
        color,
        snackbar,
        showMessage
    };
}
