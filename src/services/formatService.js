import {format, parseISO} from "date-fns";

export const formatDate = (dateString) => {
    return format(parseISO(dateString), 'dd/MM/yyyy');
}

export const restrictToInteger = () => {
    if (
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key) &&
        !/^\d$/.test(event.key)
    ) {
        event.preventDefault();
    }
};