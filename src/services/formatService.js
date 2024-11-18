import {format, parseISO} from "date-fns";

export const formatDate = (dateString) => {
    return format(parseISO(dateString), 'dd/MM/yyyy');
};
