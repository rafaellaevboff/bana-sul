import {format, parseISO} from "date-fns";

export const formatDate = (dateString) => {
    return format(parseISO(dateString), 'dd/MM/yyyy');
};

export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}