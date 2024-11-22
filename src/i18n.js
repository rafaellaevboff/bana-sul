import { createI18n } from 'vue-i18n';

const messages = {
    pt: {
        harvest: 'Colheita',
        payment : 'Pagamento',
        agriculturalInput: 'Compra de insumo'
    },
};

const i18n = createI18n({
    locale: 'pt',
    messages,
});

export default i18n;
