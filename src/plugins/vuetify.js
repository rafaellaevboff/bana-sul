import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({ 
    components,
    directives,
    ssr: true,
    theme: {
        defaultTheme: 'myCustomTheme', // Definir o tema padrão
        themes: {
            myCustomTheme: {
                dark: false, // ou true, se preferir o tema escuro
                colors: {
                    primary: '#f9d200',
                    secondary: '#212121',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                },
            },
        },
    }
});

export default vuetify;
