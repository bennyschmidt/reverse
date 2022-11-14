export const sortByDate = array => {
  return array.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateA < dateB
      ? 1
      : dateA > dateB
        ? -1
        : 0;
  });
};
