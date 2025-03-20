export const voteOptions = [
    { id: 1, text: 'Tệ' },
    { id: 2, text: 'Kém' },
    { id: 3, text: 'Bình thường' },
    { id: 4, text: 'Tốt' },
    { id: 5, text: 'Xuất sắc' },
];

export const cash = "Cash"

export const renderStarFromNumber = (number) => {
    return Array.from({ length: number }, (_, index) => '⭐');
};