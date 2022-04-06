export const parseDate = (dateReceiveTimestamp: number) => {
    const dateReceive = new Date(dateReceiveTimestamp);
    const parsedDate = dateReceive.getDate().toString() + "." + dateReceive.getMonth().toString() + "." + dateReceive.getFullYear() +
                        " " + dateReceive.getHours() + ":" + dateReceive.getMinutes();
    
    return parsedDate;
}